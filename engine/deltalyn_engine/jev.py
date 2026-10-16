"""Jev (TypeSafe System One) as the scenario reviewer. The API key comes from JEV_API_KEY.

Shadow mode: Jev's answers are stored next to each scenario but do not change what is published.
Its "lean" answer is a probability over the same up/down/expired race, so it is graded with the same
Brier score as the engine. Jev is promoted to decide only if it beats the engine on the live record.

Jev sees the market state and the levels but never the engine's probabilities, so its lean is an
independent forecast rather than an echo.
"""
from __future__ import annotations

import hashlib
import os
import time

import math

import pandas as pd
import requests

JEV_URL = "https://api.typesafe.ai/v1/systemone"
DEFAULT_MODEL = "jev-latest"
# Same thresholds as the Jev plugin's gate: below them an answer is "escalate", never acted on automatically.
THRESHOLDS = {"choice": 0.75, "noul": 0.75, "score": 0.65}
RETRYABLE = {429, 529}


def _pct(x: float) -> str:
    return "n/a" if x is None or math.isnan(x) else f"{x:+.1%}"


def market_state(df: pd.DataFrame, scenario: dict, context: dict | None = None) -> str:
    """Plain-text, point-in-time description of the setup. Uses only bars up to the scenario date."""
    close = df["close"]
    price, a = scenario["ref_price"], scenario["atr"]

    def ret(n):
        return close.iloc[-1] / close.iloc[-1 - n] - 1 if len(close) > n else float("nan")

    def vs_sma(n):
        return price / close.tail(n).mean() - 1 if len(close) >= n else float("nan")

    sma50 = close.rolling(50).mean()
    slope50 = sma50.iloc[-1] / sma50.iloc[-11] - 1 if len(sma50.dropna()) > 10 else float("nan")
    lines = [
        f"{scenario['symbol']} daily bars, as of {scenario['issued_at']}. Close {price}.",
        f"Return: 5 days {_pct(ret(5))}, 20 days {_pct(ret(20))}, 60 days {_pct(ret(60))}.",
        f"Price vs 50-day average {_pct(vs_sma(50))}, vs 200-day average {_pct(vs_sma(200))}; "
        f"50-day average changed {_pct(slope50)} over 10 days.",
        f"ATR(14) {a} ({a / price:.1%} of price).",
        f"Upper level {scenario['up_level']} ({(scenario['up_level'] - price) / a:.1f} ATR above; from "
        f"{', '.join(scenario['up_methods'])}).",
        f"Lower level {scenario['down_level']} ({(price - scenario['down_level']) / a:.1f} ATR below; from "
        f"{', '.join(scenario['down_methods'])}).",
        f"Horizon: {scenario['horizon_bars']} daily bars.",
    ]
    if context:
        ctx = ", ".join(f"{k} {v}" for k, v in context.items() if k != "as_of" and v is not None)
        lines.append(f"Derivatives and on-chain (CryptoQuant, as of {context.get('as_of')}): {ctx}.")
    return "\n".join(lines)


def questions(scenario: dict) -> dict:
    up, down, h = scenario["up_level"], scenario["down_level"], scenario["horizon_bars"]
    return {
        "lean": {
            "type": "choice",
            "instructions": f"Within the next {h} daily bars, which happens first?",
            "criteria": {
                "up": f"Price trades at or above the upper level {up} before touching the lower level {down}.",
                "down": f"Price trades at or below the lower level {down} before touching the upper level {up}.",
                "expired": f"Price stays strictly between {down} and {up} for all {h} bars and touches neither.",
            },
        },
        "regime": {
            "type": "choice",
            "instructions": "Classify the current market regime for this instrument.",
            "criteria": {
                "trend_up": "Higher highs with price above rising moving averages; buyers in control.",
                "trend_down": "Lower lows with price below falling moving averages; sellers in control.",
                "range": "Sideways oscillation between support and resistance with flat moving averages.",
                "high_volatility": "Large erratic swings both ways with expanding ranges and no stable direction.",
            },
        },
        "conviction": {
            "type": "score",
            "instructions": "How clear and well-defined is this setup for a published plan?",
            "criteria": ["low", "medium", "high"],
        },
        "publishable": {
            "type": "noul",
            "instructions": "Are both levels meaningful, reachable within the horizon, and clear enough to publish as a plan?",
        },
    }


def gate(answer: dict) -> dict:
    kind = answer.get("type")
    if kind == "noul":
        noul = float(answer.get("noul", 0.5))
        conf = max(noul, 1 - noul)
    else:
        conf = float(answer.get("confidence", 0.0))
    threshold = THRESHOLDS.get(kind, 1.0)
    return {"action": "auto" if conf >= threshold else "escalate", "confidence": round(conf, 4), "threshold": threshold}


def decide(state: str, qs: dict, api_key: str, model: str = DEFAULT_MODEL, base_url: str = JEV_URL,
           retries: int = 2, timeout: float = 15.0, post=requests.post) -> dict:
    body = {"model": model, "state": state, "questions": qs}
    for attempt in range(retries + 1):
        try:
            resp = post(base_url, json=body, headers={"Authorization": f"Bearer {api_key}"}, timeout=timeout)
        except requests.RequestException:
            if attempt == retries:
                raise
        else:
            if resp.status_code in RETRYABLE or resp.status_code >= 500:
                if attempt == retries:
                    resp.raise_for_status()
            else:
                resp.raise_for_status()
                data = resp.json()
                if not isinstance(data, dict) or "answers" not in data:
                    raise ValueError("Jev: response has no answers")
                return data
        time.sleep(0.25 * 2 ** attempt)
    raise RuntimeError("unreachable")


def review(df: pd.DataFrame, scenario: dict, context: dict | None = None, api_key: str | None = None,
           post=requests.post) -> dict | None:
    """Jev's review of one scenario, or None when no key is configured."""
    key = api_key or os.environ.get("JEV_API_KEY", "").strip()
    if not key:
        return None
    state = market_state(df, scenario, context)
    started = time.monotonic()
    data = decide(state, questions(scenario), key, model=os.environ.get("JEV_MODEL", DEFAULT_MODEL), post=post)
    answers = data["answers"]
    lean = answers.get("lean", {}).get("probabilities", {})
    probs = {k: float(lean.get(k, 0.0)) for k in ("up", "down", "expired")}
    total = sum(probs.values())
    if total > 0:
        probs = {k: v / total for k, v in probs.items()}
    return {
        "reviewer_model": data.get("model", "unknown"),
        "state_hash": hashlib.sha256(state.encode()).hexdigest(),
        "state": state,
        "answers": answers,
        "gates": {qid: gate(ans) for qid, ans in answers.items()},
        "lean_p_up": round(probs["up"], 4) if total else None,
        "lean_p_down": round(probs["down"], 4) if total else None,
        "lean_p_expired": round(probs["expired"], 4) if total else None,
        "latency_ms": int((time.monotonic() - started) * 1000),
        "usage": data.get("usage"),
    }
