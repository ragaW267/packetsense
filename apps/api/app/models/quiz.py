"""
PacketSense API — Quiz Models
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class QuizCategory(Base):
    __tablename__ = "quiz_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)

    questions = relationship("QuizQuestion", back_populates="category", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="category")

    def __repr__(self) -> str:
        return f"<QuizCategory {self.name}>"


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id = Column(
        UUID(as_uuid=True), ForeignKey("quiz_categories.id"), nullable=False
    )
    question = Column(Text, nullable=False)
    options = Column(JSONB, nullable=False)  # ["option1", "option2", "option3", "option4"]
    correct_answer = Column(Integer, nullable=False)  # 0-based index
    explanation = Column(Text, nullable=True)
    difficulty = Column(String(20), nullable=False, default="medium")  # easy, medium, hard

    category = relationship("QuizCategory", back_populates="questions")

    def __repr__(self) -> str:
        return f"<QuizQuestion {self.question[:50]}>"


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    category_id = Column(
        UUID(as_uuid=True), ForeignKey("quiz_categories.id"), nullable=False
    )
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    answers = Column(JSONB, nullable=True)  # [{question_id, selected, correct, is_correct}]
    completed_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="quiz_attempts")
    category = relationship("QuizCategory", back_populates="attempts")

    def __repr__(self) -> str:
        return f"<QuizAttempt user={self.user_id} score={self.score}/{self.total_questions}>"
