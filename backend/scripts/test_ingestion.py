import requests
import uuid

BASE_URL = "http://localhost:8000/api/v1"

def test_ingestion_flow():
    # 1. Create a dummy project
    project_payload = {
        "name": "Integration Test Project",
        "description": "Testing the end-to-end ingestion and AI pipeline",
        "status": "draft"
    }
    response = requests.post(f"{BASE_URL}/projects/", json=project_payload)
    if response.status_code != 200:
        print(f"Failed to create project: {response.text}")
        return
    
    project = response.json()
    project_id = project["id"]
    print(f"Created project: {project_id}")

    # 2. Upload a dummy file
    with open("dummy_brd.txt", "w") as f:
        f.write("System must support SSO. Deadline is end of May.")
    
    with open("dummy_brd.txt", "rb") as f:
        files = {"file": ("dummy_brd.txt", f, "text/plain")}
        response = requests.post(f"{BASE_URL}/ingest/{project_id}/upload", files=files)
    
    if response.status_code == 200:
        print("Ingestion processed successfully!")
        print(response.json())
    else:
        print(f"Ingestion failed: {response.text}")

    # 3. Check requirements
    response = requests.get(f"{BASE_URL}/requirements/project/{project_id}")
    if response.status_code == 200:
        reqs = response.json()
        print(f"Extracted {len(reqs)} requirements:")
        for r in reqs:
            print(f"- [{r['category']}] {r['text']}")
    else:
        print(f"Failed to fetch requirements: {response.text}")

if __name__ == "__main__":
    test_ingestion_flow()
