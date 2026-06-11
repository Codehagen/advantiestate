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
  "/analyseportal",
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
  "/eiendommer",
  "/eiendommer/bodo-byport-stormyra",
];

test.use({ viewport: { width: 375, height: 812 } });

// The overflow check must not depend on image loading: external avatar CDNs
// (imagedelivery.net, avatar.vercel.sh) hang in CI where external egress is
// slow/blocked, and the single-worker prod server optimizes many next/image
// covers on demand — both push `load` past the 30s timeout. Abort every image
// request: next/image reserves layout space via width/height, so document
// width (the thing we measure) is unaffected, while `load` now fires fast with
// CSS applied.
test.beforeEach(async ({ page }) => {
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|\/_next\/image/,
    (route) => route.abort(),
  );
});

for (const route of ROUTES) {
  test(`no horizontal overflow at 375px — ${route}`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBeLessThan(400);
    // `load` (default) now resolves quickly since images are aborted, with CSS
    // applied. Also wait for web fonts — they affect text width.
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
