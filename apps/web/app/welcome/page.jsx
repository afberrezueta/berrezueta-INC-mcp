import Link from "next/link";

export const metadata = { title: "Welcome to Pro", robots: { index: false } };

export default function Welcome() {
  return (
    <main className="page">
      <div className="wrap">
        <p className="eyebrow">Deltalyn Pro</p>
        <h1>You're in. Thank you.</h1>
        <p className="lede">
          Your founding membership is active and Stripe has emailed your receipt. Each Pro feature reaches founding
          members first; we'll email you at the same address as each one goes live.
        </p>
        <p>
          Questions or need a refund? Write to <span className="num">support@deltalyn.com</span>. You can cancel any
          time from the link in your Stripe receipt.
        </p>
        <p><Link className="btn btn-ghost" href="/">Back to deltalyn.com</Link></p>
      </div>
    </main>
  );
}
