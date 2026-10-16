import json
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from deltalyn_engine.data import bars_from_records
from deltalyn_engine.grading import brier, grade
from deltalyn_engine.ledger import content_hash
from deltalyn_engine.levels import atr, confluence
from deltalyn_engine.scenarios import build_scenario, race_outcome

FIXTURE = Path(__file__).parent / "fixtures" / "SPY.json"


@pytest.fixture(scope="module")
def spy():
    return bars_from_records(json.loads(FIXTURE.read_text()))


def bars(rows):
    idx = pd.date_range("2026-01-05", periods=len(rows), freq="B")
    return pd.DataFrame(rows, columns=["open", "high", "low", "close", "volume"], index=idx).astype(float)


def test_bars_sorted_ascending(spy):
    assert spy.index.is_monotonic_increasing
    assert len(spy) > 300


def test_atr_constant_range():
    df = bars([[10, 11, 9, 10, 100]] * 30)
    assert atr(df, 14).iloc[-1] == pytest.approx(2.0)


def test_confluence_merges_close_levels():
    merged = confluence([("a", 100.0), ("b", 100.2), ("c", 105.0)], atr_value=1.0, tol_atr=0.25)
    assert [round(m.price, 2) for m in merged] == [100.1, 105.0]
    assert merged[0].weight == 2 and merged[0].methods == ["a", "b"]


def test_race_same_bar_counts_as_down():
    assert race_outcome(np.array([105.0]), np.array([95.0]), up=104, down=96) == "down"


def test_race_up_first_then_down():
    assert race_outcome(np.array([105.0, 100.0]), np.array([99.0, 90.0]), up=104, down=96) == "up"


def test_grade_open_vs_expired():
    fc = {"horizon_bars": 3, "up_level": 110.0, "down_level": 90.0, "ref_price": 100.0,
          "p_up": 0.3, "p_down": 0.3, "p_expired": 0.4}
    quiet = bars([[100, 101, 99, 100, 1]] * 2)
    assert grade(fc, quiet) is None  # window not finished, nothing touched -> still open
    done = grade(fc, bars([[100, 101, 99, 100, 1]] * 3))
    assert done["outcome"] == "expired" and done["bars_to_resolve"] == 3


def test_grade_records_first_touch():
    fc = {"horizon_bars": 5, "up_level": 110.0, "down_level": 90.0, "ref_price": 100.0,
          "p_up": 0.5, "p_down": 0.3, "p_expired": 0.2}
    res = grade(fc, bars([[100, 101, 99, 100, 1], [100, 111, 99, 110, 1], [110, 112, 80, 85, 1]]))
    assert res["outcome"] == "up" and res["bars_to_resolve"] == 2
    assert res["brier"] == pytest.approx(brier(fc, "up"))


def test_brier_perfect_and_worst():
    assert brier({"p_up": 1, "p_down": 0, "p_expired": 0}, "up") == 0
    assert brier({"p_up": 1, "p_down": 0, "p_expired": 0}, "down") == 2


def test_scenario_is_coherent(spy):
    fc = build_scenario(spy, "SPY", horizon=10)
    assert fc["down_level"] < fc["ref_price"] < fc["up_level"]
    assert fc["p_up"] + fc["p_down"] + fc["p_expired"] == pytest.approx(1, abs=1e-3)
    assert all(0 < fc[k] < 1 for k in ("p_up", "p_down", "p_expired"))
    assert fc["issued_at"] == spy.index[-1].strftime("%Y-%m-%d")


def test_scenario_has_no_lookahead(spy):
    cut = len(spy) - 20
    a = build_scenario(spy.iloc[:cut], "SPY")
    tampered = spy.copy()
    tampered.iloc[cut:, :4] *= 3  # wildly change the future
    b = build_scenario(tampered.iloc[:cut], "SPY")
    assert a == b


def test_hash_is_stable_and_sensitive(spy):
    fc = build_scenario(spy, "SPY")
    assert content_hash(fc) == content_hash(dict(fc))
    assert content_hash(fc) != content_hash({**fc, "up_level": fc["up_level"] + 0.01})
