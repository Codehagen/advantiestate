import { test, expect } from "@playwright/test";

/**
 * Editorial MDX component regression — locks the backward-compatible prop
 * mappings in src/components/blog/mdx.tsx that the sitemap crawl only proves
 * "doesn't crash". These assert the rendered markup so a future refactor of
 * the wrappers can't silently drop a legacy mapping.
 *
 * Added with the .ae-* editorial component family (2026-06-03).
 */

test("Quote renders legacy customer-quote props (title → role)", async ({
  page,
}) => {
  // corponor.mdx passes the OLD shape: author / authorSrc / title / company /
  // companySrc / text. The editorial .ae-quote must map `title` → `.role` and
  // keep `author` → `.name` (company/companySrc intentionally dropped).
  await page.goto("/kunder/corponor", { waitUntil: "domcontentloaded" });
  const quote = page.locator(".ae-quote").first();
  await expect(quote).toBeVisible();
  await expect(quote.locator(".ae-q")).not.toBeEmpty();
  await expect(quote.locator(".ae-cite .name")).toHaveText("Steffen Knudsen");
  await expect(quote.locator(".ae-cite .role")).toHaveText("Daglig leder");
});

test("Prerequisites renders the legacy markdown-children form", async ({
  page,
}) => {
  // The 3 help articles use <Prerequisites>…markdown list…</Prerequisites>
  // (children), not the new items={[]} array. The wrapper must render the
  // children list inside .ae-prereq.
  await page.goto("/help/article/diskontert-kontantstrom", {
    waitUntil: "domcontentloaded",
  });
  const prereq = page.locator(".ae-prereq").first();
  await expect(prereq).toBeVisible();
  await expect(prereq.locator("ul li").first()).toBeVisible();
});

test("blog article renders editorial Note, Formula and Example components", async ({
  page,
}) => {
  // dcf-analyse exercises legacy Note variant → editorial .ae-note (with a
  // label), Math → editorial .ae-formula frame, and Example with an emphasized
  // result row.
  await page.goto("/blog/dcf-analyse-naringseiendom", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator(".ae-note .ae-label").first()).toBeVisible();
  await expect(page.locator(".ae-formula .ae-eq").first()).toBeVisible();
  await expect(page.locator(".ae-example tr.is-result").first()).toBeVisible();
});
