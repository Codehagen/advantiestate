import { describe, it, expect } from "vitest"
import {
  clamp,
  computeYield,
  computeValuation,
  type YieldInputs,
  type ValuationInputs,
} from "@/lib/verktoy/yieldCalc"

const yieldBase: YieldInputs = {
  type: "Kontor",
  leie: 1_200_000,
  kjop: 15_000_000,
  driftMode: "pct",
  driftKr: 180_000,
  driftPct: 15,
  ltv: 70,
  rente: 5.5,
}

describe("computeYield — default vector (Kontor)", () => {
  const r = computeYield(yieldBase)

  it("derives drift and NOI", () => {
    expect(r.drift).toBeCloseTo(180_000, 0) // 1.2M × 15%
    expect(r.noi).toBeCloseTo(1_020_000, 0)
  })

  it("computes brutto 8.00% and netto 6.80%", () => {
    expect(r.brutto).toBeCloseTo(8.0, 5)
    expect(r.netto).toBeCloseTo(6.8, 5)
  })

  it("computes monthly cash flow and payback", () => {
    expect(r.manedlig).toBeCloseTo(85_000, 0)
    expect(r.payback).toBeCloseTo(14.7059, 3) // 15M ÷ 1.02M
  })

  it("computes the financing leg → cash-on-cash 9.83%", () => {
    expect(r.lan).toBeCloseTo(10_500_000, 0)
    expect(r.egenkapital).toBeCloseTo(4_500_000, 0)
    expect(r.renter).toBeCloseTo(577_500, 0)
    expect(r.cfEtter).toBeCloseTo(442_500, 0)
    expect(r.coc).toBeCloseTo(9.8333, 3)
  })

  it("benchmarks against the market yield", () => {
    expect(r.market).toBeCloseTo(6.75, 5)
    expect(r.diff).toBeCloseTo(0.05, 5)
  })

  it("splits the rent into opex/NOI shares summing to 100", () => {
    expect(r.opexShare).toBeCloseTo(15, 5)
    expect(r.noiShare).toBeCloseTo(85, 5)
  })
})

describe("computeYield — kr drift mode and segment switch", () => {
  it("uses the kr amount directly in kr mode", () => {
    const r = computeYield({ ...yieldBase, driftMode: "kr", driftKr: 300_000 })
    expect(r.drift).toBeCloseTo(300_000, 0)
    expect(r.noi).toBeCloseTo(900_000, 0)
  })

  it("picks the market yield per segment", () => {
    expect(computeYield({ ...yieldBase, type: "Handel" }).market).toBeCloseTo(7.25, 5)
    expect(computeYield({ ...yieldBase, type: "Lager / logistikk" }).market).toBeCloseTo(7.25, 5)
  })
})

describe("computeYield — guards (no NaN / Infinity)", () => {
  it("returns 0s when kjop is 0", () => {
    const r = computeYield({ ...yieldBase, kjop: 0 })
    expect(r.brutto).toBe(0)
    expect(r.netto).toBe(0)
    expect(r.payback).toBe(0)
    expect(r.coc).toBe(0)
    expect(Number.isFinite(r.netto)).toBe(true)
  })

  it("never lets NOI go negative", () => {
    const r = computeYield({ ...yieldBase, driftMode: "kr", driftKr: 5_000_000 })
    expect(r.noi).toBe(0)
  })
})

const valBase: ValuationInputs = {
  type: "Kontor",
  leie: 1_200_000,
  driftMode: "pct",
  driftKr: 180_000,
  driftPct: 15,
  ytelse: 6.75,
  areal: 1000,
}

describe("computeValuation — default vector (Kontor, yield 6.75%)", () => {
  const r = computeValuation(valBase)

  it("derives NOI", () => {
    expect(r.noi).toBeCloseTo(1_020_000, 0)
  })

  it("computes value ≈ 15.11M with a ±0.5pp band of 14.07–16.32M", () => {
    expect(r.verdi / 1e6).toBeCloseTo(15.111, 2) // 1.02M ÷ 6.75%
    expect(r.low / 1e6).toBeCloseTo(14.069, 2) // ÷ 7.25%
    expect(r.high / 1e6).toBeCloseTo(16.32, 2) // ÷ 6.25%
  })

  it("computes verdi pr. m² and brutto yield", () => {
    expect(r.perM2).toBeCloseTo(15_111.11, 1)
    expect(r.bruttoYield).toBeCloseTo(7.941, 2)
  })

  it("lower yield → higher value (inverse relationship)", () => {
    const lower = computeValuation({ ...valBase, ytelse: 5.5 })
    expect(lower.verdi).toBeGreaterThan(r.verdi)
    expect(lower.verdi / 1e6).toBeCloseTo(18.545, 2) // 1.02M ÷ 5.5%
  })
})

describe("computeValuation — guards", () => {
  it("returns 0 value when yield is 0", () => {
    const r = computeValuation({ ...valBase, ytelse: 0 })
    expect(r.verdi).toBe(0)
    expect(r.bruttoYield).toBe(0)
  })

  it("returns 0 per-m² when area is 0", () => {
    expect(computeValuation({ ...valBase, areal: 0 }).perM2).toBe(0)
  })
})

describe("clamp", () => {
  it("bounds values into [min, max]", () => {
    expect(clamp(15, 3, 10)).toBe(10)
    expect(clamp(1, 3, 10)).toBe(3)
    expect(clamp(6.75, 3, 10)).toBe(6.75)
  })

  it("returns min for non-finite input", () => {
    expect(clamp(NaN, 3, 10)).toBe(3)
    expect(clamp(Infinity, 0, 85)).toBe(0)
  })
})
