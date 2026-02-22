import os
import sys
import uuid
import sqlite3
from datetime import datetime, timedelta

# Path to database
db_path = os.path.join(os.getcwd(), "backend", "insightbrd.db")

def seed_conflicts():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 1. Get the first project
        cursor.execute("SELECT id FROM projects LIMIT 1")
        project_id_row = cursor.fetchone()
        if not project_id_row:
            print("No project found to seed conflicts into.")
            return
        
        project_id = project_id_row[0]
        print(f"Seeding conflicts for Project ID: {project_id}")

        # 2. Create Stakeholders
        stakeholder_cto_id = str(uuid.uuid4())
        stakeholder_pm_id = str(uuid.uuid4())
        
        cursor.execute("INSERT INTO stakeholders (id, project_id, name, role) VALUES (?, ?, ?, ?)", 
                       (stakeholder_cto_id, project_id, "Sarah (CTO)", "Technical Oversight"))
        cursor.execute("INSERT INTO stakeholders (id, project_id, name, role) VALUES (?, ?, ?, ?)", 
                       (stakeholder_pm_id, project_id, "Mike (Product Lead)", "Product Strategy"))

        # 3. Create Conflicting Requirements
        
        # Scenario 1: Authentication Security
        req1_id = str(uuid.uuid4())
        req2_id = str(uuid.uuid4())
        
        cursor.execute("""
            INSERT INTO requirements (id, project_id, stakeholder_id, text, source_type, category, priority_score, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (req1_id, project_id, stakeholder_cto_id, 
              "System must require Multi-Factor Authentication (MFA) for every single login attempt to ensure maximum security.",
              "email", "functional", 9.5, "extracted", datetime.utcnow().isoformat()))
        
        cursor.execute("""
            INSERT INTO requirements (id, project_id, stakeholder_id, text, source_type, category, priority_score, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (req2_id, project_id, stakeholder_pm_id, 
              "To improve user retention, the system should offer a 'Remember Me' feature that allows users to skip MFA for 30 days on trusted devices.",
              "slack", "functional", 8.0, "extracted", datetime.utcnow().isoformat()))

        # Scenario 2: Processing Latency
        req3_id = str(uuid.uuid4())
        req4_id = str(uuid.uuid4())
        
        cursor.execute("""
            INSERT INTO requirements (id, project_id, stakeholder_id, text, source_type, category, priority_score, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (req3_id, project_id, stakeholder_cto_id, 
              "All real-time analysis requests must be processed with a latency of less than 200ms to maintain system stability.",
              "document", "non-functional", 9.0, "extracted", datetime.utcnow().isoformat()))
        
        cursor.execute("""
            INSERT INTO requirements (id, project_id, stakeholder_id, text, source_type, category, priority_score, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (req4_id, project_id, stakeholder_pm_id, 
              "The system should prioritize cost-optimization by using spot instances, even if it leads to occasional processing delays of up to 2 seconds.",
              "slack", "non-functional", 7.5, "extracted", datetime.utcnow().isoformat()))

        # 4. Insert Conflicts
        
        # Conflict 1: Security vs UX
        cursor.execute("""
            INSERT INTO conflicts (id, project_id, req_a_id, req_b_id, conflict_type, severity_score, resolution_summary, is_resolved, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (str(uuid.uuid4()), project_id, req1_id, req2_id, "Security Policy Contradiction", 75.0, 
              "Adopt a risk-based MFA approach: require full MFA only for new devices or sensitive actions, while allowing 30-day persistence on verified personal devices.",
              0, datetime.utcnow().isoformat()))

        # Conflict 2: Performance vs Cost
        cursor.execute("""
            INSERT INTO conflicts (id, project_id, req_a_id, req_b_id, conflict_type, severity_score, resolution_summary, is_resolved, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (str(uuid.uuid4()), project_id, req3_id, req4_id, "Operational Performance Conflict", 85.0, 
              "Use a hybrid scaling strategy: guaranteed low-latency instances for premium users and async spot processing for non-critical background tasks.",
              0, datetime.utcnow().isoformat()))

        conn.commit()
        print("Successfully seeded 2 conflict scenarios with stakeholders and requirements.")

    except sqlite3.OperationalError as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    seed_conflicts()
