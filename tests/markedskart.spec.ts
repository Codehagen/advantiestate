import { test, expect, type Page } from "@playwright/test";

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

// Hovedkartet er en SSR-rendret forelder + en klient-lastet Leaflet-celle.
// Tabellen/pillene er synlige i server-HTML FØR React har hydrert — et klikk
// der lander på inert markup og går tapt. Leaflet-containeren finnes først
// etter hydrering + dynamic-mount, så den er et pålitelig "klar"-signal.
async function gotoKart(page: Page, hash = "") {
  await page.goto(`/markedsinnsikt/kart${hash}`, {
    waitUntil: "domcontentloaded",
  });
  await page
    .locator(".mi-map-leaflet .leaflet-container")
    .waitFor({ state: "attached" });
}

test("metric pills switch metric and write the URL hash", async ({ page }) => {
  await gotoKart(page);
  const leiePill = page.getByRole("button", { name: "Markedsleie" });
  await leiePill.click();
  await expect(leiePill).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/#leie$/);
  // Legend follows the metric.
  await expect(page.locator(".mi-map-legend .lg-cap")).toHaveText(
    "Markedsleie",
  );
  // Ranked list re-sorts to the new metric (Tromsø has the highest leie).
  await expect(page.locator(".mi-rank-table tbody tr").first()).toContainText(
    "Tromsø",
  );
});

test("deep link #ledighet preselects the metric", async ({ page }) => {
  await gotoKart(page, "#ledighet");
  await expect(page.getByRole("button", { name: "Ledighet" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("map pin selects city via click and keyboard", async ({ page }) => {
  await gotoKart(page);
  // Click path — the map's primary affordance.
  await page.getByRole("button", { name: /^Harstad:/ }).click();
  await expect(page.locator(".mi-map-info h3")).toHaveText("Harstad");
  // Keyboard path — focus a pin and press Enter.
  const tromsoPin = page.getByRole("button", { name: /^Tromsø:/ });
  await tromsoPin.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".mi-map-info h3")).toHaveText("Tromsø");
  await expect(tromsoPin).toHaveAttribute("aria-pressed", "true");
});

test("selecting a city updates the panel and broker link", async ({
  page,
}) => {
  await gotoKart(page);
  // Default selection is Bodø.
  await expect(page.locator(".mi-map-info h3")).toHaveText("Bodø");
  // Click Tromsø in the ranked list.
  await page.locator(".mi-rank-table tbody tr", { hasText: "Tromsø" }).click();
  await expect(page.locator(".mi-map-info h3")).toHaveText("Tromsø");
  await expect(
    page.locator('.mi-map-info a[href="/naringsmegler/tromso"]'),
  ).toBeVisible();
  // "Mo i Rana" maps to the mo-i-rana broker slug (id "mo" in the release).
  await page.locator(".mi-rank-table tbody tr", { hasText: "Mo i Rana" }).click();
  await expect(
    page.locator('.mi-map-info a[href="/naringsmegler/mo-i-rana"]'),
  ).toBeVisible();
});

test("Se prissoner CTA zooms to zones, chip pins sone, Escape releases", async ({
  page,
}) => {
  await gotoKart(page);

  // CTA-knappen i bypanelet aktiverer sonevisningen
  await page.getByRole("button", { name: /^Se prissoner i Bodø/ }).click();

  // Kartet zoomer til Bodø — vent til sone-chips vises (zonesActive = true).
  // exact: true skiller chip-knappen ("Sentrum") fra GeoJSON-polygon-laget
  // (aria-label "Prissone Sentrum. Trykk for …") som også rendres nå.
  const sentrumChip = page.getByRole("button", { name: "Sentrum", exact: true });
  await sentrumChip.waitFor({ state: "visible" });

  // Klikk Sentrum-chip → pinner sonen
  await sentrumChip.click();

  // Sone-blokk i bypanelet skal vise Prissone · Sentrum med kontor-intervall
  const block = page.locator(".mi-zone-block");
  await expect(block).toBeVisible();
  await expect(block).toContainText(/Prissone\s*·\s*Sentrum/);
  await expect(block).toContainText("Kontor");
  // "3 500" med NBSP-tusenskilletegn fra no-NO-locale — regexp matcher
  // uansett skilletegn mellom 3 og 500 (regular space, NBSP, U+202F etc.)
  await expect(block).toContainText(/3.500/);

  // Escape løsner pin — sone-blokken forsvinner
  await page.keyboard.press("Escape");
  await expect(block).not.toBeVisible();
});

test("full prissone-reise: CTA → chips → WMS-gating → pin → reset", async ({
  page,
}) => {
  await gotoKart(page);

  // Sone-chips og WMS-toggle er IKKE synlige på oversiktsnivå (zoom 5).
  // exact: true skiller chip-knappen fra GeoJSON-polygon-laget (se test 5).
  await expect(
    page.getByRole("button", { name: "Sentrum", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Vis eiendomsgrenser" }),
  ).toHaveCount(0);

  // CTA i bypanelet aktiverer sonevisningen
  await page.getByRole("button", { name: /^Se prissoner i Bodø/ }).click();

  // Vent til sone-chips vises (zonesActive = true etter zoom til ≥ minZoneZoom)
  await expect(
    page.getByRole("button", { name: "Sentrum", exact: true }),
  ).toBeVisible();

  // WMS-toggle er nå synlig og av (kun aktivert innzoomet, default av)
  const wmsToggle = page.getByRole("button", { name: "Vis eiendomsgrenser" });
  await expect(wmsToggle).toBeVisible();
  await expect(wmsToggle).toHaveAttribute("aria-pressed", "false");

  // Klikk Rønvika-chip → aria-pressed="true", sone-blokk vises
  const ronvikaChip = page.getByRole("button", { name: "Rønvika", exact: true });
  await ronvikaChip.click();
  await expect(ronvikaChip).toHaveAttribute("aria-pressed", "true");

  const block = page.locator(".mi-zone-block");
  await expect(block).toContainText(/Prissone\s*·\s*Rønvika/);
  await expect(block).toContainText("Kontor");

  // Verdivurderings-lenke er synlig mens sone er pinnet (design 3.1)
  await expect(
    page.locator('a[href="/tjenester/verdsettelse"]'),
  ).toBeVisible();

  // Reset-knapp er synlig ved innzoomet tilstand
  const resetBtn = page.getByRole("button", { name: "Hele Nord-Norge" });
  await expect(resetBtn).toBeVisible();

  // Klikk reset → pin nulles (sone-blokk forsvinner), kartet zoomer ut
  await resetBtn.click();

  // Sone-blokk forsvinner umiddelbart (pin settes til null)
  await expect(block).not.toBeVisible();

  // Chips forsvinner etter at zoomen synker under minZoneZoom (zonesActive = false)
  await expect(
    page.getByRole("button", { name: "Sentrum", exact: true }),
  ).toHaveCount(0);
});
