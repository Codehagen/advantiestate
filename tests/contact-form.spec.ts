import { test, expect } from "@playwright/test";

/**
 * Contact form regression. The redesign must keep the real working form
 * (ContactUsForm + submitContactInquiry server action), not the design's
 * static markup. We verify the form renders and is interactive — we do NOT
 * submit, since a real submit fires the Discord webhook.
 */
test("kontakt renders the working contact form", async ({ page }) => {
  const res = await page.goto("/kontakt", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBeLessThan(400);

  const form = page.locator("form").first();
  await expect(form).toBeVisible();

  const fields = form.locator("input, textarea, select");
  expect(await fields.count(), "form field count").toBeGreaterThan(2);

  const submit = form.locator(
    'button[type="submit"], button:has-text("Send")',
  );
  await expect(submit.first()).toBeVisible();
});
