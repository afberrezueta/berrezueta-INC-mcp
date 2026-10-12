"""Grade published scenarios against later bars. Rules are fixed in advance and applied to every forecast."""
from __future__ import annotations

import pandas as pd

from .scenarios import race_outcome

CLASSES = ("up", "down", "expired")


def grade(forecast: dict, later_bars: pd.DataFrame) -> dict | None:
    """Return the outcome, or None while the forecast is still open.

    `later_bars` must contain only bars strictly after `issued_at`.
    """
    window = later_bars.iloc[: forecast["horizon_bars"]]
    res = race_outcome(window["high"].to_numpy(), window["low"].to_numpy(), forecast["up_level"], forecast["down_level"])
    if res is None and len(window) < forecast["horizon_bars"]:
        return None
    outcome = res or "expired"
    resolved_idx = len(window) - 1
    if res is not None:
        hit = (window["low"] <= forecast["down_level"]) | (window["high"] >= forecast["up_level"])
        resolved_idx = int(hit.to_numpy().argmax())
    seen = window.iloc[: resolved_idx + 1]
    ref = forecast["ref_price"]
    return {
        "outcome": outcome,
        "resolved_at": seen.index[-1].strftime("%Y-%m-%d"),
        "bars_to_resolve": resolved_idx + 1,
        "max_favorable": round(float(seen["high"].max()) - ref, 4),
        "max_adverse": round(ref - float(seen["low"].min()), 4),
        "brier": round(brier(forecast, outcome), 6),
    }


def brier(forecast: dict, outcome: str) -> float:
    probs = {"up": forecast["p_up"], "down": forecast["p_down"], "expired": forecast["p_expired"]}
    return sum((probs[c] - (1.0 if c == outcome else 0.0)) ** 2 for c in CLASSES)
