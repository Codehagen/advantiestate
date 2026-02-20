import { allHelpPosts } from "content-collections"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import HelpArticleLink from "@/components/blog/help-article-link"
import MaxWidthWrapper from "@/components/blog/max-width-wrapper"
import SearchButton from "@/components/blog/search-button"
import { HELP_CATEGORIES, POPULAR_ARTICLES } from "@/lib/blog/content"
import { constructMetadata } from "@/lib/utils"
import { RiArrowRightSLine } from "@remixicon/react"

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
    .filter((post) => post.categories.includes(data.slug))
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

  return (
    <>
      <MaxWidthWrapper className="flex max-w-screen-lg flex-col py-10 pt-32 md:pt-40">
        <SearchButton />
      </MaxWidthWrapper>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-warm-grey-2/20 via-warm-grey-2/20 to-warm-grey-2/20" />
        <MaxWidthWrapper className="flex max-w-screen-lg flex-col py-10">
          <div className="flex items-center space-x-2">
            <Link
              href="/help"
              className="text-sm font-medium text-warm-grey/60 hover:text-warm-grey/80 dark:text-warm-white/60 dark:hover:text-warm-white/80"
            >
              Alle kategorier
            </Link>
            <RiArrowRightSLine className="h-4 w-4 text-warm-grey/60 dark:text-warm-white/60" />
            <Link
              href={`/help/category/${data.slug}`}
              className="text-sm font-medium text-warm-grey/60 hover:text-warm-grey/80 dark:text-warm-white/60 dark:hover:text-warm-white/80"
            >
              {data.title}
            </Link>
          </div>
          <div className="my-8 flex flex-col space-y-4">
            <Link href={`/help/category/${data.slug}`}>
              <h1 className="font-display text-2xl font-bold text-warm-grey sm:text-4xl dark:text-warm-white">
                {data.title}
              </h1>
            </Link>
            <p className="text-warm-grey/80 dark:text-warm-white/80">{data.description}</p>
          </div>
          <div className="grid gap-2 rounded-xl border border-warm-grey-2/20 bg-warm-grey-2/10 p-4 backdrop-blur-sm">
            {articles.map((article) => (
              <HelpArticleLink key={article.slug} article={article} />
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  )
}
