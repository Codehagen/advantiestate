import { describe, it, expect } from "vitest"
import {
  BODO_ZONES,
  formatRange,
  publishedZones,
} from "@/components/markedsinnsikt/maps/zones"

describe("publishedZones", () => {
  it("ekskluderer features med segments: null (honest-data-gate)", () => {
    const result = publishedZones(BODO_ZONES)
    const ids = result.features.map((f) => f.properties.id)
    expect(ids).toContain("sentrum")
    expect(ids).toContain("ronvik")
    expect(ids).not.toContain("city-nord")
    expect(ids).not.toContain("plassmyra")
    expect(ids).not.toContain("buroya-havna")
  })

  it("returnerer en FeatureCollection (type: 'FeatureCollection')", () => {
    const result = publishedZones(BODO_ZONES)
    expect(result.type).toBe("FeatureCollection")
  })
})

describe("formatRange", () => {
  it("formaterer med non-breaking space tusenskilletegn og en-dash mellom verdier", () => {
    const result = formatRange({ minKrM2: 2000, maxKrM2: 3500 })
    // toLocaleString("no-NO") gir NBSP (U+00A0) som tusenskilletegn
    expect(result).toContain(" ")
    // En-dash mellom min og max
    expect(result).toContain("–")
    // Suffiks
    expect(result).toContain("kr/m²")
  })
})
