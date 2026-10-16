import Link from "next/link";
import Hero3D from "@/components/Hero";
import ScenarioCard from "@/components/ScenarioCard";
import { Footer, Nav } from "@/components/SiteChrome";
import TiltCard from "@/components/TiltCard";
import WaitlistForm from "@/components/WaitlistForm";
import { UNIFORM_BRIER, fmtDate, getRecord, latestBySymbol, summarize } from "@/lib/ledger";

export const revalidate = 300;

const PRO_LINK = process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || "https://buy.stripe.com/28EdR9fiZ0ze7PEdC6cbC04";

// Shown only if the ledger cannot be reached. A real scenario from the first day of the public record.
const EXAMPLE = {
  symbol: "SPY", issued_at: "2026-10-16", horizon_bars: 10, ref_price: 762.5,
  up_level: 775.6283, down_level: 749.6875, p_up: 0.3874, p_down: 0.3564, p_expired: 0.2562,
  up_methods: ["swing_high", "prev_month_high", "vah"], down_methods: ["swing_low", "prev_month_low"],
  content_hash: "dab4856dc557311b13b88e3d4bc136db01bc7265ad40ebf01494c7ea6ce093a8", outcome: null,
};

const modes = [
  {
    when: "Days to weeks",
    title: "Trade mode",
    text: "Each scenario names the level above, the level below, and the odds of which one price reaches first within 10 trading days. If neither is reached, that is an outcome too, and we grade it.",
    tag: "Live now",
    glyph: (
      <svg className="glyph" viewBox="0 0 40 40" aria-hidden="true"><path d="M2 9h36" stroke="#5AA9FF" strokeWidth="2" strokeDasharray="3 3"/><path d="M2 31h36" stroke="#FF9F43" strokeWidth="2" strokeDasharray="3 3"/><path d="M4 22l7-4 6 5 7-8 6 4 6-3" stroke="#EEF2F8" strokeWidth="2" fill="none" strokeLinejoin="round"/></svg>
    ),
  },
  {
    when: "Months to years",
    title: "Invest mode",
    text: "A fair-value band and accumulation zones for long-term positions, built from the same levels and scored on the same public record. No day-to-day noise.",
    tag: "In development",
    glyph: (
      <svg className="glyph" viewBox="0 0 40 40" aria-hidden="true"><rect x="3" y="14" width="34" height="14" rx="3" fill="rgba(140,155,255,0.15)" stroke="#8C9BFF" strokeWidth="1.5"/><path d="M4 30c6-2 9-10 16-12s11-6 16-10" stroke="#EEF2F8" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
    ),
  },
];

const faqs = [
  ["Is this investment advice?", "No. Deltalyn publishes the same general scenarios to every reader. It does not know your finances, goals or risk tolerance, and it never tells you what to buy or sell. How you use a level is your decision."],
  ["Where do the levels come from?", "From price history only: swing highs and lows, the prior day, week and month highs and lows, and the volume profile. Levels that cluster are merged, and each level shows its sources."],
  ["How are the odds calculated?", "For each symbol we replay the same setup, measured in average daily ranges (ATR), across its own history and count how often the upper level, the lower level, or neither was reached first. Thin samples are pulled toward a neutral random-walk estimate so the numbers stay modest."],
  ["Why do you publish the misses?", "Because a track record you can't check is marketing. Every scenario is written to an append-only ledger with a fingerprint (SHA-256) before the market moves, then graded automatically with a Brier score. Nothing can be edited or deleted afterwards."],
  ["What is the AI reviewer?", "An AI model reviews every scenario and gives its own independent odds. For now it only runs in the background: its calls are recorded and graded next to ours, and it will influence what we publish only if the record shows it is more accurate."],
  ["Which markets do you cover?", "During the beta: SPY and QQQ for US stocks, Bitcoin and Ether for crypto. More symbols come with Pro."],
  ["Can I cancel Pro?", "Yes, any time, from the link in your Stripe receipt. If Pro isn't useful to you in the first 14 days, email support@deltalyn.com for a full refund."],
  ["¿Habrá versión en español?", "Sí. Después del lanzamiento en Estados Unidos llegará la versión en español para Latinoamérica y España. Únete a la lista y te avisamos."],
];

export default async function Home() {
  const record = await getRecord(300);
  const today = latestBySymbol(record);
  const stats = summarize(record);
  const featured = today.find((s) => s.symbol === "SPY") || today[0] || EXAMPLE;
  const live = today.length > 0;

  return (
    <>
      <Nav />
      <main id="top">
        <section className="hero" style={{ paddingBlock: 0 }}>
          <Hero3D />
          <div className="wrap">
            <div className="hero-copy">
              <p className="eyebrow">US stocks and crypto · Updated every trading day</p>
              <h1>Clear levels. Honest odds. Every call on the record.</h1>
              <p className="lede">
                Each day Deltalyn publishes a scenario for each market: the level above, the level below, and the odds of
                which one price reaches first. Every scenario is graded automatically and stays public, including the misses.
              </p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#today">See today's scenarios</a>
                <Link className="btn btn-ghost" href="/track-record">Check the track record</Link>
              </div>
              <p className="hero-note">Free during the beta. No account needed to read.</p>
            </div>
            <div className="hero-card">
              {!live && <p className="tag-example">Example · {fmtDate(EXAMPLE.issued_at)}</p>}
              <ScenarioCard s={featured} featured />
            </div>
          </div>
        </section>

        <section id="today">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">Today's scenarios</p>
              <h2>{live ? `Published ${fmtDate(today[0].issued_at)}.` : "Live scenarios appear here."}</h2>
              <p className="lede">
                Odds cover the next 10 trading days. The upper and lower levels race each other; the middle band is the
                chance that price touches neither.
              </p>
            </div>
            {live ? (
              <div className="scenario-grid">
                {today.map((s) => <ScenarioCard key={s.id} s={s} />)}
              </div>
            ) : (
              <p className="empty">The scenario ledger is temporarily unavailable. Please check back in a few minutes.</p>
            )}
            <p className="also"><Link href="/track-record">See every past scenario and how it resolved →</Link></p>
          </div>
        </section>

        <section id="modes" className="border-top">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">Two horizons</p>
              <h2>Trading and investing need different plans.</h2>
              <p className="lede">A swing trade and a ten-year position shouldn't share a chart. Deltalyn keeps them apart.</p>
            </div>
            <div className="cards cards-2">
              {modes.map((m) => (
                <TiltCard key={m.title}>
                  {m.glyph}
                  <span className="when">{m.when} · {m.tag}</span>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="border-top">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">How it works</p>
              <h2>No black box. Three steps you can check.</h2>
            </div>
            <div className="steps">
              <div className="step"><span className="step-n">Step 1 · Levels</span><h3>Found in the price history</h3><p>Swing highs and lows, prior-period highs and lows, and volume-profile levels. Nearby levels merge, and each one lists where it came from.</p></div>
              <div className="step"><span className="step-n">Step 2 · Odds</span><h3>Measured, not guessed</h3><p>The same race is replayed across years of each market's own history, scaled to its volatility, then pulled toward a neutral baseline so small samples can't overpromise.</p></div>
              <div className="step"><span className="step-n">Step 3 · Record</span><h3>Graded in public</h3><p>Every scenario is fingerprinted and locked before the market moves. When it resolves, it is scored automatically. Wins and misses stay on the same page.</p></div>
            </div>
          </div>
        </section>

        <section id="record" className="border-top">
          <div className="wrap brief-grid">
            <div className="sec-head">
              <p className="eyebrow">Track record</p>
              <h2>We'll show you the score before we sell you anything.</h2>
              <p className="lede">
                In testing on past data, our odds were only as good as a neutral baseline. So we don't claim an edge:
                we publish every call, live, and let the record decide.
              </p>
            </div>
            <div className="brief">
              <div className="brief-top"><span>Public ledger · live</span><span>since {fmtDate(stats.firstDate || EXAMPLE.issued_at)}</span></div>
              <div className="brief-body">
                <div className="stats">
                  <div><span className="num stat">{stats.published}</span><span>scenarios published</span></div>
                  <div><span className="num stat">{stats.resolved}</span><span>resolved and graded</span></div>
                  <div>
                    <span className="num stat">{stats.brier === null ? "—" : stats.brier.toFixed(3)}</span>
                    <span>average Brier score (lower is better; guessing ⅓ each scores {UNIFORM_BRIER.toFixed(3)})</span>
                  </div>
                </div>
                <p className="brief-note">
                  {stats.resolved < 100
                    ? `Too early to judge: ${stats.resolved} resolved so far. We'll say so plainly once there are at least 100.`
                    : "Judge for yourself: every scenario and its grade is listed on the track record page."}
                </p>
                <Link className="btn btn-ghost" href="/track-record">Open the full track record</Link>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-top">
          <div className="wrap">
            <div className="sec-head"><p className="eyebrow">Pricing</p><h2>Free to read. Pro when you want more.</h2></div>
            <div className="pricing">
              <div className="plan">
                <div className="plan-name"><h3>Free</h3></div>
                <div className="price"><strong>$0</strong><span>during the beta</span></div>
                <ul>
                  <li>Daily scenarios for SPY, QQQ, Bitcoin and Ether</li>
                  <li>The full public track record</li>
                  <li>A spot on the list for the daily email, starting soon</li>
                </ul>
                <a className="btn btn-ghost" href="#join">Get the daily plan</a>
              </div>
              <div className="plan featured">
                <div className="plan-name"><h3>Deltalyn Pro</h3><span className="badge">Founding members</span></div>
                <div className="price"><strong className="num">$19.99</strong><span>per month</span></div>
                <ul>
                  <li>Lock in the founding price for as long as you stay subscribed</li>
                  <li>More stocks and coins as we add them, chosen with founding members</li>
                  <li>Alerts when price reaches a published level</li>
                  <li>Invest mode as soon as it launches</li>
                  <li>14-day money-back guarantee</li>
                </ul>
                <a className="btn btn-primary" href={PRO_LINK} rel="noopener">Become a founding member</a>
                <p className="fine">Pro features roll out during the beta; founding members get each one first. Billed monthly by Berrezueta Inc. through Stripe. Cancel any time.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="join" className="border-top">
          <div className="wrap">
            <div className="glass join">
              <div className="sec-head" style={{ marginBottom: 0 }}>
                <p className="eyebrow">Free daily plan</p>
                <h2>Get the daily plan.</h2>
                <p className="lede">We're starting a short email after each US market close with the new scenarios. Join the list to get it first, and tell us what you follow so we add the right markets.</p>
              </div>
              <WaitlistForm />
            </div>
          </div>
        </section>

        <section id="faq" className="border-top">
          <div className="wrap">
            <div className="sec-head"><p className="eyebrow">FAQ</p><h2>Fair questions.</h2></div>
            <div className="faq">
              {faqs.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
