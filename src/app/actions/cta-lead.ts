"use server"

import { subscribe } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"

export type CtaLeadInput = {
  /** Norwegian form label, e.g. "Verdsettelse" — shown in the Discord digest. */
  formType: string
  name: string
  email: string
  phone?: string
  /** Path the visitor was on, e.g. from window.location.pathname. */
  pageUrl?: string
  /** Remaining form-specific fields, Norwegian label → value. */
  fields?: Record<string, string>
}

export type CtaLeadResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELDS = 15
const MAX_VALUE_LEN = 500

export async function submitCtaLead(input: CtaLeadInput): Promise<CtaLeadResult> {
  if (!(await checkRateLimit("cta-lead"))) {
    return { ok: false, error: "For mange forsøk. Prøv igjen om noen minutter." }
  }

  const email = String(input.email ?? "").trim().toLowerCase()
  const name = String(input.name ?? "").trim().slice(0, 200)
  if (!EMAIL_RE.test(email) || !name) {
    return { ok: false, error: "Fyll inn navn og en gyldig e-postadresse." }
  }

  const intake: Record<string, string> = { Type: String(input.formType ?? "").slice(0, 100) }
  if (input.phone) intake.Telefon = String(input.phone).slice(0, 50)
  for (const [k, v] of Object.entries(input.fields ?? {}).slice(0, MAX_FIELDS)) {
    const value = String(v ?? "").trim().slice(0, MAX_VALUE_LEN)
    if (value) intake[String(k).slice(0, 50)] = value
  }

  // Route through the shared pipeline so these high-intent service-page leads
  // land in Supabase crm_leads (+ crm_activities) and the Discord digest — not
  // Discord alone, which lost them the moment a ping was missed. No
  // marketingConsent: submitting a CTA is a contact request, not a newsletter
  // opt-in, so the address does not enter the Resend audience.
  const result = await subscribe({
    email,
    source: "service-modal",
    pageUrl: input.pageUrl?.slice(0, 200),
    firstName: name,
    intake,
  })

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true }
}
