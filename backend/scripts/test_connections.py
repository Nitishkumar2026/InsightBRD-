import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.models.models import IntegrationToken, User
from app.services.connectors.gmail import GmailConnector
from app.services.connectors.slack import SlackConnector
import asyncio

load_dotenv()

async def test_connections():
    print("--- Integration Connection Test ---")
    
    # Setup Database
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./insightbrd.db")
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        user = db.query(User).first()
        if not user:
            print("[Error] No user found in database. Please register first.")
            return

        print(f"Testing for User: {user.username}")

        # 1. Test Gmail
        print("\n[Gmail] Testing...")
        gmail = GmailConnector(user_id=user.id, db=db)
        if gmail.service:
            try:
                emails = await gmail.fetch_data(max_results=5)
                print(f"[Gmail] Success! Fetched {len(emails)} emails.")
            except Exception as e:
                print(f"[Gmail] Failed during API call: {e}")
        else:
            print("[Gmail] Failed: No valid token/credentials found in DB.")

        # 2. Test Slack
        print("\n[Slack] Testing...")
        slack = SlackConnector(user_id=user.id, db=db)
        if slack.token:
            try:
                channels = await slack.fetch_data()
                print(f"[Slack] Success! Found {len(channels)} channels.")
            except Exception as e:
                print(f"[Slack] Failed during API call: {e}")
        else:
            print("[Slack] Failed: No valid token/credentials found in DB.")

    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_connections())
