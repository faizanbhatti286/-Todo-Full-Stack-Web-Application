"""Task API endpoints.

This module provides CRUD operations for tasks with JWT authentication
and user isolation enforcement.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_session
from ..schemas.task import TaskCreateRequest, TaskUpdateRequest, TaskResponse
from ..services.auth_service import get_current_user_id
from ..services import task_service

router = APIRouter()


def validate_user_id(user_id: str, current_user_id: str):
    """Validate that the user_id in the URL matches the authenticated user."""
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access another user's tasks"
        )


@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
async def get_tasks(
    user_id: str,
    status: Optional[str] = None,
    category: Optional[str] = None,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Get all tasks for the authenticated user with optional filtering.

    Args:
        user_id: User ID from URL path
        status: Optional status filter (pending, in_progress, completed)
        category: Optional category filter
        current_user_id: Current authenticated user ID from JWT
        session: Database session

    Returns:
        List of tasks belonging to the user
    """
    validate_user_id(user_id, current_user_id)
    tasks = await task_service.get_user_tasks(
        current_user_id, session, status_filter=status, category_filter=category
    )
    return tasks


@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: str,
    request: TaskCreateRequest,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Create a new task for the authenticated user.

    Args:
        user_id: User ID from URL path
        request: Task creation request with title, optional description, and category
        current_user_id: Current authenticated user ID from JWT
        session: Database session

    Returns:
        Created task object
    """
    validate_user_id(user_id, current_user_id)
    task = await task_service.create_task(
        user_id=current_user_id,
        title=request.title,
        description=request.description,
        category=request.category,
        session=session,
    )
    return task


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    user_id: str,
    task_id: str,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Get a specific task by ID.

    Args:
        user_id: User ID from URL path
        task_id: Task's unique identifier
        current_user_id: Current authenticated user ID from JWT
        session: Database session

    Returns:
        Task object

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to another user
    """
    validate_user_id(user_id, current_user_id)
    task = await task_service.get_task_by_id(task_id, current_user_id, session)
    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task_full(
    user_id: str,
    task_id: str,
    request: TaskCreateRequest,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Update a task (full update).

    Args:
        user_id: User ID from URL path
        task_id: Task's unique identifier
        request: Task update request with title and description
        current_user_id: Current authenticated user ID from JWT
        session: Database session

    Returns:
        Updated task object

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to another user
    """
    validate_user_id(user_id, current_user_id)
    task = await task_service.update_task(
        task_id=task_id,
        user_id=current_user_id,
        title=request.title,
        description=request.description,
        is_completed=None,
        session=session,
    )
    return task


@router.patch("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task_partial(
    user_id: str,
    task_id: str,
    request: TaskUpdateRequest,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Update a task (partial update).

    Args:
        user_id: User ID from URL path
        task_id: Task's unique identifier
        request: Task update request with optional fields
        current_user_id: Current authenticated user ID from JWT
        session: Database session

    Returns:
        Updated task object

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to another user
    """
    validate_user_id(user_id, current_user_id)
    task = await task_service.update_task(
        task_id=task_id,
        user_id=current_user_id,
        title=request.title,
        description=request.description,
        is_completed=request.is_completed,
        status=request.status,
        category=request.category,
        session=session,
    )
    return task


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: str,
    task_id: str,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Delete a task.

    Args:
        user_id: User ID from URL path
        task_id: Task's unique identifier
        current_user_id: Current authenticated user ID from JWT
        session: Database session

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to another user
    """
    validate_user_id(user_id, current_user_id)
    await task_service.delete_task(task_id, current_user_id, session)
    return None
