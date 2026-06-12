import { allHelpPosts, HelpPost } from "content-collections"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { CtaStrip } from "@/components/site/CtaStrip"
import { NewsletterSection } from "@/components/site/NewsletterSection"
import { MDX } from "@/components/blog/mdx"
import { HELP_CATEGORIES } from "@/lib/blog/content"
import { getBlurDataURL } from "@/lib/blog/images"
import { calculateReadingTime } from "@/lib/blog/utils"
import { constructMetadata } from "@/lib/utils"
import { getHelpPost } from "@/lib/content"
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData"

const AUTHOR_NAMES: Record<string, string> = {
  codehagen: "Christer Hagen",
  vsoraas: "Vegard Søraas",
}

const AUTHOR_META: Record<string, { name: string; role: string; image: string }> =
  {
    codehagen: {
      name: "Christer Hagen",
      role: "Partner & daglig leder · Advanti Estate",
      image:
        "https://kukzjreikqbgbolxvqaj.supabase.co/storage/v1/object/public/press/christer-hagen-web.jpg",
    },
    vsoraas: {
      name: "Vegard Søraas",
      role: "Partner · Advanti Estate",
      image:
        "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/76037f97-384f-4681-176e-5b8a0ba71300/public",
    },
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
    authors: [AUTHOR_NAMES[post.author] || post.author],
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

  const readingTime = data.mdx
    ? calculateReadingTime(data.mdx)
    : null
  const authorMeta = AUTHOR_META[data.author]
  const authorName = AUTHOR_NAMES[data.author] || data.author
  const toc = data.tableOfContents ?? []

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Kunnskapsbase", url: "/help" },
          { name: category.title, url: `/help/category/${category.slug}` },
          { name: data.title, url: `/help/article/${data.slug}` },
        ]}
      />
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

      <div className="page-pad" />

      {/* HERO — breadcrumb only */}
      <section className="subhero" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <nav className="crumb" aria-label="Brødsmuler">
            <Link href="/">Hjem</Link>
            <span className="sep">/</span>
            <Link href="/help">Kunnskapssenter</Link>
            <span className="sep">/</span>
            <Link href={`/help/category/${category.slug}`}>
              {category.title}
            </Link>
            <span className="sep">/</span>
            <span className="here">{data.title}</span>
          </nav>
        </div>
      </section>

      {/* ARTICLE */}
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="ks-article">
            <article className="ks-art-body">
              <div className="ks-art-meta">
                <Link
                  href={`/help/category/${category.slug}`}
                  className="cat"
                  style={{ textDecoration: "none" }}
                >
                  {category.title}
                </Link>
                <span className="sep">·</span>
                <span>{editorialDate(data.updatedAt)}</span>
                {readingTime && (
                  <>
                    <span className="sep">·</span>
                    <span>{readingTime} min lesing</span>
                  </>
                )}
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

              {/* Feedback */}
              <div className="ks-feedback">
                <p>
                  Var denne artikkelen{" "}
                  <span
                    style={{
                      fontStyle: "italic",
                      fontWeight: 300,
                      color: "var(--warm-grey-85)",
                    }}
                  >
                    til hjelp?
                  </span>
                </p>
                <div className="btn-row">
                  <button type="button">Ja</button>
                  <button type="button">Nei</button>
                </div>
              </div>

              {/* Related */}
              {relatedArticles.length > 0 && (
                <div className="ks-related">
                  <h3>Les videre.</h3>
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

            {/* TOC sidebar */}
            <aside className="ks-toc">
              <div className="toc-label">På denne siden</div>
              {toc.map((item: { slug: string; title: string }) => (
                <Link key={item.slug} href={`#${item.slug}`}>
                  {item.title}
                </Link>
              ))}

              <div className="toc-related">
                <div className="toc-label">Relaterte tjenester</div>
                <Link href="/tjenester/verdivurdering">
                  Verdivurdering av næringseiendom
                </Link>
                <Link href="/tjenester/salg">Salg av næringseiendom</Link>
                <Link href="/tjenester/utleie">Utleie av næringseiendom</Link>
                <Link href="/naringsmegler/bodo">Næringsmegler i Bodø</Link>
                <Link href="/naringsmegler">Alle markeder i Nord-Norge</Link>
              </div>

              <div className="toc-meta">
                Skrevet av {authorName}.
                <br />
                <br />
                Fant du en feil?{" "}
                <Link
                  href="/kontakt"
                  style={{
                    color: "var(--warm-grey)",
                    borderBottom: "1px solid",
                  }}
                >
                  Si fra →
                </Link>
              </div>
            </aside>
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
