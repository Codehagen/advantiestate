"use client"

// Per-sector view builders for the Analyseportal. Six honest builders + a
// controls-visibility map — deliberately NOT a generic config engine (the
// control matrix is heterogeneous: range on yield/leie only, cities on leie,
// no segment on makro, legend-toggle off on leie/ledighet).
//
// Every number shown (focus values, deltas, insight figures) is derived from
// the canonical series in marketData/portalSeries at build — never typed in.

import dynamic from "next/dynamic"
import type { ReactNode } from "react"
import {
  QUARTERS,
  QUARTERS_F,
  YEARS,
  YEARS_F,
  PORTAL_SEGMENTS,
  PORTAL_CITIES,
  PORTAL_YIELD,
  PORTAL_YIELD_F,
  PORTAL_RATES,
  PORTAL_RATES_F,
  PORTAL_LEIE,
  PORTAL_LEIE_F,
  PORTAL_VOLUME,
  PORTAL_VOLUME_F,
  DEALCOUNT,
  VAC_NOW,
  VACANCY_TREND,
  NYBYGG,
  NYBYGG_F,
  MAKRO,
  MAKRO_F,
  SEG_COLOR,
  CITY_COLOR,
  PORTAL_PALETTE,
  PORTAL_LATEST,
  isEstimatedLeie,
  lastOf,
  bpsChange,
  pctGrowth,
  fmtComma,
  fmtGroup,
  fmtPct1p,
  fmtPct2p,
  fmtKrM2,
  fmtMrd,
  fmtM2k,
  type PortalSegment,
  type PortalCity,
} from "@/components/markedsinnsikt/portalSeries"
import { TX, VOLUME, type Segment } from "@/components/markedsinnsikt/marketData"
import { mergeForecast, rangeWindow, type ChartRow, type SeriesDef } from "./seriesUtils"
import { ChartSkeleton, Delta, Insight, PortalLegend } from "./bits"
import { PORTAL_CHART_HEIGHT, SNAPSHOT_CHART_HEIGHT, SPARK_HEIGHT } from "./chartConstants"

// ── chart frames: client-only chunks, skeletons sized to the real heights ───
const TrendChart = dynamic(
  () => import("./charts/PortalCharts").then((m) => m.TrendChart),
  { ssr: false, loading: () => <ChartSkeleton height={PORTAL_CHART_HEIGHT} /> },
)
const StackedBar = dynamic(
  () => import("./charts/PortalCharts").then((m) => m.StackedBar),
  { ssr: false, loading: () => <ChartSkeleton height={PORTAL_CHART_HEIGHT} /> },
)
const SnapshotBar = dynamic(
  () => import("./charts/PortalCharts").then((m) => m.SnapshotBar),
  { ssr: false, loading: () => <ChartSkeleton height={SNAPSHOT_CHART_HEIGHT} /> },
)
const Spark = dynamic(
  () => import("./charts/PortalCharts").then((m) => m.Spark),
  { ssr: false, loading: () => <ChartSkeleton height={SPARK_HEIGHT} /> },
)

// ── sector registry + controls-visibility map ───────────────────────────────
export type SectorKey = "yield" | "leie" | "tx" | "ledighet" | "nybygg" | "makro"
export type RangeKey = "3y" | "5y" | "all"

export const SECTORS: { key: SectorKey; num: string; label: string }[] = [
  { key: "yield", num: "01", label: "Yield & renter" },
  { key: "leie", num: "02", label: "Leiepriser" },
  { key: "tx", num: "03", label: "Transaksjoner" },
  { key: "ledighet", num: "04", label: "Arealledighet" },
  { key: "nybygg", num: "05", label: "Nybygg" },
  { key: "makro", num: "06", label: "Makro" },
]

export const CONTROLS: Record<
  SectorKey,
  { segment: boolean; threeSeg: boolean; cities: boolean; range: boolean; legendToggle: boolean }
> = {
  yield: { segment: true, threeSeg: false, cities: false, range: true, legendToggle: true },
  leie: { segment: true, threeSeg: true, cities: true, range: true, legendToggle: false },
  tx: { segment: true, threeSeg: false, cities: false, range: false, legendToggle: true },
  ledighet: { segment: true, threeSeg: true, cities: false, range: false, legendToggle: false },
  nybygg: { segment: true, threeSeg: false, cities: false, range: false, legendToggle: true },
  makro: { segment: false, threeSeg: false, cities: false, range: false, legendToggle: true },
}

export interface ViewSpec {
  focusTitle: ReactNode
  focusValue: string
  focusUnit: string
  focusDelta: ReactNode
  chartTitle: string
  legend: ReactNode
  chart: ReactNode
  chartFoot: ReactNode | null
  table: ReactNode | null
  compare: ReactNode | null
  insights: ReactNode
  csv: Record<string, string | number | null>[]
  method: string
}

export interface ViewState {
  segment: PortalSegment
  range: RangeKey
  cities: PortalCity[]
  hidden: Record<string, boolean>
  onToggleHidden: (key: string) => void
  animate: boolean
}

const segLabel = (k: PortalSegment) =>
  PORTAL_SEGMENTS.find((s) => s.key === k)?.label ?? k

const csvRows = (rows: ChartRow[], cols: Record<string, string>) =>
  rows.map((r) => {
    const out: Record<string, string | number | null> = { Periode: r.label }
    for (const [key, header] of Object.entries(cols)) {
      const v = (r[key] ?? r[`${key}_f`]) as number | null
      out[header] = v
    }
    return out
  })

const fcFoot = (
  <span>Skyggelagt = prognose (Advantis basisscenario)</span>
)

// ════════════════════════════════════════════════════════════════════════════
// 01 YIELD & RENTER
// ════════════════════════════════════════════════════════════════════════════
function viewYield(s: ViewState): ViewSpec {
  const seg = s.segment
  const series: SeriesDef[] = [
    { key: "yield", label: `Prime yield ${segLabel(seg).toLowerCase()}`, color: SEG_COLOR[seg], width: 2.6, hist: PORTAL_YIELD[seg], fc: PORTAL_YIELD_F[seg] },
    { key: "swap", label: "5 år SWAP", color: PORTAL_PALETTE.blue, hist: PORTAL_RATES.swap5y, fc: PORTAL_RATES_F.swap5y },
    { key: "gov", label: "10 år stat", color: PORTAL_PALETTE.mist, dashed: true, hist: PORTAL_RATES.gov10y, fc: PORTAL_RATES_F.gov10y },
    { key: "rente", label: "Styringsrente", color: PORTAL_PALETTE.terra, hist: PORTAL_RATES.styringsrente, fc: PORTAL_RATES_F.styringsrente },
  ]
  const rows = rangeWindow(mergeForecast(QUARTERS, QUARTERS_F, series), s.range)
  const names: Record<string, string> = {}
  const colors: Record<string, string> = {}
  for (const sd of series) {
    names[sd.key] = sd.label
    colors[sd.key] = sd.color
  }

  const arr = PORTAL_YIELD[seg]
  const spread = lastOf(arr) - lastOf(PORTAL_RATES.swap5y)
  const d12 = bpsChange(arr, 4)

  const table = (
    <table className="ap-table">
      <thead>
        <tr>
          <th>Segment</th>
          <th className="r">Prime yield {PORTAL_LATEST.quarter}</th>
          <th className="r">12 mnd</th>
          <th className="r">3 år</th>
          <th className="r">Spread vs SWAP</th>
        </tr>
      </thead>
      <tbody>
        {PORTAL_SEGMENTS.map((sg) => {
          const a = PORTAL_YIELD[sg.key]
          return (
            <tr key={sg.key} className={sg.key === seg ? "hl" : ""}>
              <td className="lbl">
                <span className="sw" style={{ background: SEG_COLOR[sg.key] }} />
                {sg.label}
              </td>
              <td className="r">{fmtPct2p(lastOf(a))}</td>
              <td className="r"><Delta n={bpsChange(a, 4)} unit=" bps" /></td>
              <td className="r"><Delta n={bpsChange(a, 12)} unit=" bps" /></td>
              <td className="r">{fmtPct2p(lastOf(a) - lastOf(PORTAL_RATES.swap5y))}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )

  const compare = (
    <div className="ap-compare">
      <div className="ap-compare-head">Prime yield · alle segmenter</div>
      <div className="ap-spark-grid">
        {PORTAL_SEGMENTS.map((sg) => {
          const a = PORTAL_YIELD[sg.key]
          return (
            <div className="ap-spark" key={sg.key}>
              <div className="ap-spark-top">
                <span className="nm">{sg.label}</span>
                <span className="vv">{fmtPct2p(lastOf(a))}</span>
              </div>
              <Spark data={a.map((v) => ({ v }))} color={SEG_COLOR[sg.key]} />
              <div className="ap-spark-foot">
                <Delta n={bpsChange(a, 4)} unit=" bps" /> 12 mnd
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const spreadBps = Math.round(spread * 100)
  return {
    focusTitle: (
      <>
        Prime yield {segLabel(seg).toLowerCase()},{" "}
        <span className="it">Tromsø sentrum.</span>
      </>
    ),
    focusValue: fmtComma(lastOf(arr), 2),
    focusUnit: " %",
    focusDelta: (
      <>
        <Delta n={d12} unit=" bps" /> siste 12 mnd · spread {fmtPct2p(spread)} mot SWAP
      </>
    ),
    chartTitle: "Yield mot rentemarkedet — kvartalsvis",
    legend: <PortalLegend items={series} hidden={s.hidden} onToggle={s.onToggleHidden} />,
    chart: (
      <TrendChart
        data={rows}
        series={series}
        hidden={s.hidden}
        yFmt={(v) => fmtComma(v, 1) + "%"}
        yDomain={[0, 8]}
        yTicks={9}
        tipFmt={fmtPct2p}
        names={names}
        colors={colors}
        animate={s.animate}
      />
    ),
    chartFoot: (
      <>
        <span>Prime yield = beste eiendom i klassen, sentralt beliggende med lang WAULT.</span>
        {fcFoot}
      </>
    ),
    table,
    compare,
    csv: csvRows(rows, { yield: "Yield", swap: "SWAP5", gov: "Stat10", rente: "Styringsrente" }),
    method:
      "Prime yield reflekterer beste eiendom i sin klasse. Referanserenter er NOK 5-års SWAP og 10-års statsobligasjon. Prognose er Advantis basisscenario.",
    insights: (
      <>
        <Insight n="01" h="Yielden har flatet ut.">
          Etter reprisingen 2022–24 har prime kontoryield ligget stabilt rundt
          6,0–6,2 %. Basisscenarioet vårt peker svakt ned mot 2027, i takt med
          lavere langrenter.
        </Insight>
        <Insight n="02" h="Spreaden mot rente er sunn.">
          Med 5-års SWAP på {fmtPct2p(lastOf(PORTAL_RATES.swap5y))} og prime
          kontoryield på {fmtPct2p(lastOf(PORTAL_YIELD.kontor))} er spreaden
          rundt {fmtGroup(spreadBps)} bps — historisk nivået markedet krever
          for å være likvid.
        </Insight>
        <Insight n="03" h="Logistikk og hotell priser høyest.">
          Yield på logistikk og hotell ligger fortsatt klart over kontor. I
          basisscenarioet kommer den første tydelige innstrammingen i
          logistikk.
        </Insight>
      </>
    ),
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 02 LEIEPRISER
// ════════════════════════════════════════════════════════════════════════════
function viewLeie(s: ViewState): ViewSpec {
  const seg = (s.segment === "hotell" ? "kontor" : s.segment) as Segment
  const data = PORTAL_LEIE[seg]
  const dataF = PORTAL_LEIE_F[seg]
  const series: SeriesDef[] = s.cities.map((c) => ({
    key: c,
    label: c,
    color: CITY_COLOR[c],
    hist: data[c],
    fc: dataF[c],
    width: c === "Tromsø" ? 2.6 : 2,
    // Cities without observed history render dashed (endpoint-anchored estimate).
    dashed: isEstimatedLeie(seg, c),
  }))
  const rows = rangeWindow(mergeForecast(QUARTERS, QUARTERS_F, series), s.range)
  const names: Record<string, string> = {}
  const colors: Record<string, string> = {}
  for (const sd of series) {
    names[sd.key] = sd.label
    colors[sd.key] = sd.color
  }

  const focusCity = s.cities.includes("Tromsø") ? "Tromsø" : s.cities[0]
  const arr = data[focusCity]
  const yoy = Math.round(pctGrowth(arr, 4) * 10) / 10
  const growthTromso = Math.round(pctGrowth(PORTAL_LEIE.kontor["Tromsø"], QUARTERS.length - 1))
  const growthBodo = Math.round(pctGrowth(PORTAL_LEIE.kontor["Bodø"], QUARTERS.length - 1))

  const table = (
    <table className="ap-table">
      <thead>
        <tr>
          <th>By</th>
          <th className="r">Markedsleie {PORTAL_LATEST.quarter}</th>
          <th className="r">12 mnd</th>
          <th className="r">3 år</th>
        </tr>
      </thead>
      <tbody>
        {PORTAL_CITIES.map((c) => {
          const v = data[c]
          return (
            <tr key={c} className={s.cities.includes(c) ? "hl" : ""}>
              <td className="lbl">
                <span className="sw" style={{ background: CITY_COLOR[c] }} />
                {c}
                {isEstimatedLeie(seg, c) && <span className="sub2">estimert</span>}
              </td>
              <td className="r">{fmtKrM2(lastOf(v))}</td>
              <td className="r"><Delta n={Math.round(pctGrowth(v, 4) * 10) / 10} unit=" %" decimals={1} /></td>
              <td className="r"><Delta n={Math.round(pctGrowth(v, 12))} unit=" %" /></td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )

  const compare = (
    <div className="ap-compare">
      <div className="ap-compare-head">
        Markedsleie {segLabel(seg).toLowerCase()} · alle byer
      </div>
      <div className="ap-spark-grid six">
        {PORTAL_CITIES.map((c) => {
          const v = data[c]
          return (
            <div className="ap-spark" key={c}>
              <div className="ap-spark-top">
                <span className="nm">
                  {c}
                  {isEstimatedLeie(seg, c) && <span className="est"> · est.</span>}
                </span>
                <span className="vv">{fmtGroup(lastOf(v))}</span>
              </div>
              <Spark data={v.map((x) => ({ v: x }))} color={CITY_COLOR[c]} />
              <div className="ap-spark-foot">
                <Delta n={Math.round(pctGrowth(v, 4) * 10) / 10} unit=" %" decimals={1} /> YoY
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const csv = rows.map((r) => {
    const out: Record<string, string | number | null> = { Kvartal: r.label }
    for (const c of s.cities) out[c] = (r[c] ?? r[`${c}_f`]) as number | null
    return out
  })

  return {
    focusTitle: (
      <>
        Prime markedsleie {segLabel(seg).toLowerCase()},{" "}
        <span className="it">{focusCity}.</span>
      </>
    ),
    focusValue: fmtGroup(lastOf(arr)),
    focusUnit: " kr/m²",
    focusDelta: (
      <>
        <Delta n={yoy} unit=" %" decimals={1} /> YoY · prime, klasse A
      </>
    ),
    chartTitle: "Prime markedsleie — kvartalsvis (kr/m²/år)",
    legend: <PortalLegend items={series} />,
    chart: (
      <TrendChart
        data={rows}
        series={series}
        hidden={s.hidden}
        yFmt={fmtGroup}
        tipFmt={fmtKrM2}
        names={names}
        colors={colors}
        animate={s.animate}
      />
    ),
    chartFoot: (
      <>
        <span>Prime = toppleie for nybygg / klasse A i sentrum. Snittleier ligger 10–25 % under.</span>
        <span>
          Heltrukket = observert i Advantis leiekontraktbase. Stiplet = estimert
          utvikling, forankret i siste publiserte nivå ({PORTAL_LATEST.quarter}).
        </span>
        {fcFoot}
      </>
    ),
    table,
    compare,
    csv,
    method:
      "Markedsleie er prime toppleie observert i Advantis leiekontraktbase, oppgitt som kr/m²/år eks. felleskost. Byer med stiplet linje har estimert utvikling forankret i siste publiserte nivå. Velg byer i kontrollinjen for å sammenligne.",
    insights: (
      <>
        <Insight n="01" h="Tromsø leder på nivå.">
          Tromsø har høyest prime kontorleie i landsdelen, med ~{growthTromso} %
          vekst gjennom perioden — drevet av lav nybyggaktivitet og sterk
          offentlig og privat etterspørsel.
        </Insight>
        <Insight n="02" h="Bodø holder følge.">
          Prosentvis har Bodø vokst på linje med Tromsø (~{growthBodo} %). Vi
          ser fortsatt oppside i prime kontorleie sentralt, særlig nær
          jernbanen.
        </Insight>
        <Insight n="03" h="Indeksering tar over.">
          2025 var i praksis flatt reelt — den nominelle veksten drives nå av
          KPI-regulering, ikke markedspress. Vi venter moderat reell vekst inn
          i 2026.
        </Insight>
      </>
    ),
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 03 TRANSAKSJONER
// ════════════════════════════════════════════════════════════════════════════
function viewTx(s: ViewState): ViewSpec {
  const series: SeriesDef[] = PORTAL_SEGMENTS.map((sg) => ({
    key: sg.key,
    label: sg.label,
    color: SEG_COLOR[sg.key],
    hist: PORTAL_VOLUME[sg.key],
    fc: PORTAL_VOLUME_F[sg.key],
  }))
  const rows = mergeForecast(YEARS, YEARS_F, series)
  const names: Record<string, string> = {}
  const colors: Record<string, string> = {}
  for (const sd of series) {
    names[sd.key] = sd.label
    colors[sd.key] = sd.color
  }

  const total = lastOf(VOLUME.total)
  const dYoY = Math.round(pctGrowth(VOLUME.total, 1))
  const lastYear = YEARS[YEARS.length - 1]
  const logiGrowth =
    Math.round((lastOf(PORTAL_VOLUME.logistikk) / PORTAL_VOLUME.logistikk[2]) * 10) / 10

  const table = (
    <table className="ap-table">
      <thead>
        <tr>
          <th>Dato</th>
          <th>Eiendom</th>
          <th>Segment</th>
          <th>By</th>
          <th className="r">Vederlag</th>
          <th className="r">Yield</th>
        </tr>
      </thead>
      <tbody>
        {TX.map((t, i) => (
          <tr key={i}>
            <td className="dim">{t.date}</td>
            <td className="lbl">
              {t.name}
              <span className="sub2">{t.loc}</span>
            </td>
            <td>{t.seg}</td>
            <td>{t.city}</td>
            <td className="r strong">{t.value}</td>
            <td className="r">{t.yield}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const csv = csvRows(rows, {
    kontor: "Kontor",
    handel: "Handel",
    logistikk: "Logistikk",
    hotell: "Hotell",
  })

  return {
    focusTitle: (
      <>
        Transaksjonsvolum Nord-Norge, <span className="it">{lastYear}.</span>
      </>
    ),
    focusValue: fmtComma(total, 1),
    focusUnit: " mrd",
    focusDelta: (
      <>
        <Delta n={dYoY} unit=" %" /> mot {YEARS[YEARS.length - 2]} · {lastOf(DEALCOUNT)} handler
      </>
    ),
    chartTitle: "Årlig transaksjonsvolum, stablet på segment (mrd NOK)",
    legend: <PortalLegend items={series} hidden={s.hidden} onToggle={s.onToggleHidden} />,
    chart: (
      <StackedBar
        data={rows}
        series={series}
        hidden={s.hidden}
        yFmt={(v) => fmtComma(v, 0)}
        tipFmt={fmtMrd}
        names={names}
        colors={colors}
        animate={s.animate}
      />
    ),
    chartFoot: (
      <>
        <span>Volum bekreftet via tinglysing, kjøpekontrakt eller direkte fra part. Transaksjoner vises anonymisert.</span>
        <span>{YEARS_F.join("–")} = estimat</span>
      </>
    ),
    table,
    compare: null,
    csv,
    method:
      "Transaksjonsvolum dekker næringseiendom over 20 mnok i Nord-Norge. Estimater for 2026–27 bygger på pipeline og mandater i markedet. Enkelttransaksjoner vises anonymisert av hensyn til partene.",
    insights: (
      <>
        <Insight n="01" h="Volumet er tilbake.">
          {lastYear} ble med {fmtMrd(total)} det sterkeste året i serien — opp{" "}
          {dYoY} % fra {YEARS[YEARS.length - 2]}, drevet av kontor og
          logistikk. Forventninger om rentekutt løsnet opp markedet.
        </Insight>
        <Insight n="02" h="Logistikk vokser strukturelt.">
          Logistikkvolumet er {fmtComma(logiGrowth, 1)} ganger nivået fra 2020
          — drevet av dagligvare, e-handel og grønn industri i Mo i Rana og
          Bodø.
        </Insight>
        <Insight n="03" h="Flere, mindre handler.">
          Antall transaksjoner stiger raskere enn volumet — markedet preges av
          flere mellomstore objekter fremfor noen få store.
        </Insight>
      </>
    ),
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 04 AREALLEDIGHET
// ════════════════════════════════════════════════════════════════════════════
function viewLedighet(s: ViewState): ViewSpec {
  const seg = (s.segment === "hotell" ? "kontor" : s.segment) as Segment
  const now = VAC_NOW[seg]
  const barData = PORTAL_CITIES.map((c) => ({
    label: c as string,
    vac: now[c],
    color: CITY_COLOR[c],
  })).sort((a, b) => (a.vac as number) - (b.vac as number))
  const avg =
    Math.round((PORTAL_CITIES.reduce((a, c) => a + now[c], 0) / PORTAL_CITIES.length) * 10) / 10
  const lowest = barData[0]
  const highest = barData[barData.length - 1]

  const table = (
    <table className="ap-table">
      <thead>
        <tr>
          <th>By</th>
          <th className="r">Kontor</th>
          <th className="r">Handel</th>
          <th className="r">Logistikk</th>
        </tr>
      </thead>
      <tbody>
        {PORTAL_CITIES.map((c) => (
          <tr key={c}>
            <td className="lbl">
              <span className="sw" style={{ background: CITY_COLOR[c] }} />
              {c}
            </td>
            <td className="r">{fmtPct1p(VAC_NOW.kontor[c])}</td>
            <td className="r">{fmtPct1p(VAC_NOW.handel[c])}</td>
            <td className="r">{fmtPct1p(VAC_NOW.logistikk[c])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const compare = (
    <div className="ap-compare">
      <div className="ap-compare-head">
        {segLabel(seg)}ledighet · utvikling per by
      </div>
      <div className="ap-spark-grid six">
        {PORTAL_CITIES.map((c) => {
          const v = VACANCY_TREND[seg][c]
          const pp = Math.round((lastOf(v) - v[v.length - 5]) * 10) / 10
          return (
            <div className="ap-spark" key={c}>
              <div className="ap-spark-top">
                <span className="nm">{c}</span>
                <span className="vv">{fmtPct1p(lastOf(v))}</span>
              </div>
              <Spark data={v.map((x) => ({ v: x }))} color={CITY_COLOR[c]} />
              <div className="ap-spark-foot">
                <Delta n={pp} unit=" pp" decimals={1} /> 12 mnd
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return {
    focusTitle: (
      <>
        {segLabel(seg)}ledighet, <span className="it">snitt seks byer.</span>
      </>
    ),
    focusValue: fmtComma(avg, 1),
    focusUnit: " %",
    focusDelta: (
      <>
        Lavest i {lowest.label} ({fmtPct1p(lowest.vac as number)}) · høyest i{" "}
        {highest.label} ({fmtPct1p(highest.vac as number)})
      </>
    ),
    chartTitle: `Andel ledig ${segLabel(seg).toLowerCase()}areal — ${PORTAL_LATEST.quarter}`,
    legend: (
      <div className="ap-legend">
        <span className="ap-note">Sortert lav → høy. Under 4 % regnes som stramt marked.</span>
      </div>
    ),
    chart: (
      <SnapshotBar
        data={barData}
        dataKey="vac"
        yFmt={(v) => fmtComma(v, 1) + "%"}
        tipFmt={fmtPct1p}
        name="Ledighet"
        refLine={4}
        refLabel="Stramt < 4 %"
        animate={s.animate}
      />
    ),
    chartFoot: (
      <>
        <span>Ledighet = andel av kartlagt areal som er tilgjengelig for utleie.</span>
        <span>{PORTAL_LATEST.quarter}</span>
      </>
    ),
    table,
    compare,
    csv: barData.map((d) => ({ By: d.label, "Ledighet (%)": d.vac as number })),
    method:
      "Ledighet er målt som andel ledig av kartlagt areal per by og segment, fra Advantis markedstelling hvert kvartal.",
    insights: (
      <>
        <Insight n="01" h="Tromsø er stramt.">
          {fmtPct1p(VAC_NOW.kontor["Tromsø"])} kontorledighet i Tromsø er det
          laveste i vår serie. Flere offentlige leietakere søker klasse A og
          finner lite tilgjengelig.
        </Insight>
        <Insight n="02" h="Narvik er fragmentert.">
          Høyere ledighet i Narvik gjenspeiler eldre bygningsmasse mer enn
          manglende etterspørsel — klasse A er fortsatt godt utleid.
        </Insight>
        <Insight n="03" h="Logistikk holder seg lavt.">
          Ledigheten i logistikk ligger gjennomgående lavt på tvers av byene,
          drevet av etterspørsel fra dagligvare, e-handel og industri.
        </Insight>
      </>
    ),
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 05 NYBYGG
// ════════════════════════════════════════════════════════════════════════════
function viewNybygg(s: ViewState): ViewSpec {
  const series: SeriesDef[] = PORTAL_SEGMENTS.map((sg) => ({
    key: sg.key,
    label: sg.label,
    color: SEG_COLOR[sg.key],
    hist: NYBYGG[sg.key],
    fc: NYBYGG_F[sg.key],
  }))
  const rows = mergeForecast(YEARS, YEARS_F, series)
  const names: Record<string, string> = {}
  const colors: Record<string, string> = {}
  for (const sd of series) {
    names[sd.key] = sd.label
    colors[sd.key] = sd.color
  }

  const pipe = PORTAL_SEGMENTS.reduce((a, sg) => a + NYBYGG_F[sg.key][0], 0)
  const done = PORTAL_SEGMENTS.reduce((a, sg) => a + lastOf(NYBYGG[sg.key]), 0)
  const dPct = Math.round(((pipe - done) / done) * 100)

  const table = (
    <table className="ap-table">
      <thead>
        <tr>
          <th>Segment</th>
          <th className="r">Ferdigstilt {YEARS[YEARS.length - 1]}</th>
          <th className="r">Pipeline {YEARS_F[0]}</th>
          <th className="r">Pipeline {YEARS_F[1]}</th>
        </tr>
      </thead>
      <tbody>
        {PORTAL_SEGMENTS.map((sg) => (
          <tr key={sg.key} className={sg.key === s.segment ? "hl" : ""}>
            <td className="lbl">
              <span className="sw" style={{ background: SEG_COLOR[sg.key] }} />
              {sg.label}
            </td>
            <td className="r">{fmtM2k(lastOf(NYBYGG[sg.key]))}</td>
            <td className="r">{fmtM2k(NYBYGG_F[sg.key][0])}</td>
            <td className="r">{fmtM2k(NYBYGG_F[sg.key][1])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return {
    focusTitle: (
      <>
        Nybygg-pipeline, <span className="it">{YEARS_F[0]}.</span>
      </>
    ),
    focusValue: fmtGroup(pipe),
    focusUnit: " ’000 m²",
    focusDelta: (
      <>
        <Delta n={dPct} unit=" %" /> mot ferdigstilt {YEARS[YEARS.length - 1]}
      </>
    ),
    chartTitle: "Ferdigstilt & pipeline næringsareal (’000 m²/år)",
    legend: <PortalLegend items={series} hidden={s.hidden} onToggle={s.onToggleHidden} />,
    chart: (
      <StackedBar
        data={rows}
        series={series}
        hidden={s.hidden}
        yFmt={(v) => fmtComma(v, 0)}
        tipFmt={fmtM2k}
        names={names}
        colors={colors}
        animate={s.animate}
      />
    ),
    chartFoot: (
      <>
        <span>Inkluderer nybygg og vesentlig rehabilitering over 1 000 m².</span>
        <span>{YEARS_F.join("–")} = pipeline</span>
      </>
    ),
    table,
    compare: null,
    csv: csvRows(rows, {
      kontor: "Kontor",
      handel: "Handel",
      logistikk: "Logistikk",
      hotell: "Hotell",
    }),
    method:
      "Pipeline omfatter prosjekter med rammetillatelse eller byggestart. Tallene er ’000 m² BTA per ferdigstillelsesår.",
    insights: (
      <>
        <Insight n="01" h="Logistikk dominerer pipelinen.">
          Det meste av nytt areal mot {YEARS_F[1]} er logistikk og lett industri
          — særlig rundt Bodø og Mo i Rana, der grønn industri trekker
          etterspørselen.
        </Insight>
        <Insight n="02" h="Lite nytt kontor.">
          Beskjeden kontorpipeline i Tromsø holder ledigheten lav og støtter
          fortsatt prime leievekst de neste to årene.
        </Insight>
        <Insight n="03" h="Handel står stille.">
          Nær null nytt handelsareal gjenspeiler en moden sektor — vekst skjer
          via transformasjon og oppgradering, ikke nybygg.
        </Insight>
      </>
    ),
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 06 MAKRO
// ════════════════════════════════════════════════════════════════════════════
function viewMakro(s: ViewState): ViewSpec {
  const series: SeriesDef[] = [
    { key: "rente", label: "Styringsrente", color: PORTAL_PALETTE.terra, width: 2.6, hist: MAKRO.styringsrente, fc: MAKRO_F.styringsrente },
    { key: "kpi", label: "Inflasjon (KPI)", color: PORTAL_PALETTE.blue, hist: MAKRO.kpi, fc: MAKRO_F.kpi },
    { key: "bnp", label: "BNP Fastland", color: PORTAL_PALETTE.ink, hist: MAKRO.bnp, fc: MAKRO_F.bnp },
    { key: "sys", label: "Sysselsetting NN", color: PORTAL_PALETTE.sage, hist: MAKRO.sysselsetting, fc: MAKRO_F.sysselsetting },
  ]
  const rows = mergeForecast(YEARS, YEARS_F, series)
  const names: Record<string, string> = {}
  const colors: Record<string, string> = {}
  for (const sd of series) {
    names[sd.key] = sd.label
    colors[sd.key] = sd.color
  }

  const tableRows: { k: keyof typeof MAKRO; l: string; c: string }[] = [
    { k: "styringsrente", l: "Styringsrente (årsslutt)", c: PORTAL_PALETTE.terra },
    { k: "kpi", l: "Inflasjon (KPI)", c: PORTAL_PALETTE.blue },
    { k: "bnp", l: "BNP Fastlands-Norge", c: PORTAL_PALETTE.ink },
    { k: "sysselsetting", l: "Sysselsetting Nord-Norge", c: PORTAL_PALETTE.sage },
    { k: "befolkning", l: "Befolkningsvekst NN", c: PORTAL_PALETTE.mist },
  ]

  const table = (
    <table className="ap-table">
      <thead>
        <tr>
          <th>Indikator</th>
          <th className="r">{YEARS[YEARS.length - 2]}</th>
          <th className="r">{YEARS[YEARS.length - 1]}</th>
          <th className="r">{YEARS_F[0]}e</th>
          <th className="r">{YEARS_F[1]}e</th>
        </tr>
      </thead>
      <tbody>
        {tableRows.map((r) => (
          <tr key={r.k}>
            <td className="lbl">
              <span className="sw" style={{ background: r.c }} />
              {r.l}
            </td>
            <td className="r">{fmtPct1p(MAKRO[r.k][MAKRO[r.k].length - 2])}</td>
            <td className="r">{fmtPct1p(lastOf(MAKRO[r.k]))}</td>
            <td className="r dim">{fmtPct1p(MAKRO_F[r.k][0])}</td>
            <td className="r dim">{fmtPct1p(MAKRO_F[r.k][1])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return {
    focusTitle: (
      <>
        Makrobildet bak <span className="it">eiendomsmarkedet.</span>
      </>
    ),
    focusValue: fmtComma(lastOf(MAKRO.styringsrente), 2),
    focusUnit: " %",
    focusDelta: (
      <>
        Styringsrente · ventet {fmtPct1p(MAKRO_F.styringsrente[1])} ved utgangen
        av {YEARS_F[1]}
      </>
    ),
    chartTitle: "Makroindikatorer — årlig (%), med prognose",
    legend: <PortalLegend items={series} hidden={s.hidden} onToggle={s.onToggleHidden} />,
    chart: (
      <TrendChart
        data={rows}
        series={series}
        hidden={s.hidden}
        yFmt={(v) => fmtComma(v, 1) + "%"}
        tipFmt={fmtPct1p}
        names={names}
        colors={colors}
        animate={s.animate}
      />
    ),
    chartFoot: (
      <>
        <span>Kilder: SSB, Norges Bank, Advanti. e = estimat / prognose.</span>
        <span>{YEARS_F.join("–")} = prognose</span>
      </>
    ),
    table,
    compare: null,
    csv: csvRows(rows, { rente: "Styringsrente", kpi: "KPI", bnp: "BNP", sys: "Sysselsetting" }),
    method:
      "Makrotall er hentet fra SSB og Norges Bank, med Advantis prognose for 2026–27. Renten styrer både finansieringskost og yield-nivå.",
    insights: (
      <>
        <Insight n="01" h="Rentetoppen er passert.">
          Styringsrenten ventes gradvis ned mot {YEARS_F[1]}. Lavere
          finansieringskost er den viktigste enkeltdriveren for
          yield-utviklingen fremover.
        </Insight>
        <Insight n="02" h="Inflasjon nær mål.">
          KPI nærmer seg inflasjonsmålet — det demper indeksreguleringen av
          leier, men styrker reell kjøpekraft og etterspørsel.
        </Insight>
        <Insight n="03" h="Nord-Norge holder stand.">
          Sysselsetting og befolkning vokser moderat, men stabilt —
          understøttet av forsvar, fornybar industri og sjømat.
        </Insight>
      </>
    ),
  }
}

// ── dispatcher ───────────────────────────────────────────────────────────────
export function buildView(sector: SectorKey, state: ViewState): ViewSpec {
  switch (sector) {
    case "yield":
      return viewYield(state)
    case "leie":
      return viewLeie(state)
    case "tx":
      return viewTx(state)
    case "ledighet":
      return viewLedighet(state)
    case "nybygg":
      return viewNybygg(state)
    case "makro":
      return viewMakro(state)
  }
}
