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
  "/markedsinnsikt/kart",
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

/**
 * Image optimization regression — PERFORMANCE_PLAN.md Phase 1.2 converted 6 raw
 * <img> tags to next/image. The route tests above only check HTTP status, so a
 * silently broken conversion (0-size render, or a revert to a plain <img>)
 * would pass unnoticed. This asserts the converted images both render
 * (naturalWidth > 0) AND actually go through next/image — its srcset/src is
 * routed via the /_next/image optimizer, which a plain <img> never has.
 */
const CONVERTED_IMAGES: {
  route: string;
  selector: string;
  strict: boolean;
}[] = [
  { route: "/om-oss", selector: ".team .portrait img", strict: true },
  { route: "/personer", selector: ".tm-portrait img", strict: true },
  {
    route: "/personer/havard-nome",
    selector: ".pe-hero .portrait img",
    strict: true,
  },
  {
    route: "/personer/havard-nome",
    selector: ".pe-other .ip img",
    strict: false,
  },
  { route: "/kunder", selector: ".op-img img", strict: false },
  { route: "/kunder/corponor", selector: ".op-hero .img img", strict: false },
];

for (const { route, selector, strict } of CONVERTED_IMAGES) {
  test(`next/image renders: ${route} ${selector}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const count = await page.locator(selector).count();
    if (count === 0) {
      if (strict) {
        throw new Error(`expected a converted image at ${route} ${selector}`);
      }
      test.skip(true, `no ${selector} on ${route} — nothing to assert`);
      return;
    }
    const img = page.locator(selector).first();
    await expect(img, `${route} ${selector} visible`).toBeVisible();
    // Image actually decoded — not a broken/0-size render.
    await expect
      .poll(
        () => img.evaluate((el: HTMLImageElement) => el.naturalWidth),
        { message: `${route} ${selector} naturalWidth`, timeout: 15_000 },
      )
      .toBeGreaterThan(0);
    // next/image is genuinely in use — it routes through the image optimizer.
    const srcset =
      (await img.getAttribute("srcset")) ??
      (await img.getAttribute("src")) ??
      "";
    expect(srcset, `${route} ${selector} served via next/image`).toContain(
      "/_next/image",
    );
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
