import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <main className="page">
      <div className="wrap">
        <p className="eyebrow">Legal · Draft for review</p>
        <h1>Privacy Policy</h1>
        <p>Berrezueta Inc. operates Deltalyn. This policy explains what we collect on deltalyn.com and in the Deltalyn app.</p>
        <h2>Waitlist</h2>
        <p>When you join the waitlist we store your email address and the optional answers you give (computer, markets, prop firm status, language). We use them only to invite you and to decide who to invite first. We do not sell them.</p>
        <h2>Payments</h2>
        <p>Payments are processed by Stripe. We receive your name, email, billing country and subscription status, but never your full card number.</p>
        <h2>Your chart data</h2>
        <p>The Deltalyn app runs on your computer and reads TradingView Desktop locally. Your chart data is not uploaded to our servers. When you ask a question, the app sends the relevant chart context to the AI provider you connect (Claude by Anthropic) to produce an answer.</p>
        <h2>Your choices</h2>
        <p>To access or delete your data, email support@deltalyn.com and we will respond within 30 days.</p>
        <p><Link href="/">Back to deltalyn.com</Link></p>
      </div>
    </main>
  );
}
