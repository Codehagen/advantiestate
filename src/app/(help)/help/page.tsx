import { allHelpPosts } from "content-collections"
import Link from "next/link"

import { HelpFaq } from "@/components/help/HelpFaq"
import { HelpLibrary, type LibraryItem } from "@/components/help/HelpLibrary"
import { HelpSearch, type HelpSearchItem } from "@/components/help/HelpSearch"
import { CtaStrip } from "@/components/site/CtaStrip"
import { SubHero } from "@/components/site/SubHero"
import { getPopularArticles, POPULAR_ARTICLES } from "@/lib/blog/content"
import {
  HELP_CATEGORY_META,
  HELP_PATHS,
  HELP_SEARCH_SUGGESTIONS,
  helpAuthorName,
  helpCategoryTitle,
} from "@/lib/blog/help-data"
import { calculateReadingTime } from "@/lib/blog/utils"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  path: "/help",
  title: "Kunnskapssenter – Advanti",
  description:
    "Et åpent kunnskapssenter om næringseiendom i Nord-Norge: yield, verdivurdering, DCF, leiekontrakter og markedet — forklart av rådgivere som gjør det til daglig.",
})

const MONTHS_SHORT = [
  "jan", "feb", "mar", "apr", "mai", "jun",
  "jul", "aug", "sep", "okt", "nov", "des",
]

function shortDate(date: string) {
  const d = new Date(date.includes("T") ? date : `${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return `${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

export default function HelpCenter() {
  const popularArticles = getPopularArticles()

  // Plain serialisable DTOs for the client components (the client/server
  // boundary rule: never import content-collections into a client component).
  const searchIndex: HelpSearchItem[] = allHelpPosts.map((post) => ({
    slug: post.slug ?? "",
    title: post.title,
    summary: post.summary,
    category: helpCategoryTitle(post.categories[0]),
    readingTime: post.mdx ? calculateReadingTime(post.mdx) : null,
  }))

  const popularDto = popularArticles.map((post) => ({
    slug: post.slug ?? "",
    title: post.title,
    category: helpCategoryTitle(post.categories[0]),
  }))

  const libraryItems: LibraryItem[] = allHelpPosts.map((post) => {
    const slug = post.slug ?? ""
    const popRank = POPULAR_ARTICLES.indexOf(slug)
    return {
      slug,
      title: post.title,
      summary: post.summary,
      category: helpCategoryTitle(post.categories[0]),
      categorySlug: post.categories[0],
      author: helpAuthorName(post.author),
      dateLabel: shortDate(post.updatedAt),
      updated: post.updatedAt,
      readingTime: post.mdx ? calculateReadingTime(post.mdx) : null,
      popRank: popRank === -1 ? null : popRank,
    }
  })

  const latestUpdated = allHelpPosts
    .map((p) => p.updatedAt)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0]
  const latestLabel = latestUpdated
    ? `${MONTHS_SHORT[new Date(`${latestUpdated}T00:00:00`).getMonth()]} ${new Date(`${latestUpdated}T00:00:00`).getFullYear()}`
    : ""

  // Resolve reading-path step slugs to titles.
  const bySlug = new Map(allHelpPosts.map((p) => [p.slug ?? "", p]))
  const paths = HELP_PATHS.map((path) => ({
    ...path,
    steps: path.steps
      .map((slug) => {
        const post = bySlug.get(slug)
        return post ? { slug, title: post.title } : null
      })
      .filter((s): s is { slug: string; title: string } => s !== null),
  }))

  // "Bla på tema" — one card per canonical category, previewing the top 3
  // articles (curated popRank first, then newest) and linking to the full
  // category page. New articles grow the category page, not this front page.
  const categoryCards = HELP_CATEGORY_META.map((c) => {
    const inCat = libraryItems.filter((it) => it.categorySlug === c.slug)
    const top = [...inCat]
      .sort((a, b) => {
        const ra = a.popRank ?? Infinity
        const rb = b.popRank ?? Infinity
        if (ra !== rb) return ra - rb
        return Date.parse(b.updated) - Date.parse(a.updated)
      })
      .slice(0, 3)
      .map((t) => ({ slug: t.slug, title: t.title }))
    return { slug: c.slug, title: c.title, count: inCat.length, top }
  })

  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Kunnskapssenter" }]}
        eyebrow="Hjelp & kunnskap om næringseiendom"
        title={
          <>
            Forstå næringseiendom — <br />
            <span className="italic">begrep, metode, marked.</span>
          </>
        }
        lede="Søk i hele biblioteket, eller bla deg gjennom. Konkrete forklaringer av yield, verdivurdering, DCF, leiekontrakter og markedet i Nord-Norge — skrevet av folk som gjør det til daglig."
      >
        <HelpSearch
          index={searchIndex}
          popular={popularDto}
          suggestions={HELP_SEARCH_SUGGESTIONS}
        />

        <div className="hs-herostats">
          <div className="s">
            <span className="v">
              {allHelpPosts.length}
              <span className="unit"> stk</span>
            </span>
            <span className="l">Artikler &amp; guider</span>
          </div>
          <div className="s">
            <span className="v">{HELP_CATEGORY_META.length}</span>
            <span className="l">Temaer</span>
          </div>
          <div className="s">
            <span className="v">Gratis</span>
            <span className="l">Åpent for alle</span>
          </div>
          {latestLabel && (
            <div className="s">
              <span className="v" style={{ textTransform: "capitalize" }}>
                {latestLabel}
              </span>
              <span className="l">Sist oppdatert</span>
            </div>
          )}
        </div>
      </SubHero>

      {/* START HER — reading paths */}
      <section className="section-tight" style={{ paddingTop: 16, paddingBottom: 48 }}>
        <div className="wrap">
          <div className="head-compact" style={{ marginBottom: 28 }}>
            <span className="eyebrow">Start her</span>
            <div>
              <h2>
                Hvor vil du <span className="italic">begynne?</span>
              </h2>
              <p>
                Tre korte løp som tar deg fra null til oversikt — avhengig av
                hvor du står.
              </p>
            </div>
          </div>

          <div className="hs-paths">
            {paths.map((path) => (
              <div className="hs-path" key={path.num}>
                <span className="pre">Løp · {path.num}</span>
                <h3>
                  {path.title} <span className="italic">{path.italic}</span>
                </h3>
                <p>{path.desc}</p>
                <ul className="steps">
                  {path.steps.map((step, i) => (
                    <li key={step.slug}>
                      <Link href={`/help/article/${step.slug}`}>
                        <span className="sn">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="st">{step.title}</span>
                        <span className="sa" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEST LEST — curated top list */}
      {popularDto.length > 0 && (
        <section className="section-tight" style={{ paddingTop: 8, paddingBottom: 48 }}>
          <div className="wrap">
            <div className="head-compact" style={{ marginBottom: 24 }}>
              <span className="eyebrow">Mest lest</span>
              <div>
                <h2>
                  Start med <span className="italic">det folk faktisk leser.</span>
                </h2>
              </div>
            </div>

            <div className="hs-mostread">
              {popularDto.map((a, i) => (
                <Link
                  key={a.slug}
                  className="hs-mr"
                  href={`/help/article/${a.slug}`}
                  prefetch={false}
                >
                  <span className="mn">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt">{a.title}</span>
                  <span className="mtag">{a.category}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLA PÅ TEMA — category browse cards */}
      <section className="section-tight" style={{ paddingTop: 8, paddingBottom: 48 }}>
        <div className="wrap">
          <div className="head-compact" style={{ marginBottom: 24 }}>
            <span className="eyebrow">Bla på tema</span>
            <div>
              <h2>
                {HELP_CATEGORY_META.length} temaer{" "}
                <span className="italic">å utforske.</span>
              </h2>
              <p>
                Bla deg inn i ett område — hvert tema har sin egen side med hele
                listen.
              </p>
            </div>
          </div>

          <div className="hs-browse">
            {categoryCards.map((c, i) => (
              <div className="hs-cat" key={c.slug}>
                <div className="chead">
                  <div>
                    <span className="pre">
                      Tema · {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{c.title}</h3>
                  </div>
                  <span className="cn">{c.count}</span>
                </div>
                <ul className="links">
                  {c.top.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/help/article/${a.slug}`} prefetch={false}>
                        <span className="li-arrow" aria-hidden="true">
                          →
                        </span>
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link className="seeall" href={`/help/category/${c.slug}`}>
                  Se alle {c.count} <span className="sa" aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIBRARY */}
      <section id="bibliotek" className="section" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <HelpLibrary items={libraryItems} categories={HELP_CATEGORY_META} />
        </div>
      </section>

      {/* QUICK ANSWERS */}
      <section className="section" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <HelpFaq />
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
