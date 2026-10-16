"""Market data from Financial Modeling Prep (FMP). The API key comes from the FMP_API_KEY env var."""
from __future__ import annotations

import os

import pandas as pd
import requests

FMP_BASE = "https://financialmodelingprep.com/stable"


def bars_from_records(records: list[dict]) -> pd.DataFrame:
    """Normalize FMP EOD records into an ascending OHLCV frame indexed by date."""
    df = pd.DataFrame(records)[["date", "open", "high", "low", "close", "volume"]]
    df["date"] = pd.to_datetime(df["date"])
    df = df.drop_duplicates("date").sort_values("date").set_index("date")
    return df.astype(float)


def fetch_eod(symbol: str, start: str, end: str | None = None, api_key: str | None = None) -> pd.DataFrame:
    key = api_key or os.environ["FMP_API_KEY"]
    params = {"symbol": symbol, "from": start, "apikey": key}
    if end:
        params["to"] = end
    resp = requests.get(f"{FMP_BASE}/historical-price-eod/full", params=params, timeout=30)
    resp.raise_for_status()
    records = resp.json()
    if not records:
        raise ValueError(f"FMP returned no bars for {symbol}")
    return bars_from_records(records)
