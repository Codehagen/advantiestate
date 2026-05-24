# TODOS

Deferred work captured during the editorial redesign port (/plan-eng-review, 2026-05-21),
the AI SEO closure review (/plan-eng-review, 2026-05-24), and the AI-SEO research pass
(/web-research, 2026-05-24).

---

## TODO 14 — HowTo schema pilot — SHIPPED 2026-05-24

- **What:** Pilot HowTo schema on one help article and validate.
- **Outcome:** Shipped infrastructure + one pilot article:
  - `content-collections.ts` HelpPost: added optional `howto: boolean` +
    `step: { name, text }[]` (min 2) — singular `step` per schema.org
    (supersedes legacy `steps`).
  - `src/components/StructuredData.tsx`: new `howto` case emits
    `@type: "HowTo"` with `step[]` of `@type: "HowToStep"` items carrying
    `position` (1-indexed) and `inLanguage: "nb-NO"`. Returns `null` (no-op)
    unless `step.length >= 2`.
  - `src/app/(help)/help/article/[slug]/page.tsx`: render
    `<StructuredData type="howto" />` only when `data.howto && data.step?.length >= 2`.
  - `src/content/help/diskontert-kontantstrom.mdx`: opt-in with 4 steps that
    mirror the visible `<Stepper>` component verbatim (no schema/visible
    drift; satisfies Google rich-result policy).
- **Verified locally:** 6 JSON-LD scripts on the DCF article (Organization,
  RealEstateAgent, WebSite, BreadcrumbList, Article, **HowTo**). Each HowTo
  step has `@type: "HowToStep"` and `position`. 5 control help articles
  emit no HowTo (gate works).
- **Why this matters:** 2026 research (heeya.fr, stackmatix.com, hashmeta.ai)
  shows HowTo schema maps to AI Overview / Perplexity / ChatGPT step
  extraction; one source claims schema-marked content gets ~2.5× more
  citations.
- **Rollout plan:** wait for 1-2 monthly runs of TODO 16 monitoring on
  how-to queries (e.g. "DCF analyse næringseiendom"). If DCF citation
  rate improves vs. control help articles, extend HowTo to
  `sensitivitetsanalyse`, `verdivurdering-av-naringseiendom`,
  `kontantstromsanalyse`. If no movement, stop expanding and revisit.
- **Completed:** 2026-05-24.

---

## TODO 16 — AI citation monitoring — SHIPPED 2026-05-24 (template + cadence)

- **What:** Establish a baseline measurement of how often Advanti is cited
  by ChatGPT, Perplexity, Google AI Overviews, and Claude for the priority
  næringsmegler queries.
- **Outcome:** Created `markedsfoering/ai-citation-baseline.md` — a
  self-contained DIY tracking template with:
  - 20 priority queries covering category / market / service / how-to /
    comparison intents
  - Monthly run template (query × platform matrix)
  - Summary section for citation rate, competitor wins, MoM delta
  - "What to do with the data" guidance: when to expand HowTo schema, when
    to refresh blog content, when to upgrade tooling
- **Cadence:** monthly check (~30 min). First Monday of the month.
- **Tool path:** Start DIY at $0 for 1-2 months. If the cadence becomes
  burdensome, upgrade to **Otterly** ($29/mo, 100 prompts). **ZipTie**
  ($69/mo) is the Cadillac GEO tool but probably overkill for a
  single-market Norwegian B2B site at this stage.
- **First run target:** 2026-06-01 (next Monday) — Christer or whoever
  owns marketing checks the 20 queries and fills in the first row.
- **Why this matters:** Several TODOs (14 HowTo expansion, 15 BlogPost
  backfill prioritization) need DATA, not intuition, to decide whether
  the work moves anything. Without monitoring we are guessing.
- **Completed (template):** 2026-05-24. First monthly run is the next
  open task.

---

## TODO 15 — Add `updatedAt` to BlogPost frontmatter + render — SHIPPED 2026-05-24

- **What:** Add optional `updatedAt` to `BlogPost`, render "Sist oppdatert" on
  the blog post header when it differs from `publishedAt`, propagate to
  sitemap and OpenGraph `modifiedTime`.
- **Outcome:** Infrastructure shipped:
  - `content-collections.ts` BlogPost gets
    `updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()`
  - `src/app/(blog)/blog/(post)/[slug]/page.tsx` header conditionally renders
    `Sist oppdatert {editorialDate(data.updatedAt)}` when set + different
  - `src/app/(blog)/blog/(post)/[slug]/page.tsx` `generateMetadata` now
    passes `modifiedTime: post.updatedAt`
  - `src/app/sitemap.ts` blog block uses `updatedAt ?? publishedAt` for
    `lastModified`
  - `StructuredData.tsx` `article` case already read
    `data.updatedAt || data.publishedAt` for `dateModified`; now actually
    receives `updatedAt` from the blog page
- **Backfill is a content task, NOT shipped:** the 26 existing posts have no
  `updatedAt` yet. Per 2026 freshness research ("cosmetic updates do not count
  and AI engines discount them"), do NOT bulk-bump dates without substantive
  content edits — pair `updatedAt` with real content refresh (new stats,
  rewritten section, updated examples) on 5-10 evergreen posts as part of a
  normal editing pass. Target the highest-value posts: valuation guides,
  market explainers, partner case studies.
- **Why this matters:** 2026 freshness research is striking — content under
  3 months old is **3× more likely to be cited**, pages updated in the last
  2 months earn **+28% citations**, AI-cited content is 25.7% fresher than
  organic. Highest-leverage AI SEO lever currently available.
- **Completed:** 2026-05-24 (infrastructure only; backfill is a follow-up
  content task).

---

## TODO 1 — Swap display font to Reckless Neue

- **What:** Replace Inter as the display/heading font with Reckless Neue once the
  font license is acquired.
- **Why:** The redesign was built for Reckless Neue's editorial italic character.
  Inter for display is an explicit stopgap that flattens the intended look — every
  heading uses an italic flourish that reads as a sans italic, not editorial serif.
- **Pros:** Restores the approved visual identity the partners signed off on.
- **Cons:** License cost; must be purchased per office through ANTI as.
- **Context:** Single change to the `--font-display` CSS variable plus a
  `next/font/local` registration of the Reckless Neue woff2 files. The design system
  already isolates display type behind one variable, so the swap is one place.
- **Depends on / blocked by:** ANTI as license purchase — contact
  Ingunn.garthus@anti.as for pricing and font files.

---

## TODO 5 — Move markedsinnsikt data to content collections

- **What:** The 20-quarter series, six cities and the two Bodø price zones are
  hardcoded in `MarkedsinnsiktShell.tsx` / `MarkedsKartLeaflet.tsx`. Move them to
  a typed Content Collection.
- **Why:** Editing market data should not require a code change; a collection
  makes the quarterly refresh a content edit.
- **Context:** Deferred from the markedsinnsikt charts/maps rebuild
  (/plan-eng-review, 2026-05-21). Separate body of work — the rebuild kept the
  data in place.

---

## TODO 6 — Make /kart price-zone selection keyboard- and touch-accessible

- **What:** On `/markedsinnsikt/kart` the zone-info panel opens on hover only
  (`mouseover`/`mouseout`). Touch taps flicker it; keyboard users cannot reach it.
- **Why:** Zone pricing is currently mouse-only. Add click/tap-to-select and a
  keyboard path (e.g. a zone list).
- **Context:** Carried over from the Mapbox version's hover-only pattern; flagged
  by the ship adversarial review, 2026-05-21. Not a regression, but a real gap.
- **Sketch (added 2026-05-24 from Leaflet a11y research):** Leaflet's
  `MapContainer` is keyboard-operable by default; the gap is the GeoJSON path
  zone-selection layer. Pattern: (1) render a parallel `<ul>` of zones outside
  the map (an accessible "Bodø sentrum / Bodø ytre / …" list), (2) wire each
  list item to `setSelected(zone)`, mirroring the existing `mouseover` state,
  (3) add `onClick`/`onKeyDown` to GeoJSON paths so clicking or pressing Enter
  selects the same zone, (4) add `aria-label` to each Path via the Leaflet
  pane API. Reference: [leafletjs.com/examples/accessibility/](https://leafletjs.com/examples/accessibility/),
  WCAG 2.1 SC 2.4.3 Focus Order.

---

## TODO 7 — Refresh stale dated copy on markedsinnsikt (PARTIAL 2026-05-24)

- **What:** The page shows "OPPDATERT 14. JAN 2026" (×5, on data widgets) and
  "Neste utgave 15. april 2026" — both already past.
- **Why:** Stale dates undercut the page whose whole purpose is data credibility.
- **PARTIAL FIX SHIPPED 2026-05-24:** "Neste utgave 15. april 2026" updated to
  "15. juli 2026" in `MarkedsinnsiktShell.tsx:1027` — that field is a
  forward-looking forecast, no data-integrity claim attached.
- **NOT FIXED — owner's call:** The 5 "OPPDATERT 14. JAN 2026" timestamps
  (lines 200, 402, 575, 704, 845) sit next to `Yield, leie og ledighet — Q4 2025`
  and reflect a real historical data release. Bumping them to e.g. "15. APR 2026"
  is only honest if the Q1 2026 data has actually been ingested. The 2026
  freshness research explicitly warns: *"Cosmetic updates (date stamp changes,
  synonym swaps, year-only updates) do not count and AI engines discount them"*
  — so bumping without a real refresh is both misleading and useless.
- **Path forward:** Data team confirms whether Q1 2026 (and possibly Q2 2026)
  markedsdata, leie, transaksjon, telling, and yield numbers have been
  refreshed. If yes → bump each timestamp to the actual release date. If no →
  consider whether the page should hide individual timestamps and show a single
  "Sist oppdatert" derived from the latest underlying data file.

---

## Completed

### TODO 17 — Validate live `/llms.txt` against llmstxt.org spec

- **What:** Confirm the new `/llms.txt` route shipped in commit `2dfcfab` is
  spec-compliant (community has converged on several free validators:
  llmstxtchecker.net, llmstxtvalidator.org/.dev/.io, mrs.digital/tools).
- **Outcome:** Validated manually against the llmstxt.org formal spec on
  2026-05-24:
  - ✅ H1 present (`# Advanti`)
  - ✅ Blockquote summary present (one `>` line)
  - ✅ 5 H2 sections, all properly formed
    (`## Tjenester`, `## Lokasjoner`, `## Hjelp og terminologi`,
    `## Kundehistorier`, `## Optional`)
  - ✅ All 46 bullets match `- [name](url)[: notes]` spec pattern
  - ✅ No H3+ (spec only allows H1 + H2)
  - ✅ `## Optional` correctly placed last (per spec — "can be skipped if a
    shorter context is needed")
  - ✅ Served as `text/plain; charset=utf-8` with
    `Cache-Control: public, max-age=3600, s-maxage=3600`
  - ✅ Prerendered as `○ /llms.txt` in `next build` output
- **Completed:** 2026-05-24.

### TODO 11 — FAQPage schema on service & tool pages

- **What:** Add `FAQPage` structured data to the `/tjenester/*` service pages and
  the `/verktoy/*` calculator pages.
- **Outcome:** Done for the 6 `/tjenester/*` service pages. New
  `src/components/site/Faq.tsx` renders a visible FAQ accordion (reusing the
  existing `.faq` styles) plus matching `FAQPage` JSON-LD from one shared `items`
  array — the visible Q&A and the schema are driven by the same data, so they
  can't drift, which is what Google's FAQ rich-result policy requires. Each page
  got a "05 — Ofte stilte spørsmål" section with 4 Q&As authored strictly from
  facts already on that page. Tool pages (`/verktoy/*`) skipped — thin calculator
  wrappers with no FAQ-suitable content.
- **Completed:** 2026-05-22 (branch `seo/metadata-canonical-fixes`).

### TODO 12 — Link Organization + RealEstateAgent JSON-LD via shared @id

- **What:** Give the `Organization` and `RealEstateAgent` JSON-LD blocks a shared
  `@id` so Google treats them as one entity rather than two separate ones.
- **Outcome:** Done. Organization, RealEstateAgent, the WebSite publisher and the
  Article publisher all carry `@id` `${baseUrl}/#organization` in
  `StructuredData.tsx` — one connected entity instead of unlinked top-level nodes.
- **Completed:** 2026-05-22 (branch `seo/metadata-canonical-fixes`).

### TODO 13 — Dedicated square logo image for structured data

- **What:** Replace the reuse of `opengraph-image.jpg` (1200x630) as the `logo`
  in the JSON-LD blocks with a dedicated square logo asset.
- **Outcome:** Done. The premise that no asset existed did not hold —
  `public/icon-512x512.png` is a genuine square Advanti logo (the "A." mark). All
  four `logo` fields in `StructuredData.tsx` (Organization, RealEstateAgent,
  WebSite publisher, Article publisher) now point to it; the Article publisher
  logo dimensions were corrected from 1200×630 to 512×512.
- **Completed:** 2026-05-22 (branch `seo/metadata-canonical-fixes`).

### TODO 10 — Automated performance regression guard

- **What:** Add a performance budget so a future change can't silently
  re-bloat the bundle.
- **Outcome:** Done. Added `tests/perf-budget.spec.ts` — a Playwright spec
  that measures each key route's first-load JS (sum of every `.js` resource's
  `encodedBodySize`, in a real browser) and fails over a per-route ceiling.
  Budgets (measured value + ~15% headroom): `/` 250 KB, `/markedsinnsikt`
  380 KB, plain article 490 KB, chart article 575 KB, chart+math article
  710 KB. Next 16 dropped per-route sizes from `next build` output and has no
  `app-build-manifest.json`, so the metric is measured in-browser —
  Next-internals-independent. Also added `.github/workflows/ci.yml` (the repo
  had no CI) running build + the full Playwright suite incl. perf-budget on
  push and PR.
- **Completed:** 2026-05-22 (branch `perf/optimization-pass`).

### TODO 9 — Slim the global advanti-design.css

- **What:** Trim dead selectors from `src/styles/advanti-design.css` (~100 KB,
  `@import`-ed globally).
- **Outcome:** Done — but the premise did not hold. PurgeCSS analysis showed
  the file is ~92% live: it was purpose-built for these routes, not bloated.
  Removed 18 verified-dead selectors (zero references anywhere in source): the
  `ks-*` knowledge-base classes (re-implemented with Tailwind in `mdx.tsx`),
  unused hero variants, and other design-handoff leftovers. Kept 4 Leaflet
  runtime classes PurgeCSS flagged as false positives. Result: 102 KB →
  94.6 KB raw (~2 KB gzipped) — a small win. Verified: build clean, 52
  Playwright tests pass, 5 routes visually QA'd. The file is a genuine design
  system, not dead weight; no further slimming is worthwhile.
- **Completed:** 2026-05-22 (branch `perf/optimization-pass`).

### TODO 8 — Fix the stale Next.js version in CLAUDE.md

- **What:** `CLAUDE.md` said "Next.js 15.3.2"; `package.json` is on `16.1.4`.
- **Outcome:** Done. Tech Stack section in `CLAUDE.md` updated to `Next.js 16.1.4`.
  Same pass also corrected the now-stale Mapbox references — the Mapbox
  integration section, the `eiendom/PropertyMap.tsx` mentions, and the chart/map
  workflow notes — to match the Recharts + Leaflet rebuild.
- **Completed:** 2026-05-21 (branch `design/markedsinnsikt-recharts-leaflet`).

### TODO 2 — Repo-wide dark-mode teardown

- **What:** Remove `next-themes`, `ThemeProvider`, `ThemeSwitch`, and all `dark:`
  Tailwind classes from the files outside the redesign scope.
- **Outcome:** Done. `next-themes` removed — it was an unused dependency; no
  `ThemeProvider`/`ThemeSwitch`/`useTheme` existed in the codebase. `darkMode:
  "selector"` removed from `tailwind.config.ts`. All 723 `dark:` Tailwind variant
  classes stripped across 40 files (every `dark:` was inert — nothing ever applied a
  `.dark` class). `src/components/blog/mdx.tsx` was the first file, done in PR #5;
  the remaining 39 files cleared in this pass. Production build clean, full Playwright
  suite green.
- **Completed:** 2026-05-21 (branch `chore/dark-mode-teardown`).

### TODO 3 — Iconless treatment for tool pages

- **What:** Decide whether the out-of-scope tool pages (verktoy calculators,
  data-tables, simulering, modals) should also drop icons to match the no-icon brand,
  or keep icons as functional UI.
- **Outcome:** Decided — tool pages keep their icons. The 24 files importing
  `@remixicon` are mostly functional UI (Select dropdown chevron, Input password/search
  toggles, Button loading spinner, chart scroll arrows, copy button, modal close X,
  calculator info tooltips). Stripping those risks worse usability with no design
  mockup, and Decision D8 already scoped icon removal to the redesigned marketing
  pages. Icons stay as functional UI on the tool surface.
- **Completed:** 2026-05-21.

### TODO 4 — Clear the 179-error TypeScript baseline

- **What:** The repo had 179 pre-existing `tsc --noEmit` errors. Drive the count to
  zero, then flip `typescript.ignoreBuildErrors` to `false` so the build enforces types.
- **Outcome:** Done — 57 remaining errors fixed (21 real app-code fixes; the
  `content-collections.ts` build-config errors scoped out via `@ts-nocheck`),
  `ignoreBuildErrors` flipped to `false`. `next build` now type-checks for real.
- **Completed:** 2026-05-21 (commit `f63d3b7`, branch `redesign-editorial-port`).
