from sqlalchemy import Column, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.db.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="draft")
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="projects")
    requirements = relationship("Requirement", back_populates="project")
    stakeholders = relationship("Stakeholder", back_populates="project")

class Requirement(Base):
    __tablename__ = "requirements"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    stakeholder_id = Column(UUID(as_uuid=True), ForeignKey("stakeholders.id"), nullable=True) # Map to specific stakeholder
    text = Column(Text, nullable=False)
    source_type = Column(String) # email, slack, transcript, document
    source_ref = Column(String)
    category = Column(String) # functional, non-functional, constraint
    priority_score = Column(Float, default=0.0)
    sentiment_score = Column(Float, default=0.0)
    status = Column(String, default="extracted")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="requirements")
    revisions = relationship("RequirementRevision", back_populates="requirement")
    stakeholder = relationship("Stakeholder")

class SentimentPulse(Base):
    __tablename__ = "sentiment_pulses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    stakeholder_id = Column(UUID(as_uuid=True), ForeignKey("stakeholders.id"))
    score = Column(Float, nullable=False) # -1 to 1
    comment_snippet = Column(Text)
    source_type = Column(String) # slack, email
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project")
    stakeholder = relationship("Stakeholder")

class RequirementRevision(Base):
    __tablename__ = "requirement_revisions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requirement_id = Column(UUID(as_uuid=True), ForeignKey("requirements.id"))
    field_changed = Column(String)
    old_value = Column(Text)
    new_value = Column(Text)
    changed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    requirement = relationship("Requirement", back_populates="revisions")

class Stakeholder(Base):
    __tablename__ = "stakeholders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    name = Column(String, nullable=False)
    role = Column(String)
    influence_score = Column(Float, default=1.0)
    email = Column(String)

    project = relationship("Project", back_populates="stakeholders")

class IntegrationToken(Base):
    __tablename__ = "integration_tokens"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    provider = Column(String, nullable=False) # slack, google
    access_token = Column(Text, nullable=False) # Encrypted
    refresh_token = Column(Text) # Encrypted
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class Conflict(Base):
    __tablename__ = "conflicts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    req_a_id = Column(UUID(as_uuid=True), ForeignKey("requirements.id"))
    req_b_id = Column(UUID(as_uuid=True), ForeignKey("requirements.id"))
    conflict_type = Column(String)
    severity_score = Column(Float)
    resolution_summary = Column(Text)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    req_a = relationship("Requirement", foreign_keys=[req_a_id])
    req_b = relationship("Requirement", foreign_keys=[req_b_id])
