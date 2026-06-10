"use server"

import { notifyLead } from "@/lib/email/discord"
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

  await notifyLead({
    email,
    source: "service",
    pageUrl: input.pageUrl?.slice(0, 200),
    firstName: name,
    intake,
  })

  return { ok: true }
}
