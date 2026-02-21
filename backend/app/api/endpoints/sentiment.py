from typing import Any, List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models

router = APIRouter()

@router.get("/{project_id}", response_model=Dict[str, Any])
def get_sentiment_overview(
    project_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve aggregated sentiment data for a project.
    """
    # In a real app, this would perform a complex aggregation
    # For now, we return structured mock data based on requirements in the DB
    requirements = db.query(models.Requirement).filter(models.Requirement.project_id == project_id).all()
    
    if not requirements:
        return {
            "overall_sentiment": 0.0,
            "channel_breakdown": {
                "gmail": 0.0,
                "slack": 0.0,
                "transcripts": 0.0
            },
            "trend": []
        }
    
    avg_sentiment = sum(r.sentiment_score for r in requirements) / len(requirements)
    
    return {
        "overall_sentiment": round(avg_sentiment, 2),
        "channel_breakdown": {
            "gmail": 0.85,
            "slack": 0.72,
            "transcripts": 0.65
        },
        "trend": [
            {"day": "Mon", "score": 0.6},
            {"day": "Tue", "score": 0.65},
            {"day": "Wed", "score": 0.7},
            {"day": "Thu", "score": 0.75},
            {"day": "Fri", "score": 0.72},
        ]
    }
