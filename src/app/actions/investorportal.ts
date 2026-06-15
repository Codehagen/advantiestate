"use server"

import { notifyLead } from "@/lib/email/discord"
import { subscribe } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"
import { investorAccessSchema } from "@/lib/forms/schemas"

export type InvestorAccessFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * «Be om tilgang»-skjemaet på /investorportal. Hver innsending varsles som
 * høy-intent lead i Discord — portalen selv er foreløpig en demo, så
 * oppfølgingen skjer manuelt av megler.
 */
export async function requestInvestorAccess(
  _prev: InvestorAccessFormState,
  formData: FormData,
): Promise<InvestorAccessFormState> {
  if (!(await checkRateLimit("investorportal"))) {
    return {
      status: "error",
      message: "For mange forsøk. Prøv igjen om noen minutter.",
    }
  }

  const parsed = investorAccessSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    mandate: String(formData.get("mandate") ?? ""),
  })
  if (!parsed.success) {
    return {
      status: "error",
      message: "Fyll inn navn og en gyldig e-postadresse.",
    }
  }
  const { name, email, company, mandate } = parsed.data

  // Route through the shared pipeline (Discord + Supabase crm_leads) rather than
  // notifyLead alone — investorportal is high-intent, so the access request must
  // land as a curated CRM lead, not just a Discord ping that's lost when missed.
  // No marketingConsent: an access request is not a newsletter opt-in.
  const result = await subscribe({
    email,
    source: "investorportal",
    pageUrl: "/investorportal",
    firstName: name,
    intake: {
      Type: "Be om tilgang til investorportalen",
      Selskap: company || undefined,
      Mandat: mandate || undefined,
    },
  })

  if (!result.ok) {
    return { status: "error", message: result.error }
  }
  return { status: "success" }
}

/**
 * Demo-innloggingen slipper alle inn, men gir oss et stille varsel når noen
 * faktisk utforsker portalen — det er et kjøpssignal vi vil følge opp.
 * Skal aldri blokkere innloggingen; feil svelges.
 */
export async function notifyPortalDemoLogin(email: string): Promise<void> {
  try {
    const cleaned = String(email ?? "").trim().toLowerCase()
    if (!EMAIL_RE.test(cleaned)) return
    if (!(await checkRateLimit("investorportal-demo"))) return
    await notifyLead({
      email: cleaned,
      source: "investorportal",
      pageUrl: "/investorportal",
      intake: { Type: "Demo-innlogging i investorportalen" },
    })
  } catch {
    // Demoen skal aldri feile på grunn av varselet.
  }
}
