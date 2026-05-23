"""
PacketSense API — Troubleshoot Session Model
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class TroubleshootSession(Base):
    __tablename__ = "troubleshoot_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    issue_type = Column(String(100), nullable=False)
    answers = Column(JSONB, nullable=True)  # [{question_id, value}]
    diagnosis = Column(JSONB, nullable=True)  # {cause, title, description, solutions, ...}
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="troubleshoot_sessions")

    def __repr__(self) -> str:
        return f"<TroubleshootSession {self.issue_type}>"
