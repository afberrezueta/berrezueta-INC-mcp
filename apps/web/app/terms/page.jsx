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
        <p>Deltalyn is educational software that reads and annotates the TradingView Desktop app on your own computer. It does not provide investment advice, recommendations, or signals, and it does not place trades or connect to any broker.</p>
        <h2>Your responsibilities</h2>
        <p>You need your own TradingView subscription and must follow TradingView's terms. You are solely responsible for your trading decisions and their results. Trading futures and other leveraged products involves substantial risk of loss.</p>
        <h2>Subscriptions and refunds</h2>
        <p>Deltalyn Pro is billed monthly through Stripe until you cancel. You can cancel any time; access continues until the end of the paid period. If Deltalyn does not work for you in the first 14 days, email support@deltalyn.com for a full refund.</p>
        <h2>Availability</h2>
        <p>Deltalyn depends on parts of TradingView Desktop that TradingView may change at any time. We work to keep Deltalyn compatible but cannot guarantee uninterrupted operation.</p>
        <h2>Limitation of liability</h2>
        <p>To the extent permitted by law, our total liability is limited to the fees you paid us in the 12 months before the claim. We are not liable for trading losses.</p>
        <h2>Trademarks</h2>
        <p>TradingView is a trademark of TradingView, Inc. Deltalyn is not affiliated with, endorsed by, or associated with TradingView, Inc.</p>
        <p><Link href="/">Back to deltalyn.com</Link></p>
      </div>
    </main>
  );
}
