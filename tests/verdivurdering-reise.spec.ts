import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * Verdivurdering-reise — fase 4 nav/IA-redesign.
 *
 * Dekker:
 *  a. Forsidenavets CTA har href /verktoy/pris-verdivurdering (desktop + mobil)
 *  b. Journey-gang: / → CTA-klikk → kalkulator-h1; sjekkliste-støttelenke +
 *     /kontakt primær­aksjon er synlige på destinasjonssiden
 *  c. Analytics: stub dataLayer, klikk CTA, assert cta_verdivurdering med
 *     source-prop
 *  d. Se også på /naringsmegler/bodo: «Forstå markedet»-blokk viser ≤ 3 lenker,
 *     alle hrefs er reelle (ikke href="#")
 *  e. Lenkeintegritet: alle kurerte SeOgsa-hrefs returnerer ikke 404
 */

test.beforeEach(async ({ page }) => {
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|\/_next\/image|basemaps\.cartocdn\.com/,
    (route) => route.abort(),
  );
});

// ── a. CTA href ───────────────────────────────────────────────────────────────

test.describe("CTA href — /verktoy/pris-verdivurdering", () => {
  test("desktop nav CTA peker til /verktoy/pris-verdivurdering", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    // .nav-cta er den synlige CTA-knappen i desktop-headeren
    const cta = page.locator(".nav-cta").first();
    await expect(cta).toHaveAttribute("href", "/verktoy/pris-verdivurdering");
  });

  test("mobil nav CTA (320×568) peker til /verktoy/pris-verdivurdering", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");
    await page.getByRole("button", { name: "Åpne meny" }).click();
    const cta = page.locator(".nav-mobile-cta");
    await expect(cta).toHaveAttribute("href", "/verktoy/pris-verdivurdering");
  });
});

// ── b. Journey-gang ───────────────────────────────────────────────────────────

test("journey: / → CTA-klikk → kalkulator med sjekkliste­lenke og /kontakt", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  // Klikk CTA og vent på at navigasjonen til kalkulatorsiden er ferdig
  await Promise.all([
    page.waitForURL("**/verktoy/pris-verdivurdering"),
    page.locator(".nav-cta").first().click(),
  ]);

  // h1 skal inneholde «Verdivurdering»
  await expect(page.locator("h1").first()).toContainText("Verdivurdering");

  // Sjekkliste-støttelenke skal være synlig (ikke en knapp)
  const sjekklisteLink = page.locator('a[href="/sjekkliste-verdivurdering"]');
  await expect(sjekklisteLink).toBeVisible();

  // Primær /kontakt-aksjon — CalculatorCTA-seksjonen inneholder minst én
  expect(await page.locator('a[href="/kontakt"]').count()).toBeGreaterThanOrEqual(
    1,
  );
});

// ── c. Analytics ──────────────────────────────────────────────────────────────

test("analytics: cta_verdivurdering fyres med source-prop ved CTA-klikk", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  // Installer dataLayer-stub FØR siden laster
  await page.addInitScript(() => {
    (window as { dataLayer?: unknown[] }).dataLayer = [];
  });

  await page.goto("/");

  // Klikk CTA (navigerer til /verktoy/pris-verdivurdering via CSR)
  await page.locator(".nav-cta").first().click();

  // Evaluer dataLayer — Next.js CSR bevarer arrayen på tvers av klient­navigasjon
  const events = await page.evaluate(
    () => (window as { dataLayer?: unknown[] }).dataLayer ?? [],
  );

  const ctaEvent = events.find(
    (e) =>
      typeof e === "object" &&
      e !== null &&
      (e as Record<string, unknown>).event === "cta_verdivurdering" &&
      (e as Record<string, unknown>).source !== undefined,
  );
  expect(ctaEvent).toBeDefined();
});

// ── d. Se også — /naringsmegler/bodo ─────────────────────────────────────────

test("Se også på /naringsmegler/bodo: Forstå markedet-blokk med ≤ 3 lenker, ingen href=#", async ({
  page,
}) => {
  await page.goto("/naringsmegler/bodo");

  const block = page.locator(".seogsa");
  await expect(block).toBeVisible();
  await expect(block).toContainText("Forstå markedet");

  const links = block.locator("a");
  const count = await links.count();

  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(3);

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute("href");
    expect(href, `lenke ${i} har ingen href`).not.toBeNull();
    expect(href, `lenke ${i} peker til # (ugyldig)`).not.toBe("#");
  }
});

// ── e. Lenkeintegritet ────────────────────────────────────────────────────────

test("lenkeintegritet: kurerte SeOgsa-hrefs returnerer ikke 404", async ({
  request,
}: {
  request: APIRequestContext;
}) => {
  const hrefs = [
    "/markedsinnsikt/kart",
    "/markedsinnsikt",
    "/markedsrapport",
    "/help/article/prime-yield",
    "/verktoy",
  ];

  for (const href of hrefs) {
    const response = await request.get(href);
    expect(
      response.status(),
      `${href} returnerte HTTP ${response.status()}`,
    ).not.toBe(404);
  }
});
