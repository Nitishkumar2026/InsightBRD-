import os
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("SLACK_BOT_TOKEN")
client = WebClient(token=token)

try:
    response = client.auth_test()
    print(f"Success! Authenticated as: {response['user']} (ID: {response['user_id']})")
    
    # Try to list public channels
    channels = client.conversations_list(types="public_channel", limit=5)
    print("\nAvailable Channels:")
    for channel in channels["channels"]:
        print(f" - #{channel['name']} (ID: {channel['id']})")

except SlackApiError as e:
    print(f"Error: {e.response['error']}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
