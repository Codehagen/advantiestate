import { MetadataRoute } from "next";
import { siteConfig } from "./siteConfig";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/_next/` is intentionally NOT disallowed — it holds render-critical
        // JS/CSS and the next/image endpoint that Googlebot must fetch to
        // render and index pages.
        disallow: ["/advanti/", "/api/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
