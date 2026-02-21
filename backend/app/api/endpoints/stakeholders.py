from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/{project_id}", response_model=List[schemas.Stakeholder])
def get_stakeholders(
    project_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve project stakeholders.
    """
    stakeholders = db.query(models.Stakeholder).filter(models.Stakeholder.project_id == project_id).all()
    return stakeholders

@router.post("/", response_model=schemas.Stakeholder)
def create_stakeholder(
    *,
    db: Session = Depends(deps.get_db),
    stakeholder_in: schemas.StakeholderCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new stakeholder.
    """
    stakeholder = models.Stakeholder(**stakeholder_in.model_dump())
    db.add(stakeholder)
    db.commit()
    db.refresh(stakeholder)
    return stakeholder

@router.delete("/{stakeholder_id}")
def delete_stakeholder(
    stakeholder_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a stakeholder.
    """
    stakeholder = db.query(models.Stakeholder).filter(models.Stakeholder.id == stakeholder_id).first()
    if not stakeholder:
        raise HTTPException(status_code=404, detail="Stakeholder not found")
    db.delete(stakeholder)
    db.commit()
    return {"status": "success"}
