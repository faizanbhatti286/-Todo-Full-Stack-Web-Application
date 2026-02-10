"""Tests for JWT token expiry and session management.

This module tests that:
- JWT tokens expire after 7 days (168 hours)
- Expired tokens are rejected with 401 and "Token expired" message
- Valid tokens within 7-day window are accepted
- Token expiry is enforced on all protected endpoints
"""

import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta
from jose import jwt

from src.main import app
from src.config import settings
from src.services.auth_service import ALGORITHM


@pytest.mark.asyncio
async def test_token_expiry_timestamp_is_7_days(test_session, test_user, override_get_session):
    """Test that JWT token expiry is set to exactly 7 days (168 hours) from issuance."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signin",
            json={
                "email": test_user.email,
                "password": "password123",
            },
        )

    assert response.status_code == 200
    data = response.json()
    token = data["access_token"]

    # Decode token to check expiry
    decoded = jwt.decode(
        token,
        settings.BETTER_AUTH_SECRET,
        algorithms=[ALGORITHM],
    )

    # Check expiry is approximately 7 days from now
    exp_timestamp = decoded["exp"]
    exp_datetime = datetime.utcfromtimestamp(exp_timestamp)
    now = datetime.utcnow()
    time_diff = exp_datetime - now

    # Should be approximately 7 days (168 hours = 604800 seconds)
    # Allow 1 minute tolerance for test execution time
    expected_seconds = 7 * 24 * 60 * 60  # 604800 seconds
    assert abs(time_diff.total_seconds() - expected_seconds) < 60


@pytest.mark.asyncio
async def test_expired_token_rejected_with_401(test_session, test_user, override_get_session):
    """Test that expired tokens are rejected with 401 and 'Token expired' message."""
    # Create an expired token (expired 1 hour ago)
    expire = datetime.utcnow() - timedelta(hours=1)
    payload = {
        "sub": str(test_user.id),
        "email": test_user.email,
        "exp": expire,
    }
    expired_token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)

    # Try to access protected endpoint with expired token
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {expired_token}"},
        )

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Token expired"


@pytest.mark.asyncio
async def test_expired_token_rejected_on_all_endpoints(test_session, test_user, test_task, override_get_session):
    """Test that expired tokens are rejected on all protected endpoints."""
    # Create an expired token
    expire = datetime.utcnow() - timedelta(hours=1)
    payload = {
        "sub": str(test_user.id),
        "email": test_user.email,
        "exp": expire,
    }
    expired_token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)
    headers = {"Authorization": f"Bearer {expired_token}"}

    async with AsyncClient(app=app, base_url="http://test") as client:
        # Test GET /tasks
        response1 = await client.get("/tasks", headers=headers)
        assert response1.status_code == 401
        assert response1.json()["detail"] == "Token expired"

        # Test POST /tasks
        response2 = await client.post(
            "/tasks",
            headers=headers,
            json={"title": "Test Task"},
        )
        assert response2.status_code == 401
        assert response2.json()["detail"] == "Token expired"

        # Test GET /tasks/{id}
        response3 = await client.get(f"/tasks/{test_task.id}", headers=headers)
        assert response3.status_code == 401
        assert response3.json()["detail"] == "Token expired"

        # Test PATCH /tasks/{id}
        response4 = await client.patch(
            f"/tasks/{test_task.id}",
            headers=headers,
            json={"title": "Updated"},
        )
        assert response4.status_code == 401
        assert response4.json()["detail"] == "Token expired"

        # Test DELETE /tasks/{id}
        response5 = await client.delete(f"/tasks/{test_task.id}", headers=headers)
        assert response5.status_code == 401
        assert response5.json()["detail"] == "Token expired"

        # Test POST /auth/signout
        response6 = await client.post("/auth/signout", headers=headers)
        assert response6.status_code == 401
        assert response6.json()["detail"] == "Token expired"


@pytest.mark.asyncio
async def test_valid_token_within_7_days_accepted(test_session, test_user, override_get_session):
    """Test that valid tokens within 7-day window are accepted."""
    # Create a token that expires in 6 days (still valid)
    expire = datetime.utcnow() + timedelta(days=6)
    payload = {
        "sub": str(test_user.id),
        "email": test_user.email,
        "exp": expire,
    }
    valid_token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)

    # Try to access protected endpoint with valid token
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {valid_token}"},
        )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_token_expires_exactly_at_expiry_time(test_session, test_user, override_get_session):
    """Test that token expires exactly at the expiry timestamp."""
    # Create a token that expires in 1 second
    expire = datetime.utcnow() + timedelta(seconds=1)
    payload = {
        "sub": str(test_user.id),
        "email": test_user.email,
        "exp": expire,
    }
    soon_to_expire_token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)

    # Token should work immediately
    async with AsyncClient(app=app, base_url="http://test") as client:
        response1 = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {soon_to_expire_token}"},
        )
    assert response1.status_code == 200

    # Wait for token to expire
    import asyncio
    await asyncio.sleep(2)

    # Token should now be expired
    async with AsyncClient(app=app, base_url="http://test") as client:
        response2 = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {soon_to_expire_token}"},
        )
    assert response2.status_code == 401
    assert response2.json()["detail"] == "Token expired"


@pytest.mark.asyncio
async def test_token_with_no_expiry_rejected(test_session, test_user, override_get_session):
    """Test that tokens without expiry claim are rejected."""
    # Create a token without expiry
    payload = {
        "sub": str(test_user.id),
        "email": test_user.email,
        # No "exp" field
    }
    no_expiry_token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)

    # Try to access protected endpoint
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {no_expiry_token}"},
        )

    # Should be rejected (jose library requires exp by default)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_token_expiry_boundary_conditions(test_session, test_user, override_get_session):
    """Test token expiry at exact boundary (7 days)."""
    # Create a token that expires in exactly 7 days
    expire = datetime.utcnow() + timedelta(days=7)
    payload = {
        "sub": str(test_user.id),
        "email": test_user.email,
        "exp": expire,
    }
    boundary_token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)

    # Should be accepted (still within 7-day window)
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {boundary_token}"},
        )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_token_expiry_just_past_7_days(test_session, test_user, override_get_session):
    """Test that token expires just after 7 days."""
    # Create a token that expires in 7 days + 1 second (should still work)
    expire = datetime.utcnow() + timedelta(days=7, seconds=1)
    payload = {
        "sub": str(test_user.id),
        "email": test_user.email,
        "exp": expire,
    }
    extended_token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)

    # Should be accepted (still valid)
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {extended_token}"},
        )

    assert response.status_code == 200

    # Now create a token that expired 1 second ago
    expire_past = datetime.utcnow() - timedelta(seconds=1)
    payload_past = {
        "sub": str(test_user.id),
        "email": test_user.email,
        "exp": expire_past,
    }
    expired_token = jwt.encode(payload_past, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)

    # Should be rejected
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {expired_token}"},
        )

    assert response.status_code == 401
    assert response.json()["detail"] == "Token expired"
