"""User model for authentication.

This module defines the User entity for database storage.
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional


class User(SQLModel, table=True):
    """User model representing a registered account.

    Attributes:
        id: Unique user identifier (UUID)
        username: User's username (unique, used for login)
        email: User's email address (unique, used for login)
        hashed_password: Bcrypt-hashed password
        is_active: Whether the user account is active
        created_at: Account creation timestamp
        reset_token: Password reset token (nullable)
        reset_token_expires_at: Reset token expiration timestamp (nullable)
    """

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(unique=True, index=True, min_length=3, max_length=20)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    is_active: Optional[bool] = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    reset_token: Optional[str] = Field(default=None, max_length=255)
    reset_token_expires_at: Optional[datetime] = Field(default=None)
