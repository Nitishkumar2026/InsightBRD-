import os
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("SLACK_BOT_TOKEN")
client = WebClient(token=token)

# Testing with #general (ID: C05HYMMDYQ6)
channel_id = "C05HYMMDYQ6"

print(f"Attempting to fetch messages from channel: {channel_id}")

try:
    response = client.conversations_history(channel=channel_id, limit=5)
    messages = response["messages"]
    print(f"Success! Found {len(messages)} messages.")
    for msg in messages:
        print(f" - [{msg.get('user')}]: {msg.get('text')}")

except SlackApiError as e:
    print(f"Slack Error: {e.response['error']}")
    if e.response['error'] == "not_in_channel":
        print("\nACTION REQUIRED: Please invite the bot to the channel by typing '/invite @InsightBRDApp' in Slack.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
