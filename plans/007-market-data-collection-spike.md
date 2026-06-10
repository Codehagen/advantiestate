# Plan 007: Spike — should quarterly market data move out of TypeScript into a content collection?

> **Executor instructions**: This is a DESIGN SPIKE, not a build plan. The
> deliverable is a written design document plus a prototype schema — **no
> changes to `src/` at all**. Follow the steps, run the verifications, and
> honor the STOP conditions. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3c71295..HEAD -- src/components/markedsinnsikt content-collections.ts`
> If `marketData.ts` or `content-collections.ts` changed materially since
> this plan was written, note the drift in the design doc rather than
> stopping — a spike absorbs drift; it just must describe what IS.

## Status

- **Priority**: P3
- **Effort**: M (the spike itself is ~half a day; the migration it designs is estimated, not executed)
- **Risk**: LOW (no production code changes)
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `3c71295`, 2026-06-10

## Why this matters

The /markedsinnsikt page sells Advanti's core differentiator — data-driven market insight — but its data (20 quarters of yields, rents, volume, vacancy, transactions, rates across Northern-Norway cities) is hardcoded as TypeScript constants. Every quarterly release (next: Q1 2026) requires a developer to edit `marketData.ts`, get a review, and deploy. TODOS.md TODO 5 already defers "move markedsinnsikt data to content collections", and TODO 7 documents the symptom: stale "OPPDATERT 14. JAN 2026" stamps on the live site because ingesting new data needs engineering time. Before committing M-effort to a migration, this spike answers: **is a content collection actually the right vehicle, or is the friction better solved with validation + a runbook on the existing file?** An honest "keep the TS file, add guardrails" is an acceptable outcome.

## Current state

- `src/components/markedsinnsikt/marketData.ts` — 84 lines, pure data + formatters, importable from both server and client components (deliberately no `"use client"`). Exports: `LATEST_QUARTER` (`"Q4 2025"`), `QUARTERS` (20 labels), `RATES` (`swap5y`, `gov10y` — 20 numbers each), `Segment` type (`"kontor" | "handel" | "logistikk"`), `YIELD: Record<Segment, number[]>`, `LEIE: Record<Segment, Record<string, number[]>>` (cities: Bodø, Tromsø, Harstad), plus `VOLUME`, `VACANCY`, `TX`, `CITIES`, and formatters `fmtNoComma`, `fmtPct1`, `fmtNum`. Header comment: "Single source of truth so the interactive (client) charts in MarkedsinnsiktShell and the server-rendered MarketDataSummary tables cannot drift apart."
- Consumers (find them all in Step 1; known at planning time): `src/components/markedsinnsikt/MarkedsinnsiktShell.tsx` (1,085-line client component — charts index into the arrays positionally, e.g. `arr[arr.length - 5]` for 1-year deltas at lines 110-116, 235-241, 316-321, 419-421), `MarketDataSummary` (server-rendered tables, per the header comment), and the Leaflet maps under `src/components/markedsinnsikt/maps/`.
- `content-collections.ts` (repo root) — 7 collections defined with zod-style schemas via `defineCollection`; build-time validated; `@ts-nocheck` at the top (the config is compiled by content-collections' own pipeline). Collections currently wrap MDX documents with frontmatter; data lives in `src/content/<collection>/`.
- Hardcoded next-issue dates exist in page copy (e.g. "Neste utgave 15. juli 2026" — locate the exact occurrence(s) in Step 1 with `grep -rn "Neste utgave" src`).
- Update cadence: quarterly. Author: a developer today; the desired author is "whoever owns market data" with a developer only reviewing.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Find consumers | `grep -rln "from \"./marketData\"\|from \"@/components/markedsinnsikt/marketData\"" src` | list of files |
| Typecheck (sanity, end) | `pnpm typecheck` | exit 0 — proves the spike touched no src |

## Scope

**In scope** (the only files you may create/modify):
- `docs/market-data-collection-design.md` (create — the deliverable)
- `plans/README.md` (status row)

**Out of scope** (do NOT touch):
- Everything under `src/` and `content-collections.ts` — this spike changes no production code. Prototype schema code lives INSIDE the design doc as fenced code blocks.
- Actually ingesting Q1 2026 data — that's content work, not this spike.

## Git workflow

- Branch: `advisor/007-market-data-spike`
- Conventional commit, e.g. `docs(markedsinnsikt): design spike for market data as content`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Inventory the real coupling

Enumerate every importer of `marketData.ts` and, for each, list WHICH exports it uses and HOW (positional array indexing? object lookup by city? formatters?). Also `grep -rn "Neste utgave\|OPPDATERT" src` to catalogue hardcoded date stamps. Record the inventory as a table in the design doc.

**Verify**: the doc contains a consumer table with ≥2 consumers and an exports-used column; every export of `marketData.ts` is accounted for (used or marked unused).

### Step 2: Evaluate three options against the actual workflow

Write an honest comparison. Required options (add a fourth if you find a better one):

- **A. Content collection** — a `MarketData` collection (one document per quarter, or one "latest" document) in `content-collections.ts`, data in YAML/MDX frontmatter under `src/content/market-data/`. Pros to weigh: build-time schema validation, editor-friendly diff, `LATEST_QUARTER`/next-issue derived from data not code. Cons to weigh: content-collections schemas validate frontmatter per-document — 20-quarter parallel arrays in YAML are MORE error-prone to hand-edit than TS (no editor type-checking inside YAML); collection docs are designed around MDX bodies the data doesn't need; the shell indexes arrays positionally so any shape change ripples through a 1,085-line client component.
- **B. Typed JSON + zod loader** — `src/content/market-data/data.json` validated at build/import time by a small zod schema in `src/lib/`; `marketData.ts` becomes a thin re-export so NO consumer changes. Weigh: minimal blast radius, JSON editable by non-devs, but no per-quarter document model.
- **C. Keep the TS file, add guardrails** — keep `marketData.ts`, add a build-time invariant check (every series length === `QUARTERS.length`; `LATEST_QUARTER` === last label), a `docs/` runbook for the quarterly update, and derive "Neste utgave"/"OPPDATERT" stamps from `LATEST_QUARTER` instead of hardcoding. Weigh: zero migration risk; the real pain (stale stamps, silent length mismatches) is addressed; editing still requires a PR — but so do A and B, since every option needs a deploy to ship.

For each: migration blast radius (files touched, estimated), failure modes it prevents, failure modes it introduces, and who can realistically author the quarterly update.

**Verify**: the doc scores all options on the same criteria table and names a single recommendation with 2-3 sentences of justification.

### Step 3: Prototype the recommended schema (in the doc)

Whatever you recommend, include in the doc:
- the full schema (zod or collection definition) as a fenced code block,
- one fully worked example document/file for Q4 2025 using the REAL numbers from `marketData.ts` (copy them — this doubles as a migration fixture),
- the invariants to enforce (series length === quarters length; cities consistent across segments; `LATEST_QUARTER` derivable),
- the consumer-change list: exact files/lines that would change, and the re-export shim strategy that keeps `MarkedsinnsiktShell.tsx` untouched in phase 1.

**Verify**: the example document in the doc contains the real Q4 2025 yield values (spot-check: kontor yield series ends at `6.1`, per `marketData.ts`).

### Step 4: Open questions + go/no-go

End the doc with: open questions only the maintainer can answer (who authors quarterly data? is a CMS/Sanity ever on the roadmap — the Sanity MCP server is configured in this workspace, worth asking; is per-quarter history needed or only "latest"?), a coarse effort estimate for the recommended migration (S/M/L), and an explicit go/no-go recommendation.

**Verify**: `pnpm typecheck` → exit 0 (nothing in src touched). `git status` → only `docs/market-data-collection-design.md` and `plans/README.md` changed.

## Test plan

Not applicable (no code). The "tests" are the verification gates above plus the fixture spot-check.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `docs/market-data-collection-design.md` exists, contains sections: Inventory, Options (≥3), Recommendation, Prototype schema, Worked Q4-2025 example, Migration blast radius, Open questions, Go/no-go
- [ ] `grep -c "6.1" docs/market-data-collection-design.md` ≥ 1 (real data in the fixture)
- [ ] `pnpm typecheck` exits 0
- [ ] `git status` shows only the design doc and `plans/README.md` modified
- [ ] `plans/README.md` status row updated (status DONE means "spike delivered", not "migration done")

## STOP conditions

Stop and report back (do not improvise) if:

- `marketData.ts` no longer exists or has been substantially restructured (someone may have already done this work — check git log for the file).
- You find yourself editing files under `src/` "just to prototype" — the prototype lives in the doc.
- The inventory reveals consumers outside `src/components/markedsinnsikt/` (wider blast radius than this plan assumed — note it and stop before recommending).

## Maintenance notes

- This spike's output feeds a maintainer decision; the follow-up migration (if "go") should be written as its own plan with the spike doc as input.
- Whichever option lands, the hardcoded "Neste utgave …" date strings found in Step 1 should be derived from data — that's the cheapest stale-content fix regardless of A/B/C.
- Related but separate: TODOS.md TODO 7 (ingest Q1 2026 data) is content work blocked on the team, not on this design.
