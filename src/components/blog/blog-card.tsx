import Link from "next/link";

import BlurImage from "@/lib/blog/blur-image";
import { BLOG_CATEGORIES } from "@/lib/blog/content";
import { formatDate } from "@/lib/utils";
import { cx } from "@/lib/utils";

import Author from "./author";

interface BlogPost {
  title: string;
  summary: string;
  publishedAt: string;
  image: string;
  author: string;
  slug: string;
  mdx?: string;
  related?: string[];
  tableOfContents?: any;
  images?: any;
  tweetIds?: any;
  githubRepos?: any;
  categories?: string[];
  _meta?: any;
}

export default function BlogCard({
  data,
  priority,
}: {
  data: BlogPost & {
    blurDataURL: string;
  };
  priority?: boolean;
}) {
  const category = data.categories?.[0]
    ? BLOG_CATEGORIES.find((cat) => cat.slug === data.categories[0])
    : null;

  return (
    <Link
      href={`/blog/${data.slug}`}
      className={cx(
        "group flex flex-col overflow-hidden rounded-lg border border-warm-grey-2/20 bg-warm-grey-2/5 text-warm-white transition-all duration-300",
        "hover:border-warm-grey-2/30 hover:bg-warm-grey-2/10 hover:shadow-lg hover:shadow-warm-grey-2/10"
      )}
    >
      <div className="relative overflow-hidden">
        <BlurImage
          className={cx(
            "aspect-[1200/630] object-cover transition-transform duration-300",
            "group-hover:scale-105"
          )}
          src={data.image}
          blurDataURL={data.blurDataURL}
          width={1200}
          height={630}
          alt={data.title}
          priority={priority}
        />
        {category && (
          <div className="absolute top-4 left-4">
            <span className="rounded-full border border-warm-grey-2/20 bg-warm-grey-2/90 px-3 py-1 text-xs font-semibold text-warm-white backdrop-blur-sm">
              {category.title}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h2 className="font-display line-clamp-2 text-xl font-bold text-warm-white transition-colors group-hover:text-warm-white/90 sm:text-2xl">
            {data.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-warm-white/70 sm:text-base">
            {data.summary}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Author username={data.author} imageOnly />
            <time
              dateTime={data.publishedAt}
              className="text-xs text-warm-white/60 sm:text-sm"
            >
              {formatDate(data.publishedAt)}
            </time>
          </div>
        </div>
      </div>
    </Link>
  );
}
