# TODOS

Deferred work captured during the editorial redesign port (/plan-eng-review, 2026-05-21)
and the AI SEO closure review (/plan-eng-review, 2026-05-24).

---

## TODO 14 — Revisit HowTo schema after Perplexity/ChatGPT citation baseline

- **What:** Revisit HowTo schema for help articles after measuring 1-2 months of
  baseline citation rate on Perplexity and ChatGPT for how-to queries (e.g.
  "slik verdsetter du næringseiendom").
- **Why:** Google deprecated HowTo rich results in 2023, so it is no longer a
  SERP feature. The remaining value is as entity/context markup for non-Google AI
  engines (Perplexity, ChatGPT). Worth doing only if monitoring shows we are
  under-cited on how-to queries.
- **Context:** Dropped from the AI SEO closure PR after the Codex outside-voice
  review flagged Google's 2023 deprecation against the AI SEO skill's framing.
  Surfaced in `/plan-eng-review`, 2026-05-24.
- **Depends on / blocked by:** Monthly AI citation monitoring in place —
  currently manual; AI SEO skill suggests Peec AI, Otterly, or ZipTie.
- **Sketch when reopened:** add `howto: z.boolean().optional()` + `step:
  z.array(z.object({ name, text }))` (singular `step` per schema.org) to
  `HelpPost`; extend `StructuredData.tsx` with a `howto` branch emitting
  `@type: "HowToStep"` with `position`; pilot ONE article and validate with the
  Schema.org tester before extending.

---

## TODO 15 — Add `updatedAt` to BlogPost frontmatter + render

- **What:** Add optional `updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()`
  to `BlogPost` in `content-collections.ts`; backfill on the 5-10 evergreen
  posts; render "Sist oppdatert" below `publishedAt` in the blog post header
  when the two differ.
- **Why:** Blog is the highest-citation content type (~10% of AI citations per
  the AI SEO skill's stats), and freshness is a top-3 ranking signal for AI
  engines. `HelpPost` and `LegalPost` already have `updatedAt`; BlogPost is the
  only content type still missing the field.
- **Context:** Noticed during the AI SEO closure review on 2026-05-24. Held out
  of the crawler / llms.txt / services PR to keep that PR small and shippable.
  Pairs cleanly with the next round of content editing.
- **Depends on / blocked by:** Nothing technical. Bundle with a content-editing
  pass so the 5-10 evergreen posts get refreshed at the same time the field is
  added.
- **Sketch when reopened:** `content-collections.ts:570` (BlogPost schema) gets
  the optional field; `src/app/(blog)/blog/(post)/[slug]/page.tsx` header renders
  the date only when `updatedAt` differs from `publishedAt`;
  `src/app/sitemap.ts:457` uses `updatedAt ?? publishedAt` for `lastModified`.
  `StructuredData.tsx` `article` case at line 850 already reads
  `data.updatedAt || data.publishedAt` for `dateModified` — no schema-side
  change needed.

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

---

## TODO 7 — Refresh stale dated copy on markedsinnsikt

- **What:** The page shows "OPPDATERT 14. JAN 2026" and "Neste utgave 15. april
  2026" — both already past.
- **Why:** Stale dates undercut the page whose whole purpose is data credibility.
- **Context:** Content fix, owner's call. Flagged during the charts/maps rebuild.

---

## Completed

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
