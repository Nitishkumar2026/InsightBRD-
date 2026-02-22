from app.services.connectors.base import BaseConnector
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class GraphSeeder:
    """
    Seeds Neo4j with organizational and decision graphs from datasets.
    """

    @staticmethod
    def seed_enron_hierarchy(emails: List[Dict[str, Any]], driver: Any):
        """
        Maps Enron CC/BCC patterns to stakeholder influence.
        """
        with driver.session() as session:
            for email in emails:
                sender = email.get("sender")
                recipients = email.get("recipients", [])
                
                # Create Sender
                session.run(
                    "MERGE (s:Stakeholder {email: $email}) SET s.name = $email",
                    email=sender
                )
                
                # Create Recipients and Relationships
                for recipient in recipients:
                    session.run(
                        "MERGE (r:Stakeholder {email: $email}) SET r.name = $email",
                        email=recipient
                    )
                    session.run(
                        "MATCH (s:Stakeholder {email: $sender}), (r:Stakeholder {email: $recipient}) "
                        "MERGE (s)-[:COMMUNICATES_WITH {type: 'email'}]->(r) "
                        "WITH s, r "
                        "SET s.influence_score = COALESCE(s.influence_score, 0) + 1",
                        sender=sender, recipient=recipient
                    )

    @staticmethod
    def seed_ami_decisions(meetings: List[Dict[str, Any]], project_id: str, driver: Any):
        """
        Maps AMI roles to requirement decisions in the graph.
        """
        with driver.session() as session:
            for meeting in meetings:
                meeting_id = meeting.get("meeting_id")
                participants = meeting.get("participants", [])
                
                # Create Meeting Node
                session.run(
                    "MERGE (m:Meeting {id: $id, project_id: $pid})",
                    id=meeting_id, pid=project_id
                )
                
                for role in participants:
                    # Create Role Node
                    session.run(
                        "MERGE (p:Stakeholder {id: $role, project_id: $pid}) SET p.name = $role",
                        role=role, pid=project_id
                    )
                    # Link to Meeting
                    session.run(
                        "MATCH (p:Stakeholder {id: $role, project_id: $pid}), (m:Meeting {id: $id, project_id: $pid}) "
                        "MERGE (p)-[:PARTICIPATED_IN]->(m)",
                        role=role, pid=project_id, id=meeting_id
                    )
