import Link from "next/link";

export const metadata = { title: "Terms of Service" };

export default function Terms() {
  return (
    <main className="page">
      <div className="wrap">
        <p className="eyebrow">Legal · Draft for review</p>
        <h1>Terms of Service</h1>
        <p>These terms are an agreement between you and Berrezueta Inc. ("we"), which operates Deltalyn and deltalyn.com.</p>
        <h2>What Deltalyn is</h2>
        <p>Deltalyn publishes general market scenarios for US stocks and crypto: price levels and model-estimated odds, the same for every reader. It is a publication, not an advisory service. It does not know your financial situation or goals, does not give personalized advice or recommendations, and does not manage money, hold funds or place trades.</p>
        <h2>Odds and the track record</h2>
        <p>Odds are statistical estimates from historical data and can be wrong. Every scenario is recorded before the market moves and graded automatically on the public track record, including the ones that miss. Past results do not predict future results.</p>
        <h2>Your responsibilities</h2>
        <p>You are solely responsible for your investment and trading decisions and their results. Investing and trading involve risk of loss, including loss of principal, and crypto assets are especially volatile. Consider consulting a licensed professional about your own situation.</p>
        <h2>Subscriptions and refunds</h2>
        <p>Deltalyn Pro is billed monthly through Stripe until you cancel. Pro features roll out during the beta and founding members receive each one first. You can cancel any time; access continues until the end of the paid period. If Pro is not useful to you in the first 14 days, email support@deltalyn.com for a full refund.</p>
        <h2>Data</h2>
        <p>Market data comes from third-party providers and may be delayed, incomplete or wrong. We do not guarantee its accuracy or the uninterrupted availability of the site.</p>
        <h2>Limitation of liability</h2>
        <p>To the extent permitted by law, our total liability is limited to the fees you paid us in the 12 months before the claim. We are not liable for investment or trading losses.</p>
        <p><Link href="/">Back to deltalyn.com</Link></p>
      </div>
    </main>
  );
}
