import { test, expect } from "@playwright/test";

/**
 * Structured-data regression. The root layout emits organization +
 * realEstateAgent + website JSON-LD on every route; dynamic routes add
 * article / breadcrumb schema. A page rewrite that drops <StructuredData>
 * is a silent SEO regression — this guards against it.
 */
const LD = 'script[type="application/ld+json"]';

const ROUTES = [
  "/",
  "/tjenester/salg",
  "/blog",
  "/help",
  "/kunder",
  "/naringsmegler",
  "/personer",
];

for (const route of ROUTES) {
  test(`structured data present: ${route}`, async ({ page }) => {
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(400);
    // The layout alone contributes 3 JSON-LD blocks; assert they survived.
    expect(
      await page.locator(LD).count(),
      `${route} JSON-LD blocks`,
    ).toBeGreaterThanOrEqual(3);
  });
}

test("each JSON-LD block is valid JSON", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const blocks = await page.locator(LD).allTextContents();
  for (const block of blocks) {
    expect(() => JSON.parse(block)).not.toThrow();
  }
});

/**
 * Every /tjenester page renders a visible FAQ accordion plus a FAQPage
 * JSON-LD block. Google's FAQ rich-result policy requires the schema to
 * match the visible content — the Faq component drives both from one array,
 * so this asserts the question counts stay in lockstep.
 */
const FAQ_ROUTES = [
  "/tjenester/salg",
  "/tjenester/verdivurdering",
  "/tjenester/utleie",
  "/tjenester/radgivning",
  "/tjenester/transaksjoner",
  "/tjenester/strategisk-radgivning",
];

for (const route of FAQ_ROUTES) {
  test(`FAQPage schema matches visible accordion: ${route}`, async ({
    page,
  }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    // Scope to the FAQ section so the assertion can't be skewed by an
    // unrelated `.faq` block elsewhere on a future version of the page.
    const visibleQuestions = await page
      .locator("#faq .faq details summary")
      .allTextContents();
    expect(
      visibleQuestions.length,
      `${route} visible FAQ items`,
    ).toBeGreaterThan(0);

    const faqBlock = (await page.locator(LD).allTextContents())
      .map((block) => JSON.parse(block))
      .find((json) => json["@type"] === "FAQPage");
    expect(faqBlock, `${route} FAQPage JSON-LD`).toBeTruthy();

    // Same items array drives the accordion and the schema — assert the
    // questions match verbatim, so any drift fails the build.
    const schemaQuestions = faqBlock.mainEntity.map(
      (q: { name: string }) => q.name,
    );
    expect(schemaQuestions, `${route} schema vs visible questions`).toEqual(
      visibleQuestions.map((q) => q.trim()),
    );
  });
}

/**
 * Help articles render their FAQ from the same frontmatter `faq` array that
 * drives the FAQPage JSON-LD (visible markup is .ks-faq-item h3, not the
 * /tjenester accordion). After the editorial-anatomy rollout every article
 * carries an FAQ, so this guards that the schema keeps matching the visible
 * questions verbatim.
 */
const HELP_FAQ_ROUTES = [
  "/help/article/hva-er-yield",
  "/help/article/sensitivitetsanalyse",
  "/help/article/verdivurdering-av-naringseiendom",
];

for (const route of HELP_FAQ_ROUTES) {
  test(`FAQPage schema matches visible FAQ: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const visibleQuestions = await page
      .locator(".ks-faq .ks-faq-item h3")
      .allTextContents();
    expect(
      visibleQuestions.length,
      `${route} visible FAQ items`,
    ).toBeGreaterThanOrEqual(2);

    const faqBlock = (await page.locator(LD).allTextContents())
      .map((block) => JSON.parse(block))
      .find((json) => json["@type"] === "FAQPage");
    expect(faqBlock, `${route} FAQPage JSON-LD`).toBeTruthy();

    const schemaQuestions = faqBlock.mainEntity.map(
      (q: { name: string }) => q.name,
    );
    expect(schemaQuestions, `${route} schema vs visible questions`).toEqual(
      visibleQuestions.map((q) => q.trim()),
    );
  });
}
