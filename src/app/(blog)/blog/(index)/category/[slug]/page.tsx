import { allBlogPosts } from "content-collections"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import BlogCard from "@/components/blog/blog-card"
import { BLOG_CATEGORIES } from "@/lib/blog/content"
import { getBlurDataURL } from "@/lib/blog/images"
import { constructMetadata } from "@/lib/utils"

interface BlogPost {
  title: string
  summary: string
  publishedAt: string
  image: string
  author: string
  slug: string
  mdx?: string
  related?: string[]
  tableOfContents?: any
  images?: any
  tweetIds?: any
  githubRepos?: any
  categories?: string[]
  _meta?: any
}

interface BlogPostWithBlur extends BlogPost {
  blurDataURL: string
}

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata | undefined> {
  const { slug } = await params
  const category = BLOG_CATEGORIES.find((category) => category.slug === slug)
  if (!category) {
    return
  }

  const { title, description } = category

  return constructMetadata({
    title: `${title} – Propdock`,
    description,
    image: `/api/og/help?title=${encodeURIComponent(
      title,
    )}&summary=${encodeURIComponent(description)}`,
  })
}

export default async function BlogCategory({
  params,
}: {
  params: {
    slug: string
  }
}) {
  const { slug } = await params
  const data = BLOG_CATEGORIES.find((category) => category.slug === slug)
  if (!data) {
    notFound()
  }

  const articles: BlogPostWithBlur[] = await Promise.all(
    allBlogPosts
      .filter((post) => post.categories?.includes(data.slug as any))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .map(async (post) => ({
        title: post.title,
        summary: post.summary,
        publishedAt: post.publishedAt,
        image: post.image,
        author: post.author,
        slug: post.slug,
        categories: post.categories,
        blurDataURL: await getBlurDataURL(post.image),
      })),
  )

  return articles.map((article, idx) => (
    <BlogCard key={article.slug} data={article} priority={idx <= 1} />
  ))
}
