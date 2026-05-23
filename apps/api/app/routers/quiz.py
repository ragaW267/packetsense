"""
PacketSense API — Quiz Router
Handles quiz categories, questions, submission, history, and stats.
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.quiz import (
    QuizCategoryResponse,
    QuizQuestionResponse,
    QuizSubmitRequest,
    QuizResultResponse,
    QuizAttemptSummary,
    QuizStatsResponse,
)
from app.services.quiz_service import (
    get_categories,
    get_questions,
    submit_quiz,
    get_quiz_history,
    get_quiz_stats,
)

router = APIRouter()


@router.get("/categories", response_model=List[QuizCategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """Get all quiz categories with question counts."""
    return get_categories(db)


@router.get("/questions/{category_id}", response_model=List[QuizQuestionResponse])
def list_questions(category_id: str, db: Session = Depends(get_db)):
    """Get questions for a specific category (without answers)."""
    return get_questions(db, category_id)


@router.post("/submit", response_model=QuizResultResponse)
def submit(
    data: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a completed quiz for grading. Requires authentication."""
    return submit_quiz(db, current_user, data)


@router.get("/history", response_model=List[QuizAttemptSummary])
def history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's quiz history."""
    return get_quiz_history(db, current_user)


@router.get("/stats", response_model=QuizStatsResponse)
def stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get aggregate quiz statistics for the current user."""
    return get_quiz_stats(db, current_user)
