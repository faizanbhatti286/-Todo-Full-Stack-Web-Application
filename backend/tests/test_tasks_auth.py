"""Tests for task authentication and user isolation.

This module tests that:
- Authenticated users can access their own tasks
- Unauthenticated requests are rejected with 401
- Cross-user access attempts are rejected with 403
- All CRUD operations enforce ownership
"""

import pytest
from httpx import AsyncClient

from src.main import app


@pytest.mark.asyncio
async def test_get_tasks_authenticated(test_session, test_user, test_task, auth_headers, override_get_session):
    """Test authenticated user can retrieve their task list."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/tasks", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["id"] == str(test_task.id)
    assert data[0]["user_id"] == str(test_user.id)


@pytest.mark.asyncio
async def test_get_tasks_unauthenticated(test_session, override_get_session):
    """Test unauthenticated request to get tasks returns 401."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/tasks")

    assert response.status_code == 403  # HTTPBearer returns 403 for missing token


@pytest.mark.asyncio
async def test_get_task_cross_user_access(test_session, test_user, test_user2, test_task, auth_headers2, override_get_session):
    """Test user cannot access another user's task (403 Forbidden)."""
    # test_task belongs to test_user, but we're using test_user2's token
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            f"/tasks/{test_task.id}",
            headers=auth_headers2,
        )

    assert response.status_code == 403
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Not authorized to access this task"


@pytest.mark.asyncio
async def test_create_task_authenticated(test_session, test_user, auth_headers, override_get_session):
    """Test authenticated user can create a task."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/tasks",
            headers=auth_headers,
            json={
                "title": "New Task",
                "description": "Task description",
            },
        )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "New Task"
    assert data["description"] == "Task description"
    assert data["user_id"] == str(test_user.id)
    assert data["is_completed"] is False


@pytest.mark.asyncio
async def test_update_task_by_owner(test_session, test_task, auth_headers, override_get_session):
    """Test task owner can update their task (200 OK)."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.patch(
            f"/tasks/{test_task.id}",
            headers=auth_headers,
            json={
                "title": "Updated Title",
                "is_completed": True,
            },
        )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["is_completed"] is True


@pytest.mark.asyncio
async def test_update_task_by_non_owner(test_session, test_task, auth_headers2, override_get_session):
    """Test non-owner cannot update task (403 Forbidden)."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.patch(
            f"/tasks/{test_task.id}",
            headers=auth_headers2,
            json={
                "title": "Hacked Title",
            },
        )

    assert response.status_code == 403
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Not authorized to access this task"


@pytest.mark.asyncio
async def test_delete_task_by_owner(test_session, test_user, auth_headers, override_get_session):
    """Test task owner can delete their task (204 No Content)."""
    # Create a task to delete
    async with AsyncClient(app=app, base_url="http://test") as client:
        create_response = await client.post(
            "/tasks",
            headers=auth_headers,
            json={"title": "Task to delete"},
        )
        task_id = create_response.json()["id"]

        # Delete the task
        delete_response = await client.delete(
            f"/tasks/{task_id}",
            headers=auth_headers,
        )

    assert delete_response.status_code == 204


@pytest.mark.asyncio
async def test_delete_task_by_non_owner(test_session, test_task, auth_headers2, override_get_session):
    """Test non-owner cannot delete task (403 Forbidden)."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.delete(
            f"/tasks/{test_task.id}",
            headers=auth_headers2,
        )

    assert response.status_code == 403
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Not authorized to access this task"


@pytest.mark.asyncio
async def test_get_tasks_filters_by_user(test_session, test_user, test_user2, auth_headers, auth_headers2, override_get_session):
    """Test that each user only sees their own tasks."""
    # Create tasks for both users
    async with AsyncClient(app=app, base_url="http://test") as client:
        # User 1 creates a task
        await client.post(
            "/tasks",
            headers=auth_headers,
            json={"title": "User 1 Task"},
        )

        # User 2 creates a task
        await client.post(
            "/tasks",
            headers=auth_headers2,
            json={"title": "User 2 Task"},
        )

        # User 1 gets their tasks
        user1_response = await client.get("/tasks", headers=auth_headers)
        user1_tasks = user1_response.json()

        # User 2 gets their tasks
        user2_response = await client.get("/tasks", headers=auth_headers2)
        user2_tasks = user2_response.json()

    # Verify each user only sees their own tasks
    assert all(task["user_id"] == str(test_user.id) for task in user1_tasks)
    assert all(task["user_id"] == str(test_user2.id) for task in user2_tasks)

    # Verify tasks don't overlap
    user1_task_ids = {task["id"] for task in user1_tasks}
    user2_task_ids = {task["id"] for task in user2_tasks}
    assert user1_task_ids.isdisjoint(user2_task_ids)


@pytest.mark.asyncio
async def test_create_task_unauthenticated(test_session, override_get_session):
    """Test unauthenticated user cannot create task (401/403)."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/tasks",
            json={"title": "Unauthorized Task"},
        )

    assert response.status_code == 403  # HTTPBearer returns 403 for missing token


@pytest.mark.asyncio
async def test_update_task_unauthenticated(test_session, test_task, override_get_session):
    """Test unauthenticated user cannot update task (401/403)."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.patch(
            f"/tasks/{test_task.id}",
            json={"title": "Hacked"},
        )

    assert response.status_code == 403


@pytest.mark.asyncio
async def test_delete_task_unauthenticated(test_session, test_task, override_get_session):
    """Test unauthenticated user cannot delete task (401/403)."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.delete(f"/tasks/{test_task.id}")

    assert response.status_code == 403
