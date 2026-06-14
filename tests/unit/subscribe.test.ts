import { beforeEach, describe, expect, it, vi } from "vitest"

const contactsCreateMock = vi.fn()
const emailsSendMock = vi.fn()
const notifyLeadMock = vi.fn()
const recordSignupMock = vi.fn()
const renderMock = vi.fn(async () => "<html>ok</html>")

vi.mock("@react-email/render", () => ({
  render: renderMock,
}))

vi.mock("@/emails/WelcomeEmail", () => ({
  WelcomeEmail: () => null,
}))

vi.mock("@/lib/email/resend", () => ({
  AUDIENCE_ID: "audience-1",
  EMAIL_FROM: "Advanti Estate <hei@advantiestate.no>",
  getResend: () => ({
    contacts: { create: contactsCreateMock },
    emails: { send: emailsSendMock },
  }),
}))

vi.mock("@/lib/email/discord", () => ({
  notifyLead: notifyLeadMock,
}))

vi.mock("@/lib/supabase/leads", () => ({
  recordSignup: recordSignupMock,
}))

const { subscribe } = await import("@/lib/email/subscribe")

describe("subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = "test-resend-key"
    process.env.DISCORD_WEBHOOK_URL = "https://discord.example/webhook"
    process.env.SUPABASE_URL = "https://supabase.example"
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role"
    contactsCreateMock.mockResolvedValue({ error: null })
    emailsSendMock.mockResolvedValue({ error: null })
    notifyLeadMock.mockResolvedValue(true)
    recordSignupMock.mockResolvedValue(true)
  })

  it("adds newsletter-consenting contacts to Resend and sends the welcome email", async () => {
    const result = await subscribe({
      email: "OLA@EXAMPLE.NO",
      source: "footer",
      marketingConsent: true,
    })

    expect(result).toEqual({ ok: true, alreadySubscribed: false })
    expect(contactsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ola@example.no",
        audienceId: "audience-1",
        unsubscribed: false,
      }),
    )
    expect(emailsSendMock).toHaveBeenCalledTimes(1)
    expect(notifyLeadMock).toHaveBeenCalledTimes(1)
    expect(recordSignupMock).toHaveBeenCalledTimes(1)
  })

  it("does not add high-intent sales leads to Resend without explicit marketing consent", async () => {
    const result = await subscribe({
      email: "lead@example.no",
      source: "verdivurdering-intake",
      firstName: "Ola",
      intake: { Telefon: "999 88 777" },
    })

    expect(result).toEqual({ ok: true, alreadySubscribed: false })
    expect(contactsCreateMock).not.toHaveBeenCalled()
    expect(emailsSendMock).not.toHaveBeenCalled()
    expect(notifyLeadMock).toHaveBeenCalledTimes(1)
    expect(recordSignupMock).toHaveBeenCalledTimes(1)
  })

  it("treats 'service-modal' as a contact request, not a newsletter opt-in", async () => {
    const result = await subscribe({
      email: "modal-lead@example.no",
      source: "service-modal",
      firstName: "Ola Nordmann",
      intake: { Type: "Verdsettelse", Telefon: "999 88 777" },
    })

    expect(result).toEqual({ ok: true, alreadySubscribed: false })
    expect(contactsCreateMock).not.toHaveBeenCalled()
    expect(emailsSendMock).not.toHaveBeenCalled()
    expect(notifyLeadMock).toHaveBeenCalledTimes(1)
    expect(recordSignupMock).toHaveBeenCalledTimes(1)
  })

  it("returns an error when every configured destination fails", async () => {
    contactsCreateMock.mockResolvedValue({
      error: { message: "provider unavailable" },
    })
    notifyLeadMock.mockResolvedValue(false)
    recordSignupMock.mockResolvedValue(false)

    const result = await subscribe({
      email: "a@b.no",
      source: "footer",
      marketingConsent: true,
    })

    expect(result).toEqual({
      ok: false,
      error: "Tjenesten er midlertidig utilgjengelig.",
    })
  })

  it("keeps a high-intent lead successful when one durable destination lands", async () => {
    notifyLeadMock.mockResolvedValue(false)
    recordSignupMock.mockResolvedValue(true)

    const result = await subscribe({
      email: "lead@example.no",
      source: "kontakt",
    })

    expect(result).toEqual({ ok: true, alreadySubscribed: false })
  })
})
