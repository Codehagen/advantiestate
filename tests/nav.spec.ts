import { test, expect, type APIRequestContext } from "@playwright/test";
import { REGISTRY } from "../src/lib/navigation";

/**
 * Nav disclosure model — E1A / phase 2 nav/IA redesign.
 *
 * Covers:
 *  - Desktop: group open/close via click and Enter key
 *  - Escape returns focus to the trigger button
 *  - Click-outside closes the open panel
 *  - Closed-group links are present in DOM (SSR crawlability)
 *  - Active trail: data-active on group button, aria-current on leaf links
 *  - Analytics events: nav_group_open and cta_analyseportal fire
 *  - SSR: GET / contains all inNav hrefs in initial HTML
 *  - Mobile (320×568): hamburger, inline accordion, last link + CTA reachable
 */

test.beforeEach(async ({ page }) => {
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|\/_next\/image|basemaps\.cartocdn\.com/,
    (route) => route.abort(),
  );
});

// ── Desktop tests ─────────────────────────────────────────────────────────

test.describe("Desktop nav groups", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("click opens a group panel and sets aria-expanded", async ({ page }) => {
    await page.goto("/");
    const tjenesterBtn = page.getByRole("button", { name: "Tjenester" });
    await tjenesterBtn.click();
    await expect(tjenesterBtn).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#nav-panel-tjenester")).toHaveClass(/open/);
  });

  test("same button toggles: second click closes the panel", async ({
    page,
  }) => {
    await page.goto("/");
    const innsiktBtn = page.getByRole("button", { name: "Innsikt" });
    await innsiktBtn.click();
    await expect(innsiktBtn).toHaveAttribute("aria-expanded", "true");
    await innsiktBtn.click();
    await expect(innsiktBtn).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#nav-panel-innsikt")).not.toHaveClass(/open/);
  });

  test("navigating via a panel link closes the open group", async ({
    page,
  }) => {
    await page.goto("/");
    const innsiktBtn = page.getByRole("button", { name: "Innsikt" });
    await innsiktBtn.click();
    await page
      .locator("#nav-panel-innsikt a", { hasText: "Markedsinnsikt" })
      .first()
      .click();
    await page.waitForURL(/\/markedsinnsikt/);
    // Panelet skal være lukket etter rutebytte — ikke stå åpent over ny side.
    await expect(innsiktBtn).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#nav-panel-innsikt")).not.toHaveClass(/open/);
  });

  test("Nav eier --nav-h: variabelen settes på documentElement", async ({
    page,
  }) => {
    await page.goto("/");
    // AnalyseportalShell og .nav-panel posisjonerer mot --nav-h — den må
    // skrives av Nav sin border-box-observer, ikke stå på CSS-fallbacken.
    await expect
      .poll(async () =>
        page.evaluate(() =>
          document.documentElement.style.getPropertyValue("--nav-h"),
        ),
      )
      .toMatch(/^\d+px$/);
    const navH = await page.evaluate(() =>
      parseInt(
        document.documentElement.style.getPropertyValue("--nav-h"),
        10,
      ),
    );
    expect(navH).toBeGreaterThanOrEqual(60);
    expect(navH).toBeLessThanOrEqual(120);
  });

  test("Enter key opens a group panel", async ({ page }) => {
    await page.goto("/");
    const innsiktBtn = page.getByRole("button", { name: "Innsikt" });
    await innsiktBtn.focus();
    await page.keyboard.press("Enter");
    await expect(innsiktBtn).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#nav-panel-innsikt")).toHaveClass(/open/);
  });

  test("Escape closes the panel and returns focus to the trigger button", async ({
    page,
  }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Om oss" });
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    // Focus should have returned to the trigger
    await expect(btn).toBeFocused();
  });

  test("opening one group closes another", async ({ page }) => {
    await page.goto("/");
    const tjenesterBtn = page.getByRole("button", { name: "Tjenester" });
    const innsiktBtn = page.getByRole("button", { name: "Innsikt" });
    await tjenesterBtn.click();
    await expect(tjenesterBtn).toHaveAttribute("aria-expanded", "true");
    await innsiktBtn.click();
    await expect(innsiktBtn).toHaveAttribute("aria-expanded", "true");
    await expect(tjenesterBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("click outside closes the open panel", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Tjenester" });
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    // Click on the page body outside the nav/panel
    await page.locator("body").click({ position: { x: 640, y: 500 } });
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  test("closed group links are present in the DOM (crawlability)", async ({
    page,
  }) => {
    await page.goto("/");
    // The Tjenester panel is closed on load but its links must be in the DOM.
    const panel = page.locator("#nav-panel-tjenester");
    await expect(panel.locator('a[href="/tjenester/verdivurdering"]')).toHaveCount(1);
    await expect(panel.locator('a[href="/naringsmegler"]')).toHaveCount(1);
    // Panel itself should not be visually open
    await expect(panel).not.toHaveClass(/open/);
  });

  test("active trail: Tjenester button gets data-active on /naringsmegler", async ({
    page,
  }) => {
    await page.goto("/naringsmegler");
    const btn = page.getByRole("button", { name: "Tjenester" });
    await expect(btn).toHaveAttribute("data-active", "true");
  });

  test("aria-current marks the matching leaf link inside the open panel", async ({
    page,
  }) => {
    await page.goto("/tjenester/verdivurdering");
    const btn = page.getByRole("button", { name: "Tjenester" });
    await btn.click();
    const leaf = page.locator(
      '#nav-panel-tjenester a[href="/tjenester/verdivurdering"]',
    );
    await expect(leaf).toHaveAttribute("aria-current", "page");
  });

  test("analytics: nav_group_open and cta_analyseportal events fire", async ({
    page,
  }) => {
    // Capture dataLayer pushes before the page loads.
    await page.addInitScript(() => {
      (window as { dataLayer?: unknown[] }).dataLayer = [];
    });
    await page.goto("/");

    // Open a group — should push nav_group_open
    await page.getByRole("button", { name: "Innsikt" }).click();
    const dlAfterGroup = await page.evaluate(
      () => (window as { dataLayer?: unknown[] }).dataLayer ?? [],
    );
    const groupEvent = dlAfterGroup.find(
      (e) =>
        typeof e === "object" &&
        e !== null &&
        (e as Record<string, unknown>).event === "nav_group_open",
    );
    expect(groupEvent).toBeDefined();

    // The CTA points at the analyseportal and fires cta_analyseportal.
    await expect(page.locator(".nav-cta").first()).toHaveAttribute(
      "href",
      "/analyseportal",
    );
    await page.locator(".nav-cta").first().click();
    const dlAfterCta = await page.evaluate(
      () => (window as { dataLayer?: unknown[] }).dataLayer ?? [],
    );
    const ctaEvent = dlAfterCta.find(
      (e) =>
        typeof e === "object" &&
        e !== null &&
        (e as Record<string, unknown>).event === "cta_analyseportal",
    );
    expect(ctaEvent).toBeDefined();
  });
});

// ── SSR crawlability ──────────────────────────────────────────────────────

test("SSR: initial HTML contains hrefs for all inNav entries (incl. group children)", async ({
  request,
}: {
  request: APIRequestContext;
}) => {
  const response = await request.get("/");
  const fullHtml = await response.text();
  // Scope til nav-regionen (nav-element + paneler + mobilmeny rendres før
  // sideinnholdet) — global includes ville gitt falsk grønt når samme href
  // finnes i footer/innhold (CodeRabbit-funn).
  const navStart = fullHtml.indexOf("<nav");
  const navEnd = fullHtml.indexOf("<main");
  const html = fullHtml.slice(
    navStart,
    navEnd > navStart ? navEnd : undefined,
  );

  // Collect all static (non-pattern) inNav entries
  const inNavEntries = REGISTRY.filter(
    (e) => e.inNav === true && !e.path.includes("[") && e.path !== "/",
  );

  const missing: string[] = [];
  for (const entry of inNavEntries) {
    // href="..." must appear in the server HTML
    if (!html.includes(`href="${entry.path}"`)) {
      missing.push(entry.path);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `The following inNav hrefs were missing from the SSR HTML:\n${missing.map((p) => `  ${p}`).join("\n")}`,
    );
  }
});

// ── Mobile accordion ──────────────────────────────────────────────────────

test.describe("Mobile nav — 320×568", () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test("hamburger opens the mobile menu", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Åpne meny" });
    await toggle.click();
    await expect(page.locator("#nav-mobile")).toHaveClass(/open/);
  });

  test("a group expands inline when its button is clicked", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Åpne meny" }).click();
    const innsiktBtn = page.locator(".nav-mobile-group-btn", {
      hasText: "Innsikt",
    });
    await innsiktBtn.click();
    await expect(innsiktBtn).toHaveAttribute("aria-expanded", "true");
    // Children container should have the 'open' class
    const childrenId = await innsiktBtn.getAttribute("aria-controls");
    await expect(page.locator(`#${childrenId}`)).toHaveClass(/open/);
  });

  test("CTA button is reachable by scrolling on 320×568", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Åpne meny" }).click();
    // Open all groups to push the CTA down
    for (const label of ["Tjenester", "Innsikt", "Om oss"]) {
      await page.locator(".nav-mobile-group-btn", { hasText: label }).click();
    }
    // Scroll to the CTA and assert it is visible
    const cta = page.locator(".nav-mobile-cta");
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
  });

  test("last link in an expanded mobile group is reachable by scrolling", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Åpne meny" }).click();
    // Expand the Tjenester group (longest, most likely to overflow)
    const tjenesterBtn = page.locator(".nav-mobile-group-btn", {
      hasText: "Tjenester",
    });
    await tjenesterBtn.click();
    // The last link in the children
    const childrenId = await tjenesterBtn.getAttribute("aria-controls");
    const lastLink = page
      .locator(`#${childrenId} a`)
      .last();
    await lastLink.scrollIntoViewIfNeeded();
    await expect(lastLink).toBeVisible();
  });
});
