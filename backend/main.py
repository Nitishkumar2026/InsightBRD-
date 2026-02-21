from fastapi import FastAPI

app = FastAPI(title="InsightBRD+ API", version="0.1.0")

@app.get("/")
async def root():
    return {"message": "Welcome to InsightBRD+ API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
