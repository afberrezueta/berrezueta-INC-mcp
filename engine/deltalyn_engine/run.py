"""Daily jobs.

    python -m deltalyn_engine.run publish SPY QQQ BTCUSD ETHUSD
    python -m deltalyn_engine.run grade
"""
from __future__ import annotations

import sys
from datetime import date, timedelta

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
    if not argv or argv[0] not in {"publish", "grade"}:
        sys.exit(__doc__)
    store = Store()
    if argv[0] == "publish":
        publish(argv[1:] or ["SPY", "QQQ", "BTCUSD", "ETHUSD"], store)
    else:
        grade_open(store)


if __name__ == "__main__":
    main(sys.argv[1:])
