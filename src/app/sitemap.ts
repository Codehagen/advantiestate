import { BLOG_CATEGORIES, HELP_CATEGORIES } from "@/lib/blog/content";
import {
  allBlogPosts,
  allCustomersPosts,
  allHelpPosts,
  allIntegrationsPosts,
  allPersonPosts,
  allLocationPosts,
} from "content-collections";
import { MetadataRoute } from "next";
import { siteConfig } from "./siteConfig";
import { getListings } from "@/lib/listing/listings";
import { SERVICE_SLUGS, SERVICE_CITY_SLUGS } from "@/lib/service-cities";

// ISR: the listing section is sourced from the CRM (Supabase). Revalidate on the
// same window as the /eiendommer pages so a newly published mandate appears in
// the sitemap without a redeploy.
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Core static pages. `lastModified` is intentionally omitted — there is no
  // real per-page modified date, and a build-time `new Date()` would report
  // "changed now" on every deploy, training crawlers to distrust the field.
  const staticPages = [
    "/",
    "/om-oss",
    "/tjenester",
    "/tjenester/verdivurdering",
    "/tjenester/salg",
    "/tjenester/radgivning",
    "/tjenester/utleie",
    "/tjenester/transaksjoner",
    "/tjenester/strategisk-radgivning",
    "/verktoy",
    "/verktoy/yield-kalkulator",
    "/verktoy/boliglan-kalkulator",
    "/verktoy/roi-kalkulator",
    "/verktoy/pris-verdivurdering",
    "/markedsinnsikt",
    "/markedsinnsikt/kart",
    "/markedsrapport",
    "/presserom",
    "/karriere",
    "/kontakt",
    "/help",
    "/blog",
    "/kunder",
    "/integrasjoner",
    "/personer",
    "/naringsmegler",
    "/eiendommer",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "daily" as const,
    priority: route === "/" ? 1.0 : 0.8,
  }));

  // Blog category pages — `lastModified` omitted (no true modified date).
  const blogCategories = BLOG_CATEGORIES.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Help category pages — `lastModified` omitted (no true modified date).
  const helpCategories = HELP_CATEGORIES.map((category) => ({
    url: `${baseUrl}/help/category/${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic help article pages — `lastModified` derived from frontmatter.
  const helpPages = allHelpPosts.map((post) => ({
    url: `${baseUrl}/help/article/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic blog pages — `lastModified` prefers `updatedAt` when an evergreen
  // post has been refreshed; falls back to `publishedAt` for unedited posts.
  const blogPages = allBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic customer story pages — `lastModified` derived from frontmatter.
  const customerPages = allCustomersPosts.map((post) => ({
    url: `${baseUrl}/kunder/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Dynamic integration pages — `lastModified` derived from frontmatter.
  const integrationPages = allIntegrationsPosts.map((post) => ({
    url: `${baseUrl}/integrasjoner/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic person pages — `lastModified` derived from frontmatter.
  const personPages = allPersonPosts.map((post) => ({
    url: `${baseUrl}/personer/${post.slug}`,
    lastModified: new Date(post.startedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic location pages — `lastModified` omitted (location MDX carries no
  // updated date in frontmatter).
  const locationPages = allLocationPosts.map((location) => ({
    url: `${baseUrl}/naringsmegler/${location.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Service × city landing pages (/tjenester/{service}/{by}) — enumerated from
  // the curated allowlist that the routes' generateStaticParams use.
  const serviceCityPages = SERVICE_CITY_SLUGS.flatMap((by) =>
    SERVICE_SLUGS.map((service) => ({
      url: `${baseUrl}/tjenester/${service}/${by}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  );

  // Active listing detail pages. Source of truth is the CRM (Supabase) via
  // getListings(), with MDX listings folded in as a fallback — iterating the
  // MDX collection alone would omit every CRM-published mandate that has no MDX
  // file (the bulk of the live portfolio). `lastModified` prefers `updatedAt`
  // for re-priced/re-statused listings; falls back to `publishedAt`.
  const listings = await getListings();
  const listingPages = listings.map((listing) => ({
    url: `${baseUrl}/eiendommer/${listing.slug}`,
    lastModified: new Date(listing.updatedAt ?? listing.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    ...staticPages,
    ...blogCategories,
    ...helpCategories,
    ...helpPages,
    ...blogPages,
    ...customerPages,
    ...integrationPages,
    ...personPages,
    ...locationPages,
    ...serviceCityPages,
    ...listingPages,
  ];
}
