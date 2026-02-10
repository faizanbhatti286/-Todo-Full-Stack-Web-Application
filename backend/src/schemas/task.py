"""Task request and response schemas.

This module defines Pydantic schemas for task endpoints.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class TaskCreateRequest(BaseModel):
    """Request schema for creating a new task.

    Attributes:
        title: Task title (required, max 500 chars)
        description: Optional detailed description
    """

    title: str
    description: Optional[str] = None


class TaskUpdateRequest(BaseModel):
    """Request schema for updating a task.

    All fields are optional for partial updates (PATCH).

    Attributes:
        title: Updated task title
        description: Updated description
        is_completed: Updated completion status
    """

    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None


class TaskResponse(BaseModel):
    """Response schema for task endpoints.

    Attributes:
        id: Task unique identifier
        user_id: Owner's user ID
        title: Task title
        description: Task description (nullable)
        is_completed: Completion status
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """

    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
