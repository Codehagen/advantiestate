"use server"

import { subscribe } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"

export type CityLeadResult = { ok: true } | { ok: false; error: string }

// The eiendomstype <select> options — anything else in the field is a bot
// or a tampered request, not a user.
const PROPERTY_TYPES = [
  "Kontor",
  "Handel",
  "Logistikk / lager",
  "Kombinert bygg",
  "Annet",
]

/** Trim + hard-cap a free-text field before it flows into Discord/Supabase. */
function clean(v: FormDataEntryValue | null, max: number): string {
  return String(v ?? "")
    .trim()
    .slice(0, max)
}

/**
 * Lead intake for the /naringsmegler/[slug] city pages — a hard-intent
 * surface (local seller asking for a valuation). Routes through the shared
 * subscribe pipeline (Resend + Discord + Supabase CRM via the
 * "naringsmegler" HIGH_INTENT source).
 *
 * Hardening beyond the older intake actions (autoplan eng review F7):
 * every field is trimmed and length-capped, eiendomstype is validated
 * against the actual option list, and a honeypot field returns a silent
 * success so bots can't tell they were filtered.
 */
export async function submitCityLead(
  formData: FormData,
): Promise<CityLeadResult> {
  // Honeypot: real users never see or fill this field. Silent "success".
  if (clean(formData.get("firma_web"), 50)) {
    return { ok: true }
  }

  if (!(await checkRateLimit("naringsmegler"))) {
    return {
      ok: false,
      error: "For mange forsøk. Prøv igjen om noen minutter.",
    }
  }

  const navn = clean(formData.get("navn"), 200)
  const tlf = clean(formData.get("tlf"), 50)
  const epost = clean(formData.get("epost"), 200)
  const type = clean(formData.get("type"), 50)
  const adresse = clean(formData.get("adresse"), 400)
  const by = clean(formData.get("by"), 100)
  const slug = clean(formData.get("slug"), 100)

  if (!navn || !tlf || !epost) {
    return { ok: false, error: "Fyll ut navn, telefon og e-post." }
  }
  if (type && !PROPERTY_TYPES.includes(type)) {
    return { ok: false, error: "Ugyldig eiendomstype." }
  }

  const result = await subscribe({
    email: epost,
    firstName: navn,
    source: "naringsmegler",
    pageUrl: `/naringsmegler/${slug}`,
    intake: {
      By: by,
      Eiendomstype: type || undefined,
      "Adresse/område": adresse || undefined,
      Telefon: tlf,
    },
  })

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true }
}
