from .base import BaseConnector
from typing import List, Dict, Any
import os
import httpx

class SlackConnector(BaseConnector):
    def __init__(self, token: str = None):
        self.token = token or os.getenv("SLACK_BOT_TOKEN")

    async def fetch_data(self, channel_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Fetch messages from a Slack channel.
        """
        if not self.token:
            # Mock data for demonstration
            return [
                {"user": "U123", "text": "We need the SSO to support OAuth2.", "ts": "123456.78"},
                {"user": "U456", "text": "The budget for this is $50k.", "ts": "123457.90"}
            ]

        url = f"https://slack.com/api/conversations.history?channel={channel_id}&limit={limit}"
        headers = {"Authorization": f"Bearer {self.token}"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            data = response.json()
            if not data.get("ok"):
                print(f"Slack API error: {data.get('error')}")
                return []
            return data.get("messages", [])

    def parse_data(self, raw_data: List[Dict[str, Any]]) -> List[str]:
        return [msg.get("text", "") for msg in raw_data if "text" in msg]
