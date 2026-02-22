from .base import BaseConnector
from typing import List, Dict, Any
from app.utils.dataset_fetcher import DatasetFetcher
from app.utils.noise_filter import NoiseFilter
import os

class EnronConnector(BaseConnector):
    def __init__(self, mode: str = "sample"):
        self.mode = mode

    async def fetch_data(self, **kwargs) -> List[Dict[str, Any]]:
        """
        Fetches emails from the Enron dataset.
        """
        limit = kwargs.get("limit", 100)
        # In this implementation, we use the sample fetcher
        return await DatasetFetcher.fetch_enron_samples(limit=limit)

    def parse_data(self, raw_data: List[Dict[str, Any]]) -> List[str]:
        """
        Extracts relevant project signals from emails using advanced filtering.
        """
        parsed_texts = []
        for email in raw_data:
            body = email.get("body", "")
            subject = email.get("subject", "")
            
            # Combine subject and body for analysis
            full_text = f"{subject}\n{body}"
            
            if NoiseFilter.is_noise(full_text):
                continue
                
            clean_body = NoiseFilter.clean_text(body)
            parsed_texts.append(f"Subject: {subject}\nFrom: {email.get('sender')}\nContent: {clean_body}")
            
        return parsed_texts
