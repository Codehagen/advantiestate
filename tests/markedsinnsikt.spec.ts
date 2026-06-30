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
    await expect(page.locator('#mi-panel [role="img"]')).toBeVisible();
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
      await expect(page.locator("#mi-panel h2")).toContainText(heading);
    }
  });

  test("Ledighet tab renders both the vacancy chart and the table", async ({
    page,
  }) => {
    await page.goto("/markedsinnsikt");
    await page.locator('button[data-sector="ledighet"]').click();
    await expect(page.locator('#mi-panel [role="img"]')).toBeVisible();
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
    await expect(handel).toHaveAttribute("aria-checked", "true");
    await expect(page.locator('#mi-panel [role="img"]')).toBeVisible();
  });

  test("Transaksjoner tab renders the volume bar chart", async ({ page }) => {
    await page.goto("/markedsinnsikt");
    await page.locator('button[data-sector="tx"]').click();
    await expect(page.locator('#mi-panel [role="img"]')).toBeVisible();
  });

  // markedsinnsikt v2 editorial: the time-range selector windows the chart and
  // the clickable legend toggles series, keeping at least one always visible.
  test("Yield range selector actually windows the data", async ({ page }) => {
    await page.goto("/markedsinnsikt");
    // data-points reflects the number of quarters fed to the chart, so it proves
    // the window trimmed the series — not just that the button toggled.
    const chart = page.locator('#mi-panel [role="img"]').first();
    await expect(chart).toHaveAttribute("data-points", "20"); // 5-year default
    const threeYear = page
      .locator(".miv-range button", { hasText: "3 år" })
      .first();
    await threeYear.click();
    await expect(threeYear).toHaveAttribute("aria-checked", "true");
    await expect(chart).toHaveAttribute("data-points", "12"); // 3-year window
  });

  test("clickable legend removes a line and locks the last visible series", async ({
    page,
  }) => {
    await page.goto("/markedsinnsikt");
    // Prime yield is the filled area; SWAP + gov are the two lines.
    const lines = page.locator("#mi-panel .recharts-line");
    const legend = page.locator(".mi-chart-legend button.item");
    const swap = legend.filter({ hasText: "5 år SWAP" });
    const gov = legend.filter({ hasText: "10 år statsobl." });
    const prime = legend.filter({ hasText: "Prime yield" });

    await expect(lines).toHaveCount(2);
    await swap.click();
    await expect(swap).toHaveAttribute("aria-pressed", "false");
    await expect(swap).toHaveClass(/off/);
    await expect(lines).toHaveCount(1); // the SWAP line is gone from the plot

    // Hiding the last line leaves only the area; its legend button locks so the
    // chart can never be blanked.
    await gov.click();
    await expect(prime).toBeDisabled();
    await expect(page.locator("#mi-panel .recharts-area")).toBeVisible();
  });

  test("Leie view has its own range selector and clickable legend", async ({
    page,
  }) => {
    await page.goto("/markedsinnsikt");
    await page.locator('button[data-sector="leie"]').click();
    await expect(page.locator("#mi-panel h2")).toContainText(/Markedsleie/i);

    const threeYear = page
      .locator(".miv-range button", { hasText: "3 år" })
      .first();
    await threeYear.click();
    await expect(threeYear).toHaveAttribute("aria-checked", "true");

    // City series: hide two so only the first remains, which then locks.
    const legend = page.locator(".mi-chart-legend button.item");
    await legend.nth(1).click();
    await expect(legend.nth(1)).toHaveAttribute("aria-pressed", "false");
    await legend.nth(2).click();
    await expect(legend.first()).toBeDisabled();
  });

  test("respects prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/markedsinnsikt");
    // The reduce branch must still render the chart (no animation, no crash).
    await expect(page.locator('#mi-panel [role="img"]')).toBeVisible();
  });
});
