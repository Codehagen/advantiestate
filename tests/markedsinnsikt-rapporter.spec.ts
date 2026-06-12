import { test, expect, type Page } from "@playwright/test";

/**
 * REGRESJONSTEST (eng-review E3, IRON RULE — nav/IA-redesign PR 1).
 *
 * Rapporter-fanen på /markedsinnsikt var kulisse: «Last ned sammendrag» var
 * href="#", arkivkortenes «Last ned →» var rene <span>-er, og «Bestill
 * rapport»/abonnement-lenken gikk til /kontakt i stedet for til den ekte
 * lead-gaten på /markedsrapport. Denne testen låser kontrakten:
 *   - alle rapportkort/-knapper ruter til /markedsrapport
 *   - ingen href="#" noe sted på siden
 *   - ingen lenke-stylede tekster uten faktisk href i Rapporter-fanen
 */

test.beforeEach(async ({ page }) => {
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|\/_next\/image|basemaps\.cartocdn\.com|wms\.geonorge\.no/,
    (route) => route.abort(),
  );
});

// Sektorfanene er klient-state med hash-deep-linking; vent på hydrering før
// klikk (samme mønster som gotoKart i markedskart.spec.ts).
async function gotoRapporter(page: Page) {
  await page.goto("/markedsinnsikt#rapporter", {
    waitUntil: "domcontentloaded",
  });
  // Hash-deep-linket fane: vent til Rapporter-innholdet faktisk er rendret.
  await page
    .locator(".mi-report-card")
    .waitFor({ state: "visible", timeout: 15000 });
}

test("hovedrapport-kortet ruter begge handlinger til /markedsrapport", async ({
  page,
}) => {
  await gotoRapporter(page);
  const card = page.locator(".mi-report-card");
  await expect(
    card.getByRole("link", { name: /Bestill rapport/ }),
  ).toHaveAttribute("href", "/markedsrapport");
  await expect(
    card.getByRole("link", { name: /Få sammendrag/ }),
  ).toHaveAttribute("href", "/markedsrapport");
});

test("arkivkortene har ekte gate-lenker, ikke døde spans", async ({ page }) => {
  await gotoRapporter(page);
  const arkivLenker = page.locator(".mi-report .rfoot a");
  const count = await arkivLenker.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await expect(arkivLenker.nth(i)).toHaveAttribute(
      "href",
      "/markedsrapport",
    );
  }
  // Abonnement-fotnoten går også til gaten.
  await expect(
    page.getByRole("link", { name: /abonnement/ }),
  ).toHaveAttribute("href", "/markedsrapport");
});

test("ingen href=\"#\" på markedsinnsikt — dødlenke-klassen er utryddet", async ({
  page,
}) => {
  await gotoRapporter(page);
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
});

test("kartpanelets verdivurderingslenke bruker kanonisk URL (ikke 308-redirect)", async ({
  page,
}) => {
  await page.goto("/markedsinnsikt/kart", { waitUntil: "domcontentloaded" });
  await page
    .locator(".mi-map-leaflet .leaflet-container")
    .waitFor({ state: "attached" });
  // Sonelenken rendres først ved pinnet sone — men href-en ligger i
  // server-HTML-koden for komponenten. Verifiser via CTA-flyten:
  await page.getByRole("button", { name: /^Se prissoner i Bodø/ }).click();
  const sentrumChip = page.getByRole("button", {
    name: "Sentrum",
    exact: true,
  });
  await sentrumChip.waitFor({ state: "visible" });
  await sentrumChip.click();
  // Scopet til soneblokken — footeren har også en verdivurderingslenke.
  await expect(
    page.locator('.mi-zone-valuation-link[href="/tjenester/verdivurdering"]'),
  ).toBeVisible();
  await expect(page.locator('a[href="/tjenester/verdsettelse"]')).toHaveCount(
    0,
  );
});
