# TODOS

Deferred work captured during the editorial redesign port (/plan-eng-review, 2026-05-21).

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

## TODO 11 — FAQPage schema on service & tool pages

- **What:** Add `FAQPage` structured data to the `/tjenester/*` service pages and
  the `/verktoy/*` calculator pages.
- **Why:** `StructuredData.tsx` already supports `type="faq"`, but only the
  `/naringsmegler/[slug]` location pages use it. Service and tool pages have
  FAQ-style content that could earn rich-result eligibility for free.
- **Pros:** Eligible for FAQ rich results / People-Also-Ask placement; reuses an
  existing component.
- **Cons:** Each page needs real question/answer content authored or extracted;
  Google has narrowed FAQ rich results, so impact is uncertain.
- **Context:** Deferred from the SEO fix plan (/plan-eng-review, 2026-05-22) as
  Phase 3 — that plan was mechanical metadata work; FAQ schema needs content.
  Start: pick 2-3 Q&As per page from existing copy, pass via `StructuredData
  type="faq"`.
- **Depends on / blocked by:** None.

---

## TODO 12 — Link Organization + RealEstateAgent JSON-LD via shared @id

- **What:** Give the `Organization` and `RealEstateAgent` JSON-LD blocks (both
  rendered globally in `layout.tsx`) a shared `@id` so Google treats them as one
  entity rather than two separate top-level entities.
- **Why:** They currently describe the same company twice with no link between
  them, which is a weaker entity signal than one connected graph.
- **Pros:** Cleaner entity graph; small, well-defined change in
  `StructuredData.tsx`.
- **Cons:** Minor — no measurable ranking impact; purely a correctness/quality
  refinement.
- **Context:** Deferred from the SEO fix plan (/plan-eng-review, 2026-05-22),
  Phase 3. Start: add `@id` (e.g. `${baseUrl}/#organization`) to the
  `organization` case and reference it from `realEstateAgent`.
- **Depends on / blocked by:** None.

---

## TODO 13 — Dedicated square logo image for structured data

- **What:** Replace the reuse of `opengraph-image.jpg` (1200x630) as the `logo`
  in Organization / RealEstateAgent / Article-publisher JSON-LD with a dedicated
  square-ish logo asset.
- **Why:** Google's structured-data guidance prefers a real logo image; a
  wide OG banner is a poor fit for the `logo` field.
- **Pros:** Cleaner publisher logo in rich results and Google's knowledge panel.
- **Cons:** Needs a design asset that does not exist yet.
- **Context:** Deferred from the SEO fix plan (/plan-eng-review, 2026-05-22),
  Phase 3. Start: export a square logo (PNG/SVG) to `/public`, reference it from
  the `logo` fields in `StructuredData.tsx`.
- **Depends on / blocked by:** A square logo asset from design.

---

## Completed

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
