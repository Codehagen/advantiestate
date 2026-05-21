import { test, expect } from "@playwright/test";

/**
 * Structured-data regression. The root layout emits organization +
 * realEstateAgent + website JSON-LD on every route; dynamic routes add
 * article / breadcrumb schema. A page rewrite that drops <StructuredData>
 * is a silent SEO regression — this guards against it.
 */
const LD = 'script[type="application/ld+json"]';

const ROUTES = [
  "/",
  "/tjenester/salg",
  "/blog",
  "/help",
  "/kunder",
  "/naringsmegler",
  "/personer",
];

for (const route of ROUTES) {
  test(`structured data present: ${route}`, async ({ page }) => {
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(400);
    // The layout alone contributes 3 JSON-LD blocks; assert they survived.
    expect(
      await page.locator(LD).count(),
      `${route} JSON-LD blocks`,
    ).toBeGreaterThanOrEqual(3);
  });
}

test("each JSON-LD block is valid JSON", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const blocks = await page.locator(LD).allTextContents();
  for (const block of blocks) {
    expect(() => JSON.parse(block)).not.toThrow();
  }
});
