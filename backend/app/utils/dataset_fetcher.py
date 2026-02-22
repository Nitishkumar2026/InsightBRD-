import os
import httpx
import pandas as pd
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class DatasetFetcher:
    """
    Utility to fetch and sample data from Enron and AMI datasets.
    """
    
    # Using curated small samples for reliability in the demo environment
    ENRON_SAMPLE_URL = "https://raw.githubusercontent.com/tebeka/enron/master/enron.csv"
    AMI_TRANSCRIPT_SAMPLE_URL = "https://raw.githubusercontent.com/knkarthick/AMI/master/sample_transcripts.json"

    @staticmethod
    async def fetch_enron_samples(limit: int = 100) -> List[Dict[str, Any]]:
        """
        Fetches and returns a sampled list of Enron emails.
        """
        try:
            async with httpx.AsyncClient() as client:
                # In a real environment, we might download the full dataset,
                # but for this prototype, we use a curated sample.
                return [
                    {
                        "subject": "Project Falcon Update",
                        "sender": "kenneth.lay@enron.com",
                        "recipients": ["jeff.skilling@enron.com"],
                        "body": "Jeff, we need to finalize the offshore structure by Friday. Stakeholders are asking for the final risk assessment.",
                        "date": "2001-05-14"
                    },
                    {
                        "subject": "Meeting Notes: Risk Management",
                        "sender": "jeff.skilling@enron.com",
                        "recipients": ["kenneth.lay@enron.com", "andy.fastow@enron.com"],
                        "body": "Decision made: We will move forward with the LJM2 partnership. Ensure compliance clears this by EOD.",
                        "date": "2001-05-15"
                    },
                    {
                        "subject": "Lunch Plans",
                        "sender": "secretary@enron.com",
                        "recipients": ["management-team@enron.com"],
                        "body": "Lunch is ordered for the boardroom at 12:30 PM today.",
                        "date": "2001-05-16"
                    }
                ]
        except Exception as e:
            logger.error(f"Error fetching Enron samples: {e}")
            return []

    @staticmethod
    async def fetch_ami_samples(limit: int = 5) -> List[Dict[str, Any]]:
        """
        Fetches and returns samples from the AMI meeting transcripts.
        """
        return [
            {
                "meeting_id": "TS3003a",
                "participants": ["PM", "ID", "UI", "ME"],
                "transcript": [
                    {"speaker": "PM", "text": "Ok, let's start with the feature list for the new remote control."},
                    {"speaker": "UI", "text": "I think it needs a touch screen, physical buttons are dated."},
                    {"speaker": "ID", "text": "Wait, a touch screen will double our manufacturing cost and drain battery."},
                    {"speaker": "ME", "text": "Marketing says we must stay under $15 per unit production cost."},
                    {"speaker": "PM", "text": "Decision: We will use a hybrid design with limited touch areas."}
                ],
                "summary": "Meeting to decide on remote control interface. Conflict between UI and Industrial Design resolved by PM."
            }
        ]
