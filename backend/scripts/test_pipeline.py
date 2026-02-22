import asyncio
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine, Base
from app.models import models
from app.services.ingestion import IngestionService
import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use a temporary DB for the test to avoid file locks from the live server
TEST_DATABASE_URL = "sqlite:///./insightbrd_test.db"
test_engine = create_engine(TEST_DATABASE_URL)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

async def test_full_pipeline():
    # 1. Ensure DB tables exist
    Base.metadata.create_all(bind=test_engine)
    
    db = TestSessionLocal()
    try:
        # 2. Get or create a test user
        user = db.query(models.User).filter(models.User.email == "test@example.com").first()
        if not user:
            user = models.User(email="test@example.com", hashed_password="fake", full_name="Test User")
            db.add(user)
            db.commit()
            db.refresh(user)

        # 3. Create a test project if none exists
        project = db.query(models.Project).filter(models.Project.name == "Slack Ingest Test").first()
        if not project:
            project = models.Project(
                name="Slack Ingest Test",
                description="Testing live Slack to AI pipeline",
                owner_id=user.id
            )
            db.add(project)
            db.commit()
            db.refresh(project)

        print(f"Starting ingestion for project: {project.name} (ID: {project.id})")

        # 4. Run ingestion
        # Note: We'll use #general (C05HYMMDYQ6)
        result = await IngestionService.ingest_from_channel(
            project_id=project.id,
            channel_type="slack",
            config={"channel_id": "C05HYMMDYQ6"},
            db=db,
            user_id=user.id
        )

        print("\nIngestion Result:")
        print(result)

        # 5. Verify results in DB
        reqs = db.query(models.Requirement).filter(models.Requirement.project_id == project.id).all()
        print(f"\nRequirements found in DB: {len(reqs)}")
        for r in reqs:
            stakeholder = db.query(models.Stakeholder).filter(models.Stakeholder.id == r.stakeholder_id).first()
            s_name = stakeholder.name if stakeholder else "Unknown"
            print(f" - [{s_name}] {r.text[:50]}... (Priority: {r.priority_score})")

        pulses = db.query(models.SentimentPulse).filter(models.SentimentPulse.project_id == project.id).all()
        print(f"\nSentiment Pulses found in DB: {len(pulses)}")

    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
