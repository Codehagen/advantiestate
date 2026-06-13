import { test, expect } from "@playwright/test";

/**
 * Performance budget — fails if a key route's first-load JavaScript grows past
 * a ceiling. Guards the perf/optimization-pass gains (recharts + katex
 * lazy-loading especially) against silent regression. See TODOS.md TODO 10.
 *
 * The metric is the sum of encodedBodySize (compressed transfer bytes) of every
 * .js resource the route pulls before the network goes idle. If a budget is
 * exceeded for a legitimate reason, re-baseline the number deliberately in the
 * same commit so the bump is reviewed, not silent.
 */

// KB ceilings = measured first-load JS + ~15% headroom.
const JS_BUDGET_KB: Record<string, number> = {
  // Homepage — no charts, the lean baseline.
  // Re-baselinet 2026-06-12 (nav/IA-redesign): disclosure-nav på hver side +
  // CTA prefetcher kalkulatorruten (bevisst — primærhandlingen skal være
  // øyeblikkelig). Panel-/footer-lenker har prefetch={false}; uten det målte
  // hjemmesiden 343 KB. Målt 266 KB + ~15 % headroom.
  "/": 305,
  // markedsinnsikt — loads recharts (charts are the page's content).
  // Re-baselinet 2026-06-12: målt 394 KB + headroom (SeOgsa + nav-delta).
  "/markedsinnsikt": 450,
  // analyseportal — recharts via dynamic import; same class as markedsinnsikt.
  // Re-baselinet 2026-06-12: målt 411 KB + headroom.
  "/analyseportal": 470,
  // Plain article — no chart, no math. The Phase 2.0 guard: this MUST stay
  // near the homepage baseline, never balloon toward the chart-article number.
  "/blog/advanti-lansering-nord-norge": 490,
  // Article that uses DcfChart — recharts loads on demand.
  "/blog/dcf-analyse-naringseiendom": 575,
  // Article that uses DcfChart + katex math — both load on demand.
  "/help/article/diskontert-kontantstrom": 710,
};

// Abort image requests (external avatar CDNs + the next/image optimizer) so
// networkidle can settle in CI — external egress is slow/blocked there and the
// single-worker prod server optimizes covers on demand, either of which would
// otherwise hang the navigation past the 30s timeout. We only measure .js
// transfer, so dropping images does not affect the budget.
test.beforeEach(async ({ page }) => {
  await page.route(
    /imagedelivery\.net|avatar\.vercel\.sh|\/_next\/image/,
    (route) => route.abort(),
  );
});

for (const [route, budgetKb] of Object.entries(JS_BUDGET_KB)) {
  test(`JS budget: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const kb = await page.evaluate(() => {
      const entries = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];
      const bytes = entries
        .filter((r) => r.name.split("?")[0].endsWith(".js"))
        .reduce((sum, r) => sum + (r.encodedBodySize || 0), 0);
      return Math.round(bytes / 1024);
    });

    console.log(
      `[perf-budget] ${route}  ${kb} KB JS  (budget ${budgetKb} KB)`,
    );
    expect(
      kb,
      `${route} first-load JS exceeds budget — investigate or re-baseline`,
    ).toBeLessThanOrEqual(budgetKb);
  });
}
