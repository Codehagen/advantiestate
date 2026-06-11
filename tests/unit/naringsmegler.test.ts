import { describe, it, expect, vi, beforeEach } from "vitest"

// ---------------------------------------------------------------------------
// cityMarketData — the whitelist data module for /naringsmegler/[slug].
// The slug↔portal key spaces don't match ("mo-i-rana" vs "Mo i Rana"); these
// asserts catch silent drift in either direction (autoplan eng F3).
// ---------------------------------------------------------------------------

import {
  CHART_QUARTERS,
  CHART_QUARTERS_F,
  getLeieHist,
  getVacancySnapshot,
  PORTAL_CITIES,
  PORTAL_CITY_BY_SLUG,
  STYRINGSRENTE_F,
  STYRINGSRENTE_HIST,
  YIELD_KONTOR_F,
  YIELD_KONTOR_HIST,
} from "@/components/naringsmegler/cityMarketData"

describe("cityMarketData slug map", () => {
  it("maps every portal slug to a real PORTAL_CITIES entry", () => {
    for (const [slug, city] of Object.entries(PORTAL_CITY_BY_SLUG)) {
      expect(PORTAL_CITIES, `${slug} → ${city}`).toContain(city)
    }
  })

  it("resolves the six expected location slugs", () => {
    for (const slug of [
      "bodo",
      "tromso",
      "harstad",
      "alta",
      "narvik",
      "mo-i-rana",
    ]) {
      expect(PORTAL_CITY_BY_SLUG[slug], slug).toBeDefined()
    }
  })

  it("does NOT resolve non-portal location slugs", () => {
    for (const slug of ["hammerfest", "sortland", "svolvaer", "lofoten"]) {
      expect(PORTAL_CITY_BY_SLUG[slug], slug).toBeUndefined()
    }
  })
})

describe("cityMarketData chart series", () => {
  it("history series share the 12-quarter window", () => {
    expect(CHART_QUARTERS).toHaveLength(12)
    expect(YIELD_KONTOR_HIST).toHaveLength(12)
    expect(STYRINGSRENTE_HIST).toHaveLength(12)
  })

  it("forecast tails share the forecast axis", () => {
    expect(YIELD_KONTOR_F).toHaveLength(CHART_QUARTERS_F.length)
    expect(STYRINGSRENTE_F).toHaveLength(CHART_QUARTERS_F.length)
  })

  it("history ends in the latest published quarter", () => {
    expect(CHART_QUARTERS[CHART_QUARTERS.length - 1]).toBe("Q4 25")
  })
})

describe("cityMarketData honest-data rule (autoplan E2)", () => {
  it("returns canonical leie history only for the three published cities", () => {
    expect(getLeieHist("Bodø")).toHaveLength(12)
    expect(getLeieHist("Tromsø")).toHaveLength(12)
    expect(getLeieHist("Harstad")).toHaveLength(12)
    // genRent (synthetic) cities must NOT get a sparkline series.
    expect(getLeieHist("Alta")).toBeNull()
    expect(getLeieHist("Narvik")).toBeNull()
    expect(getLeieHist("Mo i Rana")).toBeNull()
  })

  it("vacancy is a published snapshot number for portal cities", () => {
    for (const city of PORTAL_CITIES) {
      const v = getVacancySnapshot(city)
      expect(typeof v, city).toBe("number")
      expect(v!).toBeGreaterThan(0)
    }
  })
})

// ---------------------------------------------------------------------------
// submitCityLead — hardened lead action (autoplan eng F7): honeypot returns a
// silent success, fields are capped, eiendomstype is validated against the
// real option list, and the happy path routes through subscribe() with the
// high-intent "naringsmegler" source.
// ---------------------------------------------------------------------------

const subscribeMock = vi.fn(async () => ({ ok: true as const, alreadySubscribed: false }))
const rateLimitMock = vi.fn(async () => true)

vi.mock("@/lib/email/subscribe", () => ({
  subscribe: (...args: unknown[]) => subscribeMock(...(args as [])),
}))
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: () => rateLimitMock(),
}))

import { submitCityLead } from "@/app/actions/naringsmegler-lead"

function leadForm(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData()
  const base: Record<string, string> = {
    navn: "Ola Nordmann",
    tlf: "+47 999 88 777",
    epost: "ola@firma.no",
    type: "Kontor",
    adresse: "Sentrum, Bodø",
    by: "Bodø",
    slug: "bodo",
    firma_web: "",
    ...overrides,
  }
  for (const [k, v] of Object.entries(base)) fd.set(k, v)
  return fd
}

describe("submitCityLead", () => {
  beforeEach(() => {
    subscribeMock.mockClear()
    rateLimitMock.mockClear()
    rateLimitMock.mockResolvedValue(true)
  })

  it("submits a valid lead through the subscribe pipeline", async () => {
    const result = await submitCityLead(leadForm())
    expect(result).toEqual({ ok: true })
    expect(subscribeMock).toHaveBeenCalledTimes(1)
    const arg = subscribeMock.mock.calls[0]![0] as Record<string, unknown>
    expect(arg.source).toBe("naringsmegler")
    expect(arg.pageUrl).toBe("/naringsmegler/bodo")
    expect((arg.intake as Record<string, string>).Telefon).toBe(
      "+47 999 88 777",
    )
  })

  it("honeypot filled → silent success, pipeline never touched", async () => {
    const result = await submitCityLead(leadForm({ firma_web: "spambot.io" }))
    expect(result).toEqual({ ok: true })
    expect(subscribeMock).not.toHaveBeenCalled()
  })

  it("rejects when required fields are missing", async () => {
    const result = await submitCityLead(leadForm({ navn: "  " }))
    expect(result.ok).toBe(false)
    expect(subscribeMock).not.toHaveBeenCalled()
  })

  it("rejects an eiendomstype outside the select's option list", async () => {
    const result = await submitCityLead(leadForm({ type: "Slott" }))
    expect(result.ok).toBe(false)
    expect(subscribeMock).not.toHaveBeenCalled()
  })

  it("caps oversized fields before they reach the pipeline", async () => {
    await submitCityLead(leadForm({ navn: "x".repeat(5000) }))
    const arg = subscribeMock.mock.calls[0]![0] as { firstName: string }
    expect(arg.firstName.length).toBeLessThanOrEqual(200)
  })

  it("returns the rate-limit error when the window is exhausted", async () => {
    rateLimitMock.mockResolvedValue(false)
    const result = await submitCityLead(leadForm())
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/mange forsøk/i)
    expect(subscribeMock).not.toHaveBeenCalled()
  })
})
