"""
PacketSense API — Troubleshoot Engine
Decision-tree based diagnostic engine for network troubleshooting.
Loads rules from JSON and provides adaptive questioning with diagnosis.
"""

import json
from pathlib import Path
from typing import List, Optional, Dict, Any

DATA_DIR = Path(__file__).parent.parent.parent / "data"

_rules_cache: Optional[Dict[str, Any]] = None


def _load_rules() -> Dict[str, Any]:
    """Load troubleshoot rules from JSON file (cached)."""
    global _rules_cache
    if _rules_cache is not None:
        return _rules_cache

    rules_file = DATA_DIR / "troubleshoot_rules.json"
    if not rules_file.exists():
        _rules_cache = {}
        return _rules_cache

    with open(rules_file, "r", encoding="utf-8") as f:
        _rules_cache = json.load(f)
    return _rules_cache


def get_issues() -> List[Dict[str, str]]:
    """Get all available issue types for the troubleshoot wizard."""
    rules = _load_rules()
    issues = []
    for key, data in rules.get("issues", {}).items():
        issues.append({
            "type": key,
            "label": data.get("label", key),
            "description": data.get("description", ""),
            "icon": data.get("icon", "🔧"),
        })
    return issues


def get_questions(issue_type: str) -> List[Dict[str, Any]]:
    """Get the list of adaptive questions for a specific issue type."""
    rules = _load_rules()
    issue = rules.get("issues", {}).get(issue_type)
    if not issue:
        return []
    return issue.get("questions", [])


def analyze(issue_type: str, answers: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Analyze user answers against the decision tree and return a diagnosis.
    
    Uses a scoring system: each answer maps to potential causes with weights.
    The cause with the highest accumulated score wins.
    """
    rules = _load_rules()
    issue = rules.get("issues", {}).get(issue_type)

    if not issue:
        return {
            "cause": "unknown",
            "title": "Unable to Diagnose",
            "description": "The selected issue type is not recognized.",
            "confidence": 0.0,
            "solutions": ["Please try a different issue type or contact support."],
            "related_protocols": [],
        }

    # Build answer map
    answer_map = {a["question_id"]: a["value"] for a in answers}

    # Score each possible cause
    causes = issue.get("causes", {})
    scores: Dict[str, float] = {cause: 0.0 for cause in causes}

    for q in issue.get("questions", []):
        qid = q["id"]
        user_answer = answer_map.get(qid)
        if not user_answer:
            continue

        # Each question has scoring rules
        scoring = q.get("scoring", {})
        if user_answer in scoring:
            for cause, weight in scoring[user_answer].items():
                if cause in scores:
                    scores[cause] += weight

    if not scores or max(scores.values()) == 0:
        # Fallback: return the first cause
        best_cause = next(iter(causes), "unknown")
    else:
        best_cause = max(scores, key=scores.get)

    total_weight = sum(scores.values())
    confidence = (scores.get(best_cause, 0) / total_weight * 100) if total_weight > 0 else 50.0

    cause_data = causes.get(best_cause, {})

    return {
        "cause": best_cause,
        "title": cause_data.get("title", best_cause.replace("_", " ").title()),
        "description": cause_data.get("description", "No description available."),
        "confidence": round(min(confidence, 95.0), 1),
        "solutions": cause_data.get("solutions", []),
        "related_protocols": cause_data.get("related_protocols", []),
    }
