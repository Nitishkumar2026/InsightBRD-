from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models
from app.services.advisor import AdvisorService

router = APIRouter()

@router.get("/negotiate/{conflict_id}", response_model=Dict[str, Any])
def get_negotiation_proposal(
    conflict_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get an AI-generated compromise proposal for a conflict.
    """
    proposal = AdvisorService.generate_negotiation_proposal(conflict_id, db)
    if "error" in proposal:
        raise HTTPException(status_code=404, detail=proposal["error"])
    return proposal

@router.get("/simulate/{requirement_id}", response_model=Dict[str, Any])
def simulate_change(
    requirement_id: str,
    field: str,
    new_value: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Simulate the impact of a requirement change.
    """
    impact = AdvisorService.simulate_change_impact(requirement_id, field, new_value, db)
    if "error" in impact:
        raise HTTPException(status_code=404, detail=impact["error"])
    return impact
