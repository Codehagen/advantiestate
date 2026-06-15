# 017 — PR #74 calculator hardening

**Branch:** `feat/verdivurdering-yield-kalkulator` · **Written against:** `cd42e93`
**Status:** DONE (planned + implemented in the same session, per "fix them all")

Advisor audit of the verktoy yield/valuation calculators introduced by PR #74.
Five findings, each with the fix that resolved it. Verification for all:
`pnpm lint` clean · `pnpm build` green (both pages prerender static) ·
`pnpm test:unit` 206/206 (+18) · browser smoke unchanged behaviour.

---

## 017.1 — Extract pure yield/valuation math + unit tests  (tests, HIGH leverage)

**Problem.** Financial math (NOI, netto/brutto yield, cash-on-cash, value = NOI ÷
yield, ±0.5pp band, verdi pr. m²) lived inline in the components with no tests —
violating the repo's own convention (`src/lib/verktoy/naringskalkulator.ts` is a
pure module tested by `tests/unit/naringskalkulator.test.ts`).

**Fix.** New `src/lib/verktoy/yieldCalc.ts` with pure `computeYield` /
`computeValuation` (+ `computeDrift`, `computeNoi`, `opexSharePct`, `marketYield`,
`clamp`). New `tests/unit/yieldCalc.test.ts` with known vectors (defaults,
kr-mode, segment switch, guards for kjop=0 / negative NOI / yield=0 / area=0) and
the inverse-relationship check. Both components consume the lib; market-yield
defaults come from the shared `YIELDS` constant.

**Done criteria.** `pnpm test:unit` shows the new file passing; numbers match the
browser-observed values (netto 6.80, brutto 8.00, coc 9.83, verdi 15.11M, band
14.07–16.32M).

## 017.2 — Extract shared calculator markup  (tech-debt)

**Problem.** Chip group, breakdown bar, and explainer cards (~60 lines) were
copy-pasted between `YieldCalculator` and `ValuationYieldCalculator`; only
`Info/Field/Seg/Stat` had been extracted.

**Fix.** Added `Chips`, `BreakdownBar`, `ExplainerCards` to `calcFields.tsx`; both
components now render via them. No visual change (browser smoke identical).

## 017.3 — Clamp localStorage values on hydration  (correctness)

**Problem.** Both components set state directly from `localStorage`; a stale or
hand-edited out-of-range value rendered out of sync with its slider until touched.

**Fix.** `clamp(n,min,max)` (in `yieldCalc.ts`) applied to every numeric field on
hydration, bounded to that field's `[min,max]`. Unit-tested.

## 017.4 — Remove duplicate page-level CalculatorCTA  (UX)

**Problem.** `CalculatorLayout` already renders a `CalculatorCTA`; the page added a
second one, so the page showed two near-identical "kontakt oss" boxes plus an
AnimatedCTA and the in-calculator prefilled link.

**Fix.** Removed the page-level `CalculatorCTA` (and its import) from
`pris-verdivurdering/page.tsx`. Browser smoke: "Trenger du" CTA count 2 → 1. The
layout CTA + in-calculator prefilled link + AnimatedCTA carry conversion. The
layout-level CTA is shared across all calculators and intentionally left alone.

## 017.5 — SEO slug decision  (docs/SEO) — DECISION, no code change

**Problem.** The route stays `/verktoy/pris-verdivurdering` but the content/title
no longer target "pris på verdivurdering".

**Decision.** Keep the slug. Changing the URL is a one-way SEO door (loses the
existing path's equity/inbound links) and the slug still contains the core term
"verdivurdering"; the stale "pris-" prefix is cosmetic. If the maintainer later
wants the keyword realigned, the follow-up is a 301 from the old slug to e.g.
`/verktoy/verdivurdering-kalkulator` — out of scope here, and not done without an
explicit call.

---

## Considered and rejected
- **CTA prefill params** (`type/areal/leie`) — verified compatible with
  `/verdivurdering`'s tolerant parser (`verdivurdering/page.tsx:37-40`,
  `VerdivurderingIntakeForm.tsx:66`). Not a bug.
- **Division-by-zero / NaN** in the value math — guarded (yield slider min 3,
  `noi` clamped ≥0, `dotPos` `high>low` branch). Not a bug.

## Maintenance note
Both calculators now depend on `yieldCalc.ts`. Any change to a field's
`min`/`max` in a component must be mirrored in that component's hydration
`clamp(...)` bounds (they're intentionally duplicated as literals, not imported,
to keep the slider as the single source of UI range). New result numbers should
get a test vector in `yieldCalc.test.ts` rather than inline math in the component.
