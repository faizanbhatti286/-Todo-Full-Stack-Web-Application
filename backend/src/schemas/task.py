"""Task request and response schemas.

This module defines Pydantic schemas for task endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID


class TaskCreateRequest(BaseModel):
    """Request schema for creating a new task.

    Attributes:
        title: Task title (required, max 500 chars)
        description: Optional detailed description
        category: Task category (optional, defaults to 'general')
    """

    title: str = Field(max_length=500)
    description: Optional[str] = None
    category: Optional[str] = Field(default="general", max_length=50)


class TaskUpdateRequest(BaseModel):
    """Request schema for updating a task.

    All fields are optional for partial updates (PATCH).

    Attributes:
        title: Updated task title
        description: Updated description
        is_completed: Updated completion status
        status: Updated task status (pending, in_progress, completed)
        category: Updated task category
    """

    title: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    status: Optional[Literal["pending", "in_progress", "completed"]] = None
    category: Optional[str] = Field(None, max_length=50)


class TaskResponse(BaseModel):
    """Response schema for task endpoints.

    Attributes:
        id: Task unique identifier
        user_id: Owner's user ID
        title: Task title
        description: Task description (nullable)
        is_completed: Completion status
        category: Task category
        status: Task status (pending, in_progress, completed)
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """

    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    is_completed: bool
    category: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
