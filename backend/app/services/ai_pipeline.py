import os
import json
from typing import List, Dict
from uuid import UUID
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser

class AIPipeline:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            self.model = ChatOpenAI(model="gpt-4o", openai_api_key=self.api_key)
        else:
            self.model = None

    async def extract_requirements(self, text: str) -> List[Dict]:
        """
        Extract structured requirements from text using LLM.
        """
        if not self.model:
            # Fallback to smart mock if no API key
            return [
                {
                    "text": f"Extracted Requirement from text: {text[:50]}...",
                    "category": "functional",
                    "priority_score": 8.5,
                    "sentiment_score": 0.5
                }
            ]

        response_schemas = [
            ResponseSchema(name="text", description="The requirement text"),
            ResponseSchema(name="category", description="One of: functional, non-functional, constraint"),
            ResponseSchema(name="priority_score", description="0-10 score of importance"),
            ResponseSchema(name="sentiment_score", description="-1 to 1 score of stakeholder tone")
        ]
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = output_parser.get_format_instructions()

        prompt = ChatPromptTemplate.from_template(
            "Extract requirements from the following text and format as a list of JSON objects.\n{format_instructions}\nText: {text}"
        )
        
        chain = prompt | self.model | output_parser
        try:
            result = await chain.ainvoke({"text": text, "format_instructions": format_instructions})
            return result if isinstance(result, list) else [result]
        except Exception as e:
            print(f"AI Extraction failed: {e}")
            return []

    async def detect_conflicts(self, requirements: List[Dict]) -> List[Dict]:
        """
        Detect logical contradictions between requirements.
        """
        if not self.model:
            return []

        response_schemas = [
            ResponseSchema(name="conflict_type", description="Type of conflict"),
            ResponseSchema(name="severity_score", description="0-100 severity"),
            ResponseSchema(name="resolution_summary", description="Suggested fix")
        ]
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = output_parser.get_format_instructions()

        prompt = ChatPromptTemplate.from_template(
            "Identify conflicts in these requirements and provide resolution suggestions.\n{format_instructions}\nRequirements: {reqs}"
        )
        
        chain = prompt | self.model | output_parser
        try:
            req_str = json.dumps(requirements)
            result = await chain.ainvoke({"reqs": req_str, "format_instructions": format_instructions})
            return result if isinstance(result, list) else [result]
        except Exception as e:
            print(f"AI Conflict Detection failed: {e}")
            return []

ai_processor = AIPipeline()
