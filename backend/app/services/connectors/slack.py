from .base import BaseConnector
from typing import List, Dict, Any
import os
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from app.utils.encryption import decrypt_token
from app.models.models import IntegrationToken
from sqlalchemy.orm import Session

class SlackConnector(BaseConnector):
    def __init__(self, token: str = None, user_id: str = None, db: Session = None):
        if token:
            self.token = token
        elif user_id and db:
            token_entry = db.query(IntegrationToken).filter(
                IntegrationToken.user_id == user_id,
                IntegrationToken.provider == "slack"
            ).first()
            self.token = decrypt_token(token_entry.access_token) if token_entry else None
        else:
            self.token = os.getenv("SLACK_BOT_TOKEN")
            if self.token and self.token.startswith("YOUR_"):
                self.token = None
        
        self.client = WebClient(token=self.token) if self.token else None

    async def fetch_data(self, channel_id: str = None, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Fetch messages from a Slack channel using the official slack-sdk.
        If no channel_id provided, lists available channels.
        """
        if not self.client:
            print("[Slack] No valid token found, returning mock data")
            return [
                {"user": "U123", "text": "[MOCK] We need the SSO to support OAuth2.", "ts": "123456.78"},
                {"user": "U456", "text": "[MOCK] The budget for this is $50k.", "ts": "123457.90"}
            ]

        try:
            # If no channel specified, list available channels
            if not channel_id:
                channels_response = self.client.conversations_list(
                    types="public_channel,private_channel",
                    limit=10
                )
                channels = channels_response.get("channels", [])
                print(f"[Slack] Found {len(channels)} channels")
                return [{"id": ch["id"], "name": ch["name"], "is_channel": True} for ch in channels]
            
            # Fetch messages from specific channel
            response = self.client.conversations_history(
                channel=channel_id, 
                limit=limit
            )
            messages = response.get("messages", [])
            
            # Enrich messages with user info
            enriched_messages = []
            for msg in messages:
                user_id = msg.get("user")
                user_name = "Unknown"
                
                if user_id:
                    try:
                        user_info = self.client.users_info(user=user_id)
                        user_name = user_info.get("user", {}).get("real_name", user_id)
                    except:
                        user_name = user_id
                
                enriched_messages.append({
                    "user": user_id,
                    "user_name": user_name,
                    "text": msg.get("text", ""),
                    "ts": msg.get("ts", ""),
                    "type": msg.get("type", "message")
                })
            
            print(f"[Slack] Successfully fetched {len(enriched_messages)} messages from channel {channel_id}")
            return enriched_messages
            
        except SlackApiError as e:
            print(f"[Slack] API error: {e.response['error']}")
            return []
        except Exception as e:
            print(f"[Slack] Unexpected error: {str(e)}")
            return []

    def parse_data(self, raw_data: List[Dict[str, Any]]) -> List[str]:
        """Parse Slack messages to extract text content"""
        return [f"{msg.get('user_name', 'Unknown')}: {msg.get('text', '')}" 
                for msg in raw_data if msg.get('text')]
