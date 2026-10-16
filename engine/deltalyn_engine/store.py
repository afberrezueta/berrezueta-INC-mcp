"""Supabase (PostgREST) storage. Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-side only, never in the website)."""
from __future__ import annotations

import os

import requests


class Store:
    def __init__(self, url: str | None = None, key: str | None = None):
        self.url = (url or os.environ["SUPABASE_URL"]).rstrip("/") + "/rest/v1"
        key = key or os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        self.headers = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}

    def insert_forecast(self, row: dict) -> None:
        # The ledger is insert-only; a duplicate (same symbol/horizon/day/model) is ignored, never overwritten.
        resp = requests.post(f"{self.url}/forecasts?on_conflict=symbol,horizon_bars,issued_at,model_version",
                             json=row, headers={**self.headers, "Prefer": "resolution=ignore-duplicates"}, timeout=30)
        resp.raise_for_status()

    def forecast_id(self, symbol: str, horizon_bars: int, issued_at: str, model_version: str) -> str | None:
        params = {"select": "id", "symbol": f"eq.{symbol}", "horizon_bars": f"eq.{horizon_bars}",
                  "issued_at": f"eq.{issued_at}", "model_version": f"eq.{model_version}"}
        resp = requests.get(f"{self.url}/forecasts", params=params, headers=self.headers, timeout=30)
        resp.raise_for_status()
        rows = resp.json()
        return rows[0]["id"] if rows else None

    def insert_review(self, row: dict) -> None:
        resp = requests.post(f"{self.url}/scenario_reviews", json=row,
                             headers={**self.headers, "Prefer": "resolution=ignore-duplicates"}, timeout=30)
        resp.raise_for_status()

    def open_forecasts(self) -> list[dict]:
        resp = requests.get(f"{self.url}/open_forecasts?select=*", headers=self.headers, timeout=30)
        resp.raise_for_status()
        return resp.json()

    def insert_outcome(self, row: dict) -> None:
        resp = requests.post(f"{self.url}/outcomes", json=row,
                             headers={**self.headers, "Prefer": "resolution=ignore-duplicates"}, timeout=30)
        resp.raise_for_status()
