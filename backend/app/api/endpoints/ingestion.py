from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
import shutil
import os
from app.db.session import get_db
from app.models import models
from app.services.ai_pipeline import ai_processor

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/{project_id}/upload")
async def upload_document(
    project_id: UUID, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    # 1. Verify project exists
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 2. Save file locally (Placeholder for S3)
    file_path = os.path.join(UPLOAD_DIR, f"{project_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 3. Simulate text extraction (Placeholder for actual PDF parsing)
    sample_text = f"Content from uploaded file: {file.filename}. "
    
    # 4. Trigger AI Pipeline
    extracted_reqs = await ai_processor.extract_requirements(sample_text)
    
    # 5. Store extracted requirements in DB
    db_reqs = []
    for req_data in extracted_reqs:
        db_req = models.Requirement(
            project_id=project_id,
            text=req_data["text"],
            category=req_data["category"],
            priority_score=req_data["priority_score"],
            sentiment_score=req_data["sentiment_score"],
            source_type="document",
            source_ref=file.filename,
            status="extracted"
        )
        db.add(db_req)
        db_reqs.append(db_req)
    
    db.commit()

    # 6. Detect Conflicts
    conflicts = await ai_processor.detect_conflicts(extracted_reqs)
    for conf_data in conflicts:
        # In a real scenario, we'd link req_a and req_b
        # Here we just create a record for demonstration
        db_conf = models.Conflict(
            project_id=project_id,
            conflict_type=conf_data["conflict_type"],
            severity_score=conf_data["severity_score"],
            resolution_summary=conf_data["resolution_summary"]
        )
        db.add(db_conf)
    
    db.commit()

from app.services.ingestion import IngestionService
from typing import Dict, Any

@router.post("/{project_id}/channel")
async def ingest_from_channel(
    project_id: UUID,
    channel_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Ingest requirements from a specific external channel (Slack, Gmail).
    """
    result = await IngestionService.ingest_from_channel(
        project_id=project_id,
        channel_type=channel_data.get("type"),
        config=channel_data.get("config", {}),
        db=db
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
