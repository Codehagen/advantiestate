import { test, expect } from "@playwright/test";

/**
 * Breadcrumb regression suite — phase 3 nav/IA redesign.
 *
 * Guards against:
 *   - Duplicate BreadcrumbList JSON-LD blocks on a single page (the primary
 *     regression that this phase eliminates).
 *   - Visible trail content on the naringsmegler city detail pages.
 *   - JSON-LD injection via hostile <\/script> sequences (safety helper).
 */

const LD = 'script[type="application/ld+json"]';

test.beforeEach(async ({ page }) => {
  // Skip external image/tile fetches to keep tests fast.
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|\/_next\/image|basemaps\.cartocdn\.com/,
    (route) => route.abort(),
  );
});

// ── Visible crumb trail on /naringsmegler/bodo ───────────────────────────────

test.describe("/naringsmegler/bodo — breadcrumb trail", () => {
  test("shows the visible crumb trail with correct labels", async ({ page }) => {
    await page.goto("/naringsmegler/bodo");

    const nav = page.getByRole("navigation", { name: "Brødsmulesti" });
    await expect(nav).toBeVisible();

    // Must contain a link to Hjem
    await expect(nav.getByRole("link", { name: "Hjem" })).toBeVisible();

    // Must contain the /naringsmegler registry label or a sensible equivalent
    // ("Næringsmegler" substring is sufficient — registry label is "Næringsmegler i din by")
    const text = await nav.textContent();
    expect(text).toMatch(/[Nn]æringsmegler/);

    // Must show Bodø as the leaf (current page — not a link)
    const here = nav.locator(".here");
    await expect(here).toHaveText("Bodø");
  });

  // ── No duplicate BreadcrumbList — THE core regression guard ──────────────

  test("page contains exactly ONE BreadcrumbList JSON-LD block", async ({ page }) => {
    await page.goto("/naringsmegler/bodo");

    const allScripts = await page.locator(LD).allTextContents();
    const breadcrumbBlocks = allScripts.filter((s) => {
      try {
        const parsed = JSON.parse(s);
        return parsed["@type"] === "BreadcrumbList";
      } catch {
        return false;
      }
    });

    expect(
      breadcrumbBlocks.length,
      `Expected exactly 1 BreadcrumbList block, found ${breadcrumbBlocks.length}`,
    ).toBe(1);
  });

  test("the single BreadcrumbList has ≥ 2 items and a valid Bodø item", async ({
    page,
  }) => {
    await page.goto("/naringsmegler/bodo");

    const allScripts = await page.locator(LD).allTextContents();
    const breadcrumbScript = allScripts.find((s) => {
      try {
        return JSON.parse(s)["@type"] === "BreadcrumbList";
      } catch {
        return false;
      }
    });

    expect(breadcrumbScript).toBeDefined();
    const schema = JSON.parse(breadcrumbScript!);

    expect(schema.itemListElement.length).toBeGreaterThanOrEqual(2);

    // The first item must be Hjem linking to the site root.
    const first = schema.itemListElement[0];
    expect(first.name).toBe("Hjem");
    expect(first.item).toMatch(/\/$/);

    // One of the items must be for the Bodø page.
    const bodoItem = schema.itemListElement.find(
      (el: { name: string; item: string }) => el.item.includes("/naringsmegler/bodo"),
    );
    expect(bodoItem).toBeDefined();
    expect(bodoItem.name).toBe("Bodø");
  });
});

// ── JSON-LD safety: no literal </script in emitted blocks ───────────────────

test("no JSON-LD block on / contains a literal </script sequence", async ({
  page,
}) => {
  await page.goto("/");
  const blocks = await page.locator(LD).allTextContents();
  for (const block of blocks) {
    expect(block, "JSON-LD block contains unsafe </script sequence").not.toContain(
      "</script",
    );
  }
});

// ── /tjenester/salg — breadcrumb via SubHero breadcrumbs prop ───────────────

test("/tjenester/salg has exactly ONE BreadcrumbList JSON-LD block", async ({
  page,
}) => {
  await page.goto("/tjenester/salg");

  const allScripts = await page.locator(LD).allTextContents();
  const breadcrumbBlocks = allScripts.filter((s) => {
    try {
      return JSON.parse(s)["@type"] === "BreadcrumbList";
    } catch {
      return false;
    }
  });

  expect(breadcrumbBlocks.length).toBe(1);

  // The visible nav must also be present
  const nav = page.getByRole("navigation", { name: "Brødsmulesti" });
  await expect(nav).toBeVisible();
});
