# deltalyn.com

The Deltalyn website: landing page with a 3D hero, waitlist and Deltalyn Pro subscription. English first for the US launch; Spanish comes in Phase 3 (see `docs/PLAN_APP_WEB.md`).

Stack: Next.js (App Router), React Three Fiber (three.js) for the 3D scenes, Supabase for the waitlist, and a Stripe Payment Link for the $19.99/month Deltalyn Pro plan. Operated by Berrezueta Inc.

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

Without the Supabase variables, the waitlist answers "Sign-ups aren't open yet" and stores nothing.

## Database

Apply `supabase/migrations/20261012000000_waitlist.sql` to the `deltalyn` project. To do that, paste it into the SQL editor, or run `supabase db push`.

It creates `public.waitlist` with row-level security turned on. The website's publishable key can insert rows but can't read, update or delete them. To see sign-ups, use the Supabase dashboard (Table Editor → `waitlist`).

## Stripe

- Product: **Deltalyn Pro**, $19.99 USD per month, recurring
- Payment Link: https://buy.stripe.com/28EdR9fiZ0ze7PEdC6cbC04
- After payment, Stripe redirects to `/welcome`

## Deploy on Vercel

The Vercel project uses **Root Directory** `apps/web` and the Next.js framework preset.

1. Add the environment variables above.
2. Under Domains, add `deltalyn.com` and `www.deltalyn.com`.
3. Copy the DNS records Vercel shows into your domain registrar.
