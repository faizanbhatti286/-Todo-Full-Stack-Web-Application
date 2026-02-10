"""Task service for managing todo items with user isolation.

This module provides business logic for task operations,
ensuring all queries are filtered by user_id for security.
"""

from typing import List, Optional
from uuid import UUID
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from fastapi import HTTPException, status

from ..models.task import Task


async def get_user_tasks(
    user_id: str,
    session: AsyncSession,
    status_filter: Optional[str] = None,
    category_filter: Optional[str] = None
) -> List[Task]:
    """Get all tasks for a specific user with optional filtering.

    Args:
        user_id: User's unique identifier
        session: Database session
        status_filter: Optional status filter (pending, in_progress, completed)
        category_filter: Optional category filter

    Returns:
        List of tasks belonging to the user, sorted by creation date (newest first)
    """
    query = select(Task).where(Task.user_id == UUID(user_id))

    # Apply status filter if provided
    if status_filter:
        query = query.where(Task.status == status_filter)

    # Apply category filter if provided
    if category_filter:
        query = query.where(Task.category == category_filter)

    query = query.order_by(Task.created_at.desc())

    result = await session.execute(query)
    return result.scalars().all()


async def create_task(
    user_id: str,
    title: str,
    description: Optional[str],
    category: Optional[str],
    session: AsyncSession
) -> Task:
    """Create a new task for a user.

    Args:
        user_id: User's unique identifier
        title: Task title
        description: Optional task description
        category: Task category (defaults to 'general')
        session: Database session

    Returns:
        Created task object
    """
    new_task = Task(
        user_id=UUID(user_id),
        title=title,
        description=description,
        category=category or "general",
        status="pending",
    )

    session.add(new_task)
    await session.commit()
    await session.refresh(new_task)

    return new_task


async def get_task_by_id(
    task_id: str, user_id: str, session: AsyncSession
) -> Task:
    """Get a specific task by ID with ownership validation.

    Args:
        task_id: Task's unique identifier
        user_id: User's unique identifier
        session: Database session

    Returns:
        Task object if found and owned by user

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to another user
    """
    result = await session.execute(
        select(Task).where(Task.id == UUID(task_id))
    )
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Verify ownership
    if str(task.user_id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task",
        )

    return task


async def update_task(
    task_id: str,
    user_id: str,
    title: Optional[str],
    description: Optional[str],
    is_completed: Optional[bool],
    status: Optional[str],
    category: Optional[str],
    session: AsyncSession,
) -> Task:
    """Update a task with ownership validation.

    Args:
        task_id: Task's unique identifier
        user_id: User's unique identifier
        title: Updated title (optional)
        description: Updated description (optional)
        is_completed: Updated completion status (optional)
        status: Updated task status (optional)
        category: Updated task category (optional)
        session: Database session

    Returns:
        Updated task object

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to another user
    """
    task = await get_task_by_id(task_id, user_id, session)

    # Update fields if provided
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if is_completed is not None:
        task.is_completed = is_completed
    if status is not None:
        task.status = status
    if category is not None:
        task.category = category

    # Update timestamp
    task.updated_at = datetime.utcnow()

    await session.commit()
    await session.refresh(task)

    return task


async def delete_task(
    task_id: str, user_id: str, session: AsyncSession
) -> None:
    """Delete a task with ownership validation.

    Args:
        task_id: Task's unique identifier
        user_id: User's unique identifier
        session: Database session

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to another user
    """
    task = await get_task_by_id(task_id, user_id, session)

    await session.delete(task)
    await session.commit()
