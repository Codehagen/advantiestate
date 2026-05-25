"use client"

// Interactive shell for the Markedsinnsikt editorial page.
// Ported from advanti/markedsinnsikt.html + markedsinnsikt.js.
// Holds the sector sidebar nav, sub-tabs, datasets and the six content views.

import { Fragment, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { MapErrorBoundary } from "./MapErrorBoundary"
import type { MapCity } from "./types"

// Leaflet needs `window`, so the overview map loads browser-only. This
// dynamic({ ssr: false }) call is legal here because MarkedsinnsiktShell is a
// Client Component — Next 16 forbids ssr:false inside Server Components.
const NordNorgeLeafletMap = dynamic(
  () =>
    import("./maps/NordNorgeLeafletMap").then((m) => m.NordNorgeLeafletMap),
  { ssr: false, loading: () => <div className="mi-map-loading" /> },
)

// recharts (~100KB) is heavy, and its ResponsiveContainer cannot meaningfully
// server-render anyway — so the charts load on demand. The 360px skeleton
// matches CHART_HEIGHT and locks layout to avoid a shift on first paint.
// See PERFORMANCE_PLAN.md Phase 2.1.
const ChartSkeleton = () => (
  <div
    className="mi-chart-skeleton"
    style={{
      width: "100%",
      height: 360,
      borderRadius: 8,
      background: "rgba(44, 40, 37, 0.04)",
    }}
    aria-hidden="true"
  />
)

const MarketBarChart = dynamic(
  () => import("./charts/MarketBarChart").then((m) => m.MarketBarChart),
  { ssr: false, loading: ChartSkeleton },
)

const MarketLineChart = dynamic(
  () => import("./charts/MarketLineChart").then((m) => m.MarketLineChart),
  { ssr: false, loading: ChartSkeleton },
)

// ════════════════════════════════════════════════════════════════════════
// DATA — ported verbatim from markedsinnsikt.js
// ════════════════════════════════════════════════════════════════════════

const QUARTERS = [
  "Q1 21", "Q2 21", "Q3 21", "Q4 21",
  "Q1 22", "Q2 22", "Q3 22", "Q4 22",
  "Q1 23", "Q2 23", "Q3 23", "Q4 23",
  "Q1 24", "Q2 24", "Q3 24", "Q4 24",
  "Q1 25", "Q2 25", "Q3 25", "Q4 25",
]

const RATES = {
  swap5y: [1.2, 1.45, 1.65, 1.95, 2.3, 2.85, 3.4, 3.85, 4.1, 4.25, 4.3, 4.35, 4.2, 4.05, 3.95, 3.9, 3.85, 3.8, 3.85, 3.82],
  gov10y: [0.95, 1.2, 1.4, 1.65, 1.95, 2.4, 2.95, 3.3, 3.55, 3.65, 3.7, 3.75, 3.6, 3.5, 3.4, 3.45, 3.45, 3.5, 3.55, 3.55],
}

type Segment = "kontor" | "handel" | "logistikk"

const YIELD: Record<Segment, number[]> = {
  kontor: [4.2, 4.2, 4.25, 4.3, 4.4, 4.55, 4.85, 5.2, 5.6, 5.85, 6.0, 6.15, 6.2, 6.2, 6.15, 6.1, 6.05, 6.0, 6.05, 6.1],
  handel: [4.6, 4.6, 4.65, 4.7, 4.8, 4.95, 5.25, 5.55, 5.95, 6.2, 6.4, 6.55, 6.65, 6.65, 6.6, 6.55, 6.5, 6.45, 6.5, 6.55],
  logistikk: [5.1, 5.1, 5.1, 5.15, 5.25, 5.4, 5.65, 5.95, 6.3, 6.55, 6.7, 6.85, 6.95, 6.95, 6.9, 6.85, 6.85, 6.8, 6.85, 6.85],
}

const LEIE: Record<Segment, Record<string, number[]>> = {
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

const VOLUME = {
  years: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
  total: [1.8, 2.4, 2.1, 3.6, 4.5, 3.2, 4.1, 4.8],
}

const VACANCY = [
  { city: "Bodø", kontor: 4.6, handel: 3.1, logistikk: 2.4 },
  { city: "Tromsø", kontor: 3.4, handel: 2.8, logistikk: 1.9 },
  { city: "Alta", kontor: 6.2, handel: 4.4, logistikk: 3.8 },
  { city: "Harstad", kontor: 5.8, handel: 3.9, logistikk: 3.2 },
  { city: "Narvik", kontor: 7.5, handel: 5.1, logistikk: 4.2 },
  { city: "Mo i Rana", kontor: 5.4, handel: 4.0, logistikk: 2.8 },
]

const TX = [
  { date: "Des 25", name: "Storgata 73, Tromsø", loc: "Kontortårn · 11 400 m²", seg: "Kontor", value: "285 mnok", yield: "5,9 %" },
  { date: "Nov 25", name: "Bodø Logistikkpark — fase 2", loc: "Logistikk · 18 200 m²", seg: "Logistikk", value: "215 mnok", yield: "6,8 %" },
  { date: "Okt 25", name: "AMFI Alta — anchor", loc: "Handel · 6 800 m²", seg: "Handel", value: "118 mnok", yield: "6,5 %" },
  { date: "Sep 25", name: "Tromsdalen Næringspark", loc: "Komb. · 9 400 m²", seg: "Kombinasjon", value: "164 mnok", yield: "6,3 %" },
  { date: "Aug 25", name: "Sjøgata 15, Bodø", loc: "Kontor · 4 200 m²", seg: "Kontor", value: "98 mnok", yield: "6,1 %" },
  { date: "Jun 25", name: "Mo i Rana Industripark", loc: "Logistikk · 22 600 m²", seg: "Logistikk", value: "245 mnok", yield: "7,2 %" },
]

const CITIES: MapCity[] = [
  { id: "bodo", name: "Bodø", lat: 67.28, lon: 14.4, yield: "6,35 %", leie: "2 400 kr/m²", vac: "4,6 %", note: "Hovedkontor for Advanti. Voksende logistikkhubb." },
  { id: "tromso", name: "Tromsø", lat: 69.65, lon: 18.95, yield: "6,10 %", leie: "2 950 kr/m²", vac: "3,4 %", note: "Største kontormarkedet i Nord-Norge." },
  { id: "alta", name: "Alta", lat: 69.97, lon: 23.27, yield: "6,75 %", leie: "1 950 kr/m²", vac: "6,2 %", note: "Sterkt handelsmarked i Finnmark." },
  { id: "mo", name: "Mo i Rana", lat: 66.32, lon: 14.14, yield: "6,80 %", leie: "1 750 kr/m²", vac: "5,4 %", note: "Industri og logistikk. Stor industriutbygging." },
  { id: "narvik", name: "Narvik", lat: 68.44, lon: 17.43, yield: "6,90 %", leie: "1 820 kr/m²", vac: "7,5 %", note: "Transport- og næringspark. Lavere likviditet." },
  { id: "harstad", name: "Harstad", lat: 68.8, lon: 16.55, yield: "6,55 %", leie: "1 875 kr/m²", vac: "5,8 %", note: "Stabilt kontor- og handelsmarked." },
]

// ════════════════════════════════════════════════════════════════════════
// HELPERS — ported from markedsinnsikt.js
// ════════════════════════════════════════════════════════════════════════

const SECTOR_COLORS = [
  "var(--warm-grey)",
  "var(--warm-grey-85)",
  "var(--warm-grey-85)",
]
const fmtNoComma = (v: number) => v.toFixed(2).replace(".", ",")
const fmtPct1 = (v: number) => `${v.toFixed(1).replace(".", ",")} %`
const fmtNum = (v: number) => v.toLocaleString("no-NO")

type SectorId =
  | "yield"
  | "leie"
  | "tx"
  | "ledighet"
  | "kart"
  | "rapporter"

const SECTORS: { id: SectorId; label: string; pre: string }[] = [
  { id: "yield", label: "Yield & renter", pre: "01" },
  { id: "leie", label: "Markedsleie", pre: "02" },
  { id: "tx", label: "Transaksjoner", pre: "03" },
  { id: "ledighet", label: "Ledighet", pre: "04" },
  { id: "kart", label: "Markedskart", pre: "05" },
  { id: "rapporter", label: "Rapporter & analyser", pre: "06" },
]

const SUB_TABS: { id: Segment; label: string }[] = [
  { id: "kontor", label: "Kontor" },
  { id: "handel", label: "Handel" },
  { id: "logistikk", label: "Logistikk" },
]

const SEG_LABELS: Record<Segment, string> = {
  kontor: "kontor",
  handel: "handel",
  logistikk: "logistikk",
}

// ════════════════════════════════════════════════════════════════════════
// VIEW: YIELD
// ════════════════════════════════════════════════════════════════════════

function YieldView() {
  const [sub, setSub] = useState<Segment>("kontor")
  const yieldData = YIELD[sub]
  const last = yieldData[yieldData.length - 1]
  const prev = yieldData[yieldData.length - 5]
  const bps = Math.round((last - prev) * 100)
  const isUp = bps > 0

  const segments: { key: Segment; label: string; color: string }[] = [
    { key: "kontor", label: "Kontor", color: "var(--warm-grey)" },
    { key: "handel", label: "Handel", color: "var(--accent)" },
    { key: "logistikk", label: "Logistikk", color: "var(--warm-grey-85)" },
  ]

  return (
    <div>
      <div className="mi-section-head">
        <div>
          <span
            className="eyebrow"
            style={{ marginBottom: 18, display: "inline-flex" }}
          >
            01 · Yield & renter
          </span>
          <h2>
            Yield mot rente­markedet,{" "}
            <span className="italic">kvartal for kvartal.</span>
          </h2>
        </div>
        <div className="updated">
          <span className="live">OPPDATERT 14. JAN 2026</span>
          <span>Kilde: Advanti markedsdata</span>
        </div>
      </div>

      <div className="mi-subtabs">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            aria-selected={sub === t.id}
            onClick={() => setSub(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mi-chart-card">
        <div className="mi-chart-head">
          <div>
            <h3>Prime yield, Tromsø sentrum</h3>
            <div className="focus-val">
              <span className="val-num">{fmtNoComma(last)}</span>
              <span className="unit">%</span>
            </div>
            <div className="focus-delta delta-bps">
              <span className={isUp ? "up" : "down"}>
                {isUp ? "▲" : "▼"} {Math.abs(bps)} bps
              </span>{" "}
              siste 12 mnd
            </div>
          </div>
          <div className="mi-chart-legend">
            <span className="item">
              <span
                className="swatch"
                style={{ background: "var(--warm-grey)" }}
              />
              Prime yield
            </span>
            <span className="item">
              <span
                className="swatch"
                style={{ background: "var(--warm-grey-85)" }}
              />
              5 år SWAP
            </span>
            <span className="item">
              <span
                className="swatch"
                style={{
                  borderTop: "2px dashed",
                  height: 0,
                  borderColor: "var(--warm-grey-85)",
                  background: "transparent",
                }}
              />
              10 år statsobl.
            </span>
          </div>
        </div>
        <MarketLineChart
          ariaLabel="Prime yield mot 5 år SWAP og 10 år statsobligasjon, kvartalsvis 2021–2025"
          labels={QUARTERS}
          yMin={0.5}
          yMax={7.5}
          yTicks={7}
          yFormat={(v) => `${v.toFixed(1)} %`}
          series={[
            { name: "Prime yield", color: "var(--warm-grey)", values: yieldData },
            {
              name: "5 år SWAP",
              color: "var(--warm-grey-85)",
              values: RATES.swap5y,
            },
            {
              name: "10 år statsobl.",
              color: "var(--warm-grey-85)",
              dashed: true,
              values: RATES.gov10y,
            },
          ]}
        />
      </div>

      <table className="mi-table">
        <thead>
          <tr>
            <th>Segment</th>
            <th className="r">Prime yield Q4 2025</th>
            <th className="r">12 mnd endring</th>
            <th className="r">3 år endring</th>
            <th className="r">Spread vs. 5 år SWAP</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((seg) => {
            const arr = YIELD[seg.key]
            const cur = arr[arr.length - 1]
            const prev1y = arr[arr.length - 5]
            const prev3y = arr[arr.length - 13]
            const d1y = Math.round((cur - prev1y) * 100)
            const d3y = Math.round((cur - prev3y) * 100)
            const spread = cur - RATES.swap5y[RATES.swap5y.length - 1]
            return (
              <tr key={seg.key}>
                <td className="label-cell">
                  <span
                    className="swatch"
                    style={{ background: seg.color }}
                  />
                  {seg.label}
                </td>
                <td className="r">{fmtNoComma(cur)} %</td>
                <td className="r">
                  <span className={`ch ${d1y >= 0 ? "up" : "down"}`}>
                    {d1y >= 0 ? "▲" : "▼"} {Math.abs(d1y)} bps
                  </span>
                </td>
                <td className="r">
                  <span className={`ch ${d3y >= 0 ? "up" : "down"}`}>
                    {d3y >= 0 ? "▲" : "▼"} {Math.abs(d3y)} bps
                  </span>
                </td>
                <td className="r">{fmtNoComma(spread)} %</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mi-footnote">
        <span className="source">
          Prime yield reflekterer beste eiendom i sin klasse — sentrumsbygg med
          solid leietakerportefølje og lang WAULT.
        </span>
        <span>Q4 2025</span>
      </div>

      <div className="mi-insights">
        <div className="mi-insight">
          <div className="ipre">Tolkning · 01</div>
          <h3>Yield-toppen ligger bak oss.</h3>
          <p>
            Prime yield på kontor stabiliserte seg gjennom 2024 og har korrigert
            svakt ned i 2025 — i takt med fallende langrenter og økt
            kjøpsappetitt.
          </p>
        </div>
        <div className="mi-insight">
          <div className="ipre">Tolkning · 02</div>
          <h3>Spread mot rente er sunn.</h3>
          <p>
            Med 5-års SWAP rundt 3,8 % og prime yield rundt 6,1 % har
            kontorsegmentet en spread på 230 bps — historisk akkurat hva markedet
            krever for å være likvid.
          </p>
        </div>
        <div className="mi-insight">
          <div className="ipre">Tolkning · 03</div>
          <h3>Logistikk kommer ned først.</h3>
          <p>
            Yield på logistikk er historisk høyt vs. kontor, men har gått hardest
            gjennom syklusen. Vi forventer den første betydelige innstrammingen
            her gjennom 2026.
          </p>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════
// VIEW: MARKEDSLEIE
// ════════════════════════════════════════════════════════════════════════

function LeieView() {
  const [sub, setSub] = useState<Segment>("kontor")
  const cityData = LEIE[sub]
  const cities = Object.keys(cityData)
  const primeCity = cities[0]
  const arr = cityData[primeCity]
  const cur = arr[arr.length - 1]
  const prev = arr[arr.length - 5]
  const pct = ((cur - prev) / prev) * 100

  return (
    <div>
      <div className="mi-section-head">
        <div>
          <span
            className="eyebrow"
            style={{ marginBottom: 18, display: "inline-flex" }}
          >
            02 · Markedsleie
          </span>
          <h2>
            Markedsleie per by,{" "}
            <span className="italic">prime kvalitet.</span>
          </h2>
        </div>
        <div className="updated">
          <span className="live">OPPDATERT 14. JAN 2026</span>
          <span>Kilde: Advanti leiekontrakt­base</span>
        </div>
      </div>

      <div className="mi-subtabs">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            aria-selected={sub === t.id}
            onClick={() => setSub(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mi-chart-card">
        <div className="mi-chart-head">
          <div>
            <h3>
              Prime markedsleie {SEG_LABELS[sub]},{" "}
              <span className="city-name">{primeCity}</span>
            </h3>
            <div className="focus-val">
              <span className="val-num">{fmtNum(cur)}</span>
              <span className="unit">kr/m²/år</span>
            </div>
            <div className="focus-delta delta-pct">
              <span className={pct >= 0 ? "up" : "down"}>
                {pct >= 0 ? "▲" : "▼"} {pct.toFixed(1).replace(".", ",")} %
              </span>{" "}
              YoY
            </div>
          </div>
          <div className="mi-chart-legend">
            {cities.map((c, i) => (
              <span className="item" key={c}>
                <span
                  className="swatch"
                  style={
                    i === 2
                      ? {
                          borderTop: "2px dashed var(--warm-grey-85)",
                          height: 0,
                          background: "transparent",
                        }
                      : { background: SECTOR_COLORS[i] }
                  }
                />
                {c}
              </span>
            ))}
          </div>
        </div>
        <MarketLineChart
          ariaLabel={`Prime markedsleie ${SEG_LABELS[sub]} per by, kvartalsvis 2021–2025`}
          labels={QUARTERS}
          yFormat={(v) => `${Math.round(v)} kr`}
          series={cities.map((c, i) => ({
            name: c,
            color: SECTOR_COLORS[i],
            dashed: i === 2,
            values: cityData[c],
          }))}
        />
      </div>

      <table className="mi-table">
        <thead>
          <tr>
            <th>By</th>
            <th className="r">Markedsleie Q4 2025</th>
            <th className="r">12 mnd vekst</th>
            <th className="r">3 år vekst</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((c, i) => {
            const v = cityData[c]
            const curC = v[v.length - 1]
            const prev1y = v[v.length - 5]
            const prev3y = v[v.length - 13]
            const d1y = ((curC - prev1y) / prev1y) * 100
            const d3y = ((curC - prev3y) / prev3y) * 100
            return (
              <tr key={c}>
                <td className="label-cell">
                  <span
                    className="swatch"
                    style={{ background: SECTOR_COLORS[i] }}
                  />
                  {c}
                </td>
                <td className="r">{fmtNum(curC)} kr/m²</td>
                <td className="r">
                  <span className={`ch ${d1y >= 0 ? "up" : "down"}`}>
                    {d1y >= 0 ? "▲" : "▼"}{" "}
                    {d1y.toFixed(1).replace(".", ",")} %
                  </span>
                </td>
                <td className="r">
                  <span className={`ch ${d3y >= 0 ? "up" : "down"}`}>
                    {d3y >= 0 ? "▲" : "▼"} {d3y.toFixed(0)} %
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mi-footnote">
        <span className="source">
          Markedsleie er prime — toppleie for nybygg/klasse A i sentrum. Reelle
          gjennomsnittsleier ligger 10–25 % under.
        </span>
        <span>Q4 2025</span>
      </div>

      <div className="mi-insights">
        <div className="mi-insight">
          <div className="ipre">Tolkning · 01</div>
          <h3>Tromsø trekker fra.</h3>
          <p>
            Tromsø sentrum har hatt 38 % leievekst siden 2021, drevet av lav
            nybygg­aktivitet og sterkt offentlig + privat leietaker­etterspørsel.
          </p>
        </div>
        <div className="mi-insight">
          <div className="ipre">Tolkning · 02</div>
          <h3>Bodø følger på.</h3>
          <p>
            Bodø følger Tromsø-trenden med 18 mnd forsinkelse. Vi ser betydelig
            oppside i prime kontor­leie de neste 12 mnd, særlig i sentrum og nær
            jernbanen.
          </p>
        </div>
        <div className="mi-insight">
          <div className="ipre">Tolkning · 03</div>
          <h3>Indekseringen tar over.</h3>
          <p>
            Den nominelle veksten i 2024–25 har vært drevet vel så mye av
            indeksregulering som av markedsstyrke. Reell vekst forventes mer
            moderat i 2026.
          </p>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════
// VIEW: TRANSAKSJONER
// ════════════════════════════════════════════════════════════════════════

function TxView() {
  return (
    <div>
      <div className="mi-section-head">
        <div>
          <span
            className="eyebrow"
            style={{ marginBottom: 18, display: "inline-flex" }}
          >
            03 · Transaksjoner
          </span>
          <h2>
            Transaksjons­volum og{" "}
            <span className="italic">utvalgte handler.</span>
          </h2>
        </div>
        <div className="updated">
          <span className="live">OPPDATERT 14. JAN 2026</span>
          <span>Kilde: Advanti transaksjons­database</span>
        </div>
      </div>

      <div className="mi-chart-card">
        <div className="mi-chart-head">
          <div>
            <h3>Totalt transaksjonsvolum, Nord-Norge</h3>
            <div className="focus-val">
              <span>4,8</span>
              <span className="unit">mrd NOK · 2025</span>
            </div>
            <div className="focus-delta">
              <span className="up">▲ 18 %</span> mot 2024 · høyeste nivå siden
              2022
            </div>
          </div>
          <div className="mi-chart-legend">
            <span className="item">
              <span
                className="swatch"
                style={{
                  background: "var(--warm-grey)",
                  height: 12,
                  width: 8,
                  borderRadius: 1,
                }}
              />
              Realisert 2025
            </span>
            <span className="item">
              <span
                className="swatch"
                style={{
                  background: "var(--accent-soft)",
                  border: "1px solid var(--warm-grey)",
                  height: 12,
                  width: 8,
                  borderRadius: 1,
                }}
              />
              Historisk
            </span>
          </div>
        </div>
        <MarketBarChart
          ariaLabel="Totalt transaksjonsvolum i Nord-Norge per år, 2018–2025"
          labels={VOLUME.years}
          orientation="columns"
          highlightLast
          valueFormatter={(v) => `${v.toFixed(1)} mrd`}
          series={[
            {
              name: "Transaksjonsvolum",
              color: "var(--accent)",
              values: VOLUME.total,
            },
          ]}
        />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: "-0.018em",
          margin: "56px 0 16px",
        }}
      >
        Utvalgte transaksjoner{" "}
        <span
          style={{
            fontStyle: "italic",
            fontWeight: 300,
            color: "var(--warm-grey-85)",
          }}
        >
          2025.
        </span>
      </h3>
      <div className="mi-tx-list">
        {TX.map((t) => (
          <div className="mi-tx" key={t.name}>
            <div className="tx-date">{t.date}</div>
            <div>
              <div className="tx-name">{t.name}</div>
              <div className="tx-loc">{t.loc}</div>
            </div>
            <div className="tx-segment">{t.seg}</div>
            <div className="tx-value">{t.value}</div>
            <div className="tx-yield">Yield {t.yield}</div>
          </div>
        ))}
      </div>

      <div className="mi-footnote">
        <span className="source">
          Listen viser et utvalg av transaksjoner Advanti har bekreftet via
          tinglysing, kjøpekontrakt eller direkte fra part. Underlag er
          kvalitetssikret.
        </span>
        <span>+47 transaksjoner sporet i 2025</span>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════
// VIEW: LEDIGHET
// ════════════════════════════════════════════════════════════════════════

function LedighetView() {
  return (
    <div>
      <div className="mi-section-head">
        <div>
          <span
            className="eyebrow"
            style={{ marginBottom: 18, display: "inline-flex" }}
          >
            04 · Ledighet
          </span>
          <h2>
            Ledighet per by <span className="italic">og segment.</span>
          </h2>
        </div>
        <div className="updated">
          <span className="live">OPPDATERT 14. JAN 2026</span>
          <span>Kilde: Advanti markeds­telling</span>
        </div>
      </div>

      <div className="mi-chart-card">
        <div className="mi-chart-head">
          <div>
            <h3>Andel ledig næringsareal — Q4 2025</h3>
            <div className="focus-delta">
              Lav ledighet &lt; 4 % indikerer et stramt marked.
            </div>
          </div>
          <div className="mi-chart-legend">
            <span className="item">
              <span
                className="swatch"
                style={{ background: "var(--warm-grey)" }}
              />
              Kontor
            </span>
            <span className="item">
              <span
                className="swatch"
                style={{ background: "var(--warm-grey-85)" }}
              />
              Handel
            </span>
            <span className="item">
              <span
                className="swatch"
                style={{
                  background: "var(--accent)",
                  height: 8,
                  border: "1px solid var(--warm-grey-75)",
                }}
              />
              Logistikk
            </span>
          </div>
        </div>
        <MarketBarChart
          ariaLabel="Ledighet i prosent per by og segment, Q4 2025"
          labels={VACANCY.map((r) => r.city)}
          orientation="rows"
          height={340}
          valueFormatter={fmtPct1}
          series={[
            {
              name: "Kontor",
              color: "var(--warm-grey)",
              values: VACANCY.map((r) => r.kontor),
            },
            {
              name: "Handel",
              color: "var(--warm-grey-85)",
              values: VACANCY.map((r) => r.handel),
            },
            {
              name: "Logistikk",
              color: "var(--accent)",
              values: VACANCY.map((r) => r.logistikk),
            },
          ]}
        />
        <table className="mi-city-table" style={{ marginTop: 24 }}>
          <thead>
            <tr>
              <th>By</th>
              <th>Kontor</th>
              <th>Handel</th>
              <th>Logistikk</th>
            </tr>
          </thead>
          <tbody>
            {VACANCY.map((row) => (
              <tr key={row.city}>
                <td className="city-name">{row.city}</td>
                <td>{fmtPct1(row.kontor)}</td>
                <td>{fmtPct1(row.handel)}</td>
                <td>{fmtPct1(row.logistikk)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mi-insights">
        <div className="mi-insight">
          <div className="ipre">Tolkning · 01</div>
          <h3>Tromsø er stramt.</h3>
          <p>
            3,4 % kontorledighet i Tromsø er det laveste på fem år. Flere
            offentlige leietakere har lenge utløst kontrakt og er på utkikk etter
            klasse A-arealer.
          </p>
        </div>
        <div className="mi-insight">
          <div className="ipre">Tolkning · 02</div>
          <h3>Narvik er fragmentert.</h3>
          <p>
            7,5 % ledighet i Narvik gjenspeiler eldre bygningsmasse mer enn
            manglende etterspørsel. Klasse A er fortsatt fullt utleid.
          </p>
        </div>
        <div className="mi-insight">
          <div className="ipre">Tolkning · 03</div>
          <h3>Logistikk holder seg lavt.</h3>
          <p>
            Ledigheten i logistikk ligger gjennomgående lavt over alle byer —
            drevet av sterk etterspørsel fra dagligvare, e-handel og industri.
          </p>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════
// VIEW: MARKEDSKART
// ════════════════════════════════════════════════════════════════════════

function KartView() {
  const [cityId, setCityId] = useState("bodo")
  const city = CITIES.find((c) => c.id === cityId) ?? CITIES[1]

  return (
    <div>
      <div className="mi-section-head">
        <div>
          <span
            className="eyebrow"
            style={{ marginBottom: 18, display: "inline-flex" }}
          >
            05 · Markedskart
          </span>
          <h2>
            By for by. <span className="italic">Klikk for detaljer.</span>
          </h2>
        </div>
        <div className="updated">
          <span className="live">OPPDATERT 14. JAN 2026</span>
          <span>Yield, leie og ledighet — Q4 2025</span>
        </div>
      </div>

      <div className="mi-map-card">
        <div className="mi-map">
          <MapErrorBoundary>
            <NordNorgeLeafletMap
              cities={CITIES}
              activeCityId={cityId}
              onSelectCity={setCityId}
            />
          </MapErrorBoundary>
        </div>
        <div className="mi-map-info">
          <div className="mi-city-picker" role="group" aria-label="Velg by">
            {CITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === cityId}
                onClick={() => setCityId(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="city-label">Marked · {city.name}</div>
          <h3>{city.name}</h3>
          <div
            style={{
              fontSize: 14,
              color: "var(--warm-grey-85)",
              marginBottom: 22,
              lineHeight: 1.55,
              maxWidth: "30ch",
            }}
          >
            {city.note}
          </div>
          <div className="city-stat">
            <span className="l">Prime yield kontor</span>
            <span className="v">{city.yield}</span>
          </div>
          <div className="city-stat">
            <span className="l">Markedsleie kontor</span>
            <span className="v">{city.leie}</span>
          </div>
          <div className="city-stat">
            <span className="l">Kontorledighet</span>
            <span className="v">{city.vac}</span>
          </div>
          <div style={{ marginTop: 32 }}>
            <Link
              href="/kontakt"
              className="btn btn-outline"
              style={{ fontSize: 12, padding: "10px 18px" }}
            >
              Få full rapport for {city.name} <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mi-footnote">
        <span className="source">
          Kartet viser Advantis seks dekningsbyer i Nord-Norge. Klikk en by for
          yield, leie og ledighet — alle tall per Q4 2025.
        </span>
        <Link
          href="/markedsinnsikt/kart"
          style={{ color: "var(--warm-grey)", borderBottom: "1px solid" }}
        >
          Detaljert sonekart for Bodø →
        </Link>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════
// VIEW: RAPPORTER
// ════════════════════════════════════════════════════════════════════════

const REPORTS = [
  {
    pre: "RAPPORT · 12. JAN 2026",
    title: "Markedsrapport — Q4 2025",
    body: "Yield, leie og volum. Full gjennomgang av kvartalet.",
    foot: "PDF · 48 s",
  },
  {
    pre: "ANALYSE · 18. NOV 2025",
    title: "Logistikk Nord-Norge — kapasitetsbehov mot 2030",
    body: "Industriutbygging og dagligvare­vekst. Hva betyr det for areal­behovet?",
    foot: "PDF · 22 s",
  },
  {
    pre: "RAPPORT · 14. OKT 2025",
    title: "Markedsrapport — Q3 2025",
    body: "Yield-toppen passert? Første tegn på nedgang i prime kontor.",
    foot: "PDF · 44 s",
  },
  {
    pre: "DYPDYKK · 04. SEP 2025",
    title: "Kontorleie­markedet i Tromsø",
    body: "Hvorfor leien har steget 38 % siden 2021 — og hvor mye videre vekst som er igjen.",
    foot: "PDF · 18 s",
  },
  {
    pre: "RAPPORT · 11. JUL 2025",
    title: "Markedsrapport — Q2 2025",
    body: "Transaksjonsvolumet tar seg opp. Yield stabiliseres på tvers av segmenter.",
    foot: "PDF · 42 s",
  },
  {
    pre: "DYPDYKK · 22. MAI 2025",
    title: "Bodø som logistikkhubb",
    body: "Befolkningsvekst, ny jernbane og industri — hva det betyr for næringseiendom.",
    foot: "PDF · 16 s",
  },
]

function RapporterView() {
  return (
    <div>
      <div className="mi-section-head">
        <div>
          <span
            className="eyebrow"
            style={{ marginBottom: 18, display: "inline-flex" }}
          >
            06 · Rapporter & analyser
          </span>
          <h2>
            Dypdykk i markedet,{" "}
            <span className="italic">når du trenger det.</span>
          </h2>
        </div>
        <div className="updated">
          <span className="live">SISTE RAPPORT 12. JAN 2026</span>
          <span>Q4 2025 Marked Nord-Norge</span>
        </div>
      </div>

      <div className="mi-report-card">
        <div>
          <div className="pre">Hovedrapport · Q4 2025</div>
          <h3>
            Markedsrapport Nord-Norge —{" "}
            <span className="italic">Q4 2025.</span>
          </h3>
          <p>
            Komplett gjennomgang av yield, markedsleie, transaksjons­volum og
            ledighet på tvers av kontor, handel og logistikk — i alle de seks
            byene vi dekker. 48 sider, full datapakke i Excel.
          </p>
          <div className="row" style={{ marginTop: 32 }}>
            <Link href="/kontakt" className="btn btn-primary">
              Bestill rapport <span className="arrow">→</span>
            </Link>
            <a href="#" className="btn btn-ghost">
              Last ned sammendrag (PDF, 6 sider)
            </a>
          </div>
        </div>
        <div className="meta">
          <div>
            <div className="key">Format</div>
            <div className="val">PDF + Excel-datasett</div>
          </div>
          <div>
            <div className="key">Omfang</div>
            <div className="val">48 sider · 14 datatabeller</div>
          </div>
          <div>
            <div className="key">Tilgang</div>
            <div className="val">Abonnement eller enkeltkjøp</div>
          </div>
          <div>
            <div className="key">Neste utgave</div>
            <div className="val">15. juli 2026</div>
          </div>
        </div>
      </div>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: "-0.018em",
          margin: "56px 0 16px",
        }}
      >
        Arkiv{" "}
        <span
          style={{
            fontStyle: "italic",
            fontWeight: 300,
            color: "var(--warm-grey-85)",
          }}
        >
          — alle rapporter.
        </span>
      </h3>

      <div className="mi-reports-grid">
        {REPORTS.map((r) => (
          <article className="mi-report" key={r.title}>
            <div>
              <div className="rpre">{r.pre}</div>
              <h4>{r.title}</h4>
              <p>{r.body}</p>
            </div>
            <div className="rfoot">
              <span>{r.foot}</span>
              <span>Last ned →</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mi-footnote" style={{ marginTop: 32 }}>
        <span className="source">
          Arkivet inneholder kvartalsvise markedsrapporter og tematiske dypdykk.
          Abonnement gir full tilgang inkludert underliggende datasett.
        </span>
        <span>
          <Link
            href="/kontakt"
            style={{
              color: "var(--warm-grey)",
              borderBottom: "1px solid",
            }}
          >
            Snakk med oss om abonnement →
          </Link>
        </span>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════
// SHELL
// ════════════════════════════════════════════════════════════════════════

export function MarkedsinnsiktShell() {
  const [sector, setSector] = useState<SectorId>("yield")

  // Deep-linking: honour /markedsinnsikt#<sector> on load and on back/forward
  // navigation. The hash is kept in sync as the user switches sectors below.
  useEffect(() => {
    const isSector = (h: string): h is SectorId =>
      SECTORS.some((s) => s.id === h)

    const applyHash = () => {
      const hash = window.location.hash.slice(1)
      if (isSector(hash)) setSector(hash)
    }

    applyHash()
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [])

  const selectSector = (id: SectorId) => {
    setSector(id)
    window.history.replaceState(null, "", `#${id}`)
  }

  return (
    <div className="mi-shell">
      <aside className="mi-nav" aria-label="Sektorer">
        <div className="mi-nav-label">Sektor</div>
        {SECTORS.map((s, i) => (
          <Fragment key={s.id}>
            {i === 4 && <div className="divider" />}
            <button
              data-sector={s.id}
              aria-selected={sector === s.id}
              onClick={() => selectSector(s.id)}
            >
              <span>{s.label}</span>
              <span className="pre">{s.pre}</span>
            </button>
          </Fragment>
        ))}
      </aside>

      <main>
        {sector === "yield" && <YieldView />}
        {sector === "leie" && <LeieView />}
        {sector === "tx" && <TxView />}
        {sector === "ledighet" && <LedighetView />}
        {sector === "kart" && <KartView />}
        {sector === "rapporter" && <RapporterView />}
      </main>
    </div>
  )
}
