import { test, expect } from "@playwright/test";

/**
 * Markedsinnsikt — recharts charts + Leaflet maps.
 *
 * Covers the chart/map rebuild: the six-sector shell, the new Ledighet chart,
 * the Leaflet overview map, and — CRITICAL — the /markedsinnsikt/kart route,
 * which white-screened in production under Mapbox. routes.spec.ts only checks
 * HTTP 200; a 200 page can still client-side crash, so the real assertions
 * (map shell visible, no pageerror) live here.
 */

test.describe("Markedsinnsikt", () => {
  test("loads with the default Yield chart rendered", async ({ page }) => {
    const res = await page.goto("/markedsinnsikt");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("nav#nav")).toBeVisible();
    await expect(page.locator('.mi-shell main [role="img"]')).toBeVisible();
  });

  test("each sidebar sector switches the view", async ({ page }) => {
    await page.goto("/markedsinnsikt");
    const sectors: Array<[string, RegExp]> = [
      ["leie", /Markedsleie/i],
      ["tx", /Transaksjon/i],
      ["ledighet", /Ledighet/i],
      ["kart", /By for by/i],
      ["rapporter", /Dypdykk/i],
      ["yield", /Yield/i],
    ];
    for (const [id, heading] of sectors) {
      await page.locator(`button[data-sector="${id}"]`).click();
      await expect(page.locator(".mi-shell main h2")).toContainText(heading);
    }
  });

  test("Ledighet tab renders both the vacancy chart and the table", async ({
    page,
  }) => {
    await page.goto("/markedsinnsikt");
    await page.locator('button[data-sector="ledighet"]').click();
    await expect(page.locator('.mi-shell main [role="img"]')).toBeVisible();
    await expect(page.locator(".mi-city-table")).toBeVisible();
  });

  test("Kart tab renders the Leaflet map; the city picker drives the panel", async ({
    page,
  }) => {
    await page.goto("/markedsinnsikt");
    await page.locator('button[data-sector="kart"]').click();
    await expect(page.locator(".mi-map .leaflet-container")).toBeVisible();
    await page
      .locator(".mi-city-picker button", { hasText: "Tromsø" })
      .click();
    await expect(page.locator(".mi-map-info h3")).toHaveText("Tromsø");
  });

  test("deep-link #kart opens the Kart tab", async ({ page }) => {
    await page.goto("/markedsinnsikt#kart");
    await expect(page.locator(".mi-map .leaflet-container")).toBeVisible();
  });

  test("CRITICAL: /markedsinnsikt/kart renders the map with no client crash", async ({
    page,
  }) => {
    // The Mapbox version threw an unhandled client-side exception here and
    // white-screened the whole route. This must not regress.
    // Fase 3: dypdykk-seksjonen er fjernet; det nye Leaflet-hovedkartet er
    // i .mi-map-leaflet (ikke .mi-kart-shell som tilhørte det slettede
    // MarkedsKartClient-komponenten).
    const pageErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));

    const res = await page.goto("/markedsinnsikt/kart");
    expect(res?.status()).toBeLessThan(400);

    // Leaflet-hovedkartet må montere — ikke error.tsx-fallbacken.
    await expect(
      page.locator(".mi-map-leaflet .leaflet-container"),
    ).toBeVisible();
    // Bypanelet med Bodø-default beviser at SSR-foreldrekomponenten kjørte.
    await expect(page.locator(".mi-map-info h3")).toHaveText("Bodø");
    // No Next "Application error" white screen.
    await expect(page.locator("body")).not.toContainText("Application error");
    expect(
      pageErrors,
      `uncaught client errors:\n${pageErrors.join("\n")}`,
    ).toEqual([]);
  });

  test("/kart cadastre toggle flips the GeoNorge overlay", async ({ page }) => {
    // Fase 3: .mi-map-toggle tilhørte det slettede MarkedsKartLeaflet-
    // komponenten. Den nye WMS-togglen er en .mi-rail-btn som kun vises
    // etter at sonevisningen er aktivert (zoom ≥ minZoneZoom).
    await page.goto("/markedsinnsikt/kart");
    await page
      .locator(".mi-map-leaflet .leaflet-container")
      .waitFor({ state: "attached" });
    await page.getByRole("button", { name: /^Se prissoner i Bodø/ }).click();
    const visToggle = page.getByRole("button", { name: "Vis eiendomsgrenser" });
    await expect(visToggle).toBeVisible();
    await expect(visToggle).toHaveAttribute("aria-pressed", "false");
    await visToggle.click();
    // Teksten skifter til "Skjul eiendomsgrenser" og aria-pressed="true"
    await expect(
      page.getByRole("button", { name: "Skjul eiendomsgrenser" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("Yield sub-tabs switch the segment", async ({ page }) => {
    await page.goto("/markedsinnsikt");
    const handel = page.locator(".mi-subtabs button", { hasText: "Handel" });
    await handel.click();
    await expect(handel).toHaveAttribute("aria-selected", "true");
    await expect(page.locator('.mi-shell main [role="img"]')).toBeVisible();
  });

  test("Transaksjoner tab renders the volume bar chart", async ({ page }) => {
    await page.goto("/markedsinnsikt");
    await page.locator('button[data-sector="tx"]').click();
    await expect(page.locator('.mi-shell main [role="img"]')).toBeVisible();
  });
});
