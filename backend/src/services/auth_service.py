"""Authentication service for user management and JWT handling.

This module provides password hashing, JWT token creation/validation,
and authentication dependency for FastAPI endpoints.
"""

from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..config import settings
from ..database import get_session
from ..models.user import User

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer token security
security = HTTPBearer()

# JWT configuration
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 168  # 7 days = 168 hours


def hash_password(password: str) -> str:
    """Hash a plain text password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password string
    """
    # Truncate password to 72 bytes (bcrypt limit)
    password_bytes = password.encode('utf-8')[:72]
    return pwd_context.hash(password_bytes.decode('utf-8', errors='ignore'))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hashed password.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to compare against

    Returns:
        True if password matches, False otherwise
    """
    # Truncate password to 72 bytes (bcrypt limit)
    password_bytes = plain_password.encode('utf-8')[:72]
    return pwd_context.verify(password_bytes.decode('utf-8', errors='ignore'), hashed_password)


def create_access_token(user_id: str, username: str, email: str) -> str:
    """Create a JWT access token for a user.

    Args:
        user_id: User's unique identifier
        username: User's username
        email: User's email address

    Returns:
        JWT token string
    """
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {
        "sub": user_id,  # Subject (user ID)
        "username": username,
        "email": email,
        "exp": expire,
    }
    return jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_session),
) -> str:
    """Dependency to extract and validate user ID from JWT token.

    Args:
        credentials: HTTP Bearer credentials containing JWT token
        session: Database session

    Returns:
        User ID extracted from valid JWT token

    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials

    try:
        # Decode JWT token
        payload = jwt.decode(
            token, settings.BETTER_AUTH_SECRET, algorithms=[ALGORITHM]
        )
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    # Verify user exists in database
    result = await session.execute(select(User).where(User.id == UUID(user_id)))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user_id


async def authenticate_user(
    username_or_email: str, password: str, session: AsyncSession
) -> Optional[User]:
    """Authenticate a user by username or email and password.

    Args:
        username_or_email: User's username or email address
        password: Plain text password
        session: Database session

    Returns:
        User object if authentication successful, None otherwise
    """
    # Check if input is email format
    is_email = "@" in username_or_email

    # Find user by email or username
    if is_email:
        result = await session.execute(select(User).where(User.email == username_or_email))
    else:
        result = await session.execute(select(User).where(User.username == username_or_email))

    user = result.scalar_one_or_none()

    if user is None:
        return None

    # Verify password
    if not verify_password(password, user.hashed_password):
        return None

    return user
