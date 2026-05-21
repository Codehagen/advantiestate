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

## TODO 2 — Repo-wide dark-mode teardown

- **What:** Remove `next-themes`, `ThemeProvider`, `ThemeSwitch`, and all `dark:`
  Tailwind classes from the ~70 files outside the redesign scope.
- **Why:** The redesign drops dark mode (decision D6) — the new pages are light-only.
  The leftover theme machinery is dead weight: a provider, a hydration concern, and a
  parallel set of styles that nothing uses once migration completes.
- **Pros:** Smaller bundle, simpler components, no hydration-mismatch surface.
- **Cons:** Touches many files; should be done in one pass to avoid a half-state.
- **Context:** New redesign pages are already authored light-only. This TODO is the
  cleanup of the OLD pages and shared components after all design routes have shipped.
- **Depends on / blocked by:** All ~18 design routes ported (end of Phase 2).

---

## TODO 3 — Iconless treatment for tool pages

- **What:** Decide whether the out-of-scope tool pages (verktoy calculators,
  data-tables, simulering, modals) should also drop icons to match the no-icon brand,
  or keep icons as functional UI.
- **Why:** The brand direction mandates no icons. But calculators and data-tables may
  legitimately need icons for usability (sort arrows, input affordances) — removing
  them there is a usability cost, not just a brand win.
- **Pros:** Full brand consistency if removed.
- **Cons:** ~70 files import `@remixicon`; redesigning functional tool UI with no
  mockup risks worse usability.
- **Context:** Decision D8 scoped icon removal to redesigned pages only. This TODO is
  the explicit brand-vs-usability call for the remaining tool surface.
- **Depends on / blocked by:** Nothing — can be decided any time; best revisited once
  the redesigned marketing pages set the visual bar.

---

## TODO 4 — Clear the 179-error TypeScript baseline

- **What:** The repo has 179 pre-existing `tsc --noEmit` errors (measured 2026-05-21,
  D14 investigation). Drive the count to zero, then flip `typescript.ignoreBuildErrors`
  to `false` in `next.config.mjs` so the build itself enforces types.
- **Why:** While the baseline exists, `pnpm typecheck` always exits non-zero, so it
  can only be used as a "did the count go up" check, not a hard pass/fail gate. A clean
  baseline makes the type gate real.
- **Pros:** `next build` becomes a genuine type safety net; catches prop-drift bugs
  (the exact silent failure the MDX migration risks). **Cons:** 179 errors to triage;
  many are `implicitly any` / unused-var and quick, some may be real.
- **Context:** Most errors cluster in `content-collections.ts` and chart/data
  components. Port code (new files) must stay at zero errors regardless — the discipline
  during the port is "never raise the count."
- **Depends on / blocked by:** Nothing — incremental; can chip away alongside the port.
