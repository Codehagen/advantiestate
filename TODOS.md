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
  Note: `src/components/blog/mdx.tsx` still carries ~23 inert `dark:` variants — a
  good first file for this teardown.
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

## Completed

### TODO 4 — Clear the 179-error TypeScript baseline

- **What:** The repo had 179 pre-existing `tsc --noEmit` errors. Drive the count to
  zero, then flip `typescript.ignoreBuildErrors` to `false` so the build enforces types.
- **Outcome:** Done — 57 remaining errors fixed (21 real app-code fixes; the
  `content-collections.ts` build-config errors scoped out via `@ts-nocheck`),
  `ignoreBuildErrors` flipped to `false`. `next build` now type-checks for real.
- **Completed:** 2026-05-21 (commit `f63d3b7`, branch `redesign-editorial-port`).
