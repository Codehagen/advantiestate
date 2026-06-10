"use server"

import { subscribe } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"

export type EiendomVarselFormState =
  | { status: "idle" }
  | { status: "success"; alreadySubscribed: boolean }
  | { status: "error"; message: string }

export async function subscribeEiendomVarsel(
  _prev: EiendomVarselFormState,
  formData: FormData,
): Promise<EiendomVarselFormState> {
  if (!(await checkRateLimit("eiendom-varsel"))) {
    return { status: "error", message: "For mange forsøk. Prøv igjen om noen minutter." }
  }

  const email = String(formData.get("email") ?? "")
  const firstName =
    String(formData.get("firstName") ?? "").trim() || undefined
  const phone = String(formData.get("phone") ?? "").trim() || undefined
  const bedrift = String(formData.get("bedrift") ?? "").trim() || undefined
  const sted = String(formData.get("sted") ?? "").trim() || undefined
  const pageUrl = String(formData.get("pageUrl") ?? "")

  if (!email || !firstName) {
    return { status: "error", message: "Fyll inn navn og e-post." }
  }

  // Only attach keys that have values — keeps the Discord embed clean and
  // matches how lib/supabase/leads.ts maps intake → crm_leads columns
  // (Bedrift → firma_navn, Sted → behov_geografi, Telefon → kontakt_telefon).
  const intake: Record<string, string> = {}
  if (phone) intake.Telefon = phone
  if (bedrift) intake.Bedrift = bedrift
  if (sted) intake.Sted = sted

  const result = await subscribe({
    email,
    firstName,
    source: "eiendommer",
    pageUrl,
    intake: Object.keys(intake).length > 0 ? intake : undefined,
  })

  if (!result.ok) return { status: "error", message: result.error }
  return { status: "success", alreadySubscribed: result.alreadySubscribed }
}
