"""
PacketSense API — Quiz Service
Handles quiz data loading, question retrieval, submission, and statistics.
"""

import json
import uuid
from pathlib import Path
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.quiz import QuizCategory, QuizQuestion, QuizAttempt
from app.models.user import User
from app.schemas.quiz import (
    QuizCategoryResponse,
    QuizQuestionResponse,
    QuizSubmitRequest,
    QuizResultResponse,
    QuizResultDetail,
    QuizAttemptSummary,
    QuizStatsResponse,
)

DATA_DIR = Path(__file__).parent.parent.parent / "data"


def seed_quiz_data(db: Session) -> None:
    """
    Load quiz data from JSON into the database if not already present.
    Called on first access or via admin endpoint.
    """
    existing = db.query(QuizCategory).count()
    if existing > 0:
        return

    quiz_file = DATA_DIR / "quiz_questions.json"
    if not quiz_file.exists():
        return

    with open(quiz_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    for cat_data in data.get("categories", []):
        category = QuizCategory(
            id=uuid.uuid4(),
            name=cat_data["name"],
            description=cat_data.get("description", ""),
            icon=cat_data.get("icon", "📚"),
        )
        db.add(category)
        db.flush()

        for q in cat_data.get("questions", []):
            question = QuizQuestion(
                id=uuid.uuid4(),
                category_id=category.id,
                question=q["question"],
                options=q["options"],
                correct_answer=q["correct_answer"],
                explanation=q.get("explanation", ""),
                difficulty=q.get("difficulty", "medium"),
            )
            db.add(question)

    db.commit()


def get_categories(db: Session) -> List[QuizCategoryResponse]:
    """Get all quiz categories with question counts."""
    seed_quiz_data(db)

    categories = db.query(QuizCategory).all()
    result = []
    for cat in categories:
        count = db.query(QuizQuestion).filter(QuizQuestion.category_id == cat.id).count()
        result.append(
            QuizCategoryResponse(
                id=str(cat.id),
                name=cat.name,
                description=cat.description,
                icon=cat.icon,
                question_count=count,
            )
        )
    return result


def get_questions(db: Session, category_id: str) -> List[QuizQuestionResponse]:
    """Get all questions for a category (without answers for quiz-taking)."""
    seed_quiz_data(db)

    try:
        cat_uuid = uuid.UUID(category_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid category ID")

    category = db.query(QuizCategory).filter(QuizCategory.id == cat_uuid).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    questions = (
        db.query(QuizQuestion)
        .filter(QuizQuestion.category_id == cat_uuid)
        .all()
    )

    return [
        QuizQuestionResponse(
            id=str(q.id),
            category_id=str(q.category_id),
            question=q.question,
            options=q.options,
            difficulty=q.difficulty,
        )
        for q in questions
    ]


def submit_quiz(db: Session, user: User, data: QuizSubmitRequest) -> QuizResultResponse:
    """
    Grade and save a quiz attempt.
    Returns detailed results with correct answers and explanations.
    """
    try:
        cat_uuid = uuid.UUID(data.category_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid category ID")

    category = db.query(QuizCategory).filter(QuizCategory.id == cat_uuid).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Build question lookup
    questions = (
        db.query(QuizQuestion)
        .filter(QuizQuestion.category_id == cat_uuid)
        .all()
    )
    q_map = {str(q.id): q for q in questions}

    # Grade answers
    score = 0
    details = []
    answers_json = []

    for ans in data.answers:
        q = q_map.get(ans.question_id)
        if not q:
            continue

        is_correct = ans.selected == q.correct_answer
        if is_correct:
            score += 1

        detail = QuizResultDetail(
            question_id=str(q.id),
            question=q.question,
            options=q.options,
            selected=ans.selected,
            correct=q.correct_answer,
            is_correct=is_correct,
            explanation=q.explanation,
        )
        details.append(detail)
        answers_json.append({
            "question_id": str(q.id),
            "selected": ans.selected,
            "correct": q.correct_answer,
            "is_correct": is_correct,
        })

    total = len(details)

    # Save attempt
    attempt = QuizAttempt(
        user_id=user.id,
        category_id=cat_uuid,
        score=score,
        total_questions=total,
        answers=answers_json,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return QuizResultResponse(
        id=str(attempt.id),
        category_id=str(cat_uuid),
        category_name=category.name,
        score=score,
        total_questions=total,
        percentage=round((score / total * 100) if total > 0 else 0, 1),
        details=details,
        completed_at=attempt.completed_at,
    )


def get_quiz_history(db: Session, user: User) -> List[QuizAttemptSummary]:
    """Get user's quiz attempt history, most recent first."""
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user.id)
        .order_by(QuizAttempt.completed_at.desc())
        .limit(50)
        .all()
    )

    result = []
    for a in attempts:
        cat = db.query(QuizCategory).filter(QuizCategory.id == a.category_id).first()
        result.append(
            QuizAttemptSummary(
                id=str(a.id),
                category_name=cat.name if cat else "Unknown",
                score=a.score,
                total_questions=a.total_questions,
                percentage=round((a.score / a.total_questions * 100) if a.total_questions > 0 else 0, 1),
                completed_at=a.completed_at,
            )
        )
    return result


def get_quiz_stats(db: Session, user: User) -> QuizStatsResponse:
    """Get aggregate quiz statistics for a user."""
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user.id)
        .all()
    )

    total = len(attempts)
    if total == 0:
        return QuizStatsResponse(
            total_attempts=0,
            average_score=0.0,
            best_category=None,
            categories_attempted=0,
            recent_attempts=[],
        )

    avg = sum(
        (a.score / a.total_questions * 100) if a.total_questions > 0 else 0
        for a in attempts
    ) / total

    # Best category by average score
    cat_scores: dict = {}
    for a in attempts:
        cid = str(a.category_id)
        pct = (a.score / a.total_questions * 100) if a.total_questions > 0 else 0
        cat_scores.setdefault(cid, []).append(pct)

    best_cat_id = max(cat_scores, key=lambda k: sum(cat_scores[k]) / len(cat_scores[k]))
    try:
        best_cat = db.query(QuizCategory).filter(QuizCategory.id == uuid.UUID(best_cat_id)).first()
        best_cat_name = best_cat.name if best_cat else None
    except Exception:
        best_cat_name = None

    recent = get_quiz_history(db, user)[:5]

    return QuizStatsResponse(
        total_attempts=total,
        average_score=round(avg, 1),
        best_category=best_cat_name,
        categories_attempted=len(cat_scores),
        recent_attempts=recent,
    )
