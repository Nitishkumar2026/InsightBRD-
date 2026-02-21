import random
from typing import List, Dict
from uuid import UUID

class AIPipeline:
    async def extract_requirements(self, text: str) -> List[Dict]:
        """
        Mock extraction logic. In production, this calls OpenAI/Anthropic.
        """
        categories = ["functional", "non-functional", "constraint"]
        # Simulating extraction of 3-5 requirements
        requirements = []
        for i in range(random.randint(3, 5)):
            requirements.append({
                "text": f"Extracted Requirement {i+1} from source: {text[:50]}...",
                "category": random.choice(categories),
                "priority_score": round(random.uniform(1.0, 10.0), 2),
                "sentiment_score": round(random.uniform(-1.0, 1.0), 2)
            })
        return requirements

    async def detect_conflicts(self, requirements: List[Dict]) -> List[Dict]:
        """
        Mock conflict detection logic.
        """
        conflicts = []
        if len(requirements) > 2:
            conflicts.append({
                "conflict_type": "logic",
                "severity_score": round(random.uniform(50.0, 95.0), 2),
                "resolution_summary": "Suggested resolution for logical mismatch between extracted items."
            })
        return conflicts

ai_processor = AIPipeline()
