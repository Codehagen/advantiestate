import { test, expect } from "@playwright/test";

/**
 * Listing photo lightbox (GalleryLightbox + ListingLightbox).
 *
 * Runs against the MDX fallback in CI (no Supabase env → Bodø Byport exposes its
 * 3 MDX gallery images), but every assertion reads the photo count from the
 * counter, so it also passes unchanged when Supabase publishes all 18. Swipe is
 * deliberately NOT covered here — it's verified on a real device (touch-gesture
 * simulation in Playwright is flaky and low-signal).
 */
const LISTING = "/eiendommer/bodo-byport-stormyra";

// Image loading must not gate these tests: external CDNs hang in CI and the
// single-worker prod server optimizes next/image on demand. Abort image
// requests — the lightbox's dialog/counter/nav logic is image-independent, and
// next/image reserves layout space so visibility assertions still hold.
test.beforeEach(async ({ page }) => {
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|\.supabase\.co|\/_next\/image/,
    (route) => route.abort(),
  );
});

async function openLightbox(page: import("@playwright/test").Page) {
  await page.goto(LISTING);
  await page.locator(".ed-tile-btn").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

function total(counterText: string) {
  return Number(counterText.split("/")[1].trim());
}

test("closed gallery renders 3 tiles + status + main image (REGRESSION guard)", async ({
  page,
}) => {
  const res = await page.goto(LISTING);
  expect(res?.status()).toBeLessThan(400);
  const gallery = page.locator(".ed-gallery");
  await expect(gallery).toBeVisible();
  await expect(gallery.locator(".g-main")).toHaveCount(1);
  await expect(gallery.locator(".g-side")).toHaveCount(2);
  await expect(gallery.locator(".ei-status")).toBeVisible();
  await expect(gallery.locator(".g-main img")).toBeVisible();
  // Three focusable lightbox triggers, one per tile.
  await expect(gallery.locator(".ed-tile-btn")).toHaveCount(3);
});

test("clicking a tile opens the lightbox at that photo", async ({ page }) => {
  await openLightbox(page);
  await expect(page.locator(".ed-lb-counter")).toHaveText(/^1 \/ \d+$/);
});

test("next/prev arrows page through photos and clamp at both ends", async ({
  page,
}) => {
  await openLightbox(page);
  const counter = page.locator(".ed-lb-counter");
  const n = total((await counter.textContent())!);
  const prev = page.getByRole("button", { name: "Forrige bilde" });
  const next = page.getByRole("button", { name: "Neste bilde" });

  await expect(prev).toBeDisabled(); // clamped at the first photo
  for (let i = 1; i < n; i++) await next.click();
  await expect(counter).toHaveText(`${n} / ${n}`);
  await expect(next).toBeDisabled(); // clamped at the last photo
  await prev.click();
  await expect(counter).toHaveText(`${n - 1} / ${n}`);
});

test("keyboard ArrowRight advances the photo", async ({ page }) => {
  await openLightbox(page);
  const counter = page.locator(".ed-lb-counter");
  const n = total((await counter.textContent())!);
  test.skip(n < 2, "single-photo listing — nothing to advance to");
  await page.keyboard.press("ArrowRight");
  await expect(counter).toHaveText(`2 / ${n}`);
});

test("thumbnail click jumps to that photo", async ({ page }) => {
  await openLightbox(page);
  const counter = page.locator(".ed-lb-counter");
  const n = total((await counter.textContent())!);
  test.skip(n < 2, "single-photo listing — no thumbnail strip");
  await page.locator(".ed-lb-thumb").last().click();
  await expect(counter).toHaveText(`${n} / ${n}`);
});

test("Esc and the ✕ button both close the lightbox", async ({ page }) => {
  await openLightbox(page);
  const dialog = page.getByRole("dialog");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.locator(".ed-tile-btn").first().click();
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Lukk" }).click();
  await expect(dialog).toBeHidden();
});

test("no horizontal overflow with the lightbox open at 375px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openLightbox(page);
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    scrollWidth,
    `lightbox overflows the 375px viewport (${scrollWidth}px wide)`,
  ).toBeLessThanOrEqual(clientWidth + 1);
});
