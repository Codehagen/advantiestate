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
    // Let late layout settle: the load event (fired by goto) plus web fonts,
    // which affect text width. We deliberately avoid networkidle — pages like
    // /blog fan out many on-demand next/image optimizations that keep the
    // network busy past the 30s timeout in CI (a perf artifact, not an overflow
    // bug). next/image reserves layout space via width/height, so image decode
    // does not change document width.
    await page.waitForLoadState("load");
    await page.evaluate(() => document.fonts.ready.then(() => {}));
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
