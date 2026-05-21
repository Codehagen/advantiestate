import { constructMetadata } from "@/lib/utils"
import { SubHero } from "@/components/site/SubHero"
import { CtaStrip } from "@/components/site/CtaStrip"
import { MarkedsinnsiktShell } from "@/components/markedsinnsikt/MarkedsinnsiktShell"

export const metadata = constructMetadata({
  title: "Markedsinnsikt for næringseiendom | Advanti",
  description:
    "Få tilgang til omfattende markedsdata og analyser for næringseiendom. Utforsk sanntids markedstrender og yield-analyser for smarte investeringer..",
})

export default function MarkedsinnsiktPage() {
  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Markedsinnsikt" }]}
        eyebrow="Marked & data · Nord-Norge"
        title={
          <>
            Det skarpeste bildet av <br />
            <span className="italic">
              næringseiendoms­markedet i landsdelen.
            </span>
          </>
        }
        lede="Vi sporer +1 400 næringseiendommer i Nord-Norge — kvartal for kvartal. Yield, markedsleie, transaksjons­volum og ledighet, segmentert på kontor, handel og logistikk, by for by."
      />

      {/* KPI BAND */}
      <section className="section-tight">
        <div className="wrap">
          <div className="mi-kpis">
            <div className="mi-kpi">
              <div className="label">Prime yield kontor</div>
              <div className="val">
                6,10<span className="unit">%</span>
              </div>
              <div className="delta">
                <span className="arrow-up">▲ 15 bps</span> siste 12 mnd · Tromsø
              </div>
            </div>
            <div className="mi-kpi">
              <div className="label">5 års SWAP (NOK)</div>
              <div className="val">
                3,82<span className="unit">%</span>
              </div>
              <div className="delta">
                <span className="arrow-down">▼ 8 bps</span> siste kvartal
              </div>
            </div>
            <div className="mi-kpi">
              <div className="label">Transaksjons­volum 2025</div>
              <div className="val">
                4,8<span className="unit">mrd</span>
              </div>
              <div className="delta">
                <span className="arrow-up">▲ 18 %</span> mot 2024
              </div>
            </div>
            <div className="mi-kpi">
              <div className="label">Kontorledighet Tromsø</div>
              <div className="val">
                3,4<span className="unit">%</span>
              </div>
              <div className="delta">
                <span className="arrow-down">▼ 60 bps</span> YoY · stramt marked
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHELL: sidebar + content */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="wrap">
          <MarkedsinnsiktShell />
        </div>
      </section>

      <CtaStrip
        eyebrow="Trenger du tallene for en spesifikk eiendom?"
        title={
          <>
            Skreddersydd analyse <br />
            <span className="italic">på din portefølje.</span>
          </>
        }
        sub="Vi kombinerer relevant markedsdata med eiendomsspesifikk innsikt og leverer en konkret rapport — typisk innen to uker."
        primary={{ label: "Bestill analyse", href: "/kontakt" }}
        secondary={{
          label: "Les om markedsdata-tjenesten",
          href: "/tjenester/radgivning",
        }}
      />
    </>
  )
}
