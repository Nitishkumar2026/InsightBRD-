import sys
import os
from unittest.mock import MagicMock

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.services.intelligence import IntelligenceService
from app.models import models

def test_sas_high():
    db = MagicMock()
    reqs = [models.Requirement(sentiment_score=0.8), models.Requirement(sentiment_score=0.7)]
    db.query().filter().all.side_effect = [reqs, []] # Reqs, then Conflicts
    score = IntelligenceService.calculate_alignment_score("id", db)
    print(f"SAS High: {score}")
    assert score > 80

def test_sas_low():
    db = MagicMock()
    reqs = [models.Requirement(sentiment_score=0.8), models.Requirement(sentiment_score=0.7)]
    conflicts = [models.Conflict(severity_score=0.9), models.Conflict(severity_score=0.8)]
    db.query().filter().all.side_effect = [reqs, conflicts]
    score = IntelligenceService.calculate_alignment_score("id", db)
    print(f"SAS Low: {score}")
    assert score < 60

def test_rsi_high():
    db = MagicMock()
    db.query().filter().count.return_value = 5 # Total Reqs
    db.query().join().filter().count.return_value = 0 # Revisions
    score = IntelligenceService.calculate_stability_index("id", db)
    print(f"RSI High: {score}")
    assert score == 100

def test_rsi_low():
    db = MagicMock()
    db.query().filter().count.return_value = 10 
    db.query().join().filter().count.return_value = 20 # High volatility
    score = IntelligenceService.calculate_stability_index("id", db)
    print(f"RSI Low: {score}")
    assert score < 70

if __name__ == "__main__":
    print("🚀 Running refined modular tests...")
    test_sas_high()
    test_sas_low()
    test_rsi_high()
    test_rsi_low()
    print("✨ Modular verification complete!")
