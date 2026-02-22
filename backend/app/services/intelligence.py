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
    @staticmethod
    def detect_conflicts(project_id: str, db: Session) -> List[models.Conflict]:
        """
        HEURISTIC: Cross-compare requirements to find potential semantic contradictions.
        In a real SaaS, this would use Gemini embeddings + vector similarity.
        """
        # [PROTOTYPE] Keep existing conflicts for demonstration
        # db.query(models.Conflict).filter(
        #     models.Conflict.project_id == project_id,
        #     models.Conflict.is_resolved == False
        # ).delete()

        requirements = db.query(models.Requirement).filter(
            models.Requirement.project_id == project_id
        ).all()

        detected = []
        # Basic quadratic comparison (fine for prototype)
        for i in range(len(requirements)):
            for j in range(i + 1, len(requirements)):
                req_a = requirements[i]
                req_b = requirements[j]

                # Rule 1: Shared category + opposing keywords (Prototype Mock)
                # Example: "fast" vs "thorough/slow" in same category
                is_conflict = False
                severity = 0.5
                conflict_type = "functional"

                # Simulate detection logic (Langchain/Gemini would do this for real)
                # Here we mock it with some simple logic
                low_a = req_a.text.lower()
                low_b = req_b.text.lower()

                if req_a.category == req_b.category and req_a.category is not None:
                    # Timeline conflict detection
                    if "month" in low_a and "month" in low_b:
                        is_conflict = True
                        severity = 0.85
                        conflict_type = "timeline"
                    # Scope conflict detection
                    elif "all" in low_a and "except" in low_b:
                        is_conflict = True
                        severity = 0.7
                        conflict_type = "scope"

                if is_conflict:
                    conflict = models.Conflict(
                        project_id=project_id,
                        req_a_id=req_a.id,
                        req_b_id=req_b.id,
                        conflict_type=conflict_type,
                        severity_score=severity,
                        is_resolved=False
                    )
                    db.add(conflict)
                    detected.append(conflict)
        
        db.commit()
        return detected
