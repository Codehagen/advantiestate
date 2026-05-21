import { test, expect } from "@playwright/test";

/**
 * Phase 0 smoke test — proves the new global chrome renders on every route.
 * Expanded in later phases with per-page visual + structured-data checks
 * (see the eng-review test plan).
 */
test("homepage loads and renders the new site chrome", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.locator("nav#nav")).toBeVisible();
  await expect(page.locator("footer.footer")).toBeVisible();
});

test("an inner route renders the solid nav and footer", async ({ page }) => {
  const res = await page.goto("/kontakt");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.locator("nav#nav")).toHaveClass(/scrolled/);
  await expect(page.locator("footer.footer")).toBeVisible();
});
