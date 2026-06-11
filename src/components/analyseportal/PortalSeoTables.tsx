// Server-rendered canonical data tables for /analyseportal — always in the
// initial HTML for crawlers and AI engines (the interactive shell renders
// charts client-side only). Compact: one table per sector, current snapshot +
// key deltas — not full series dumps (DOM budget).

import {
  PORTAL_SEGMENTS,
  PORTAL_CITIES,
  PORTAL_YIELD,
  PORTAL_RATES,
  PORTAL_LEIE,
  PORTAL_VOLUME,
  PORTAL_VOLUME_F,
  VAC_NOW,
  NYBYGG,
  NYBYGG_F,
  MAKRO,
  MAKRO_F,
  YEARS,
  YEARS_F,
  PORTAL_LATEST,
  lastOf,
  bpsChange,
  fmtPct2p,
  fmtPct1p,
  fmtKrM2,
  fmtMrd,
  fmtM2k,
} from "@/components/markedsinnsikt/portalSeries"
import { VOLUME } from "@/components/markedsinnsikt/marketData"

function DeltaText({ n, unit }: { n: number; unit: string }) {
  if (n === 0) return <>uendret</>
  return (
    <>
      {n > 0 ? "+" : "−"}
      {Math.abs(n)}
      {unit}
    </>
  )
}

export function PortalSeoTables() {
  const q = PORTAL_LATEST.quarter
  const lastYear = YEARS[YEARS.length - 1]
  return (
    <section
      id="analyseportal-tall"
      className="section-tight"
      aria-label={`Markedstall næringseiendom Nord-Norge — ${q}`}
    >
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Tallene bak portalen · {q}</span>
          <h2>
            Markedstall, <span className="italic">som tabell.</span>
          </h2>
          <p>
            Samme tall som i de interaktive grafene over — prime yield,
            markedsleie, transaksjonsvolum, ledighet, nybygg og makro for
            Nord-Norge. Prognoser er Advantis basisscenario.
          </p>
        </div>

        <div className="ap-seo-tables">
          <div>
            <h3>Prime yield per segment ({q})</h3>
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th className="r">Prime yield</th>
                  <th className="r">12 mnd</th>
                  <th className="r">Spread vs 5 års SWAP</th>
                </tr>
              </thead>
              <tbody>
                {PORTAL_SEGMENTS.map((s) => (
                  <tr key={s.key}>
                    <td className="lbl">{s.label}</td>
                    <td className="r">{fmtPct2p(lastOf(PORTAL_YIELD[s.key]))}</td>
                    <td className="r">
                      <DeltaText n={bpsChange(PORTAL_YIELD[s.key], 4)} unit=" bps" />
                    </td>
                    <td className="r">
                      {fmtPct2p(lastOf(PORTAL_YIELD[s.key]) - lastOf(PORTAL_RATES.swap5y))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3>Prime markedsleie kontor per by ({q})</h3>
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
                    <td className="lbl">{c}</td>
                    <td className="r">{fmtKrM2(lastOf(PORTAL_LEIE.kontor[c]))}</td>
                    <td className="r">{fmtKrM2(lastOf(PORTAL_LEIE.handel[c]))}</td>
                    <td className="r">{fmtKrM2(lastOf(PORTAL_LEIE.logistikk[c]))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3>Transaksjonsvolum per segment (mrd NOK)</h3>
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th className="r">{YEARS[YEARS.length - 2]}</th>
                  <th className="r">{lastYear}</th>
                  <th className="r">{YEARS_F[0]}e</th>
                </tr>
              </thead>
              <tbody>
                {PORTAL_SEGMENTS.map((s) => (
                  <tr key={s.key}>
                    <td className="lbl">{s.label}</td>
                    <td className="r">
                      {fmtMrd(PORTAL_VOLUME[s.key][PORTAL_VOLUME[s.key].length - 2])}
                    </td>
                    <td className="r">{fmtMrd(lastOf(PORTAL_VOLUME[s.key]))}</td>
                    <td className="r dim">{fmtMrd(PORTAL_VOLUME_F[s.key][0])}</td>
                  </tr>
                ))}
                <tr>
                  <td className="lbl strong">Totalt</td>
                  <td className="r strong">{fmtMrd(VOLUME.total[VOLUME.total.length - 2])}</td>
                  <td className="r strong">{fmtMrd(lastOf(VOLUME.total))}</td>
                  <td className="r dim">
                    {fmtMrd(PORTAL_SEGMENTS.reduce((a, s) => a + PORTAL_VOLUME_F[s.key][0], 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3>Arealledighet per by og segment ({q})</h3>
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
                    <td className="lbl">{c}</td>
                    <td className="r">{fmtPct1p(VAC_NOW.kontor[c])}</td>
                    <td className="r">{fmtPct1p(VAC_NOW.handel[c])}</td>
                    <td className="r">{fmtPct1p(VAC_NOW.logistikk[c])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3>Nybygg og pipeline (’000 m² BTA)</h3>
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th className="r">Ferdigstilt {lastYear}</th>
                  <th className="r">Pipeline {YEARS_F[0]}</th>
                  <th className="r">Pipeline {YEARS_F[1]}</th>
                </tr>
              </thead>
              <tbody>
                {PORTAL_SEGMENTS.map((s) => (
                  <tr key={s.key}>
                    <td className="lbl">{s.label}</td>
                    <td className="r">{fmtM2k(lastOf(NYBYGG[s.key]))}</td>
                    <td className="r dim">{fmtM2k(NYBYGG_F[s.key][0])}</td>
                    <td className="r dim">{fmtM2k(NYBYGG_F[s.key][1])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3>Makroindikatorer (%, årlig)</h3>
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Indikator</th>
                  <th className="r">{YEARS[YEARS.length - 1]}</th>
                  <th className="r">{YEARS_F[0]}e</th>
                  <th className="r">{YEARS_F[1]}e</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["styringsrente", "Styringsrente (årsslutt)"],
                    ["kpi", "Inflasjon (KPI)"],
                    ["bnp", "BNP Fastlands-Norge"],
                    ["sysselsetting", "Sysselsetting Nord-Norge"],
                    ["befolkning", "Befolkningsvekst Nord-Norge"],
                  ] as const
                ).map(([k, label]) => (
                  <tr key={k}>
                    <td className="lbl">{label}</td>
                    <td className="r">{fmtPct1p(lastOf(MAKRO[k]))}</td>
                    <td className="r dim">{fmtPct1p(MAKRO_F[k][0])}</td>
                    <td className="r dim">{fmtPct1p(MAKRO_F[k][1])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
