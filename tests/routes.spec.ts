import { test, expect } from "@playwright/test";

/**
 * Route render regression — proves every page renders the new chrome and does
 * not 500. Catches MDX prop-drift, missing generateStaticParams, broken
 * imports — the silent failures the build (ignoreBuildErrors) does not.
 */

const STATIC_ROUTES = [
  "/",
  "/tjenester",
  "/tjenester/salg",
  "/tjenester/verdivurdering",
  "/tjenester/utleie",
  "/tjenester/transaksjoner",
  "/tjenester/radgivning",
  "/tjenester/strategisk-radgivning",
  "/om-oss",
  "/kontakt",
  "/personer",
  "/markedsinnsikt",
  "/blog",
  "/help",
  "/kunder",
  "/naringsmegler",
  "/karriere",
];

for (const route of STATIC_ROUTES) {
  test(`renders: ${route}`, async ({ page }) => {
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res?.status(), `${route} HTTP status`).toBeLessThan(400);
    await expect(page.locator("nav#nav"), `${route} nav`).toBeVisible();
    await expect(page.locator("footer.footer"), `${route} footer`).toBeVisible();
  });
}

test("every sitemap URL renders without a server error", async ({ page }) => {
  // Crawls the whole sitemap against the production server.
  test.setTimeout(120_000);
  const xml = await (await page.request.get("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(urls.length, "sitemap URL count").toBeGreaterThan(10);

  const failures: string[] = [];
  for (const url of urls) {
    const path = new URL(url).pathname;
    try {
      const res = await page.goto(path, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      if (!res || res.status() >= 400) {
        failures.push(`${path} -> ${res?.status() ?? "no response"}`);
      }
    } catch (e) {
      failures.push(`${path} -> ${(e as Error).message.split("\n")[0]}`);
    }
  }
  expect(failures, `failed routes:\n${failures.join("\n")}`).toEqual([]);
});
