from .base import BaseConnector
from typing import List, Dict, Any
from app.utils.dataset_fetcher import DatasetFetcher
from app.utils.noise_filter import NoiseFilter

class AMIConnector(BaseConnector):
    def __init__(self, mode: str = "sample"):
        self.mode = mode

    async def fetch_data(self, **kwargs) -> List[Dict[str, Any]]:
        """
        Fetches AMI meeting transcripts.
        """
        return await DatasetFetcher.fetch_ami_samples()

    def parse_data(self, raw_data: List[Dict[str, Any]]) -> List[str]:
        """
        Parses transcripts into a format suitable for requirement extraction.
        Filters out fluff and small talk using NoiseFilter.
        """
        parsed_transcripts = []
        for meeting in raw_data:
            summary = meeting.get("summary", "")
            content = f"Meeting ID: {meeting.get('meeting_id')}\n"
            content += f"Summary: {NoiseFilter.clean_text(summary)}\n"
            content += "Transcript:\n"
            
            for entry in meeting.get("transcript", []):
                speaker = entry['speaker']
                text = entry['text']
                
                # Filter out meeting fluff
                if not NoiseFilter.is_noise(text):
                    clean_text = NoiseFilter.clean_text(text)
                    content += f"[{speaker}]: {clean_text}\n"
                    
            parsed_transcripts.append(content)
            
        return parsed_transcripts
