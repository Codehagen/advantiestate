import { test, expect } from "@playwright/test";

/**
 * Mobile overflow guard — every route must fit a 375px (iPhone-class)
 * viewport with no horizontal scroll. Added after the W1–W7 mobile
 * optimization pass; a failure here means a new layout has reintroduced
 * the horizontal-overflow bug that pass fixed.
 */
const ROUTES = [
  "/",
  "/blog",
  "/blog/markedspuls-nord-norge-2025-2026",
  "/blog/category/valuation",
  "/markedsinnsikt",
  "/markedsinnsikt/kart",
  "/tjenester",
  "/tjenester/verdivurdering",
  "/om-oss",
  "/kontakt",
  "/personer",
  "/kunder",
  "/help",
  "/karriere",
  "/naringsmegler",
  "/sjekkliste-verdivurdering",
];

test.use({ viewport: { width: 375, height: 812 } });

for (const route of ROUTES) {
  test(`no horizontal overflow at 375px — ${route}`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBeLessThan(400);
    // Let late layout (fonts, images, client components) settle. `goto` already
    // waits for `load`; a short fixed settle catches font/hydration shift
    // without `networkidle`, which flakes on blog pages that keep a connection
    // alive and never reach idle under CI load.
    await page.waitForTimeout(500);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(
      scrollWidth,
      `${route} overflows the 375px viewport (${scrollWidth}px wide)`,
    ).toBeLessThanOrEqual(clientWidth + 1);
  });
}
