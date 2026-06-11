import { test, expect } from "@playwright/test";

/**
 * City-page regression — the /naringsmegler/[slug] template after the
 * design-handoff upgrade (autoplan 2026-06-11).
 *
 * Covers the four template risks the review flagged:
 *  1. Every city slug renders (slug↔portal key mismatches fail silently).
 *  2. Computed section numbers have no gaps on either page variant.
 *  3. Truthfulness gates hold: no proof band / deals section until verified.
 *  4. The lead form ships its honest defaults («Velg type», required fields).
 *
 * The form is never actually submitted here — the success path is covered in
 * tests/unit/naringsmegler.test.ts with subscribe() mocked. Submitting E2E
 * would either send real Discord/Resend traffic (local env) or burn the
 * 5/10min in-memory rate-limit budget shared across specs.
 */

// All location content files. Update when src/content/locations changes.
const CITY_SLUGS = [
  "bodo",
  "tromso",
  "harstad",
  "alta",
  "narvik",
  "mo-i-rana",
  "hammerfest",
  "sortland",
  "svolvaer",
  "lofoten",
];

test.beforeEach(async ({ page }) => {
  // Same image-abort rationale as mobile-overflow.spec.ts: external CDNs and
  // on-demand next/image optimization are slow/blocked in CI and irrelevant
  // to the structure being asserted.
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|supabase\.co|\/_next\/image|basemaps\.cartocdn\.com/,
    (route) => route.abort(),
  );
});

for (const slug of CITY_SLUGS) {
  test(`renders: /naringsmegler/${slug}`, async ({ page }) => {
    const res = await page.goto(`/naringsmegler/${slug}`, {
      waitUntil: "domcontentloaded",
    });
    expect(res?.status(), `${slug} HTTP status`).toBeLessThan(400);
    await expect(page.locator("h1")).toContainText("Næringsmegler");
    // The lead section is the conversion path — must exist on every variant.
    await expect(page.locator("#kontakt")).toHaveCount(1);
    await expect(page.locator(".cy-form")).toBeVisible();
  });
}

for (const slug of ["bodo", "sortland"] as const) {
  test(`section numbering has no gaps — ${slug}`, async ({ page }) => {
    await page.goto(`/naringsmegler/${slug}`, {
      waitUntil: "domcontentloaded",
    });
    const eyebrows = await page
      .locator("section .eyebrow")
      .allTextContents();
    const numbers = eyebrows
      .map((t) => t.match(/^(\d{2}) — /)?.[1])
      .filter((n): n is string => Boolean(n))
      .map(Number);
    expect(numbers.length, `${slug} has numbered sections`).toBeGreaterThan(3);
    // Strictly sequential from 01 — a gap means a conditional section broke
    // the computed counter (autoplan D-spec 1).
    numbers.forEach((n, i) => {
      expect(n, `section ${i + 1} on ${slug}`).toBe(i + 1);
    });
  });
}

test("truthfulness gates: draft proof stats and deals stay hidden (bodo)", async ({
  page,
}) => {
  await page.goto("/naringsmegler/bodo", { waitUntil: "domcontentloaded" });
  // bodo.mdx carries DRAFT proofStats with proofStatsVerified: false and no
  // verified referenceDeals — neither section may render until verified.
  await expect(page.locator(".cy-proof")).toHaveCount(0);
  await expect(page.locator(".cy-deals")).toHaveCount(0);
});

test("market block renders published data for portal cities (bodo)", async ({
  page,
}) => {
  await page.goto("/naringsmegler/bodo", { waitUntil: "domcontentloaded" });
  // Chart is server-rendered with honest regional labelling.
  await expect(page.locator(".cy-chartcard .ch-title")).toContainText(
    "Nord-Norge",
  );
  // Bodø has canonical leie history → leie tile present.
  await expect(page.locator(".cy-tile")).toHaveCount(3);
});

test("no market chart for non-portal cities (sortland)", async ({ page }) => {
  await page.goto("/naringsmegler/sortland", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator(".cy-chartcard")).toHaveCount(0);
  // The published frontmatter table still carries the market section.
  await expect(page.locator(".cy-stats-table")).toBeVisible();
  // Coverage tier: no office address → coverage panel, no Leaflet map.
  await expect(page.locator(".cy-loc .loc-map")).toHaveCount(0);
  await expect(page.locator(".cy-loc")).toContainText("Vi dekker");
});

test("office tier: location panel with map block (bodo)", async ({ page }) => {
  await page.goto("/naringsmegler/bodo", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".cy-loc .loc-map")).toHaveCount(1);
  await expect(page.locator(".cy-loc")).toContainText("Dronningens gate");
});

test("lead form defaults are honest (bodo)", async ({ page }) => {
  await page.goto("/naringsmegler/bodo", { waitUntil: "domcontentloaded" });
  // Eiendomstype must start on the empty «Velg type» option, not Kontor —
  // a default value silently corrupts lead data.
  await expect(page.locator("#cy-type")).toHaveValue("");
  for (const field of ["#cy-navn", "#cy-tlf", "#cy-epost"]) {
    await expect(page.locator(field)).toHaveAttribute("required", "");
  }
  // The honeypot is off-screen but present for bots.
  await expect(page.locator('input[name="firma_web"]')).toHaveCount(1);
});

test("structured data survives the restructure (bodo)", async ({ page }) => {
  await page.goto("/naringsmegler/bodo", { waitUntil: "domcontentloaded" });
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const faq = blocks
    .map((b) => JSON.parse(b))
    .find((b) => b["@type"] === "FAQPage");
  expect(faq, "FAQPage JSON-LD").toBeTruthy();
  expect(faq.mainEntity).toHaveLength(6);
  const agent = blocks
    .map((b) => JSON.parse(b))
    .find(
      (b) =>
        b["@type"] === "RealEstateAgent" &&
        typeof b.name === "string" &&
        b.name.includes("Bodø"),
    );
  expect(agent, "RealEstateAgent JSON-LD").toBeTruthy();
  expect(agent.address?.streetAddress).toBe("Dronningens gate 18");
});
