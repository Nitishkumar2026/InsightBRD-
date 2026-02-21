from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.db.session import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.post("/", response_model=schemas.Requirement)
def create_requirement(requirement: schemas.RequirementCreate, db: Session = Depends(get_db)):
    db_requirement = models.Requirement(**requirement.model_dump())
    db.add(db_requirement)
    db.commit()
    db.refresh(db_requirement)
    return db_requirement

@router.get("/project/{project_id}", response_model=List[schemas.Requirement])
def read_project_requirements(project_id: UUID, db: Session = Depends(get_db)):
    requirements = db.query(models.Requirement).filter(models.Requirement.project_id == project_id).all()
    return requirements

@router.get("/{requirement_id}", response_model=schemas.Requirement)
def read_requirement(requirement_id: UUID, db: Session = Depends(get_db)):
    requirement = db.query(models.Requirement).filter(models.Requirement.id == requirement_id).first()
    if requirement is None:
        raise HTTPException(status_code=404, detail="Requirement not found")
    return requirement
@router.put("/{requirement_id}", response_model=schemas.Requirement)
def update_requirement(
    requirement_id: UUID, 
    requirement_update: schemas.RequirementUpdate, 
    db: Session = Depends(get_db)
):
    db_requirement = db.query(models.Requirement).filter(models.Requirement.id == requirement_id).first()
    if not db_requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")
        
    update_data = requirement_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        old_val = getattr(db_requirement, field)
        if old_val != value:
            # Log Revision
            revision = models.RequirementRevision(
                requirement_id=requirement_id,
                field_changed=field,
                old_value=str(old_val),
                new_value=str(value),
                # changed_by=current_user.id (Would add this with auth)
            )
            db.add(revision)
            setattr(db_requirement, field, value)
            
    db.commit()
    db.refresh(db_requirement)
    return db_requirement
