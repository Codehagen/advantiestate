-- web_signups — top-of-funnel signups from advantiestate.no
--
-- This migration was applied to production on 2026-05-24 via the Supabase
-- MCP `apply_migration` tool (name: `advanti_web_signups`). It is kept in
-- the repo as documentation; running it again is safe (every statement is
-- `if not exists` / `or replace`).
--
-- High-intent signups (verdivurdering-intake, kontakt) bypass this table —
-- they land directly in the existing `crm_leads` + `crm_activities`
-- tables. See src/lib/supabase/leads.ts for the writer.

create extension if not exists "pgcrypto";

create table if not exists public.web_signups (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  email               text not null,
  first_name          text,
  source              text not null,
  page_url            text,
  intake              jsonb,
  already_subscribed  boolean not null default false,

  kilde               text generated always as ('web: ' || source) stored
);

create index if not exists web_signups_email_idx on public.web_signups (lower(email));
create index if not exists web_signups_created_at_idx on public.web_signups (created_at desc);
create index if not exists web_signups_source_idx on public.web_signups (source);

alter table public.web_signups enable row level security;

drop policy if exists "web_signups_no_anon" on public.web_signups;
create policy "web_signups_no_anon"
  on public.web_signups
  for all
  to anon
  using (false)
  with check (false);

create or replace view public.web_signups_latest as
select distinct on (lower(email))
  id,
  email,
  first_name,
  source              as latest_source,
  page_url            as latest_page_url,
  intake              as latest_intake,
  created_at          as latest_signup_at,
  kilde               as latest_kilde
from public.web_signups
order by lower(email), created_at desc;

comment on table public.web_signups is
  'Top-of-funnel website signups from advantiestate.no. Writer: src/lib/supabase/leads.ts.';
comment on view public.web_signups_latest is
  'Deduplicated view — one row per unique email, most recent touchpoint.';
