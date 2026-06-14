import { allHelpPosts, HelpPost } from "content-collections"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ArticleFeedback } from "@/components/help/ArticleFeedback"
import { ArticleToc } from "@/components/blog/ArticleToc"
import { CtaStrip } from "@/components/site/CtaStrip"
import { NewsletterSection } from "@/components/site/NewsletterSection"
import { MDX } from "@/components/blog/mdx"
import { HELP_CATEGORIES } from "@/lib/blog/content"
import {
  HELP_AUTHORS,
  helpAuthorName,
  helpNeighbours,
} from "@/lib/blog/help-data"
import { getBlurDataURL } from "@/lib/blog/images"
import { calculateReadingTime } from "@/lib/blog/utils"
import { constructMetadata } from "@/lib/utils"
import { getHelpPost } from "@/lib/content"
import StructuredData from "@/components/StructuredData"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"

const MONTHS_SHORT = [
  "JAN", "FEB", "MAR", "APR", "MAI", "JUN",
  "JUL", "AUG", "SEP", "OKT", "NOV", "DES",
]

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

/** Formats a date string as e.g. "14. jan 2026". */
function editorialDate(date: string) {
  const d = new Date(date.includes("T") ? date : `${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  const day = String(d.getDate())
  return `${day}. ${MONTHS_SHORT[d.getMonth()].toLowerCase()} ${d.getFullYear()}`
}

export async function generateStaticParams() {
  return [
    ...allHelpPosts.map((post) => ({
      slug: post.slug,
    })),
    {
      slug: "hva-er-næringseiendom-en-komplett-guide",
    },
    {
      slug: "hva-er-naringseiendom-en-komplett-guide",
    },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata | undefined> {
  const { slug } = await params
  const post = getHelpPost(slug)
  if (!post) {
    return
  }

  const { title, summary } = post

  return constructMetadata({
    title: `${title} – Advanti Kunnskapsbase`,
    description: summary,
    image: `/api/og/help?title=${encodeURIComponent(
      title,
    )}&summary=${encodeURIComponent(summary)}`,
    path: `/help/article/${post.slug}`,
    ogType: "article",
    modifiedTime: post.updatedAt,
    authors: [helpAuthorName(post.author)],
  })
}

export default async function HelpArticle({
  params,
}: {
  params: {
    slug: string
  }
}) {
  const { slug } = await params
  const data = getHelpPost(slug)
  if (!data) {
    notFound()
  }
  const category = HELP_CATEGORIES.find(
    (category) => data.categories[0] === category.slug,
  )!

  const images = await Promise.all(
    data.images.map(async (src: string) => ({
      src,
      blurDataURL: await getBlurDataURL(src),
    })),
  )

  const relatedArticles =
    ((data.related &&
      data.related
        .map((slug) => allHelpPosts.find((post) => post.slug === slug))
        .filter(Boolean)) as HelpPost[]) || []

  const readingTime = data.mdx ? calculateReadingTime(data.mdx) : null
  const authorMeta = HELP_AUTHORS[data.author]
  const authorName = helpAuthorName(data.author)
  const toc = data.tableOfContents ?? []
  const takeaways = data.takeaways ?? []

  // Prev/next across the full deterministic ordering.
  const { prev, next } = helpNeighbours(
    allHelpPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      categories: p.categories,
    })),
    data.slug ?? slug,
  )

  return (
    <>
      <StructuredData
        type="article"
        data={{
          title: data.title,
          summary: data.summary,
          publishedAt: data.publishedAt ?? data.updatedAt,
          updatedAt: data.updatedAt,
          author: data.author,
          url: `/help/article/${data.slug}`,
          timeRequired: readingTime ?? undefined,
          articleSection: category.title,
        }}
      />
      {data.howto && data.step && data.step.length >= 2 && (
        <StructuredData
          type="howto"
          data={{
            name: data.title,
            description: data.summary,
            step: data.step,
          }}
        />
      )}
      {data.faq && data.faq.length >= 2 && (
        <StructuredData type="faq" data={{ faqs: data.faq }} />
      )}

      <a href="#art-main" className="skip-link">
        Hopp til innhold
      </a>

      <div className="page-pad" />

      {/* HERO — breadcrumb only (emits BreadcrumbList JSON-LD) */}
      <section className="subhero" style={{ paddingBottom: 16 }}>
        <div className="wrap">
          <Breadcrumbs
            path={`/help/article/${data.slug}`}
            leafLabel={data.title}
          />
        </div>
      </section>

      {/* ARTICLE */}
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="ks-article">
            <article className="ks-art-body" id="art-main">
              <div className="ks-art-meta">
                <Link
                  href={`/help/category/${category.slug}`}
                  className="cat"
                  style={{ textDecoration: "none" }}
                >
                  {category.title}
                </Link>
                {readingTime && (
                  <>
                    <span className="sep">·</span>
                    <span>{readingTime} min lesing</span>
                  </>
                )}
                <span className="sep">·</span>
                <span className="art-updated">
                  <span className="pip" aria-hidden="true" />
                  Sist oppdatert {editorialDate(data.updatedAt)}
                </span>
              </div>

              <h1 className="ks-art-title">{data.title}</h1>

              <p className="ks-art-lede">{data.summary}</p>

              {authorMeta && (
                <div className="ks-art-author">
                  <div
                    className="av"
                    style={{ backgroundImage: `url('${authorMeta.image}')` }}
                  />
                  <div className="meta">
                    <span className="name">{authorMeta.name}</span>
                    <span className="role">{authorMeta.role}</span>
                  </div>
                </div>
              )}

              {takeaways.length > 0 && (
                <div className="art-kort">
                  <div className="lbl">Kort fortalt</div>
                  <ul>
                    {takeaways.map((point, i) => (
                      <li key={i}>
                        <span className="n" aria-hidden="true">
                          {ROMAN[i] ?? String(i + 1)}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <MDX code={data.mdx} images={images} />

              {data.faq && data.faq.length >= 2 && (
                <div className="ks-faq">
                  <h2 id="ofte-stilte-sporsmal">Ofte stilte spørsmål</h2>
                  {data.faq.map((item) => (
                    <div className="ks-faq-item" key={item.question}>
                      <h3>{item.question}</h3>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              <ArticleFeedback slug={data.slug ?? slug} />

              {(prev || next) && (
                <nav className="art-prevnext" aria-label="Forrige og neste artikkel">
                  {prev ? (
                    <Link href={`/help/article/${prev.slug}`} className="prev">
                      <span className="dir">← Forrige</span>
                      <span className="ti">{prev.title}</span>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <Link href={`/help/article/${next.slug}`} className="next">
                      <span className="dir">Neste →</span>
                      <span className="ti">{next.title}</span>
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              )}

              {relatedArticles.length > 0 && (
                <div className="ks-related">
                  <h3>
                    Les videre{" "}
                    <span className="italic">
                      i {category.title.toLowerCase()}.
                    </span>
                  </h3>
                  <div className="ks-related-list">
                    {relatedArticles.map((article) => {
                      const relCat = HELP_CATEGORIES.find(
                        (c) => c.slug === article.categories[0],
                      )
                      const relReading = article.mdx
                        ? calculateReadingTime(article.mdx)
                        : null
                      return (
                        <Link
                          key={article.slug}
                          className="item"
                          href={`/help/article/${article.slug}`}
                          prefetch={false}
                        >
                          <span className="pre">
                            {relCat?.title ?? "Kunnskap"}
                            {relReading ? ` · ${relReading} MIN` : ""}
                          </span>
                          <h4>{article.title}</h4>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </article>

            <ArticleToc
              toc={toc}
              authorName={authorName}
              relatedServices={[
                {
                  href: "/tjenester/verdivurdering",
                  label: "Verdivurdering av næringseiendom",
                },
                { href: "/tjenester/salg", label: "Salg av næringseiendom" },
                { href: "/tjenester/utleie", label: "Utleie av næringseiendom" },
                { href: "/naringsmegler/bodo", label: "Næringsmegler i Bodø" },
                { href: "/naringsmegler", label: "Alle markeder i Nord-Norge" },
              ]}
            />
          </div>
        </div>
      </section>

      <NewsletterSection source="help" />

      <CtaStrip
        eyebrow="Trenger du hjelp på din eiendom?"
        title={
          <>
            Få konkret <br />
            <span className="italic">rådgivning fra senior partner.</span>
          </>
        }
        sub="Det finnes ingen erstatning for å sette seg ned og gå gjennom tallene sammen. Vi tar en uforpliktende samtale."
        primary={{ label: "Ta kontakt", href: "/kontakt" }}
        secondary={{
          label: "Bestill verdivurdering",
          href: "/tjenester/verdivurdering",
        }}
      />
    </>
  )
}
