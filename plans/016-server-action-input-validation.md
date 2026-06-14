# 016 — Zod input validation on lead/contact server actions

**Status:** TODO
**Written against commit:** `9dda014`
**Priority:** P2 · **Effort:** M · **Risk of the fix:** LOW (additive)
**Depends on:** — (complements the Discord sanitization already landed)

## Why this matters

The lead/contact server actions extract `FormData` with ad-hoc `String(...)` +
`.slice()` and truthiness checks. There is no schema validation, so malformed or
oversized payloads reach business logic and downstream sinks. The team already
knows the right pattern — `naringsmegler-lead.ts` whitelists `propertyType`
against `PROPERTY_TYPES` and length-caps every field — but it is applied
unevenly. Discord-markdown injection is already mitigated at the choke point
(`lib/email/sanitize.ts`); this plan closes the broader validation gap.

## Scope — these actions

- `src/app/actions/verdivurdering-intake.ts`
- `src/app/actions/onboarding/onboarding.ts` (contact form)
- `src/app/actions/cta-lead.ts`
- `src/app/actions/newsletter.ts`
- `src/app/actions/investorportal.ts`

(Use `naringsmegler-lead.ts` as the exemplar — it already validates + caps.)

## Current state (read these first)

- `src/app/actions/naringsmegler-lead.ts` — the pattern to copy: `clean()` (now
  delegates to `lib/email/sanitize.ts`), `PROPERTY_TYPES` whitelist, `SLUG_RE`,
  hard length caps, honeypot field, `checkRateLimit`.
- The actions in scope above — note where they read `formData.get(...)` raw.
- `zod` — check `package.json`; if not present, this plan adds it
  (`pnpm add zod`). It is a common, Layer-1 choice and tree-shakes well.

## Steps

1. Branch from `main`. Add `zod` if absent.
2. Create `src/lib/forms/schemas.ts` with one schema per action input:
   - `.string().trim().max(N)` per field (mirror the existing length caps).
   - Email via `.string().email()`.
   - Enums (property type, purpose) via `z.enum([...])` from the existing
     constant arrays — do NOT duplicate the lists; import them.
   - All optional fields `.optional()`.
3. In each action, replace manual extraction with `schema.safeParse(raw)`.
   On failure return the existing user-facing error shape
   (`{ ok: false, error: "…" }`) — do not throw to the client.
4. Keep `checkRateLimit` and the `sanitizeDiscordValue` choke point as-is; this
   is validation, not a replacement for sanitization (defense in depth).
5. Preserve every current success/error return shape so callers and tests are
   unaffected.

## Done criteria

- `pnpm build` → exit 0.
- `pnpm test:unit` + the relevant Playwright specs (`contact-form.spec.ts`,
  `verdivurdering-reise.spec.ts`, `kontakt.spec.ts`) → green.
- New unit tests in `tests/unit/` for each schema: a valid payload parses; an
  oversized/invalid one is rejected with the user-facing error (follow
  `tests/unit/verdivurdering-intake.test.ts` as the pattern).

## Out of scope

- Rate-limit architecture (in-memory per-instance is by design + Vercel WAF).
- Re-routing or CRM-field changes (separate concern).

## Escape hatch

If an action's current return contract is load-bearing for a client component in
a way a schema can't preserve, STOP and report rather than changing the
client-facing shape.
