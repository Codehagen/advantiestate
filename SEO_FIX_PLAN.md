# SEO Fix Plan — Advanti Estate

Derived from the SEO audit (2026-05-22) and locked by `/plan-eng-review`
(9 decisions, D1–D9, + Codex outside voice). Scope: concrete code-level SEO
fixes. Off-codebase work (Core Web Vitals, Search Console) is out of scope.

## Goals

1. Every indexable page emits a correct self-referencing canonical — enforced
   at compile time so the bug class cannot return.
2. Non-search pages (ad landing page, internal deck, gated lead magnet) are
   `noindex, follow`.
3. Google can fetch render-critical resources; the sitemap lists only live,
   200, self-canonical URLs.
4. The whole change is guarded by a CI Playwright spec.

## Review decisions (locked)

| # | Decision |
|---|----------|
| D1 | Full sweep — `constructMetadata`'s `path` becomes **required** |
| D2 | Root layout uses a separate canonical-free `baseMetadata()` helper |
| D3 | `constructMetadata` sources the domain from `siteConfig`, not a literal |
| D4 | New `tests/seo-meta.spec.ts` Playwright spec, runs in CI |
| D5 | `noIndex` emits `index:false, follow:true` (was `follow:false` — bug) |
| D6 | Remove `/_next/` from `robots.ts` disallow |
| D7 | Delete the 6 retired blog MDX files that 301-redirect |
| D8 | `/markedsinnsikt/kart` — index it: real intro content + sitemap entry |
| D9 | `/sjekkliste-verdivurdering` — `noindex` (gated lead magnet) |

---

## Phase 1 — Indexation-critical

### 1.1 Rewrite `constructMetadata` (`src/lib/utils.ts`)

Single chokepoint for page metadata. New signature:

```ts
constructMetadata({
  path,                              // REQUIRED — route pathname, e.g. "/tjenester/salg"
  title?, description?, image?,
  noIndex?,                          // default false
  ogType?,                           // "website" (default) | "article"
  publishedTime?, modifiedTime?, authors?,  // article OG fields, optional
}): Metadata
```

Changes:
- `path` is **required** — drop the `= {}` default. A page that omits it fails
  `tsc` (build errors are not ignored). [D1]
- `path` is always a pathname (`/...`). Drop the dead `startsWith("http")`
  branch — with a required pathname it is unreachable. Canonical is always
  `${siteConfig.url}${path}`; `alternates.canonical` and `openGraph.url` are
  always set.
- Replace the hardcoded `const siteUrl = "https://www.advantiestate.no"` with
  `siteConfig.url`; source `twitterHandle` from
  `siteConfig.contact.social.twitter` and `siteName` from `siteConfig.name`.
  Import `siteConfig` (no cycle — already imported widely). [D3]
- Fix the `noIndex` branch: `robots: { index: false, follow: true }`. `follow`
  must be `true` so link equity flows out of noindexed pages. [D5]
- `ogType: "article"` sets `openGraph.type = "article"` plus `publishedTime`,
  `modifiedTime`, `authors` when provided. Default stays `"website"`. [D2.3]

### 1.2 Add `baseMetadata()` for the root layout [D2]

A canonical is page identity, never a site default. Add a small `baseMetadata()`
helper (in `utils.ts`) holding only site-wide defaults — `metadataBase`, OG
defaults, `twitter`, `manifest`, `icons`, `keywords`, `authors`, title/description
fallback — and **no** `alternates.canonical`, no `openGraph.url`.

`src/app/layout.tsx` calls `baseMetadata()` instead of `constructMetadata()`.
Result: a canonical is only ever emitted by a real page that declared its own
`path`. A future metadata-less page degrades to *no* canonical (Google decides),
never an inherited *wrong* one.

### 1.3 Add `path` to static-metadata pages (24 files)

One-line addition / rename to each `constructMetadata({...})` call:

| File | `path` |
|------|--------|
| `src/app/page.tsx` | `/` |
| `src/app/(blog)/blog/(index)/page.tsx` | `/blog` |
| `src/app/om-oss/page.tsx` | `/om-oss` |
| `src/app/tjenester/page.tsx` | `/tjenester` |
| `src/app/tjenester/salg/page.tsx` | `/tjenester/salg` |
| `src/app/tjenester/verdivurdering/page.tsx` | `/tjenester/verdivurdering` |
| `src/app/tjenester/utleie/page.tsx` | `/tjenester/utleie` |
| `src/app/tjenester/transaksjoner/page.tsx` | `/tjenester/transaksjoner` |
| `src/app/tjenester/radgivning/page.tsx` | `/tjenester/radgivning` |
| `src/app/tjenester/strategisk-radgivning/page.tsx` | `/tjenester/strategisk-radgivning` |
| `src/app/verktoy/page.tsx` | `/verktoy` |
| `src/app/verktoy/yield-kalkulator/page.tsx` | `/verktoy/yield-kalkulator` |
| `src/app/verktoy/boliglan-kalkulator/page.tsx` | `/verktoy/boliglan-kalkulator` |
| `src/app/verktoy/roi-kalkulator/page.tsx` | `/verktoy/roi-kalkulator` |
| `src/app/verktoy/pris-verdivurdering/page.tsx` | `/verktoy/pris-verdivurdering` |
| `src/app/kontakt/page.tsx` | `/kontakt` |
| `src/app/karriere/page.tsx` | `/karriere` |
| `src/app/kunder/page.tsx` | `/kunder` |
| `src/app/markedsinnsikt/page.tsx` | `/markedsinnsikt` |
| `src/app/markedsinnsikt/kart/page.tsx` | `/markedsinnsikt/kart` |
| `src/app/personer/page.tsx` | `/personer` |
| `src/app/(help)/help/page.tsx` | `/help` |
| `src/app/(integrasjoner)/integrasjoner/page.tsx` | `/integrasjoner` |
| `src/app/naringsmegler/page.tsx` | `/naringsmegler` (rename `canonical`→`path`) |

### 1.4 Add `path` to dynamic-metadata pages (10 files)

`generateMetadata` pages — the 8 that already pass `canonical` just rename the
key to `path`; the 2 category pages add it:

- rename: `blog/(post)/[slug]`, `help/article/[slug]`, `integrasjoner/[slug]`,
  `kunder/[slug]`, `naringsmegler/[slug]`, `personer/[slug]`, `privacy`, `terms`.
- add: `blog/(index)/category/[slug]` → `` `/blog/category/${slug}` ``,
  `help/category/[slug]` → `` `/help/category/${slug}` ``.

### 1.5 `noindex` the three non-search pages

All three still pass `path` (required) and add `noIndex: true`:

- `src/app/landing/verdivurdering/page.tsx` — paid-ads landing page (confirmed
  in `docs/marketing/MARKETING_IMPLEMENTATION_SUMMARY.md`).
- `src/app/presentasjon/page.tsx` — internal sales deck.
- `src/app/sjekkliste-verdivurdering/layout.tsx` — gated lead magnet. [D9]

After D5 all three emit `noindex, follow`.

### 1.6 Remove `/_next/` from `robots.ts` [D6]

`src/app/robots.ts` — drop `/_next/` from the `disallow` array (keep `/api/`,
`/admin/`). `/_next/` holds render-critical JS/CSS and the `next/image`
endpoint; blocking it degrades Google's rendering and removes optimized images
from Google Images. `/_next/` exposes no private content.

---

## Phase 2 — On-page, sitemap, content

### 2.1 Rewrite over-length titles (≤60 chars)

`normalizeMetaTitle` hard-truncates >60-char titles with `…`. Rewrite the two
indexable offenders so truncation never triggers:

- `src/app/page.tsx` — `"Salg og Verdivurdering av Næringseiendom i Nord-Norge | Advanti"` (62)
  → proposed `"Næringseiendom Nord-Norge – Verdivurdering & Salg | Advanti"` (59).
- `src/app/tjenester/page.tsx` — `"Salg og Verdivurdering av Næringseiendom - Tjenester | Advanti"` (61)
  → proposed `"Tjenester innen Næringseiendom i Nord-Norge | Advanti"` (53).
- `/landing/verdivurdering` is now `noindex`; its title no longer reaches a SERP
  — leave as-is.

Strings above are proposals — Norwegian brand-voice sign-off needed.
`normalizeMetaTitle` itself is left unchanged; the D4 spec (2.6) forbids any
emitted `<title>` from containing `…`, so over-length titles fail CI instead of
silently truncating in production.

### 2.2 Sitemap: drop changelog block, delete retired posts

`src/app/sitemap.ts`:
- Remove the `changelogPages` block, its `...changelogPages` spread, and the
  `allChangelogPosts` import — no `/changelog` route exists.

Delete the 6 retired blog MDX files [D7] — each already 301-redirects via
`next.config.mjs`; the redirects stay to catch old inbound links:
`src/content/blog/{handelslokaler-nord-norge, naringseiendomsmarkedet-narvik,
naringseiendomsmarkedet-2025-nord-norge, utleie-naringseiendom-nord-norge,
komplett-guide-verdivurdering-naringseiendom, yield-naringseiendom-hva-det-er}.mdx`.

They drop from `allBlogPosts` → out of the sitemap automatically, and 6 dead
static routes (only masked by the redirect) disappear. Verify no surviving post
links to a deleted slug in MDX body copy; `related` arrays are already
null-safe (`blog/(post)/[slug]/page.tsx` filters undefined).

### 2.3 `og:type=article` for article pages

Pass `ogType: "article"` plus `publishedTime` / `modifiedTime` / `authors` from:
- `src/app/(blog)/blog/(post)/[slug]/page.tsx` (has `publishedAt`, `updatedAt`,
  `author`).
- `src/app/(help)/help/article/[slug]/page.tsx`.

Do it with the article fields or not at all — `type` alone is marginal (Article
JSON-LD already covers Google; OG article fields are for social previews).

### 2.4 `/markedsinnsikt/kart` — make it a real indexed page [D8]

`src/app/markedsinnsikt/kart/page.tsx` currently renders only `<MarkedsKartClient />`.
Add a proper `<h1>` and a real **1–2 paragraph** intro above the map (consistent
with `DESIGN.md`): what the indicative price zones represent, the rent ranges in
text, a line on the Kartverket boundary layer. One sentence is not enough to
justify indexing.

Add `/markedsinnsikt/kart` to `sitemap.ts` `staticPages`.

### 2.5 Sitemap `lastModified` — stop lying

`src/app/sitemap.ts` — the bigger problem is `new Date()` on `blogCategories`,
`helpCategories`, and `locationPages`: it reports "modified now" on every build
for URLs that did not change. The hardcoded `new Date("2025-01-25")` on static
pages is stale but less harmful.

Fix: emit `lastModified` **only** where a true content date exists — blog, help,
customer, integration, person pages (already derived from frontmatter). **Omit**
`lastModified` for static pages, category pages, and location pages rather than
fabricating one. `lastModified` is optional in `MetadataRoute.Sitemap`.

---

## Phase 3 — Deferred (NOT implemented here)

See "NOT in scope" below. FAQ schema, Organization/RealEstateAgent `@id`
linking, dedicated logo image.

---

## What already exists (reused, not rebuilt)

- `constructMetadata` — already had `canonical` + `noIndex` params; extended,
  not replaced.
- `noIndex` param — implemented but never called anywhere; this plan is its
  first use (and fixes the `follow:false` bug).
- `siteConfig.url` — already the single source of truth for `sitemap.ts`,
  `robots.ts`, `StructuredData.tsx`; D3 brings `constructMetadata` in line.
- `StructuredData.tsx` — Article / FAQ / Breadcrumb schema all exist; Phase 3
  reuses them.
- `next.config.mjs` redirects — the 301s for the 6 retired blog slugs already
  exist; D7 just deletes the now-orphaned MDX behind them.
- `tests/perf-budget.spec.ts`, `routes.spec.ts`, `structured-data.spec.ts` —
  existing Playwright + CI patterns; `seo-meta.spec.ts` follows them.
  `routes.spec.ts` already crawls the sitemap but only checks `<400` — the new
  spec strengthens that, it does not duplicate it.

## NOT in scope

- **FAQPage schema on service/tool pages** — deferred; needs Q&A content + schema
  wiring per page. Separate body of work.
- **Organization + RealEstateAgent `@id` linking** — deferred; minor entity-graph
  refinement, no ranking impact.
- **Dedicated square logo image** — deferred; needs a design asset.
- **Building a real `/changelog` route** — deferred; 0 changelog content. The
  plan only removes the dead sitemap block.
- ~~Reworking `normalizeMetaTitle` truncation~~ — **moved INTO scope during
  implementation.** Validation showed 29 dynamic pages (every blog post + help
  article) shipped a baked-in `...`; rewriting 2 static titles could never fix
  that. The helper now only normalises whitespace — titles emit in full, Google
  handles SERP truncation. `seo-meta.spec.ts` fails CI on any title ellipsis.
- **Core Web Vitals / PageSpeed work** — off-codebase measurement; run PSI on the
  live site separately. `PERFORMANCE_PLAN.md` tracks this.
- **Search Console setup / sitemap submission** — off-codebase ops task.

## Failure modes

| Codepath | Realistic failure | Tested? | Error handling | Visible? |
|----------|-------------------|---------|----------------|----------|
| `constructMetadata` required `path` | page omits `path` | build fails (`tsc`) | compile error | yes — build breaks |
| page passes a typo'd `path` | wrong canonical shipped | **D4 spec** asserts canonical == `<loc>` for every sitemap URL | none | caught in CI |
| `baseMetadata()` | future metadata-less page | D4 spec: every sitemap URL has a canonical | degrades to no canonical (not wrong) | caught in CI |
| `noIndex` page | — | D4 spec asserts `noindex, follow` | n/a | caught in CI |
| delete 6 MDX | surviving post links a dead slug | build + blog tests; `related` is null-safe | `.filter(Boolean)` | build / spec |
| `robots.ts` `/_next/` | — | D4 spec asserts no `/_next/` disallow | n/a | caught in CI |

No critical gaps: the D4 spec crawls the full sitemap and asserts per-URL
`200 + indexable + canonical == <loc>`, closing the "silent wrong canonical"
path.

## 2.6 Test plan — `tests/seo-meta.spec.ts` [D4]

New Playwright spec, `perf-budget.spec.ts` pattern, runs in CI. Asserts:

1. Crawl `/sitemap.xml` → for **every** URL: returns `200` (not 3xx/4xx),
   has exactly one `<link rel="canonical">`, and `canonical` href === the
   `<loc>` URL.
2. No sitemap URL is `noindex`.
3. `/landing/verdivurdering`, `/presentasjon`, `/sjekkliste-verdivurdering`:
   `<meta name="robots">` contains `noindex` **and** `follow` (not `nofollow`).
4. `/sitemap.xml` contains no `/changelog/` URLs and none of the 6 deleted
   blog slugs.
5. `robots.txt` does not `Disallow: /_next/`.
6. Every emitted `<title>` is ≤60 chars and contains no `…`.
7. A blog post and a help article emit `og:type=article`.

## Parallelization

Sequential implementation, minimal parallelization opportunity. The canonical
sweep (1.1–1.5) is one **atomic** change — making `path` required breaks the
build until every call site is updated, so the signature change and all ~37 call
sites land in a single commit. 1.6 (robots), 2.1 (titles), 2.2 (sitemap + MDX),
2.4 (kart), 2.5 (lastModified) are independent of the sweep and of each other,
but each is small enough that splitting across worktrees costs more coordination
than it saves. Recommended order: 1.1–1.2 (helper) → 1.3–1.5 (call sites, same
commit) → 2.x in any order → 2.6 (spec) last.

## Implementation Tasks

Synthesized from this review. Run with Claude Code or Codex; checkbox as you ship.

- [ ] **T1 (P1, human: ~45min / CC: ~12min)** — `lib/utils.ts` — rewrite `constructMetadata` (required `path`, `siteConfig` domain, `noindex/follow`, `ogType`+article fields, drop dead `http` branch) and add `baseMetadata()`.
  - Surfaced by: D1, D2, D3, D5 — architecture + code-quality review.
  - Files: `src/lib/utils.ts`, `src/app/layout.tsx`
  - Verify: `pnpm build` type-checks; `baseMetadata()` emits no canonical.
- [ ] **T2 (P1, human: ~1h / CC: ~10min)** — app routes — add `path` to all ~34 page/layout `constructMetadata` call sites (rename `canonical`→`path` on the 8 existing).
  - Surfaced by: D1 — scope challenge, full sweep.
  - Files: the 24 static + 10 dynamic files in 1.3 / 1.4.
  - Verify: `pnpm build` passes (compile-time proof every call site updated).
- [ ] **T3 (P1, human: ~10min / CC: ~3min)** — `landing/verdivurdering`, `presentasjon`, `sjekkliste-verdivurdering` — add `noIndex: true`.
  - Surfaced by: audit + D9.
  - Files: the 3 files in 1.5.
  - Verify: D4 spec — `noindex, follow` present.
- [ ] **T4 (P1, human: ~5min / CC: ~2min)** — `robots.ts` — remove `/_next/` from disallow.
  - Surfaced by: D6 — Codex outside voice.
  - Files: `src/app/robots.ts`
  - Verify: D4 spec — `robots.txt` has no `/_next/` disallow.
- [ ] **T5 (P2, human: ~20min / CC: ~5min)** — `sitemap.ts` — remove changelog block; omit fabricated `lastModified` on static/category/location entries; add `/markedsinnsikt/kart`.
  - Surfaced by: audit + D8 + Codex (lastModified).
  - Files: `src/app/sitemap.ts`
  - Verify: D4 spec — no `/changelog/` URLs; `/markedsinnsikt/kart` present.
- [ ] **T6 (P2, human: ~15min / CC: ~4min)** — delete the 6 retired blog MDX files.
  - Surfaced by: D7 — Codex outside voice.
  - Files: 6 files in `src/content/blog/`.
  - Verify: `pnpm build` clean; blog tests green; deleted slugs absent from sitemap.
- [ ] **T7 (P2, human: ~45min / CC: ~12min)** — `markedsinnsikt/kart/page.tsx` — add `<h1>` + 1–2 paragraph intro content.
  - Surfaced by: audit + D8.
  - Files: `src/app/markedsinnsikt/kart/page.tsx`
  - Verify: page has one `<h1>`; intro renders.
- [ ] **T8 (P2, human: ~30min / CC: ~8min)** — `tests/seo-meta.spec.ts` — write the spec in 2.6.
  - Surfaced by: D4 — test review.
  - Files: `tests/seo-meta.spec.ts`
  - Verify: spec passes locally and in CI.
- [ ] **T9 (P3, human: ~15min / CC: ~4min)** — rewrite the 2 over-length titles; `og:type=article` on blog/help articles.
  - Surfaced by: audit + Codex (ogType depth).
  - Files: `src/app/page.tsx`, `src/app/tjenester/page.tsx`, the 2 article pages.
  - Verify: D4 spec — titles ≤60, no `…`; articles emit `og:type=article`.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | not run (mechanical fix, not a product change) |
| Codex Review | `/codex review` | Independent 2nd opinion | 1 | ISSUES FOUND | 4 material new issues the audit missed |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 9 issues resolved, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | not run (no UI change beyond /kart intro copy) |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | n/a |

- **CODEX:** Outside voice found 4 material issues the audit missed — `robots.ts`
  blocking `/_next/`, the sitemap listing 6 301-redirected blog URLs, the
  `noIndex` helper emitting `nofollow`, and `new Date()` faking `lastModified`.
  All 4 adopted into the plan (D5, D6, D7, 2.5). It also resolved 2 open
  decisions via the marketing docs.
- **CROSS-MODEL:** No contradiction. Codex did not dispute any review finding;
  it surfaced gaps the review and audit missed. All incorporated via D5–D9 with
  explicit user approval.
- **UNRESOLVED:** 0 — all 10 decisions (D1–D10) answered.
- **VERDICT:** ENG CLEARED — ready to implement. 0 critical gaps. Title-rewrite
  strings (2.1) still need Norwegian brand-voice sign-off; `/markedsinnsikt/kart`
  intro copy (2.4) needs authoring.
