from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import models
from app.services.ai_pipeline import ai_processor
from .connectors.slack import SlackConnector
from .connectors.gmail import GmailConnector
from .connectors.enron import EnronConnector
from .connectors.ami import AMIConnector
from .demo_seeder import DemoSeederService
from uuid import UUID

class IngestionService:
    @staticmethod
    async def ingest_from_channel(
        project_id: UUID, 
        channel_type: str, 
        config: Dict[str, Any], 
        db: Session,
        user_id: Optional[UUID] = None
    ) -> Dict[str, Any]:
        """
        Orchestrate data fetching, parsing, and AI processing from a specific channel.
        Supports full seeding for demo datasets.
        """
        connector = None
        raw_data = []

        # 1. Initialize appropriate connector
        if channel_type == "slack":
            connector = SlackConnector(
                token=config.get("token"),
                user_id=user_id,
                db=db
            )
            raw_data = await connector.fetch_data(channel_id=config.get("channel_id"))
        elif channel_type == "gmail":
            connector = GmailConnector(
                credentials=config.get("credentials"),
                user_id=user_id,
                db=db
            )
            raw_data = await connector.fetch_data(query=config.get("query"))
        elif channel_type == "enron":
            connector = EnronConnector(mode=config.get("mode", "sample"))
            raw_data = await connector.fetch_data(limit=config.get("limit", 100))
        elif channel_type == "ami":
            connector = AMIConnector()
            raw_data = await connector.fetch_data()
        else:
            return {"error": "Unsupported channel type"}

        if not raw_data:
            return {"status": "no_data_found"}

        # 2. Parse into text chunks
        texts = connector.parse_data(raw_data)
        
        # 3. Special handling for demo datasets (Full Seeding)
        if channel_type in ["enron", "ami"]:
            stats = await DemoSeederService.seed_full_demo(
                project_id=project_id,
                dataset_type=channel_type,
                raw_texts=texts,
                db=db
            )
            return {
                "status": "success",
                "channel": channel_type,
                "processed_items": len(raw_data),
                "requirements_extracted": stats["requirements"],
                "conflicts_detected": stats["conflicts"]
            }

        # 4. Standard Flow for Slack/Gmail
        combined_text = "\n".join(texts)
        extracted_reqs = await ai_processor.extract_requirements(combined_text)

        for req_data in extracted_reqs:
            # Resolve Stakeholder (Find or Create)
            stakeholder_id = None
            if req_data.get("stakeholder_name"):
                name = req_data["stakeholder_name"].strip()
                # Simple lookup or create
                stakeholder = db.query(models.Stakeholder).filter(
                    models.Stakeholder.project_id == project_id,
                    models.Stakeholder.name == name
                ).first()
                
                if not stakeholder:
                    stakeholder = models.Stakeholder(
                        project_id=project_id,
                        name=name,
                        role="Unassigned"
                    )
                    db.add(stakeholder)
                    db.flush() # Get the ID
                
                stakeholder_id = stakeholder.id

                # Record Sentiment Pulse
                pulse = models.SentimentPulse(
                    project_id=project_id,
                    stakeholder_id=stakeholder_id,
                    score=req_data.get("sentiment_score", 0.0),
                    comment_snippet=req_data["text"][:100],
                    source_type=channel_type
                )
                db.add(pulse)

            db_req = models.Requirement(
                project_id=project_id,
                stakeholder_id=stakeholder_id,
                text=req_data["text"],
                category=req_data["category"],
                priority_score=req_data["priority_score"],
                sentiment_score=req_data["sentiment_score"],
                source_type=channel_type,
                source_ref=f"{channel_type}_import",
                status="extracted"
            )
            db.add(db_req)
        db.commit()

        conflicts = await ai_processor.detect_conflicts(extracted_reqs)
        for conf_data in conflicts:
            db_conf = models.Conflict(
                project_id=project_id,
                conflict_type=conf_data["conflict_type"],
                severity_score=conf_data["severity_score"],
                resolution_summary=conf_data["resolution_summary"]
            )
            db.add(db_conf)
        db.commit()

        return {
            "channel": channel_type,
            "processed_items": len(raw_data),
            "requirements_extracted": len(extracted_reqs),
            "conflicts_detected": len(conflicts)
        }
