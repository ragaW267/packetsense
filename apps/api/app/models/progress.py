"""
PacketSense API — Progress & Saved Simulation Models
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    feature = Column(String(50), nullable=False)  # "protocols", "quiz", "troubleshoot"
    item_key = Column(String(100), nullable=False)  # e.g. "tcp-handshake", "osi-model"
    status = Column(
        String(20), nullable=False, default="not_started"
    )  # not_started, in_progress, completed
    metadata_ = Column("metadata", JSONB, nullable=True)  # Additional data
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="progress")

    def __repr__(self) -> str:
        return f"<UserProgress {self.feature}/{self.item_key} = {self.status}>"


class SavedSimulation(Base):
    __tablename__ = "saved_simulations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    protocol = Column(String(50), nullable=False)
    config = Column(JSONB, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="saved_simulations")

    def __repr__(self) -> str:
        return f"<SavedSimulation {self.protocol}>"
