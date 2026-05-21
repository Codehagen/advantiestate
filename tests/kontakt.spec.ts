import { test, expect } from "@playwright/test";

/**
 * Kontakt — team cards render from the content/people collection.
 * Guards the fix that replaced hardcoded card data (the source of the
 * wrong-photo/title bug) with a lookup against allPersonPosts by slug.
 */
test("kontakt team cards render people from the collection", async ({
  page,
}) => {
  const res = await page.goto("/kontakt");
  expect(res?.status()).toBeLessThan(400);

  const members = page.locator(".member");
  await expect(members).toHaveCount(2);
  await expect(members.locator("h3")).toContainText([
    "Christer Hagen",
    "Håvard Nome",
  ]);
  // Phone link is derived from the person's phone field.
  await expect(page.locator('.member a[href^="tel:"]').first()).toBeVisible();
});
