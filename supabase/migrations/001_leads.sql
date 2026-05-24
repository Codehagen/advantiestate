-- Advanti funnel: leads table
--
-- One row per signup event from any capture surface (newsletter footer,
-- gated PDF download, sjekkliste, markedsrapport, verdivurdering intake,
-- kontakt form). Resend remains the source of truth for "is this email
-- on the newsletter list?"; this table is for CRM-style reporting and
-- per-lead touchpoint history.
--
-- Run once in your Supabase project SQL editor (or `supabase db push`
-- if you have the CLI configured). Safe to re-run — every statement is
-- IF NOT EXISTS / IF EXISTS guarded.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  -- Lead identity ----------------------------------------------------------
  email               text not null,
  first_name          text,
  phone               text,

  -- Touchpoint context -----------------------------------------------------
  source              text not null,         -- see SubscribeSource union in src/lib/email/subscribe.ts
  page_url            text,                  -- page they signed up from
  intake              jsonb,                 -- flexible bag for the 5 verdivurdering fields
  notes               text,                  -- visitor-provided message
  high_intent         boolean not null default false,
  already_subscribed  boolean not null default false,

  -- Lifecycle (populated by the team / later automation) ------------------
  status              text not null default 'new'  -- new | contacted | qualified | converted | dead
    check (status in ('new','contacted','qualified','converted','dead')),
  assigned_to         text,                  -- partner who owns the lead (e.g. 'christer', 'vegard')
  status_changed_at   timestamptz
);

-- Indexes for the queries the team actually runs --------------------------

-- "All touchpoints for this email" — most common query.
create index if not exists leads_email_idx on public.leads (lower(email));

-- "Today's signups" / "this week's high-intent leads".
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- "All high-intent leads not yet contacted".
create index if not exists leads_high_intent_status_idx
  on public.leads (high_intent, status)
  where high_intent = true;

-- "All leads from a given capture surface".
create index if not exists leads_source_idx on public.leads (source);

-- Row Level Security: lock the table down --------------------------------
-- The Next.js app uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS, so
-- inserts from subscribe() work. But this protects the table from any
-- accidental public read access via the anon key.

alter table public.leads enable row level security;

-- Drop any prior policies (idempotent re-runs)
drop policy if exists "leads_no_anon" on public.leads;

-- No anon access at all. Service role + authenticated dashboard reads only.
create policy "leads_no_anon"
  on public.leads
  for all
  to anon
  using (false)
  with check (false);

-- Trigger: bump status_changed_at when status changes --------------------

create or replace function public.leads_status_changed()
returns trigger language plpgsql as $$
begin
  if new.status is distinct from old.status then
    new.status_changed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists leads_status_changed_trg on public.leads;
create trigger leads_status_changed_trg
  before update on public.leads
  for each row execute function public.leads_status_changed();

-- Helper view: latest touchpoint per email -------------------------------
-- The team's "current state of the list" — one row per email, showing the
-- most recent signup event. Useful for export to a real CRM later.

create or replace view public.leads_latest as
select distinct on (lower(email))
  id,
  email,
  first_name,
  phone,
  source              as latest_source,
  page_url            as latest_page_url,
  intake              as latest_intake,
  notes               as latest_notes,
  high_intent         as latest_high_intent,
  status,
  assigned_to,
  created_at          as latest_touchpoint_at,
  status_changed_at
from public.leads
order by lower(email), created_at desc;

comment on table public.leads is
  'One row per signup event from advantiestate.no funnel. See src/lib/email/subscribe.ts for the writer.';

comment on view public.leads_latest is
  'Deduplicated view — one row per unique email, showing the most recent touchpoint.';
