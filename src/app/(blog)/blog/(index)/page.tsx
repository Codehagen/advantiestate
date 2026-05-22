import { allBlogPosts } from "content-collections";
import Image from "next/image";
import Link from "next/link";

import { NewsletterSection } from "@/components/site/NewsletterSection";
import { SubHero } from "@/components/site/SubHero";
import { BLOG_CATEGORIES } from "@/lib/blog/content";
import { calculateReadingTime } from "@/lib/blog/utils";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Artikler – Advanti Estate",
  description:
    "Siste nyheter, trends og innsikter fra Advanti Estate. Finn ekspertråd og veiledning for å forvalte og investere i næringseiendom i Nord-Norge.",
});

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

export default async function Blog() {
  const sortedPosts = allBlogPosts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const articles = sortedPosts.map((post) => ({
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
        crumb={[{ label: "Hjem", href: "/" }, { label: "Artikler & analyser" }]}
        eyebrow="Bransjekommentar · Markedsanalyser"
        title={
          <>
            Analyser, kommentar og <br />
            <span className="italic">vår tolkning av markedet.</span>
          </>
        }
        lede="Vi skriver om næringseiendomsmarkedet slik vi ser det — med tall, kontekst og konkrete synspunkter. Dette er ikke generelle artikler, det er hvordan vi tenker."
      >
        {/* Filter chips */}
        <div className="bg-filters">
          <Link
            href="/blog"
            className="bg-filter active"
            style={{ textDecoration: "none" }}
          >
            Alle
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}`}
              className="bg-filter"
              style={{ textDecoration: "none" }}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </SubHero>

      <section className="section-tight">
        <div className="wrap">
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

          <div className="mi-footnote" style={{ marginTop: 56 }}>
            <span className="source">
              Analysene reflekterer Advantis vurdering basert på vår egen
              markedsdatabase. De er ment som informasjon — ikke som spesifikt
              investeringsråd.
            </span>
            <span>
              {articles.length} {articles.length === 1 ? "artikkel" : "artikler"}
            </span>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
