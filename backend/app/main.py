from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(oauth.router, prefix="/auth", tags=["oauth"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
app.include_router(requirements.router, prefix=f"{settings.API_V1_STR}/requirements", tags=["requirements"])
app.include_router(ingestion.router, prefix=f"{settings.API_V1_STR}/ingest", tags=["ingestion"])
app.include_router(stakeholders.router, prefix=f"{settings.API_V1_STR}/stakeholders", tags=["stakeholders"])
app.include_router(sentiment.router, prefix=f"{settings.API_V1_STR}/sentiment", tags=["sentiment"])
app.include_router(intelligence.router, prefix=f"{settings.API_V1_STR}/intelligence", tags=["intelligence"])
app.include_router(advisor.router, prefix=f"{settings.API_V1_STR}/advisor", tags=["advisor"])
app.include_router(conflicts.router, prefix=f"{settings.API_V1_STR}/conflicts", tags=["conflicts"])

@app.get("/")
def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
