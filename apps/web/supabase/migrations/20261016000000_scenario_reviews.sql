-- Shadow reviews of each scenario: Jev's typed answers plus the market context it saw (CryptoQuant for crypto).
-- Append-only and publicly readable, like the rest of the ledger.

create table if not exists public.scenario_reviews (
  forecast_id     uuid primary key references public.forecasts(id),
  reviewer_model  text not null,
  state_hash      text not null,
  state           text not null,
  answers         jsonb not null,
  gates           jsonb not null,
  lean_p_up       numeric check (lean_p_up between 0 and 1),
  lean_p_down     numeric check (lean_p_down between 0 and 1),
  lean_p_expired  numeric check (lean_p_expired between 0 and 1),
  context         jsonb,
  latency_ms      int,
  created_at      timestamptz not null default now()
);

drop trigger if exists scenario_reviews_append_only on public.scenario_reviews;
create trigger scenario_reviews_append_only before update or delete on public.scenario_reviews
  for each row execute function public.reject_change();

alter table public.scenario_reviews enable row level security;
drop policy if exists "Public can read scenario reviews" on public.scenario_reviews;
create policy "Public can read scenario reviews" on public.scenario_reviews for select to anon, authenticated using (true);
revoke insert, update, delete on public.scenario_reviews from anon, authenticated;
grant select on public.scenario_reviews to anon, authenticated;

-- Engine vs Jev on the same resolved races: lower Brier is better.
create or replace view public.reviewer_scores with (security_invoker = true) as
  select f.symbol, f.issued_at, f.model_version, r.reviewer_model, o.outcome,
         o.brier as engine_brier,
         power(r.lean_p_up      - (o.outcome = 'up')::int, 2)
       + power(r.lean_p_down    - (o.outcome = 'down')::int, 2)
       + power(r.lean_p_expired - (o.outcome = 'expired')::int, 2) as jev_brier
  from public.forecasts f
  join public.outcomes o on o.forecast_id = f.id
  join public.scenario_reviews r on r.forecast_id = f.id
  where r.lean_p_up is not null;

grant select on public.reviewer_scores to anon, authenticated;
