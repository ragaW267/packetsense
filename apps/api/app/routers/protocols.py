"""
PacketSense API — Protocols Router
Serves protocol information, step data, and manages saved simulations.
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.progress import SavedSimulation, UserProgress
from app.schemas.progress import SaveSimulationRequest, SavedSimulationResponse

router = APIRouter()

DATA_DIR = Path(__file__).parent.parent.parent / "data"
_protocol_cache: Optional[Dict[str, Any]] = None


def _load_protocols() -> Dict[str, Any]:
    global _protocol_cache
    if _protocol_cache is not None:
        return _protocol_cache
    proto_file = DATA_DIR / "protocol_explanations.json"
    if not proto_file.exists():
        _protocol_cache = {}
        return _protocol_cache
    with open(proto_file, "r", encoding="utf-8") as f:
        _protocol_cache = json.load(f)
    return _protocol_cache


@router.get("")
def list_protocols() -> List[Dict[str, Any]]:
    """List all available protocol visualizations."""
    data = _load_protocols()
    protocols = []
    for slug, info in data.get("protocols", {}).items():
        protocols.append({
            "slug": slug,
            "name": info.get("name", slug),
            "description": info.get("description", ""),
            "category": info.get("category", "general"),
            "step_count": len(info.get("steps", [])),
        })
    return protocols


@router.get("/{slug}")
def get_protocol(slug: str) -> Dict[str, Any]:
    """Get detailed protocol information including all visualization steps."""
    data = _load_protocols()
    protocol = data.get("protocols", {}).get(slug)
    if not protocol:
        raise HTTPException(status_code=404, detail=f"Protocol '{slug}' not found")

    return {
        "slug": slug,
        "name": protocol.get("name", slug),
        "description": protocol.get("description", ""),
        "category": protocol.get("category", ""),
        "overview": protocol.get("overview", ""),
        "steps": protocol.get("steps", []),
        "key_concepts": protocol.get("key_concepts", []),
    }


@router.post("/{slug}/save", response_model=SavedSimulationResponse)
def save_simulation(
    slug: str,
    data: SaveSimulationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Save a protocol simulation configuration."""
    sim = SavedSimulation(
        user_id=current_user.id,
        protocol=slug,
        config=data.config,
        notes=data.notes,
    )
    db.add(sim)

    # Update progress
    progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == current_user.id,
            UserProgress.feature == "protocols",
            UserProgress.item_key == slug,
        )
        .first()
    )
    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            feature="protocols",
            item_key=slug,
            status="completed",
        )
        db.add(progress)
    else:
        progress.status = "completed"

    db.commit()
    db.refresh(sim)

    return SavedSimulationResponse(
        id=str(sim.id),
        protocol=sim.protocol,
        config=sim.config,
        notes=sim.notes,
        created_at=sim.created_at,
    )


@router.get("/saved/list", response_model=List[SavedSimulationResponse])
def list_saved(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all saved simulations for the current user."""
    sims = (
        db.query(SavedSimulation)
        .filter(SavedSimulation.user_id == current_user.id)
        .order_by(SavedSimulation.created_at.desc())
        .all()
    )
    return [
        SavedSimulationResponse(
            id=str(s.id),
            protocol=s.protocol,
            config=s.config,
            notes=s.notes,
            created_at=s.created_at,
        )
        for s in sims
    ]
