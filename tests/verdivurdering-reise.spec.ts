import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * Markedsinnsikt-/SeOgsa-reise — fase 4 nav/IA-redesign.
 *
 * NB: Forsidenavets CTA peker nå til /analyseportal (ikke /verdivurdering),
 * så den gamle nav-CTA→/verdivurdering-reisen (tidligere a–c) er pensjonert.
 * CTA-destinasjon + cta_analyseportal-eventet dekkes nå av tests/nav.spec.ts.
 *
 * Dekker:
 *  d. Se også på /naringsmegler/bodo: «Forstå markedet»-blokk viser ≤ 3 lenker,
 *     alle hrefs er reelle (ikke href="#")
 *  e. Lenkeintegritet: alle kurerte SeOgsa-hrefs returnerer ikke 404
 *  f. Analytics: journey_step + seogsa_click
 */

test.beforeEach(async ({ page }) => {
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|\/_next\/image|basemaps\.cartocdn\.com/,
    (route) => route.abort(),
  );
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
    "/sjekkliste-verdivurdering",
  ];

  for (const href of hrefs) {
    const response = await request.get(href);
    expect(
      response.status(),
      `${href} returnerte HTTP ${response.status()}`,
    ).toBeLessThan(400);
  }
});

// ── f. Analytics: journey_step + seogsa_click (8A-baseline, E3A-stub) ────────

test("journey_step fyrer ved ankomst på kalkulatoren og ved sjekkliste-klikk", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as { dataLayer?: unknown[] }).dataLayer = [];
  });
  await page.goto("/verktoy/pris-verdivurdering");

  // Ankomst-steget fyrer fra mount-effekten i JourneyStepTracker.
  await expect
    .poll(async () =>
      page.evaluate(() =>
        ((window as { dataLayer?: unknown[] }).dataLayer ?? []).some(
          (e) =>
            (e as { event?: string; step?: string }).event ===
              "journey_step" &&
            (e as { step?: string }).step === "kalkulator",
        ),
      ),
    )
    .toBe(true);

  // Støttelenken fyrer sjekkliste-steget før navigasjonen.
  await page
    .getByRole("link", { name: /sjekkliste for verdivurdering/ })
    .click();
  const events = await page.evaluate(
    () => (window as { dataLayer?: unknown[] }).dataLayer ?? [],
  );
  expect(
    events.some(
      (e) =>
        (e as { event?: string; step?: string }).event === "journey_step" &&
        (e as { step?: string }).step === "sjekkliste",
    ),
  ).toBe(true);
});

test("seogsa_click fyrer fra Forstå markedet-blokken på bysida", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as { dataLayer?: unknown[] }).dataLayer = [];
  });
  await page.goto("/naringsmegler/bodo");
  await page
    .locator(".seogsa a", { hasText: "Markedsinnsikt" })
    .first()
    .click();
  const events = await page.evaluate(
    () => (window as { dataLayer?: unknown[] }).dataLayer ?? [],
  );
  expect(
    events.some(
      (e) => (e as { event?: string }).event === "seogsa_click",
    ),
  ).toBe(true);
});
