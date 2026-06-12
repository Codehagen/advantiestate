import Link from "next/link"
import { allPersonPosts } from "content-collections"
import { constructMetadata } from "@/lib/utils"
import { siteConfig } from "@/app/siteConfig"
import { jsonLdScriptProps } from "@/lib/jsonLd"
import { CtaStrip } from "@/components/site/CtaStrip"
import { NewsletterSection } from "@/components/site/NewsletterSection"
import { AnalyseportalShell } from "@/components/analyseportal/AnalyseportalShell"
import { PortalSeoTables } from "@/components/analyseportal/PortalSeoTables"
import {
  PORTAL_KPIS,
  PORTAL_LATEST,
  NEXT_RELEASE_DATE,
} from "@/components/markedsinnsikt/portalSeries"

export const metadata = constructMetadata({
  path: "/analyseportal",
  title: "Analyseportal — markedsdata for næringseiendom i Nord-Norge | Advanti Estate",
  description:
    "Interaktiv analyseportal for næringseiendom i Nord-Norge: prime yield, markedsleie, transaksjonsvolum, arealledighet, nybygg og makro — kvartal for kvartal, by for by. Last ned tallene som CSV.",
})

// Quarter label → ISO interval, e.g. "Q4 2025" → "2025-10/2025-12".
function quarterToIso(quarter: string): string {
  const m = quarter.match(/Q(\d)\s+(\d{4})/)
  if (!m) return quarter
  const q = parseInt(m[1], 10)
  const start = String((q - 1) * 3 + 1).padStart(2, "0")
  const end = String(q * 3).padStart(2, "0")
  return `${m[2]}-${start}/${m[2]}-${end}`
}

export default function AnalyseportalPage() {
  const analystPost = allPersonPosts.find((p) => p.slug === "christer-hagen")
  const analyst = analystPost
    ? {
        name: analystPost.name,
        role: analystPost.role,
        photoUrl: analystPost.avatar ?? null,
        href: `/personer/${analystPost.slug}`,
      }
    : null

  const baseUrl = siteConfig.url
  // Own Dataset identity — must NOT collide with /presserom#dataset.
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${baseUrl}/analyseportal#dataset`,
    name: `Analyseportal — markedsdata næringseiendom Nord-Norge (${PORTAL_LATEST.quarter})`,
    description:
      "Kvartalsvise markedsserier for næringseiendom i Nord-Norge: prime yield per segment, prime markedsleie per by, transaksjonsvolum, arealledighet, nybygg-pipeline og makroindikatorer. Prognoser er Advantis basisscenario.",
    url: `${baseUrl}/analyseportal`,
    creator: { "@id": `${baseUrl}/#organization` },
    temporalCoverage: `2021-01/${quarterToIso(PORTAL_LATEST.quarter).split("/")[1]}`,
    spatialCoverage: { "@type": "Place", name: "Nord-Norge" },
    variableMeasured: [
      "Prime yield (kontor, handel, logistikk, hotell)",
      "Prime markedsleie per by",
      "Transaksjonsvolum",
      "Arealledighet",
      "Nybygg og pipeline",
      "Makroindikatorer",
    ],
    dateModified: PORTAL_LATEST.publishedAt,
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: `${baseUrl}/analyseportal`,
    },
    inLanguage: "nb-NO",
  }

  return (
    <>
      <script {...jsonLdScriptProps(datasetSchema)} />

      {/* HERO (dark) */}
      <section className="ap-hero">
        <div className="wrap">
          <nav className="crumb" aria-label="Brødsmuler">
            <Link href="/">Hjem</Link>
            <span className="sep" aria-hidden="true">/</span>
            <Link href="/markedsinnsikt">Markedsinnsikt</Link>
            <span className="sep" aria-hidden="true">/</span>
            <span className="here">Analyseportal</span>
          </nav>
          <div className="ap-hero-grid">
            <div>
              <span className="pre">Kvartalsdata · Nord-Norge</span>
              <h1>
                Analyse&shy;portalen.
                <br />
                <span className="italic">Markedet, i tall.</span>
              </h1>
            </div>
            <p className="lede">
              Yield, leie, transaksjoner, ledighet, nybygg og makro —{" "}
              <strong>interaktivt, segmentert og by for by</strong>. Kvartal for
              kvartal siden 2021, oppdatert per {PORTAL_LATEST.quarter}. Neste
              oppdatering {NEXT_RELEASE_DATE}.
            </p>
          </div>
          <div className="ap-ticker">
            {PORTAL_KPIS.map((k) => (
              <div className="k" key={k.label}>
                <div className="lab">{k.label}</div>
                <div className="val">
                  {k.value}
                  <span className="u">{k.unit}</span>
                </div>
                <div className="d">
                  <span className={k.dir}>{k.delta}</span>
                  <span>{k.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div id="hero-sentinel" aria-hidden="true" />

      {/* APP */}
      <AnalyseportalShell analyst={analyst} />

      {/* Server-rendered canonical tables — crawler/AI content + the charts'
          accessible data alternative. */}
      <PortalSeoTables />

      <NewsletterSection
        source="analyseportal"
        eyebrow="Få tallene før alle andre"
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
        sub="Vi kombinerer portaldata med eiendomsspesifikk innsikt og leverer en konkret rapport — typisk innen to uker."
        primary={{ label: "Bestill analyse", href: "/kontakt" }}
        secondary={{
          label: "Les om markedsdata-tjenesten",
          href: "/tjenester/radgivning",
        }}
      />
    </>
  )
}
