"""
PacketSense API — Troubleshoot Router
Handles issue listing, adaptive questions, diagnosis analysis, and history.
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.troubleshoot import TroubleshootSession
from app.schemas.troubleshoot import (
    TroubleshootIssueResponse,
    TroubleshootQuestionResponse,
    TroubleshootQuestionOption,
    TroubleshootAnalyzeRequest,
    TroubleshootResultResponse,
    DiagnosisResponse,
    TroubleshootHistoryItem,
)
from app.services.troubleshoot_engine import get_issues, get_questions, analyze

router = APIRouter()


@router.get("/issues", response_model=List[TroubleshootIssueResponse])
def list_issues():
    """Get all available troubleshoot issue types."""
    issues = get_issues()
    return [TroubleshootIssueResponse(**i) for i in issues]


@router.get("/questions/{issue_type}", response_model=List[TroubleshootQuestionResponse])
def list_questions(issue_type: str):
    """Get adaptive diagnostic questions for an issue type."""
    questions = get_questions(issue_type)
    result = []
    for q in questions:
        result.append(
            TroubleshootQuestionResponse(
                id=q["id"],
                text=q["text"],
                options=[
                    TroubleshootQuestionOption(label=opt["label"], value=opt["value"])
                    for opt in q.get("options", [])
                ],
            )
        )
    return result


@router.post("/analyze", response_model=TroubleshootResultResponse)
def analyze_issue(
    data: TroubleshootAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit troubleshoot answers and receive a diagnosis."""
    answers_dicts = [{"question_id": a.question_id, "value": a.value} for a in data.answers]
    diagnosis = analyze(data.issue_type, answers_dicts)

    # Save session
    session = TroubleshootSession(
        user_id=current_user.id,
        issue_type=data.issue_type,
        answers=[a.model_dump() for a in data.answers],
        diagnosis=diagnosis,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return TroubleshootResultResponse(
        id=str(session.id),
        issue_type=data.issue_type,
        diagnosis=DiagnosisResponse(**diagnosis),
        created_at=session.created_at,
    )


@router.get("/history", response_model=List[TroubleshootHistoryItem])
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's troubleshoot session history."""
    sessions = (
        db.query(TroubleshootSession)
        .filter(TroubleshootSession.user_id == current_user.id)
        .order_by(TroubleshootSession.created_at.desc())
        .limit(50)
        .all()
    )
    return [
        TroubleshootHistoryItem(
            id=str(s.id),
            issue_type=s.issue_type,
            diagnosis_title=s.diagnosis.get("title", "Unknown") if s.diagnosis else "Unknown",
            created_at=s.created_at,
        )
        for s in sessions
    ]
