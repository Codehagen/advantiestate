import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Blog content regression — proves every `.mdx` file in src/content/blog
 * actually compiles into a reachable post.
 *
 * Content Collections silently DROPS a post when its YAML frontmatter fails
 * to parse (e.g. an unquoted `title:`/`summary:` value containing a colon —
 * "Nested mappings are not allowed in compact mappings"). A dropped post
 * falls out of `allBlogPosts`, so `/blog/<slug>` 404s with no build error.
 * This test fails loudly when that happens.
 */

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

const slugs = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => {
    const raw = readFileSync(path.join(BLOG_DIR, f), "utf-8");
    // Read the explicit `slug:` line with a plain regex — the files this test
    // guards against are exactly the ones that fail to YAML-parse, so a real
    // YAML parser can't be relied on. Normalize the scalar: strip an inline
    // `# comment` and any surrounding quotes before using it as a URL segment.
    const rawSlug = /^slug:\s*(.+?)\s*$/m.exec(raw)?.[1];
    const explicit = rawSlug
      ?.replace(/\s+#.*$/, "")
      .replace(/^["']|["']$/g, "")
      .trim();
    return explicit || f.replace(/\.mdx$/, "");
  });

test("every blog .mdx compiles into a reachable post", async ({ page }) => {
  // Crawls every blog post sequentially; each render may fetch external blur
  // images. Matches the sitemap-crawl test's extended budget in routes.spec.ts.
  test.setTimeout(120_000);

  expect(slugs.length, "blog .mdx source file count").toBeGreaterThan(0);

  const dropped: string[] = [];
  for (const slug of slugs) {
    const res = await page.goto(`/blog/${slug}`, {
      waitUntil: "domcontentloaded",
    });
    if (!res || res.status() >= 400) {
      dropped.push(`${slug} (HTTP ${res?.status() ?? "no response"})`);
    }
  }

  expect(
    dropped,
    `Blog posts dropped — likely a frontmatter parse/validation failure: ${dropped.join(
      ", ",
    )}`,
  ).toEqual([]);
});
