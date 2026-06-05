import { test, expect } from "@playwright/test";

/**
 * Editorial MDX component regression — locks the backward-compatible prop
 * mappings in src/components/blog/mdx.tsx that the sitemap crawl only proves
 * "doesn't crash". These assert the rendered markup so a future refactor of
 * the wrappers can't silently drop a legacy mapping.
 *
 * Added with the .ae-* editorial component family (2026-06-03).
 */

// NOTE: The "Quote renders legacy customer-quote props" case was removed when
// the fabricated corponor.mdx case study (its only fixture) was deleted. No
// content uses the legacy <Quote> shape anymore; the wrapper itself still
// lives in src/components/blog/mdx.tsx. Re-add a case here if a real page
// adopts <Quote> again.

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
  // Stepper (numbered step) and CTA (editorial band) are the two most-shipped
  // editorial components after Note — assert they render here too.
  await expect(page.locator(".ae-stepper .ae-step .ae-sn").first()).toBeVisible();
  await expect(page.locator(".ae-cta h4").first()).toBeVisible();
});

test("Summary renders roman numerals (legacy iconName prop ignored)", async ({
  page,
}) => {
  // esg-barekraft-naringseiendom passes the legacy `iconName` field on points;
  // the editorial Summary must ignore it and render the I/II/III numerals.
  await page.goto("/blog/esg-barekraft-naringseiendom", {
    waitUntil: "domcontentloaded",
  });
  const summary = page.locator(".ae-summary").first();
  await expect(summary).toBeVisible();
  await expect(summary.locator(".ae-item .ae-rn").first()).toHaveText("I");
});
