// Server-rendered (NO "use client") plain-text market data tables for
// /markedsinnsikt. The interactive MarkedsinnsiktShell renders only the active
// tab on the server and loads its charts client-only (ssr:false), so the bulk of
// the figures never reach the initial HTML. This component mirrors the same data
// (from ./marketData) as semantic tables that are always in the server HTML —
// crawlable and citable by Google and AI engines (ChatGPT, Claude, Perplexity),
// and a useful, accessible reference for visitors.
import {
  CITIES,
  YIELD,
  LEIE,
  VACANCY,
  TX,
  LATEST_QUARTER,
  fmtNoComma,
  fmtNum,
  fmtPct1,
  type Segment,
} from "./marketData"

const SEGMENTS: { key: Segment; label: string }[] = [
  { key: "kontor", label: "Kontor" },
  { key: "handel", label: "Handel" },
  { key: "logistikk", label: "Logistikk" },
]

const last = (arr: number[]) => arr[arr.length - 1]

// Flatten LEIE[segment][city] → latest value per (segment, city) pair.
const leieRows = SEGMENTS.flatMap((seg) =>
  Object.entries(LEIE[seg.key]).map(([city, values]) => ({
    segment: seg.label,
    city,
    value: last(values),
  })),
)

export function MarketDataSummary() {
  return (
    <section
      className="section section-divider"
      id="markedsdata-tall"
      aria-label={`Markedsdata i tall, ${LATEST_QUARTER}`}
    >
      <div className="wrap">
        <div className="head-compact">
          <span className="eyebrow">Markedsdata i tall · {LATEST_QUARTER}</span>
          <div>
            <h2>
              Tallene, <span className="italic">i ren tekst.</span>
            </h2>
            <p>
              Nøkkeltall for næringseiendom i Nord-Norge per {LATEST_QUARTER} —
              prime yield, markedsleie og ledighet, by for by og segment for
              segment. Samme datagrunnlag som de interaktive grafene over.
            </p>
          </div>
        </div>

        {/* Per-by snapshot */}
        <h3 className="mi-data-h3">Markedsoversikt per by</h3>
        <table className="mi-table">
          <caption className="sr-only">
            Prime yield, markedsleie og ledighet for kontor per by, {LATEST_QUARTER}
          </caption>
          <thead>
            <tr>
              <th>By</th>
              <th className="r">Prime yield (kontor)</th>
              <th className="r">Markedsleie kontor</th>
              <th className="r">Kontorledighet</th>
              <th>Kommentar</th>
            </tr>
          </thead>
          <tbody>
            {CITIES.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td className="r">{c.yield}</td>
                <td className="r">{c.leie}</td>
                <td className="r">{c.vac}</td>
                <td>{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Prime yield per segment */}
        <h3 className="mi-data-h3">Prime yield per segment</h3>
        <table className="mi-table">
          <caption className="sr-only">
            Prime yield per segment i Nord-Norge, {LATEST_QUARTER}
          </caption>
          <thead>
            <tr>
              <th>Segment</th>
              <th className="r">Prime yield {LATEST_QUARTER}</th>
            </tr>
          </thead>
          <tbody>
            {SEGMENTS.map((seg) => (
              <tr key={seg.key}>
                <td>{seg.label}</td>
                <td className="r">{fmtNoComma(last(YIELD[seg.key]))} %</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Markedsleie per segment & by */}
        <h3 className="mi-data-h3">Markedsleie per by og segment</h3>
        <table className="mi-table">
          <caption className="sr-only">
            Prime markedsleie i kr/m²/år per by og segment, {LATEST_QUARTER}
          </caption>
          <thead>
            <tr>
              <th>Segment</th>
              <th>By</th>
              <th className="r">Markedsleie {LATEST_QUARTER}</th>
            </tr>
          </thead>
          <tbody>
            {leieRows.map((row) => (
              <tr key={`${row.segment}-${row.city}`}>
                <td>{row.segment}</td>
                <td>{row.city}</td>
                <td className="r">{fmtNum(row.value)} kr/m²/år</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Ledighet per by & segment */}
        <h3 className="mi-data-h3">Ledighet per by og segment</h3>
        <table className="mi-table">
          <caption className="sr-only">
            Andel ledig næringsareal i prosent per by og segment, {LATEST_QUARTER}
          </caption>
          <thead>
            <tr>
              <th>By</th>
              <th className="r">Kontor</th>
              <th className="r">Handel</th>
              <th className="r">Logistikk</th>
            </tr>
          </thead>
          <tbody>
            {VACANCY.map((row) => (
              <tr key={row.city}>
                <td>{row.city}</td>
                <td className="r">{fmtPct1(row.kontor)}</td>
                <td className="r">{fmtPct1(row.handel)}</td>
                <td className="r">{fmtPct1(row.logistikk)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Recent transactions */}
        <h3 className="mi-data-h3">Utvalgte transaksjoner 2025</h3>
        <table className="mi-table">
          <caption className="sr-only">
            Utvalgte næringseiendomstransaksjoner i Nord-Norge, 2025
          </caption>
          <thead>
            <tr>
              <th>Dato</th>
              <th>Eiendom</th>
              <th>Segment</th>
              <th className="r">Verdi</th>
              <th className="r">Yield</th>
            </tr>
          </thead>
          <tbody>
            {TX.map((t) => (
              <tr key={t.name}>
                <td>{t.date}</td>
                <td>
                  {t.name}
                  <span className="mi-data-sub"> · {t.loc}</span>
                </td>
                <td>{t.seg}</td>
                <td className="r">{t.value}</td>
                <td className="r">{t.yield}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mi-footnote" style={{ marginTop: 24 }}>
          <span className="source">
            Tall er indikative og reflekterer prime kvalitet. Kilde: Advanti
            markedsdata. For en konkret vurdering av din eiendom — ta kontakt.
          </span>
          <span>{LATEST_QUARTER} · Advanti</span>
        </div>
      </div>
    </section>
  )
}
