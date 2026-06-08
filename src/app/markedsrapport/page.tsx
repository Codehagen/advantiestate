import Link from "next/link"
import { constructMetadata } from "@/lib/utils"
import { SubHero } from "@/components/site/SubHero"
import { CtaStrip } from "@/components/site/CtaStrip"
import { CITIES } from "@/components/markedsinnsikt/marketData"
import { MarkedsrapportGate } from "./MarkedsrapportGate"

export const metadata = constructMetadata({
  path: "/markedsrapport",
  title: "Markedsrapport Q4 2025 — næringseiendom Nord-Norge | Advanti",
  description:
    "Last ned Advanti sin kvartalsvise markedsrapport for næringseiendom i Nord-Norge. Yield, leiepriser, transaksjoner og kommentarer fra senior partner.",
})

// Report label shown in the email-gate copy. Bump each quarter. The report is
// distributed by email at each issue (no immediate file download), so there is
// no PDF path to maintain here.
const RAPPORT_LABEL = "Markedsrapport Q4 2025"

const INSIDE = [
  {
    pre: "01 · Kapittel",
    title: "Prime yield per by",
    body: "Kontor, handel og logistikk i Bodø, Tromsø, Alta og Harstad — målt mot 5-års SWAP og historiske spread.",
    meta: ["4 byer", "3 segmenter"],
  },
  {
    pre: "02 · Kapittel",
    title: "Leieprisutvikling",
    body: "Q-over-Q og 4-års trend per by og segment. Hvor presset markedet er — og hvor det er rom.",
    meta: ["Q-over-Q", "4-års trend"],
  },
  {
    pre: "03 · Kapittel",
    title: "Transaksjonsoversikt",
    body: "Avsluttede salg over 20M NOK i 2025 i Nord-Norge, med faktiske yield-tall der vi har dem.",
    meta: ["Salg > 20M", "Faktiske yields"],
  },
  {
    pre: "04 · Kapittel",
    title: "Ledighet og etterspørsel",
    body: "Vakanser i kontorbygg i sentrum, etterspørsel etter lager/logistikk, og hvem som faktisk leier.",
    meta: ["Sentrum + havn", "Aktive leietakere"],
  },
  {
    pre: "05 · Kapittel",
    title: "Kommentar fra senior partner",
    body: "Hva vi ser at andre meglere ikke ser — og hva vi ville gjort om vi var deg.",
    meta: ["Christer Hagen", "Subjektivt"],
  },
]

export default function MarkedsrapportPage() {
  return (
    <>
      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Markedsrapport" },
        ]}
        eyebrow="Markedsrapport · Q4 2025"
        title={
          <>
            Næringseiendom Nord-Norge{" "}
            <span className="italic">— hva vi ser i markedet.</span>
          </>
        }
        lede="Kvartalsvis rapport med yield, leiepriser, transaksjoner og kommentarer fra senior partner. For eiendomsbesittere og investorer som vil ha tallene før alle andre."
        metaRow={[
          { value: "18", label: "sider" },
          { value: "Q4", label: "2025" },
          { value: "Jan", label: "2026" },
        ]}
      />

      <section className="section section-divider">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Innhold</span>
            <div>
              <h2>
                Det vi har samlet for deg{" "}
                <span className="italic">denne gangen.</span>
              </h2>
              <p>
                Fem kapitler. Tabeller, kart, grafer og kommentar — strukturert
                slik at du kan lese det på 20 minutter eller bruke et halvår
                med det.
              </p>
            </div>
          </div>

          <div className="method-grid">
            {INSIDE.map((row) => (
              <div className="method" key={row.pre}>
                <div className="pre">{row.pre}</div>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
                <div className="meta">
                  {row.meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ungated, crawlbart HTML-sammendrag — de faktiske tallene, ikke bare
          låst i PDF. Gir Google og AI-motorer noe å rangere/sitere; full
          databredde + interaktive grafer ligger på /markedsinnsikt. */}
      <section className="section section-divider" id="sammendrag">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Sammendrag · Q4 2025</span>
            <div>
              <h2>
                Markedet i tall, <span className="italic">by for by.</span>
              </h2>
              <p>
                Næringseiendomsmarkedet i Nord-Norge går inn i 2026 med lav
                ledighet og stabil etterspørsel. Tromsø er strammest med 3,4 %
                kontorledighet og landsdelens laveste yield; de mindre byene
                prises høyere, drevet av lavere likviditet snarere enn svak
                etterspørsel. Tabellen under viser prime yield (kontor),
                markedsleie og kontorledighet per by per Q4 2025.
              </p>
            </div>
          </div>

          <table className="mi-table">
            <caption className="sr-only">
              Prime yield, markedsleie og kontorledighet per by, Q4 2025
            </caption>
            <thead>
              <tr>
                <th>By</th>
                <th className="r">Prime yield (kontor)</th>
                <th className="r">Markedsleie kontor</th>
                <th className="r">Kontorledighet</th>
              </tr>
            </thead>
            <tbody>
              {CITIES.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="r">{c.yield}</td>
                  <td className="r">{c.leie}</td>
                  <td className="r">{c.vac}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mi-footnote" style={{ marginTop: 24 }}>
            <span className="source">
              Tall er indikative og reflekterer prime kvalitet. Full segmentert
              databredde (kontor, handel, logistikk) på{" "}
              <Link href="/markedsinnsikt">markedsinnsikt</Link>.
            </span>
            <span>Q4 2025 · Advanti markedsdata</span>
          </div>
        </div>
      </section>

      <MarkedsrapportGate label={RAPPORT_LABEL} />

      <CtaStrip
        eyebrow="Vil du ha rapporten tilpasset din eiendom?"
        title={
          <>
            Vi tilbyr <span className="italic">skreddersydd analyse.</span>
          </>
        }
        sub="Markedsdata kombinert med eiendomsspesifikk innsikt — konkret rapport innen to uker. Uforpliktende."
        primary={{ label: "Bestill analyse", href: "/kontakt" }}
        secondary={{ label: "Se markedsinnsikt", href: "/markedsinnsikt" }}
      />
    </>
  )
}
