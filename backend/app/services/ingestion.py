from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import models
from app.services.ai_pipeline import ai_processor
from .connectors.slack import SlackConnector
from .connectors.gmail import GmailConnector
from uuid import UUID

class IngestionService:
    @staticmethod
    async def ingest_from_channel(
        project_id: UUID, 
        channel_type: str, 
        config: Dict[str, Any], 
        db: Session
    ) -> Dict[str, Any]:
        """
        Orchestrate data fetching, parsing, and AI processing from a specific channel.
        """
        # 1. Initialize appropriate connector
        if channel_type == "slack":
            connector = SlackConnector(token=config.get("token"))
            raw_data = await connector.fetch_data(channel_id=config.get("channel_id"))
        elif channel_type == "gmail":
            connector = GmailConnector(credentials=config.get("credentials"))
            raw_data = await connector.fetch_data(query=config.get("query"))
        else:
            return {"error": "Unsupported channel type"}

        # 2. Parse into text chunks
        texts = connector.parse_data(raw_data)
        combined_text = "\n".join(texts)

        # 3. Extract requirements via AI
        extracted_reqs = await ai_processor.extract_requirements(combined_text)

        # 4. Store in DB
        db_reqs = []
        for req_data in extracted_reqs:
            db_req = models.Requirement(
                project_id=project_id,
                text=req_data["text"],
                category=req_data["category"],
                priority_score=req_data["priority_score"],
                sentiment_score=req_data["sentiment_score"],
                source_type=channel_type,
                source_ref=f"{channel_type}_import_{len(raw_data)}",
                status="extracted"
            )
            db.add(db_req)
            db_reqs.append(db_req)
        
        db.commit()

        # 5. Detect Conflicts
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
