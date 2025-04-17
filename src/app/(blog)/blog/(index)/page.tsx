import { allBlogPosts } from "content-collections"

import BlogCard from "@/components/blog/blog-card"
import { getBlurDataURL } from "@/lib/blog/images"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  title: "Blog – Propdock",
  description:
    "Siste nyheter, trends og innsikter fra Propdock. Finn ekspertråd og veiledning for å forvalte og investere i næringseiendom.",
})

export default async function Blog() {
  const articles = await Promise.all(
    allBlogPosts
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
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
