"""
PacketSense API — Authentication Router
Handles signup, login, profile retrieval and update.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.user import (
    UserSignup,
    UserLogin,
    UserResponse,
    UserUpdate,
    AuthResponse,
)
from app.services.auth_service import signup_user, login_user, update_user_profile

router = APIRouter()


@router.post("/signup", response_model=AuthResponse)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    """Register a new user account."""
    return signup_user(db, data)


@router.post("/login", response_model=AuthResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate and receive a JWT access token."""
    return login_user(db, data)


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return UserResponse.from_orm_user(current_user)


@router.put("/me", response_model=UserResponse)
def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the current user's profile."""
    return update_user_profile(
        db, current_user,
        full_name=data.full_name,
        avatar_url=data.avatar_url,
    )
