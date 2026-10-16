"""Daily jobs.

    python -m deltalyn_engine.run publish SPY QQQ BTCUSD ETHUSD
    python -m deltalyn_engine.run grade
    python -m deltalyn_engine.run preview SPY BTCUSD   # build and review, store nothing
"""
from __future__ import annotations

import json
import sys
from datetime import date, timedelta

from . import cryptoquant, jev
from .data import fetch_eod
from .grading import grade
from .ledger import content_hash
from .scenarios import build_scenario
from .store import Store

HISTORY_DAYS = 3 * 365
HORIZON = 10


def publish(symbols: list[str], store: Store) -> None:
    start = (date.today() - timedelta(days=HISTORY_DAYS)).isoformat()
    for sym in symbols:
        df = fetch_eod(sym, start)
        fc = build_scenario(df, sym, HORIZON)
        fc["content_hash"] = content_hash(fc)
        store.insert_forecast(fc)
        print(f"{sym} {fc['issued_at']} up {fc['up_level']} ({fc['p_up']:.0%}) "
              f"down {fc['down_level']} ({fc['p_down']:.0%}) neither {fc['p_expired']:.0%}")
        shadow_review(df, fc, store)


def shadow_review(df, fc: dict, store: Store) -> None:
    """Store Jev's review and the crypto context next to the scenario. Never blocks publishing."""
    try:
        context = cryptoquant.derivatives_context(fc["symbol"], fc["issued_at"])
    except Exception as e:  # noqa: BLE001 - shadow data must not break the daily run
        print(f"  CryptoQuant context skipped: {type(e).__name__}: {e}")
        context = None
    try:
        review = jev.review(df, fc, context)
    except Exception as e:  # noqa: BLE001
        print(f"  Jev review skipped: {type(e).__name__}: {e}")
        return
    if review is None:
        print("  Jev review skipped: JEV_API_KEY not set")
        return
    review.pop("usage", None)
    try:
        forecast_id = store.forecast_id(fc["symbol"], fc["horizon_bars"], fc["issued_at"], fc["model_version"])
        if forecast_id is None:
            return
        store.insert_review({"forecast_id": forecast_id, "context": context, **review})
    except Exception as e:  # noqa: BLE001
        print(f"  Jev review not stored: {type(e).__name__}: {e}")
        return
    a, g = review["answers"], review["gates"]
    print(f"  Jev {review['reviewer_model']}: lean {a.get('lean', {}).get('choice')} "
          f"(up {review['lean_p_up']} / down {review['lean_p_down']} / neither {review['lean_p_expired']}), "
          f"regime {a.get('regime', {}).get('choice')} [{g.get('regime', {}).get('action')}], "
          f"publishable {a.get('publishable', {}).get('noul')} [{g.get('publishable', {}).get('action')}]")


def preview(symbols: list[str]) -> None:
    start = (date.today() - timedelta(days=HISTORY_DAYS)).isoformat()
    for sym in symbols:
        df = fetch_eod(sym, start)
        fc = build_scenario(df, sym, HORIZON)
        context = cryptoquant.derivatives_context(sym, fc["issued_at"])
        review = jev.review(df, fc, context)
        print(f"{sym} {fc['issued_at']} up {fc['up_level']} ({fc['p_up']:.0%}) "
              f"down {fc['down_level']} ({fc['p_down']:.0%}) neither {fc['p_expired']:.0%}")
        if context:
            print("  context", json.dumps(context))
        if review:
            print("  state\n   ", review["state"].replace("\n", "\n    "))
            print("  answers", json.dumps(review["answers"]))
            print("  gates", json.dumps(review["gates"]), f"latency {review['latency_ms']} ms")


def grade_open(store: Store) -> None:
    for fc in store.open_forecasts():
        df = fetch_eod(fc["symbol"], fc["issued_at"])
        later = df[df.index > fc["issued_at"]]
        result = grade(fc, later)
        if result is None:
            continue
        store.insert_outcome({"forecast_id": fc["id"], **result})
        print(f"{fc['symbol']} {fc['issued_at']} -> {result['outcome']} (Brier {result['brier']:.3f})")


def main(argv: list[str]) -> None:
    if not argv or argv[0] not in {"publish", "grade", "preview"}:
        sys.exit(__doc__)
    if argv[0] == "preview":
        preview(argv[1:] or ["SPY", "BTCUSD"])
        return
    store = Store()
    if argv[0] == "publish":
        publish(argv[1:] or ["SPY", "QQQ", "BTCUSD", "ETHUSD"], store)
    else:
        grade_open(store)


if __name__ == "__main__":
    main(sys.argv[1:])
