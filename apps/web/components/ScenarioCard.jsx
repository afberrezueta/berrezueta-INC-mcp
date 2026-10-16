import { SYMBOLS, fmtChange, fmtDate, fmtPct, fmtPrice, methodLabels } from "@/lib/ledger";

const OUTCOME_TEXT = {
  up: "Reached the upper level first",
  down: "Reached the lower level first",
  expired: "Touched neither level",
};

export function OddsBar({ up, expired, down, label }) {
  return (
    <div className="odds" role="img" aria-label={label}>
      <span className="odds-up" style={{ flexGrow: up }} />
      <span className="odds-mid" style={{ flexGrow: expired }} />
      <span className="odds-down" style={{ flexGrow: down }} />
    </div>
  );
}

export default function ScenarioCard({ s, featured = false }) {
  const meta = SYMBOLS[s.symbol] || { name: s.symbol, kind: "" };
  const status = s.outcome
    ? `Resolved ${fmtDate(s.outcome.resolved_at)}: ${OUTCOME_TEXT[s.outcome.outcome]}`
    : `Open · ${s.horizon_bars}-day window`;
  return (
    <article className={`scenario${featured ? " glass" : ""}`} aria-label={`${s.symbol} scenario issued ${fmtDate(s.issued_at)}`}>
      <header className="scenario-head">
        <div>
          <h3>{s.symbol}</h3>
          <p>{meta.name} · {meta.kind}</p>
        </div>
        <div className="scenario-ref">
          <span className="num">{fmtPrice(s.ref_price)}</span>
          <span>Close · {fmtDate(s.issued_at).replace(/, \d{4}$/, "")}</span>
        </div>
      </header>

      <dl className="legs">
        <div className="leg leg-up">
          <dt>Upper level</dt>
          <dd>
            <span className="num lvl">{fmtPrice(s.up_level)}</span>
            <span className="num chg">{fmtChange(s.up_level, s.ref_price)}</span>
            <span className="num p">{fmtPct(s.p_up)}</span>
          </dd>
          <dd className="why">{methodLabels(s.up_methods).join(" · ")}</dd>
        </div>
        <div className="leg leg-mid">
          <dt>Neither level</dt>
          <dd>
            <span className="lvl">Stays in range</span>
            <span className="chg" />
            <span className="num p">{fmtPct(s.p_expired)}</span>
          </dd>
        </div>
        <div className="leg leg-down">
          <dt>Lower level</dt>
          <dd>
            <span className="num lvl">{fmtPrice(s.down_level)}</span>
            <span className="num chg">{fmtChange(s.down_level, s.ref_price)}</span>
            <span className="num p">{fmtPct(s.p_down)}</span>
          </dd>
          <dd className="why">{methodLabels(s.down_methods).join(" · ")}</dd>
        </div>
      </dl>

      <OddsBar
        up={s.p_up}
        expired={s.p_expired}
        down={s.p_down}
        label={`Odds: upper level first ${fmtPct(s.p_up)}, neither ${fmtPct(s.p_expired)}, lower level first ${fmtPct(s.p_down)}`}
      />

      <footer className="scenario-foot">
        <span className={`state${s.outcome ? ` state-${s.outcome.outcome}` : ""}`}>{status}</span>
        <span className="num hash" title={`SHA-256 ${s.content_hash}`}>#{s.content_hash.slice(0, 8)}</span>
      </footer>
    </article>
  );
}
