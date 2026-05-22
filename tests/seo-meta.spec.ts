import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * SEO metadata regression. Guards the canonical sweep, the noindex pages, the
 * sitemap hygiene, the robots policy and the title-length fix introduced on the
 * `seo/metadata-canonical-fixes` branch.
 *
 * Runs against the production build (see playwright.config.ts) so the asserted
 * <head> tags are the real server-rendered output, not dev-mode guesses.
 *
 *   - constructMetadata() emits a self-referencing canonical on every page.
 *   - noindex pages emit `noindex, follow` (never `nofollow`).
 *   - the sitemap lists only live, 200, self-canonical URLs.
 *   - robots.txt no longer blocks /_next/.
 *   - no <title> carries a code-baked truncation ellipsis.
 */

// The 6 blog posts retired in this branch — must not reappear in the sitemap.
const RETIRED_SLUGS = [
  "handelslokaler-nord-norge",
  "naringseiendomsmarkedet-narvik",
  "naringseiendomsmarkedet-2025-nord-norge",
  "utleie-naringseiendom-nord-norge",
  "komplett-guide-verdivurdering-naringseiendom",
  "yield-naringseiendom-hva-det-er",
];

// Pages intentionally kept out of the organic index.
const NOINDEX_ROUTES = [
  "/landing/verdivurdering",
  "/presentasjon",
  "/sjekkliste-verdivurdering",
];

/** Trailing-slash-insensitive URL compare (`/foo/` ≡ `/foo`, `https://x/` ≡ `https://x`). */
const stripSlash = (u: string) => u.replace(/\/+$/, "") || u;

function canonicalHrefs(html: string): string[] {
  const tags = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/gi) ?? [];
  return tags
    .map((t) => t.match(/\bhref="([^"]*)"/i)?.[1])
    .filter((h): h is string => Boolean(h));
}

function robotsContent(html: string): string | null {
  const tag = html.match(/<meta\b[^>]*\bname="robots"[^>]*>/i)?.[0];
  return tag ? tag.match(/\bcontent="([^"]*)"/i)?.[1] ?? null : null;
}

function metaProperty(html: string, prop: string): string | null {
  const tag = html.match(
    new RegExp(`<meta\\b[^>]*\\bproperty="${prop}"[^>]*>`, "i"),
  )?.[0];
  return tag ? tag.match(/\bcontent="([^"]*)"/i)?.[1] ?? null : null;
}

function pageTitle(html: string): string {
  return (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&#(?:38|x26);/gi, "&");
}

async function sitemapUrls(request: APIRequestContext): Promise<string[]> {
  const res = await request.get("/sitemap.xml");
  expect(res.status(), "sitemap.xml status").toBe(200);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

test("sitemap lists no changelog or retired-post URLs", async ({ request }) => {
  const urls = await sitemapUrls(request);
  expect(urls.length, "sitemap URL count").toBeGreaterThan(10);
  const bad = urls.filter(
    (u) =>
      u.includes("/changelog/") || RETIRED_SLUGS.some((s) => u.includes(s)),
  );
  expect(bad, `stale URLs in sitemap:\n${bad.join("\n")}`).toEqual([]);
});

test("every sitemap URL is 200, indexable and self-canonical", async ({
  request,
}) => {
  test.setTimeout(120_000);
  const urls = await sitemapUrls(request);
  const failures: string[] = [];

  for (const url of urls) {
    const path = new URL(url).pathname;
    // maxRedirects:0 — a sitemap URL must be the final 200, never a 3xx.
    const res = await request.get(path, { maxRedirects: 0 });
    if (res.status() !== 200) {
      failures.push(`${path} -> HTTP ${res.status()} (must be 200, not a redirect)`);
      continue;
    }
    const html = await res.text();

    const canon = canonicalHrefs(html);
    if (canon.length !== 1) {
      failures.push(`${path} -> ${canon.length} canonical tags (expected exactly 1)`);
    } else if (stripSlash(canon[0]) !== stripSlash(url)) {
      failures.push(`${path} -> canonical ${canon[0]} != sitemap <loc> ${url}`);
    }

    const robots = robotsContent(html);
    if (robots && /noindex/i.test(robots)) {
      failures.push(`${path} -> sitemap URL is noindex ("${robots}")`);
    }
  }

  expect(failures, `\n${failures.join("\n")}`).toEqual([]);
});

test("noindex pages emit noindex, follow", async ({ request }) => {
  for (const route of NOINDEX_ROUTES) {
    const res = await request.get(route, { maxRedirects: 0 });
    expect(res.status(), `${route} status`).toBe(200);
    const robots = robotsContent(await res.text());
    expect(robots, `${route} has a robots meta`).toBeTruthy();
    expect(robots!, `${route} is noindex`).toMatch(/noindex/i);
    expect(robots!, `${route} must NOT be nofollow`).not.toMatch(/nofollow/i);
  }
});

test("no page title carries a truncation ellipsis", async ({ request }) => {
  // Titles are intentionally not length-capped — Google renders its own SERP
  // truncation. The anti-pattern this guards is a literal "..." / "…" baked
  // into the <title> element itself.
  test.setTimeout(120_000);
  const urls = await sitemapUrls(request);
  const failures: string[] = [];

  for (const url of urls) {
    const path = new URL(url).pathname;
    const title = pageTitle(await (await request.get(path)).text());
    if (!title) {
      failures.push(`${path} -> empty <title>`);
    } else if (title.includes("...") || title.includes("…")) {
      failures.push(`${path} -> title carries an ellipsis: "${title}"`);
    }
  }

  expect(failures, `\n${failures.join("\n")}`).toEqual([]);
});

test("robots.txt does not block /_next/", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status(), "robots.txt status").toBe(200);
  const txt = await res.text();
  expect(txt, "robots.txt must not disallow /_next/").not.toMatch(
    /Disallow:\s*\/_next\//i,
  );
});

test("blog post and help article emit og:type=article", async ({ request }) => {
  const urls = await sitemapUrls(request);
  const blog = urls.find((u) => /\/blog\/[^/]+$/.test(new URL(u).pathname));
  const help = urls.find((u) => /\/help\/article\//.test(new URL(u).pathname));
  expect(blog, "a blog post URL exists in the sitemap").toBeTruthy();
  expect(help, "a help article URL exists in the sitemap").toBeTruthy();

  for (const u of [blog!, help!]) {
    const path = new URL(u).pathname;
    const html = await (await request.get(path)).text();
    expect(metaProperty(html, "og:type"), `${path} og:type`).toBe("article");
  }
});
