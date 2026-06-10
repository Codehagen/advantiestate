import { notFound } from "next/navigation"
import Link from "next/link"

import { constructMetadata } from "@/lib/utils"
import { SubHero } from "@/components/site/SubHero"
import { BreadcrumbStructuredData } from "@/components/StructuredData"
import {
  RELEASES,
  getRelease,
} from "@/components/markedsinnsikt/marketReleases"
import {
  fmtYieldPct,
  fmtLeieKrM2,
  fmtPct1,
} from "@/components/markedsinnsikt/marketData"

/** "2026-01-15" → "15. januar 2026" — norsk datoformat i redaksjonell prose. */
function fmtNorskDato(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`)
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })
}

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return RELEASES.map((r) => ({ kvartal: r.slug }))
}

// ---------------------------------------------------------------------------
// Metadata — self-canonical per release
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kvartal: string }>
}) {
  const { kvartal } = await params
  const release = getRelease(kvartal)
  if (!release) return {}

  return constructMetadata({
    path: `/presserom/arkiv/${release.slug}`,
    title: `Markedstall ${release.quarter} (arkiv) — næringseiendom Nord-Norge | Advanti Estate`,
    description: `Arkivert kvartalsutgivelse: prime yield, markedsleie og kontorledighet per by i Nord-Norge. Kilde: Advanti Estate · ${release.quarter}.`,
  })
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function KvartalArkivPage({
  params,
}: {
  params: Promise<{ kvartal: string }>
}) {
  const { kvartal } = await params
  const release = getRelease(kvartal)
  if (!release) notFound()

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Presserom", url: "/presserom" },
          { name: "Arkiv", url: "/presserom/arkiv" },
          { name: release.quarter, url: `/presserom/arkiv/${release.slug}` },
        ]}
      />

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Presserom", href: "/presserom" },
          { label: "Arkiv", href: "/presserom/arkiv" },
          { label: release.quarter },
        ]}
        eyebrow={`Presserom · Arkiv · ${release.quarter}`}
        title={
          <>
            Markedstall{" "}
            <span className="italic">{release.quarter} (arkivert).</span>
          </>
        }
        lede={`Arkivert øyeblikksbilde av markedstall for næringseiendom i Nord-Norge, publisert ${fmtNorskDato(release.publishedAt)}. Tallene reflekterer situasjonen ved publiseringstidspunktet og er ikke oppdatert.`}
        metaRow={[
          { value: String(release.cities.length), label: "Byer" },
          { value: release.quarter, label: "Kvartal" },
          { value: release.publishedAt, label: "Publisert" },
        ]}
      />

      {/* Frossen markedstable */}
      <section className="section section-divider" id="tall">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Nøkkeltall · {release.quarter}</span>
            <div>
              <h2>
                Fryst <span className="italic">snapshot.</span>
              </h2>
              <p>
                Prime yield (kontor), markedsleie og kontorledighet per by.
                Indikative tall for prime kvalitet ved publiseringstidspunktet.
              </p>
            </div>
          </div>

          <table className="mi-table">
            <caption className="sr-only">
              Prime yield, markedsleie og kontorledighet per by,{" "}
              {release.quarter}
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
              {release.cities.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="r">{fmtYieldPct(c.yieldPct)}</td>
                  <td className="r">{fmtLeieKrM2(c.leieKrM2)}</td>
                  <td className="r">{fmtPct1(c.vacPct)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mi-footnote" style={{ marginTop: 24 }}>
            <span className="source">
              Tall er indikative og reflekterer prime kvalitet.
            </span>
            <span>
              Kilde: Advanti Estate · {release.quarter} (arkivert utgivelse)
            </span>
          </div>

          {/* Datostempel + nedlasting */}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <a
              href={`/presserom/arkiv/${release.slug}/data.csv`}
              download
              className="btn btn-outline"
            >
              Last ned CSV
            </a>
            <Link href="/presserom" className="btn btn-outline">
              ← Til presserom
            </Link>
            <Link href="/presserom/arkiv" className="btn btn-outline">
              Alle utgivelser
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
