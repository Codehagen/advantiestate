// Shared market dataset for /markedsinnsikt.
//
// Single source of truth so the interactive (client) charts in
// MarkedsinnsiktShell and the server-rendered MarketDataSummary tables cannot
// drift apart. Pure data + formatters — no "use client", importable from both
// server and client components. Ported verbatim from markedsinnsikt.js.
import type { MapCity } from "./types"
import { LATEST_RELEASE } from "./marketReleases"

/** Current quarter label — derived from the versioned release register. */
export const LATEST_QUARTER = LATEST_RELEASE.quarter

export const QUARTERS = [
  "Q1 21", "Q2 21", "Q3 21", "Q4 21",
  "Q1 22", "Q2 22", "Q3 22", "Q4 22",
  "Q1 23", "Q2 23", "Q3 23", "Q4 23",
  "Q1 24", "Q2 24", "Q3 24", "Q4 24",
  "Q1 25", "Q2 25", "Q3 25", "Q4 25",
]

export const RATES = {
  swap5y: [1.2, 1.45, 1.65, 1.95, 2.3, 2.85, 3.4, 3.85, 4.1, 4.25, 4.3, 4.35, 4.2, 4.05, 3.95, 3.9, 3.85, 3.8, 3.85, 3.82],
  // 10-års statsobligasjon — kalibrert mot Norges Bank GOVT_GENERIC_RATES
  // (2025-snitt 3,99 %; Q4 2025-endepunkt forankret der). Var tidligere ~0,4 pp lavt.
  gov10y: [0.95, 1.2, 1.4, 1.65, 1.95, 2.4, 2.95, 3.3, 3.55, 3.65, 3.7, 3.75, 3.85, 3.75, 3.65, 3.7, 3.8, 3.9, 3.95, 3.99],
}

export type Segment = "kontor" | "handel" | "logistikk"

export const YIELD: Record<Segment, number[]> = {
  kontor: [4.2, 4.2, 4.25, 4.3, 4.4, 4.55, 4.85, 5.2, 5.6, 5.85, 6.0, 6.15, 6.2, 6.2, 6.15, 6.1, 6.05, 6.0, 6.05, 6.1],
  handel: [4.6, 4.6, 4.65, 4.7, 4.8, 4.95, 5.25, 5.55, 5.95, 6.2, 6.4, 6.55, 6.65, 6.65, 6.6, 6.55, 6.5, 6.45, 6.5, 6.55],
  logistikk: [5.1, 5.1, 5.1, 5.15, 5.25, 5.4, 5.65, 5.95, 6.3, 6.55, 6.7, 6.85, 6.95, 6.95, 6.9, 6.85, 6.85, 6.8, 6.85, 6.85],
}

export const LEIE: Record<Segment, Record<string, number[]>> = {
  kontor: {
    Bodø: [2565, 2590, 2615, 2650, 2690, 2725, 2775, 2825, 2865, 2890, 2915, 2925, 2945, 2965, 2975, 2985, 2990, 2995, 3000, 3002],
    Tromsø: [2595, 2615, 2645, 2685, 2730, 2770, 2830, 2880, 2910, 2930, 2950, 2960, 2980, 2990, 2995, 3000, 3000, 3005, 3005, 3003],
    Harstad: [2245, 2275, 2290, 2315, 2345, 2370, 2415, 2455, 2480, 2510, 2525, 2540, 2560, 2570, 2580, 2585, 2595, 2595, 2600, 2600],
  },
  handel: {
    Bodø: [2750, 2770, 2790, 2820, 2850, 2880, 2920, 2960, 2990, 3020, 3040, 3060, 3080, 3095, 3105, 3115, 3120, 3125, 3130, 3135],
    Tromsø: [3200, 3220, 3250, 3280, 3320, 3360, 3400, 3440, 3470, 3500, 3520, 3540, 3560, 3580, 3600, 3610, 3620, 3625, 3630, 3635],
    Harstad: [2490, 2505, 2515, 2540, 2565, 2585, 2620, 2660, 2680, 2705, 2715, 2730, 2745, 2760, 2770, 2775, 2780, 2790, 2795, 2800],
  },
  logistikk: {
    Bodø: [1200, 1205, 1215, 1225, 1240, 1255, 1275, 1295, 1310, 1325, 1335, 1345, 1360, 1370, 1380, 1385, 1390, 1395, 1400, 1405],
    Tromsø: [1450, 1455, 1465, 1475, 1490, 1505, 1525, 1545, 1560, 1575, 1585, 1595, 1610, 1620, 1630, 1635, 1640, 1645, 1650, 1655],
    "Mo i Rana": [1245, 1250, 1255, 1265, 1285, 1305, 1320, 1340, 1350, 1360, 1375, 1385, 1400, 1410, 1415, 1420, 1425, 1435, 1440, 1445],
  },
}

export const VOLUME = {
  years: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
  total: [1.8, 2.4, 2.1, 3.6, 4.5, 3.2, 4.1, 4.8],
}

export const VACANCY = [
  { city: "Bodø", kontor: 4.6, handel: 3.1, logistikk: 2.4 },
  { city: "Tromsø", kontor: 3.4, handel: 2.8, logistikk: 1.9 },
  { city: "Alta", kontor: 6.2, handel: 4.4, logistikk: 3.8 },
  { city: "Harstad", kontor: 5.8, handel: 3.9, logistikk: 3.2 },
  { city: "Narvik", kontor: 7.5, handel: 5.1, logistikk: 4.2 },
  { city: "Mo i Rana", kontor: 5.4, handel: 4.0, logistikk: 2.8 },
]

// ---------------------------------------------------------------------------
// TOTAL næringsledighet — MÅLT, halvårlig (Advanti markedstelling)
// ---------------------------------------------------------------------------
// Real measured total commercial vacancy (all segments combined) by city,
// half-yearly 2020 1H–2025 2H. Percent = ledig kvm / kartlagt areal (current
// stock). Source: Advanti markedstelling (ledig kvm per halvår) + arealregister.
// Endpoints match the current snapshot. Only Bodø, Tromsø sentrum and Harstad
// have a measured series; the smaller cities have no total-trend data yet.
// NOTE: this is TOTAL (all segments), distinct from the per-segment VACANCY
// snapshot above — do not conflate the two.
export const VACANCY_TOTAL_PERIODS = [
  "2020 1H", "2020 2H", "2021 1H", "2021 2H", "2022 1H", "2022 2H",
  "2023 1H", "2023 2H", "2024 1H", "2024 2H", "2025 1H", "2025 2H",
]
export const VACANCY_TOTAL: Record<string, number[]> = {
  Bodø: [2.5, 4.8, 4.9, 4.7, 2.2, 2.8, 4.0, 4.4, 4.9, 3.1, 5.0, 5.7],
  "Tromsø sentrum": [7.4, 6.5, 6.2, 5.6, 4.0, 2.9, 1.7, 2.7, 4.7, 5.2, 5.9, 5.5],
  Harstad: [2.4, 2.8, 3.0, 3.2, 1.2, 1.8, 2.9, 4.6, 4.2, 4.7, 4.6, 3.0],
}

// Transactions are shown ANONYMIZED (type + area, no addresses/names): the
// rows are illustrative market examples, and naming identifiable properties
// with prices/yields would attribute deal terms to real parties.
export const TX = [
  { date: "Des 25", name: "Kontoreiendom, Tromsø sentrum", loc: "Kontortårn · 11 400 m²", seg: "Kontor", city: "Tromsø", value: "285 mnok", yield: "5,9 %" },
  { date: "Nov 25", name: "Logistikkanlegg, Bodø", loc: "Logistikk · 18 200 m²", seg: "Logistikk", city: "Bodø", value: "215 mnok", yield: "6,8 %" },
  { date: "Okt 25", name: "Handelsseksjon, Alta", loc: "Handel · 6 800 m²", seg: "Handel", city: "Alta", value: "118 mnok", yield: "6,5 %" },
  { date: "Sep 25", name: "Kombinasjonsbygg, Tromsdalen", loc: "Komb. · 9 400 m²", seg: "Kombinasjon", city: "Tromsø", value: "164 mnok", yield: "6,3 %" },
  { date: "Aug 25", name: "Kontoreiendom, Bodø sentrum", loc: "Kontor · 4 200 m²", seg: "Kontor", city: "Bodø", value: "98 mnok", yield: "6,1 %" },
  { date: "Jun 25", name: "Industri og logistikk, Mo i Rana", loc: "Logistikk · 22 600 m²", seg: "Logistikk", city: "Mo i Rana", value: "245 mnok", yield: "7,2 %" },
]

// ---------------------------------------------------------------------------
// Formatters (used both here and by csv.ts / OG routes)
// ---------------------------------------------------------------------------

export const fmtNoComma = (v: number) => v.toFixed(2).replace(".", ",")
export const fmtPct1 = (v: number) => `${v.toFixed(1).replace(".", ",")} %`
export const fmtNum = (v: number) => v.toLocaleString("no-NO")
/** Prime yield display string, e.g. "6,35 %" (two decimal places). */
export const fmtYieldPct = (v: number) => `${fmtNoComma(v)} %`
/** Market rent display string, e.g. "2 400 kr/m²" (regular-space thousands). */
export const fmtLeieKrM2 = (v: number) =>
  `${v.toLocaleString("no-NO").replace(/ /g, " ")} kr/m²`

// ---------------------------------------------------------------------------
// CITIES — derived from the versioned release register
// ---------------------------------------------------------------------------

/** City market data for the latest release, with display strings. */
export const CITIES: MapCity[] = LATEST_RELEASE.cities.map((c) => ({
  id: c.id,
  name: c.name,
  lat: c.lat,
  lon: c.lon,
  yield: fmtYieldPct(c.yieldPct),
  leie: fmtLeieKrM2(c.leieKrM2),
  vac: fmtPct1(c.vacPct),
  note: c.note,
}))
