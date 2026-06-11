import { describe, it, expect } from "vitest"
import {
  mergeForecast,
  rangeWindow,
  forecastFromLabel,
  type SeriesDef,
} from "@/components/analyseportal/seriesUtils"
import { buildCsv } from "@/components/analyseportal/csv"
import {
  QUARTERS,
  QUARTERS_F,
  YEARS,
  YEARS_F,
  PORTAL_SEGMENTS,
  PORTAL_CITIES,
  PORTAL_YIELD,
  PORTAL_YIELD_F,
  PORTAL_RATES,
  PORTAL_RATES_F,
  PORTAL_LEIE,
  PORTAL_LEIE_F,
  PORTAL_VOLUME,
  PORTAL_VOLUME_F,
  VACANCY_TREND,
  NYBYGG,
  NYBYGG_F,
  MAKRO,
  MAKRO_F,
  CITY_COLOR,
  SEG_COLOR,
  bpsChange,
  pctGrowth,
  lastOf,
  fmtGroup,
  fmtComma,
  fmtKrM2,
  PORTAL_KPIS,
  MI_KPIS,
} from "@/components/markedsinnsikt/portalSeries"
import { VOLUME, LEIE, VACANCY, YIELD } from "@/components/markedsinnsikt/marketData"
import { LATEST_RELEASE } from "@/components/markedsinnsikt/marketReleases"

const SERIES: SeriesDef[] = [
  { key: "a", label: "A", color: "#000", hist: [1, 2, 3], fc: [4, 5] },
  { key: "b", label: "B", color: "#111", hist: [10, 20, 30], fc: [40, 50] },
]

describe("mergeForecast", () => {
  const rows = mergeForecast(["q1", "q2", "q3"], ["f1", "f2"], SERIES)

  it("produces hist + forecast rows with _f flags", () => {
    expect(rows).toHaveLength(5)
    expect(rows.map((r) => r._f)).toEqual([false, false, false, true, true])
  })

  it("duplicates the last historical point onto the join row (continuous line)", () => {
    const join = rows[2]
    expect(join.a).toBe(3)
    expect(join.a_f).toBe(3)
    expect(join.b_f).toBe(30)
  })

  it("keeps solid null in forecast rows and vice versa", () => {
    expect(rows[0].a_f).toBeNull()
    expect(rows[3].a).toBeNull()
    expect(rows[3].a_f).toBe(4)
  })
})

describe("rangeWindow", () => {
  const labels = Array.from({ length: 20 }, (_, i) => `h${i}`)
  const series: SeriesDef[] = [
    { key: "x", label: "X", color: "#000", hist: labels.map((_, i) => i), fc: [99, 98] },
  ]
  const rows = mergeForecast(labels, ["f1", "f2"], series)

  it("3y keeps 12 historical rows plus the full forecast tail", () => {
    const out = rangeWindow(rows, "3y")
    expect(out.filter((r) => !r._f)).toHaveLength(12)
    expect(out.filter((r) => r._f)).toHaveLength(2)
  })

  it("all keeps everything", () => {
    expect(rangeWindow(rows, "all")).toHaveLength(22)
  })

  it("forecastFromLabel is the last historical label (derived, never hardcoded)", () => {
    expect(forecastFromLabel(rows)).toBe("h19")
    expect(forecastFromLabel(rangeWindow(rows, "3y"))).toBe("h19")
  })
})

describe("delta helpers", () => {
  it("bpsChange computes basis points over the window", () => {
    expect(bpsChange([5.0, 5.5, 6.0], 2)).toBe(100)
    expect(bpsChange([6.0, 6.0], 1)).toBe(0)
  })
  it("pctGrowth handles negative growth", () => {
    expect(pctGrowth([200, 100], 1)).toBe(-50)
  })
})

describe("formatters (deterministic Norwegian)", () => {
  it("groups thousands with NBSP (U+00A0), never a plain space", () => {
    const s = fmtGroup(2950)
    expect(s).toBe("2 950")
    expect(s).not.toContain(" ") // plain space
    expect(fmtKrM2(12400)).toBe("12 400 kr/m²")
  })
  it("uses comma decimals", () => {
    expect(fmtComma(6.1, 2)).toBe("6,10")
  })
})

describe("buildCsv", () => {
  it("semicolon separator, comma decimals, BOM, _-cols excluded", () => {
    const csv = buildCsv([
      { Kvartal: "Q4 25", Yield: 6.1, _f: "internal" },
      { Kvartal: "Q1 26", Yield: 6.05, _f: "internal" },
    ])
    expect(csv.charCodeAt(0)).toBe(0xfeff)
    const lines = csv.slice(1).split("\n")
    expect(lines[0]).toBe("Kvartal;Yield")
    expect(lines[1]).toBe("Q4 25;6,1")
  })

  it("escapes formula-injection cells", () => {
    const csv = buildCsv([{ A: "=cmd()", B: "+sum", C: "safe" }])
    expect(csv).toContain("'=cmd()")
    expect(csv).toContain("'+sum")
    expect(csv).toContain("safe")
  })

  it("empty rows produce empty output", () => {
    expect(buildCsv([])).toBe("")
  })
})

describe("portal data integrity (canonical-series rule)", () => {
  it("every quarterly series matches the axis length, history and forecast", () => {
    for (const s of PORTAL_SEGMENTS) {
      expect(PORTAL_YIELD[s.key]).toHaveLength(QUARTERS.length)
      expect(PORTAL_YIELD_F[s.key]).toHaveLength(QUARTERS_F.length)
    }
    for (const k of ["swap5y", "gov10y", "styringsrente"] as const) {
      expect(PORTAL_RATES[k]).toHaveLength(QUARTERS.length)
      expect(PORTAL_RATES_F[k]).toHaveLength(QUARTERS_F.length)
    }
  })

  it("annual series match the year axes", () => {
    for (const s of PORTAL_SEGMENTS) {
      expect(PORTAL_VOLUME[s.key]).toHaveLength(YEARS.length)
      expect(PORTAL_VOLUME_F[s.key]).toHaveLength(YEARS_F.length)
      expect(NYBYGG[s.key]).toHaveLength(YEARS.length)
      expect(NYBYGG_F[s.key]).toHaveLength(YEARS_F.length)
    }
    for (const k of Object.keys(MAKRO) as (keyof typeof MAKRO)[]) {
      expect(MAKRO[k]).toHaveLength(YEARS.length)
      expect(MAKRO_F[k]).toHaveLength(YEARS_F.length)
    }
  })

  it("canonical historical series are untouched (repo wins on overlap)", () => {
    expect(PORTAL_YIELD.kontor).toEqual(YIELD.kontor)
    expect(PORTAL_LEIE.kontor["Tromsø"]).toEqual(LEIE.kontor["Tromsø"])
    expect(PORTAL_LEIE.logistikk["Mo i Rana"]).toEqual(LEIE.logistikk["Mo i Rana"])
  })

  it("per-year segment volumes sum to the published total", () => {
    VOLUME.total.forEach((total, i) => {
      const sum = PORTAL_SEGMENTS.reduce((a, s) => a + PORTAL_VOLUME[s.key][i], 0)
      expect(Math.abs(sum - total)).toBeLessThanOrEqual(0.05)
    })
  })

  it("LEIE covers all six cities per segment with full forecast tails", () => {
    for (const seg of ["kontor", "handel", "logistikk"] as const) {
      for (const city of PORTAL_CITIES) {
        expect(PORTAL_LEIE[seg][city], `${seg}/${city}`).toHaveLength(QUARTERS.length)
        expect(PORTAL_LEIE_F[seg][city], `${seg}/${city} fc`).toHaveLength(QUARTERS_F.length)
      }
    }
  })

  it("kontor LEIE endpoints anchor to the release snapshot", () => {
    for (const c of LATEST_RELEASE.cities) {
      expect(lastOf(PORTAL_LEIE.kontor[c.name]), c.name).toBe(c.leieKrM2)
    }
  })

  it("vacancy trend endpoints anchor to the published snapshot", () => {
    for (const row of VACANCY) {
      expect(lastOf(VACANCY_TREND.kontor[row.city]), row.city).toBe(row.kontor)
      expect(lastOf(VACANCY_TREND.handel[row.city]), row.city).toBe(row.handel)
      expect(lastOf(VACANCY_TREND.logistikk[row.city]), row.city).toBe(row.logistikk)
    }
  })

  it("LEIE/VACANCY have no hotell dimension (type rule encoded in data)", () => {
    expect(Object.keys(PORTAL_LEIE)).not.toContain("hotell")
    expect(Object.keys(VACANCY_TREND)).not.toContain("hotell")
  })

  it("every city and segment has a colour", () => {
    for (const c of PORTAL_CITIES) expect(CITY_COLOR[c]).toMatch(/^#/)
    for (const s of PORTAL_SEGMENTS) expect(SEG_COLOR[s.key]).toMatch(/^#/)
  })

  it("KPIs are derived, present, and NBSP-formatted", () => {
    expect(PORTAL_KPIS).toHaveLength(6)
    expect(MI_KPIS).toHaveLength(4)
    // Yield kontor 12-month delta must equal the canonical-series derivation.
    const derived = bpsChange(PORTAL_YIELD.kontor, 4)
    const kpi = PORTAL_KPIS[0]
    if (derived === 0) expect(kpi.delta).toBe("uendret")
    else expect(kpi.delta).toContain("bps")
    // Big numbers carry NBSP, not plain space.
    const leieKpi = PORTAL_KPIS[4]
    expect(leieKpi.value).not.toContain(" ")
  })
})
