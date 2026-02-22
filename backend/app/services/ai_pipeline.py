import os
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

class RequirementModel(BaseModel):
    text: str = Field(description="The functional or non-functional requirement")
    category: str = Field(description="One of: functional, non-functional, constraint")
    priority_score: float = Field(description="0-10 importance score")
    sentiment_score: float = Field(description="-1 to 1 tone score")
    stakeholder_name: Optional[str] = Field(description="Name or ID of the stakeholder who voiced this")

class RequirementList(BaseModel):
    requirements: List[RequirementModel]

class ConflictModel(BaseModel):
    conflict_type: str = Field(description="Type of conflict (e.g., Semantic, Constraint)")
    severity_score: int = Field(description="0-100 severity")
    resolution_summary: str = Field(description="Suggested resolution")

class ConflictList(BaseModel):
    conflicts: List[ConflictModel]

class AIPipeline:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            # Using stable alias with a 30s timeout to prevent hangs
            self.model = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash", 
                google_api_key=self.api_key,
                temperature=0.1,
                request_timeout=30 # Prevent long hangs
            )
        else:
            self.model = None

    async def extract_requirements(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract structured requirements from text using Pydantic structured output.
        """
        if not self.model:
            return [{"text": f"Mock: {text[:20]}", "category": "functional", "priority_score": 5, "sentiment_score": 0, "stakeholder_name": "Mock User"}]

        # Wrap in container class for stable Gemini extraction
        structured_llm = self.model.with_structured_output(RequirementList)
        prompt = ChatPromptTemplate.from_template(
            "Extract all requirements from the following business communication: \n\n{text}"
        )
        
        try:
            chain = prompt | structured_llm
            result = await chain.ainvoke({"text": text})
            # result is a RequirementList instance
            return [req.dict() for req in result.requirements]
        except Exception as e:
            print(f"Gemini Extraction failed: {e}")
            return []

    async def detect_conflicts(self, requirements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Detect logical contradictions using Gemini.
        """
        if not self.model or not requirements:
            return []

        structured_llm = self.model.with_structured_output(ConflictList)
        prompt = ChatPromptTemplate.from_template(
            "Identify semantic or logical conflicts in these requirements: \n\n{reqs}"
        )
        
        try:
            req_str = "\n".join([f"- {r['text']}" for r in requirements])
            chain = prompt | structured_llm
            result = await chain.ainvoke({"reqs": req_str})
            return [c.dict() for c in result.conflicts]
        except Exception as e:
            print(f"Gemini Conflict Detection failed: {e}")
            return []

ai_processor = AIPipeline()
