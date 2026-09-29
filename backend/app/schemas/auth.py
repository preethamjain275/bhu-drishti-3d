"""
Auth API Schemas
Pydantic models for authentication, user management, and token payloads.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any

class LoginRequest(BaseModel):
    email: str = Field(..., description="User email address or username")
    password: str = Field(..., description="User password")

class UserPayloadSchema(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    is_active: bool
    roles: List[str]
    permissions: List[str]
    created_at: Optional[str] = None
    last_login_at: Optional[str] = None

class LoginResponseData(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPayloadSchema

class UserCreateRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    email: str = Field(..., description="User email address")
    full_name: str = Field(..., min_length=2, max_length=128)
    password: str = Field(..., min_length=6)
    roles: List[str] = Field(default_factory=lambda: ["VIEWER"])

class UserUpdateRequest(BaseModel):
    is_active: Optional[bool] = None
    roles: Optional[List[str]] = None
