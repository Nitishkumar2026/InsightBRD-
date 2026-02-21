from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models
from app.services.intelligence import IntelligenceService

router = APIRouter()

@router.get("/{project_id}/summary", response_model=Dict[str, Any])
def get_project_intelligence_summary(
    project_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get aggregated intelligence metrics for a project.
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    sas = IntelligenceService.calculate_alignment_score(project_id, db)
    rsi = IntelligenceService.calculate_stability_index(project_id, db)
    risk = IntelligenceService.get_risk_forecast(project_id, db)
    
    return {
        "alignment_score": round(sas, 1),
        "stability_index": round(rsi, 1),
        "risk_forecast": risk,
        "evolution_summary": "Extracted from 24 stakeholder interactions." # Mock summary
    }

@router.get("/{project_id}/timeline", response_model=Any)
def get_evolution_timeline(
    project_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get chronological requirement evolution data.
    """
    revisions = db.query(models.RequirementRevision).join(models.Requirement).filter(
        models.Requirement.project_id == project_id
    ).order_by(models.RequirementRevision.created_at.desc()).all()
    
    return [
        {
            "id": str(rev.id),
            "requirement_id": str(rev.requirement_id),
            "field": rev.field_changed,
            "old_value": rev.old_value,
            "new_value": rev.new_value,
            "timestamp": rev.created_at.isoformat()
        } for rev in revisions
    ]
