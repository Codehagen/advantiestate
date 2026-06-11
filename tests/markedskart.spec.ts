import { test, expect } from "@playwright/test";

/**
 * /markedsinnsikt/kart — the dedicated by-for-by market map (2026-06 design).
 * Covers the interactive contract: metric pills drive the bubbles/legend/rank
 * and write a shareable URL hash; rank rows and pins drive the city panel;
 * the Bodø price-zone deep-dive (the page's original feature) is still there.
 */

test.beforeEach(async ({ page }) => {
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|\/_next\/image|basemaps\.cartocdn\.com|wms\.geonorge\.no/,
    (route) => route.abort(),
  );
});

test("metric pills switch metric and write the URL hash", async ({ page }) => {
  await page.goto("/markedsinnsikt/kart", { waitUntil: "domcontentloaded" });
  const leiePill = page.getByRole("tab", { name: "Markedsleie" });
  await leiePill.click();
  await expect(leiePill).toHaveAttribute("aria-selected", "true");
  await expect(page).toHaveURL(/#leie$/);
  // Legend follows the metric.
  await expect(page.locator(".mi-map-legend .lg-cap")).toHaveText(
    "Markedsleie",
  );
  // Ranked list re-sorts to the new metric (Tromsø has the highest leie).
  await expect(page.locator(".mi-rank .rank-row").first()).toContainText(
    "Tromsø",
  );
});

test("deep link #ledighet preselects the metric", async ({ page }) => {
  await page.goto("/markedsinnsikt/kart#ledighet", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByRole("tab", { name: "Ledighet" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("selecting a city updates the panel and broker link", async ({
  page,
}) => {
  await page.goto("/markedsinnsikt/kart", { waitUntil: "domcontentloaded" });
  // Default selection is Bodø.
  await expect(page.locator(".mi-map-info h3")).toHaveText("Bodø");
  // Click Tromsø in the ranked list.
  await page.locator(".mi-rank .rank-row", { hasText: "Tromsø" }).click();
  await expect(page.locator(".mi-map-info h3")).toHaveText("Tromsø");
  await expect(
    page.locator('.mi-map-info a[href="/naringsmegler/tromso"]'),
  ).toBeVisible();
  // "Mo i Rana" maps to the mo-i-rana broker slug (id "mo" in the release).
  await page.locator(".mi-rank .rank-row", { hasText: "Mo i Rana" }).click();
  await expect(
    page.locator('.mi-map-info a[href="/naringsmegler/mo-i-rana"]'),
  ).toBeVisible();
});

test("Bodø price-zone deep-dive section is still on the page", async ({
  page,
}) => {
  await page.goto("/markedsinnsikt/kart", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: /leieprissoner/ }),
  ).toBeVisible();
});
