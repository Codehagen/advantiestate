# Plan 003: Route contact-form leads into the CRM pipeline (Supabase + Resend), not just Discord

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3c71295..HEAD -- src/app/actions/onboarding/onboarding.ts src/lib/email/subscribe.ts src/lib/supabase/leads.ts`
> Plan 001 intentionally adds a `checkRateLimit` guard at the top of
> `submitContactInquiry` — that exact change is expected, keep it. Any OTHER
> drift from the excerpts below is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW-MED (behavior change: contact submitters now receive a welcome email and are added to the Resend audience — see Maintenance notes)
- **Depends on**: plans/001-fix-and-secure-cta-modals.md (both touch `onboarding.ts`; land 001 first to avoid conflicts)
- **Category**: bug
- **Planned at**: commit `3c71295`, 2026-06-10

## Why this matters

The `/kontakt` contact form is the only lead-capture surface that bypasses the funnel pipeline. `submitContactInquiry` posts two Discord webhooks and stops — no Supabase CRM row, no Resend contact. The pipeline was explicitly built to receive these leads: `SubscribeSource` includes `"kontakt"` (`src/lib/email/subscribe.ts:20`), the CRM router lists `"kontakt"` as HIGH_INTENT → `crm_leads` + `crm_activities` (`src/lib/supabase/leads.ts:17-21`), and `buildActivitySummary` has a dedicated branch: `"Henvendelse via kontaktskjema."` (`leads.ts:167-168`). The wiring was simply never finished. Today, if nobody acts on the Discord ping, the lead has no durable record anywhere — the team's CRM is blind to its highest-quality inbound channel.

## Current state

- `src/app/actions/onboarding/onboarding.ts:132-200` — `submitContactInquiry(data: ContactInquiryData)`. `ContactInquiryData` is `{ name, email, phone, service, message? }` (lines 103-109). The function currently:
  1. builds embed `fields` from the input (lines 135-149),
  2. builds `contactMessage` (primary `#team` webhook payload, lines 151-161) and `nettsideMessage` (secondary `#nettside-henvendelser` payload, lines 170-180),
  3. fires both via `Promise.all` + `postToDiscordWebhook` (lines 182-189) using `process.env.DISCORD_WEBHOOK_URL` and `process.env.DISCORD_NETTSIDE_WEBHOOK_URL`,
  4. returns `{ success: true }` / `{ success: false, error: "Innsending feilet. Vennligst prøv igjen." }`.

  (If Plan 001 landed, there is also a `checkRateLimit("kontakt")` guard at the top — keep it.)

- `src/lib/email/subscribe.ts:61-162` — `subscribe(input: SubscribeInput)` is the one-call pipeline. Signature:

  ```ts
  export type SubscribeInput = {
    email: string
    source: SubscribeSource              // "kontakt"
    pageUrl?: string
    firstName?: string
    intake?: Record<string, string | number | undefined>
  }
  export type SubscribeResult =
    | { ok: true; alreadySubscribed: boolean }
    | { ok: false; error: string }
  ```

  It validates the email, then fires three destinations: Resend (audience upsert + welcome email for first-time contacts), Discord (`notifyLead` → `DISCORD_WEBHOOK_URL`, with a "🔥 Ny lead — høy intent" embed for `"kontakt"`), and Supabase (`recordSignup` → `crm_leads` + `crm_activities` because `"kontakt"` is HIGH_INTENT). It only returns `ok: false` when the email is invalid or no destination at all is configured.

- `src/lib/supabase/leads.ts:115-130` — the CRM row mapping reads these intake keys: `Bedrift` → `firma_navn`, `Telefon` → `kontakt_telefon`, `Eiendomstype`, `Sted`, `Tidshorisont`, `Bakgrunn`, `Beskjed` → `notater`. Keys it doesn't map (e.g. `Tjeneste`) still appear in the activity-feed summary via `buildActivitySummary` (lines 178-181) and in the Discord embed.

- `src/components/ContactUsForm.tsx:55-61` — the caller. Passes `{ name, phone, email, service, message? }` and checks `result.success`. **Do not change this file**; the action's public contract (`{ success: boolean; error?: string }`) must stay.

- Exemplar for the target pattern: `src/app/actions/verdivurdering-intake.ts:34-48` calls `subscribe({ email, firstName, source, pageUrl, intake: {...} })` and maps the result. Match it.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `pnpm typecheck`         | exit 0, no output   |
| Lint      | `pnpm lint`              | exit 0              |
| Form spec | `npx playwright test tests/contact-form.spec.ts` | 1 test passes (builds + starts prod server first) |
| Full test | `npx playwright test`    | all tests pass      |

## Scope

**In scope** (the only files you should modify):
- `src/app/actions/onboarding/onboarding.ts` — only the body of `submitContactInquiry`
- `plans/README.md` (status row)

**Out of scope** (do NOT touch):
- `src/components/ContactUsForm.tsx` — the action's return contract is unchanged, so the caller needs no edits.
- `src/lib/email/subscribe.ts`, `src/lib/email/discord.ts`, `src/lib/supabase/leads.ts` — the pipeline already handles `"kontakt"`; you only call it.
- `submitOnboarding` in the same file — separate legacy flow, leave as is.
- The welcome-email template (`src/emails/WelcomeEmail.tsx`) and any consent copy on the form — flagged for the maintainer in Maintenance notes, not for you.

## Git workflow

- Branch: `advisor/003-kontakt-into-crm`
- Conventional commit, e.g. `fix(leads): route kontakt-skjema through subscribe() so leads land in CRM`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Rewrite the body of `submitContactInquiry`

Replace the primary-webhook path with `subscribe()`; keep the secondary `#nettside-henvendelser` webhook (it goes to a different channel that `subscribe()` does not cover). Target shape:

```ts
import { subscribe } from "@/lib/email/subscribe"
// (keep existing imports; postToDiscordWebhook stays for the secondary channel)

export async function submitContactInquiry(data: ContactInquiryData) {
  try {
    // (keep the checkRateLimit guard here if Plan 001 added it)

    const intake: Record<string, string | undefined> = {
      Telefon: data.phone,
      Tjeneste: data.service,
      Beskjed: data.message,
    }

    // Full pipeline: Resend (audience + welcome), Discord #team digest
    // (high-intent stripe), Supabase crm_leads + crm_activities. The
    // "kontakt" source is already wired end-to-end in lib/email and
    // lib/supabase — see leads.ts HIGH_INTENT.
    const pipeline = subscribe({
      email: data.email,
      firstName: data.name,
      source: "kontakt",
      pageUrl: "/kontakt",
      intake,
    })

    // Secondary channel (#nettside-henvendelser) — not covered by subscribe().
    const nettsideUrl = process.env.DISCORD_NETTSIDE_WEBHOOK_URL
    const nettsidePost = nettsideUrl
      ? postToDiscordWebhook(nettsideUrl, {
          content: "",
          embeds: [
            {
              title: "📬 Ny nettside-henvendelse",
              description: `**${data.name}** — ${data.service}`,
              color: 0x00ff88,
              fields: [
                { name: "Navn", value: data.name },
                { name: "E-post", value: data.email },
                { name: "Telefon", value: data.phone },
                { name: "Ønsket tjeneste", value: data.service },
                ...(data.message
                  ? [{
                      name: "Melding",
                      value: data.message.length > 1024
                        ? data.message.substring(0, 1021) + "..."
                        : data.message,
                    }]
                  : []),
              ],
            },
          ],
        })
      : Promise.resolve(false)

    const [result] = await Promise.all([pipeline, nettsidePost])

    if (!result.ok) {
      return { success: false, error: result.error }
    }
    return { success: true }
  } catch (error) {
    console.error("Error submitting contact inquiry:", error)
    return { success: false, error: "Innsending feilet. Vennligst prøv igjen." }
  }
}
```

Delete the now-unused `contactMessage` block and the old primary-webhook post. Keep the `postToDiscordWebhook` helper and the `DiscordMessage` interface (still used by the secondary post and `submitOnboarding`). Note `subscribe()` validates the email itself and never throws (each destination catches internally), so the error mapping above is complete.

**Verify**: `pnpm typecheck` → exit 0. `pnpm lint` → exit 0.

### Step 2: Regression

**Verify**: `npx playwright test tests/contact-form.spec.ts` → passes (renders the form; deliberately does not submit, so no live webhooks/emails fire). Then `npx playwright test` → all pass.

## Test plan

- Existing: `tests/contact-form.spec.ts` guards that the form renders and stays interactive.
- No submit-path E2E (a real submit fires Discord + Resend + Supabase; the suite intentionally avoids it — see the comment at `tests/contact-form.spec.ts:3-8`).
- If Plan 004's unit harness exists, add `tests/unit/contact-inquiry.test.ts` mocking `@/lib/email/subscribe` (assert it is called with `source: "kontakt"`, the three intake keys, and `firstName: data.name`) — model the mock style on `tests/unit/leads.test.ts` from Plan 004. Otherwise skip; noted as follow-up in plans/README.md.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0 and `pnpm lint` exits 0
- [ ] `grep -n "subscribe(" src/app/actions/onboarding/onboarding.ts` shows the call inside `submitContactInquiry`
- [ ] `grep -c "DISCORD_WEBHOOK_URL" src/app/actions/onboarding/onboarding.ts` → only the `submitOnboarding` usage remains (1 match)
- [ ] `npx playwright test` exits 0
- [ ] Only `src/app/actions/onboarding/onboarding.ts` and `plans/README.md` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `submitContactInquiry`'s body doesn't match the Current state description (beyond Plan 001's rate-limit guard) — drift.
- `"kontakt"` is missing from `SubscribeSource` in `src/lib/email/subscribe.ts` or from `HIGH_INTENT` in `src/lib/supabase/leads.ts` (the pipeline assumption this plan rests on).
- The fix appears to require changing `subscribe()`'s signature or `ContactUsForm.tsx`.

## Maintenance notes

- **Intentional behavior change — flag in PR description:** contact submitters are now (a) added to the Resend newsletter audience and (b) sent the welcome email on first contact. The pipeline was designed this way for `"kontakt"`, but the form currently has no consent text for newsletter membership. The maintainer should either add a short consent line under the form ("Vi lagrer henvendelsen og sender deg vårt markedsbrev — meld deg av når som helst") or pass on this and ask for a `subscribe()` option to skip the audience add. GDPR-sensitive; a human should decide the copy.
- The team will see ONE change in Discord `#team`: the embed becomes the standard funnel digest ("🔥 Ny lead — høy intent") instead of the bespoke "📬 Ny henvendelse fra nettsiden" embed. `#nettside-henvendelser` is unchanged.
- Future: if a "Bedrift" field is added to the contact form, put it in `intake.Bedrift` — it maps straight to `crm_leads.firma_navn` (`leads.ts:116`).
