import { test, expect } from "@playwright/test";

/**
 * QA regression suite for the city pages + markedskart.
 * Found by /qa on 2026-06-11 — report: .gstack/qa-reports/qa-report-localhost-2026-06-11.md
 */

test.beforeEach(async ({ page }) => {
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|supabase\.co|\/_next\/image|basemaps\.cartocdn\.com/,
    (route) => route.abort(),
  );
});

// Regression: ISSUE-002 — every city has localTeam (responsible partners) in
// frontmatter, so an avatar-presence check made the hero trust line claim
// «Lokalt team i {by}» on the 8 cities WITHOUT an office — the exact honesty
// claim the autoplan E3 decision bans. The tier must key on officeAddress.
test("trust line claims local team ONLY for office cities (ISSUE-002)", async ({
  page,
}) => {
  await page.goto("/naringsmegler/sortland", {
    waitUntil: "domcontentloaded",
  });
  const sortlandLine = page.locator(".cy-trustline");
  await expect(sortlandLine).toContainText("Dekkes fra hovedkontoret i Bodø");
  await expect(sortlandLine).not.toContainText("Lokalt team");

  await page.goto("/naringsmegler/bodo", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".cy-trustline")).toContainText(
    "Lokalt team i Bodø",
  );
});

// Regression: ISSUE-001 — the markedskart only read the metric hash on mount;
// a #metric deep link clicked or pasted while already on the page silently
// did nothing. Shareable deep links are a designed feature of this page.
test("markedskart reacts to same-page hash changes (ISSUE-001)", async ({
  page,
}) => {
  await page.goto("/markedsinnsikt/kart#yield", {
    waitUntil: "domcontentloaded",
  });
  // The map reacts after Leaflet init + hydration; under CI's single-worker
  // prod server that can take well over the 5s default. Allow more time — the
  // behaviour is unchanged, only the wait is more patient (fixes CI flake).
  await expect(
    page.getByRole("button", { name: "Prime yield" }),
  ).toHaveAttribute("aria-pressed", "true", { timeout: 15_000 });
  await page.evaluate(() => {
    window.location.hash = "#leie";
  });
  await expect(
    page.getByRole("button", { name: "Markedsleie" }),
  ).toHaveAttribute("aria-pressed", "true", { timeout: 15_000 });
});
