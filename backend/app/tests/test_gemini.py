import os
import asyncio
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

class RequirementModel(BaseModel):
    text: str = Field(description="Requirement text")
    category: str = Field(description="Category")

async def test_gemini():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY not found in .env")
        return

    # Using Gemini 1.5 Flash
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key)
    print(f"🚀 Testing Gemini with key: {api_key[:10]}...")

    # Modern way to get structured output
    structured_llm = model.with_structured_output(RequirementModel)
    
    prompt = ChatPromptTemplate.from_template(
        "Extract one requirement from: 'The system must support 1000 concurrent users.'"
    )
    
    chain = prompt | structured_llm
    try:
        result = await chain.ainvoke({})
        print(f"✅ Gemini Response: {result.dict()}")
    except Exception as e:
        print(f"❌ Gemini Test Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
