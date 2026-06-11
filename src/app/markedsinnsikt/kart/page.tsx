import { MarkedsKartClient } from "@/components/markedsinnsikt/maps/MarkedsKartClient"
import { MarkedsKartNordNorge } from "@/components/markedsinnsikt/maps/MarkedsKartNordNorge"
import { LATEST_RELEASE } from "@/components/markedsinnsikt/marketReleases"
import { CtaStrip } from "@/components/site/CtaStrip"
import { SubHero } from "@/components/site/SubHero"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  path: "/markedsinnsikt/kart",
  title: "Markedskart Nord-Norge — næringseiendom by for by | Advanti Estate",
  description:
    "Interaktivt markedskart for næringseiendom i Nord-Norge. Sammenlign yield, leie og ledighet by for by — Tromsø, Bodø, Alta, Narvik, Harstad og Mo i Rana — pluss indikative prissoner i Bodø.",
})

// Stamp derived from the release register — never hand-edited copy.
// UTC getters: publishedAt is date-only ISO (UTC midnight); local-TZ getters
// would render the previous day on any build machine west of UTC.
function publishedStamp(): string {
  const d = new Date(LATEST_RELEASE.publishedAt)
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAI", "JUN",
    "JUL", "AUG", "SEP", "OKT", "NOV", "DES",
  ]
  return `OPPDATERT ${d.getUTCDate()}. ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export default function MarkedskartPage() {
  return (
    <>
      <SubHero
        crumb={[
          { label: "Markedsinnsikt", href: "/markedsinnsikt" },
          { label: "Markedskart" },
        ]}
        eyebrow="Markedskart · Nord-Norge"
        title={
          <>
            Markedet, <br />
            <span className="italic">by for by.</span>
          </>
        }
        lede="Velg et nøkkeltall og se hvordan næringseiendomsmarkedet varierer på tvers av landsdelen. Boblene viser nivået for hver by — klikk for detaljer og direkte vei videre til byens megler eller full analyse."
      >
        <div className="km-intro-meta">
          <div>
            <span className="v">{LATEST_RELEASE.cities.length}</span>
            <span className="l">Byer dekket</span>
          </div>
          <div>
            <span className="v">3</span>
            <span className="l">Nøkkeltall</span>
          </div>
          <div>
            <span className="v">+1 400</span>
            <span className="l">Eiendommer sporet</span>
          </div>
          <div>
            <span className="v">{LATEST_RELEASE.quarter}</span>
            <span className="l">Oppdatert</span>
          </div>
        </div>
      </SubHero>

      {/* INTERAKTIVT KART */}
      <section
        className="section section-divider km-map"
        style={{ paddingTop: 64 }}
      >
        <div className="wrap">
          <div className="mi-section-head">
            <div>
              <span
                className="eyebrow"
                style={{ marginBottom: 18, display: "inline-flex" }}
              >
                Interaktivt kart
              </span>
              <h2>
                Klikk en by. <span className="italic">Les markedet.</span>
              </h2>
            </div>
            <div className="updated">
              <span className="live">{publishedStamp()}</span>
              <span>Yield, leie og ledighet — {LATEST_RELEASE.quarter}</span>
            </div>
          </div>

          <MarkedsKartNordNorge />

          <div className="mi-footnote">
            <span className="source">
              Kartet er stilisert. Boblene viser valgt nøkkeltall by for by —
              størrelse og farge følger nivået.
            </span>
            <span>
              {LATEST_RELEASE.cities.length} byer · {LATEST_RELEASE.quarter} ·
              indikative tall
            </span>
          </div>
        </div>
      </section>

      {/* SLIK LESER DU KARTET */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Slik leser du kartet</span>
            <div>
              <h2>
                Tre mønstre <span className="italic">verdt å merke seg.</span>
              </h2>
              <p>
                Det geografiske bildet forteller mer enn en tabell. Her er
                hovedtrekkene per {LATEST_RELEASE.quarter}.
              </p>
            </div>
          </div>

          <div className="mi-insights">
            <div className="mi-insight">
              <div className="ipre">01 — Yield</div>
              <h3>Avkastningskravet stiger nordover og innover.</h3>
              <p>
                Tromsø og Bodø har de laveste yieldene — størst likviditet og
                dypest leietakermarked. Narvik og Mo i Rana ligger høyest, der
                færre transaksjoner gir høyere risikopåslag.
              </p>
            </div>
            <div className="mi-insight">
              <div className="ipre">02 — Leie</div>
              <h3>Leienivået følger befolknings­tyngden.</h3>
              <p>
                Prime kontorleie er klart høyest i Tromsø, fulgt av Bodø.
                Forskjellen til de mindre byene er betydelig — et speil av
                etterspørsel fra offentlig sektor og privat næringsliv.
              </p>
            </div>
            <div className="mi-insight">
              <div className="ipre">03 — Ledighet</div>
              <h3>De største markedene er strammest.</h3>
              <p>
                Tromsø har lavest ledighet og dermed mest press på leiene.
                Narvik høyest — men det handler mer om eldre bygningsmasse enn
                manglende etterspørsel etter klasse A.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DYPDYKK: PRISSONER I BODØ — the original /markedsinnsikt/kart map */}
      <section className="section section-divider">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Dypdykk · Bodø</span>
            <div>
              <h2>
                Indikative leieprissoner{" "}
                <span className="italic">i Bodø.</span>
              </h2>
              <p>
                Kartet deler Bodø inn i indikative prissoner for
                næringslokaler, basert på Advantis egne transaksjons- og
                leiedata — segmentert på kontor, handel og logistikk. Slå på
                laget med offisielle eiendomsgrenser fra Kartverket for å se
                sonene mot faktiske matrikkelenheter. Tallene er indikative
                estimater og erstatter ikke en konkret verdivurdering.
              </p>
            </div>
          </div>
        </div>
        <div className="pr-4">
          <MarkedsKartClient />
        </div>
      </section>

      <CtaStrip
        eyebrow="Vil du grave dypere?"
        title={
          <>
            Hele tidsserien <br />
            <span className="italic">i Analyseportalen.</span>
          </>
        }
        sub="Kartet viser øyeblikksbildet. I Analyseportalen finner du utviklingen kvartal for kvartal, alle segmenter og byer — med prognoser og nedlastbare data."
        primary={{ label: "Åpne Analyseportalen", href: "/analyseportal" }}
        secondary={{ label: "Bestill markedsrapport", href: "/kontakt" }}
      />
    </>
  )
}
