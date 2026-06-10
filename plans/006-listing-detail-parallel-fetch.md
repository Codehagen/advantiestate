# Plan 006: Parallelize the five sequential Supabase fetches on /eiendommer/[slug]

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3c71295..HEAD -- "src/app/eiendommer/[slug]/page.tsx"`
> If the file changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW (all five fetchers fail soft — null/empty on error; no ordering dependency between the parallelized calls)
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `3c71295`, 2026-06-10

## Why this matters

The listing detail page awaits five independent Supabase round trips one after another. At ISR regeneration (`revalidate = 600`) each regeneration pays the full serial chain — roughly 5× a single round trip where ~2× is achievable. Two of the calls (`getListingGallery`, `getListingDownloads`) depend only on `slug`, not on the listing row; `getListings()` (for related cards) is independent of all of them. Only `getListingCovers` genuinely depends on a prior result (the related slugs). Grouping the first four in one `Promise.all` cuts time-to-render for every cache-miss request and regeneration.

## Current state

- `src/app/eiendommer/[slug]/page.tsx` — server component, `export const revalidate = 600` (line 21). The sequential chain inside `EiendomDetailPage` (lines 96-142):

  ```ts
  const { slug } = await params;
  const listing = await getListing(slug);          // line 102
  if (!listing) notFound();
  ...
  const dbGallery = await getListingGallery(slug); // line 110
  ...
  const dbDownloads = await getListingDownloads(slug); // line 120
  ...
  const related = (await getListings())            // line 130
    .filter((other) => other.slug !== listing.slug)
    .sort((a, b) => { ... })
    .slice(0, 2);
  ...
  const relatedCovers = await getListingCovers(related.map((r) => r.slug)); // line 142
  ```

- Fetcher contracts (all server-only, all fail soft):
  - `getListing(slug)` — `src/lib/listing/listings.ts:380`, wrapped in React `cache()`; returns `Listing | null`. Also called by `generateMetadata` in the same file (the `cache()` wrapper dedupes within the request).
  - `getListings()` — `listings.ts:370`, `cache()`-wrapped; returns `Listing[]` (empty array when Supabase unset).
  - `getListingGallery(slug)` — `src/lib/listing/gallery.ts:55`; returns `ListingGalleryResult | null`.
  - `getListingDownloads(slug)` — `src/lib/listing/downloads.ts:38`; returns `ListingDownload[] | null`.
  - `getListingCovers(slugs)` — `gallery.ts:80`; returns `Record<string, ListingGalleryImage>` (empty object for empty input).

- Repo convention: this exact optimization pattern is documented in the codebase — `src/app/actions/onboarding/onboarding.ts:163-166` parallelizes independent webhooks with `Promise.all` and cites PERFORMANCE_PLAN.md 4.1. Match that style (a short comment noting the calls are independent).

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `pnpm typecheck`         | exit 0              |
| Lint      | `pnpm lint`              | exit 0              |
| E2E       | `npx playwright test tests/listing-gallery.spec.ts tests/routes.spec.ts` | pass |
| Full E2E  | `npx playwright test`    | all pass            |

## Scope

**In scope** (the only files you should modify):
- `src/app/eiendommer/[slug]/page.tsx`
- `plans/README.md` (status row)

**Out of scope** (do NOT touch):
- The fetcher modules (`src/lib/listing/*.ts`) — their contracts are correct.
- `generateMetadata` in the same page file — `getListing` is `cache()`-deduped; no change needed.
- `src/app/eiendommer/page.tsx` (the index page) — different data flow; audit found no equivalent waterfall there.
- Any caching/`revalidate` change.

## Git workflow

- Branch: `advisor/006-listing-parallel-fetch`
- Conventional commit, e.g. `perf(eiendommer): parallelize independent Supabase fetches on detail page`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Group the independent fetches

In `EiendomDetailPage`, replace the five sequential awaits with two phases:

```ts
const { slug } = await params;

// The four fetches are independent of each other (gallery/downloads key on
// slug, not on the listing row; the all-listings query feeds the related
// cards) — run them in parallel. Only the related-covers lookup needs a
// prior result. Same pattern as onboarding.ts / PERFORMANCE_PLAN.md 4.1.
const [listing, dbGallery, dbDownloads, allListings] = await Promise.all([
  getListing(slug),
  getListingGallery(slug),
  getListingDownloads(slug),
  getListings(),
]);
if (!listing) notFound();
```

Keep every line of derived logic between the old awaits exactly as it is (`statusLabel`, `cityLabel`, the `gallery` fallback chain, `coverSrc`, `downloads`, `mainImg`, `sideImgs`, `updatedLabel`) — only the data sources move. Then derive `related` from `allListings` instead of a fresh await:

```ts
const related = allListings
  .filter((other) => other.slug !== listing.slug)
  .sort((a, b) => {
    const aSame = a.type === listing.type ? 0 : 1;
    const bSame = b.type === listing.type ? 0 : 1;
    return aSame - bSame || a.order - b.order;
  })
  .slice(0, 2);

const relatedCovers = await getListingCovers(related.map((r) => r.slug));
```

Trade-off accepted by this plan: on a 404 slug, the three extra queries run before `notFound()` fires — wasted work on a path that should be rare (404s are not in the sitemap). Do not "optimize" that away by re-serializing.

**Verify**: `pnpm typecheck` → exit 0. `pnpm lint` → exit 0.

### Step 2: Regression

**Verify**: `npx playwright test tests/listing-gallery.spec.ts tests/routes.spec.ts` → pass (routes spec crawls every sitemap URL including all listing pages; gallery spec exercises the lightbox on a detail page). Then `npx playwright test` → all pass.

## Test plan

No new tests — `tests/routes.spec.ts` (crawls all listing detail pages) and `tests/listing-gallery.spec.ts` (gallery behavior on a detail page) are the regression net. The change is a pure reordering of independent awaits; observable output must be identical.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -c "await Promise.all" "src/app/eiendommer/[slug]/page.tsx"` → 1
- [ ] `grep -c "await get" "src/app/eiendommer/[slug]/page.tsx"` → exactly 1 in `EiendomDetailPage` outside the `Promise.all` (the `getListingCovers` call) — manual count: total standalone `await getX(` lines in the component is 1
- [ ] `pnpm typecheck` exits 0; `pnpm lint` exits 0
- [ ] `npx playwright test` exits 0
- [ ] Only the page file and `plans/README.md` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The page body between lines 96-142 no longer matches the Current state excerpts (drift — e.g. someone added a fetch that DOES depend on `listing`).
- Any of the five fetchers' signatures changed (check the cited definition lines).
- A Playwright listing test fails after the change and the failure reproduces — do not chase it by reordering awaits differently; report.

## Maintenance notes

- If a future fetch is added to this page, decide explicitly: independent → join the `Promise.all`; dependent on `listing` → after the guard. The comment in the code states this.
- Reviewer: confirm no derived variable accidentally moved above the `notFound()` guard that dereferences `listing`.
