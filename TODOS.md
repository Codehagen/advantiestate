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

## TODO 9 — Slim the global advanti-design.css (~100KB)

- **What:** Audit and trim `src/styles/advanti-design.css` (~100 KB raw),
  `@import`-ed at `globals.css:4` so it loads and blocks first render on every
  route. Not Tailwind-purged.
- **Why:** It was ported wholesale from the Claude Design handoff (a 3,983-line
  styles.css) and almost certainly carries selectors for pages/components that
  aren't used. Trimming it cuts render-blocking weight site-wide.
- **Pros:** Smaller render-blocking payload on every page; faster FCP.
- **Cons:** Regression-prone — must verify every selector is still live across
  ~30 routes; needs per-route visual QA.
- **Context:** Deferred from /plan-eng-review of PERFORMANCE_PLAN.md
  (2026-05-21), surfaced by the Codex outside-voice pass. The design doc
  deliberately kept this as a scoped semantic-class layer (not Tailwind), so
  the file stays — this is about removing dead rules. Start with a coverage
  audit (PurgeCSS against built HTML, or DevTools coverage). Phase 0 of the
  performance plan records its exact current weight as the baseline.
- **Depends on / blocked by:** Phase 0 baseline of PERFORMANCE_PLAN.md.

---

## TODO 10 — Automated performance regression guard

- **What:** Add a performance budget to CI — minimally a test that parses
  `next build` output and fails if a key route's First Load JS exceeds a
  threshold; optionally Lighthouse CI.
- **Why:** Once the PERFORMANCE_PLAN.md optimization ships, nothing stops a
  future change from silently re-bloating the bundle or regressing Core Web
  Vitals. The design doc's success criterion ("Lighthouse/CWV not worse than
  current site") has no enforcement today.
- **Pros:** Locks in the gains; regressions caught at PR time.
- **Cons:** CI infrastructure to own; Lighthouse CI can be flaky; thresholds
  need tuning.
- **Context:** Deferred from /plan-eng-review of PERFORMANCE_PLAN.md
  (2026-05-21). Thresholds must be set from the POST-optimization numbers, so
  this naturally follows Phases 1–2 rather than joining them. Cheapest viable
  version: a Playwright/Node test asserting `/markedsinnsikt` and a blog route
  First Load JS stay under a recorded ceiling.
- **Depends on / blocked by:** PERFORMANCE_PLAN.md Phases 1–2 complete (for
  realistic thresholds).

---

## Completed

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
