"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm() {
  const [status, setStatus] = useState({ kind: "", text: "" });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();
    if (!EMAIL_RE.test(email)) {
      setStatus({ kind: "err", text: "Enter a valid email address, like you@example.com." });
      form.email.focus();
      return;
    }
    const data = {
      email,
      os: form.querySelector('input[name="os"]:checked')?.value || null,
      markets: [...form.querySelectorAll('input[name="markets"]:checked')].map((i) => i.value),
      prop: form.querySelector('input[name="prop"]:checked')?.value || null,
      founder: form.founder.checked,
      lang: navigator.language || null,
      company: form.company.value, // honeypot: real people leave this empty
    };
    setBusy(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "We couldn't save your sign-up. Try again in a minute.");
      form.reset();
      setStatus({ kind: "ok", text: "You're on the list. We'll email you when your invite is ready." });
    } catch (err) {
      setStatus({ kind: "err", text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <fieldset>
        <legend>Your computer</legend>
        <div className="opts">
          {[["windows", "Windows"], ["mac", "macOS"], ["both", "Both"]].map(([v, l]) => (
            <label className="opt" key={v}><input type="radio" name="os" value={v} id={`os-${v}`} /><span>{l}</span></label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>What you trade</legend>
        <div className="opts">
          {[["futures", "Futures"], ["stocks", "Stocks"], ["options", "Options"], ["forex", "Forex"], ["crypto", "Crypto"]].map(([v, l]) => (
            <label className="opt" key={v}><input type="checkbox" name="markets" value={v} id={`m-${v}`} /><span>{l}</span></label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Are you in a prop firm evaluation?</legend>
        <div className="opts">
          {[["now", "Yes, right now"], ["planning", "Planning to"], ["no", "No"]].map(([v, l]) => (
            <label className="opt" key={v}><input type="radio" name="prop" value={v} id={`p-${v}`} /><span>{l}</span></label>
          ))}
        </div>
      </fieldset>
      <label className="check" htmlFor="founder">
        <input type="checkbox" id="founder" name="founder" /> Email me when Deltalyn Pro opens for new subscribers.
      </label>
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Joining…" : "Join the waitlist"}</button>
      <p className={`form-msg ${status.kind}`} role="status" aria-live="polite">{status.text}</p>
    </form>
  );
}
