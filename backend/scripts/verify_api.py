import requests
import json

def verify_api():
    project_id = "806f473b47794536b7ba7b82c1516e93"
    url = f"http://localhost:8000/api/v1/conflicts/project/{project_id}"
    
    try:
        print(f"Fetching from {url}...")
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        if response.ok:
            data = response.json()
            print("Response Data:")
            print(json.dumps(data, indent=2))
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    verify_api()
