import { allBlogPosts } from "content-collections";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsletterSection } from "@/components/site/NewsletterSection";
import { SubHero } from "@/components/site/SubHero";
import { BLOG_CATEGORIES } from "@/lib/blog/content";
import { calculateReadingTime } from "@/lib/blog/utils";
import { constructMetadata } from "@/lib/utils";

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

function categoryTitle(slug?: string) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.title ?? "Artikkel";
}

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((category) => category.slug === slug);
  if (!category) {
    return;
  }

  const { title, description } = category;

  return constructMetadata({
    title: `${title} – Advanti`,
    description,
    image: `/api/og/help?title=${encodeURIComponent(
      title
    )}&summary=${encodeURIComponent(description)}`,
  });
}

export default async function BlogCategory({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;
  const data = BLOG_CATEGORIES.find((category) => category.slug === slug);
  if (!data) {
    notFound();
  }

  const articles = allBlogPosts
    .filter((post) => post.categories?.includes(data.slug as any))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((post) => ({
      title: post.title,
      summary: post.summary,
      publishedAt: post.publishedAt,
      image: post.image,
      slug: post.slug,
      categories: post.categories,
      readingTime: post.mdx ? calculateReadingTime(post.mdx) : null,
    }));

  const featuredPost = articles[0];
  const remainingPosts = articles.slice(1);

  return (
    <>
      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Artikler", href: "/blog" },
          { label: data.title },
        ]}
        eyebrow="Bransjekommentar · Markedsanalyser"
        title={
          <>
            {data.title} <br />
            <span className="italic">— vår tolkning av markedet.</span>
          </>
        }
        lede={data.description}
      >
        {/* Filter chips */}
        <div className="bg-filters">
          <Link
            href="/blog"
            className="bg-filter"
            style={{ textDecoration: "none" }}
          >
            Alle
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}`}
              className={`bg-filter${cat.slug === data.slug ? " active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </SubHero>

      <section className="section-tight">
        <div className="wrap">
          {articles.length === 0 && (
            <p className="mi-footnote" style={{ borderTop: 0 }}>
              <span className="source">
                Ingen artikler i denne kategorien ennå. Kom tilbake snart.
              </span>
            </p>
          )}

          {/* Featured */}
          {featuredPost && (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="bg-feature"
              style={{ display: "grid", color: "inherit" }}
            >
              <div>
                <div className="pre">
                  <span className="cat">
                    {categoryTitle(featuredPost.categories?.[0]).toUpperCase()}
                  </span>
                  <span>{editorialDate(featuredPost.publishedAt)}</span>
                  {featuredPost.readingTime && (
                    <>
                      <span>·</span>
                      <span>{featuredPost.readingTime} MIN LESING</span>
                    </>
                  )}
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.summary}</p>
                <span className="more">
                  Les hele analysen <span>→</span>
                </span>
              </div>
              <div className="img">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  width={1200}
                  height={800}
                  priority
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Link>
          )}

          {/* Article grid */}
          {remainingPosts.length > 0 && (
            <div className="bg-grid">
              {remainingPosts.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="bg-card"
                >
                  <div className="img">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={800}
                      height={500}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="meta">
                    <span className="cat">
                      {categoryTitle(article.categories?.[0]).toUpperCase()}
                    </span>
                    <span>{editorialDate(article.publishedAt)}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                </Link>
              ))}
            </div>
          )}

          {articles.length > 0 && (
            <div className="mi-footnote" style={{ marginTop: 56 }}>
              <span className="source">
                Analysene reflekterer Advantis vurdering basert på vår egen
                markedsdatabase. De er ment som informasjon — ikke som spesifikt
                investeringsråd.
              </span>
              <span>
                {articles.length}{" "}
                {articles.length === 1 ? "artikkel" : "artikler"}
              </span>
            </div>
          )}
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
