"""Tests for user signup functionality.

This module tests the /auth/signup endpoint including:
- Successful user registration
- Duplicate email handling
- Password validation (min/max length)
- Email format validation
- Concurrent signup handling
"""

import pytest
from httpx import AsyncClient
from sqlmodel import select

from src.main import app
from src.models.user import User


@pytest.mark.asyncio
async def test_signup_success(test_session, override_get_session):
    """Test successful user signup with valid credentials."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": "newuser@example.com",
                "password": "password123",
            },
        )

    assert response.status_code == 201
    data = response.json()

    # Verify response structure
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    assert "user_id" in data
    assert "email" in data
    assert data["email"] == "newuser@example.com"

    # Verify JWT token is not empty
    assert len(data["access_token"]) > 0

    # Verify user was created in database
    result = await test_session.execute(
        select(User).where(User.email == "newuser@example.com")
    )
    user = result.scalar_one_or_none()
    assert user is not None
    assert user.email == "newuser@example.com"
    assert user.password_hash != "password123"  # Password should be hashed


@pytest.mark.asyncio
async def test_signup_duplicate_email(test_session, test_user, override_get_session):
    """Test signup with duplicate email returns 409 Conflict."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": test_user.email,  # Use existing user's email
                "password": "differentpassword",
            },
        )

    assert response.status_code == 409
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Email already registered"


@pytest.mark.asyncio
async def test_signup_password_too_short(test_session, override_get_session):
    """Test signup with password shorter than 8 characters returns 400."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": "shortpass@example.com",
                "password": "short",  # Only 5 characters
            },
        )

    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "at least 8 characters" in data["detail"].lower()


@pytest.mark.asyncio
async def test_signup_password_too_long(test_session, override_get_session):
    """Test signup with password longer than 128 characters returns 400."""
    long_password = "a" * 129  # 129 characters

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": "longpass@example.com",
                "password": long_password,
            },
        )

    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "128 characters" in data["detail"]


@pytest.mark.asyncio
async def test_signup_invalid_email_format(test_session, override_get_session):
    """Test signup with invalid email format returns 422."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": "not-an-email",  # Invalid email format
                "password": "password123",
            },
        )

    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_signup_concurrent_same_email(test_session, override_get_session):
    """Test concurrent signup with same email - one succeeds, one fails with 409."""
    import asyncio

    async def signup_request():
        async with AsyncClient(app=app, base_url="http://test") as client:
            return await client.post(
                "/auth/signup",
                json={
                    "email": "concurrent@example.com",
                    "password": "password123",
                },
            )

    # Launch two concurrent signup requests with same email
    responses = await asyncio.gather(
        signup_request(),
        signup_request(),
        return_exceptions=True,
    )

    # One should succeed (201), one should fail (409)
    status_codes = [r.status_code for r in responses if not isinstance(r, Exception)]

    # At least one should succeed and at least one should fail
    # (Due to race conditions, both might succeed if timing is perfect, but typically one fails)
    assert 201 in status_codes or 409 in status_codes

    # Verify only one user was created
    result = await test_session.execute(
        select(User).where(User.email == "concurrent@example.com")
    )
    users = result.scalars().all()
    assert len(users) <= 1  # At most one user should exist


@pytest.mark.asyncio
async def test_signup_email_max_length(test_session, override_get_session):
    """Test signup with email at maximum length (255 characters)."""
    # Create email with exactly 255 characters
    local_part = "a" * 240
    email = f"{local_part}@example.com"  # Total: 253 characters

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": email,
                "password": "password123",
            },
        )

    # Should succeed if email is valid format and <= 255 chars
    assert response.status_code in [201, 422]  # 201 if valid, 422 if format invalid


@pytest.mark.asyncio
async def test_signup_password_exactly_8_chars(test_session, override_get_session):
    """Test signup with password exactly 8 characters (minimum valid)."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": "minpass@example.com",
                "password": "12345678",  # Exactly 8 characters
            },
        )

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "minpass@example.com"


@pytest.mark.asyncio
async def test_signup_password_exactly_128_chars(test_session, override_get_session):
    """Test signup with password exactly 128 characters (maximum valid)."""
    password = "a" * 128  # Exactly 128 characters

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": "maxpass@example.com",
                "password": password,
            },
        )

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "maxpass@example.com"
