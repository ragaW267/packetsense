"""
PacketSense API — Progress & Simulation Schemas (Pydantic v2)
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


class ProgressUpdate(BaseModel):
    feature: str
    item_key: str
    status: str  # not_started, in_progress, completed
    metadata: Optional[Dict[str, Any]] = None


class ProgressResponse(BaseModel):
    id: str
    feature: str
    item_key: str
    status: str
    metadata: Optional[Dict[str, Any]] = None
    updated_at: datetime

    model_config = {"from_attributes": True}


class SaveSimulationRequest(BaseModel):
    protocol: str
    config: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class SavedSimulationResponse(BaseModel):
    id: str
    protocol: str
    config: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class DashboardStatsResponse(BaseModel):
    total_quizzes: int
    average_score: float
    protocols_viewed: int
    troubleshoot_sessions: int
    streak_days: int


class ActivityItemResponse(BaseModel):
    id: str
    type: str  # quiz, protocol, troubleshoot
    title: str
    detail: str
    timestamp: datetime


class DashboardResponse(BaseModel):
    stats: DashboardStatsResponse
    recent_activity: List[ActivityItemResponse]
