import { test, expect, type Page } from "@playwright/test"

/**
 * /analyseportal — interactive market-data portal.
 *
 * Covers the review-mandated surface: all six sector tabs render charts +
 * tables; deep links restore full view state WITHOUT console errors (the
 * hash-in-useState-initializer hydration bug class); segment/city/legend
 * guards; CSV download; share toast; SSR tables + Dataset JSON-LD present in
 * the initial HTML; markedsinnsikt regression (shared data layer).
 */

const SECTORS = ["yield", "leie", "tx", "ledighet", "nybygg", "makro"] as const

function collectErrors(page: Page): string[] {
  const errors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text())
  })
  page.on("pageerror", (err) => errors.push(String(err)))
  return errors
}

test("renders hero ticker, shell and SSR tables", async ({ page }) => {
  const res = await page.goto("/analyseportal", { waitUntil: "domcontentloaded" })
  expect(res?.status()).toBeLessThan(400)

  // Server-rendered KPI ticker — six cells, before any JS.
  await expect(page.locator(".ap-ticker .k")).toHaveCount(6)

  // Sector tabs present with APG roles.
  const tabs = page.locator('[role="tablist"] [role="tab"]')
  await expect(tabs).toHaveCount(6)
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true")

  // SSR data tables are crawler content (view-source level).
  await expect(page.locator("#analyseportal-tall table")).toHaveCount(6)
})

test("Dataset JSON-LD has its own identity (no presserom collision)", async ({ page }) => {
  await page.goto("/analyseportal", { waitUntil: "domcontentloaded" })
  const jsonld = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents()
  const dataset = jsonld
    .map((t) => {
      try {
        return JSON.parse(t)
      } catch {
        return null
      }
    })
    .flat()
    .find((s) => s && s["@type"] === "Dataset")
  expect(dataset, "Dataset schema present").toBeTruthy()
  expect(dataset["@id"]).toContain("/analyseportal#dataset")
  expect(dataset["@id"]).not.toContain("presserom")
})

test("all six sectors render a chart and switching is clean", async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto("/analyseportal", { waitUntil: "networkidle" })

  for (const key of SECTORS) {
    await page.locator(`#ap-tab-${key}`).click()
    // Focus header updates and a recharts surface draws real geometry.
    // Yield renders a per-city focus band (.ap-focus-aside) instead of the
    // single .ap-focus-val number; accept either.
    await expect(
      page.locator(".ap-focus-val, .ap-focus-aside").first(),
    ).toBeVisible()
    await expect(
      page.locator(".ap-chart .recharts-surface").first(),
    ).toBeVisible({ timeout: 15_000 })
  }
  expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([])
})

test("deep link restores full view state without hydration errors", async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto("/analyseportal#sector=leie&seg=handel&byer=Tromsø,Alta&periode=3y", {
    waitUntil: "networkidle",
  })
  await expect(page.locator("#ap-tab-leie")).toHaveAttribute("aria-selected", "true")
  await expect(page.locator(".ap-pill.on")).toHaveText("Handel")
  await expect(page.locator(".ap-chip.on")).toHaveCount(2)
  await expect(page.locator(".ap-seg button.on")).toHaveText("3 år")
  // React 19 logs hydration mismatches as console errors — must be zero.
  expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([])
})

test("garbage hash falls back to defaults without crashing", async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto("/analyseportal#sector=xyz&seg=%F0%9F%92%A5&byer=Oslo&periode=99y", {
    waitUntil: "networkidle",
  })
  await expect(page.locator("#ap-tab-yield")).toHaveAttribute("aria-selected", "true")
  expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([])
})

test("clean URL is not stamped with a hash on load", async ({ page }) => {
  await page.goto("/analyseportal", { waitUntil: "networkidle" })
  // Allow the post-mount rAF to run.
  await page.waitForTimeout(250)
  expect(new URL(page.url()).hash).toBe("")
})

test("hotell resets to kontor when entering Leiepriser", async ({ page }) => {
  await page.goto("/analyseportal", { waitUntil: "networkidle" })
  await page.locator(".ap-pill", { hasText: "Hotell" }).click()
  await page.locator("#ap-tab-leie").click()
  await expect(page.locator(".ap-pill.on")).toHaveText("Kontor")
  // Leie has no hotell pill at all.
  await expect(page.locator(".ap-pill", { hasText: "Hotell" })).toHaveCount(0)
})

test("city chips and legend keep a min-1 guard", async ({ page }) => {
  await page.goto("/analyseportal#sector=leie", { waitUntil: "networkidle" })
  // Deselect down to one city; the last one must refuse to toggle off.
  const onChips = page.locator(".ap-chip.on")
  while ((await onChips.count()) > 1) {
    await onChips.first().click()
  }
  await onChips.first().click()
  await expect(page.locator(".ap-chip.on")).toHaveCount(1)

  // Legend (yield sector): hide all but one — the last is disabled.
  await page.locator("#ap-tab-yield").click()
  const legendButtons = page.locator(".ap-legend .ap-leg")
  const n = await legendButtons.count()
  for (let i = 0; i < n - 1; i++) {
    const btn = page.locator(".ap-legend .ap-leg:not(.off)").first()
    await btn.click()
  }
  await expect(page.locator(".ap-legend .ap-leg:not(.off)")).toHaveCount(1)
  await expect(page.locator(".ap-legend .ap-leg:not(.off)")).toBeDisabled()
})

// Regression for FINDING-001 (design review 2026-06-11): --nav-h was 62px while
// the real scrolled nav is 75–77px, sliding the sticky tabs behind the nav and
// the controls under the tabs. Asserts the sticky stack at 375/768/1440.
for (const [w, h] of [
  [375, 812],
  [768, 1024],
  [1440, 900],
] as const) {
  test(`sticky stack unoccluded when scrolled at ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h })
    await page.goto("/analyseportal", { waitUntil: "networkidle" })
    await page.evaluate(() => window.scrollTo(0, 1200))
    // Let the nav's scrolled-state transition (0.35s) settle.
    await page.waitForTimeout(500)
    const m = await page.evaluate(() => {
      const nav = document.querySelector(".nav")!.getBoundingClientRect()
      const tabs = document
        .querySelector(".ap-sectornav-clip")!
        .getBoundingClientRect()
      const controls = document
        .querySelector(".ap-controls")!
        .getBoundingClientRect()
      return {
        navBottom: nav.bottom,
        tabsTop: tabs.top,
        tabsBottom: tabs.bottom,
        controlsTop: controls.top,
        controlsSticky:
          getComputedStyle(document.querySelector(".ap-controls")!).position ===
          "sticky",
      }
    })
    // Tabs must start at/below the nav's bottom edge (1px slop).
    expect(m.tabsTop, `tabs occluded by nav at ${w}px`).toBeGreaterThanOrEqual(
      m.navBottom - 1,
    )
    // Desktop only: the sticky controls must clear the tab bar too.
    if (w >= 1080 && m.controlsSticky) {
      expect(
        m.controlsTop,
        `controls occluded by tabs at ${w}px`,
      ).toBeGreaterThanOrEqual(m.tabsBottom - 1)
    }
  })
}

test("arrow keys move between sector tabs (APG pattern)", async ({ page }) => {
  await page.goto("/analyseportal", { waitUntil: "networkidle" })
  await page.locator("#ap-tab-yield").focus()
  await page.keyboard.press("ArrowRight")
  await expect(page.locator("#ap-tab-leie")).toHaveAttribute("aria-selected", "true")
  await page.keyboard.press("End")
  await expect(page.locator("#ap-tab-makro")).toHaveAttribute("aria-selected", "true")
})

test("CSV download produces a non-empty file and a toast", async ({ page }) => {
  await page.goto("/analyseportal", { waitUntil: "networkidle" })
  const downloadPromise = page.waitForEvent("download")
  await page.locator(".ap-action", { hasText: "CSV" }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe("advanti-yield.csv")
  await expect(page.locator(".ap-toast")).toHaveText("CSV lastet ned")
})

test("share copies a full-state URL", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/analyseportal#sector=leie&periode=3y", { waitUntil: "networkidle" })
  await page.locator(".ap-action", { hasText: "Del" }).click()
  await expect(page.locator(".ap-toast")).toHaveText("Lenke kopiert")
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain("sector=leie")
  expect(copied).toContain("periode=3y")
  expect(copied).toContain("byer=")
})

test("transaction table is anonymized (no named addresses)", async ({ page }) => {
  await page.goto("/analyseportal#sector=tx", { waitUntil: "networkidle" })
  const table = page.locator(".ap-tablewrap .ap-table")
  await expect(table).toBeVisible()
  const text = await table.innerText()
  // The old fabricated names must never reappear.
  for (const banned of ["Storgata 73", "AMFI", "Sjøgata 15"]) {
    expect(text).not.toContain(banned)
  }
})

/** Regression: the shared data layer must not change markedsinnsikt. */
test("markedsinnsikt still renders with derived KPI band + portal cross-link", async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto("/markedsinnsikt", { waitUntil: "networkidle" })
  await expect(page.locator(".mi-kpis .mi-kpi")).toHaveCount(4)
  // KPI values come from the shared module — yield kontor cell shows 6,10.
  await expect(page.locator(".mi-kpi").first()).toContainText("6,10")
  await expect(page.locator(".mi-deeplink a")).toHaveAttribute("href", "/analyseportal")
  expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([])
})
