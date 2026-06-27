# Plan 019: Remove the orphaned onboarding server actions (dead code)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat d42cbc1..HEAD -- src/app/actions/onboarding/`
> If `onboarding.ts` or `search-organization.ts` changed since this plan was
> written, compare the "Current state" excerpts below against the live code
> before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt (with a minor security upside)
- **Planned at**: commit `d42cbc1`, 2026-06-27

## Why this matters

The site once had an onboarding flow (company lookup → onboarding submission).
That UI was removed — its components now live in `.removed/onboarding/`, outside
the build. But two **server actions** were left behind in
`src/app/actions/onboarding/` with **no callers anywhere in `src/` or `tests/`**:

- `submitOnboarding` — a `"use server"` action that posts arbitrary submitted
  fields to a Discord webhook. It is reachable by anyone who knows the action
  exists (server actions are addressable endpoints), it is **not** protected by
  the Zod schema its live sibling `submitContactInquiry` uses, and it serves no
  feature. Dead, unauthenticated, write-capable surface area.
- `searchOrganization` — a `"use server"` proxy to the public Brønnøysund
  (Brreg) company API. Also dead (zero callers).

Deleting both removes confusing dead code and shrinks the action surface. The
"`submitOnboarding` lacks input validation" gap disappears with it, so no Zod
work is needed. This is a pure deletion: no behavior change to any live page.

**The trap to avoid**: `submitOnboarding` shares its file
(`onboarding.ts`) with `submitContactInquiry`, which **is live** (the `/kontakt`
form uses it). You must delete only the dead export and its private helpers from
that file, not the file. The companion file `search-organization.ts` contains
only dead code and is deleted whole.

## Current state

Two files, one folder:

- `src/app/actions/onboarding/search-organization.ts` (90 lines) — exports only
  `searchOrganization`. **Entirely dead → delete the whole file.**
- `src/app/actions/onboarding/onboarding.ts` (215 lines) — exports
  `submitOnboarding` (DEAD) **and** `submitContactInquiry` (LIVE). Delete the
  dead export, the interface only it uses, and the now-unused import; keep
  everything the live action needs.

Verified facts (re-confirm with the Drift check command above):

- `grep -rn "submitOnboarding\|searchOrganization" src/ tests/` returns **only**
  the two `export async function …` definition lines — i.e. zero call sites.
- In `onboarding.ts`, `import { cookies } from "next/headers"` (line 3) and
  `cookies()` (line 95) are used **only** inside `submitOnboarding`. After the
  deletion this import is unused and must be removed too.
- The `OnboardingData` interface (lines 19–31) is used **only** by
  `submitOnboarding`. Remove it.
- The `DiscordMessage` interface (lines 9–17) is used by **both**
  `submitOnboarding` **and** the live `postToDiscordWebhook` / `submitContactInquiry`
  path. **Keep it.**
- The imports `checkRateLimit`, `subscribe`, `sanitizeDiscordValue`,
  `contactInquirySchema` are all used by the live `submitContactInquiry`. **Keep
  them.**

### What to DELETE from `onboarding.ts`

1. Line 3 — the now-unused import:
   ```ts
   import { cookies } from "next/headers";
   ```

2. Lines 19–31 — the `OnboardingData` interface:
   ```ts
   interface OnboardingData {
     purpose: string;
     company: {
       name: string;
       orgNumber: string;
       address: string;
     };
     contact: {
       name: string;
       email: string;
       phone: string;
     };
   }
   ```

3. Lines 33–108 — the entire `submitOnboarding` function (from
   `export async function submitOnboarding(data: OnboardingData) {` through its
   closing `}` right before the `// Interface for the new contact inquiry data`
   comment):
   ```ts
   export async function submitOnboarding(data: OnboardingData) {
     if (!(await checkRateLimit("onboarding"))) {
       return { success: false, error: "For mange forsøk. Prøv igjen om noen minutter." };
     }
     try {
       // Send to Discord
       const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
       // … posts data.company / data.contact fields to Discord …
       // … sets the "onboarding-completed" cookie via cookies() …
       return { success: true };
     } catch (error) {
       console.error("Error submitting onboarding:", error);
       return { success: false, error: "Failed to submit onboarding" };
     }
   }
   ```
   (The excerpt is abridged in the middle for readability — delete the **whole**
   function, lines 33–108 inclusive.)

### What MUST REMAIN in `onboarding.ts` (do not touch)

- Lines 1–2, 4–7: the `"use server"` directive and the kept imports
  (`checkRateLimit`, `subscribe`, `sanitizeDiscordValue`, `contactInquirySchema`).
- Lines 9–17: `interface DiscordMessage { … }`.
- Lines 110–117: `interface ContactInquiryData { … }`.
- Lines 119–138: `async function postToDiscordWebhook(…)`.
- Lines 140–215: `export async function submitContactInquiry(…)` — **LIVE**, the
  `/kontakt` form depends on it.

After the edit, the file should start like this (the `cookies` import gone, the
first interface now `DiscordMessage`):

```ts
"use server";

import { checkRateLimit } from "@/lib/rate-limit";
import { subscribe } from "@/lib/email/subscribe";
import { sanitizeDiscordValue } from "@/lib/email/sanitize";
import { contactInquirySchema } from "@/lib/forms/schemas";

interface DiscordMessage {
  …
```

## Commands you will need

| Purpose            | Command                                   | Expected on success                          |
|--------------------|-------------------------------------------|----------------------------------------------|
| Confirm dead code  | `grep -rn "submitOnboarding\|searchOrganization" src/ tests/` | no output (zero matches after deletion)      |
| Lint               | `pnpm lint`                               | exit 0, no new warnings/errors               |
| Unit tests         | `pnpm test:unit`                          | all pass (same count as before)              |
| Full typecheck     | `pnpm build`                              | exit 0 (this is how this repo typechecks — `tsc --noEmit` alone fails on a clean checkout because content-collections types are generated during the build) |

Note: `pnpm build` is heavyweight but is the authoritative typecheck here (CI
relies on it, `ignoreBuildErrors: false`). If the build is too slow in your
environment, `pnpm lint` + `pnpm test:unit` + the grep gate are sufficient
evidence for a pure deletion, but say so in your report.

## Scope

**In scope** (the only files you may modify or delete):

- `src/app/actions/onboarding/search-organization.ts` — **delete the file**.
- `src/app/actions/onboarding/onboarding.ts` — remove the three blocks listed in
  "What to DELETE" above.
- `plans/README.md` — update this plan's status row when done.

**Out of scope** (do NOT touch, even though they look related):

- `submitContactInquiry`, `postToDiscordWebhook`, `ContactInquiryData`,
  `DiscordMessage` in `onboarding.ts` — all live or shared. Leave them exactly
  as they are.
- The misnamed-file cleanup (moving `submitContactInquiry` out of an
  `onboarding/` folder into e.g. `actions/kontakt.ts`) — explicitly deferred,
  see Maintenance notes. Do not rename or move anything.
- `.removed/onboarding/`, `.removed/investor/`, `.removed/early-access/` — these
  are intentional graveyards outside the build; leave them.
- Any other server action under `src/app/actions/`.

## Git workflow

- Branch off the current branch: `git checkout -b advisor/019-remove-dead-onboarding`
  (do NOT commit directly to `feat/forside-faq` or `main`).
- One commit is fine. Message style is Conventional Commits, matching the repo
  (e.g. `git log` shows `fix(qa): …`, `feat(forside): …`). Suggested:
  `chore(actions): remove dead onboarding server actions (no callers)`.
- Do NOT push or open a PR unless the operator instructs it.

## Steps

### Step 1: Delete the fully-dead file

Delete `src/app/actions/onboarding/search-organization.ts` entirely.

**Verify**: `test ! -f src/app/actions/onboarding/search-organization.ts && echo GONE`
→ prints `GONE`.

### Step 2: Remove the dead export from `onboarding.ts`

In `src/app/actions/onboarding/onboarding.ts`, remove the three blocks from the
"What to DELETE" section: the `cookies` import (line 3), the `OnboardingData`
interface (lines 19–31), and the entire `submitOnboarding` function (lines
33–108). Keep everything in "What MUST REMAIN".

**Verify**:
- `grep -rn "submitOnboarding\|searchOrganization\|OnboardingData" src/ tests/` → no output.
- `grep -n "submitContactInquiry\|DiscordMessage\|postToDiscordWebhook" src/app/actions/onboarding/onboarding.ts` → still present (3+ matches).
- `grep -n "next/headers" src/app/actions/onboarding/onboarding.ts` → no output (cookies import gone).

### Step 3: Verify the build/lint/tests are clean

Run the verification commands.

**Verify**:
- `pnpm lint` → exit 0 (in particular, no "unused import" / "unused variable"
  error for `cookies` — if one appears, you missed removing the import in Step 2).
- `pnpm test:unit` → all pass.
- `pnpm build` → exit 0 (or, if skipped for time, note it and confirm lint+tests
  green).

## Test plan

No new tests — this is a deletion of untested dead code, and there is no behavior
to characterize (the functions had no callers). The safety net is:

- The existing unit suite (`pnpm test:unit`) must stay green — it exercises the
  live lead/contact pipeline (`tests/unit/leads.test.ts`, `subscribe.test.ts`,
  `formSchemas.test.ts`) that shares `lib/email`/`lib/forms` with the surviving
  `submitContactInquiry`. If any of those break, the deletion touched something
  live → STOP.
- The grep gate proving zero remaining references.
- `pnpm build` typechecking the whole app (the kept `submitContactInquiry` and
  `DiscordMessage` must still compile).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `src/app/actions/onboarding/search-organization.ts` no longer exists.
- [ ] `grep -rn "submitOnboarding\|searchOrganization\|OnboardingData" src/ tests/` returns no matches.
- [ ] `grep -n "next/headers" src/app/actions/onboarding/onboarding.ts` returns no matches.
- [ ] `grep -n "submitContactInquiry" src/app/actions/onboarding/onboarding.ts` still returns a match (live action intact).
- [ ] `pnpm lint` exits 0.
- [ ] `pnpm test:unit` passes with the same test count as before the change.
- [ ] `pnpm build` exits 0 (or skipped-with-note per the Commands table).
- [ ] No files outside the in-scope list are modified (`git status`).
- [ ] `plans/README.md` status row for plan 019 updated to DONE.

## STOP conditions

Stop and report back (do not improvise) if:

- The Drift check shows `onboarding.ts` or `search-organization.ts` changed
  since `d42cbc1`, and the "Current state" excerpts no longer match the live
  code (e.g. `submitOnboarding` gained a caller, or `cookies`/`DiscordMessage`
  usage moved).
- The zero-callers grep in "Current state" returns **any** call site (something
  started using these actions since this plan was written) — do NOT delete a now-
  live action.
- `pnpm lint` or `pnpm test:unit` fails after the deletion and the failure is not
  obviously the leftover `cookies` import (which Step 2 should have removed).
- Removing `submitOnboarding` appears to require touching `submitContactInquiry`,
  `DiscordMessage`, or any file outside the in-scope list.

## Maintenance notes

For whoever owns this code next:

- **Deferred follow-up (not in this plan):** `onboarding.ts` will, after this
  change, contain only the live *kontakt* action — yet it still sits in an
  `actions/onboarding/` folder. A tidier home is `src/app/actions/kontakt.ts`.
  This was deliberately left out to keep the diff a pure deletion with zero
  behavior risk (a move changes the import path in the `/kontakt` form and the
  unit tests). Do it as a separate, small rename PR if desired. The prior audit
  index already noted this misnaming as "real but cosmetic."
- **Reviewer focus:** confirm the diff is deletions only, that `DiscordMessage`
  and `submitContactInquiry` are untouched, and that the `cookies` import was
  removed (not left dangling).
- If an onboarding flow is ever rebuilt, restore it from `.removed/onboarding/`
  and write the action fresh **with** a Zod schema (mirror
  `submitContactInquiry`'s `contactInquirySchema.safeParse()` pattern) — do not
  resurrect the unvalidated version this plan deleted.
