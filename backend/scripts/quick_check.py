import os
import sys
import sqlite3

# Path to database
db_path = os.path.join(os.getcwd(), "backend", "insightbrd.db")

def check_tokens():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT provider, user_id, created_at FROM integration_tokens")
        rows = cursor.fetchall()
        if not rows:
            print("No tokens found in database.")
        else:
            print(f"Found {len(rows)} tokens:")
            for row in rows:
                print(f"- Provider: {row[0]}, User ID: {row[1]}, Last Updated: {row[2]}")
    except sqlite3.OperationalError as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_tokens()
