"""Database connection and session management.

This module provides async database connection using SQLAlchemy with connection pooling
for Neon Serverless PostgreSQL.
"""

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlmodel import SQLModel

from .config import settings

# Create async engine with connection pooling
# Neon-specific settings for serverless PostgreSQL
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before use
    connect_args={
        "timeout": 30,  # Increased timeout for Neon cold starts
        "command_timeout": 30,
        "server_settings": {
            "application_name": "todo_backend",
        },
    },
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncSession:
    """Dependency for getting async database sessions.

    Yields:
        AsyncSession: Database session for use in FastAPI dependencies
    """
    async with async_session_maker() as session:
        yield session


async def init_db():
    """Initialize database tables.

    Creates all tables defined in SQLModel models.
    Should be called on application startup.
    Includes retry logic for Neon Serverless cold starts.
    """
    max_retries = 3
    retry_delay = 2

    for attempt in range(max_retries):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(SQLModel.metadata.create_all)
            print("[OK] Database connection established and tables initialized")
            return
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"[!] Database connection attempt {attempt + 1} failed, retrying in {retry_delay}s...")
                await asyncio.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                print(f"[ERROR] Database connection failed after {max_retries} attempts")
                raise


async def close_db():
    """Close database connections.

    Should be called on application shutdown.
    """
    await engine.dispose()
