"""Database connection and session management.

This module provides async database connection using SQLAlchemy with connection pooling
for Neon Serverless PostgreSQL.
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlmodel import SQLModel

from .config import settings

# Create async engine with connection pooling
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before use
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
    """
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db():
    """Close database connections.

    Should be called on application shutdown.
    """
    await engine.dispose()
