"""Deterministic price levels. Every number here comes from code, never from the language model."""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd


def atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """Wilder's Average True Range."""
    prev_close = df["close"].shift(1)
    tr = pd.concat(
        [df["high"] - df["low"], (df["high"] - prev_close).abs(), (df["low"] - prev_close).abs()], axis=1
    ).max(axis=1)
    return tr.ewm(alpha=1 / period, adjust=False, min_periods=period).mean()


def swing_pivots(df: pd.DataFrame, left: int = 3, right: int = 3, lookback: int = 120) -> list[tuple[str, float]]:
    """Fractal swing highs and lows confirmed by `right` later bars."""
    window = df.iloc[-lookback:]
    highs, lows = window["high"].to_numpy(), window["low"].to_numpy()
    out: list[tuple[str, float]] = []
    for i in range(left, len(window) - right):
        if highs[i] == highs[i - left : i + right + 1].max():
            out.append(("swing_high", float(highs[i])))
        if lows[i] == lows[i - left : i + right + 1].min():
            out.append(("swing_low", float(lows[i])))
    return out


def volume_profile(df: pd.DataFrame, lookback: int = 60, bins: int = 40, value_area: float = 0.7) -> dict[str, float]:
    """Point of control and value area from daily bars, spreading each bar's volume over its range."""
    window = df.iloc[-lookback:]
    lo, hi = float(window["low"].min()), float(window["high"].max())
    edges = np.linspace(lo, hi, bins + 1)
    centers = (edges[:-1] + edges[1:]) / 2
    vol = np.zeros(bins)
    for low, high, v in window[["low", "high", "volume"]].itertuples(index=False):
        mask = (centers >= low) & (centers <= high)
        n = mask.sum()
        if n:
            vol[mask] += v / n
    poc_i = int(vol.argmax())
    order = np.argsort(vol)[::-1]
    picked, total = [], vol.sum()
    for i in order:
        picked.append(i)
        if vol[picked].sum() >= value_area * total:
            break
    return {"poc": float(centers[poc_i]), "vah": float(centers[max(picked)]), "val": float(centers[min(picked)])}


def prior_period_levels(df: pd.DataFrame) -> list[tuple[str, float]]:
    """Previous day, week and month high/low (only completed periods)."""
    out: list[tuple[str, float]] = []
    if len(df) >= 2:
        prev = df.iloc[-2]
        out += [("prev_day_high", float(prev["high"])), ("prev_day_low", float(prev["low"]))]
    for code, name in (("W", "week"), ("M", "month")):
        grouped = df.resample("W-FRI" if code == "W" else "ME").agg({"high": "max", "low": "min"})
        if len(grouped) >= 2:
            prev = grouped.iloc[-2]
            out += [(f"prev_{name}_high", float(prev["high"])), (f"prev_{name}_low", float(prev["low"]))]
    return out


@dataclass
class Level:
    price: float
    weight: int
    methods: list[str] = field(default_factory=list)


def confluence(raw: list[tuple[str, float]], atr_value: float, tol_atr: float = 0.25) -> list[Level]:
    """Merge levels that sit within `tol_atr` ATR of each other; weight = number of supporting methods."""
    tol = tol_atr * atr_value
    merged: list[Level] = []
    for method, price in sorted(raw, key=lambda x: x[1]):
        if merged and price - merged[-1].price <= tol:
            last = merged[-1]
            last.price = (last.price * last.weight + price) / (last.weight + 1)
            last.weight += 1
            last.methods.append(method)
        else:
            merged.append(Level(price=price, weight=1, methods=[method]))
    return merged


def all_levels(df: pd.DataFrame) -> tuple[list[Level], float]:
    a = float(atr(df).iloc[-1])
    vp = volume_profile(df)
    raw = swing_pivots(df) + prior_period_levels(df) + [(k, v) for k, v in vp.items()]
    return confluence(raw, a), a
