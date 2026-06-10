import Link from "next/link"

import { constructMetadata } from "@/lib/utils"
import { SubHero } from "@/components/site/SubHero"
import { BreadcrumbStructuredData } from "@/components/StructuredData"
import { RELEASES } from "@/components/markedsinnsikt/marketReleases"

export const metadata = constructMetadata({
  path: "/presserom/arkiv",
  title: "Kvartalsarkiv — markedstall | Advanti Estate",
  description:
    "Arkiv over alle Advanti Estates kvartalsutgivelser med markedstall for næringseiendom i Nord-Norge.",
})

export default function ArkivIndexPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Presserom", url: "/presserom" },
          { name: "Arkiv", url: "/presserom/arkiv" },
        ]}
      />

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Presserom", href: "/presserom" },
          { label: "Arkiv" },
        ]}
        eyebrow="Presserom · Kvartalsarkiv"
        title={
          <>
            Alle <span className="italic">utgivelser.</span>
          </>
        }
        lede="Permanente arkivsider for hvert kvartal — markedstall for næringseiendom i Nord-Norge, fryst ved publiseringstidspunkt."
      />

      <section className="section section-divider">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Utgivelser — nyeste først</span>
          </div>

          <table className="mi-table mt-6">
            <caption className="sr-only">Alle kvartalsutgivelser</caption>
            <thead>
              <tr>
                <th>Kvartal</th>
                <th>Publisert</th>
                <th>Arkivside</th>
                <th>CSV</th>
              </tr>
            </thead>
            <tbody>
              {RELEASES.map((r) => (
                <tr key={r.slug}>
                  <td>{r.quarter}</td>
                  <td>{r.publishedAt}</td>
                  <td>
                    <Link href={`/presserom/arkiv/${r.slug}`}>
                      {r.quarter} (arkiv)
                    </Link>
                  </td>
                  <td>
                    <a href={`/presserom/arkiv/${r.slug}/data.csv`} download>
                      Last ned CSV
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mi-footnote mt-6">
            <span>
              <Link href="/presserom">← Tilbake til presserom</Link>
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
