import Link from "next/link";

// Shown at berrezuetainc.com (see next.config.js). Address and phone render only once they are filled in.
const COMPANY = {
  legalName: "Berrezueta Inc.",
  email: "contact@berrezuetainc.com",
  address: "",
  phone: "",
};

export const metadata = {
  title: { absolute: "Berrezueta Inc." },
  description: "Berrezueta Inc. builds software for investors and traders. Maker of Deltalyn.",
  alternates: { canonical: "https://berrezuetainc.com" },
  openGraph: {
    title: "Berrezueta Inc.",
    description: "Software for investors and traders. Maker of Deltalyn.",
    url: "https://berrezuetainc.com",
    siteName: "Berrezueta Inc.",
    type: "website",
  },
};

export default function Company() {
  const year = new Date().getFullYear();
  return (
    <>
      <header className="nav">
        <div className="wrap">
          <span className="brand">{COMPANY.legalName}</span>
          <nav className="nav-links" aria-label="Sections">
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="company-hero">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">{COMPANY.legalName}</p>
              <h1 className="h1-sm">Software that helps people make clearer market decisions.</h1>
              <p className="lede">
                {COMPANY.legalName} is a US software company. We build tools for investors and traders that show their
                work: clear inputs, measurable results, and nothing hidden.
              </p>
            </div>
          </div>
        </section>

        <section id="products" className="border-top">
          <div className="wrap">
            <div className="sec-head"><p className="eyebrow">Products</p><h2>Deltalyn</h2></div>
            <div className="company-product">
              <div>
                <p className="lede">
                  Daily scenarios for US stocks and crypto: the price level above, the level below, and the odds of
                  which one is reached first. Every scenario is recorded before the market moves and graded
                  automatically on a public track record.
                </p>
                <p className="fine">Deltalyn publishes general market information. It does not provide personalized investment advice.</p>
              </div>
              <a className="btn btn-primary" href="https://www.deltalyn.com" rel="noopener">Visit deltalyn.com</a>
            </div>
          </div>
        </section>

        <section id="contact" className="border-top">
          <div className="wrap">
            <div className="sec-head"><p className="eyebrow">Contact</p><h2>Get in touch.</h2></div>
            <dl className="company-contact">
              <div><dt>Company</dt><dd>{COMPANY.legalName}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></dd></div>
              {COMPANY.address && <div><dt>Address</dt><dd>{COMPANY.address}</dd></div>}
              {COMPANY.phone && <div><dt>Phone</dt><dd><a href={`tel:${COMPANY.phone.replace(/[^+\d]/g, "")}`}>{COMPANY.phone}</a></dd></div>}
            </dl>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <p>© {year} {COMPANY.legalName} All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
