-- Public, append-only scenario ledger and auto-graded outcomes.

create table if not exists public.forecasts (
  id            uuid primary key default gen_random_uuid(),
  symbol        text not null,
  issued_at     date not null,
  horizon_bars  int  not null check (horizon_bars > 0),
  ref_price     numeric not null,
  atr           numeric not null,
  up_level      numeric not null,
  up_level_2    numeric,
  down_level    numeric not null,
  p_up          numeric not null check (p_up between 0 and 1),
  p_down        numeric not null check (p_down between 0 and 1),
  p_expired     numeric not null check (p_expired between 0 and 1),
  sample_size   int not null,
  up_methods    text[] not null default '{}',
  down_methods  text[] not null default '{}',
  levels        jsonb not null default '[]',
  model_version text not null,
  content_hash  text not null,
  created_at    timestamptz not null default now(),
  unique (symbol, horizon_bars, issued_at, model_version),
  check (down_level < ref_price and ref_price < up_level)
);

create table if not exists public.outcomes (
  forecast_id     uuid primary key references public.forecasts(id),
  outcome         text not null check (outcome in ('up', 'down', 'expired')),
  resolved_at     date not null,
  bars_to_resolve int not null,
  max_favorable   numeric not null,
  max_adverse     numeric not null,
  brier           numeric not null,
  graded_at       timestamptz not null default now()
);

-- Nothing can be edited or deleted once written, not even by the service role.
create or replace function public.reject_change() returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'The scenario ledger is append-only';
end $$;

drop trigger if exists forecasts_append_only on public.forecasts;
create trigger forecasts_append_only before update or delete on public.forecasts
  for each row execute function public.reject_change();
drop trigger if exists outcomes_append_only on public.outcomes;
create trigger outcomes_append_only before update or delete on public.outcomes
  for each row execute function public.reject_change();

create or replace view public.open_forecasts with (security_invoker = true) as
  select f.* from public.forecasts f left join public.outcomes o on o.forecast_id = f.id
  where o.forecast_id is null;

-- Anyone may read the scoreboard; only the server (service role) writes.
alter table public.forecasts enable row level security;
alter table public.outcomes  enable row level security;
drop policy if exists "Public can read forecasts" on public.forecasts;
create policy "Public can read forecasts" on public.forecasts for select to anon, authenticated using (true);
drop policy if exists "Public can read outcomes" on public.outcomes;
create policy "Public can read outcomes" on public.outcomes for select to anon, authenticated using (true);
revoke insert, update, delete on public.forecasts, public.outcomes from anon, authenticated;
grant select on public.forecasts, public.outcomes, public.open_forecasts to anon, authenticated;
