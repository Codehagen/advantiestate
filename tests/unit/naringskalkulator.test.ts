import { describe, it, expect } from "vitest"
import {
  computeEstimate,
  parseNorwegianNumber,
  type EstimateInputs,
} from "@/lib/verktoy/naringskalkulator"

const base: EstimateInputs = {
  type: "Kontor",
  city: "Bodø",
  area: 2000,
  grossRent: 3_200_000,
  vacancyPct: 5,
  opexPct: 10,
}

describe("computeEstimate — known vector (Kontor · Bodø)", () => {
  // NOTE: the design mock's "41,1 mill." is stale placeholder text. The actual
  // yield math gives 40.5M — these assertions encode the correct numbers.
  const r = computeEstimate(base)

  it("is valid", () => {
    expect(r.valid).toBe(true)
  })

  it("applies the base yield with no city adjustment", () => {
    if (!r.valid) throw new Error("expected valid")
    expect(r.appliedYield).toBeCloseTo(6.75, 5)
  })

  it("computes NOI net of vacancy and opex", () => {
    if (!r.valid) throw new Error("expected valid")
    // 3 200 000 × 0.95 × 0.90
    expect(r.noi).toBeCloseTo(2_736_000, 0)
  })

  it("computes value ≈ 40.5M and a ±0.5pp band of 37.7–43.8M", () => {
    if (!r.valid) throw new Error("expected valid")
    expect(r.value / 1e6).toBeCloseTo(40.53, 1)
    expect(r.low / 1e6).toBeCloseTo(37.74, 1)
    expect(r.high / 1e6).toBeCloseTo(43.78, 1)
    expect(r.low).toBeLessThan(r.value)
    expect(r.value).toBeLessThan(r.high)
  })

  it("derives value/m² and gross yield", () => {
    if (!r.valid) throw new Error("expected valid")
    expect(Math.round(r.valuePerM2)).toBe(20_267)
    expect(r.grossYield).toBeCloseTo(7.9, 1)
  })
})

describe("computeEstimate — city & type adjustments", () => {
  it("Tromsø lowers the applied yield by 0.25pp", () => {
    const r = computeEstimate({ ...base, city: "Tromsø" })
    if (!r.valid) throw new Error("expected valid")
    expect(r.appliedYield).toBeCloseTo(6.5, 5)
  })

  it("Mo i Rana raises the applied yield by 0.5pp", () => {
    const r = computeEstimate({ ...base, city: "Mo i Rana" })
    if (!r.valid) throw new Error("expected valid")
    expect(r.appliedYield).toBeCloseTo(7.25, 5)
  })

  it("Handel uses a higher base yield than Kontor → lower value", () => {
    const kontor = computeEstimate(base)
    const handel = computeEstimate({ ...base, type: "Handel" })
    if (!kontor.valid || !handel.valid) throw new Error("expected valid")
    expect(handel.appliedYield).toBeGreaterThan(kontor.appliedYield)
    expect(handel.value).toBeLessThan(kontor.value)
  })
})

describe("computeEstimate — invalid guards (no NaN/Infinity/negative)", () => {
  it("zero area is invalid", () => {
    expect(computeEstimate({ ...base, area: 0 }).valid).toBe(false)
  })

  it("zero gross rent is invalid", () => {
    expect(computeEstimate({ ...base, grossRent: 0 }).valid).toBe(false)
  })

  it("100% vacancy drives NOI to zero → invalid", () => {
    expect(computeEstimate({ ...base, vacancyPct: 100 }).valid).toBe(false)
  })

  it("100% opex drives NOI to zero → invalid", () => {
    expect(computeEstimate({ ...base, opexPct: 100 }).valid).toBe(false)
  })

  it("vacancy + opex are clamped, never producing a negative NOI", () => {
    const r = computeEstimate({ ...base, vacancyPct: 150, opexPct: 150 })
    expect(r.valid).toBe(false)
  })
})

describe("parseNorwegianNumber", () => {
  it("parses spaced thousands", () => {
    expect(parseNorwegianNumber("3 200 000")).toBe(3_200_000)
  })

  it("parses a comma decimal", () => {
    expect(parseNorwegianNumber("1,5")).toBe(1.5)
  })

  it("returns null for blank and garbage", () => {
    expect(parseNorwegianNumber("")).toBeNull()
    expect(parseNorwegianNumber("12abc")).toBeNull()
    expect(parseNorwegianNumber("abc")).toBeNull()
  })

  it("rejects negative numbers", () => {
    expect(parseNorwegianNumber("-5")).toBeNull()
  })
})
