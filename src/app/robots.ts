import { MetadataRoute } from "next";
import { siteConfig } from "./siteConfig";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  // Per-bot disallows mirror the wildcard rule so that the more-specific
  // named-agent block (which overrides the wildcard for that bot in any
  // standards-compliant parser) does not accidentally open up /api/ or
  // /admin/ when granting AI crawl access.
  const SHARED_DISALLOW = ["/advanti/", "/api/", "/admin/"];

  // Allow the OG image-generation endpoint even though /api/ is otherwise
  // disallowed — so Google and social/AI crawlers (LinkedIn, Slack, …) can
  // fetch the dynamic og:image previews for listings and blog posts. Longest
  // path match wins in compliant parsers, so this opens /api/og/ only.
  const SHARED_ALLOW = ["/", "/api/og/"];

  // Explicit allow rules for the AI search/citation crawlers. Functionally
  // equivalent to the wildcard today, but documents intent — a future tightening
  // of the wildcard rule would not silently block these engines.
  const AI_SEARCH_BOTS = [
    "GPTBot",        // OpenAI ChatGPT training + search index
    "ChatGPT-User",  // ChatGPT user-initiated browse
    "ClaudeBot",     // Anthropic Claude search
    "anthropic-ai",  // Anthropic legacy/training crawler
    "PerplexityBot", // Perplexity citations
    "Google-Extended", // Gemini + Google AI Overviews
    "Bingbot",       // Microsoft Copilot (via Bing)
  ];

  return {
    rules: [
      ...AI_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: SHARED_ALLOW,
        disallow: SHARED_DISALLOW,
      })),
      // Common Crawl powers many AI training datasets; block it to opt out of
      // training corpora while keeping the search/citation bots above allowed.
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: SHARED_ALLOW,
        // `/_next/` is intentionally NOT disallowed — it holds render-critical
        // JS/CSS and the next/image endpoint that Googlebot must fetch to
        // render and index pages.
        disallow: SHARED_DISALLOW,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
