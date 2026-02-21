from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import models
from datetime import datetime, timedelta
import statistics

class IntelligenceService:
    @staticmethod
    def calculate_alignment_score(project_id: str, db: Session) -> float:
        """
        SAS = 100 * (1 - (sum(ConflictWeight * Density) + sum(SentimentVariance)) / TotalReq)
        """
        requirements = db.query(models.Requirement).filter(models.Requirement.project_id == project_id).all()
        if not requirements:
            return 100.0
        
        conflicts = db.query(models.Conflict).filter(models.Conflict.project_id == project_id, models.Conflict.is_resolved == False).all()
        
        total_req_count = len(requirements)
        
        # Conflict component
        conflict_impact = 0.0
        for conflict in conflicts:
            # Gravity = Severity * 1.5 (if multi-stakeholder involved, simplified here)
            conflict_impact += (conflict.severity_score or 0.5) * 1.2
            
        # Sentiment Variance component
        sentiments = [r.sentiment_score for r in requirements]
        sentiment_variance = statistics.variance(sentiments) if len(sentiments) > 1 else 0.0
        
        sas = 100 * (1 - (conflict_impact + (sentiment_variance * 5)) / (total_req_count * 2))
        return max(min(sas, 100.0), 0.0)

    @staticmethod
    def calculate_stability_index(project_id: str, db: Session) -> float:
        """
        Detect scope creep and volatility.
        """
        total_reqs = db.query(models.Requirement).filter(models.Requirement.project_id == project_id).count()
        if total_reqs == 0:
            return 100.0
            
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_changes = db.query(models.RequirementRevision).join(models.Requirement).filter(
            models.Requirement.project_id == project_id,
            models.RequirementRevision.created_at >= thirty_days_ago
        ).count()
        
        # RSI Formula: 1 - (Changes / Total)
        change_ratio = recent_changes / (total_reqs * 5) # Weighted denominator
        rsi = (1 - change_ratio) * 100
        
        return max(min(rsi, 100.0), 0.0)

    @staticmethod
    def get_risk_forecast(project_id: str, db: Session) -> Dict[str, Any]:
        """
        Weighted prediction for project failure/delay.
        """
        sas = IntelligenceService.calculate_alignment_score(project_id, db)
        rsi = IntelligenceService.calculate_stability_index(project_id, db)
        
        # Heuristic: Risk increases if Alignment is low AND Stability is low
        risk_score = ( (100 - sas) * 0.6 ) + ( (100 - rsi) * 0.4 )
        
        status = "Low"
        if risk_score > 60:
            status = "Critical"
        elif risk_score > 30:
            status = "Medium"
            
        return {
            "risk_score": round(risk_score, 1),
            "status": status,
            "indicators": {
                "alignment_risk": "High" if sas < 60 else "Low",
                "volatility_risk": "High" if rsi < 70 else "Low"
            }
        }
