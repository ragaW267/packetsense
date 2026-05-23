"""
PacketSense API — Explain Engine
Rule-based explanation system that provides student-friendly explanations
of networking concepts. Uses templates instead of paid AI APIs.
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional, List

DATA_DIR = Path(__file__).parent.parent.parent / "data"

_templates_cache: Optional[Dict[str, Any]] = None


def _load_templates() -> Dict[str, Any]:
    """Load explanation templates from JSON file (cached)."""
    global _templates_cache
    if _templates_cache is not None:
        return _templates_cache

    templates_file = DATA_DIR / "explain_templates.json"
    if not templates_file.exists():
        _templates_cache = {}
        return _templates_cache

    with open(templates_file, "r", encoding="utf-8") as f:
        _templates_cache = json.load(f)
    return _templates_cache


def get_topics() -> List[Dict[str, str]]:
    """Get all available explanation topics."""
    templates = _load_templates()
    topics = []
    for key, data in templates.get("topics", {}).items():
        topics.append({
            "key": key,
            "label": data.get("label", key),
            "category": data.get("category", "general"),
        })
    return topics


def explain_topic(topic: str, context: Optional[str] = None) -> Dict[str, Any]:
    """
    Generate a student-friendly explanation for a networking topic.
    
    Uses pre-written templates with optional context-aware adjustments.
    """
    templates = _load_templates()
    topic_data = templates.get("topics", {}).get(topic)

    if not topic_data:
        # Fuzzy match: try to find partial match
        for key, data in templates.get("topics", {}).items():
            if topic.lower() in key.lower() or topic.lower() in data.get("label", "").lower():
                topic_data = data
                break

    if not topic_data:
        return {
            "topic": topic,
            "explanation": f"'{topic}' is a networking concept. Unfortunately, we don't have a detailed explanation for this topic yet. Check back soon as we're always adding new content!",
            "analogy": "Think of it like a new chapter in a textbook that hasn't been written yet.",
            "key_points": [
                "This topic is related to computer networking",
                "Try searching for it in your networking textbook",
                "Ask your instructor for more details",
            ],
            "related_topics": [],
        }

    explanation = topic_data.get("explanation", "")
    analogy = topic_data.get("analogy", "")
    key_points = topic_data.get("key_points", [])
    related = topic_data.get("related_topics", [])

    # If context is provided (e.g., from troubleshoot), add context-specific info
    if context and "context_additions" in topic_data:
        ctx_data = topic_data["context_additions"].get(context, {})
        if ctx_data:
            explanation += "\n\n" + ctx_data.get("additional", "")
            key_points.extend(ctx_data.get("extra_points", []))

    return {
        "topic": topic,
        "explanation": explanation,
        "analogy": analogy,
        "key_points": key_points,
        "related_topics": related,
    }
