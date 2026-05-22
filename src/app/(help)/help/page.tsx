import { allHelpPosts } from "content-collections"
import Link from "next/link"

import { HelpSearch } from "@/components/help/HelpSearch"
import { CtaStrip } from "@/components/site/CtaStrip"
import { SubHero } from "@/components/site/SubHero"
import { getPopularArticles, HELP_CATEGORIES } from "@/lib/blog/content"
import { calculateReadingTime } from "@/lib/blog/utils"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  path: "/help",
  title: "Kunnskapssenter – Advanti",
  description:
    "Et sentralt knutepunkt for alle dine næringseiendoms-relaterte spørsmål. Finn svar på vanlige spørsmål, lær hvordan du bruker plattformen, og få ekspertråd.",
})

function categoryTitle(slug?: string) {
  return HELP_CATEGORIES.find((c) => c.slug === slug)?.title ?? "Artikkel"
}

export default function HelpCenter() {
  const popularArticles = getPopularArticles()

  // Lightweight client-side search index — title/summary/category only, so the
  // compiled MDX never ships to the browser.
  const searchIndex = allHelpPosts.map((post) => ({
    slug: post.slug ?? "",
    title: post.title,
    summary: post.summary,
    category: categoryTitle(post.categories[0]),
  }))

  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Kunnskapssenter" }]}
        eyebrow="Lær næringseiendom"
        title={
          <>
            Forstå næringseiendom — <br />
            <span className="italic">begrep, metode, marked.</span>
          </>
        }
        lede="Et åpent kunnskapssenter for alle som jobber med næringseiendom i Nord-Norge. Konkrete forklaringer av yield, verdivurdering, DCF og leiemarkedet — uten faglig støy."
      >
        <HelpSearch index={searchIndex} />
      </SubHero>

      {/* POPULAR ARTICLES */}
      <section
        className="section-tight"
        style={{ paddingTop: 16, paddingBottom: 48 }}
      >
        <div className="wrap">
          <div className="ks-popular">
            <div className="ribbon-head">
              <h2>
                Populære artikler <span className="italic">akkurat nå.</span>
              </h2>
              <span className="eyebrow" style={{ fontSize: 11 }}>
                Mest leste
              </span>
            </div>

            <div className="ks-popular-grid">
              {popularArticles.map((article, idx) => {
                const readingTime = article.mdx
                  ? calculateReadingTime(article.mdx)
                  : null
                return (
                  <Link
                    key={article.slug}
                    className="ks-popular-item"
                    href={`/help/article/${article.slug}`}
                  >
                    <span className="num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4>{article.title}</h4>
                      <div className="meta">
                        {categoryTitle(article.categories[0])}
                        {readingTime ? ` · ${readingTime} min lesing` : ""}
                      </div>
                    </div>
                    <span className="arrow">→</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Kategorier</span>
            <div>
              <h2>
                Utforsk etter <span className="italic">tema.</span>
              </h2>
              <p>
                Vi har samlet alt vi vet om næringseiendom i tematiske
                kategorier — fra grunnleggende begreper til avanserte
                analysemetoder.
              </p>
            </div>
          </div>

          <div className="ks-cats">
            {HELP_CATEGORIES.map((category, idx) => {
              const count = allHelpPosts.filter((post) =>
                (post.categories as string[]).includes(category.slug),
              ).length
              return (
                <Link
                  key={category.slug}
                  className="ks-cat"
                  href={`/help/category/${category.slug}`}
                >
                  <span className="pre">
                    Kategori · {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <div className="cfoot">
                    <span className="count">
                      {count} {count === 1 ? "artikkel" : "artikler"}
                    </span>
                    <span className="more">
                      Utforsk <span>→</span>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Fant du ikke svaret?"
        title={
          <>
            Snakk med en <br />
            <span className="italic">erfaren rådgiver.</span>
          </>
        }
        sub="Vi setter av tid til en uforpliktende samtale. Ingen forpliktelser, og du får svar direkte fra en senior partner."
        primary={{ label: "Ta kontakt", href: "/kontakt" }}
        secondary={{ label: "Se våre tjenester", href: "/tjenester" }}
      />
    </>
  )
}
