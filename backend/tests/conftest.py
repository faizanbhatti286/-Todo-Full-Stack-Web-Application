"""Pytest fixtures for authentication tests.

This module provides reusable fixtures for creating test users,
generating JWT tokens, and setting up test database sessions.
"""

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlmodel import SQLModel

from src.database import get_session
from src.models.user import User
from src.models.task import Task
from src.services.auth_service import hash_password, create_access_token
from src.main import app


# Test database URL (use in-memory SQLite for tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def test_engine():
    """Create a test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        future=True,
    )

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

    await engine.dispose()


@pytest.fixture(scope="function")
async def test_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session."""
    async_session = async_sessionmaker(
        test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with async_session() as session:
        yield session


@pytest.fixture(scope="function")
async def test_user(test_session: AsyncSession) -> User:
    """Create a test user in the database.

    Returns:
        User object with email "test@example.com" and password "password123"
    """
    user = User(
        email="test@example.com",
        password_hash=hash_password("password123"),
    )
    test_session.add(user)
    await test_session.commit()
    await test_session.refresh(user)
    return user


@pytest.fixture(scope="function")
async def test_user2(test_session: AsyncSession) -> User:
    """Create a second test user in the database.

    Returns:
        User object with email "test2@example.com" and password "password456"
    """
    user = User(
        email="test2@example.com",
        password_hash=hash_password("password456"),
    )
    test_session.add(user)
    await test_session.commit()
    await test_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_user_token(test_user: User) -> str:
    """Generate a JWT token for the test user.

    Args:
        test_user: Test user fixture

    Returns:
        JWT token string valid for 7 days
    """
    return create_access_token(str(test_user.id), test_user.email)


@pytest.fixture(scope="function")
def test_user2_token(test_user2: User) -> str:
    """Generate a JWT token for the second test user.

    Args:
        test_user2: Second test user fixture

    Returns:
        JWT token string valid for 7 days
    """
    return create_access_token(str(test_user2.id), test_user2.email)


@pytest.fixture(scope="function")
def auth_headers(test_user_token: str) -> dict:
    """Create authorization headers with JWT token.

    Args:
        test_user_token: JWT token for test user

    Returns:
        Dictionary with Authorization header
    """
    return {"Authorization": f"Bearer {test_user_token}"}


@pytest.fixture(scope="function")
def auth_headers2(test_user2_token: str) -> dict:
    """Create authorization headers with JWT token for second user.

    Args:
        test_user2_token: JWT token for second test user

    Returns:
        Dictionary with Authorization header
    """
    return {"Authorization": f"Bearer {test_user2_token}"}


@pytest.fixture(scope="function")
async def test_task(test_session: AsyncSession, test_user: User) -> Task:
    """Create a test task for the test user.

    Args:
        test_session: Test database session
        test_user: Test user fixture

    Returns:
        Task object belonging to test user
    """
    task = Task(
        user_id=test_user.id,
        title="Test Task",
        description="This is a test task",
        is_completed=False,
    )
    test_session.add(task)
    await test_session.commit()
    await test_session.refresh(task)
    return task


# Override the get_session dependency for tests
@pytest.fixture(scope="function")
def override_get_session(test_session: AsyncSession):
    """Override the get_session dependency with test session."""
    async def _get_test_session():
        yield test_session

    app.dependency_overrides[get_session] = _get_test_session
    yield
    app.dependency_overrides.clear()
