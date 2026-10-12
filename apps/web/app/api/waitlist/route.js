import { createClient } from "@supabase/supabase-js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OS = new Set(["windows", "mac", "both"]);
const PROP = new Set(["now", "planning", "no"]);
const MARKETS = new Set(["futures", "stocks", "options", "forex", "crypto"]);

const json = (body, status = 200) => Response.json(body, { status });

export async function POST(request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return json({ error: "Sign-ups aren't open yet. Please check back soon." }, 503);

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: "We couldn't read that sign-up. Refresh the page and try again." }, 400);
  }

  // Bots fill the hidden field; pretend it worked and store nothing.
  if (input.company) return json({ ok: true });

  const email = String(input.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "Enter a valid email address, like you@example.com." }, 400);
  }

  const row = {
    email,
    os: OS.has(input.os) ? input.os : null,
    prop: PROP.has(input.prop) ? input.prop : null,
    markets: Array.isArray(input.markets) ? input.markets.filter((m) => MARKETS.has(m)).slice(0, 5) : [],
    founder: input.founder === true,
    lang: typeof input.lang === "string" ? input.lang.slice(0, 20) : null,
  };

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("waitlist").insert(row);

  // 23505 = already signed up. Treat as success so we don't reveal who is on the list.
  if (error && error.code !== "23505") {
    console.error("waitlist insert failed", error.code, error.message);
    return json({ error: "We couldn't save your sign-up. Try again in a minute." }, 500);
  }
  return json({ ok: true });
}
