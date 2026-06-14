# 015 — Proper tab semantics for MarkedsinnsiktShell subtab/sector buttons

**Status:** TODO
**Written against commit:** `9dda014`
**Priority:** P3 · **Effort:** S · **Risk of the fix:** LOW–MED (3 tests assert the attribute)
**Depends on:** —

## Why this matters

`pnpm lint` reports 3 remaining warnings (the only ones left after plan-time
cleanup):

```
src/components/markedsinnsikt/MarkedsinnsiktShell.tsx
  293:13  warning  aria-selected is not supported by the role button … jsx-a11y/role-supports-aria-props
  498:13  warning  aria-selected …
 1196:13  warning  aria-selected …
```

These are single-select control groups (subtabs at 293/498, sector picker at
1196) rendered as bare `<button aria-selected={…}>`. `aria-selected` is only
valid on roles like `tab`/`option`, not an implicit `button` role — so screen
readers ignore the selected state.

This was deliberately NOT auto-fixed by swapping to `aria-pressed`, because:

1. A sibling control group at line ~153 already uses the correct
   `role="tab"` + `aria-selected` inside `role="tablist"`. The buggy groups
   should match that pattern, not diverge to `aria-pressed`.
2. **Three Playwright tests assert `aria-selected="true"` on these controls**
   (`tests/markedsinnsikt.spec.ts:114, 136, 175`). Swapping to `aria-pressed`
   would break them and change the tested contract.

## Current state (read these first)

- `src/components/markedsinnsikt/MarkedsinnsiktShell.tsx` — the correct pattern
  already in the file at ~line 148–155:
  ```tsx
  <div className="miv-range" role="tablist" aria-label="Tidsrom">
    …
    <button role="tab" aria-selected={value === r.id} … >
  ```
  The three warning sites use `<button aria-selected={…}>` WITHOUT `role="tab"`
  and (likely) without a `role="tablist"` wrapper.
- `tests/markedsinnsikt.spec.ts:114, 136, 175` — assert `aria-selected="true"`.

## Steps

1. For each of the three control groups (around lines 293, 498, 1196):
   - Ensure the wrapping container has `role="tablist"` and an `aria-label`.
   - Add `role="tab"` to each `<button>` that carries `aria-selected`.
   - If the buttons control a panel, add `aria-controls={panelId}` and give the
     panel `role="tabpanel"` + `id`. If there is no distinct panel element
     (the view swaps inline), `role="tab"` + `aria-selected` alone clears the
     lint and is acceptable — match the existing line-153 pattern exactly.
2. Do NOT change `aria-selected` to `aria-pressed` anywhere.

## Done criteria

- `pnpm lint` → `0 errors, 0 warnings` (the 3 aria warnings gone).
- `pnpm test` (or at least `npx playwright test tests/markedsinnsikt.spec.ts`)
  → green; the 3 `aria-selected="true"` assertions still pass.

## Out of scope

- Any refactor of MarkedsinnsiktShell's state/structure (that is a separate,
  larger maintainability item — see plans/README "considered and rejected").
- The line-153 group, which is already correct.

## Escape hatch

If adding `role="tab"` requires a `tablist`/`tabpanel` restructure that the
existing markup can't accommodate without reflowing the layout, STOP and report
— the a11y win is small and not worth a risky DOM restructure.
