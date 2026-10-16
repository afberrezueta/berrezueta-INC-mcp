# Deltalyn scenario engine

Publishes one scenario per symbol each day and grades it automatically. Every scenario and outcome goes to an append-only, publicly readable ledger in Supabase.

## The scenario

For each symbol (SPY, QQQ, BTCUSD, ETHUSD), the engine picks an upper level and a lower level. It then asks: within the next 10 daily bars, which level does price touch first?

- **Levels.** They come from swing highs and lows, the previous day, week and month highs and lows, and the volume-profile POC, VAH and VAL. Levels within 0.25 ATR of each other are merged into one.
- **Distance from price.** Each level must sit between 0.5·√10 and 1.5·√10 ATR away (about 1.6 to 4.7 ATR). If no level qualifies, the engine uses an ATR step instead.
- **Probabilities.** P(up first), P(down first) and P(neither) come from replaying the same ATR-scaled race over the symbol's own history. The result is shrunk toward a driftless random-walk prior.
- **Grading.** When a scenario resolves, it gets a multiclass Brier score. Each entry also carries a SHA-256 hash of its own content.

`model_version` is `levels-race-v2`. v1 had no maximum distance, which let ETH publish a lower level 5.9 ATR away. On SPY history both versions score the same, because the cap never binds there.

**Honest status:** on 255 walk-forward SPY scenarios, the Brier skill against the prior-only baseline is −0.014. The engine has no edge yet. Do not market accuracy until the live record shows one.

## Shadow reviewers

These reviewers are stored in `scenario_reviews` next to each scenario. They never change what is published.

| Reviewer | What it adds |
|---|---|
| **Jev** (`JEV_API_KEY`, from the `JEV` secret) | Typed answers for each scenario: `lean` (up / down / neither, as probabilities), `regime`, `conviction` and `publishable`. Each answer is gated: below 0.75 confidence (0.65 for scores) it is marked `escalate` and is never acted on automatically. Jev sees prices and levels but never the engine's probabilities, so its `lean` is an independent forecast. |
| **CryptoQuant** (`CRYPTOQUANT_API_KEY`) | For BTC and ETH: funding rate, open interest and its 7-day change, long and short liquidations, taker buy/sell ratio, estimated leverage ratio, and exchange netflow. Only rows dated on or before the scenario date are used. |

The `reviewer_scores` view puts the engine's Brier score and Jev's Brier score side by side on the same resolved races. **Jev gets to decide only if, after 90 days, its Brier score is clearly lower than the engine's.** In the same way, CryptoQuant stays only if its context measurably helps.

If a reviewer fails or has no key, the scenario is still published and the run logs why.

## Run

```bash
pip install -r requirements.txt pytest
python -m pytest -q
python -m deltalyn_engine.run grade      # needs FMP_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
python -m deltalyn_engine.run publish SPY QQQ BTCUSD ETHUSD
python -m deltalyn_engine.probe          # checks the Jev and CryptoQuant keys (also a manual workflow)
```

In production, `.github/workflows/deltalyn-engine.yml` runs these every weekday after the US close and on weekends for crypto.
