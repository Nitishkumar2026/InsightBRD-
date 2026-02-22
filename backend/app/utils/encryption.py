from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

# Use an existing key or generate one for local dev
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    # In production, this should always be set. For dev, we handle the missing case.
    ENCRYPTION_KEY = Fernet.generate_key().decode()

cipher_suite = Fernet(ENCRYPTION_KEY.encode())

def encrypt_token(token: str) -> str:
    """Encrypt a plain text token."""
    if not token:
        return None
    return cipher_suite.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    """Decrypt an encrypted token."""
    if not encrypted_token:
        return None
    return cipher_suite.decrypt(encrypted_token.encode()).decode()
