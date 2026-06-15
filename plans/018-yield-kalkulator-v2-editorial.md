# Plan 018 — Yield-kalkulator v2 (editorial) + calculator step-mark contrast fix

**Branch:** `feat/yield-kalkulator-v2-editorial`
**Source:** Claude Design handoff `advanti-yield/Yield Kalkulator v2.html` (+ user feedback on naringskalkulator/yield-kalkulator/pris-verdivurdering).

## Goal

Bring `/verktoy/yield-kalkulator` onto the same editorial idiom the rest of the
calculators now use (the `NaringskalkulatorClient` pattern: inputs-left, sticky
dark result card, hairline sections), per the v2 design. Fix the near-invisible
step-mark labels ("02 — Leieinntekter") on the calculators. Resolve the
`pris-verdivurdering` inconsistency the user flagged.

## What the user reported

1. **`/verktoy/pris-verdivurdering`** — "did we update this in a PR? should it be
   there?" It's in the Nav dropdown + sitemap + registry, but I dropped it from the
   new Verktøy hub (PR #74). It is a yield→value estimator that overlaps with
   `naringskalkulator`. → scope decision (see Open Decisions).
2. **`/verktoy/naringskalkulator`** — the "02 — Leieinntekter" step label is
   invisible: `.calc-inputs .step-mark { color: var(--accent) }` is light-blue on
   warm-white. Needs dark text.
3. **`/verktoy/yield-kalkulator`** — should follow the same editorial style as the
   rest. Currently it's the old slider/flat-card idiom (`YieldCalculator` +
   `CalculatorLayout` + `AnimatedCTA`).

## What already exists (reuse, do not rebuild)

- **Math:** `src/lib/verktoy/yieldCalc.ts` `computeYield()` already returns every
  number the v2 design shows (brutto, netto, NOI, månedlig, payback, lån, EK,
  renter, cfEtter, coc, market, diff, opexShare). Unit-tested in
  `tests/unit/yieldCalc.test.ts`. **No math changes.**
- **CSS (editorial calc pattern):** `.calc-grid`, `.calc-inputs`, `.step-mark`,
  `.calc-lbl`, `.vv-seg`, `.num-field/.num-wrap/.suffix/.num-hint`, `.calc-two`,
  `.calc-result` (dark), `.r-lbl`, `.r-value`, `.r-stats/.r-stat`, `.r-cta`,
  `.r-foot` — all already in `advanti-design.css` (used by NaringskalkulatorClient).
- **Components:** `NaringskalkulatorClient` is the structural template. `SubHero`,
  `CtaStrip`, the `.feat-3` "slik regner vi" block, `.head-compact`.
- **Funnel:** prefill `/verdivurdering?type=…&leie=…&kjop=…` (mirror naringskalk).

## Work items

### A. Step-mark contrast fix (the "black text" fix)
- `advanti-design.css`: `.calc-inputs .step-mark` color `var(--accent)` →
  `var(--warm-grey)`. One change; fixes naringskalkulator AND the new yield page.
- Deliberate deviation from the prototype (it specifies accent) — accent fails
  contrast on warm-white. DESIGN.md rule: keep the editorial look but text must be
  legible. (Numbered-section accent is preserved elsewhere via `.gn`/`.num`, which
  sit on their own and are decorative, not the only signal.)

### B. Rebuild `/verktoy/yield-kalkulator` to the v2 editorial design
- **New client component** `YieldCalculatorV2.tsx` (mirrors NaringskalkulatorClient):
  - Inputs: eiendomstype (`.vv-seg`), årlig brutto leie, kjøpesum, driftskostnader
    with a `% / kr` unit toggle, financing toggle revealing LTV + rente.
  - Dark sticky result: netto yield hero + pill (vs marked), benchmark bar
    (3–10 %), r-stats (brutto, NOI, kontantstrøm/mnd, tilbakebetaling), financing
    sub-block (cash-on-cash, egenkapital, kontantstrøm etter renter), r-cta + foot.
  - Breakdown strip (`yk-break`): opex vs NOI split bar + legend.
  - State via React `useState`; all numbers from `computeYield`. NumberFlow on the
    result figures (consistent with naringskalkulator). Persist to localStorage
    (parity with the prototype's `advanti-yield-v2`).
- **New CSS** (port from v2, light-only, drop `.dark`): `.bench*`, `.r-fin*`,
  `.yk-break*`, `.unit-seg`, `.fin-switch`, `.switch`, `.fin-body`. Reuse the
  existing `.calc-*`/`.r-*` classes; only add what's missing.
- **Page rewrite** `yield-kalkulator/page.tsx`: drop `CalculatorLayout`/`AnimatedCTA`;
  use `SubHero` (crumb Hjem/Verktøy/Yield-kalkulator) + `.section section-divider`
  wrapper + the `.feat-3` "Tre tall, tre spørsmål" explainer + `CtaStrip`.
  Keep metadata.
- **Retire** the old `YieldCalculator.tsx` (slider idiom) once unreferenced.

### C. pris-verdivurdering — resolve the inconsistency (Open Decision D2)

## New CSS (added to advanti-design.css, `var(--token)` only, light-only)
`.bench`, `.bench-track`, `.bench-mark/.cap`, `.bench-dot`, `.bench-scale`,
`.bench-note`, `.r-fin` + children, `.unit-seg`, `.fin-switch`, `.switch`,
`.fin-body`. (`--soft-terrakotta` used by the negative pill — confirm token exists;
fall back to `--delta-down` if not.)

## NOT in scope
- Touching `computeYield`/`computeValuation` math or its tests.
- Redesigning naringskalkulator (only the shared step-mark CSS touches it).
- ROI / boliglån calculators.
- Nav/registry changes beyond whatever D2 decides for pris-verdivurdering.

## Verification
- `pnpm lint` + `pnpm build` (TS strict; build must pass).
- `pnpm test` (yieldCalc unit tests still green — math untouched).
- Manual: yield page renders editorial layout; step-marks legible on both pages;
  financing toggle reveals/hides; benchmark + breakdown update live; CTA prefill works.

## Decisions (resolved at gate, 2026-06-15)
- **D1 (premise):** Confirmed.
- **D2 (pris-verdivurdering):** **Restyle to editorial too** — all three value/yield
  calculators now share the idiom. (Nav/sitemap/registry entries unchanged.)
- **D3 (deviation):** Confirmed — step-mark `var(--warm-grey)`, documented in CSS.
- **Review depth:** Right-sized (single-voice design+eng), not the full 4-phase gauntlet.

## Right-sized review outcome
- **Design:** yield + pris now mirror NaringskalkulatorClient (calc-grid, step-mark,
  dark result). Contrast fixed. v2 pieces (benchmark, financing, breakdown, unit
  toggle) ported light-only. yk-result scoping protects naringskalkulator.
- **Eng:** math reused (`computeYield`/`computeValuation`), 206 unit tests green;
  dead code removed (`calcFields.tsx`, old `YieldCalculator.tsx`); a11y on
  radiogroups/switch/unit toggle/labels; financing block conditionally rendered.
- **Known/flagged:** (1) localStorage persistence dropped — matches naringskalkulator
  (the reference), the old slider yield/pris persisted. (2) ROI + boliglån still use
  the legacy `CalculatorLayout` idiom (out of scope) — now visually distinct from the
  three editorial calculators; candidate for a follow-up.

## Status: IMPLEMENTED — lint + build + `pnpm test:unit` (206) pass.
