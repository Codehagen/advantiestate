import { describe, it, expect } from "vitest"
import {
  utmToLatLng,
  parseRepresentasjonspunkt,
} from "@/lib/coordinateUtils"

describe("utmToLatLng", () => {
  it("converts UTM zone 33N coordinates to WGS84 within Northern-Norway bounds", () => {
    const [lng, lat] = utmToLatLng(516375, 7460592, "32633")
    expect(lat).toBeGreaterThan(60)
    expect(lat).toBeLessThan(72)
    expect(lng).toBeGreaterThan(4)
    expect(lng).toBeLessThan(32)
  })

  it("passes through EPSG:4326 coordinates as-is (identity transform)", () => {
    const [lng, lat] = utmToLatLng(14.4, 67.28, "4326")
    expect(lng).toBeCloseTo(14.4, 5)
    expect(lat).toBeCloseTo(67.28, 5)
  })

  it("throws on unsupported EPSG code", () => {
    expect(() => utmToLatLng(1, 1, "9999")).toThrow(/not supported/i)
  })
})

describe("parseRepresentasjonspunkt", () => {
  it("parses 'northing easting (epsg)' format correctly", () => {
    const result = parseRepresentasjonspunkt("7460592 516375 (32633)")
    expect(result.northing).toBe(7460592)
    expect(result.easting).toBe(516375)
    expect(result.epsg).toBe("32633")
    // Sanity-check the converted coordinates
    const [lng, lat] = result.coordinates
    expect(lat).toBeGreaterThan(60)
    expect(lat).toBeLessThan(72)
    expect(lng).toBeGreaterThan(4)
    expect(lng).toBeLessThan(32)
  })

  it("throws on invalid format", () => {
    expect(() => parseRepresentasjonspunkt("garbage")).toThrow(
      /Invalid representasjonspunkt/i,
    )
  })
})
