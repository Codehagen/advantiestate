import { BLOG_CATEGORIES, HELP_CATEGORIES } from "@/lib/blog/content";
import {
  allBlogPosts,
  allCustomersPosts,
  allHelpPosts,
  allIntegrationsPosts,
  allPersonPosts,
  allLegalPosts,
  allChangelogPosts,
  allLocationPosts,
} from "content-collections";
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const domain = headersList.get("host") ?? "www.advantiestate.no";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${domain}`;

  // Core static pages
  const lastModifiedStatic = new Date("2025-01-25");
  const staticPages = [
    "",
    "/om-oss",
    "/tjenester",
    "/tjenester/verdivurdering",
    "/tjenester/salg",
    "/tjenester/utleie",
    "/tjenester/strategisk-radgivning",
    "/markedsinnsikt",
    "/kontakt",
    "/help",
    "/blog",
    "/kunder",
    "/integrasjoner",
    "/personer",
    "/naringsmegler",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastModifiedStatic,
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Blog category pages
  const blogCategories = BLOG_CATEGORIES.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Help category pages
  const helpCategories = HELP_CATEGORIES.map((category) => ({
    url: `${baseUrl}/help/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic help article pages
  const helpPages = allHelpPosts.map((post) => ({
    url: `${baseUrl}/help/article/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic blog pages
  const blogPages = allBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic customer story pages
  const customerPages = allCustomersPosts.map((post) => ({
    url: `${baseUrl}/kunder/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Dynamic integration pages
  const integrationPages = allIntegrationsPosts.map((post) => ({
    url: `${baseUrl}/integrasjoner/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic person pages
  const personPages = allPersonPosts.map((post) => ({
    url: `${baseUrl}/personer/${post.slug}`,
    lastModified: new Date(post.startedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic legal pages
  const legalPages = allLegalPosts.map((post) => ({
    url: `${baseUrl}/legal/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Dynamic changelog pages
  const changelogPages = allChangelogPosts.map((post) => ({
    url: `${baseUrl}/changelog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Dynamic location pages
  const locationPages = allLocationPosts.map((location) => ({
    url: `${baseUrl}/naringsmegler/${location.slug}`,
    lastModified: new Date(),
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
    ...legalPages,
    ...changelogPages,
    ...locationPages,
  ];
}
