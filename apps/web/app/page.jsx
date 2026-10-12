import Hero3D from "@/components/Hero";
import ProposalCard from "@/components/ProposalCard";
import TiltCard from "@/components/TiltCard";
import WaitlistForm from "@/components/WaitlistForm";

const PRO_LINK = process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || "https://buy.stripe.com/28EdR9fiZ0ze7PEdC6cbC04";

const workflows = [
  {
    when: "Before the open",
    title: "Pre-market brief",
    text: "Overnight range, prior-day high and low, key levels from your own indicators, and today's economic calendar. One screen, every number sourced.",
    glyph: (
      <svg className="glyph" viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="22" width="5" height="12" rx="1" fill="#5AA9FF"/><rect x="13" y="14" width="5" height="20" rx="1" fill="#5AA9FF"/><rect x="22" y="18" width="5" height="16" rx="1" fill="#FF9F43"/><path d="M2 9h36" stroke="#8C9BFF" strokeWidth="2" strokeDasharray="3 3"/></svg>
    ),
  },
  {
    when: "Practice",
    title: "Replay coach",
    text: "Drill any date bar by bar in TradingView's replay mode. Deltalyn asks why you took each simulated trade and flags where you broke your own rules.",
    glyph: (
      <svg className="glyph" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="none" stroke="#8C9BFF" strokeWidth="2"/><path d="M16 13v14l11-7z" fill="#5AA9FF"/></svg>
    ),
  },
  {
    when: "After the close",
    title: "Session review",
    text: "A plain summary of what the market did against your plan, saved with screenshots to a private journal that stays on your computer.",
    glyph: (
      <svg className="glyph" viewBox="0 0 40 40" aria-hidden="true"><rect x="7" y="5" width="26" height="30" rx="3" fill="none" stroke="#8C9BFF" strokeWidth="2"/><path d="M12 14h16M12 20h16M12 26h10" stroke="#5AA9FF" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
];

const faqs = [
  ["Is this a trading bot or a signal service?", "No. Deltalyn reads your chart and helps you prepare, practice and review. It does not give buy or sell recommendations and it cannot place orders."],
  ["What do I need to use it?", "TradingView Desktop on Windows or macOS with your own TradingView plan; a paid plan is recommended for real-time data. Deltalyn uses Claude by Anthropic for its reasoning, and during the beta you connect your own Claude account."],
  ["Does it work with my broker or prop firm platform?", "Deltalyn works only with TradingView Desktop. It never connects to brokers or prop firm platforms, so it never touches your account or your orders."],
  ["Is Deltalyn made by TradingView?", "No. Deltalyn is built by Berrezueta Inc. and is not affiliated with, endorsed by, or associated with TradingView, Inc."],
  ["What happens when TradingView updates their app?", "Updates can change how the desktop app works inside. We test new versions and publish which ones are supported. If something breaks, Deltalyn tells you instead of showing stale data."],
  ["Can I cancel Pro?", "Yes, any time, from the link in your Stripe receipt. If Deltalyn doesn't work for you in the first 14 days, email support@deltalyn.com for a full refund."],
  ["¿Habrá versión en español?", "Sí. Después del lanzamiento en Estados Unidos llegará la versión en español para Latinoamérica y España. Únete a la lista y te avisamos."],
];

export default function Home() {
  return (
    <>
      <header className="nav">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Deltalyn home">
            <img src="/icon.svg" alt="" width="28" height="28" />
            Deltalyn
          </a>
          <nav className="nav-links" aria-label="Sections">
            <a href="#how">How it works</a>
            <a href="#workflows">Workflows</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a className="btn btn-primary" href="#join">Join the waitlist</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero" style={{ paddingBlock: 0 }}>
          <Hero3D />
          <div className="wrap">
            <div className="hero-copy">
              <p className="eyebrow">For futures traders on TradingView Desktop</p>
              <h1>A copilot that reads your chart. You make the calls.</h1>
              <p className="lede">
                Deltalyn connects AI to the TradingView Desktop app on your computer. It writes your pre-market brief,
                coaches you through replay drills, and reviews your session. It never places a trade.
              </p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#join">Join the waitlist</a>
                <a className="btn btn-ghost" href="#pricing">See pricing</a>
              </div>
              <p className="hero-note">Private beta for macOS and Windows.</p>
            </div>
            <ProposalCard />
          </div>
        </section>

        <section id="how">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">How it works</p>
              <h2>Your chart stays on your computer.</h2>
              <p className="lede">Deltalyn runs next to TradingView Desktop and talks to it directly. Your chart data is not uploaded to our servers.</p>
            </div>
            <div className="steps">
              <div className="step"><span className="step-n">Step 1</span><h3>Open TradingView Desktop</h3><p>Use your own TradingView plan and layouts. Deltalyn starts the app with a local connection and checks that it works.</p></div>
              <div className="step"><span className="step-n">Step 2</span><h3>Ask in plain English</h3><p>"Build my pre-market brief for NQ." Deltalyn reads price, indicators, and the levels your Pine scripts draw.</p></div>
              <div className="step"><span className="step-n">Step 3</span><h3>Approve what changes</h3><p>Reading is automatic. Anything that changes your chart, like a line or an alert, waits for your OK.</p></div>
            </div>
            <div className="flow">
              <svg viewBox="0 0 900 120" role="img" aria-label="You talk to Deltalyn on your computer. Deltalyn reads TradingView Desktop locally and uses Claude for reasoning.">
                <g fontFamily="var(--font-body), sans-serif" fontSize="15" fill="#EEF2F8">
                  <rect x="10" y="30" width="150" height="60" rx="12" fill="#111A2C" stroke="#1F2A41" />
                  <text x="85" y="66" textAnchor="middle">You</text>
                  <rect x="250" y="20" width="400" height="80" rx="14" fill="none" stroke="#2A3756" strokeDasharray="5 5" />
                  <text x="450" y="13" textAnchor="middle" fontSize="11" fill="#98A3B8" fontFamily="var(--font-data), monospace">YOUR COMPUTER</text>
                  <rect x="270" y="35" width="160" height="50" rx="10" fill="#111A2C" stroke="#8C9BFF" />
                  <text x="350" y="66" textAnchor="middle" fontWeight="600">Deltalyn</text>
                  <rect x="470" y="35" width="160" height="50" rx="10" fill="#111A2C" stroke="#1F2A41" />
                  <text x="550" y="66" textAnchor="middle">TradingView Desktop</text>
                  <rect x="740" y="30" width="150" height="60" rx="12" fill="#111A2C" stroke="#1F2A41" />
                  <text x="815" y="66" textAnchor="middle">Claude AI</text>
                </g>
                <g stroke="#98A3B8" strokeWidth="1.5" fill="none"><path d="M160 60H262" /><path d="M430 60H462" /><path d="M650 60H732" /></g>
                <g fontFamily="var(--font-data), monospace" fontSize="11" fill="#98A3B8">
                  <text x="211" y="52" textAnchor="middle">questions</text>
                  <text x="691" y="52" textAnchor="middle">reasoning</text>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <section id="workflows" className="border-top">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">Workflows</p>
              <h2>Built around your trading day.</h2>
              <p className="lede">Most evaluations are lost on preparation and discipline, not on the chart. Deltalyn gives each part of the day a routine.</p>
            </div>
            <div className="cards">
              {workflows.map((w) => (
                <TiltCard key={w.title}>
                  {w.glyph}
                  <span className="when">{w.when}</span>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </TiltCard>
              ))}
            </div>
            <p className="also">Also included: a Pine Script assistant that writes, compiles and fixes scripts in your editor, and a multi-symbol scan of your watchlist.</p>
          </div>
        </section>

        <section className="border-top">
          <div className="wrap brief-grid">
            <div className="sec-head">
              <p className="eyebrow">Every number has a source</p>
              <h2>It shows its work.</h2>
              <p className="lede">Values read straight from your chart are marked Observed. Anything the AI estimates is marked Inferred, so you always know which is which.</p>
            </div>
            <div className="brief">
              <div className="brief-top"><span>Pre-market brief · NQ · 08:41 ET</span><span className="tag-example">Example output</span></div>
              <div className="brief-body">
                <table className="levels">
                  <thead><tr><th>Level</th><th>Price</th><th>Basis</th></tr></thead>
                  <tbody>
                    <tr><td>Prior-day high</td><td className="num">24,550.25</td><td><span className="conf">Observed</span></td></tr>
                    <tr><td>Overnight high</td><td className="num">24,512.00</td><td><span className="conf">Observed</span></td></tr>
                    <tr><td>VWAP (session)</td><td className="num">24,468.75</td><td><span className="conf">Observed</span></td></tr>
                    <tr><td>Overnight low</td><td className="num">24,401.50</td><td><span className="conf">Observed</span></td></tr>
                    <tr><td>Likely balance zone</td><td className="num">24,440–24,480</td><td><span className="conf inferred">Inferred</span></td></tr>
                  </tbody>
                </table>
                <p className="brief-note">Price opened inside the overnight range. CPI is due at 08:30 ET tomorrow. No trade ideas are given: what to do with these levels is your call.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="trust" className="border-top">
          <div className="wrap">
            <div className="sec-head"><p className="eyebrow">Trust</p><h2>Designed to keep you in control.</h2></div>
            <div className="trust">
              <div><h3>Runs on your computer</h3><p>Deltalyn connects to TradingView Desktop locally. Your chart data is not uploaded to us or resold.</p></div>
              <div><h3>You approve every change</h3><p>Lines, alerts, symbol changes and Pine saves are shown to you first. Nothing is applied until you confirm.</p></div>
              <div><h3>Never places trades</h3><p>No broker connection, no order buttons. Replay trades are simulated and stay in TradingView's replay mode.</p></div>
              <div><h3>No signals, no promises</h3><p>Deltalyn describes the chart and helps you follow your own plan. It does not tell you what to buy or sell.</p></div>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-top">
          <div className="wrap">
            <div className="sec-head"><p className="eyebrow">Pricing</p><h2>One plan. Cancel any time.</h2></div>
            <div className="pricing">
              <div className="plan">
                <div className="plan-name"><h3>Waitlist</h3></div>
                <div className="price"><strong>$0</strong><span>to join</span></div>
                <ul>
                  <li>Get invited to the private beta as seats open</li>
                  <li>Product updates, about twice a month</li>
                  <li>No card required</li>
                </ul>
                <a className="btn btn-ghost" href="#join">Join the waitlist</a>
              </div>
              <div className="plan featured">
                <div className="plan-name"><h3>Deltalyn Pro</h3><span className="badge">Beta access first</span></div>
                <div className="price"><strong className="num">$19.99</strong><span>per month</span></div>
                <ul>
                  <li>First invites to the private beta for macOS and Windows</li>
                  <li>Pre-market brief, replay coach and session review</li>
                  <li>Pine Script assistant and watchlist scan</li>
                  <li>Compatibility fixes when TradingView updates</li>
                  <li>14-day money-back guarantee</li>
                </ul>
                <a className="btn btn-primary" href={PRO_LINK} rel="noopener">Subscribe with Stripe</a>
                <p className="fine">Billed monthly by Berrezueta Inc. through Stripe. Cancel any time from your receipt email.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="join" className="border-top">
          <div className="wrap">
            <div className="glass join">
              <div className="sec-head" style={{ marginBottom: 0 }}>
                <p className="eyebrow">Private beta</p>
                <h2>Get early access.</h2>
                <p className="lede">We're opening the beta to a small group of US futures traders first. Tell us a little about how you trade so we can invite the right people.</p>
              </div>
              <WaitlistForm />
            </div>
          </div>
        </section>

        <section id="faq" className="border-top">
          <div className="wrap">
            <div className="sec-head"><p className="eyebrow">FAQ</p><h2>Questions traders ask.</h2></div>
            <div className="faq">
              {faqs.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <p><strong>Deltalyn</strong> is a product of Berrezueta Inc.</p>
          <div className="foot-links">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <span className="num">support@deltalyn.com</span>
          </div>
          <p>Deltalyn is educational software. Nothing it shows is investment advice or a recommendation to buy or sell any security, future or other instrument. Trading futures involves substantial risk of loss and is not suitable for every investor. You are solely responsible for your trading decisions.</p>
          <p>TradingView is a trademark of TradingView, Inc. Deltalyn is not affiliated with, endorsed by, or associated with TradingView, Inc. Claude is a trademark of Anthropic, PBC.</p>
          <p>© 2026 Berrezueta Inc.</p>
        </div>
      </footer>
    </>
  );
}
