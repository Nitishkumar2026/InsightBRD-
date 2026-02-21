from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseConnector(ABC):
    @abstractmethod
    async def fetch_data(self, **kwargs) -> List[Dict[str, Any]]:
        """
        Fetch raw data from the external platform.
        """
        pass

    @abstractmethod
    def parse_data(self, raw_data: List[Dict[str, Any]]) -> List[str]:
        """
        Convert raw platform data into plain text for processing.
        """
        pass
