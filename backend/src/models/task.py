"""Task model for todo items.

This module defines the Task entity for database storage.
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional


class Task(SQLModel, table=True):
    """Task model representing a todo item.

    Attributes:
        id: Unique task identifier (UUID)
        user_id: Owner's user ID (foreign key to users table)
        title: Task title/summary (required, max 500 chars)
        description: Optional detailed description
        is_completed: Completion status (default False)
        created_at: Task creation timestamp
        updated_at: Last update timestamp
    """

    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=500)
    description: Optional[str] = Field(default=None)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
