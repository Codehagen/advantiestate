import { allHelpPosts } from "content-collections"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { CtaStrip } from "@/components/site/CtaStrip"
import { SubHero } from "@/components/site/SubHero"
import { HELP_CATEGORIES, POPULAR_ARTICLES } from "@/lib/blog/content"
import { calculateReadingTime } from "@/lib/blog/utils"
import { constructMetadata } from "@/lib/utils"

const AUTHOR_NAMES: Record<string, string> = {
  codehagen: "Christer Hagen",
  vsoraas: "Vegard Søraas",
}

const MONTHS_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAI",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OKT",
  "NOV",
  "DES",
]

/** Formats a date string as e.g. "14. JAN 2026". */
function editorialDate(date: string) {
  const d = new Date(date.includes("T") ? date : `${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  const day = String(d.getDate()).padStart(2, "0")
  return `${day}. ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

function categoryIndex(slug: string) {
  return HELP_CATEGORIES.findIndex((c) => c.slug === slug) + 1
}

export async function generateStaticParams() {
  return HELP_CATEGORIES.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata | undefined> {
  const { slug } = await params
  const category = HELP_CATEGORIES.find((category) => category.slug === slug)
  if (!category) {
    return
  }

  const { title, description } = category

  return constructMetadata({
    title: `${title} – Advanti Hjelpesenter`,
    description,
    image: `/api/og/help?title=${encodeURIComponent(
      title,
    )}&summary=${encodeURIComponent(description)}`,
  })
}

export default async function HelpCategory({
  params,
}: {
  params: {
    slug: string
  }
}) {
  const { slug } = await params
  const data = HELP_CATEGORIES.find((category) => category.slug === slug)
  if (!data) {
    notFound()
  }
  const articles = allHelpPosts
    .filter((post) => (post.categories as string[]).includes(data.slug))
    // order by POPULAR_ARTICLES
    .reduce(
      (acc, curr) => {
        if (POPULAR_ARTICLES.includes(curr.slug)) {
          acc.unshift(curr)
        } else {
          acc.push(curr)
        }
        return acc
      },
      [] as typeof allHelpPosts,
    )

  const lastUpdated = articles
    .map((a) => a.updatedAt)
    .sort((a, b) => b.localeCompare(a))[0]

  // Other categories for the "related" section
  const otherCategories = HELP_CATEGORIES.filter((c) => c.slug !== data.slug)

  return (
    <>
      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Kunnskapssenter", href: "/help" },
          { label: data.title },
        ]}
        eyebrow={`Kategori ${String(categoryIndex(data.slug)).padStart(
          2,
          "0",
        )} · ${articles.length} ${
          articles.length === 1 ? "artikkel" : "artikler"
        }`}
        title={data.title}
        lede={data.description}
      />

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {lastUpdated && (
            <div className="ks-cat-meta" style={{ marginBottom: 32 }}>
              <span>Sist oppdatert · {editorialDate(lastUpdated)}</span>
              <span>Av Advanti analyseteam</span>
            </div>
          )}

          {/* ARTICLES LIST */}
          {articles.length === 0 ? (
            <p className="ks-art-lede">
              Ingen artikler i denne kategorien ennå. Kom tilbake snart.
            </p>
          ) : (
            <div className="ks-articles">
              {articles.map((article, idx) => {
                const readingTime = article.mdx
                  ? calculateReadingTime(article.mdx)
                  : null
                const authorName =
                  AUTHOR_NAMES[article.author] || article.author
                return (
                  <Link
                    key={article.slug}
                    className="ks-article-row"
                    href={`/help/article/${article.slug}`}
                  >
                    <span className="anum">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="atitle">{article.title}</div>
                      <p className="asum">{article.summary}</p>
                    </div>
                    <span className="ameta">
                      {authorName.toUpperCase()} ·{" "}
                      {editorialDate(article.updatedAt)}
                    </span>
                    <span className="areadtime">
                      {readingTime ? `${readingTime} min` : ""}
                    </span>
                    <span className="arrow">→</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* RELATED CATEGORIES */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Beslektede kategorier</span>
            <div>
              <h2>
                Andre temaer som kan{" "}
                <span className="italic">interessere deg.</span>
              </h2>
            </div>
          </div>

          <div
            className="ks-cats"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {otherCategories.map((category) => {
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
                    Kategori ·{" "}
                    {String(categoryIndex(category.slug)).padStart(2, "0")}
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
