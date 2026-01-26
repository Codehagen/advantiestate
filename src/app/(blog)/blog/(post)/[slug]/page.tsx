import Author from "@/components/blog/author";
import MaxWidthWrapper from "@/components/blog/max-width-wrapper";
import { MDX } from "@/components/blog/mdx";
import BlurImage from "@/lib/blog/blur-image";
import { BLOG_CATEGORIES } from "@/lib/blog/content";
import { getBlurDataURL } from "@/lib/blog/images";
import { constructMetadata, formatDate } from "@/lib/utils";
import { allBlogPosts } from "content-collections";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";

export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = allBlogPosts.find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  const { title, seoTitle, summary, seoDescription, image } = post;

  return constructMetadata({
    title: `${seoTitle || title} – Advanti`,
    description: seoDescription || summary,
    image,
    canonical: `/blog/${slug}`,
  });
}

// Priority categories that should be shown first
const PRIORITY_CATEGORIES = ["real-estate", "landscaping"];

export default async function BlogArticle({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;
  const data = allBlogPosts.find((post) => post.slug === slug);
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

  // First try to find a priority category (industry category)
  let category = PRIORITY_CATEGORIES.filter((cat) =>
    data.categories.includes(cat as any)
  )
    .map((cat) => BLOG_CATEGORIES.find((c) => c.slug === cat))
    .find((cat) => cat !== undefined);

  // If no priority category found, fall back to any valid category
  if (!category) {
    category = data.categories
      .map((cat) => BLOG_CATEGORIES.find((c) => c.slug === cat))
      .find((cat) => cat !== undefined);
  }

  if (!category) {
    console.error(`No valid category found for post: ${data.slug}`);
    notFound();
  }

  const relatedArticles = data.related
    ? data.related
        .map((slug) => allBlogPosts.find((post) => post.slug === slug))
        .filter((post): post is NonNullable<typeof post> => post !== undefined)
    : [];

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Blogg", url: "/blog" },
          { name: data.title, url: `/blog/${data.slug}` },
        ]}
      />
      <StructuredData
        type="article"
        data={{
          title: data.title,
          summary: data.summary,
          publishedAt: data.publishedAt,
          image: data.image,
          author: data.author,
          url: `/blog/${data.slug}`,
        }}
      />
      <MaxWidthWrapper>
        <div className="flex max-w-screen-sm flex-col space-y-4 pt-32 md:pt-40">
          <div className="flex items-center space-x-4">
            <Link
              href={`/blog/category/${category.slug}`}
              className="rounded-full border border-warm-grey/20 bg-warm-white/80 px-4 py-1.5 text-sm font-semibold text-warm-grey shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.1)] backdrop-blur transition-all hover:border-warm-grey/30 hover:bg-warm-white/50"
            >
              {category.title}
            </Link>
            <time
              dateTime={data.publishedAt}
              className="text-sm text-warm-white/60"
            >
              {formatDate(data.publishedAt)}
            </time>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-warm-white sm:text-4xl sm:leading-snug">
            {data.title}
          </h1>
          <p className="text-xl text-warm-white/80">{data.summary}</p>
        </div>
      </MaxWidthWrapper>

      <div className="relative">
        <div className="absolute top-52 h-[calc(100%-13rem)] w-full border border-warm-grey/20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur-lg" />
        <MaxWidthWrapper className="grid grid-cols-4 gap-5 px-0 pt-10 lg:gap-10">
          <div className="relative col-span-4 flex flex-col space-y-8 sm:rounded-t-xl sm:border sm:border-warm-grey/20 md:col-span-3">
          <BlurImage
            className="aspect-[1200/630] rounded-t-xl object-cover"
            src={data.image}
            blurDataURL={thumbnailBlurhash}
            width={1200}
            height={630}
            alt={data.title}
            priority
          />
          <MDX
            code={data.mdx}
            images={images.map((image) => ({
              ...image,
              alt: data.title,
            }))}
            className="px-5 pb-10 pt-4 sm:px-10"
          />
          <div className="px-5 pb-20 sm:px-10">
            <AnimatedCTA
              badge="Næringsmegling i Nord-Norge"
              title="Planlegger du salg eller utleie av næringseiendom?"
              description="Advanti kombinerer lokal kunnskap med avansert teknologi for å gi deg de beste resultatene i markedet."
              primaryAction={{
                label: "Kontakt oss",
                href: "/kontakt",
              }}
              secondaryAction={{
                label: "Våre tjenester",
                href: "/tjenester",
              }}
              size="default"
            />
          </div>
        </div>
          <div className="sticky top-20 col-span-1 mt-48 hidden flex-col divide-y divide-warm-grey/20 self-start sm:flex">
            <div className="flex flex-col space-y-4 py-5">
              <p className="text-sm text-warm-white/60">Skrevet av</p>
              <Author username={data.author} />
            </div>
            {relatedArticles.length > 0 && (
              <div className="flex flex-col space-y-4 py-5">
                <p className="text-sm text-warm-white/60">Les mer</p>
                <ul className="flex flex-col space-y-4">
                  {relatedArticles.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col space-y-2"
                      >
                        <p className="font-semibold text-warm-white underline-offset-4 group-hover:underline">
                          {post.title}
                        </p>
                        <p className="line-clamp-2 text-sm text-warm-white/80 underline-offset-2 group-hover:underline">
                          {post.summary}
                        </p>
                        <p className="text-xs text-warm-white/60 underline-offset-2 group-hover:underline">
                          {formatDate(post.publishedAt)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
