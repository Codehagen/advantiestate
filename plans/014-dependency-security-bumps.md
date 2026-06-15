# 014 — Patch transitive dependency vulnerabilities

**Status:** TODO
**Written against commit:** `9dda014`
**Priority:** P2 · **Effort:** M · **Risk of the fix:** MED (build-critical deps)
**Depends on:** —

## Why this matters

`pnpm audit` reports several high/moderate vulnerabilities, all *transitive* (no
direct dependency on the vulnerable packages). The notable ones reach the build
pipeline through `@content-collections/core`:

- `serialize-javascript` ≤7.0.2 — RCE (via `@content-collections/core`)
- `esbuild` <0.28.1, `js-yaml`, `uuid` — same chain
- `path-to-regexp` 8.0.0–8.3.x — ReDoS (via `fumadocs-core`)
- `flatted` <3.4.2 — prototype pollution / DoS (via `eslint`)

Real-world exposure is lower than direct deps (these run at build time on trusted
editorial content, not attacker input). But `@content-collections/core` is
build-critical, and `serialize-javascript` RCE during content rendering is the
one worth closing if a future feature ever feeds user data into a collection.

This is a planned, isolated bump — NOT an `improve`-time auto-fix — because the
upgrade crosses a major (`@content-collections/core` 0.8 → 0.15) and could break
type generation.

## Verification gate (this repo)

- `pnpm build` is the real typecheck + content-collections codegen gate.
  Standalone `pnpm typecheck` (`tsc --noEmit`) FAILS on a clean tree because the
  generated `content-collections` types only exist after a build. Always build.
- `pnpm test:unit` (vitest, ~2s) and `pnpm test` (Playwright, builds + starts a
  prod server, slow) are the behavioral gates.

## Steps

1. Branch from `main`: `git checkout -b deps/security-bumps`.
2. Record baseline: `pnpm audit > /tmp/audit-before.txt 2>&1` (note the count).
3. Bump the content-collections chain first (highest value, highest risk):
   `pnpm up @content-collections/core@latest @content-collections/next@latest @content-collections/mdx@latest`
   (match whatever scoped packages appear in `package.json`).
4. Run `pnpm build`. If type generation breaks (e.g. the collection config API
   changed in the major), read `content-collections.ts` and the package
   changelog, adapt the config, and rebuild. **STOP and report** if the config
   API change is non-trivial (more than field renames) — do not guess at a large
   migration.
5. Bump `fumadocs-core` to clear `path-to-regexp`; rebuild.
6. `eslint`/`flatted` is dev-only — bump `eslint` only if it doesn't force a flat-
   config migration; otherwise leave it and note that `flatted` is dev-chain only.
7. `pnpm audit > /tmp/audit-after.txt` and diff against baseline.

## Done criteria (machine-checkable)

- `pnpm build` → "Compiled successfully", exit 0.
- `pnpm test:unit` → all pass.
- `pnpm audit` shows the `serialize-javascript` and `path-to-regexp` advisories
  resolved (or documented as unreachable if a bump isn't available).
- `git diff package.json` touches only dependency versions.

## Out of scope (do NOT touch)

- TypeScript 6, Tailwind 4, Shiki 4 majors — separate, larger migrations
  (rejected in prior audits as "no current cost"). Not part of this plan.
- Any source file other than `content-collections.ts` (only if the config API
  changed) and lockfile/`package.json`.

## Escape hatch

If the `@content-collections/core` major requires a config rewrite beyond simple
field renames, STOP, revert the bump, and report — the security upside (build-
time-only, trusted-input) does not justify a risky blind migration.
