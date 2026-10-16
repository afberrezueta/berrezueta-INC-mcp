"""Walk-forward evaluation: build each day's scenario with only past data, then grade it with the future."""
from __future__ import annotations

import pandas as pd

from .grading import CLASSES, brier, grade
from .scenarios import build_scenario

START_BAR = 120


def walk_forward(df: pd.DataFrame, symbol: str, horizon: int = 10, step: int = 1) -> pd.DataFrame:
    rows = []
    for i in range(START_BAR, len(df) - horizon, step):
        past = df.iloc[: i + 1]
        fc = build_scenario(past, symbol, horizon)
        result = grade(fc, df.iloc[i + 1 :])
        if result is None:
            continue
        # Baseline: the same race scored with the driftless prior alone (no history), for skill comparison.
        d_up, d_dn = fc["up_level"] - fc["ref_price"], fc["ref_price"] - fc["down_level"]
        p_up0 = d_dn / (d_up + d_dn)
        base = {"p_up": p_up0 * (1 - fc["p_expired"]), "p_down": (1 - p_up0) * (1 - fc["p_expired"]),
                "p_expired": fc["p_expired"]}
        rows.append({"issued_at": fc["issued_at"], "p_up": fc["p_up"], "p_down": fc["p_down"],
                     "p_expired": fc["p_expired"], "outcome": result["outcome"], "brier": result["brier"],
                     "brier_base": brier(base, result["outcome"])})
    return pd.DataFrame(rows)


def summarize(res: pd.DataFrame) -> dict:
    out = {"n": len(res), "brier": res["brier"].mean(), "brier_base": res["brier_base"].mean()}
    out["brier_skill"] = 1 - out["brier"] / out["brier_base"]
    out["outcomes"] = res["outcome"].value_counts().reindex(CLASSES, fill_value=0).to_dict()
    bins = pd.cut(res["p_up"], [0, 0.2, 0.35, 0.5, 0.65, 1.0])
    cal = res.assign(hit=(res["outcome"] == "up").astype(float)).groupby(bins, observed=True).agg(
        forecast=("p_up", "mean"), observed=("hit", "mean"), n=("hit", "size"))
    out["calibration_up"] = cal.round(3).reset_index(drop=True).to_dict("records")
    return out
