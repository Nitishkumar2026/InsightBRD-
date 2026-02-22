import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("--- TESTING MODELS ---")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Supported Model: {m.name}")
            
    # Test a simple generation with the most likely model
    model = genai.GenerativeModel('gemini-flash-latest')
    response = model.generate_content("Hello, reply with 'READY'")
    print(f"\nTest Response: {response.text}")

except Exception as e:
    print(f"Error: {e}")
