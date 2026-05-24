# Supabase — funnel lead capture

One Postgres table (`leads`) backed by Supabase. Every signup from the funnel
inserts a row here. The Next.js app uses the **service-role key** server-side
(never exposed to the browser) to insert directly. The `anon` key is not used
anywhere in this codebase.

## One-time setup

1. **Create a Supabase project** at https://supabase.com/dashboard. Name it
   something like `advanti-funnel`. Region: closest to your team (probably
   `eu-north-1` for Norway).

2. **Run the migration.** In the project's SQL editor, paste the contents
   of `supabase/migrations/001_leads.sql` and run it. Safe to re-run — every
   statement is idempotent.

   Or via Supabase CLI:
   ```
   supabase link --project-ref <your-ref>
   supabase db push
   ```

3. **Copy the credentials** from Settings → API:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key (NOT `anon`) → `SUPABASE_SERVICE_ROLE_KEY`

4. **Set on Vercel:** Project Settings → Environment Variables. Set for
   Production + Preview + Development. Redeploy main.

5. **Verify**: submit a test signup on /markedsrapport or
   /tjenester/verdivurdering#bestill. Then in Supabase SQL editor:
   ```sql
   select * from leads order by created_at desc limit 10;
   ```
   You should see your test row.

## Table shape

```
leads
  id                  uuid PK
  created_at          timestamptz
  email               text         (lower-cased on insert)
  first_name          text
  phone               text
  source              text         enum-by-convention; see SubscribeSource union
  page_url            text         where the visitor signed up
  intake              jsonb        the 5 verdivurdering fields when applicable
  notes               text         visitor-provided message
  high_intent         boolean      true for verdivurdering-intake + kontakt
  already_subscribed  boolean      true if Resend reported the email existed
  status              text         new | contacted | qualified | converted | dead
  assigned_to         text         partner who owns the lead
  status_changed_at   timestamptz  auto-updated by trigger
```

One row = one signup event. Multiple touchpoints from the same email = multiple
rows. Query `leads_latest` (view) for the deduplicated "current state".

## Common queries

```sql
-- All signups today
select * from leads
where created_at > now() - interval '1 day'
order by created_at desc;

-- High-intent leads not yet contacted
select * from leads
where high_intent = true and status = 'new'
order by created_at desc;

-- All touchpoints for a specific email
select * from leads
where lower(email) = lower('user@example.com')
order by created_at desc;

-- Funnel breakdown by source (last 30 days)
select source, count(*) as signups
from leads
where created_at > now() - interval '30 days'
group by source
order by signups desc;

-- Current state of the list (deduplicated)
select * from leads_latest order by latest_touchpoint_at desc limit 50;
```

## Updating lead status

The team updates `status` via the Supabase dashboard (Table Editor → leads) or
through whatever CRM tooling lands later. The `status_changed_at` column is
auto-bumped by trigger when status changes — you don't need to set it manually.

```sql
-- Mark a lead as contacted
update leads
set status = 'contacted', assigned_to = 'christer'
where email = 'user@example.com' and status = 'new';
```

## Graceful degradation

If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are unset:
- The funnel still works end-to-end (Resend audience + welcome email + Discord ping)
- `insertLead()` returns early without throwing
- Server log: nothing — silent no-op (by design, so unset env doesn't spam logs)

If Supabase is configured but the insert fails (network, RLS error, schema drift):
- The funnel still works end-to-end
- `insertLead()` logs `Supabase leads.insert error: <error>` to the server console
- Visitor sees the success state — the failure is silent to them

Resend is the source of truth for "is this email on the newsletter list?".
Supabase is a downstream sink. If Supabase falls behind, the newsletter still
ships; backfill by exporting from Resend's audience.

## Schema migrations

Add new migrations as `supabase/migrations/00N_description.sql`. Numbering
is chronological. Re-running the same file should be safe (guard every
`create` with `if not exists`).

For destructive changes (renaming columns, dropping tables), write a
forward+rollback pair and document the rollback in the migration file itself.
