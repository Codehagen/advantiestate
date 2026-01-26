import Link from "next/link";

import BlurImage from "@/lib/blog/blur-image";
import { BLOG_CATEGORIES } from "@/lib/blog/content";
import { calculateReadingTime, formatReadingTime } from "@/lib/blog/utils";
import { formatDate } from "@/lib/utils";
import { cx } from "@/lib/utils";

import Author from "./author";

interface FeaturedPostProps {
  data: {
    title: string;
    summary: string;
    publishedAt: string;
    image: string;
    author: string;
    slug: string;
    categories?: string[];
    mdx?: string;
    blurDataURL: string;
  };
}

export default function FeaturedPost({ data }: FeaturedPostProps) {
  const category = data.categories?.[0]
    ? BLOG_CATEGORIES.find((cat) => cat.slug === data.categories[0])
    : null;

  const readingTime = data.mdx
    ? formatReadingTime(calculateReadingTime(data.mdx))
    : null;

  return (
    <Link
      href={`/blog/${data.slug}`}
      className={cx(
        "group relative col-span-1 flex flex-col overflow-hidden rounded-xl border border-warm-grey-2/20 bg-warm-grey-2/5 text-warm-white transition-all duration-300 md:col-span-2",
        "hover:border-warm-grey-2/30 hover:bg-warm-grey-2/10 hover:shadow-xl hover:shadow-warm-grey-2/20"
      )}
    >
      <div className="relative flex-1 overflow-hidden">
        <BlurImage
          className={cx(
            "aspect-[1200/630] h-full w-full object-cover transition-transform duration-500",
            "group-hover:scale-105"
          )}
          src={data.image}
          blurDataURL={data.blurDataURL}
          width={1200}
          height={630}
          alt={data.title}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-grey-2/90 via-warm-grey-2/50 to-transparent" />
        {category && (
          <div className="absolute top-6 left-6">
            <span className="rounded-full border border-warm-grey-2/20 bg-warm-grey-2/90 px-4 py-1.5 text-sm font-semibold text-warm-white backdrop-blur-sm">
              {category.title}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center space-x-4 text-sm text-warm-white/80">
            <Author username={data.author} imageOnly />
            <time dateTime={data.publishedAt} className="text-warm-white/80">
              {formatDate(data.publishedAt)}
            </time>
            {readingTime && (
              <>
                <span className="text-warm-white/60">•</span>
                <span className="text-warm-white/80">{readingTime}</span>
              </>
            )}
          </div>
          <h2 className="font-display mt-4 text-3xl font-extrabold text-warm-white sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-lg leading-relaxed text-warm-white/90">
            {data.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}
