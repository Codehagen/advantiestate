import { describe, it, expect } from "vitest"
import {
  PORTAL_YIELD,
  PORTAL_YIELD_CITY,
  PORTAL_YIELD_CITY_F,
  YIELD_SEG_PREMIUM,
  isEstimatedYield,
  yieldCityNow,
  PORTAL_CITIES,
  PORTAL_SEGMENTS,
  QUARTERS,
  QUARTERS_F,
  lastOf,
} from "@/components/markedsinnsikt/portalSeries"
import { LATEST_RELEASE } from "@/components/markedsinnsikt/marketReleases"

const SEGS = PORTAL_SEGMENTS.map((s) => s.key)

describe("per-city × segment yield", () => {
  it("kontor endpoints equal the published per-city snapshot (anchor)", () => {
    for (const c of LATEST_RELEASE.cities) {
      expect(yieldCityNow("kontor", c.name as never)).toBe(c.yieldPct)
    }
  })

  it("Tromsø series equals the published segment curve (offset 0)", () => {
    for (const seg of SEGS) {
      expect(PORTAL_YIELD_CITY[seg]["Tromsø"]).toEqual(PORTAL_YIELD[seg])
    }
  })

  it("series have the right length (history + forecast)", () => {
    for (const seg of SEGS) {
      for (const city of PORTAL_CITIES) {
        expect(PORTAL_YIELD_CITY[seg][city].length).toBe(QUARTERS.length)
        expect(PORTAL_YIELD_CITY_F[seg][city].length).toBe(QUARTERS_F.length)
      }
    }
  })

  it("endpoint = published kontor + segment premium", () => {
    for (const city of PORTAL_CITIES) {
      const kontor = yieldCityNow("kontor", city)
      for (const seg of SEGS) {
        const expected = Math.round((kontor + YIELD_SEG_PREMIUM[seg]) * 100) / 100
        expect(yieldCityNow(seg, city)).toBeCloseTo(expected, 5)
      }
    }
  })

  it("within a city, yields rise kontor < handel < logistikk < hotell", () => {
    for (const city of PORTAL_CITIES) {
      const k = yieldCityNow("kontor", city)
      const h = yieldCityNow("handel", city)
      const l = yieldCityNow("logistikk", city)
      const ho = yieldCityNow("hotell", city)
      expect(k).toBeLessThan(h)
      expect(h).toBeLessThan(l)
      expect(l).toBeLessThan(ho)
    }
  })

  it("kontor yields climb down the liquidity ladder (Tromsø tightest)", () => {
    const tromso = yieldCityNow("kontor", "Tromsø")
    for (const city of PORTAL_CITIES) {
      if (city === "Tromsø") continue
      expect(yieldCityNow("kontor", city)).toBeGreaterThanOrEqual(tromso)
    }
  })

  it("isEstimatedYield: published cells observed, house-view cells estimated", () => {
    // Tromsø (any segment) and kontor (any city) are published → not estimated.
    for (const seg of SEGS) expect(isEstimatedYield(seg, "Tromsø")).toBe(false)
    for (const city of PORTAL_CITIES) expect(isEstimatedYield("kontor", city)).toBe(false)
    // Non-Tromsø, non-kontor cells are Advanti house view → estimated.
    expect(isEstimatedYield("handel", "Bodø")).toBe(true)
    expect(isEstimatedYield("logistikk", "Alta")).toBe(true)
    expect(isEstimatedYield("hotell", "Narvik")).toBe(true)
  })

  it("forecast continues from the last history point per city", () => {
    for (const seg of SEGS) {
      for (const city of PORTAL_CITIES) {
        const histEnd = lastOf(PORTAL_YIELD_CITY[seg][city])
        const fcFirst = PORTAL_YIELD_CITY_F[seg][city][0]
        // Forecast should be within a sane band of the last observed value.
        expect(Math.abs(fcFirst - histEnd)).toBeLessThan(0.5)
      }
    }
  })
})
