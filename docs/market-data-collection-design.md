# Design spike: should quarterly market data move out of TypeScript into a content collection?

**Plan**: 007 | **Status**: STOPPED — STOP condition triggered at Step 1 (see below)
**Branch**: `advisor/007-market-data-spike` | **Date**: 2026-06-10
**Spike scope**: inventory + analysis only — no `src/` or `content-collections.ts` changes

---

## STOP CONDITION — wider blast radius than assumed

The inventory (Step 1) revealed **two consumers outside `src/components/markedsinnsikt/`**:

| File | Exports used |
|------|-------------|
| `src/app/presserom/page.tsx` | `CITIES`, `LATEST_QUARTER` |
| `src/app/markedsrapport/page.tsx` | `CITIES` |

The plan's STOP condition reads: *"The inventory reveals consumers outside `src/components/markedsinnsikt/` (wider blast radius than assumed — note it and stop before recommending)."*

These consumers are app-level server components, not in the assumed blast radius. In isolation their imports are simple (no positional indexing), but their existence means any migration must also update `src/app/presserom/page.tsx` and `src/app/markedsrapport/page.tsx`, which was not accounted for in the M-effort estimate. The rest of this document records the full inventory for the maintainer to review before the spike is resumed or redirected.

---

## Step 1: Consumer inventory

### All importers of `marketData.ts`

```
grep -rln "marketData" src/
```

Result: **4 files** (maps have no direct imports — they receive `CITIES` as a prop).

| Consumer | Location | Component type | Exports used | Access pattern |
|----------|----------|----------------|--------------|----------------|
| `MarkedsinnsiktShell.tsx` | `src/components/markedsinnsikt/` | Client (`"use client"`) | ALL: `QUARTERS`, `RATES`, `YIELD`, `LEIE`, `VOLUME`, `VACANCY`, `TX`, `CITIES`, `fmtNoComma`, `fmtPct1`, `fmtNum`, `Segment` | Positional array indexing: `arr[arr.length - 1]` (current Q), `arr[arr.length - 5]` (−1 yr delta), `arr[arr.length - 13]` (−3 yr delta); passes `CITIES` as prop to `NordNorgeLeafletMap` |
| `MarketDataSummary.tsx` | `src/components/markedsinnsikt/` | Server | `CITIES`, `YIELD`, `LEIE`, `VACANCY`, `TX`, `LATEST_QUARTER`, `fmtNoComma`, `fmtNum`, `fmtPct1`, `Segment` | `arr[arr.length - 1]` only (current Q via local `last()` helper); object-key lookup for `LEIE[segment][city]` |
| `presserom/page.tsx` | `src/app/presserom/` | Server | `CITIES`, `LATEST_QUARTER` | `CITIES.length` (count display), `CITIES.map()` (per-city stats table), `LATEST_QUARTER` (label) |
| `markedsrapport/page.tsx` | `src/app/markedsrapport/` | Server | `CITIES` | `CITIES.map()` (per-city table) |

### Export accounting — every export of `marketData.ts`

| Export | Type | Used by | Notes |
|--------|------|---------|-------|
| `LATEST_QUARTER` | `string` | Shell, Summary, presserom | Displayed as label; also controls `OPPDATERT` stamp (currently hardcoded separately — see below) |
| `QUARTERS` | `string[]` (20 items) | Shell | Chart x-axis labels; length drives the `arr.length - N` deltas |
| `RATES` | `{ swap5y: number[], gov10y: number[] }` | Shell | 20-item parallel arrays; yield-spread computation uses `RATES.swap5y[RATES.swap5y.length - 1]` |
| `Segment` | union type | Shell, Summary | `"kontor" \| "handel" \| "logistikk"` |
| `YIELD` | `Record<Segment, number[]>` | Shell, Summary | 3 × 20-item arrays; positional deltas in Shell |
| `LEIE` | `Record<Segment, Record<string, number[]>>` | Shell, Summary | Nested: segment → city → 20-item array. Note: logistikk cities differ from kontor/handel (includes "Mo i Rana", omits "Harstad") |
| `VOLUME` | `{ years: string[], total: number[] }` | Shell | Annual transaction volume — different cadence (yearly, not quarterly); 8 years |
| `VACANCY` | `Array<{ city, kontor, handel, logistikk }>` | Shell, Summary | Point-in-time per city; not a time series |
| `TX` | `Array<{ date, name, loc, seg, value, yield }>` | Shell, Summary | 6 recent transactions; effectively free-text |
| `CITIES` | `MapCity[]` | Shell, Summary, presserom, markedsrapport | 6 city records with display strings (yield, leie, vac already formatted as strings, not raw numbers) |
| `fmtNoComma` | formatter | Shell, Summary | `v.toFixed(2).replace(".", ",")` |
| `fmtPct1` | formatter | Shell, Summary | `${v.toFixed(1).replace(".", ",")} %` |
| `fmtNum` | formatter | Shell, Summary | `v.toLocaleString("no-NO")` |

**No exports are unused.** All 13 exports (10 data + 1 type + 3 formatters) have at least one consumer.

### Hardcoded date stamps (not derived from `LATEST_QUARTER`)

| File | Line(s) | Hardcoded value | Should be derived from |
|------|---------|-----------------|----------------------|
| `MarkedsinnsiktShell.tsx` | 138, 340, 513, 642, 783 | `"OPPDATERT 14. JAN 2026"` | `LATEST_QUARTER` |
| `MarkedsinnsiktShell.tsx` | 964 | `"Neste utgave"` → `"15. juli 2026"` | Manually set; no equivalent in data |

There are **5 hardcoded `OPPDATERT` stamps** and **1 hardcoded next-issue date** in `MarkedsinnsiktShell.tsx`. These are the visible staleness symptom documented in TODOS.md TODO 7.

---

## Observations for the maintainer (not a recommendation)

These are factual observations from the inventory. A recommendation is not made here because the STOP condition requires the maintainer to clarify the blast radius before the spike continues.

**1. The two app-page consumers (`presserom`, `markedsrapport`) are lightweight.**
Both use only `CITIES` and/or `LATEST_QUARTER`. Neither uses time-series arrays or positional indexing. Any migration would need a shim or re-export so these pages compile without changes, but the coupling is shallow.

**2. The real migration risk is `MarkedsinnsiktShell.tsx` (1,085 lines, client component).**
It imports every export and uses positional indexing tied to `QUARTERS.length`. A shape change (e.g., moving to per-quarter documents where each quarter is a separate file) would ripple through all `arr.length - N` calculations. A re-export shim strategy that keeps the shell untouched in phase 1 is the key design constraint for any migration.

**3. `CITIES` has a dual nature.**
It is used both as map/chart data (lat/lon) and as pre-formatted display strings (`yield: "6,35 %"`). This duality would need to be preserved or split in any migration. The `MapCity` type is defined in `src/components/markedsinnsikt/types.ts`.

**4. `VOLUME`, `VACANCY`, and `TX` have different shapes from the quarterly time-series.**
`VOLUME` is annual (8 years, not 20 quarters). `VACANCY` and `TX` are point-in-time snapshots. Any per-quarter document model would need to handle these differently or keep them in a separate structure.

**5. The stale `OPPDATERT` stamps are a one-line fix regardless of migration path.**
Deriving the stamp from `LATEST_QUARTER` in `MarkedsinnsiktShell.tsx` is independent of any storage decision and closes TODOS.md TODO 7 at near-zero risk.

---

## Open questions for the maintainer

The following questions must be answered before resuming the migration spike:

1. **Are `src/app/presserom/page.tsx` and `src/app/markedsrapport/page.tsx` within acceptable scope for the migration?** The plan assumed consumers would be confined to `src/components/markedsinnsikt/`. If yes, update the blast-radius estimate and resume the spike. If no, a re-export shim strategy (Option B or C in the deferred options analysis) that keeps these pages untouched becomes mandatory.

2. **Who authors the quarterly market data update?** Developer-only (requires PR) vs. a designated non-developer author (requires editor-friendly format). The answer determines whether a JSON/YAML externalization is worth the migration cost or whether a validated TS file with a good runbook is sufficient.

3. **Is per-quarter history needed in the product?** Currently the shell displays time-series charts from 20 quarters. If the product will ever need to add/remove quarters independently (e.g., show Q1 2026 without redeploying all history), a per-quarter document model makes sense. If not, a single-file approach (TS or JSON) is simpler.

4. **Is a CMS ever on the roadmap?** If Sanity or a similar headless CMS is planned, a JSON/TypeScript file that a future importer can source is better than baking content into a content-collections schema that would need to be unwound.

5. **What is the next update deadline?** If Q1 2026 data must ship soon, the lowest-risk immediate action is: fix the `OPPDATERT` stamps in-place (< 30 min), then plan the migration for the quarter after. The spike recommendation would then be timeboxed to the next planning cycle.

---

## Deferred sections

The following sections from the plan's Done criteria were NOT written because the STOP condition was triggered before Step 2:

- Options analysis (A: content collection, B: typed JSON + zod, C: keep TS + guardrails)
- Recommendation with justification
- Prototype schema (zod or collection definition)
- Worked Q4-2025 example with real data — **partial fixture below as reference**
- Migration blast-radius estimate (S/M/L)
- Go/no-go

### Partial Q4-2025 data fixture (for reference only — not a prototype)

The real Q4 2025 values from `marketData.ts` are recorded here to preserve them for whichever schema is eventually chosen. Spot-check: kontor yield series ends at `6.1`.

```
LATEST_QUARTER = "Q4 2025"
QUARTERS last entry = "Q4 25"

YIELD (last value per segment — Q4 2025):
  kontor:     6.1
  handel:     6.55
  logistikk:  6.85

RATES (last value — Q4 2025):
  swap5y:  3.82
  gov10y:  3.55

LEIE (last value per segment/city — Q4 2025, kr/m²/år):
  kontor:
    Bodø:    2400
    Tromsø:  2950
    Harstad: 1875
  handel:
    Bodø:    3135
    Tromsø:  3635
    Harstad: 2360
  logistikk:
    Bodø:       1405
    Tromsø:     1655
    Mo i Rana:  1220

VACANCY (Q4 2025 snapshot):
  Bodø:      kontor 4.6%,  handel 3.1%,  logistikk 2.4%
  Tromsø:    kontor 3.4%,  handel 2.8%,  logistikk 1.9%
  Alta:      kontor 6.2%,  handel 4.4%,  logistikk 3.8%
  Harstad:   kontor 5.8%,  handel 3.9%,  logistikk 3.2%
  Narvik:    kontor 7.5%,  handel 5.1%,  logistikk 4.2%
  Mo i Rana: kontor 5.4%,  handel 4.0%,  logistikk 2.8%

CITIES (Q4 2025 snapshot — pre-formatted display strings):
  Bodø:      yield "6,35 %", leie "2 400 kr/m²", vac "4,6 %"
  Tromsø:    yield "6,10 %", leie "2 950 kr/m²", vac "3,4 %"
  Alta:      yield "6,75 %", leie "1 950 kr/m²", vac "6,2 %"
  Mo i Rana: yield "6,80 %", leie "1 750 kr/m²", vac "5,4 %"
  Narvik:    yield "6,90 %", leie "1 820 kr/m²", vac "7,5 %"
  Harstad:   yield "6,55 %", leie "1 875 kr/m²", vac "5,8 %"
```

---

*Spike stopped per plan 007 STOP condition. Resume after maintainer answers the open questions above.*
