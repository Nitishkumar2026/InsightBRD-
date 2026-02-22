import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import uuid4

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.models import models
from app.db.session import Base

# Explicitly point to the backend's DB file
SQLALCHEMY_DATABASE_URL = "sqlite:///./backend/insightbrd.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def setup_base_data():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Create User
        user = models.User(
            id=uuid4(),
            email="demo@insightbrd.ai",
            hashed_password="hashed_password", # Dummy
            full_name="Demo User"
        )
        db.add(user)
        
        # 2. Create Project
        project = models.Project(
            id=uuid4(),
            owner_id=user.id,
            name="Conflict Test Project",
            status="active"
        )
        db.add(project)
        db.commit()
        
        print(f"User and Project created successfully in {SQLALCHEMY_DATABASE_URL}")
        
    finally:
        db.close()

if __name__ == "__main__":
    setup_base_data()
