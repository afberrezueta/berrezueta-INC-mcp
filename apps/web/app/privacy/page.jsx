import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <main className="page">
      <div className="wrap">
        <p className="eyebrow">Legal · Draft for review</p>
        <h1>Privacy Policy</h1>
        <p>Berrezueta Inc. operates Deltalyn. This policy explains what we collect on deltalyn.com.</p>
        <h2>Reading the site</h2>
        <p>You can read the scenarios and the track record without an account. We do not use advertising trackers.</p>
        <h2>The email list</h2>
        <p>When you join the list we store your email address and the optional answers you give (markets you follow, your horizon, interest in Pro, browser language). We use them only to email you about Deltalyn and to decide which markets to add first. We do not sell them. Every email includes a way to unsubscribe.</p>
        <h2>Payments</h2>
        <p>Payments are processed by Stripe. We receive your name, email, billing country and subscription status, but never your full card number.</p>
        <h2>Your choices</h2>
        <p>To access or delete your data, email support@deltalyn.com and we will respond within 30 days.</p>
        <p><Link href="/">Back to deltalyn.com</Link></p>
      </div>
    </main>
  );
}
