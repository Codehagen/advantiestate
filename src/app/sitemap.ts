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
    "/karriere",
    "/kontakt",
    "/help",
    "/blog",
    "/kunder",
    "/integrasjoner",
    "/personer",
    "/naringsmegler",
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
  ];
}
