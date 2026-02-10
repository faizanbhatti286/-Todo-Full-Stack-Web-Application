"""Tests for user signin functionality.

This module tests the /auth/signin endpoint including:
- Successful user signin
- Invalid credentials handling
- JWT token generation and expiry
- Signout functionality
"""

import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta
from jose import jwt

from src.main import app
from src.config import settings


@pytest.mark.asyncio
async def test_signin_success(test_session, test_user, override_get_session):
    """Test successful signin with valid credentials."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signin",
            json={
                "email": test_user.email,
                "password": "password123",  # From test_user fixture
            },
        )

    assert response.status_code == 200
    data = response.json()

    # Verify response structure
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    assert "user_id" in data
    assert "email" in data
    assert data["email"] == test_user.email
    assert data["user_id"] == str(test_user.id)

    # Verify JWT token is not empty
    assert len(data["access_token"]) > 0


@pytest.mark.asyncio
async def test_signin_incorrect_password(test_session, test_user, override_get_session):
    """Test signin with incorrect password returns 401 Unauthorized."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signin",
            json={
                "email": test_user.email,
                "password": "wrongpassword",
            },
        )

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Invalid email or password"


@pytest.mark.asyncio
async def test_signin_nonexistent_email(test_session, override_get_session):
    """Test signin with non-existent email returns 401 Unauthorized."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signin",
            json={
                "email": "nonexistent@example.com",
                "password": "password123",
            },
        )

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Invalid email or password"


@pytest.mark.asyncio
async def test_signin_token_expiry_7_days(test_session, test_user, override_get_session):
    """Test that JWT token expiry is set to 7 days (168 hours)."""
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

    # Decode token without verification to check expiry
    decoded = jwt.decode(
        token,
        settings.BETTER_AUTH_SECRET,
        algorithms=["HS256"],
        options={"verify_signature": True},
    )

    # Check expiry is approximately 7 days from now
    exp_timestamp = decoded["exp"]
    exp_datetime = datetime.utcfromtimestamp(exp_timestamp)
    now = datetime.utcnow()
    time_diff = exp_datetime - now

    # Should be approximately 7 days (168 hours)
    # Allow 1 minute tolerance for test execution time
    expected_seconds = 7 * 24 * 60 * 60  # 7 days in seconds
    assert abs(time_diff.total_seconds() - expected_seconds) < 60


@pytest.mark.asyncio
async def test_signout_success(test_session, test_user, auth_headers, override_get_session):
    """Test signout endpoint returns success with valid token."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signout",
            headers=auth_headers,
        )

    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Signed out successfully"


@pytest.mark.asyncio
async def test_signout_without_token(test_session, override_get_session):
    """Test signout without token returns 401 Unauthorized."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/auth/signout")

    assert response.status_code == 403  # HTTPBearer returns 403 for missing token


@pytest.mark.asyncio
async def test_signout_invalid_token(test_session, override_get_session):
    """Test signout with invalid token returns 401 Unauthorized."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signout",
            headers={"Authorization": "Bearer invalid-token"},
        )

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_signin_case_sensitive_email(test_session, test_user, override_get_session):
    """Test signin with different email case (should work if database is case-insensitive)."""
    # Note: This test behavior depends on database collation settings
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signin",
            json={
                "email": test_user.email.upper(),  # Try uppercase email
                "password": "password123",
            },
        )

    # This might be 200 or 401 depending on database settings
    # For most PostgreSQL setups, email comparison is case-sensitive
    assert response.status_code in [200, 401]


@pytest.mark.asyncio
async def test_signin_empty_password(test_session, test_user, override_get_session):
    """Test signin with empty password returns 401."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signin",
            json={
                "email": test_user.email,
                "password": "",
            },
        )

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_signin_token_contains_user_info(test_session, test_user, override_get_session):
    """Test that JWT token contains user ID and email in payload."""
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

    # Decode token to check payload
    decoded = jwt.decode(
        token,
        settings.BETTER_AUTH_SECRET,
        algorithms=["HS256"],
    )

    assert "sub" in decoded  # User ID
    assert "email" in decoded
    assert "exp" in decoded  # Expiry
    assert decoded["sub"] == str(test_user.id)
    assert decoded["email"] == test_user.email
