import { beforeEach, describe, expect, it, vi } from "vitest"

// Mock the two collaborators before importing the action so vi.mock hoisting
// puts them in place. We assert on the `source` passed to subscribe().
const subscribeMock = vi.fn()
const checkRateLimitMock = vi.fn()

vi.mock("@/lib/email/subscribe", () => ({
  subscribe: subscribeMock,
}))

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: checkRateLimitMock,
}))

const { subscribeVerdivurderingIntake } = await import(
  "@/app/actions/verdivurdering-intake"
)

// Minimal valid intake: email + property type + location + purpose are the
// hard-intent minimum the action enforces.
function intakeFormData(extra: Record<string, string> = {}): FormData {
  const fd = new FormData()
  fd.set("email", "owner@example.no")
  fd.set("firstName", "Ola Nordmann")
  fd.set("propertyType", "Kontor")
  fd.set("location", "Bodø")
  fd.set("purpose", "Vurderer salg")
  for (const [k, v] of Object.entries(extra)) fd.set(k, v)
  return fd
}

describe("subscribeVerdivurderingIntake — intakeSource whitelist", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    checkRateLimitMock.mockResolvedValue(true)
    subscribeMock.mockResolvedValue({ ok: true, alreadySubscribed: false })
  })

  it("uses the eiernotat source when the form requests it", async () => {
    const result = await subscribeVerdivurderingIntake(
      intakeFormData({ intakeSource: "eiernotat" }),
    )
    expect(result).toEqual({ ok: true })
    expect(subscribeMock).toHaveBeenCalledTimes(1)
    expect(subscribeMock.mock.calls[0][0]).toMatchObject({
      source: "eiernotat",
    })
  })

  it("falls back to verdivurdering-intake when intakeSource is absent", async () => {
    await subscribeVerdivurderingIntake(intakeFormData())
    expect(subscribeMock.mock.calls[0][0]).toMatchObject({
      source: "verdivurdering-intake",
    })
  })

  it("ignores a non-whitelisted intakeSource (anti-tamper)", async () => {
    await subscribeVerdivurderingIntake(
      intakeFormData({ intakeSource: "investorportal" }),
    )
    // investorportal is a real SubscribeSource but NOT on this action's
    // whitelist — must fall back rather than inject it.
    expect(subscribeMock.mock.calls[0][0]).toMatchObject({
      source: "verdivurdering-intake",
    })
  })

  it("rejects intake missing a required field without calling subscribe", async () => {
    const fd = intakeFormData()
    fd.delete("purpose")
    const result = await subscribeVerdivurderingIntake(fd)
    expect(result.ok).toBe(false)
    expect(subscribeMock).not.toHaveBeenCalled()
  })
})
