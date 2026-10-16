import Link from "next/link";
import { OddsBar } from "@/components/ScenarioCard";
import { Footer, Nav } from "@/components/SiteChrome";
import { UNIFORM_BRIER, fmtDate, fmtPct, fmtPrice, getRecord, summarize } from "@/lib/ledger";

export const revalidate = 300;

export const metadata = {
  title: "Track record",
  description: "Every Deltalyn scenario since day one, locked before the market moved and graded automatically. Wins and misses.",
};

const RESULT = { up: "Upper first", down: "Lower first", expired: "Neither" };

export default async function TrackRecord() {
  const record = await getRecord(500);
  const stats = summarize(record);

  return (
    <>
      <Nav />
      <main className="record-page">
        <section>
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">Track record · Public ledger</p>
              <h1 className="h1-sm">Every call, as it was made.</h1>
              <p className="lede">
                Each scenario is fingerprinted with SHA-256 and locked in an append-only database before the market moves.
                When the upper level, the lower level, or the 10-day deadline is reached, it is graded automatically.
                Nothing here can be edited or removed, by us or anyone else.
              </p>
            </div>

            <div className="stats stats-wide">
              <div><span className="num stat">{stats.published}</span><span>published</span></div>
              <div><span className="num stat">{stats.open}</span><span>still open</span></div>
              <div><span className="num stat">{stats.resolved}</span><span>resolved</span></div>
              <div>
                <span className="num stat">{stats.brier === null ? "—" : stats.brier.toFixed(3)}</span>
                <span>average Brier score · baseline {UNIFORM_BRIER.toFixed(3)}</span>
              </div>
              <div>
                <span className="num stat">{fmtPct(stats.favoriteHitRate)}</span>
                <span>most likely outcome happened</span>
              </div>
            </div>

            <div className="explain">
              <p>
                <strong>How to read the score.</strong> The Brier score measures how close the odds were to what happened,
                from 0 (perfect) to 2 (confidently wrong). Giving each outcome a one-in-three chance always scores{" "}
                {UNIFORM_BRIER.toFixed(3)}, so a useful model has to stay below that over many scenarios.{" "}
                {stats.resolved < 100
                  ? `With ${stats.resolved} resolved so far, it is too early to draw conclusions.`
                  : "Look at the trend over many scenarios, not at any single call."}
              </p>
              {stats.reviewer && (
                <p>
                  <strong>AI reviewer (in testing).</strong> On the same {stats.reviewer.n} resolved scenarios, our model
                  scores {stats.reviewer.engine.toFixed(3)} and the independent AI reviewer scores {stats.reviewer.ai.toFixed(3)}.
                  The reviewer doesn't affect what we publish unless it proves more accurate.
                </p>
              )}
            </div>

            {record === null ? (
              <p className="empty">The ledger is temporarily unavailable. Please check back in a few minutes.</p>
            ) : record.length === 0 ? (
              <p className="empty">No scenarios yet. The first ones publish after the next US market close.</p>
            ) : (
              <div className="table-wrap">
                <table className="ledger">
                  <caption className="sr-only">All published scenarios, newest first</caption>
                  <thead>
                    <tr>
                      <th scope="col">Issued</th>
                      <th scope="col">Market</th>
                      <th scope="col" className="r">Close</th>
                      <th scope="col" className="r">Upper</th>
                      <th scope="col" className="r">Lower</th>
                      <th scope="col">Odds up · neither · down</th>
                      <th scope="col">Result</th>
                      <th scope="col" className="r">Brier</th>
                      <th scope="col">Fingerprint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.map((r) => (
                      <tr key={r.id}>
                        <td className="num">{fmtDate(r.issued_at)}</td>
                        <td><strong>{r.symbol}</strong></td>
                        <td className="num r">{fmtPrice(r.ref_price)}</td>
                        <td className="num r up">{fmtPrice(r.up_level)}</td>
                        <td className="num r down">{fmtPrice(r.down_level)}</td>
                        <td>
                          <div className="odds-cell">
                            <span className="num">{fmtPct(r.p_up)} · {fmtPct(r.p_expired)} · {fmtPct(r.p_down)}</span>
                            <OddsBar up={r.p_up} expired={r.p_expired} down={r.p_down} label="" />
                          </div>
                        </td>
                        <td>
                          {r.outcome ? (
                            <span className={`state state-${r.outcome.outcome}`}>
                              {RESULT[r.outcome.outcome]} · {fmtDate(r.outcome.resolved_at)}
                            </span>
                          ) : (
                            <span className="state">Open</span>
                          )}
                        </td>
                        <td className="num r">{r.outcome ? r.outcome.brier.toFixed(3) : "—"}</td>
                        <td className="num hash" title={`SHA-256 ${r.content_hash} · model ${r.model_version}`}>
                          {r.content_hash.slice(0, 10)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="fine record-fine">
              Odds are model estimates from historical data, not guarantees. Past results do not predict future results.
              Scenarios are general and the same for every reader; they are not advice to buy or sell anything.
              Model versions are shown on hover over each fingerprint. <Link href="/#how">How the scenarios are built</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
