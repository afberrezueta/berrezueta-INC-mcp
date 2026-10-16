-- Waitlist sign-ups from deltalyn.com.
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  os          text check (os in ('windows', 'mac', 'both')),
  markets     text[] not null default '{}',
  prop        text check (prop in ('now', 'planning', 'no')),
  founder     boolean not null default false,
  lang        text,
  source      text not null default 'website',
  created_at  timestamptz not null default now(),
  constraint waitlist_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254)
);

create unique index if not exists waitlist_email_unique on public.waitlist (lower(email));

-- The website inserts with the publishable key. Visitors can add a row but never read, change or delete any.
alter table public.waitlist enable row level security;

drop policy if exists "Anyone can join the waitlist" on public.waitlist;
create policy "Anyone can join the waitlist"
  on public.waitlist for insert
  to anon
  with check (true);

revoke all on public.waitlist from anon, authenticated;
grant insert on public.waitlist to anon;
