// Shared market dataset for /markedsinnsikt.
//
// Single source of truth so the interactive (client) charts in
// MarkedsinnsiktShell and the server-rendered MarketDataSummary tables cannot
// drift apart. Pure data + formatters — no "use client", importable from both
// server and client components. Ported verbatim from markedsinnsikt.js.
import type { MapCity } from "./types"

export const LATEST_QUARTER = "Q4 2025"

export const QUARTERS = [
  "Q1 21", "Q2 21", "Q3 21", "Q4 21",
  "Q1 22", "Q2 22", "Q3 22", "Q4 22",
  "Q1 23", "Q2 23", "Q3 23", "Q4 23",
  "Q1 24", "Q2 24", "Q3 24", "Q4 24",
  "Q1 25", "Q2 25", "Q3 25", "Q4 25",
]

export const RATES = {
  swap5y: [1.2, 1.45, 1.65, 1.95, 2.3, 2.85, 3.4, 3.85, 4.1, 4.25, 4.3, 4.35, 4.2, 4.05, 3.95, 3.9, 3.85, 3.8, 3.85, 3.82],
  gov10y: [0.95, 1.2, 1.4, 1.65, 1.95, 2.4, 2.95, 3.3, 3.55, 3.65, 3.7, 3.75, 3.6, 3.5, 3.4, 3.45, 3.45, 3.5, 3.55, 3.55],
}

export type Segment = "kontor" | "handel" | "logistikk"

export const YIELD: Record<Segment, number[]> = {
  kontor: [4.2, 4.2, 4.25, 4.3, 4.4, 4.55, 4.85, 5.2, 5.6, 5.85, 6.0, 6.15, 6.2, 6.2, 6.15, 6.1, 6.05, 6.0, 6.05, 6.1],
  handel: [4.6, 4.6, 4.65, 4.7, 4.8, 4.95, 5.25, 5.55, 5.95, 6.2, 6.4, 6.55, 6.65, 6.65, 6.6, 6.55, 6.5, 6.45, 6.5, 6.55],
  logistikk: [5.1, 5.1, 5.1, 5.15, 5.25, 5.4, 5.65, 5.95, 6.3, 6.55, 6.7, 6.85, 6.95, 6.95, 6.9, 6.85, 6.85, 6.8, 6.85, 6.85],
}

export const LEIE: Record<Segment, Record<string, number[]>> = {
  kontor: {
    Bodø: [2050, 2070, 2090, 2120, 2150, 2180, 2220, 2260, 2290, 2310, 2330, 2340, 2355, 2370, 2380, 2385, 2390, 2395, 2400, 2400],
    Tromsø: [2550, 2570, 2600, 2640, 2680, 2720, 2780, 2830, 2860, 2880, 2900, 2910, 2925, 2935, 2940, 2945, 2945, 2950, 2950, 2950],
    Harstad: [1620, 1640, 1650, 1670, 1690, 1710, 1740, 1770, 1790, 1810, 1820, 1830, 1845, 1855, 1860, 1865, 1870, 1870, 1875, 1875],
  },
  handel: {
    Bodø: [2750, 2770, 2790, 2820, 2850, 2880, 2920, 2960, 2990, 3020, 3040, 3060, 3080, 3095, 3105, 3115, 3120, 3125, 3130, 3135],
    Tromsø: [3200, 3220, 3250, 3280, 3320, 3360, 3400, 3440, 3470, 3500, 3520, 3540, 3560, 3580, 3600, 3610, 3620, 3625, 3630, 3635],
    Harstad: [2100, 2110, 2120, 2140, 2160, 2180, 2210, 2240, 2260, 2280, 2290, 2300, 2315, 2325, 2335, 2340, 2345, 2350, 2355, 2360],
  },
  logistikk: {
    Bodø: [1200, 1205, 1215, 1225, 1240, 1255, 1275, 1295, 1310, 1325, 1335, 1345, 1360, 1370, 1380, 1385, 1390, 1395, 1400, 1405],
    Tromsø: [1450, 1455, 1465, 1475, 1490, 1505, 1525, 1545, 1560, 1575, 1585, 1595, 1610, 1620, 1630, 1635, 1640, 1645, 1650, 1655],
    "Mo i Rana": [1050, 1055, 1060, 1070, 1085, 1100, 1115, 1130, 1140, 1150, 1160, 1170, 1180, 1190, 1195, 1200, 1205, 1210, 1215, 1220],
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

export const TX = [
  { date: "Des 25", name: "Storgata 73, Tromsø", loc: "Kontortårn · 11 400 m²", seg: "Kontor", value: "285 mnok", yield: "5,9 %" },
  { date: "Nov 25", name: "Bodø Logistikkpark — fase 2", loc: "Logistikk · 18 200 m²", seg: "Logistikk", value: "215 mnok", yield: "6,8 %" },
  { date: "Okt 25", name: "AMFI Alta — anchor", loc: "Handel · 6 800 m²", seg: "Handel", value: "118 mnok", yield: "6,5 %" },
  { date: "Sep 25", name: "Tromsdalen Næringspark", loc: "Komb. · 9 400 m²", seg: "Kombinasjon", value: "164 mnok", yield: "6,3 %" },
  { date: "Aug 25", name: "Sjøgata 15, Bodø", loc: "Kontor · 4 200 m²", seg: "Kontor", value: "98 mnok", yield: "6,1 %" },
  { date: "Jun 25", name: "Mo i Rana Industripark", loc: "Logistikk · 22 600 m²", seg: "Logistikk", value: "245 mnok", yield: "7,2 %" },
]

export const CITIES: MapCity[] = [
  { id: "bodo", name: "Bodø", lat: 67.28, lon: 14.4, yield: "6,35 %", leie: "2 400 kr/m²", vac: "4,6 %", note: "Hovedkontor for Advanti. Voksende logistikkhubb." },
  { id: "tromso", name: "Tromsø", lat: 69.65, lon: 18.95, yield: "6,10 %", leie: "2 950 kr/m²", vac: "3,4 %", note: "Største kontormarkedet i Nord-Norge." },
  { id: "alta", name: "Alta", lat: 69.97, lon: 23.27, yield: "6,75 %", leie: "1 950 kr/m²", vac: "6,2 %", note: "Sterkt handelsmarked i Finnmark." },
  { id: "mo", name: "Mo i Rana", lat: 66.32, lon: 14.14, yield: "6,80 %", leie: "1 750 kr/m²", vac: "5,4 %", note: "Industri og logistikk. Stor industriutbygging." },
  { id: "narvik", name: "Narvik", lat: 68.44, lon: 17.43, yield: "6,90 %", leie: "1 820 kr/m²", vac: "7,5 %", note: "Transport- og næringspark. Lavere likviditet." },
  { id: "harstad", name: "Harstad", lat: 68.8, lon: 16.55, yield: "6,55 %", leie: "1 875 kr/m²", vac: "5,8 %", note: "Stabilt kontor- og handelsmarked." },
]

export const fmtNoComma = (v: number) => v.toFixed(2).replace(".", ",")
export const fmtPct1 = (v: number) => `${v.toFixed(1).replace(".", ",")} %`
export const fmtNum = (v: number) => v.toLocaleString("no-NO")
