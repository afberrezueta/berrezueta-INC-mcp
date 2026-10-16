"""Probabilistic "race" scenarios: which level does price touch first within N bars?

For a symbol we pick an upper level (T1) and a lower level (invalidation) from the computed
confluence levels, then estimate P(up first), P(down first) and P(neither) from how often that
race resolved each way in the symbol's own history, measured in ATR units so it adapts to volatility.
The estimate is shrunk toward a driftless random-walk prior so thin samples cannot produce extreme numbers.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from . import MODEL_VERSION
from .levels import Level, all_levels, atr

# Levels closer than this are almost always touched within the horizon, which makes the race uninformative.
# Typical travel grows with sqrt(time), so the minimum distance does too.
MIN_DISTANCE_PER_SQRT_BAR = 0.5
FALLBACK_DISTANCE_PER_SQRT_BAR = 0.8
# Levels farther than this are rarely reached within the horizon, so they make a near-certain, uninformative race.
MAX_DISTANCE_PER_SQRT_BAR = 1.5
PRIOR_STRENGTH = 20
MIN_PRIOR_EXPIRE = 0.05
WARMUP_BARS = 60


def _pick(levels: list[Level], price: float, a: float, side: str, horizon: int) -> tuple[float, float | None, list[str]]:
    """Return (level, next level beyond it, methods) on one side of price."""
    min_dist = MIN_DISTANCE_PER_SQRT_BAR * np.sqrt(horizon) * a
    max_dist = MAX_DISTANCE_PER_SQRT_BAR * np.sqrt(horizon) * a
    if side == "up":
        cands = sorted((lv for lv in levels if price + min_dist <= lv.price <= price + max_dist), key=lambda lv: lv.price)
    else:
        cands = sorted((lv for lv in levels if price - max_dist <= lv.price <= price - min_dist), key=lambda lv: -lv.price)
    if not cands:
        step = FALLBACK_DISTANCE_PER_SQRT_BAR * np.sqrt(horizon) * a
        lvl = price + step if side == "up" else price - step
        return float(lvl), None, ["atr_fallback"]
    near = cands[:3]
    best = max(near, key=lambda lv: (lv.weight, -abs(lv.price - price)))
    idx = cands.index(best)
    nxt = cands[idx + 1].price if idx + 1 < len(cands) else None
    return best.price, nxt, best.methods


def race_outcome(highs: np.ndarray, lows: np.ndarray, up: float, down: float) -> str | None:
    """'up', 'down' or None (neither touched). A bar that touches both counts as 'down' (the worse case)."""
    for h, l in zip(highs, lows):
        hit_up, hit_dn = h >= up, l <= down
        if hit_dn:
            return "down"
        if hit_up:
            return "up"
    return None


def historical_race_counts(df: pd.DataFrame, d_up_atr: float, d_dn_atr: float, horizon: int) -> dict[str, int]:
    """Replay the same ATR-scaled race from every past bar that has a full horizon after it."""
    a = atr(df).to_numpy()
    close, high, low = df["close"].to_numpy(), df["high"].to_numpy(), df["low"].to_numpy()
    counts = {"up": 0, "down": 0, "expired": 0}
    for i in range(WARMUP_BARS, len(df) - horizon):
        if not np.isfinite(a[i]):
            continue
        up, down = close[i] + d_up_atr * a[i], close[i] - d_dn_atr * a[i]
        res = race_outcome(high[i + 1 : i + 1 + horizon], low[i + 1 : i + 1 + horizon], up, down)
        counts[res or "expired"] += 1
    return counts


def build_scenario(df: pd.DataFrame, symbol: str, horizon: int = 10) -> dict:
    """Build one scenario using only bars up to and including the last row of `df` (point-in-time)."""
    levels, a = all_levels(df)
    price = float(df["close"].iloc[-1])
    up, up2, up_methods = _pick(levels, price, a, "up", horizon)
    down, _, down_methods = _pick(levels, price, a, "down", horizon)
    d_up, d_dn = (up - price) / a, (price - down) / a

    counts = historical_race_counts(df, d_up, d_dn, horizon)
    n = sum(counts.values())
    expire_rate = max(counts["expired"] / n if n else 0.5, MIN_PRIOR_EXPIRE)
    prior_up = d_dn / (d_up + d_dn)
    prior = {"up": (1 - expire_rate) * prior_up, "down": (1 - expire_rate) * (1 - prior_up), "expired": expire_rate}
    probs = {k: (counts[k] + PRIOR_STRENGTH * prior[k]) / (n + PRIOR_STRENGTH) for k in counts}

    return {
        "symbol": symbol,
        "issued_at": df.index[-1].strftime("%Y-%m-%d"),
        "horizon_bars": horizon,
        "ref_price": round(price, 4),
        "atr": round(a, 4),
        "up_level": round(up, 4),
        "up_level_2": round(up2, 4) if up2 else None,
        "down_level": round(down, 4),
        "p_up": round(float(probs["up"]), 4),
        "p_down": round(float(probs["down"]), 4),
        "p_expired": round(float(probs["expired"]), 4),
        "sample_size": n,
        "up_methods": up_methods,
        "down_methods": down_methods,
        "levels": [{"price": round(lv.price, 4), "weight": lv.weight, "methods": lv.methods} for lv in levels],
        "model_version": MODEL_VERSION,
    }
