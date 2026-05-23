"""
PacketSense API — Troubleshoot Schemas (Pydantic v2)
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class TroubleshootIssueResponse(BaseModel):
    type: str
    label: str
    description: str
    icon: str


class TroubleshootQuestionOption(BaseModel):
    label: str
    value: str


class TroubleshootQuestionResponse(BaseModel):
    id: str
    text: str
    options: List[TroubleshootQuestionOption]


class TroubleshootAnswerItem(BaseModel):
    question_id: str
    value: str


class TroubleshootAnalyzeRequest(BaseModel):
    issue_type: str
    answers: List[TroubleshootAnswerItem]


class DiagnosisResponse(BaseModel):
    cause: str
    title: str
    description: str
    confidence: float
    solutions: List[str]
    related_protocols: List[str]


class TroubleshootResultResponse(BaseModel):
    id: str
    issue_type: str
    diagnosis: DiagnosisResponse
    created_at: datetime


class TroubleshootHistoryItem(BaseModel):
    id: str
    issue_type: str
    diagnosis_title: str
    created_at: datetime


class ExplainRequest(BaseModel):
    topic: str
    context: Optional[str] = None


class ExplainResponse(BaseModel):
    topic: str
    explanation: str
    analogy: str
    key_points: List[str]
    related_topics: List[str]
