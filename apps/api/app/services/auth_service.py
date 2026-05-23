"""
PacketSense API — Authentication Service
Handles user signup, login, and profile operations.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserSignup, UserLogin, UserResponse, AuthResponse
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token


def signup_user(db: Session, data: UserSignup) -> AuthResponse:
    """
    Register a new user.
    Raises 409 if email or username already exists.
    """
    # Check for existing email
    existing_email = db.query(User).filter(User.email == data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Check for existing username
    existing_username = db.query(User).filter(User.username == data.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken",
        )

    # Create user
    user = User(
        email=data.email,
        username=data.username,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate token
    access_token = create_access_token(data={"sub": str(user.id)})

    return AuthResponse(
        user=UserResponse.from_orm_user(user),
        access_token=access_token,
        token_type="bearer",
    )


def login_user(db: Session, data: UserLogin) -> AuthResponse:
    """
    Authenticate a user and return JWT token.
    Raises 401 if credentials are invalid.
    """
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    access_token = create_access_token(data={"sub": str(user.id)})

    return AuthResponse(
        user=UserResponse.from_orm_user(user),
        access_token=access_token,
        token_type="bearer",
    )


def update_user_profile(db: Session, user: User, full_name: str = None, avatar_url: str = None) -> UserResponse:
    """Update user profile fields."""
    if full_name is not None:
        user.full_name = full_name
    if avatar_url is not None:
        user.avatar_url = avatar_url

    db.commit()
    db.refresh(user)
    return UserResponse.from_orm_user(user)
