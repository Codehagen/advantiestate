import Link from "next/link";
import { allLocationPosts } from "content-collections";
import { Badge } from "@/components/Badge";
import { cx } from "@/lib/utils";

const DEFAULT_TITLE = "Næringsmegler der du trenger oss";
const DEFAULT_DESCRIPTION =
  "Vi dekker sentrale byer og regioner i Nord‑Norge med lokal tilstedeværelse og spesialisert næringseiendomskompetanse.";

export default function CoveredCities({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  badge = "Byer vi dekker",
  className,
  compact = false,
}: {
  title?: string;
  description?: string;
  badge?: string;
  className?: string;
  compact?: boolean;
}) {
  const locations = [...allLocationPosts].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <section className={cx("mx-auto w-full max-w-6xl", className)}>
      <div className="flex flex-col items-center gap-6 text-center">
        <Badge>{badge}</Badge>
        <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
          {title}
        </h2>
        <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
          {description}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Link
            key={location.slug}
            href={`/naringsmegler/${location.slug}`}
            className="group rounded-2xl border border-warm-grey/10 bg-warm-white/70 p-6 shadow-lg shadow-warm-grey/5 transition hover:-translate-y-1 hover:border-warm-grey/20 hover:shadow-warm-grey/10 dark:border-warm-white/10 dark:bg-warm-grey/30"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-warm-grey dark:text-warm-white">
                  {location.name}
                </h3>
                <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  {location.region}
                </p>
              </div>
              <span className="rounded-full border border-warm-grey/10 px-3 py-1 text-xs font-medium text-warm-grey-2 dark:border-warm-white/10 dark:text-warm-grey-1">
                {location.serviceArea === "Region" ? "Region" : "By"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-warm-grey-2 dark:text-warm-grey-1">
              {location.hero.description}
            </p>
            {!compact && location.marketStats?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {location.marketStats.slice(0, 2).map((stat) => (
                  <span
                    key={`${location.slug}-${stat.label}`}
                    className="rounded-full border border-warm-grey/10 px-3 py-1 text-xs text-warm-grey-2 dark:border-warm-white/10 dark:text-warm-grey-1"
                  >
                    {stat.label}: {stat.value}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
