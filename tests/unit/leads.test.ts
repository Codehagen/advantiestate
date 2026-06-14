import { describe, it, expect, vi, beforeEach } from "vitest"

// ---------------------------------------------------------------------------
// Mock Supabase server BEFORE importing the module under test so that
// vi.mock hoisting ensures the mock is in place when leads.ts is evaluated.
// ---------------------------------------------------------------------------

const inserted: Array<{ table: string; row: unknown }> = []

const fakeClient = {
  from: (table: string) => ({
    insert: (row: unknown) => {
      inserted.push({ table, row })
      return {
        select: () => ({
          single: async () => ({ data: { id: "lead-1" }, error: null }),
        }),
        // Thenable so `await supabase.from(t).insert(row)` resolves cleanly
        then: (resolve: (v: { error: null }) => void) =>
          resolve({ error: null }),
      }
    },
  }),
}

vi.mock("@/lib/supabase/server", () => ({
  isSupabaseConfigured: () => true,
  getSupabase: () => fakeClient,
}))

// Dynamic import ensures the module sees the mock above.
const { recordSignup, mapPropertyType, buildActivitySummary } = await import(
  "@/lib/supabase/leads"
)

// ---------------------------------------------------------------------------
// Pure helper: mapPropertyType
// ---------------------------------------------------------------------------

describe("mapPropertyType", () => {
  it("maps 'Kontorbygg' → ['kontor']", () => {
    expect(mapPropertyType("Kontorbygg")).toEqual(["kontor"])
  })

  it("maps 'Handel' → ['butikk']", () => {
    expect(mapPropertyType("Handel")).toEqual(["butikk"])
  })

  it("maps 'Kombinert' → ['kontor', 'lager']", () => {
    expect(mapPropertyType("Kombinert")).toEqual(["kontor", "lager"])
  })

  it("maps 'Annet' → []", () => {
    expect(mapPropertyType("Annet")).toEqual([])
  })

  it("maps undefined → []", () => {
    expect(mapPropertyType(undefined)).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Pure helper: buildActivitySummary
// ---------------------------------------------------------------------------

describe("buildActivitySummary", () => {
  it("includes kontakt phrase for source='kontakt'", () => {
    const summary = buildActivitySummary(
      { email: "a@b.no", source: "kontakt" },
      {},
    )
    expect(summary).toContain("Henvendelse via kontaktskjema.")
  })

  it("includes the CTA type for source='service-modal'", () => {
    const summary = buildActivitySummary(
      { email: "a@b.no", source: "service-modal" },
      { Type: "Verdsettelse" },
    )
    expect(summary).toContain("CTA-modal på tjenesteside (Verdsettelse)")
  })
})

// ---------------------------------------------------------------------------
// Routing characterization: recordSignup
// ---------------------------------------------------------------------------

describe("recordSignup routing", () => {
  beforeEach(() => {
    inserted.splice(0) // reset the captured inserts
  })

  it("routes HIGH_INTENT 'kontakt' → crm_leads then crm_activities", async () => {
    const ok = await recordSignup({ email: "a@b.no", source: "kontakt" })
    expect(ok).toBe(true)
    expect(inserted[0]?.table).toBe("crm_leads")
    expect(inserted[1]?.table).toBe("crm_activities")
  })

  it("routes low-intent 'footer' → web_signups only", async () => {
    const ok = await recordSignup({ email: "a@b.no", source: "footer" })
    expect(ok).toBe(true)
    expect(inserted).toHaveLength(1)
    expect(inserted[0]?.table).toBe("web_signups")
  })

  it("routes HIGH_INTENT 'service-modal' → crm_leads (not web_signups)", async () => {
    const ok = await recordSignup({
      email: "a@b.no",
      source: "service-modal",
      firstName: "Ola Nordmann",
      intake: { Type: "Verdsettelse", Telefon: "999 88 777" },
    })
    expect(ok).toBe(true)
    expect(inserted[0]?.table).toBe("crm_leads")
    expect(inserted[1]?.table).toBe("crm_activities")
  })
})
