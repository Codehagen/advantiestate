# Plan 004: Establish a unit-test baseline (Vitest) for the riskiest pure logic

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3c71295..HEAD -- src/lib/supabase/leads.ts src/lib/listing src/lib/coordinateUtils.ts playwright.config.ts package.json .github/workflows/ci.yml`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW (additive — new dev tooling + tests; two `export` keywords and one comment edit in src)
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `3c71295`, 2026-06-10

## Why this matters

The repo's only tests are 12 Playwright E2E specs that run against a full production build — there is no way to test pure logic in milliseconds, and no `pnpm test` script at all. Meanwhile the most regression-prone code is exactly the pure kind: the CRM router that decides whether a signup lands in `crm_leads` or `web_signups`, the CRM-vs-MDX listing merge, UTM→WGS84 coordinate transforms (wrong math = map pins in the wrong city, silently), and the gallery/downloads mappers. One of them (`src/lib/listing/gallery.ts:41`) even carries the comment "Pure mapper — unit-tested." — which is currently false and will mislead the next refactorer. This plan adds Vitest, characterization tests for those five modules, wires `test:unit` into CI, and makes that comment true.

## Current state

- `package.json` scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `indexnow:submit`. No `test` script. Playwright runs via `npx playwright test`. Prettier 3 and TypeScript 5.7 are devDependencies; Vitest is not installed.
- `playwright.config.ts` — `testDir: "./tests"`, no `testMatch` set. **Playwright's default `testMatch` also matches `*.test.ts`**, so unit tests placed under `tests/unit/` would be picked up by Playwright and crash. Step 2 fixes this by pinning `testMatch`.
- `tsconfig.json` — path alias `@/*` → `src/*`, strict mode.
- Modules under test (read each before writing its tests):
  - `src/lib/supabase/leads.ts` — `recordSignup` routes HIGH_INTENT sources (`verdivurdering-intake`, `kontakt`, `eiendommer`; lines 17-21) to `insertCrmLead` (→ `crm_leads` + `crm_activities`), everything else to `insertWebSignup` (→ `web_signups`). Module-private helpers `mapPropertyType` (lines 25-34) and `buildActivitySummary` (lines 158-188) are pure. The file imports `getSupabase`/`isSupabaseConfigured` from `./server` and starts with `import "server-only"`.
  - `src/lib/listing/gallery.ts` — `mapMediaToGallery(rows, profile)` (lines 42-53) is exported and pure: empty rows → `null`; cover = `is_cover` row else first row; `profile.cover_image` overrides; `photoCount` = `profile.photo_count ?? rows.length`. Line 41 comment: `/** Pure mapper — unit-tested. */`.
  - `src/lib/listing/downloads.ts` — `mapDownloads(rows)` (lines 29-36) exported, pure: `requires_nda` → kind `"nda"` else `"pdf"`, `href ?? "#"`, `description ?? ""`.
  - `src/lib/listing/listings.ts` — `mapProfileToListing(row)` (lines 280-348) is pure but NOT exported; converts NOK → mNOK via `nok()` (`prisantydning_nok: 25_000_000` → `prisantydning: 25`), falls back to a deterministic placeholder cover via `placeholderFor(slug)` (lines 124-128), defaults `order` to 999, `status` to `"til-salgs"`, `city` to `"bodo"`. The file imports `getActiveListings, getListingPost` from `@/lib/content` (which imports the build-generated `content-collections` package) and `getSupabase` from `@/lib/supabase/server`. The `ProfileRow` interface (lines 182-229) describes the input shape.
  - `src/lib/coordinateUtils.ts` — `utmToLatLng(easting, northing, epsg)` (lines 24-39, throws on unsupported EPSG; supported: `32633`, `32632`, `4326`) and `parseRepresentasjonspunkt(pointString)` (lines 47-73, expects `"northing easting (epsg)"`, throws on mismatch). No `server-only` import; pure proj4 math.
- `.github/workflows/ci.yml` — single job: pnpm setup → `pnpm install --frozen-lockfile` → playwright install → `npx playwright test`.

Two import landmines for Vitest, both solved by aliases in Step 1:
1. `import "server-only"` (in `leads.ts`, `gallery.ts`, `downloads.ts`, `listings.ts`) throws outside a React Server Components bundler — alias it to a stub.
2. `@/lib/content` (imported by `listings.ts`) imports `content-collections`, which only exists after a build (`.content-collections/generated`) — alias `@/lib/content` itself to a stub.

## Commands you will need

| Purpose    | Command                       | Expected on success |
|------------|-------------------------------|---------------------|
| Install    | `pnpm install`                | exit 0              |
| Add dep    | `pnpm add -D vitest`          | exit 0              |
| Unit tests | `pnpm test:unit` (created in Step 2) | all pass, < 10s |
| Typecheck  | `pnpm typecheck`              | exit 0              |
| E2E        | `npx playwright test`         | all pass            |

## Scope

**In scope** (the only files you should modify/create):
- `package.json` (devDependency + scripts), `pnpm-lock.yaml` (via pnpm only)
- `vitest.config.ts` (create)
- `tests/stubs/server-only.ts`, `tests/stubs/lib-content.ts` (create)
- `tests/unit/leads.test.ts`, `tests/unit/gallery.test.ts`, `tests/unit/downloads.test.ts`, `tests/unit/listings.test.ts`, `tests/unit/coordinateUtils.test.ts` (create)
- `playwright.config.ts` (add `testMatch` only)
- `src/lib/supabase/leads.ts` (add `export` to `mapPropertyType` and `buildActivitySummary` — no logic changes)
- `src/lib/listing/listings.ts` (add `export` to `mapProfileToListing` — no logic changes)
- `src/lib/listing/gallery.ts` (comment on line 41 only)
- `.github/workflows/ci.yml` (one added step)
- `plans/README.md` (status row)

**Out of scope** (do NOT touch):
- Any behavior change in the modules under test — these are characterization tests: they document what the code DOES today. If a test reveals behavior that looks wrong, write the test to match current behavior and list the suspicion in your final report instead of "fixing" it.
- Jest, testing-library, jsdom, component tests — out of scope; this is a pure-logic baseline.
- The Playwright specs themselves.

## Git workflow

- Branch: `advisor/004-unit-test-baseline`
- Conventional commits (e.g. `test: add vitest baseline for lead routing, listings, coordinates`). Commit per step.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Install Vitest and create the config + stubs

`pnpm add -D vitest`

Create `tests/stubs/server-only.ts`:
```ts
// Vitest stand-in for the "server-only" guard package — a no-op outside RSC.
export {}
```

Create `tests/stubs/lib-content.ts`:
```ts
// Vitest stand-in for @/lib/content, which imports the build-generated
// content-collections package. Unit tests only exercise pure mappers, so
// empty content is fine.
export const getActiveListings = () => []
export const getListingPost = (_slug: string) => null
```

Create `vitest.config.ts` (repo root):
```ts
import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  resolve: {
    alias: [
      // Order matters: specific stubs before the catch-all "@" alias.
      { find: "server-only", replacement: path.resolve(__dirname, "tests/stubs/server-only.ts") },
      { find: "@/lib/content", replacement: path.resolve(__dirname, "tests/stubs/lib-content.ts") },
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
})
```

Add scripts to `package.json`:
```json
"test": "playwright test",
"test:unit": "vitest run"
```

**Verify**: `pnpm test:unit` → exits 0 with "no test files found" (or similar) — config loads cleanly.

### Step 2: Keep Playwright away from the unit tests

In `playwright.config.ts`, add one line inside `defineConfig({ ... })`, next to `testDir`:

```ts
testDir: "./tests",
testMatch: /.*\.spec\.ts/,
```

**Verify**: `npx playwright test --list` → lists the same ~45 tests as before, none from `tests/unit/` (run `npx playwright test --list | grep -c unit` → 0).

### Step 3: Export the three pure helpers

- `src/lib/supabase/leads.ts`: change `function mapPropertyType(` → `export function mapPropertyType(` and `function buildActivitySummary(` → `export function buildActivitySummary(`.
- `src/lib/listing/listings.ts`: change `function mapProfileToListing(` → `export function mapProfileToListing(`. Also export the `ProfileRow` type: `interface ProfileRow {` → `export interface ProfileRow {`.

**Verify**: `pnpm typecheck` → exit 0.

### Step 4: Write the tests

Write the five files. Use `import { describe, it, expect, vi } from "vitest"`. Characterize current behavior — assertions below are derived from the code as it exists at commit `3c71295`; if one fails, re-read the source before assuming the plan is wrong (then see STOP conditions).

`tests/unit/coordinateUtils.test.ts` — no mocks needed:
- `utmToLatLng(516375, 7460592, "32633")` returns `[lng, lat]` with `lat` between 60 and 72 and `lng` between 4 and 32 (northern-Norway sanity bounds — do not assert exact decimals).
- `utmToLatLng(14.4, 67.28, "4326")` → `[14.4, 67.28]` (longlat→longlat identity).
- `utmToLatLng(1, 1, "9999")` throws (message contains `not supported`).
- `parseRepresentasjonspunkt("7460592 516375 (32633)")` → `{ northing: 7460592, easting: 516375, epsg: "32633", coordinates: [<lng>, <lat>] }` (assert the three parsed fields exactly; bounds-check coordinates).
- `parseRepresentasjonspunkt("garbage")` throws (message contains `Invalid representasjonspunkt`).

`tests/unit/gallery.test.ts`:
- `mapMediaToGallery([], anyProfile)` → `null`.
- Cover precedence: with rows `[{image_url:"a",alt:null,is_cover:false,sort_order:1},{image_url:"b",alt:"B",is_cover:true,sort_order:2}]` and profile `{cover_image:null,cover_image_alt:null,photo_count:null}` → `cover.src === "b"`, `photoCount === 2`, `gallery[0].alt === ""`.
- Profile override: same rows, profile `{cover_image:"c",cover_image_alt:"C",photo_count:7}` → `cover === {src:"c",alt:"C"}`, `photoCount === 7`.
- No `is_cover` row → cover falls back to the first row.

`tests/unit/downloads.test.ts`:
- `mapDownloads([{label:"Prospekt",description:null,href:null,requires_nda:false}])` → `[{label:"Prospekt",sub:"",href:"#",kind:"pdf"}]`.
- `requires_nda: true` → `kind: "nda"`.

`tests/unit/listings.test.ts` — build a full `ProfileRow` fixture (all 44 fields; use `null` for everything not under test, and `public_slug: "test-slug"`). Cases:
- NOK→mNOK: `prisantydning_nok: 25_000_000` → `prisantydning === 25`; `prisantydning_nok: null` → `undefined`.
- Defaults: `website_status: null` → `status === "til-salgs"`; `sort_order: null` → `order === 999`; `city_slug: null` → `city === "bodo"`; `source === "crm"`.
- Placeholder cover is deterministic: with `cover_image: null`, calling twice with the same slug yields the same `coverImage` string, and it starts with `"/building/"`.
- `geo`: `geo_lat: 67.28, geo_lng: 14.4` with `location_body: "x"` → `location.geo` equals `{lat: 67.28, lng: 14.4}`; with `geo_lat: null` → `location.geo` is `undefined`.

`tests/unit/leads.test.ts`:
- Pure helpers: `mapPropertyType("Kontorbygg")` → `["kontor"]`; `"Handel"` → `["butikk"]`; `"Kombinert"` → `["kontor","lager"]`; `"Annet"` → `[]`; `undefined` → `[]`.
- `buildActivitySummary({email:"a@b.no", source:"kontakt"}, {})` returns a string containing `"Henvendelse via kontaktskjema."`.
- Routing characterization with a mocked Supabase client. Mock the module BEFORE importing `recordSignup`:

  ```ts
  import { describe, it, expect, vi, beforeEach } from "vitest"

  const inserted: Array<{ table: string; row: unknown }> = []
  const fakeClient = {
    from: (table: string) => ({
      insert: (row: unknown) => {
        inserted.push({ table, row })
        return {
          select: () => ({ single: async () => ({ data: { id: "lead-1" }, error: null }) }),
          // plain insert (web_signups, crm_activities) is awaited directly:
          then: (resolve: (v: { error: null }) => void) => resolve({ error: null }),
        }
      },
    }),
  }

  vi.mock("@/lib/supabase/server", () => ({
    isSupabaseConfigured: () => true,
    getSupabase: () => fakeClient,
  }))

  const { recordSignup, mapPropertyType, buildActivitySummary } = await import(
    "@/lib/supabase/leads"
  )
  ```

  Note: `insertWebSignup`/`insertCrmLead` `await supabase.from(t).insert(row)` directly for the non-`.select()` paths, so the returned object must be thenable as shown. If this mock shape fights you (e.g. the chain differs), simplify: assert only which TABLE was hit first.
  - `recordSignup({email:"a@b.no", source:"kontakt"})` → first insert table is `"crm_leads"`, second is `"crm_activities"`.
  - `recordSignup({email:"a@b.no", source:"footer"})` → single insert into `"web_signups"`.
  - Reset `inserted` in `beforeEach`.

**Verify**: `pnpm test:unit` → all tests pass (expect ~20 assertions across 5 files).

### Step 5: Make the stale comment true, wire CI

- `src/lib/listing/gallery.ts:41`: change `/** Pure mapper — unit-tested. */` → `/** Pure mapper — unit-tested in tests/unit/gallery.test.ts. */`
- `.github/workflows/ci.yml`: after the `pnpm install --frozen-lockfile` step and before the Playwright browser install, add:
  ```yaml
      - run: pnpm test:unit
  ```

**Verify**: `pnpm test:unit` → pass. `pnpm typecheck` → exit 0. `pnpm lint` → exit 0.

### Step 6: Full regression

**Verify**: `npx playwright test` → all pass (confirms the `testMatch` change and src `export` edits broke nothing).

## Test plan

This plan IS the test plan. Final state: 5 new unit-test files under `tests/unit/`, runnable via `pnpm test:unit` in under ~10 seconds, running in CI before the E2E suite.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm test:unit` exits 0; `ls tests/unit/*.test.ts | wc -l` → 5
- [ ] `pnpm typecheck` exits 0; `pnpm lint` exits 0
- [ ] `npx playwright test --list | grep -c "unit"` → 0
- [ ] `npx playwright test` exits 0
- [ ] `grep -n "test:unit" .github/workflows/ci.yml` → 1 match
- [ ] `grep -n "unit-tested in tests/unit" src/lib/listing/gallery.ts` → 1 match
- [ ] `git diff 3c71295..HEAD -- src/ | grep "^-" | grep -v "^---"` shows only the comment line and `function` → `export function` lines (no logic removed)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- A characterization assertion fails AND re-reading the source confirms the plan's expectation matched the code — that means the code's behavior differs from its own source between import and runtime (likely an alias/stub problem); report the exact failure.
- Vitest cannot resolve an import even with the aliases (e.g. a module under test gained a new build-time-only dependency since `3c71295`).
- Fixing a test seems to require changing logic in `leads.ts`, `listings.ts`, `gallery.ts`, `downloads.ts`, or `coordinateUtils.ts`.
- `npx playwright test --list` still lists files from `tests/unit/` after Step 2.

## Maintenance notes

- New pure logic should get a `tests/unit/*.test.ts` file by default; the aliases in `vitest.config.ts` (server-only, @/lib/content) are the established pattern for stubbing RSC-only imports.
- Plans 001 and 003 list optional unit tests (`cta-lead.test.ts`, `contact-inquiry.test.ts`) that become possible once this lands.
- If `@/lib/content` gains exports used by a future module under test, extend `tests/stubs/lib-content.ts` rather than un-aliasing.
- Deferred deliberately: component tests (would need jsdom + testing-library) and a `pnpm lint` step in CI.
