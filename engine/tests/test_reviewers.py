import json
from pathlib import Path

import pytest

from deltalyn_engine import cryptoquant, jev
from deltalyn_engine.data import bars_from_records
from deltalyn_engine.scenarios import MAX_DISTANCE_PER_SQRT_BAR, build_scenario

FIXTURE = Path(__file__).parent / "fixtures" / "SPY.json"

# Shape of a real Jev response (captured by the API probe).
JEV_RESPONSE = {
    "model": "jev-1.13.0",
    "answers": {
        "lean": {"type": "choice", "choice": "up", "confidence": 0.6,
                 "probabilities": {"up": 0.6, "down": 0.25, "expired": 0.15}},
        "regime": {"type": "choice", "choice": "trend_up", "confidence": 1.0,
                   "probabilities": {"trend_up": 1.0, "trend_down": 0.0, "range": 0.0, "high_volatility": 0.0}},
        "conviction": {"type": "score", "score": 1.93, "confidence": 0.9, "legend": {"0": "low", "1": "medium", "2": "high"},
                       "probabilities": {"0": 0.0, "1": 0.07, "2": 0.93}},
        "publishable": {"type": "noul", "noul": 0.46},
    },
    "usage": {"input_tokens": 474, "output_tokens": 76},
}


class FakeResponse:
    def __init__(self, status, payload):
        self.status_code, self._payload = status, payload

    def json(self):
        return self._payload

    def raise_for_status(self):
        if self.status_code >= 400:
            raise RuntimeError(f"HTTP {self.status_code}")


@pytest.fixture(scope="module")
def spy():
    return bars_from_records(json.loads(FIXTURE.read_text()))


@pytest.fixture(scope="module")
def scenario(spy):
    return build_scenario(spy, "SPY", 10)


def test_levels_stay_within_max_distance(spy):
    for end in range(150, len(spy), 25):
        sc = build_scenario(spy.iloc[:end], "SPY", 10)
        cap = MAX_DISTANCE_PER_SQRT_BAR * 10 ** 0.5 * sc["atr"] + 1e-6
        assert sc["up_level"] - sc["ref_price"] <= cap
        assert sc["ref_price"] - sc["down_level"] <= cap


def test_market_state_is_point_in_time(spy, scenario):
    state = jev.market_state(spy, scenario)
    assert scenario["issued_at"] in state and str(scenario["up_level"]) in state
    assert "p_up" not in state and str(scenario["p_up"]) not in state  # Jev never sees the engine's answer
    assert "nan" not in state


def test_gate_thresholds():
    assert jev.gate({"type": "choice", "confidence": 0.8})["action"] == "auto"
    assert jev.gate({"type": "choice", "confidence": 0.6})["action"] == "escalate"
    assert jev.gate({"type": "noul", "noul": 0.46})["action"] == "escalate"
    assert jev.gate({"type": "noul", "noul": 0.05})["action"] == "auto"
    assert jev.gate({"type": "score", "confidence": 0.9})["action"] == "auto"


def test_review_parses_lean_and_gates(spy, scenario):
    sent = {}

    def post(url, json, headers, timeout):
        sent.update(json)
        return FakeResponse(200, JEV_RESPONSE)

    r = jev.review(spy, scenario, api_key="test", post=post)
    assert set(sent["questions"]) == {"lean", "regime", "conviction", "publishable"}
    assert r["reviewer_model"] == "jev-1.13.0"
    assert (r["lean_p_up"], r["lean_p_down"], r["lean_p_expired"]) == (0.6, 0.25, 0.15)
    assert r["gates"]["regime"]["action"] == "auto" and r["gates"]["publishable"]["action"] == "escalate"
    assert len(r["state_hash"]) == 64


def test_review_without_key_is_skipped(spy, scenario, monkeypatch):
    monkeypatch.delenv("JEV_API_KEY", raising=False)
    assert jev.review(spy, scenario) is None


def test_decide_retries_then_succeeds(monkeypatch):
    monkeypatch.setattr(jev.time, "sleep", lambda s: None)
    calls = iter([FakeResponse(529, {}), FakeResponse(200, JEV_RESPONSE)])
    out = jev.decide("state", {}, "test", post=lambda *a, **k: next(calls))
    assert out["model"] == "jev-1.13.0"


def test_cryptoquant_summary_ignores_future_rows():
    rows = [{"date": "2026-10-16", "funding_rates": 0.05}, {"date": "2026-10-15", "funding_rates": 0.01},
            {"date": "2026-10-14", "funding_rates": 0.03}]
    frames = {
        "funding": cryptoquant.frame_from_rows(rows, ["funding_rates"]),
        "liquidations": cryptoquant.frame_from_rows(
            [{"date": "2026-10-15", "long_liquidations_usd": 300.0, "short_liquidations_usd": 100.0}],
            ["long_liquidations_usd", "short_liquidations_usd"]),
    }
    out = cryptoquant.summarize(frames, "2026-10-15")
    assert out["funding_rate"] == 0.01
    assert out["funding_rate_7d_avg"] == pytest.approx(0.02)
    assert out["long_share_of_liquidations"] == 0.75
    assert out["open_interest_usd"] is None


def test_cryptoquant_skips_uncovered_symbols():
    assert cryptoquant.derivatives_context("SPY", "2026-10-15", api_key="test") is None
