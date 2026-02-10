"""Authentication request and response schemas.

This module defines Pydantic schemas for authentication endpoints.
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class UserSignupRequest(BaseModel):
    """Request schema for user signup.

    Attributes:
        username: User's username (3-20 characters, alphanumeric + underscore)
        email: User's email address (max 255 characters)
        password: Plain text password (min 8 characters, validated in endpoint)
    """

    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr = Field(..., max_length=255)
    password: str

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        """Validate username format (alphanumeric + underscore only)."""
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username must contain only letters, numbers, and underscores')
        return v


class UserSigninRequest(BaseModel):
    """Request schema for user signin.

    Attributes:
        username_or_email: User's username or email address
        password: Plain text password
    """

    username_or_email: str = Field(..., max_length=255)
    password: str


class AuthResponse(BaseModel):
    """Response schema for authentication endpoints.

    Attributes:
        access_token: JWT access token
        token_type: Token type (always "bearer")
        user_id: User's unique identifier
        username: User's username
        email: User's email address
    """

    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str
    email: str
