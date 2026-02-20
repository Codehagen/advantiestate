import CategoryCard from "@/components/blog/category-card"
import HelpArticleLink from "@/components/blog/help-article-link"
import MaxWidthWrapper from "@/components/blog/max-width-wrapper"
import SearchButton from "@/components/blog/search-button"
import { getPopularArticles, HELP_CATEGORIES } from "@/lib/blog/content"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  title: "Kunnskapssenter – Advanti",
  description:
    "Et sentralt knutepunkt for alle dine næringseiendoms-relaterte spørsmål. Finn svar på vanlige spørsmål, lær hvordan du bruker plattformen, og få ekspertråd.",
})

export default function HelpCenter() {
  const popularArticles = getPopularArticles()
  return (
    <>
      <MaxWidthWrapper className="max-w-screen-lg pt-32 md:pt-40">
        <div className="flex flex-col space-y-4 py-10">
          <h1 className="font-display pb-4 text-xl font-bold text-warm-grey sm:text-3xl dark:text-warm-white">
            👋 Hvordan kan vi hjelpe deg i dag?
          </h1>
          <SearchButton />
        </div>
      </MaxWidthWrapper>

      <div className="relative">
        <div className="absolute top-28 h-full w-full border-t border-warm-grey-2/20" />
        <MaxWidthWrapper className="relative max-w-screen-lg pb-20">
          <div className="relative z-10 mb-10 rounded-xl border border-warm-grey-2/20 bg-warm-grey-2/10 p-6 backdrop-blur-sm">
            <h2 className="font-display text-2xl font-bold text-warm-grey dark:text-warm-white">
              Populære artikler
            </h2>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {popularArticles.map((article) => (
                <HelpArticleLink key={article.slug} article={article} />
              ))}
            </div>
          </div>
          <div className="relative z-0 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {HELP_CATEGORIES.map((category) => (
              <CategoryCard
                key={category.slug}
                href={`/help/category/${category.slug}`}
                name={category.title}
                description={category.description}
                icon={category.icon}
                pattern={{
                  y: 16,
                  squares: [
                    [0, 1],
                    [1, 3],
                  ],
                }}
              />
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  )
}
