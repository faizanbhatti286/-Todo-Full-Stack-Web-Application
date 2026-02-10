"""Authentication API endpoints.

This module provides user registration, signin, and signout endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from ..database import get_session
from ..models.user import User
from ..schemas.auth import UserSignupRequest, UserSigninRequest, AuthResponse
from ..services.auth_service import (
    hash_password,
    create_access_token,
    authenticate_user,
    get_current_user_id,
)

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: UserSignupRequest,
    session: AsyncSession = Depends(get_session),
):
    """Register a new user account.

    Args:
        request: User signup request with username, email and password
        session: Database session

    Returns:
        AuthResponse with JWT token and user information

    Raises:
        HTTPException 400: If password is too short or username format invalid
        HTTPException 409: If email or username already exists
    """
    # Validate password length
    if len(request.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long",
        )

    if len(request.password) > 128:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must not exceed 128 characters",
        )

    # Hash password
    password_hash = hash_password(request.password)

    # Create new user
    new_user = User(
        username=request.username,
        email=request.email,
        hashed_password=password_hash,
    )

    try:
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
    except IntegrityError as e:
        await session.rollback()
        # Check if it's a username or email conflict
        error_msg = str(e.orig).lower()
        if 'username' in error_msg:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already taken",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

    # Create JWT token
    access_token = create_access_token(str(new_user.id), new_user.username, new_user.email)

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=str(new_user.id),
        username=new_user.username,
        email=new_user.email,
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(
    request: UserSigninRequest,
    session: AsyncSession = Depends(get_session),
):
    """Sign in to an existing account.

    Args:
        request: User signin request with username/email and password
        session: Database session

    Returns:
        AuthResponse with JWT token and user information

    Raises:
        HTTPException 401: If credentials are invalid
    """
    # Authenticate user
    user = await authenticate_user(request.username_or_email, request.password, session)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password",
        )

    # Create JWT token
    access_token = create_access_token(str(user.id), user.username, user.email)

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=str(user.id),
        username=user.username,
        email=user.email,
    )


@router.post("/signout")
async def signout(
    current_user_id: str = Depends(get_current_user_id),
):
    """Sign out current user.

    Note: JWT tokens are stateless, so signout is handled client-side
    by removing the token from storage. This endpoint validates the
    token and returns a success message.

    Args:
        current_user_id: Current authenticated user ID from JWT

    Returns:
        Success message
    """
    return {"message": "Signed out successfully"}
