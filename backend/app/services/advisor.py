from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import models
from app.services.intelligence import IntelligenceService

class AdvisorService:
    @staticmethod
    def generate_negotiation_proposal(conflict_id: str, db: Session) -> Dict[str, Any]:
        """
        Generate a compromise proposal for a detected conflict.
        """
        conflict = db.query(models.Conflict).filter(models.Conflict.id == conflict_id).first()
        if not conflict:
            return {"error": "Conflict not found"}
            
        req_a = db.query(models.Requirement).filter(models.Requirement.id == conflict.req_a_id).first()
        req_b = db.query(models.Requirement).filter(models.Requirement.id == conflict.req_b_id).first()
        
        # Heuristic-based proposals
        # If conflict is about 'Priority' or 'Timeline'
        if "time" in str(conflict.resolution_summary).lower() or conflict.conflict_type == "timeline":
             return {
                 "proposal": "Implement Phase 1 in Q3, and Phase 2 in Q4.",
                 "rationale": "Balancing urgent delivery with resource constraints.",
                 "impact_on_alignment": "+15%"
             }
             
        return {
            "proposal": "Adopt a hybrid architecture that integrates both Stakeholder preferences.",
            "rationale": "Ensures all non-functional requirements are met without compromising performance.",
            "impact_on_alignment": "+10%"
        }

    @staticmethod
    def simulate_change_impact(requirement_id: str, field: str, new_value: Any, db: Session) -> Dict[str, Any]:
        """
        Simulate the impact of changing a requirement.
        """
        req = db.query(models.Requirement).filter(models.Requirement.id == requirement_id).first()
        if not req:
            return {"error": "Requirement not found"}
            
        # 1. Identify direct descendants (simplified for now - based on tags or category)
        dependents = db.query(models.Requirement).filter(
            models.Requirement.project_id == req.project_id,
            models.Requirement.category == req.category,
            models.Requirement.id != req.id
        ).limit(3).all()
        
        # 2. Estimate Risk Increase
        risk_increase = 0.0
        if field == "priority_score" and float(new_value) < req.priority_score:
            risk_increase = 12.5 # Arbitrary weight for demonstration
            
        return {
            "requirement": req.text[:50] + "...",
            "change": f"{field} -> {new_value}",
            "affected_count": len(dependents),
            "estimated_risk_delta": f"+{risk_increase}%",
            "ripple_effect": [r.text[:40] + "..." for r in dependents],
            "recommendation": "High risk change. Review with Technical Lead before committing." if risk_increase > 10 else "Safe to proceed."
        }
