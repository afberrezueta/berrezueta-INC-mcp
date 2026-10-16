import Link from "next/link";

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="Deltalyn home">
          <img src="/icon.svg" alt="" width="28" height="28" />
          Deltalyn
        </Link>
        <nav className="nav-links" aria-label="Sections">
          <Link href="/#today">Today</Link>
          <Link href="/#how">How it works</Link>
          <Link href="/track-record">Track record</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link className="btn btn-primary" href="/#join">Get the daily plan</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <p><strong>Deltalyn</strong> is a product of Berrezueta Inc.</p>
        <div className="foot-links">
          <Link href="/track-record">Track record</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <span className="num">support@deltalyn.com</span>
        </div>
        <p>
          Deltalyn publishes the same general market scenarios to every reader. Nothing on this site is personalized
          investment advice or a recommendation to buy, sell or hold any security, cryptocurrency or other instrument,
          and Deltalyn does not know your finances or goals. Probabilities are model estimates from historical data;
          they are not guarantees, and past results do not predict future results. Investing and trading involve risk
          of loss, including loss of principal. Crypto assets are especially volatile. You are solely responsible for
          your decisions.
        </p>
        <p>Market data: Financial Modeling Prep. Crypto derivatives data: CryptoQuant.</p>
        <p>© 2026 Berrezueta Inc.</p>
      </div>
    </footer>
  );
}
