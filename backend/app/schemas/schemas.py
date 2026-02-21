from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from typing import List, Optional

# Base Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "draft"

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

# Requirement Schemas
class RequirementBase(BaseModel):
    text: str
    source_type: Optional[str] = None
    category: Optional[str] = None
    priority_score: Optional[float] = 0.0

class RequirementCreate(RequirementBase):
    project_id: UUID

class Requirement(RequirementBase):
    id: UUID
    project_id: UUID
    sentiment_score: float
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Conflict Schemas
class ConflictBase(BaseModel):
    req_a_id: UUID
    req_b_id: UUID
    conflict_type: str
    severity_score: float

class Conflict(ConflictBase):
    id: UUID
    project_id: UUID
    is_resolved: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Stakeholder Schemas
class StakeholderBase(BaseModel):
    name: str
    role: Optional[str] = None
    influence_score: Optional[float] = 1.0
    email: Optional[EmailStr] = None

class StakeholderCreate(StakeholderBase):
    project_id: UUID

class Stakeholder(StakeholderBase):
    id: UUID
    project_id: UUID
    class Config:
        from_attributes = True
