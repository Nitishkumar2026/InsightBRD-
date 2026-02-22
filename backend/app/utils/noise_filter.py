import re
from typing import List, Optional

class NoiseFilter:
    """
    Advanced noise filtering for business communication (emails, transcripts).
    """
    
    # Generic corporate/personal noise patterns
    NOISE_PATTERNS = [
        r"(?i)lunch",
        r"(?i)dinner",
        r"(?i)happy hour",
        r"(?i)coffee",
        r"(?i)gym",
        r"(?i)out of office",
        r"(?i)automatic reply",
        r"(?i)newsletter",
        r"(?i)subscriber",
        r"(?i)unsubscribe",
        r"(?i)football",
        r"(?i)basketball",
        r"(?i)vacation",
        r"(?i)happy birthday",
        r"(?i)congratulations",
        r"(?i)weekend",
        r"(?i)thank you",
        r"(?i)thanks",
        r"(?i)best regards",
        r"(?i)sincerely",
        r"(?i)meeting room (booked|canceled)",
        r"(?i)order (confirmation|delivery)"
    ]

    # Patterns indicating high value project signals
    SIGNAL_PATTERNS = [
        r"(?i)requirement",
        r"(?i)must have",
        r"(?i)should have",
        r"(?i)deadline",
        r"(?i)milestone",
        r"(?i)priority",
        r"(?i)stakeholder",
        r"(?i)conflict",
        r"(?i)risk",
        r"(?i)decision",
        r"(?i)agreed",
        r"(?i)rejected",
        r"(?i)budget",
        r"(?i)scope"
    ]

    @classmethod
    def is_noise(cls, text: str) -> bool:
        """
        Returns True if the text is primarily noise.
        """
        text_lower = text.lower()
        
        # 1. If it's too short, it's likely noise or fluff
        if len(text.strip()) < 30:
            return True
            
        # 2. Check for high-value signals first
        if any(re.search(pattern, text_lower) for pattern in cls.SIGNAL_PATTERNS):
            return False
            
        # 3. Check for heavy noise patterns
        # If text contains more noise words than non-noise words, or direct noise match
        noise_matches = sum(1 for pattern in cls.NOISE_PATTERNS if re.search(pattern, text_lower))
        if noise_matches >= 1:
            return True
            
        return False

    @classmethod
    def clean_text(cls, text: str) -> str:
        """
        Basic cleanup of raw text (removing signatures, repeated headers etc.)
        """
        # Remove common email signature markers
        text = re.split(r'--\s*\n|Regards,|Thanks,', text)[0]
        # Remove extra whitespaces
        text = re.sub(r'\s+', ' ', text).strip()
        return text
