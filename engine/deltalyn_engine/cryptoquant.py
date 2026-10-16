"""Crypto derivatives and on-chain context from CryptoQuant. The API key comes from CRYPTOQUANT_API_KEY.

Context is shadow data: it is stored next to each crypto scenario and shown to the reviewer, but it does not
change the published levels or probabilities until it has proven it improves them.
"""
from __future__ import annotations

import os

import pandas as pd
import requests

CQ_BASE = "https://api.cryptoquant.com/v1"
ASSETS = {"BTCUSD": "btc", "ETHUSD": "eth"}

# (endpoint, fields kept). All are daily series aggregated over every exchange CryptoQuant tracks.
SERIES = {
    "funding": ("market-data/funding-rates", ["funding_rates"]),
    "open_interest": ("market-data/open-interest", ["open_interest"]),
    "liquidations": ("market-data/liquidations", ["long_liquidations_usd", "short_liquidations_usd"]),
    "taker": ("market-data/taker-buy-sell-stats", ["taker_buy_sell_ratio"]),
    "leverage": ("market-indicator/estimated-leverage-ratio", ["estimated_leverage_ratio"]),
    "netflow": ("exchange-flows/netflow", ["netflow_total"]),
}
LOOKBACK_DAYS = 30


def frame_from_rows(rows: list[dict], fields: list[str]) -> pd.DataFrame:
    """CryptoQuant rows ({date, field...}, newest first) -> ascending frame indexed by date."""
    if not rows:
        return pd.DataFrame(columns=fields)
    df = pd.DataFrame(rows)
    df["date"] = pd.to_datetime(df["date"])
    keep = [f for f in fields if f in df.columns]
    return df.drop_duplicates("date").sort_values("date").set_index("date")[keep].astype(float)


def fetch_series(asset: str, endpoint: str, fields: list[str], api_key: str, limit: int = LOOKBACK_DAYS) -> pd.DataFrame:
    params = {"exchange": "all_exchange", "window": "day", "limit": limit}
    resp = requests.get(f"{CQ_BASE}/{asset}/{endpoint}", params=params,
                        headers={"Authorization": f"Bearer {api_key}"}, timeout=30)
    resp.raise_for_status()
    return frame_from_rows(resp.json().get("result", {}).get("data", []), fields)


def summarize(frames: dict[str, pd.DataFrame], as_of: str) -> dict:
    """Point-in-time features: only rows dated on or before `as_of` are used."""
    cutoff = pd.Timestamp(as_of)
    f = {name: df[df.index <= cutoff] for name, df in frames.items()}
    out: dict[str, float | None] = {}

    def last(name, col):
        df = f.get(name)
        return float(df[col].iloc[-1]) if df is not None and col in df and len(df) else None

    def pct_change(name, col, days):
        df = f.get(name)
        if df is None or col not in df or len(df) <= days:
            return None
        prev = float(df[col].iloc[-1 - days])
        return (float(df[col].iloc[-1]) / prev - 1) if prev else None

    out["funding_rate"] = last("funding", "funding_rates")
    fund = f.get("funding")
    out["funding_rate_7d_avg"] = (float(fund["funding_rates"].tail(7).mean())
                                  if fund is not None and "funding_rates" in fund and len(fund) else None)
    out["open_interest_usd"] = last("open_interest", "open_interest")
    out["open_interest_change_7d"] = pct_change("open_interest", "open_interest", 7)
    long_liq, short_liq = last("liquidations", "long_liquidations_usd"), last("liquidations", "short_liquidations_usd")
    out["long_liquidations_usd"], out["short_liquidations_usd"] = long_liq, short_liq
    out["long_share_of_liquidations"] = (long_liq / (long_liq + short_liq)
                                         if long_liq is not None and short_liq and long_liq + short_liq else None)
    out["taker_buy_sell_ratio"] = last("taker", "taker_buy_sell_ratio")
    out["estimated_leverage_ratio"] = last("leverage", "estimated_leverage_ratio")
    out["exchange_netflow"] = last("netflow", "netflow_total")
    out["as_of"] = as_of
    return {k: (round(v, 6) if isinstance(v, float) else v) for k, v in out.items()}


def derivatives_context(symbol: str, as_of: str, api_key: str | None = None) -> dict | None:
    """Context for a crypto symbol, or None for symbols CryptoQuant does not cover or when no key is set."""
    asset = ASSETS.get(symbol)
    key = api_key or os.environ.get("CRYPTOQUANT_API_KEY", "").strip()
    if not asset or not key:
        return None
    frames = {name: fetch_series(asset, ep, fields, key) for name, (ep, fields) in SERIES.items()}
    return summarize(frames, as_of)
