from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import IntegrationToken, User
from app.utils.encryption import encrypt_token
from app.core.config import settings
import httpx
import os
from datetime import datetime, timedelta
from slack_sdk import WebClient

router = APIRouter()

# Environment variables (to be set by user)
SLACK_CLIENT_ID = os.getenv("SLACK_CLIENT_ID")
SLACK_CLIENT_SECRET = os.getenv("SLACK_CLIENT_SECRET")
SLACK_REDIRECT_URI = os.getenv("SLACK_REDIRECT_URI", "http://localhost:8000/auth/slack/callback")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")

@router.get("/slack/login")
async def slack_login():
    if not SLACK_CLIENT_ID:
        # Fallback: If we already have a direct BOT token, just go to success
        if os.getenv("SLACK_BOT_TOKEN"):
            return RedirectResponse(url="http://localhost:3000/ingest?status=success&provider=slack")
        raise HTTPException(status_code=500, detail="Slack Client ID not configured")
    
    scopes = "channels:history,channels:read,groups:read,im:read,mpim:read,users:read"
    url = f"https://slack.com/oauth/v2/authorize?client_id={SLACK_CLIENT_ID}&scope={scopes}&redirect_uri={SLACK_REDIRECT_URI}"
    return RedirectResponse(url)

@router.get("/slack/callback")
async def slack_callback(code: str, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://slack.com/api/oauth.v2.access",
            data={
                "client_id": SLACK_CLIENT_ID,
                "client_secret": SLACK_CLIENT_SECRET,
                "code": code,
                "redirect_uri": SLACK_REDIRECT_URI
            }
        )
        data = response.json()
        
        if not data.get("ok"):
            raise HTTPException(status_code=400, detail=f"Slack Auth Error: {data.get('error')}")
        
        access_token = data.get("access_token")
        # In a real app, you'd get the current user ID from JWT
        # For this prototype, we'll associate it with the first user or a dummy user
        user = db.query(User).first()
        if not user:
            raise HTTPException(status_code=404, detail="No user found to associate token with")

        # Save or update token
        token_entry = db.query(IntegrationToken).filter(
            IntegrationToken.user_id == user.id,
            IntegrationToken.provider == "slack"
        ).first()

        if not token_entry:
            token_entry = IntegrationToken(
                user_id=user.id,
                provider="slack",
                access_token=encrypt_token(access_token)
            )
            db.add(token_entry)
        else:
            token_entry.access_token = encrypt_token(access_token)
        
        db.commit()
    
    return RedirectResponse(url="http://localhost:3000/ingest?status=success&provider=slack")

@router.get("/google/login")
async def google_login():
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google Client ID not configured")
    
    if not GOOGLE_CLIENT_SECRET or GOOGLE_CLIENT_SECRET == "YOUR_CLIENT_SECRET_HERE":
        raise HTTPException(status_code=500, detail="Google Client Secret not configured. Real connection required.")
    
    # Debugging Redirect URI
    print(f"[DEBUG] Google Login - Redirect URI being sent to Google: {GOOGLE_REDIRECT_URI}")
    
    scopes = "https://www.googleapis.com/auth/gmail.readonly"
    url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&"
        f"response_type=code&scope={scopes}&access_type=offline&prompt=consent"
    )
    return RedirectResponse(url)

@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    from google_auth_oauthlib.flow import Flow
    from googleapiclient.discovery import build
    
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=["https://www.googleapis.com/auth/gmail.readonly"],
    )
    flow.redirect_uri = GOOGLE_REDIRECT_URI
    print(f"[DEBUG] Google Callback - Fetching token with code. Redirect URI used: {flow.redirect_uri}")
    flow.fetch_token(code=code)

    credentials = flow.credentials
    service = build("gmail", "v1", credentials=credentials)

    # 1. Fetch live messages (Production Ingestion)
    results = service.users().messages().list(userId="me", maxResults=5).execute()
    messages = results.get("messages", [])
    
    email_data = []
    for msg in messages:
        msg_detail = service.users().messages().get(userId="me", id=msg["id"], format="full").execute()
        payload = msg_detail.get("payload", {})
        headers = payload.get("headers", [])
        subject = next((h["value"] for h in headers if h["name"] == "Subject"), "No Subject")
        
        email_data.append({
            "id": msg["id"],
            "subject": subject
        })

    # 2. Association with User & Token storage (SaaS Logic)
    user = db.query(User).first()
    if not user:
         raise HTTPException(status_code=404, detail="No user found to associate token with")

    token_entry = db.query(IntegrationToken).filter(
        IntegrationToken.user_id == user.id,
        IntegrationToken.provider == "google"
    ).first()

    if not token_entry:
        token_entry = IntegrationToken(
            user_id=user.id,
            provider="google",
            access_token=encrypt_token(credentials.token),
            refresh_token=encrypt_token(credentials.refresh_token) if credentials.refresh_token else None,
            expires_at=credentials.expiry
        )
        db.add(token_entry)
    else:
        token_entry.access_token = encrypt_token(credentials.token)
        if credentials.refresh_token:
            token_entry.refresh_token = encrypt_token(credentials.refresh_token)
        token_entry.expires_at = credentials.expiry
    
    db.commit()

    # 3. Quick Rule-Based Extraction (Phase 26.1)
    def extract_from_email(subject):
        reqs = []
        low = subject.lower()
        if "login" in low: reqs.append("System should allow user login functionality.")
        if "dashboard" in low: reqs.append("System should include a user dashboard.")
        if "report" in low: reqs.append("System should generate reports.")
        return reqs

    all_requirements = []
    for email in email_data:
        all_requirements.extend(extract_from_email(email["subject"]))

    # 4. Success Redirect with Metadata
    return RedirectResponse(url="http://localhost:3000/ingest?status=success&provider=google")

@router.get("/status")
async def get_integration_status(db: Session = Depends(get_db)):
    # In prototype, check for first user
    user = db.query(User).first()
    if not user:
        # Even without a user, check env-based connections
        has_slack = bool(os.getenv("SLACK_BOT_TOKEN"))
        # In demo mode, if only CLIENT_ID is set (no secret), treat as demo-connected
        has_google_demo = bool(GOOGLE_CLIENT_ID) and not bool(GOOGLE_CLIENT_SECRET)
        return {"slack": has_slack, "google": has_google_demo}
    
    tokens = db.query(IntegrationToken).filter(IntegrationToken.user_id == user.id).all()
    providers = [t.provider for t in tokens]
    
    # Slack: check DB token OR direct bot token
    has_slack = "slack" in providers or bool(os.getenv("SLACK_BOT_TOKEN"))
    # Google: check DB token OR demo mode (CLIENT_ID set, no SECRET = demo connected)
    has_google_demo = bool(GOOGLE_CLIENT_ID) and not bool(GOOGLE_CLIENT_SECRET)
    has_google = "google" in providers or has_google_demo
    
    return {
        "slack": has_slack,
        "google": has_google
    }
