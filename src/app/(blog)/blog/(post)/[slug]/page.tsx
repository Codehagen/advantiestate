import { Advisor } from "@/components/blog/Advisor";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { MDX } from "@/components/blog/mdx";
import ScrollProgress from "@/components/blog/scroll-progress";
import { CtaStrip } from "@/components/site/CtaStrip";
import { NewsletterSection } from "@/components/site/NewsletterSection";
import BlurImage from "@/lib/blog/blur-image";
import { BLOG_CATEGORIES } from "@/lib/blog/content";
import { getBlurDataURL } from "@/lib/blog/images";
import { calculateReadingTime } from "@/lib/blog/utils";
import { constructMetadata } from "@/lib/utils";
import { getBlogPost } from "@/lib/content";
import { AUTHORS, getAuthorName, resolveAuthorCard } from "@/lib/authors";
import { siteConfig } from "@/app/siteConfig";
import { allBlogPosts } from "content-collections";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";

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
];

/** Formats a YYYY-MM-DD date as e.g. "04. FEB 2026". */
function editorialDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}. ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return;
  }

  const { title, seoTitle, summary, seoDescription } = post;

  // og:image is the per-article editorial card from /api/og/blog/<slug>.
  // The frontmatter `image` still drives the in-page hero (BlogArticle).
  return constructMetadata({
    title: `${seoTitle || title} – Advanti Estate`,
    description: seoDescription || summary,
    image: `/api/og/blog/${slug}`,
    path: `/blog/${slug}`,
    ogType: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [getAuthorName(post.author)],
  });
}

export default async function BlogArticle({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;
  const data = getBlogPost(slug);
  if (!data) {
    notFound();
  }

  const imageSources = Array.isArray(data.images) ? data.images : [];

  const [thumbnailBlurhash, images] = await Promise.all([
    getBlurDataURL(data.image),
    Promise.all(
      imageSources.map(async (src: string) => ({
        src,
        blurDataURL: await getBlurDataURL(src),
      }))
    ),
  ]);

  const category = data.categories
    .map((cat) => BLOG_CATEGORIES.find((c) => c.slug === cat))
    .find((cat) => cat !== undefined);

  if (!category) {
    console.error(`No valid category found for post: ${data.slug}`);
    notFound();
  }

  const relatedArticles = data.related
    ? data.related
        .map((slug) => allBlogPosts.find((post) => post.slug === slug))
        .filter((post): post is NonNullable<typeof post> => post !== undefined)
    : [];

  const readingTime = data.mdx
    ? calculateReadingTime(data.mdx)
    : null;
  const authorMeta = AUTHORS[data.author];
  const authorName = getAuthorName(data.author);
  const advisorCard = resolveAuthorCard(data.author);
  const { streetAddress, postalCode, addressLocality } =
    siteConfig.contact.address;
  const advisorAddress = `${siteConfig.name} · ${streetAddress}, ${postalCode} ${addressLocality}`;
  const toc = data.tableOfContents ?? [];

  return (
    <>
      <ScrollProgress />
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Artikler", url: "/blog" },
          { name: data.title, url: `/blog/${data.slug}` },
        ]}
      />
      <StructuredData
        type="article"
        data={{
          title: data.title,
          summary: data.summary,
          publishedAt: data.publishedAt,
          updatedAt: data.updatedAt,
          image: data.image,
          author: data.author,
          authorName,
          url: `/blog/${data.slug}`,
          articleBody: data.mdx
            ? data.mdx.replace(/<[^>]+>/g, "").substring(0, 5000)
            : undefined,
          wordCount: data.mdx
            ? data.mdx.replace(/<[^>]+>/g, "").split(/\s+/).length
            : undefined,
          timeRequired: readingTime ?? undefined,
          keywords: data.categories,
          articleSection: category?.title,
        }}
      />

      <div className="page-pad" />

      {/* HERO — breadcrumb only */}
      <section className="subhero" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <nav className="crumb crumb-article" aria-label="Brødsmuler">
            <Link href="/">Hjem</Link>
            <span className="sep">/</span>
            <Link href="/blog">Artikler</Link>
            <span className="sep">/</span>
            <span className="here">{data.title}</span>
          </nav>
        </div>
      </section>

      {/* ARTICLE */}
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {/* Title block */}
          <div style={{ maxWidth: 780, marginBottom: 32 }}>
            <div className="ks-art-meta">
              <Link
                href={`/blog/category/${category.slug}`}
                className="cat"
                style={{ textDecoration: "none" }}
              >
                {category.title}
              </Link>
              <span className="sep">·</span>
              <span>{editorialDate(data.publishedAt)}</span>
              {data.updatedAt && data.updatedAt !== data.publishedAt && (
                <>
                  <span className="sep">·</span>
                  <span>Sist oppdatert {editorialDate(data.updatedAt)}</span>
                </>
              )}
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
          </div>

          {/* Hero image */}
          <div className="bg-art-hero">
            <div className="img">
              <BlurImage
                src={data.image}
                blurDataURL={thumbnailBlurhash}
                width={1200}
                height={630}
                alt={data.title}
                priority
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          <div className="ks-article">
            <article className="ks-art-body" id="art-main">
              <MDX
                code={data.mdx}
                images={images.map((image) => ({
                  ...image,
                  alt: data.title,
                }))}
              />

              {/* Advisor card — rendered globally from the author's profile,
                  unless the article placed its own inline (advisorInline). */}
              {!data.advisorInline && advisorCard && (
                <Advisor
                  name={advisorCard.name}
                  role={advisorCard.role}
                  portrait={advisorCard.portrait}
                  address={advisorAddress}
                  phone={advisorCard.phone}
                  email={advisorCard.email}
                />
              )}

              {/* Related */}
              {relatedArticles.length > 0 && (
                <div className="ks-related">
                  <h3>Les videre.</h3>
                  <div className="ks-related-list">
                    {relatedArticles.map((post) => {
                      const relCat = post.categories
                        .map((c) =>
                          BLOG_CATEGORIES.find((bc) => bc.slug === c)
                        )
                        .find((c) => c !== undefined);
                      const relReading = post.mdx
                        ? calculateReadingTime(post.mdx)
                        : null;
                      return (
                        <Link
                          key={post.slug}
                          className="item"
                          href={`/blog/${post.slug}`}
                        >
                          <span className="pre">
                            {(relCat?.title ?? "Artikkel").toUpperCase()}
                            {relReading ? ` · ${relReading} MIN` : ""}
                          </span>
                          <h4>{post.title}</h4>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>

            {/* TOC sidebar */}
            <ArticleToc toc={toc} authorName={authorName} />
          </div>
        </div>
      </section>

      <NewsletterSection source="blog" />

      <CtaStrip
        eyebrow="Trenger du markedsdata på din eiendom?"
        title={
          <>
            Få skreddersydd analyse <br />
            <span className="italic">— for din portefølje.</span>
          </>
        }
        sub="Vi kombinerer relevant markedsdata med eiendomsspesifikk innsikt og leverer en konkret rapport — typisk innen to uker."
        primary={{ label: "Bestill analyse", href: "/kontakt" }}
        secondary={{ label: "Se markedsinnsikt", href: "/markedsinnsikt" }}
      />
    </>
  );
}
