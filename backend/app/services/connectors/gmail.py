from .base import BaseConnector
from typing import List, Dict, Any
import os
from app.utils.encryption import decrypt_token
from app.models.models import IntegrationToken
from sqlalchemy.orm import Session
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import base64
import re

class GmailConnector(BaseConnector):
    def __init__(self, credentials: str = None, user_id: str = None, db: Session = None):
        self.service = None
        
        if credentials:
            # Direct token provided
            self.credentials = credentials
        elif user_id and db:
            # Fetch from database
            token_entry = db.query(IntegrationToken).filter(
                IntegrationToken.user_id == user_id,
                IntegrationToken.provider == "google"
            ).first()
            if token_entry:
                access_token = decrypt_token(token_entry.access_token)
                refresh_token = decrypt_token(token_entry.refresh_token) if token_entry.refresh_token else None
                
                # Create credentials object
                creds = Credentials(
                    token=access_token,
                    refresh_token=refresh_token,
                    token_uri="https://oauth2.googleapis.com/token",
                    client_id=os.getenv("GOOGLE_CLIENT_ID"),
                    client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
                )
                
                # Check if token is expired and refresh if possible
                if creds.expired and creds.refresh_token:
                    from google.auth.transport.requests import Request as GoogleRequest
                    creds.refresh(GoogleRequest())
                    # In a real production app, we should save the new access_token back to DB here
                
                self.service = build("gmail", "v1", credentials=creds)
            else:
                self.credentials = None
        else:
            self.service = None
            print("[Gmail] No credentials provided via DB or init")

    async def fetch_data(self, query: str = "label:inbox", max_results: int = 20) -> List[Dict[str, Any]]:
        """
        Fetch emails from Gmail using the google-api-python-client.
        Returns list of emails with subject, body, sender, and date.
        """
        if not self.service:
            print("[Gmail] No valid credentials found, returning mock data")
            return [
                {"subject": "[MOCK] Project Requirements", "body": "Please ensure the system is GDPR compliant.", "from": "mock@example.com"},
                {"subject": "[MOCK] Meeting Notes", "body": "Decision: Mobile app must launch by June.", "from": "mock@example.com"}
            ]
        
        try:
            # Fetch message list
            results = self.service.users().messages().list(
                userId="me", 
                q=query, 
                maxResults=max_results
            ).execute()
            
            messages = results.get("messages", [])
            email_data = []
            
            for msg in messages:
                # Get full message details
                msg_detail = self.service.users().messages().get(
                    userId="me", 
                    id=msg["id"], 
                    format="full"
                ).execute()
                
                # Extract headers
                payload = msg_detail.get("payload", {})
                headers = payload.get("headers", [])
                
                subject = next((h["value"] for h in headers if h["name"].lower() == "subject"), "No Subject")
                sender = next((h["value"] for h in headers if h["name"].lower() == "from"), "Unknown")
                date = next((h["value"] for h in headers if h["name"].lower() == "date"), "")
                
                # Extract body
                body = self._extract_body(payload)
                
                email_data.append({
                    "id": msg["id"],
                    "subject": subject,
                    "from": sender,
                    "date": date,
                    "body": body
                })
            
            print(f"[Gmail] Successfully fetched {len(email_data)} emails")
            return email_data
            
        except Exception as e:
            print(f"[Gmail] Error fetching emails: {str(e)}")
            return []

    def _extract_body(self, payload: Dict[str, Any]) -> str:
        """Extract email body from payload (handles multipart messages)"""
        body = ""
        
        if "parts" in payload:
            # Multipart message
            for part in payload["parts"]:
                if part.get("mimeType") == "text/plain":
                    data = part.get("body", {}).get("data", "")
                    if data:
                        body = base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
                        break
                elif part.get("mimeType") == "text/html" and not body:
                    data = part.get("body", {}).get("data", "")
                    if data:
                        html_body = base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
                        # Strip HTML tags
                        body = re.sub(r'<[^>]+>', '', html_body)
        else:
            # Single part message
            data = payload.get("body", {}).get("data", "")
            if data:
                body = base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
        
        return body.strip()

    def parse_data(self, raw_data: List[Dict[str, Any]]) -> List[str]:
        """Parse email data to extract text content"""
        return [f"{msg.get('subject', '')}: {msg.get('body', '')}" for msg in raw_data if msg.get('body')]
