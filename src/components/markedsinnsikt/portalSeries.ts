// Portal dataset for /analyseportal — forecast, hotell, nybygg, makro and
// per-segment volume series layered ON TOP of the canonical market data.
//
// ── Canonical-series rule ───────────────────────────────────────────────────
// Historical series in marketData.ts / marketReleases.ts are the published
// source of truth and ALWAYS win. This module only adds NEW dimensions:
//   · hotell (yield + volume + nybygg)
//   · per-segment transaction volume (must sum to VOLUME.total — asserted)
//   · the three LEIE cities each segment is missing (endpoint-anchored to
//     LATEST_RELEASE city values where a release anchor exists)
//   · quarterly vacancy trends (endpoint-anchored to VACANCY snapshot)
//   · styringsrente history, makro indicators, deal counts
//   · forecast tails (join from the last canonical point in mergeForecast)
// KPI deltas and insight copy are DERIVED from canonical series at build —
// never hardcoded display strings.
//
// ── Quarterly refresh runbook ───────────────────────────────────────────────
// When a new quarter is released ("Neste oppdatering" on /markedsinnsikt):
//   1. Add the release to marketReleases.ts (numeric city values, publishedAt).
//   2. Append one value to each historical series in marketData.ts + the added
//      series below (LEIE_EXTRA, VACANCY_TREND, STYRINGSRENTE) and push the new
//      quarter label onto QUARTERS.
//   3. Re-point the forecast tails (drop the quarter that just became history,
//      extend one further out) and set NEXT_RELEASE_DATE.
//   4. `pnpm test:unit` — the data-integrity asserts in
//      tests/unit/analyseportal verify lengths, endpoints and volume sums.
// All stamps, "neste oppdatering" lines and forecast boundaries on the portal
// derive from this module — no copy edits needed elsewhere.

import {
  QUARTERS,
  RATES,
  YIELD,
  LEIE,
  VACANCY,
  VOLUME,
  type Segment,
} from "./marketData"
import { LATEST_RELEASE } from "./marketReleases"

/** Portal supports hotell on yield/volume/nybygg. Leie & ledighet stay 3-segment. */
export type PortalSegment = Segment | "hotell"

export const PORTAL_SEGMENTS: { key: PortalSegment; label: string }[] = [
  { key: "kontor", label: "Kontor" },
  { key: "handel", label: "Handel" },
  { key: "logistikk", label: "Logistikk" },
  { key: "hotell", label: "Hotell" },
]
export const SEGMENTS3: { key: Segment; label: string }[] = PORTAL_SEGMENTS.filter(
  (s): s is { key: Segment; label: string } => s.key !== "hotell",
)

export const PORTAL_CITIES = [
  "Tromsø",
  "Bodø",
  "Harstad",
  "Alta",
  "Narvik",
  "Mo i Rana",
] as const
export type PortalCity = (typeof PORTAL_CITIES)[number]

// ── time axes ───────────────────────────────────────────────────────────────
export { QUARTERS }
export const QUARTERS_F = ["Q1 26", "Q2 26", "Q3 26", "Q4 26"]
export const YEARS = VOLUME.years
export const YEARS_F = ["2026", "2027"]

/** Latest published quarter (registry-derived) and the public next-release promise. */
export const PORTAL_LATEST = LATEST_RELEASE
export const NEXT_RELEASE_DATE = "15. juli 2026"

// ── deterministic Norwegian formatters ──────────────────────────────────────
// Manual grouping with a literal NBSP (U+00A0): toLocaleString varies between
// Node and browser ICU builds, which is a hydration mismatch on SSR'd markup.
const NBSP = " "
export const fmtGroup = (v: number): string => {
  const sign = v < 0 ? "−" : ""
  const digits = Math.round(Math.abs(v)).toString()
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
}
export const fmtComma = (v: number, decimals = 1): string =>
  v.toFixed(decimals).replace(".", ",")
export const fmtPct2p = (v: number): string => `${fmtComma(v, 2)}${NBSP}%`
export const fmtPct1p = (v: number): string => `${fmtComma(v, 1)}${NBSP}%`
export const fmtKr = (v: number): string => fmtGroup(v)
export const fmtKrM2 = (v: number): string => `${fmtGroup(v)}${NBSP}kr/m²`
export const fmtMrd = (v: number): string => `${fmtComma(v, 1)}${NBSP}mrd`
export const fmtM2k = (v: number): string => `${fmtGroup(v)}’${NBSP}m²`

// ── chart palette (from the design handoff, scoped to the portal) ───────────
export const PORTAL_PALETTE = {
  ink: "#2c2825",
  blue: "#3d7a8c",
  terra: "#c0795c",
  gold: "#ab934f",
  sage: "#6f8a7e",
  mist: "#9aa7ad",
  faint: "#cbeef2",
  grid: "#e2ddd6",
} as const

export const SEG_COLOR: Record<PortalSegment, string> = {
  kontor: PORTAL_PALETTE.ink,
  handel: PORTAL_PALETTE.terra,
  logistikk: PORTAL_PALETTE.blue,
  hotell: PORTAL_PALETTE.gold,
}
export const CITY_COLOR: Record<PortalCity, string> = {
  Tromsø: PORTAL_PALETTE.ink,
  Bodø: PORTAL_PALETTE.blue,
  Harstad: PORTAL_PALETTE.terra,
  Alta: PORTAL_PALETTE.gold,
  Narvik: PORTAL_PALETTE.sage,
  "Mo i Rana": PORTAL_PALETTE.mist,
}

// ── helpers ─────────────────────────────────────────────────────────────────
const round5 = (v: number) => Math.round(v / 5) * 5
export const lastOf = (a: readonly number[]) => a[a.length - 1]

// ════════════════════════════════════════════════════════════════════════════
// YIELD — canonical 3 segments re-exported + hotell added; forecast tails
// ════════════════════════════════════════════════════════════════════════════
export const PORTAL_YIELD: Record<PortalSegment, number[]> = {
  ...YIELD,
  hotell: [4.8, 4.8, 4.85, 4.9, 5.0, 5.2, 5.55, 5.95, 6.4, 6.7, 6.9, 7.05, 7.18, 7.2, 7.18, 7.15, 7.1, 7.06, 7.02, 7.0],
}
/** Advantis basisscenario — joins from the last canonical point in mergeForecast. */
export const PORTAL_YIELD_F: Record<PortalSegment, number[]> = {
  kontor: [6.05, 6.0, 5.95, 5.9],
  handel: [6.5, 6.45, 6.4, 6.4],
  logistikk: [6.8, 6.7, 6.6, 6.55],
  hotell: [6.95, 6.9, 6.85, 6.85],
}

export const PORTAL_RATES = {
  ...RATES,
  styringsrente: [0.0, 0.0, 0.0, 0.25, 0.75, 1.25, 1.75, 2.75, 3.0, 3.25, 3.75, 4.0, 4.25, 4.5, 4.5, 4.5, 4.5, 4.5, 4.25, 4.0],
}
export const PORTAL_RATES_F = {
  swap5y: [3.75, 3.65, 3.55, 3.5],
  gov10y: [3.5, 3.45, 3.4, 3.4],
  styringsrente: [3.75, 3.5, 3.25, 3.0],
}

// ════════════════════════════════════════════════════════════════════════════
// LEIE — canonical cities win; missing cities generated with the same
// smooth-multiplier method the canonical series used, endpoint-anchored to
// LATEST_RELEASE (kontor) so the snapshot and the series can never disagree.
// ════════════════════════════════════════════════════════════════════════════
const RENT_MUL = [1.0, 1.008, 1.018, 1.03, 1.044, 1.058, 1.078, 1.1, 1.118, 1.132, 1.144, 1.15, 1.158, 1.164, 1.168, 1.171, 1.173, 1.176, 1.178, 1.18]
const RENT_MUL_F = [1.182, 1.185, 1.188, 1.19]
const FINAL_MUL = RENT_MUL[RENT_MUL.length - 1]

const genRent = (endpoint: number) =>
  RENT_MUL.map((m) => round5((endpoint / FINAL_MUL) * m))
const genRentF = (endpoint: number) =>
  RENT_MUL_F.map((m) => round5((endpoint / FINAL_MUL) * m))

// Endpoints: kontor from the release registry; handel/logistikk have no
// release anchor — design-handoff levels (same generation method).
const LEIE_ENDPOINTS: Record<Segment, Record<string, number>> = {
  kontor: { Alta: 1950, Narvik: 1820, "Mo i Rana": 1750 },
  handel: { Alta: 2480, Narvik: 2185, "Mo i Rana": 2030 },
  logistikk: { Harstad: 1275, Alta: 1250, Narvik: 1300 },
}

export const PORTAL_LEIE: Record<Segment, Record<string, number[]>> = {
  kontor: { ...LEIE.kontor },
  handel: { ...LEIE.handel },
  logistikk: { ...LEIE.logistikk },
}
export const PORTAL_LEIE_F: Record<Segment, Record<string, number[]>> = {
  kontor: {},
  handel: {},
  logistikk: {},
}
for (const seg of ["kontor", "handel", "logistikk"] as Segment[]) {
  for (const city of PORTAL_CITIES) {
    if (!PORTAL_LEIE[seg][city]) {
      const end = LEIE_ENDPOINTS[seg][city]
      PORTAL_LEIE[seg][city] = genRent(end)
    }
    PORTAL_LEIE_F[seg][city] = genRentF(lastOf(PORTAL_LEIE[seg][city]))
  }
}

// ════════════════════════════════════════════════════════════════════════════
// TRANSAKSJONER — per-segment split of the canonical annual totals.
// Asserted: per-year segment sum === VOLUME.total (the published series).
// ════════════════════════════════════════════════════════════════════════════
export const PORTAL_VOLUME: Record<PortalSegment, number[]> = {
  kontor: [0.8, 1.0, 0.9, 1.7, 2.0, 1.4, 1.8, 2.1],
  handel: [0.5, 0.7, 0.5, 0.9, 1.1, 0.7, 1.0, 1.2],
  logistikk: [0.3, 0.4, 0.4, 0.6, 0.8, 0.6, 0.8, 1.0],
  hotell: [0.2, 0.3, 0.3, 0.4, 0.6, 0.5, 0.5, 0.5],
}
export const PORTAL_VOLUME_F: Record<PortalSegment, number[]> = {
  kontor: [2.3, 2.5],
  handel: [1.3, 1.4],
  logistikk: [1.1, 1.2],
  hotell: [0.6, 0.7],
}
export const DEALCOUNT = [18, 24, 21, 33, 41, 29, 38, 47]
export const DEALCOUNT_F = [52, 57]

// ════════════════════════════════════════════════════════════════════════════
// AREALLEDIGHET — quarterly trend, endpoint-anchored to the canonical
// VACANCY snapshot (marketData.ts) so the trend's last point === snapshot.
// ════════════════════════════════════════════════════════════════════════════
const VAC_FACTOR = [1.45, 1.42, 1.4, 1.38, 1.36, 1.33, 1.3, 1.26, 1.22, 1.18, 1.15, 1.12, 1.09, 1.07, 1.05, 1.03, 1.02, 1.01, 1.0, 1.0]
const VAC_FACTOR_F = [0.99, 0.98, 0.98, 0.97]

export const VAC_NOW: Record<Segment, Record<string, number>> = {
  kontor: {},
  handel: {},
  logistikk: {},
}
for (const row of VACANCY) {
  VAC_NOW.kontor[row.city] = row.kontor
  VAC_NOW.handel[row.city] = row.handel
  VAC_NOW.logistikk[row.city] = row.logistikk
}

const genVac = (now: number, factors: number[]) =>
  factors.map((f) => Math.round(now * f * 10) / 10)

export const VACANCY_TREND: Record<Segment, Record<string, number[]>> = {
  kontor: {},
  handel: {},
  logistikk: {},
}
export const VACANCY_TREND_F: Record<Segment, Record<string, number[]>> = {
  kontor: {},
  handel: {},
  logistikk: {},
}
for (const seg of ["kontor", "handel", "logistikk"] as Segment[]) {
  for (const city of PORTAL_CITIES) {
    VACANCY_TREND[seg][city] = genVac(VAC_NOW[seg][city], VAC_FACTOR)
    VACANCY_TREND_F[seg][city] = genVac(VAC_NOW[seg][city], VAC_FACTOR_F)
  }
}

// ════════════════════════════════════════════════════════════════════════════
// NYBYGG — completed / pipeline floor area ('000 m² BTA) per year by segment.
// ════════════════════════════════════════════════════════════════════════════
export const NYBYGG: Record<PortalSegment, number[]> = {
  kontor: [42, 55, 38, 61, 48, 35, 52, 44],
  handel: [28, 22, 30, 18, 25, 20, 16, 22],
  logistikk: [35, 48, 52, 60, 72, 58, 65, 80],
  hotell: [12, 8, 15, 6, 18, 10, 14, 9],
}
export const NYBYGG_F: Record<PortalSegment, number[]> = {
  kontor: [58, 40],
  handel: [26, 18],
  logistikk: [95, 70],
  hotell: [20, 12],
}

// ════════════════════════════════════════════════════════════════════════════
// MAKRO — annual indicators (SSB / Norges Bank), 2026–27 = Advantis prognose.
// ════════════════════════════════════════════════════════════════════════════
export const MAKRO = {
  bnp: [2.2, 2.3, -1.3, 4.2, 3.8, 1.1, 0.9, 1.6],
  sysselsetting: [1.1, 0.9, -0.6, 1.8, 2.4, 1.3, 0.7, 1.0],
  styringsrente: [0.75, 1.5, 0.0, 0.5, 2.75, 4.5, 4.5, 4.0],
  kpi: [2.7, 2.2, 1.3, 3.5, 5.8, 5.5, 3.1, 2.6],
  befolkning: [0.1, 0.0, -0.1, 0.2, 0.4, 0.5, 0.3, 0.4],
}
export const MAKRO_F = {
  bnp: [1.9, 2.1],
  sysselsetting: [1.2, 1.4],
  styringsrente: [3.0, 2.75],
  kpi: [2.3, 2.1],
  befolkning: [0.4, 0.5],
}

// ── city meta for the snapshot rail — registry-derived ──────────────────────
export const CITY_META = LATEST_RELEASE.cities.map((c) => ({
  name: c.name,
  note: c.note,
  yieldPct: c.yieldPct,
  leieKrM2: c.leieKrM2,
  vacPct: c.vacPct,
}))

// ════════════════════════════════════════════════════════════════════════════
// KPI derivation — every delta computed from canonical series, never typed in.
// ════════════════════════════════════════════════════════════════════════════
export type Dir = "up" | "down" | "flat"
export interface PortalKpi {
  label: string
  value: string
  unit: string
  delta: string
  dir: Dir
  sub: string
}

/** Basis-point change over `back` periods (positive = rose). */
export const bpsChange = (arr: readonly number[], back: number): number =>
  Math.round((lastOf(arr) - arr[arr.length - 1 - back]) * 100)
/** Percent growth over `back` periods. */
export const pctGrowth = (arr: readonly number[], back: number): number =>
  ((lastOf(arr) - arr[arr.length - 1 - back]) / arr[arr.length - 1 - back]) * 100

const dirOf = (n: number): Dir => (n === 0 ? "flat" : n > 0 ? "up" : "down")
const signed = (n: number, unit: string): string => {
  if (n === 0) return "uendret"
  const mag = Math.abs(n)
  const txt = Number.isInteger(mag) ? fmtGroup(mag) : fmtComma(mag, 1)
  return `${n > 0 ? "+" : "−"}${txt}${NBSP}${unit}`
}

const yieldBps12 = bpsChange(PORTAL_YIELD.kontor, 4)
const swapBpsQ = bpsChange(PORTAL_RATES.swap5y, 1)
const volYoY = Math.round(pctGrowth(VOLUME.total, 1))
const vacTromso = VACANCY_TREND.kontor["Tromsø"]
const vacPpYoY = Math.round((lastOf(vacTromso) - vacTromso[vacTromso.length - 5]) * 10) / 10
const leieTromso = PORTAL_LEIE.kontor["Tromsø"]
const leieYoY = Math.round(pctGrowth(leieTromso, 4) * 10) / 10
const pipe26 = PORTAL_SEGMENTS.reduce((a, s) => a + NYBYGG_F[s.key][0], 0)
const done25 = PORTAL_SEGMENTS.reduce((a, s) => a + lastOf(NYBYGG[s.key]), 0)
const pipeVsDone = Math.round(((pipe26 - done25) / done25) * 100)

export const PORTAL_KPIS: PortalKpi[] = [
  {
    label: "Prime yield kontor",
    value: fmtComma(lastOf(PORTAL_YIELD.kontor), 2),
    unit: "%",
    delta: signed(yieldBps12, "bps"),
    dir: dirOf(yieldBps12),
    sub: `siste 12${NBSP}mnd · Tromsø`,
  },
  {
    label: "5 års SWAP (NOK)",
    value: fmtComma(lastOf(PORTAL_RATES.swap5y), 2),
    unit: "%",
    delta: signed(swapBpsQ, "bps"),
    dir: dirOf(swapBpsQ),
    sub: "siste kvartal",
  },
  {
    // Soft hyphen so the long word can break inside narrow KPI grid cells.
    label: `Transaksjons­volum ${lastOf(VOLUME.years.map(Number))}`,
    value: fmtComma(lastOf(VOLUME.total), 1),
    unit: "mrd",
    delta: signed(volYoY, "%"),
    dir: dirOf(volYoY),
    sub: `mot ${VOLUME.years[VOLUME.years.length - 2]}`,
  },
  {
    label: "Kontorledighet Tromsø",
    value: fmtComma(lastOf(vacTromso), 1),
    unit: "%",
    delta: signed(vacPpYoY, "pp"),
    dir: dirOf(vacPpYoY),
    sub: "YoY · stramt marked",
  },
  {
    label: "Prime leie Tromsø",
    value: fmtGroup(lastOf(leieTromso)),
    unit: "kr/m²",
    delta: signed(leieYoY, "%"),
    dir: dirOf(leieYoY),
    sub: "kontor · YoY",
  },
  {
    label: `Nybygg pipeline ${YEARS_F[0]}`,
    value: fmtGroup(pipe26),
    unit: "’000 m²",
    delta: signed(pipeVsDone, "%"),
    dir: dirOf(pipeVsDone),
    sub: "alle segmenter",
  },
]

/** The four KPIs the markedsinnsikt band shows (same derivation, no drift). */
export const MI_KPIS = PORTAL_KPIS.slice(0, 4)

// ── dev-time data integrity (throws at module init in dev/test builds) ──────
function assertIntegrity() {
  const lens = (rec: Record<string, number[]>, n: number, name: string) => {
    for (const [k, arr] of Object.entries(rec)) {
      if (arr.length !== n) throw new Error(`portalSeries: ${name}.${k} has ${arr.length} points, expected ${n}`)
    }
  }
  lens(PORTAL_YIELD, QUARTERS.length, "PORTAL_YIELD")
  lens(PORTAL_YIELD_F, QUARTERS_F.length, "PORTAL_YIELD_F")
  lens(PORTAL_RATES, QUARTERS.length, "PORTAL_RATES")
  lens(PORTAL_RATES_F, QUARTERS_F.length, "PORTAL_RATES_F")
  lens(PORTAL_VOLUME, YEARS.length, "PORTAL_VOLUME")
  lens(PORTAL_VOLUME_F, YEARS_F.length, "PORTAL_VOLUME_F")
  lens(NYBYGG, YEARS.length, "NYBYGG")
  lens(NYBYGG_F, YEARS_F.length, "NYBYGG_F")
  for (const seg of ["kontor", "handel", "logistikk"] as Segment[]) {
    lens(PORTAL_LEIE[seg], QUARTERS.length, `PORTAL_LEIE.${seg}`)
    lens(PORTAL_LEIE_F[seg], QUARTERS_F.length, `PORTAL_LEIE_F.${seg}`)
    lens(VACANCY_TREND[seg], QUARTERS.length, `VACANCY_TREND.${seg}`)
  }
  // Per-year segment volumes must sum to the published total (±0.05 rounding).
  VOLUME.total.forEach((total, i) => {
    const sum = PORTAL_SEGMENTS.reduce((a, s) => a + PORTAL_VOLUME[s.key][i], 0)
    if (Math.abs(sum - total) > 0.05)
      throw new Error(`portalSeries: VOLUME ${VOLUME.years[i]} segments sum ${sum} != published total ${total}`)
  })
  // Series endpoints must match the release snapshot where an anchor exists.
  for (const c of LATEST_RELEASE.cities) {
    const series = PORTAL_LEIE.kontor[c.name]
    if (series && lastOf(series) !== c.leieKrM2)
      throw new Error(`portalSeries: LEIE kontor ${c.name} endpoint ${lastOf(series)} != release ${c.leieKrM2}`)
    const vac = VACANCY_TREND.kontor[c.name]
    if (vac && lastOf(vac) !== c.vacPct)
      throw new Error(`portalSeries: VACANCY kontor ${c.name} endpoint ${lastOf(vac)} != release ${c.vacPct}`)
  }
}
if (process.env.NODE_ENV !== "production") assertIntegrity()
