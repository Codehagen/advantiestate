import Link from "next/link"
import { constructMetadata } from "@/lib/utils"
import { MI_KPIS } from "@/components/markedsinnsikt/portalSeries"
import { SubHero } from "@/components/site/SubHero"
import { CtaStrip } from "@/components/site/CtaStrip"
import { NewsletterSection } from "@/components/site/NewsletterSection"
import { MarkedsinnsiktShell } from "@/components/markedsinnsikt/MarkedsinnsiktShell"
import { MarketDataSummary } from "@/components/markedsinnsikt/MarketDataSummary"

export const metadata = constructMetadata({
  path: "/markedsinnsikt",
  title: "Markedsinnsikt for næringseiendom | Advanti Estate",
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

      {/* KPI BAND — derived from the shared release-anchored series (no
          hardcoded numbers: portal and overview can never drift apart). */}
      <section className="section-tight">
        <div className="wrap">
          <div className="mi-kpis">
            {MI_KPIS.map((k) => (
              <div className="mi-kpi" key={k.label}>
                <div className="label">{k.label}</div>
                <div className="val">
                  {k.value}
                  <span className="unit">{k.unit}</span>
                </div>
                <div className="delta">
                  <span
                    className={
                      k.dir === "up"
                        ? "arrow-up"
                        : k.dir === "down"
                          ? "arrow-down"
                          : undefined
                    }
                  >
                    {k.dir === "up" ? "▲ " : k.dir === "down" ? "▼ " : "→ "}
                    {k.delta.replace(/^[+−]/, "")}
                  </span>{" "}
                  {k.sub}
                </div>
              </div>
            ))}
          </div>
          <p className="mi-deeplink">
            <Link href="/analyseportal">
              Gå dypere i analyseportalen — interaktive serier, prognoser og
              CSV-eksport →
            </Link>
          </p>
        </div>
      </section>

      {/* SHELL: sidebar + content */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="wrap">
          <MarkedsinnsiktShell />
        </div>
      </section>

      {/* Server-rendered data tables — always in the initial HTML for crawlers
          and AI engines (the shell above renders only the active tab + charts
          client-side). */}
      <MarketDataSummary />

      <NewsletterSection
        source="markedsinnsikt"
        eyebrow="Få markedsinnsikt før alle andre"
        title={
          <>
            Markedsdata, ferskt <span className="italic">på epost.</span>
          </>
        }
        description="Kvartalsvis markedsbrev med yield, leiepriser, transaksjoner og kommentarer fra senior partner. For eiendomsbesittere og investorer i Nord-Norge."
      />

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
