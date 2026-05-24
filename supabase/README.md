# Supabase — funnel routing

The advantiestate.no funnel writes signups into **two Supabase destinations**,
chosen by intent:

| Source | Destination | Why |
|---|---|---|
| `verdivurdering-intake` | `crm_leads` + `crm_activities` | Sales-qualified — visitor filled the 5-question intake on `/tjenester/verdivurdering` |
| `kontakt` | `crm_leads` + `crm_activities` | Direct enquiry via the contact form |
| `markedsrapport` | `web_signups` | Top-of-funnel PDF gate |
| `sjekkliste-verdivurdering` | `web_signups` | Top-of-funnel PDF gate |
| `blog`, `help`, `markedsinnsikt`, `service`, `footer` | `web_signups` | Newsletter signup, no qualification |

Writer: `src/lib/supabase/leads.ts` (`recordSignup()`). Routing is by
SubscribeSource (see `src/lib/email/subscribe.ts`).

## Why two tables

`crm_leads` is a curated sales pipeline — 89 hand-tended rows when this
shipped, all with real company names, contact info, and outbound activity
context. Pouring 1000 newsletter signups in there would dilute it past the
point of usefulness.

`web_signups` is the firehose. Lightweight: `email`, `source`, `page_url`,
`intake` jsonb, `created_at`. Use it for funnel analytics, attribution, and
to escalate specific entries into `crm_leads` manually (or via automation
later).

## crm_leads mapping (high-intent signups)

| Funnel field | crm_leads column | Notes |
|---|---|---|
| `email` | `kontakt_epost` | lowercased |
| `firstName` | `kontakt_navn` | falls back to `"Ukjent"` |
| `intake.Bedrift` | `firma_navn` | NOT NULL — falls back to `"Ukjent (skjema-innsending)"` |
| `intake.Telefon` | `kontakt_telefon` | |
| `intake.Eiendomstype` | `behov_type_eiendom` | mapped to `property_type` enum: Kontor→`kontor`, Handel→`butikk`, Logistikk/lager→`lager`, Kombinert→`{kontor,lager}` |
| `intake.Sted` | `behov_geografi` | single-element array |
| `intake.Tidshorisont` | `tidshorisont` | direct |
| `intake.Bakgrunn` | `behov_beskrivelse` | |
| `intake.Beskjed` | `notater` | |
| `source` + `pageUrl` | `kilde` | `web: <human label> fra <url>` matches the existing `incoming: …` / `epost: …` convention |
| (constant) | `status` | `'ny'` (default) |
| (derived) | `tags` | `['web', source]` |

Each high-intent insert also writes a `notat` row to `crm_activities` so the
lead surfaces in the CRM activity feed with intake context, not as an empty
new row.

## web_signups schema

```
id                  uuid PK
created_at          timestamptz
email               text  (lowercased)
first_name          text
source              text  (matches SubscribeSource union)
page_url            text
intake              jsonb (rare for newsletter; populated for gated PDFs that ask for name)
already_subscribed  boolean (true if Resend reported a repeat touchpoint)
kilde               text  generated as 'web: ' || source
```

`web_signups_latest` view dedupes by email and keeps the most recent
touchpoint per address — useful for "current state of the list" queries.

## Setup

The migrations have already been applied to the live project via the
Supabase MCP. The SQL is kept in `supabase/migrations/` for reference and
disaster recovery.

The Next.js app needs two env vars on Vercel:

| Variable | Source |
|---|---|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → `service_role` key (NOT `anon`) |

Without them, `recordSignup()` is a silent no-op — the funnel still works
(Resend + Discord), nothing lands in Supabase. Documented in `.env.example`.

## Common queries

```sql
-- Web signups today
select * from public.web_signups
where created_at > now() - interval '1 day'
order by created_at desc;

-- New high-intent leads not yet contacted
select * from public.crm_leads
where status = 'ny' and 'web' = any(tags)
order by created_at desc;

-- All touchpoints for a specific email (across both tables)
select 'web_signup' as kind, created_at, source, page_url
  from public.web_signups where lower(email) = lower($1)
union all
select 'crm_lead', created_at, kilde, null
  from public.crm_leads where lower(kontakt_epost) = lower($1)
order by created_at desc;

-- Funnel by source (30d)
select source, count(*) from public.web_signups
where created_at > now() - interval '30 days'
group by source order by count desc;

-- Promote a web_signup into crm_leads manually (template)
-- Run after a phone call or further qualification.
insert into public.crm_leads (firma_navn, kontakt_navn, kontakt_epost, kilde, status, tags)
select 'Ukjent (manuelt promotert)', coalesce(first_name, 'Ukjent'), email,
       'promotert fra web_signups: ' || source, 'ny', array['web', source]
from public.web_signups where id = '<uuid>';
```

## Graceful degradation

- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` unset → `recordSignup` is a no-op. Funnel still ships Resend + Discord.
- Supabase responds with an error → logged to server console, visitor still sees success.

## Migration log

| File | Applied | Notes |
|---|---|---|
| `001_web_signups.sql` | 2026-05-24 via MCP `apply_migration` (name: `advanti_web_signups`) | `web_signups` table, indexes, RLS, view. `crm_leads` was already in place from the team's CRM — no migration needed there. |
