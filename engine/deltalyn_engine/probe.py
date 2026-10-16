"""Connectivity probe for the Jev and CryptoQuant APIs.

Run in CI, where the keys live as secrets. Prints HTTP status and the shape of
each response so the integration can be built against real payloads. Never
prints keys or request headers.
"""

import json
import os
import sys

import requests

JEV_URL = os.environ.get("JEV_BASE_URL", "https://api.typesafe.ai/v1/systemone")
CQ_URL = "https://api.cryptoquant.com/v1"

CQ_ENDPOINTS = [
    ("btc/market-data/funding-rates", {"exchange": "all_exchange", "window": "day", "limit": 3}),
    ("btc/market-data/open-interest", {"exchange": "all_exchange", "window": "day", "limit": 3}),
    ("btc/market-data/liquidations", {"exchange": "all_exchange", "window": "day", "limit": 3}),
    ("btc/market-data/taker-buy-sell-stats", {"exchange": "all_exchange", "window": "day", "limit": 3}),
    ("btc/market-indicator/estimated-leverage-ratio", {"exchange": "all_exchange", "window": "day", "limit": 3}),
    ("btc/exchange-flows/netflow", {"exchange": "all_exchange", "window": "day", "limit": 3}),
    ("eth/market-data/funding-rates", {"exchange": "all_exchange", "window": "day", "limit": 3}),
    ("eth/market-data/open-interest", {"exchange": "all_exchange", "window": "day", "limit": 3}),
]


def short(obj, limit=900):
    text = json.dumps(obj, default=str)
    return text if len(text) <= limit else text[:limit] + "…"


def probe_jev():
    key = os.environ.get("JEV_API_KEY", "").strip()
    if not key:
        print("Jev: no key")
        return False
    body = {
        "model": os.environ.get("JEV_MODEL", "jev-latest"),
        "state": (
            "SPY daily. Close 762.50. 20-day return +3.1%. ATR(14) 1.2% of price. "
            "Price above 50-day and 200-day moving averages; 50-day rising."
        ),
        "questions": {
            "regime": {
                "type": "choice",
                "instructions": "Classify the current market regime for this instrument.",
                "criteria": {
                    "trend_up": "Price is making higher highs and sits above rising moving averages.",
                    "trend_down": "Price is making lower lows and sits below falling moving averages.",
                    "range": "Price oscillates sideways between support and resistance without direction.",
                },
            },
            "publishable": {
                "type": "noul",
                "instructions": "Is this a clean, well-defined setup worth publishing to subscribers?",
            },
            "conviction": {
                "type": "score",
                "instructions": "Rate the clarity of the directional setup.",
                "criteria": ["low", "medium", "high"],
            },
        },
    }
    try:
        r = requests.post(JEV_URL, json=body, headers={"Authorization": f"Bearer {key}"}, timeout=20)
    except requests.RequestException as e:
        print(f"Jev: request failed: {type(e).__name__}")
        return False
    print(f"Jev: HTTP {r.status_code}")
    try:
        print("Jev response:", short(r.json(), 2500))
    except ValueError:
        print("Jev body (not JSON):", r.text[:400])
    return r.ok


def probe_cryptoquant():
    key = os.environ.get("CRYPTOQUANT_API_KEY", "").strip()
    if not key:
        print("CryptoQuant: no key")
        return False
    ok = False
    for path, params in CQ_ENDPOINTS:
        try:
            r = requests.get(f"{CQ_URL}/{path}", params=params,
                             headers={"Authorization": f"Bearer {key}"}, timeout=20)
        except requests.RequestException as e:
            print(f"CQ {path}: request failed: {type(e).__name__}")
            continue
        try:
            payload = r.json()
        except ValueError:
            print(f"CQ {path}: HTTP {r.status_code}, body not JSON: {r.text[:200]}")
            continue
        status = payload.get("status") if isinstance(payload, dict) else None
        result = payload.get("result") if isinstance(payload, dict) else None
        rows = result.get("data") if isinstance(result, dict) else None
        print(f"CQ {path}: HTTP {r.status_code} status={short(status, 200)}")
        if rows:
            ok = True
            print(f"   fields={list(rows[0].keys())} first={short(rows[0], 300)}")
        elif result is not None:
            print(f"   result={short(result, 300)}")
    return ok


if __name__ == "__main__":
    jev_ok = probe_jev()
    cq_ok = probe_cryptoquant()
    print(f"SUMMARY jev={'ok' if jev_ok else 'fail'} cryptoquant={'ok' if cq_ok else 'fail'}")
    sys.exit(0)
