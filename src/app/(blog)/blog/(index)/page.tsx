import { allBlogPosts } from "content-collections";

import BlogCard from "@/components/blog/blog-card";
import FeaturedPost from "@/components/blog/featured-post";
import { getBlurDataURL } from "@/lib/blog/images";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Artikler – Advanti Estate",
  description:
    "Siste nyheter, trends og innsikter fra Advanti Estate. Finn ekspertråd og veiledning for å forvalte og investere i næringseiendom i Nord-Norge.",
});

export default async function Blog() {
  const sortedPosts = allBlogPosts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const articles = await Promise.all(
    sortedPosts.map(async (post) => ({
      title: post.title,
      summary: post.summary,
      publishedAt: post.publishedAt,
      image: post.image,
      author: post.author,
      slug: post.slug,
      categories: post.categories,
      mdx: post.mdx?.code || "",
      blurDataURL: await getBlurDataURL(post.image),
    }))
  );

  const featuredPost = articles[0];
  const remainingPosts = articles.slice(1);

  return (
    <>
      {featuredPost && <FeaturedPost data={featuredPost} />}
      {remainingPosts.map((article, idx) => (
        <BlogCard key={article.slug} data={article} priority={idx <= 1} />
      ))}
    </>
  );
}
