# Plan 001: Fix the six broken CTA modals and secure the lead-capture funnel

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3c71295..HEAD -- src/app/api/discord-notification src/components/modals src/app/actions src/lib/email/discord.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1 (contains a P0 bug: all six CTA modals currently lose 100% of submissions)
- **Effort**: M
- **Risk**: MED (touches every lead-capture entry point)
- **Depends on**: none
- **Category**: bug + security
- **Planned at**: commit `3c71295`, 2026-06-10

## Why this matters

Two problems share one fix.

**The bug (P0):** Six client-side modals (`ValuationRequestModal`, `StrategicAdvisoryModal`, `AdvisoryRequestModal`, `ConsultationModal`, `LeaseRequestModal`, `TransactionRequestModal`) POST lead data to `/api/discord-notification`. That route returns **400 unless the body contains both `email` and `pageUrl`** — and none of the six modals send `pageUrl`. Every submission fails with 400; because a 400 is not a thrown exception, the modal's `catch` never runs, `setIsSuccess(true)` never runs, and the visitor sees the spinner stop with no feedback. These are the site's highest-intent leads (valuation requests, transaction help) and they are all silently lost. Additionally, even if `pageUrl` were present, the route only reads `email`/`pageUrl`/`formType` and silently drops every other field (name, phone, propertyType, …).

**The security problem:** the route is a public, unauthenticated endpoint. Anyone can POST to it and inject arbitrary content (including attacker-chosen `pageUrl` strings rendered as links) into the team's trusted Discord channel, or spam it. There is also no rate limiting on any of the four lead-capture server actions.

The fix: replace the public route with a validated server action that reuses the existing `notifyLead()` Discord helper (so all form fields actually reach the team), delete the route, and add a shared best-effort rate limiter to every lead-capture server action.

## Current state

Relevant files:

- `src/app/api/discord-notification/route.ts` — the public route. Will be **deleted**. Key behavior:

  ```ts
  // route.ts:5-13
  const { email, pageUrl, formType } = await request.json();
  if (!email || !pageUrl) {
    return NextResponse.json(
      { error: "Email and page URL are required" },
      { status: 400 }
    );
  }
  ```

- `src/components/modals/ValuationRequestModal.tsx:22-59` — exemplar of all six modals. Current submit handler:

  ```ts
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: `${formData.get("firstname")} ${formData.get("lastname")}`,
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      propertyType: formData.get("propertyType"),
      size: formData.get("size"),
      income: formData.get("income"),
      costs: formData.get("costs"),
      formType: "Verdsettelse",
    }
    try {
      const response = await fetch("/api/discord-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => { setShowModal(false); setIsSuccess(false) }, 3000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  ```

  The other five modals are structurally identical; only the field list and `formType` string differ:
  - `StrategicAdvisoryModal.tsx:26-35` — fields: name, email, phone, company, challenge, goals, timeline; formType `"Strategisk Rådgivning"`
  - `AdvisoryRequestModal.tsx:27-35` — name, email, phone, company, advisoryArea, description; formType `"Rådgivning"`
  - `ConsultationModal.tsx:26-35` — name, email, phone, company, serviceType, preferredDate, message; formType `"Konsultasjon"`
  - `LeaseRequestModal.tsx:27-38` — name, email, phone, intent, propertyType, location, desiredArea, budgetRange, moveInDate; formType `"Utleie"`
  - `TransactionRequestModal.tsx:27-37` — name, email, phone, propertyAddress, transactionType, timeline, estimatedValue, message; formType `"Transaksjonshjelp"`

- `src/lib/email/discord.ts:39-110` — `notifyLead(args)` is the existing, server-only Discord helper used by the rest of the funnel. Signature:

  ```ts
  type Args = {
    email: string
    source: SubscribeSource     // use "service" for these modals
    pageUrl?: string
    firstName?: string
    intake?: Record<string, string | number | undefined>  // rendered as "**key:** value" lines
    alreadySubscribed?: boolean
  }
  export async function notifyLead(args: Args): Promise<void>
  ```

  It no-ops with a console.error when `DISCORD_WEBHOOK_URL` is unset, and never throws on webhook failure. `SubscribeSource` is exported from `src/lib/email/subscribe.ts:11-21`; `"service"` is a valid member.

- The four existing lead-capture server actions, all currently without rate limiting:
  - `src/app/actions/newsletter.ts:12` — `subscribeNewsletter(_prev, formData)`
  - `src/app/actions/eiendom-varsel.ts:10` — `subscribeEiendomVarsel(_prev, formData)`
  - `src/app/actions/verdivurdering-intake.ts:15` — `subscribeVerdivurderingIntake(formData)`
  - `src/app/actions/onboarding/onboarding.ts:29` `submitOnboarding(data)` and `:132` `submitContactInquiry(data)`

Repo conventions: server actions live in `src/app/actions/`, start with `"use server"`, and return discriminated-union result objects like `{ ok: true } | { ok: false; error: string }` (see `src/app/actions/verdivurdering-intake.ts:5`). Server-only libs start with `import "server-only"`. Error messages shown to visitors are Norwegian (e.g. `"Innsending feilet. Vennligst prøv igjen."`). No semicolons in `src/lib`/`src/app/actions` files (Prettier handles it — just run it).

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Install   | `pnpm install`           | exit 0              |
| Typecheck | `pnpm typecheck`         | exit 0, no output   |
| Lint      | `pnpm lint`              | exit 0              |
| Full test | `npx playwright test`    | all ~45 tests pass (builds + starts prod server itself; takes minutes) |

## Scope

**In scope** (the only files you should modify/create/delete):
- `src/lib/rate-limit.ts` (create)
- `src/app/actions/cta-lead.ts` (create)
- `src/components/modals/{ValuationRequestModal,StrategicAdvisoryModal,AdvisoryRequestModal,ConsultationModal,LeaseRequestModal,TransactionRequestModal}.tsx`
- `src/app/api/discord-notification/route.ts` (delete, including the directory)
- `src/app/actions/newsletter.ts`, `src/app/actions/eiendom-varsel.ts`, `src/app/actions/verdivurdering-intake.ts`, `src/app/actions/onboarding/onboarding.ts` (rate-limit guard only)
- `plans/README.md` (status row)

**Out of scope** (do NOT touch, even though they look related):
- `src/lib/email/subscribe.ts`, `src/lib/email/discord.ts`, `src/lib/supabase/leads.ts` — the pipeline itself is correct; you only call it.
- `src/components/ContactUsForm.tsx` and the body of `submitContactInquiry` — Plan 003 rewrites that; here you only add the rate-limit guard at its top.
- Routing modal leads into Supabase/Resend (`subscribe()`): deliberately deferred — it would add submitters to the newsletter audience and trigger a welcome email without consent copy on the modals. See Maintenance notes.

## Git workflow

- Branch: `advisor/001-fix-cta-modals`
- Conventional commits, matching repo style (e.g. `fix(leads): replace broken discord-notification route with server action`). Commit per step.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the shared rate limiter

Create `src/lib/rate-limit.ts`:

```ts
import "server-only"
import { headers } from "next/headers"

/**
 * Best-effort, per-instance sliding-window rate limiter for the public
 * lead-capture surfaces. In-memory by design: Vercel Fluid Compute reuses
 * function instances across requests, so this meaningfully blunts bursts
 * from a single IP, but it is NOT a hard guarantee (multiple instances =
 * multiple windows). Platform-level enforcement (Vercel WAF rate-limit
 * rule) is the ops-side complement — see plans/001 maintenance notes.
 */
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 5
const MAX_KEYS = 10_000

const buckets = new Map<string, number[]>()

export async function checkRateLimit(scope: string): Promise<boolean> {
  const h = await headers()
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0]!.trim()
  const key = `${scope}:${ip}`
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (hits.length >= MAX_PER_WINDOW) {
    buckets.set(key, hits)
    return false
  }
  hits.push(now)
  // Crude memory bound: reset the map rather than tracking LRU.
  if (!buckets.has(key) && buckets.size >= MAX_KEYS) buckets.clear()
  buckets.set(key, hits)
  return true
}
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Create the CTA-lead server action

Create `src/app/actions/cta-lead.ts`:

```ts
"use server"

import { notifyLead } from "@/lib/email/discord"
import { checkRateLimit } from "@/lib/rate-limit"

export type CtaLeadInput = {
  /** Norwegian form label, e.g. "Verdsettelse" — shown in the Discord digest. */
  formType: string
  name: string
  email: string
  phone?: string
  /** Path the visitor was on, e.g. from window.location.pathname. */
  pageUrl?: string
  /** Remaining form-specific fields, Norwegian label → value. */
  fields?: Record<string, string>
}

export type CtaLeadResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELDS = 15
const MAX_VALUE_LEN = 500

export async function submitCtaLead(input: CtaLeadInput): Promise<CtaLeadResult> {
  if (!(await checkRateLimit("cta-lead"))) {
    return { ok: false, error: "For mange forsøk. Prøv igjen om noen minutter." }
  }

  const email = String(input.email ?? "").trim().toLowerCase()
  const name = String(input.name ?? "").trim().slice(0, 200)
  if (!EMAIL_RE.test(email) || !name) {
    return { ok: false, error: "Fyll inn navn og en gyldig e-postadresse." }
  }

  const intake: Record<string, string> = { Type: String(input.formType ?? "").slice(0, 100) }
  if (input.phone) intake.Telefon = String(input.phone).slice(0, 50)
  for (const [k, v] of Object.entries(input.fields ?? {}).slice(0, MAX_FIELDS)) {
    const value = String(v ?? "").trim().slice(0, MAX_VALUE_LEN)
    if (value) intake[String(k).slice(0, 50)] = value
  }

  await notifyLead({
    email,
    source: "service",
    pageUrl: input.pageUrl?.slice(0, 200),
    firstName: name,
    intake,
  })

  return { ok: true }
}
```

Note: `notifyLead` never throws and no-ops when `DISCORD_WEBHOOK_URL` is unset, matching the funnel's non-blocking contract.

**Verify**: `pnpm typecheck` → exit 0.

### Step 3: Convert the six modals to the server action

For each of the six modal files, replace the `fetch("/api/discord-notification", ...)` block with a call to `submitCtaLead`, and add a minimal error state (the modals currently swallow failures silently — that is the bug). Using `ValuationRequestModal.tsx` as the exemplar, the new handler shape:

```ts
import { submitCtaLead } from "@/app/actions/cta-lead"
// keep existing imports; add:
const [error, setError] = useState<string | null>(null)

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsSubmitting(true)
  setError(null)

  const formData = new FormData(e.currentTarget)
  const result = await submitCtaLead({
    formType: "Verdsettelse",
    name: `${formData.get("firstname")} ${formData.get("lastname")}`,
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? "") || undefined,
    pageUrl: window.location.pathname,
    fields: {
      Adresse: String(formData.get("address") ?? ""),
      Eiendomstype: String(formData.get("propertyType") ?? ""),
      Størrelse: String(formData.get("size") ?? ""),
      Leieinntekter: String(formData.get("income") ?? ""),
      Kostnader: String(formData.get("costs") ?? ""),
    },
  })

  setIsSubmitting(false)
  if (result.ok) {
    setIsSuccess(true)
    setTimeout(() => { setShowModal(false); setIsSuccess(false) }, 3000)
  } else {
    setError(result.error)
  }
}
```

Render the error just above the submit button in each modal:

```tsx
{error && <p className="text-sm text-red-600">{error}</p>}
```

Map each modal's existing payload keys to Norwegian `fields` labels (these become the Discord field labels the team reads):

| Modal | formType | fields mapping |
|---|---|---|
| ValuationRequestModal | `"Verdsettelse"` | address→Adresse, propertyType→Eiendomstype, size→Størrelse, income→Leieinntekter, costs→Kostnader |
| StrategicAdvisoryModal | `"Strategisk Rådgivning"` | company→Selskap, challenge→Utfordring, goals→Mål, timeline→Tidshorisont |
| AdvisoryRequestModal | `"Rådgivning"` | company→Selskap, advisoryArea→Område, description→Beskrivelse |
| ConsultationModal | `"Konsultasjon"` | company→Selskap, serviceType→Tjeneste, preferredDate→Ønsket dato, message→Melding |
| LeaseRequestModal | `"Utleie"` | intent→Formål, propertyType→Eiendomstype, location→Sted, desiredArea→Ønsket areal, budgetRange→Budsjett, moveInDate→Innflytting |
| TransactionRequestModal | `"Transaksjonshjelp"` | propertyAddress→Adresse, transactionType→Type transaksjon, timeline→Tidshorisont, estimatedValue→Estimert verdi, message→Melding |

**Verify after each modal**: `pnpm typecheck` → exit 0.
**Verify after all six**: `grep -rn "discord-notification" src/components` → no matches.

### Step 4: Delete the public route

Delete `src/app/api/discord-notification/route.ts` and the now-empty `src/app/api/discord-notification/` directory.

**Verify**: `grep -rn "discord-notification" src` → no matches. `pnpm typecheck` → exit 0.

### Step 5: Add the rate-limit guard to the four existing server actions

At the top of each action function body (immediately after entering the function, before any other work), add:

- `src/app/actions/newsletter.ts` — in `subscribeNewsletter`, before the `formData.get` lines:
  ```ts
  if (!(await checkRateLimit("newsletter"))) {
    return { status: "error", message: "For mange forsøk. Prøv igjen om noen minutter." }
  }
  ```
- `src/app/actions/eiendom-varsel.ts` — in `subscribeEiendomVarsel`, same pattern, scope `"eiendom-varsel"`, same `{ status: "error", message: ... }` shape.
- `src/app/actions/verdivurdering-intake.ts` — in `subscribeVerdivurderingIntake`, scope `"verdivurdering"`, return shape `{ ok: false, error: "For mange forsøk. Prøv igjen om noen minutter." }`.
- `src/app/actions/onboarding/onboarding.ts` — in BOTH `submitOnboarding` and `submitContactInquiry`, scope `"onboarding"` and `"kontakt"` respectively, return shape `{ success: false, error: "For mange forsøk. Prøv igjen om noen minutter." }`.

Each file needs `import { checkRateLimit } from "@/lib/rate-limit"`. Match each action's existing return type exactly (they differ — `status`-shaped vs `ok`-shaped vs `success`-shaped; the exact shapes are visible at the top of each file).

**Verify**: `pnpm typecheck` → exit 0. `pnpm lint` → exit 0.

### Step 6: Full regression

**Verify**: `npx playwright test` → all tests pass (the suite builds the app, which also type-checks; `tests/contact-form.spec.ts` renders the kontakt form without submitting, so no webhooks fire).

## Test plan

- The Playwright suite (`tests/*.spec.ts`) is the regression gate; no spec currently submits a form (submissions fire real Discord webhooks — see the comment at `tests/contact-form.spec.ts:3-8`), so no new E2E test is added here.
- If Plan 004 (unit test baseline) has already landed, add `tests/unit/cta-lead.test.ts` covering: invalid email → `{ ok: false }`, missing name → `{ ok: false }`, field-count cap at 15, value truncation at 500 chars, rate limit returns the Norwegian error after 5 calls from the same IP (mock `next/headers`). Model it on the existing tests in `tests/unit/`. If Plan 004 has not landed, skip this — it is listed as a follow-up in plans/README.md.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0
- [ ] `npx playwright test` exits 0
- [ ] `grep -rn "discord-notification" src` returns no matches
- [ ] `test ! -e src/app/api/discord-notification` succeeds (route deleted)
- [ ] `grep -ln "checkRateLimit" src/app/actions/newsletter.ts src/app/actions/eiendom-varsel.ts src/app/actions/verdivurdering-intake.ts src/app/actions/onboarding/onboarding.ts src/app/actions/cta-lead.ts` lists all five files
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Any modal's submit handler does not match the fetch-to-`/api/discord-notification` shape shown in Current state (drift).
- `grep -rn "discord-notification"` finds callers outside the six modals (an unknown consumer would break when the route is deleted).
- `notifyLead`'s signature in `src/lib/email/discord.ts` differs from the one excerpted above.
- Adding the rate-limit guard requires changing any action's public return type (callers depend on those shapes).
- A modal turns out to submit to somewhere other than the Discord route (e.g. already migrated).

## Maintenance notes

- **Ops follow-up (not code):** add a Vercel WAF rate-limit rule for POSTs to the site as a platform-level backstop; the in-memory limiter is per-instance best-effort only.
- **Deferred by design:** these modal leads go to Discord only (behavior parity with the route's intent). Routing them through `subscribe()` would also store them in Supabase CRM and send a welcome email + newsletter-audience membership — that needs consent copy on the modals first. If the team wants CRM capture for modal leads, copy the pattern from Plan 003 and add consent text.
- Reviewers should scrutinize: the field-label mappings in Step 3 (the team reads these labels in Discord), and that each action's rate-limit early-return matches its declared return type.
- If a queue/KV store is ever added to the stack, replace `src/lib/rate-limit.ts` internals with it; the call sites won't change.
