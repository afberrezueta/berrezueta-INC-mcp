# deltalyn.com

The Deltalyn website. It publishes daily market scenarios for US stocks and crypto, plus a public track record of every scenario. It also has the email list and the Deltalyn Pro subscription. English first for the US launch; Spanish comes later.

## Pages

- `/`
  - Today's scenarios, read live from the ledger and refreshed every 5 minutes.
  - The two horizons: Trade (live now) and Invest (in development).
  - How it works, a track-record summary, pricing, the email list and FAQ.
- `/track-record`
  - Every scenario ever published, newest first, with its result, Brier score and SHA-256 fingerprint.
  - The AI reviewer's score, once that review data exists.
- `/terms`, `/privacy`, `/welcome` (after a Stripe payment).

Both pages read the ledger tables `forecasts`, `outcomes` and `scenario_reviews` with the publishable key. Row-level security makes those tables read-only for that key. If the ledger can't be reached, the home page shows a labeled example and the track record says it's unavailable.

Stack:

- Next.js (App Router)
- React Three Fiber (three.js) for the 3D hero
- Supabase for the ledger and the email list
- A Stripe Payment Link for the $19.99/month Deltalyn Pro plan

Operated by Berrezueta Inc.

## Run locally

```bash
cd apps/web
cp .env.example .env.local   # fill in the Supabase values
npm install
npm run dev                  # http://localhost:3000
```

## Environment variables

| Name | Where to find it |
|---|---|
| `SUPABASE_URL` | Supabase → project `deltalyn` → Project Settings → API |
| `SUPABASE_PUBLISHABLE_KEY` | Same page. Use the `sb_publishable_…` key, never the secret key |
| `NEXT_PUBLIC_STRIPE_PRO_LINK` | Stripe Payment Link for Deltalyn Pro (already defaults to the live link) |

Without the Supabase variables:

- The email list answers "Sign-ups aren't open yet" and stores nothing.
- The pages show the fallback described above.

## Database

Apply the files in `supabase/migrations/` to the `deltalyn` project, in order. You can paste each one into the SQL editor or run `supabase db push`.

| File | What it creates |
|---|---|
| `20261012000000_waitlist.sql` | `public.waitlist`. The publishable key can insert rows but can't read, update or delete them. |
| `20261012010000_scenario_ledger.sql` | `forecasts`, `outcomes` and the `open_forecasts` view. Publicly readable and append-only. |
| `20261016000000_reviews_and_waitlist_horizon.sql` | `scenario_reviews`, the `reviewer_scores` view, and the waitlist `horizon` column. |

To see sign-ups, open the Supabase dashboard and go to Table Editor → `waitlist`.

## Stripe

- Product: **Deltalyn Pro**, $19.99 USD per month, recurring
- Payment Link: https://buy.stripe.com/28EdR9fiZ0ze7PEdC6cbC04
- After payment, Stripe redirects to `/welcome`

## Deploy on Vercel

The Vercel project uses **Root Directory** `apps/web` and the Next.js framework preset.

1. Add the environment variables above.
2. Under Domains, add `deltalyn.com` and `www.deltalyn.com`.
3. Copy the DNS records Vercel shows into your domain registrar.
