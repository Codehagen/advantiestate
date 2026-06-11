"use server"

import { notifyLead } from "@/lib/email/discord"
import { checkRateLimit } from "@/lib/rate-limit"

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

  const name = String(formData.get("name") ?? "").trim().slice(0, 200)
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const company = String(formData.get("company") ?? "").trim().slice(0, 200)
  const mandate = String(formData.get("mandate") ?? "").trim().slice(0, 500)

  if (!name || !EMAIL_RE.test(email)) {
    return {
      status: "error",
      message: "Fyll inn navn og en gyldig e-postadresse.",
    }
  }

  await notifyLead({
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
