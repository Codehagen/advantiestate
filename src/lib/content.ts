// Server-only content access. React.cache() dedupes each lookup within a
// request, so a dynamic route's page component and its generateMetadata don't
// both iterate the collection. Kept separate from lib/blog/content.tsx because
// that file is imported by the client component mdx.tsx — server-side cache
// getters must not cross the client boundary. See PERFORMANCE_PLAN.md Phase 4.2.
import { cache } from "react"
import {
  allBlogPosts,
  allCustomersPosts,
  allHelpPosts,
  allIntegrationsPosts,
  allListingPosts,
} from "content-collections"

// Legacy / URL-encoded slug aliases → canonical content slugs.
const HELP_ARTICLE_ALIASES: Record<string, string> = {
  "hva-er-næringseiendom-en-komplett-guide": "hva-er-naringseiendom",
  "hva-er-naringseiendom-en-komplett-guide": "hva-er-naringseiendom",
}

const CUSTOMER_STORY_ALIASES: Record<string, string> = {
  "hvordan-vi-hjalp-en-investor-realisere-25-høyere-avkastning":
    "investor-avkastning",
  "hvordan-vi-hjalp-en-investor-realisere-25-hoyere-avkastning":
    "investor-avkastning",
}

export const getBlogPost = cache((slug: string) =>
  allBlogPosts.find((post) => post.slug === slug),
)

export const getHelpPost = cache((slug: string) =>
  allHelpPosts.find(
    (post) => post.slug === (HELP_ARTICLE_ALIASES[slug] ?? slug),
  ),
)

export const getCustomerPost = cache((slug: string) =>
  allCustomersPosts.find(
    (post) => post.slug === (CUSTOMER_STORY_ALIASES[slug] ?? slug),
  ),
)

export const getIntegrationPost = cache((slug: string) =>
  allIntegrationsPosts.find((post) => post.slug === slug),
)

export const getListingPost = cache((slug: string) =>
  allListingPosts.find((post) => post.slug === slug),
)

export const getActiveListings = cache(() =>
  [...allListingPosts].sort((a, b) => a.order - b.order),
)
