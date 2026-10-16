// Reads the public scenario ledger from Supabase with the publishable key (read-only by RLS).
// Pages using this revalidate every few minutes, so the site never hammers the database.

const REVALIDATE_SECONDS = 300;

export const SYMBOLS = {
  SPY: { name: "S&P 500 ETF", kind: "Stocks" },
  QQQ: { name: "Nasdaq-100 ETF", kind: "Stocks" },
  BTCUSD: { name: "Bitcoin", kind: "Crypto" },
  ETHUSD: { name: "Ether", kind: "Crypto" },
};

const METHOD_LABELS = {
  swing_high: "Swing high",
  swing_low: "Swing low",
  prev_day_high: "Prior-day high",
  prev_day_low: "Prior-day low",
  prev_week_high: "Prior-week high",
  prev_week_low: "Prior-week low",
  prev_month_high: "Prior-month high",
  prev_month_low: "Prior-month low",
  poc: "Volume point of control",
  vah: "Value-area high",
  val: "Value-area low",
  atr_fallback: "Volatility step (ATR)",
};

// Always guessing one-third for each of the three outcomes scores exactly this. Lower is better.
export const UNIFORM_BRIER = 2 / 3;

export function methodLabels(methods = []) {
  return [...new Set(methods.map((m) => METHOD_LABELS[m] || m))];
}

async function rest(path) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

const FORECAST_FIELDS =
  "id,symbol,issued_at,horizon_bars,ref_price,atr,up_level,up_level_2,down_level,p_up,p_down,p_expired,sample_size,up_methods,down_methods,model_version,content_hash,created_at";
const OUTCOME_FIELDS = "outcome,resolved_at,bars_to_resolve,brier";
const REVIEW_FIELDS = "reviewer_model,lean_p_up,lean_p_down,lean_p_expired";

function one(embedded) {
  return Array.isArray(embedded) ? embedded[0] || null : embedded || null;
}

function normalize(row) {
  const num = (v) => (v === null || v === undefined ? null : Number(v));
  const outcome = one(row.outcomes);
  const review = one(row.scenario_reviews);
  return {
    ...row,
    ref_price: num(row.ref_price),
    atr: num(row.atr),
    up_level: num(row.up_level),
    up_level_2: num(row.up_level_2),
    down_level: num(row.down_level),
    p_up: num(row.p_up),
    p_down: num(row.p_down),
    p_expired: num(row.p_expired),
    outcome: outcome ? { ...outcome, brier: num(outcome.brier) } : null,
    review:
      review && review.lean_p_up !== null
        ? { model: review.reviewer_model, p_up: num(review.lean_p_up), p_down: num(review.lean_p_down), p_expired: num(review.lean_p_expired) }
        : null,
  };
}

// Every scenario, newest first, with its outcome and (once that table exists) the AI reviewer's lean.
export async function getRecord(limit = 300) {
  const order = `order=issued_at.desc,created_at.desc&limit=${limit}`;
  const withReviews = await rest(
    `forecasts?select=${FORECAST_FIELDS},outcomes(${OUTCOME_FIELDS}),scenario_reviews(${REVIEW_FIELDS})&${order}`,
  );
  const rows = withReviews ?? (await rest(`forecasts?select=${FORECAST_FIELDS},outcomes(${OUTCOME_FIELDS})&${order}`));
  return rows ? rows.map(normalize) : null;
}

// The newest scenario for each symbol.
export function latestBySymbol(record) {
  const seen = new Map();
  for (const row of record || []) if (!seen.has(row.symbol)) seen.set(row.symbol, row);
  return Object.keys(SYMBOLS).map((s) => seen.get(s)).filter(Boolean);
}

function brierOf(probs, outcome) {
  return ["up", "down", "expired"].reduce((sum, k) => sum + (probs[k] - (outcome === k ? 1 : 0)) ** 2, 0);
}

export function summarize(record) {
  const rows = record || [];
  const resolved = rows.filter((r) => r.outcome);
  const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
  const favorite = (r) =>
    [["up", r.p_up], ["down", r.p_down], ["expired", r.p_expired]].sort((a, b) => b[1] - a[1])[0][0];
  const reviewed = resolved.filter((r) => r.review);
  return {
    published: rows.length,
    open: rows.length - resolved.length,
    resolved: resolved.length,
    brier: mean(resolved.map((r) => r.outcome.brier)),
    favoriteHitRate: mean(resolved.map((r) => (favorite(r) === r.outcome.outcome ? 1 : 0))),
    outcomes: {
      up: resolved.filter((r) => r.outcome.outcome === "up").length,
      down: resolved.filter((r) => r.outcome.outcome === "down").length,
      expired: resolved.filter((r) => r.outcome.outcome === "expired").length,
    },
    reviewer: reviewed.length
      ? {
          n: reviewed.length,
          engine: mean(reviewed.map((r) => r.outcome.brier)),
          ai: mean(reviewed.map((r) => brierOf({ up: r.review.p_up, down: r.review.p_down, expired: r.review.p_expired }, r.outcome.outcome))),
        }
      : null,
    firstDate: rows.length ? rows[rows.length - 1].issued_at : null,
  };
}

export function fmtPrice(v) {
  if (v === null || v === undefined) return "—";
  const digits = v >= 1000 ? 0 : 2;
  return v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function fmtPct(v, digits = 0) {
  return v === null || v === undefined ? "—" : `${(v * 100).toFixed(digits)}%`;
}

export function fmtChange(level, ref) {
  const pct = (level / ref - 1) * 100;
  return `${pct >= 0 ? "+" : "−"}${Math.abs(pct).toFixed(1)}%`;
}

export function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
