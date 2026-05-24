import { constructMetadata } from "@/lib/utils"
import { SubHero } from "@/components/site/SubHero"
import { CtaStrip } from "@/components/site/CtaStrip"
import { MarkedsrapportGate } from "./MarkedsrapportGate"

export const metadata = constructMetadata({
  path: "/markedsrapport",
  title: "Markedsrapport Q4 2025 — næringseiendom Nord-Norge | Advanti",
  description:
    "Last ned Advanti sin kvartalsvise markedsrapport for næringseiendom i Nord-Norge. Yield, leiepriser, transaksjoner og kommentarer fra senior partner.",
})

// Update each quarter — RAPPORT_FILE is the path the post-signup download
// button points at. Drop the new PDF in /public/downloads/ and bump these
// constants when a new quarterly issue ships.
const RAPPORT_FILE = "/downloads/markedsrapport-q4-2025.pdf"
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

      <MarkedsrapportGate fileUrl={RAPPORT_FILE} label={RAPPORT_LABEL} />

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
