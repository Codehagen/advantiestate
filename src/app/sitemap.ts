import { BLOG_CATEGORIES, HELP_CATEGORIES } from "@/lib/blog/content";
import {
  allBlogPosts,
  allCustomersPosts,
  allHelpPosts,
  allIntegrationsPosts,
} from "content-collections";
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const domain = headersList.get("host") ?? "www.advantiestate.no";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${domain}`;

  // Core static pages
  const staticPages = [
    "",
    "/om-oss",
    "/tjenester",
    "/tjenester/verdsettelse",
    "/tjenester/salg",
    "/tjenester/utleie",
    "/tjenester/strategisk-radgivning",
    "/markedsinnsikt",
    "/kontakt",
    "/help",
    "/blog",
    "/kunder",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
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

  return [
    ...staticPages,
    ...blogCategories,
    ...helpCategories,
    ...helpPages,
    ...blogPages,
    ...customerPages,
    ...integrationPages,
  ];
}
