# Design spike: should quarterly market data move out of TypeScript into a content collection?

**Plan**: 007 | **Status**: COMPLETE
**Branch**: `advisor/007-market-data-spike` | **Date**: 2026-06-10
**Spike scope**: inventory + analysis only — no `src/` or `content-collections.ts` changes

---

## STOP CONDITION — wider blast radius than assumed (historical record)

The inventory (Step 1) revealed **two consumers outside `src/components/markedsinnsikt/`**:

| File | Exports used |
|------|-------------|
| `src/app/presserom/page.tsx` | `CITIES`, `LATEST_QUARTER` |
| `src/app/markedsrapport/page.tsx` | `CITIES` |

The plan's STOP condition read: *"The inventory reveals consumers outside `src/components/markedsinnsikt/` (wider blast radius than assumed — note it and stop before recommending)."*

The spike paused here for reviewer sign-off. The reviewer decision is recorded below.

---

## Reviewer decision

**Decision (2026-06-10):** Proceed with the spike. The widened blast radius is accepted. Both extra consumers (`presserom/page.tsx`, `markedsrapport/page.tsx`) use only shallow exports (`CITIES`, `LATEST_QUARTER`), so any recommended option MUST keep those exports stable via a re-export shim. Phase 1 keeps `marketData.ts` as the import surface — only its backing storage (or guardrails) changes. Consumers are not touched in phase 1.

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

## Observations for the maintainer

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

## Step 2: Options comparison

### Criteria table

| Criterion | A — Content collection | B — Typed JSON + zod | C — TS + guardrails |
|-----------|------------------------|----------------------|---------------------|
| **Migration blast radius (files)** | **6+ files**: content-collections.ts (new collection), new `src/content/market-data/` directory, reshape `MarkedsinnsiktShell.tsx` (all `arr.length - N` positional indexing must change), re-export shim for presserom + markedsrapport | **3 files**: new `src/lib/marketDataSchema.ts`, new `src/content/market-data/data.json`, `marketData.ts` becomes thin re-export; all 4 consumers untouched | **2 files**: new `marketDataInvariants.ts` (side-effect only); add `OPPDATERT` export to `marketData.ts`; 1 consumer (Shell) imports `OPPDATERT` |
| **Failure modes prevented** | Type mismatches, missing required fields caught at build | Same; PLUS cross-field invariants (array length === QUARTERS.length) enforced by zod | Length invariants enforced by build-time assertion; `OPPDATERT` staleness eliminated; `LATEST_QUARTER`↔`QUARTERS` sync validated |
| **Failure modes introduced** | 20-quarter parallel arrays in YAML frontmatter are **more** error-prone to hand-edit than TS literals; MDX body required by collection schema but completely unused; Shell's `arr.length - N` positional indexing must be fully restructured | JSON has no inline comments; 20-element parallel numeric arrays are harder to review in JSON than TS; formatters (functions) must stay in TS regardless; large JSON diff obscures intent | None — no structural change; hand-edits still possible with no external schema, but the invariant check catches shape errors before build |
| **Who can author quarterly update** | Developer only (still requires PR + deploy, same as all options) | Developer only (same) | Developer only (same) |
| **Edit ergonomics** | Worst — YAML front-matter with 20-element numeric arrays, no IDE completion for domain logic, positional arrays easy to misalign | Similar to TS — JSON is familiar but lacks comments and requires strict key quoting; parallel numeric arrays are the hardest JSON to diff-review | Best — TS literals, inline type annotations, IDE autocompletion, existing code conventions |
| **CMS-compatibility (future)** | Poor — content-collections schema is MDX-centric; migration to a headless CMS would require unwinding the collection | Good — JSON is easily ingested by future CMS import scripts | Moderate — readable TS, but requires a TS parser or manual JSON conversion to automate |
| **Risk to presserom + markedsrapport** | Re-export shim mandatory; these pages must be touched or shimmed | Shim trivially built into `marketData.ts` thin re-export; pages untouched | No change needed — export surface is identical post-guardrails |

### Recommendation: Option C — Keep TS file, add guardrails

**Option C is recommended.** The key failure modes observed in the codebase — mismatched series lengths and stale `OPPDATERT` stamps — can both be eliminated entirely in-place with a ~30-line invariant check module and two new derived exports, at zero migration risk. All three options require a developer PR for quarterly updates (20 parallel numeric arrays are not meaningfully more "editor-friendly" in YAML or JSON than in TypeScript), so the authoring-accessibility argument for Options A and B does not apply here. Option C preserves the existing import surface and TypeScript ergonomics that the 1,085-line `MarkedsinnsiktShell.tsx` depends on, and leaves open a clean future path to JSON or CMS migration once the codebase has stabilised.

---

## Step 3: Prototype schema (Option C — TS + guardrails)

### 3a. Invariant check module (full schema)

The invariant check runs as a module side effect on first import. No exports. Throws at build time / first import if any series is misaligned or `LATEST_QUARTER` is out of sync.

```typescript
// src/components/markedsinnsikt/marketDataInvariants.ts
// Side-effect only — no exports.
// Import once at the top of marketData.ts:  import "./marketDataInvariants"
// Throws at module load if any invariant is violated (catches errors before deploy).

import { QUARTERS, RATES, YIELD, LEIE, LATEST_QUARTER } from "./marketData"

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`[marketData invariant] ${message}`)
}

const N = QUARTERS.length

// 1. All quarterly time-series must have exactly N entries.
assert(
  RATES.swap5y.length === N,
  `RATES.swap5y: expected ${N} entries, got ${RATES.swap5y.length}`
)
assert(
  RATES.gov10y.length === N,
  `RATES.gov10y: expected ${N} entries, got ${RATES.gov10y.length}`
)
for (const seg of ["kontor", "handel", "logistikk"] as const) {
  assert(
    YIELD[seg].length === N,
    `YIELD.${seg}: expected ${N} entries, got ${YIELD[seg].length}`
  )
  for (const [city, arr] of Object.entries(LEIE[seg])) {
    assert(
      arr.length === N,
      `LEIE.${seg}.${city}: expected ${N} entries, got ${arr.length}`
    )
  }
}

// 2. LATEST_QUARTER must correspond to the last entry in QUARTERS.
//    Convention: LATEST_QUARTER = "Q4 2025"  ↔  QUARTERS last = "Q4 25"
const [lqQ, lqYear] = LATEST_QUARTER.split(" ")         // ["Q4", "2025"]
const expectedLastLabel = `${lqQ} ${lqYear.slice(2)}`  // "Q4 25"
assert(
  QUARTERS[N - 1] === expectedLastLabel,
  `LATEST_QUARTER="${LATEST_QUARTER}" implies last QUARTERS entry should be ` +
  `"${expectedLastLabel}", but found "${QUARTERS[N - 1]}"`
)
```

### 3b. Derived stamp exports (additions to `marketData.ts`)

Replace the 5 hardcoded `"OPPDATERT 14. JAN 2026"` strings in `MarkedsinnsiktShell.tsx` with the new `OPPDATERT` export. Convention: data is published on the 14th of the month following quarter-end.

```typescript
// Add to the bottom of src/components/markedsinnsikt/marketData.ts

/**
 * Derives the publication-date stamp from LATEST_QUARTER.
 * Convention (14th of month following quarter-end):
 *   Q1 (ends Mar) → "OPPDATERT 14. APR <year>"
 *   Q2 (ends Jun) → "OPPDATERT 14. JUL <year>"
 *   Q3 (ends Sep) → "OPPDATERT 14. OKT <year>"
 *   Q4 (ends Dec) → "OPPDATERT 14. JAN <year+1>"
 */
function deriveOppdatert(latestQuarter: string): string {
  const [q, yearStr] = latestQuarter.split(" ")
  const qNum = parseInt(q.slice(1), 10)    // 1–4
  const yr   = parseInt(yearStr, 10)
  const publishMonth = qNum === 4 ? 1 : qNum * 3 + 1
  const publishYear  = qNum === 4 ? yr + 1 : yr
  const MONTHS_NO = [
    "JAN","FEB","MAR","APR","MAI","JUN",
    "JUL","AUG","SEP","OKT","NOV","DES",
  ]
  return `OPPDATERT 14. ${MONTHS_NO[publishMonth - 1]} ${publishYear}`
}

/**
 * "OPPDATERT 14. JAN 2026" — derived from LATEST_QUARTER.
 * Import this in MarkedsinnsiktShell.tsx to replace all 5 hardcoded stamps.
 */
export const OPPDATERT = deriveOppdatert(LATEST_QUARTER)
```

### 3c. Quarterly update runbook (docs/runbook-market-data-update.md)

```markdown
# Quarterly market data update runbook

**Time required:** ~30 min
**Who:** Developer with repo access
**Trigger:** New quarter data available (target: first two weeks after quarter-end)

## Steps

1. Open `src/components/markedsinnsikt/marketData.ts`.

2. Update `LATEST_QUARTER` (e.g. `"Q4 2025"` → `"Q1 2026"`).

3. Append one new value to each time-series (in order):
   - `QUARTERS` — add the new label (e.g. `"Q1 26"`)
   - `RATES.swap5y`, `RATES.gov10y` — new rate values
   - `YIELD.kontor`, `YIELD.handel`, `YIELD.logistikk` — new prime yield
   - `LEIE.kontor.Bodø`, `.Tromsø`, `.Harstad` — new rent (kr/m²/yr)
   - `LEIE.handel.Bodø`, `.Tromsø`, `.Harstad`
   - `LEIE.logistikk.Bodø`, `.Tromsø`, `."Mo i Rana"`
   (9 rent series total)

4. Update `VOLUME` if the annual total is now known (yearly cadence).

5. Update `VACANCY` — point-in-time snapshot for the new quarter.

6. Update `TX` — replace the oldest transaction with the newest closing.

7. Update `CITIES` display strings (yield, leie, vac) to reflect current values.

8. Run `pnpm build`. The invariant check will throw on any length mismatch
   or LATEST_QUARTER↔QUARTERS desync before the PR is merged.

9. The `OPPDATERT` stamp in the UI updates automatically from `LATEST_QUARTER` —
   no manual stamp editing needed.

10. Open a PR: `data(markedsinnsikt): Q1 2026 market data update`
```

### 3d. Worked Q4 2025 example — real data from `marketData.ts`

This is the complete state of `marketData.ts` as it exists today, confirming all series lengths = 20 and `LATEST_QUARTER` = "Q4 2025". Spot-check: `YIELD.kontor` ends at `6.1`; `RATES.swap5y` ends at `3.82`; `LEIE.logistikk["Mo i Rana"]` ends at `1220`.

```typescript
// src/components/markedsinnsikt/marketData.ts — Q4 2025 state (real data)

export const LATEST_QUARTER = "Q4 2025"

export const QUARTERS = [
  "Q1 21", "Q2 21", "Q3 21", "Q4 21",
  "Q1 22", "Q2 22", "Q3 22", "Q4 22",
  "Q1 23", "Q2 23", "Q3 23", "Q4 23",
  "Q1 24", "Q2 24", "Q3 24", "Q4 24",
  "Q1 25", "Q2 25", "Q3 25", "Q4 25",   // 20 entries — invariant enforces this
]

export const RATES = {
  //                Q1 21  Q2 21  Q3 21  Q4 21  Q1 22  Q2 22  Q3 22  Q4 22
  swap5y: [         1.2,   1.45,  1.65,  1.95,  2.3,   2.85,  3.4,   3.85,
  //                Q1 23  Q2 23  Q3 23  Q4 23  Q1 24  Q2 24  Q3 24  Q4 24
                    4.1,   4.25,  4.3,   4.35,  4.2,   4.05,  3.95,  3.9,
  //                Q1 25  Q2 25  Q3 25  Q4 25
                    3.85,  3.8,   3.85,  3.82],
  gov10y: [         0.95,  1.2,   1.4,   1.65,  1.95,  2.4,   2.95,  3.3,
                    3.55,  3.65,  3.7,   3.75,  3.6,   3.5,   3.4,   3.45,
                    3.45,  3.5,   3.55,  3.55],
}

export type Segment = "kontor" | "handel" | "logistikk"

export const YIELD: Record<Segment, number[]> = {
  kontor:    [4.2, 4.2, 4.25, 4.3, 4.4, 4.55, 4.85, 5.2,
              5.6, 5.85, 6.0, 6.15, 6.2, 6.2, 6.15, 6.1,
              6.05, 6.0, 6.05, 6.1],   // ← Q4 2025 = 6.1
  handel:    [4.6, 4.6, 4.65, 4.7, 4.8, 4.95, 5.25, 5.55,
              5.95, 6.2, 6.4, 6.55, 6.65, 6.65, 6.6, 6.55,
              6.5, 6.45, 6.5, 6.55],  // ← Q4 2025 = 6.55
  logistikk: [5.1, 5.1, 5.1, 5.15, 5.25, 5.4, 5.65, 5.95,
              6.3, 6.55, 6.7, 6.85, 6.95, 6.95, 6.9, 6.85,
              6.85, 6.8, 6.85, 6.85], // ← Q4 2025 = 6.85
}

export const LEIE: Record<Segment, Record<string, number[]>> = {
  kontor: {
    Bodø:    [2050,2070,2090,2120,2150,2180,2220,2260,2290,2310,
              2330,2340,2355,2370,2380,2385,2390,2395,2400,2400],  // ← 2400
    Tromsø:  [2550,2570,2600,2640,2680,2720,2780,2830,2860,2880,
              2900,2910,2925,2935,2940,2945,2945,2950,2950,2950],  // ← 2950
    Harstad: [1620,1640,1650,1670,1690,1710,1740,1770,1790,1810,
              1820,1830,1845,1855,1860,1865,1870,1870,1875,1875],  // ← 1875
  },
  handel: {
    Bodø:    [2750,2770,2790,2820,2850,2880,2920,2960,2990,3020,
              3040,3060,3080,3095,3105,3115,3120,3125,3130,3135],  // ← 3135
    Tromsø:  [3200,3220,3250,3280,3320,3360,3400,3440,3470,3500,
              3520,3540,3560,3580,3600,3610,3620,3625,3630,3635],  // ← 3635
    Harstad: [2100,2110,2120,2140,2160,2180,2210,2240,2260,2280,
              2290,2300,2315,2325,2335,2340,2345,2350,2355,2360],  // ← 2360
  },
  logistikk: {
    Bodø:        [1200,1205,1215,1225,1240,1255,1275,1295,1310,1325,
                  1335,1345,1360,1370,1380,1385,1390,1395,1400,1405], // ← 1405
    Tromsø:      [1450,1455,1465,1475,1490,1505,1525,1545,1560,1575,
                  1585,1595,1610,1620,1630,1635,1640,1645,1650,1655], // ← 1655
    "Mo i Rana": [1050,1055,1060,1070,1085,1100,1115,1130,1140,1150,
                  1160,1170,1180,1190,1195,1200,1205,1210,1215,1220], // ← 1220
  },
}

export const VOLUME = {
  years: ["2018","2019","2020","2021","2022","2023","2024","2025"],
  total: [1.8, 2.4, 2.1, 3.6, 4.5, 3.2, 4.1, 4.8],  // mrd NOK
}

export const VACANCY = [
  { city: "Bodø",      kontor: 4.6, handel: 3.1, logistikk: 2.4 },
  { city: "Tromsø",    kontor: 3.4, handel: 2.8, logistikk: 1.9 },
  { city: "Alta",      kontor: 6.2, handel: 4.4, logistikk: 3.8 },
  { city: "Harstad",   kontor: 5.8, handel: 3.9, logistikk: 3.2 },
  { city: "Narvik",    kontor: 7.5, handel: 5.1, logistikk: 4.2 },
  { city: "Mo i Rana", kontor: 5.4, handel: 4.0, logistikk: 2.8 },
]

export const TX = [
  { date:"Des 25", name:"Storgata 73, Tromsø",           loc:"Kontortårn · 11 400 m²",  seg:"Kontor",      value:"285 mnok", yield:"5,9 %" },
  { date:"Nov 25", name:"Bodø Logistikkpark — fase 2",   loc:"Logistikk · 18 200 m²",   seg:"Logistikk",   value:"215 mnok", yield:"6,8 %" },
  { date:"Okt 25", name:"AMFI Alta — anchor",            loc:"Handel · 6 800 m²",        seg:"Handel",      value:"118 mnok", yield:"6,5 %" },
  { date:"Sep 25", name:"Tromsdalen Næringspark",        loc:"Komb. · 9 400 m²",         seg:"Kombinasjon", value:"164 mnok", yield:"6,3 %" },
  { date:"Aug 25", name:"Sjøgata 15, Bodø",              loc:"Kontor · 4 200 m²",        seg:"Kontor",      value:"98 mnok",  yield:"6,1 %" },
  { date:"Jun 25", name:"Mo i Rana Industripark",        loc:"Logistikk · 22 600 m²",    seg:"Logistikk",   value:"245 mnok", yield:"7,2 %" },
]

export const CITIES: MapCity[] = [
  { id:"bodo",    name:"Bodø",       lat:67.28, lon:14.4,  yield:"6,35 %", leie:"2 400 kr/m²", vac:"4,6 %", note:"Hovedkontor for Advanti. Voksende logistikkhubb." },
  { id:"tromso",  name:"Tromsø",     lat:69.65, lon:18.95, yield:"6,10 %", leie:"2 950 kr/m²", vac:"3,4 %", note:"Største kontormarkedet i Nord-Norge." },
  { id:"alta",    name:"Alta",       lat:69.97, lon:23.27, yield:"6,75 %", leie:"1 950 kr/m²", vac:"6,2 %", note:"Sterkt handelsmarked i Finnmark." },
  { id:"mo",      name:"Mo i Rana",  lat:66.32, lon:14.14, yield:"6,80 %", leie:"1 750 kr/m²", vac:"5,4 %", note:"Industri og logistikk. Stor industriutbygging." },
  { id:"narvik",  name:"Narvik",     lat:68.44, lon:17.43, yield:"6,90 %", leie:"1 820 kr/m²", vac:"7,5 %", note:"Transport- og næringspark. Lavere likviditet." },
  { id:"harstad", name:"Harstad",    lat:68.8,  lon:16.55, yield:"6,55 %", leie:"1 875 kr/m²", vac:"5,8 %", note:"Stabilt kontor- og handelsmarked." },
]

export const fmtNoComma = (v: number) => v.toFixed(2).replace(".", ",")
export const fmtPct1    = (v: number) => `${v.toFixed(1).replace(".", ",")} %`
export const fmtNum     = (v: number) => v.toLocaleString("no-NO")

// --- NEW: derived stamp (replaces 5 hardcoded "OPPDATERT 14. JAN 2026" strings) ---
export const OPPDATERT = deriveOppdatert(LATEST_QUARTER)  // → "OPPDATERT 14. JAN 2026"
```

### 3e. Consumer-change list and blast-radius summary

| File | Phase 1 changes | Consumers untouched? |
|------|-----------------|----------------------|
| `src/components/markedsinnsikt/marketData.ts` | Add `deriveOppdatert` function + `OPPDATERT` export; add side-effect `import "./marketDataInvariants"` at top | — (this is the source) |
| `src/components/markedsinnsikt/marketDataInvariants.ts` | **NEW** — ~30 lines, side-effect only, no exports | — (new file) |
| `src/components/markedsinnsikt/MarkedsinnsiktShell.tsx` | Replace 5× `"OPPDATERT 14. JAN 2026"` literals with `{OPPDATERT}` (already imports from marketData) | Existing imports unchanged |
| `MarketDataSummary.tsx` | No changes | Untouched |
| `src/app/presserom/page.tsx` | No changes | Untouched |
| `src/app/markedsrapport/page.tsx` | No changes | Untouched |

**Re-export shim:** Not needed for Option C. `marketData.ts` remains the canonical import path with an identical export surface (only `OPPDATERT` is added). Presserom and markedsrapport are fully untouched in phase 1, satisfying the reviewer decision requirement.

**Total phase 1 diff:** ~35 lines added across 2 files, 5 string replacements in Shell.

---

## Open questions

Questions 1 and 5 from the original STOP condition are now partially answered by the reviewer decision and spike completion. Questions 2–4 remain open for future planning.

1. ~~**Are `presserom/page.tsx` and `markedsrapport/page.tsx` within acceptable scope?**~~ **Answered (reviewer 2026-06-10):** Yes — accepted as wider blast radius; phase 1 keeps them untouched.

2. **Who authors the quarterly market data update?** Developer-only (requires PR) vs. a designated non-developer. For Option C this matters less (TS is developer-only regardless), but the runbook in §3c is required regardless of the answer.

3. **Is per-quarter history needed independently in the product?** If the product will ever need to add Q1 2026 data without redeploying all history, a per-quarter document model becomes relevant. Option C does not preclude that future migration — the invariant checker makes it safer by ensuring the current TS data is clean before any extraction.

4. **Is a CMS ever on the roadmap?** If Sanity or similar is planned, moving from TS to JSON (Option B) is a lower-risk intermediate step than building a content-collections schema that would need to be unwound. Option C leaves this path open.

5. ~~**What is the next update deadline?**~~ **Context (2026-06-10):** Option C can be completed in a single PR in ~2 hours, making it viable immediately ahead of any Q1 2026 data update.

---

## Step 4: Go/no-go

### Effort estimates

| Option | Effort | Key work |
|--------|--------|----------|
| **C — TS + guardrails (recommended)** | **S (~2 h)** | New `marketDataInvariants.ts` (~30 lines); `OPPDATERT` export in `marketData.ts`; 5 string replacements in Shell; runbook doc |
| B — Typed JSON + zod | M (~1 day) | New zod schema; convert TS data to JSON; thin re-export shim; tests; doc |
| A — Content collection | L (2–3 days) | New collection definition; convert data to per-doc YAML; reshape Shell positional indexing; re-export shims; tests; doc |

### Stale `OPPDATERT` stamps — quick win independent of storage choice

As documented in the inventory, the 5 hardcoded `"OPPDATERT 14. JAN 2026"` strings in `MarkedsinnsiktShell.tsx` can be replaced with a single `OPPDATERT` import **regardless of which migration option is chosen**. This closes TODOS.md TODO 7. It should ship as a standalone PR immediately — it does not require the guardrail module or any decision on storage format.

### Go/no-go recommendation

**GO on Option C (TS + guardrails) — S effort, zero risk.**

The spike confirms no structural migration is needed to achieve the desired reliability improvements. Both observed failure modes (stale date stamps, silent array-length drift) are fixable in-place with ~35 lines of code. Options A and B introduce migration cost, new failure modes (YAML/JSON ergonomics, unused MDX bodies, Shell restructuring), and identical deployment requirements — without delivering any reduction in authoring friction, since all quarterly update paths remain developer-gated regardless of storage format. Option C is the minimum viable improvement: ship it, fix the stamps, write the runbook, and revisit JSON or CMS migration only if a CMS is confirmed on the roadmap.
