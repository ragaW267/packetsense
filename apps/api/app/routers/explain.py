"""
PacketSense API — Explain Router
Provides student-friendly explanations of networking concepts.
"""

from typing import List, Dict
from fastapi import APIRouter

from app.schemas.troubleshoot import ExplainRequest, ExplainResponse
from app.services.explain_engine import get_topics, explain_topic

router = APIRouter()


@router.get("/topics")
def list_topics() -> List[Dict[str, str]]:
    """Get all available explanation topics."""
    return get_topics()


@router.post("", response_model=ExplainResponse)
def explain(data: ExplainRequest):
    """Get a student-friendly explanation for a networking topic."""
    result = explain_topic(data.topic, data.context)
    return ExplainResponse(**result)
