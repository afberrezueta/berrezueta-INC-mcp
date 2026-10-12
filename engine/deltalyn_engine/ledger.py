"""Tamper-evident ledger entries: each forecast carries a SHA-256 of its own content."""
from __future__ import annotations

import hashlib
import json

HASHED_FIELDS = (
    "symbol", "issued_at", "horizon_bars", "ref_price", "up_level", "up_level_2", "down_level",
    "p_up", "p_down", "p_expired", "model_version",
)


def content_hash(forecast: dict) -> str:
    core = {k: forecast.get(k) for k in HASHED_FIELDS}
    return hashlib.sha256(json.dumps(core, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
