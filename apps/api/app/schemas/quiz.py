"""
PacketSense API — Quiz Schemas (Pydantic v2)
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class QuizCategoryResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    question_count: int = 0

    model_config = {"from_attributes": True}


class QuizQuestionResponse(BaseModel):
    id: str
    category_id: str
    question: str
    options: List[str]
    difficulty: str

    model_config = {"from_attributes": True}


class QuizQuestionWithAnswer(BaseModel):
    """Full question with correct answer — only used in result responses."""
    id: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: Optional[str] = None
    difficulty: str

    model_config = {"from_attributes": True}


class AnswerItem(BaseModel):
    question_id: str
    selected: int  # 0-based index


class QuizSubmitRequest(BaseModel):
    category_id: str
    answers: List[AnswerItem]


class QuizResultDetail(BaseModel):
    question_id: str
    question: str
    options: List[str]
    selected: int
    correct: int
    is_correct: bool
    explanation: Optional[str] = None


class QuizResultResponse(BaseModel):
    id: str
    category_id: str
    category_name: str
    score: int
    total_questions: int
    percentage: float
    details: List[QuizResultDetail]
    completed_at: datetime


class QuizAttemptSummary(BaseModel):
    id: str
    category_name: str
    score: int
    total_questions: int
    percentage: float
    completed_at: datetime


class QuizStatsResponse(BaseModel):
    total_attempts: int
    average_score: float
    best_category: Optional[str] = None
    categories_attempted: int
    recent_attempts: List[QuizAttemptSummary]
