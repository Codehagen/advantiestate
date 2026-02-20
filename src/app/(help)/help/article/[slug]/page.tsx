import { allHelpPosts, HelpPost } from "content-collections";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Author from "@/components/blog/author";
import Feedback from "@/components/blog/feedback";
import HelpArticleLink from "@/components/blog/help-article-link";
import MaxWidthWrapper from "@/components/blog/max-width-wrapper";
import { MDX } from "@/components/blog/mdx";
import SearchButton from "@/components/blog/search-button";
import TableOfContents from "@/components/blog/table-of-contents";
import { HELP_CATEGORIES } from "@/lib/blog/content";
import { getBlurDataURL } from "@/lib/blog/images";
import { constructMetadata } from "@/lib/utils";
import { RiArrowRightSLine } from "@remixicon/react";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";

const HELP_ARTICLE_ALIASES: Record<string, string> = {
  "hva-er-næringseiendom-en-komplett-guide": "hva-er-naringseiendom",
  "hva-er-naringseiendom-en-komplett-guide": "hva-er-naringseiendom",
};

function resolveHelpArticleSlug(slug: string) {
  return HELP_ARTICLE_ALIASES[slug] ?? slug;
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
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const resolvedSlug = resolveHelpArticleSlug(slug);
  const post = allHelpPosts.find((post) => post.slug === resolvedSlug);
  if (!post) {
    return;
  }

  const { title, summary } = post;

  return constructMetadata({
    title: `${title} – Advanti Kunnskapsbase`,
    description: summary,
    image: `/api/og/help?title=${encodeURIComponent(
      title,
    )}&summary=${encodeURIComponent(summary)}`,
    canonical: `/help/article/${post.slug}`,
  });
}

export default async function HelpArticle({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;
  const resolvedSlug = resolveHelpArticleSlug(slug);
  const data = allHelpPosts.find((post) => post.slug === resolvedSlug);
  if (!data) {
    notFound();
  }
  const category = HELP_CATEGORIES.find(
    (category) => data.categories[0] === category.slug,
  )!;

  const [images] = await Promise.all([
    await Promise.all(
      data.images.map(async (src: string) => ({
        src,
        blurDataURL: await getBlurDataURL(src),
      })),
    ),
  ]);

  const relatedArticles =
    ((data.related &&
      data.related
        .map((slug) => allHelpPosts.find((post) => post.slug === slug))
        .filter(Boolean)) as HelpPost[]) || [];

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
          publishedAt: data.updatedAt,
          updatedAt: data.updatedAt,
          author: data.author,
          url: `/help/article/${data.slug}`,
        }}
      />
      <MaxWidthWrapper className="flex max-w-screen-lg flex-col py-10 pt-32 md:pt-40">
        <SearchButton />
      </MaxWidthWrapper>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-warm-grey-2/20 via-warm-grey-2/20 to-warm-grey-2/20" />
        <MaxWidthWrapper className="grid max-w-screen-lg grid-cols-4 gap-10 py-10">
          <div className="col-span-4 flex flex-col space-y-8 sm:col-span-3 sm:pr-10">
            <div className="flex items-center space-x-2">
              <Link
                href="/help"
                className="whitespace-nowrap text-sm font-medium text-warm-grey/60 hover:text-warm-grey/80 dark:text-warm-white/60 dark:hover:text-warm-white/80"
              >
                Alle kategorier
              </Link>
              <RiArrowRightSLine className="h-4 w-4 text-warm-grey/60 dark:text-warm-white/60" />
              <Link
                href={`/help/category/${category.slug}`}
                className="whitespace-nowrap text-sm font-medium text-warm-grey/60 hover:text-warm-grey/80 dark:text-warm-white/60 dark:hover:text-warm-white/80"
              >
                {category.title}
              </Link>
              <RiArrowRightSLine className="h-4 w-4 text-warm-grey/60 dark:text-warm-white/60" />
              <Link
                href={`/help/article/${data.slug}`}
                className="truncate text-sm font-medium text-warm-grey/60 hover:text-warm-grey/80 dark:text-warm-white/60 dark:hover:text-warm-white/80"
              >
                {data.title}
              </Link>
            </div>
            <div className="flex flex-col space-y-4">
              <Link href={`/help/article/${data.slug}`}>
                <h1 className="font-display text-3xl font-bold !leading-snug text-warm-grey sm:text-4xl dark:text-warm-white">
                  {data.title}
                </h1>
              </Link>
              <p className="text-warm-grey/80 dark:text-warm-white/80">{data.summary}</p>
              <Author username={data.author} updatedAt={data.updatedAt} />
            </div>
            <MDX code={data.mdx} images={images} />
            {relatedArticles.length > 0 && (
              <div className="flex flex-col space-y-4 border-t border-warm-grey-2/20 pt-8">
                <h2 className="font-display text-xl font-bold text-warm-grey sm:text-2xl dark:text-warm-white">
                  Relaterte artikler
                </h2>
                <div className="grid gap-2 rounded-xl border border-warm-grey-2/20 bg-warm-grey-2/10 p-4 backdrop-blur-sm">
                  {relatedArticles.map((article) => (
                    <HelpArticleLink key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            )}
            <Feedback />
            <div className="mt-12 border-t border-warm-grey-2/20 pt-12">
              <AnimatedCTA
                badge="Eksperthjelp"
                title="Behov for rådgivning om næringseiendom?"
                description="Våre rådgivere har dyp kunnskap om markedet i Nord-Norge og kan bistå deg med alt fra verdivurdering til salg og utleie."
                primaryAction={{
                  label: "Kontakt oss for en prat",
                  href: "/kontakt",
                }}
                secondaryAction={{
                  label: "Se alle våre tjenester",
                  href: "/tjenester",
                }}
                size="default"
              />
            </div>
          </div>
          <div className="sticky top-32 col-span-1 hidden flex-col space-y-10 divide-y divide-warm-grey-2/20 self-start sm:flex">
            {data.tableOfContents.length > 0 && (
              <TableOfContents items={data.tableOfContents} />
            )}
            <div className="flex justify-center pt-5">
              <Link
                href={`https://github.com/codehagen/leadhive/blob/main/app/content/help/${slug}.mdx`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-warm-grey/60 transition-colors hover:text-warm-grey/80 dark:text-warm-white/60 dark:hover:text-warm-white/80"
              >
                Fant du en skrivefeil? Rediger denne siden ↗
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
