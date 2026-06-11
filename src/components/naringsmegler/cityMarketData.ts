// City-page market data — the ONLY import surface for /naringsmegler/[slug].
//
// ── Honest-data rule (autoplan E2, 2026-06-11) ──────────────────────────────
// City pages plot ONLY published/real series:
//   · YIELD.kontor (canonical regional series, marketData.ts) + forecast tail
//   · styringsrente (real Norges Bank history, portalSeries.ts)
//   · LEIE.kontor per city ONLY for the three canonical cities — the
//     genRent()-generated curves for other cities are synthetic shapes and
//     must never appear on a seller-facing page
//   · vacancy as the published SNAPSHOT only (VAC_NOW) — VACANCY_TREND is
//     synthetic and banned here
// Do not import portalSeries/marketData directly from city-page components;
// add to this whitelist instead so the rule stays reviewable in one place.

import { LEIE, QUARTERS, YIELD } from "@/components/markedsinnsikt/marketData"
import {
  fmtComma,
  fmtGroup,
  PORTAL_CITIES,
  PORTAL_PALETTE,
  PORTAL_RATES,
  PORTAL_RATES_F,
  PORTAL_YIELD_F,
  QUARTERS_F,
  VAC_NOW,
  type PortalCity,
} from "@/components/markedsinnsikt/portalSeries"

export { fmtComma, fmtGroup, PORTAL_PALETTE }

/**
 * Location slugs (kebab, from src/content/locations) → portal display names.
 * The two key spaces do NOT match ("mo-i-rana" vs "Mo i Rana", "tromso" vs
 * "Tromsø") — a direct slug lookup silently returns undefined for every city.
 * Unit-tested in tests/unit/naringsmegler.test.ts.
 */
export const PORTAL_CITY_BY_SLUG: Record<string, PortalCity> = {
  bodo: "Bodø",
  tromso: "Tromsø",
  harstad: "Harstad",
  alta: "Alta",
  narvik: "Narvik",
  "mo-i-rana": "Mo i Rana",
}

export { PORTAL_CITIES }
export type { PortalCity }

// Chart window: last 12 published quarters + 4 forecast quarters (matches the
// approved prototype's Q1 23 → Q4 26 frame).
const HIST_WINDOW = 12

export const CHART_QUARTERS = QUARTERS.slice(-HIST_WINDOW)
export const CHART_QUARTERS_F = QUARTERS_F

export const YIELD_KONTOR_HIST = YIELD.kontor.slice(-HIST_WINDOW)
export const YIELD_KONTOR_F = PORTAL_YIELD_F.kontor

export const STYRINGSRENTE_HIST = PORTAL_RATES.styringsrente.slice(-HIST_WINDOW)
export const STYRINGSRENTE_F = PORTAL_RATES_F.styringsrente

/** Canonical per-city kontorleie history — null for genRent (synthetic) cities. */
export function getLeieHist(city: PortalCity): number[] | null {
  const series = LEIE.kontor[city]
  return series ? series.slice(-HIST_WINDOW) : null
}

/** Published office-vacancy snapshot for the city, or null. */
export function getVacancySnapshot(city: PortalCity): number | null {
  return VAC_NOW.kontor[city] ?? null
}
