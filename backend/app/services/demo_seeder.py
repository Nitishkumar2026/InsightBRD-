import asyncio
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session

from app.models import models
from app.services.ai_pipeline import ai_processor

class DemoSeederService:
    """
    Orchestrates full system seeding for demo projects.
    """

    @staticmethod
    async def seed_full_demo(project_id: UUID, dataset_type: str, raw_texts: List[str], db: Session):
        """
        Populates requirements, conflicts, sentiment, and timeline events.
        """
        print(f"🌱 Starting full demo seeding for project {project_id} using {dataset_type}...")
        
        # 1. Process Requirements (Level 1) - Parallelized for speed
        db_reqs = []
        chunks_to_process = raw_texts[:5] # Reduced for reliable performance
        
        print(f"📝 Extracting requirements from {len(chunks_to_process)} chunks...")
        tasks = [ai_processor.extract_requirements(chunk) for chunk in chunks_to_process]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for i, extracted in enumerate(results):
            if isinstance(extracted, Exception):
                print(f"⚠️ Chunk {i} failed: {extracted}")
                continue
                
            if extracted:
                for req_data in extracted:
                    db_req = models.Requirement(
                        project_id=project_id,
                        text=req_data["text"],
                        category=req_data["category"],
                        priority_score=req_data["priority_score"],
                        sentiment_score=req_data["sentiment_score"],
                        source_type=dataset_type,
                        status="analyzed",
                        created_at=datetime.utcnow() - timedelta(days=random.randint(2, 30))
                    )
                    db.add(db_req)
                    db_reqs.append(db_req)
        
        db.commit()
        print(f"✅ Extracted {len(db_reqs)} requirements.")

        # 2. Simulate Timeline Evolution (Level 2)
        if db_reqs:
            base_req = db_reqs[0]
            for i in range(2):
                revision = models.RequirementRevision(
                    requirement_id=base_req.id,
                    old_text=base_req.text if i == 0 else f"Revision {i} text",
                    new_text=f"Refined {dataset_type.upper()} requirement v{i+1}",
                    reason="Neural refinement based on context",
                    created_at=datetime.utcnow() - timedelta(days=random.randint(1, 5))
                )
                db.add(revision)

        # 3. Detect Conflicts (Level 3)
        print("⚔️ Detecting conflicts...")
        conflicts = await ai_processor.detect_conflicts([{"text": r.text} for r in db_reqs])
        for conf_data in conflicts:
            db_conf = models.Conflict(
                project_id=project_id,
                conflict_type=conf_data["conflict_type"],
                severity_score=conf_data["severity_score"],
                resolution_summary=conf_data["resolution_summary"],
                is_resolved=False,
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 10))
            )
            db.add(db_conf)

        db.commit()
        print(f"🏁 Seeding complete: {len(db_reqs)} Reqs, {len(conflicts)} Conflicts.")
        return {"requirements": len(db_reqs), "conflicts": len(conflicts)}
