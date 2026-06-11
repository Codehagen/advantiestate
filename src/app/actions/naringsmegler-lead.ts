"use server"

import { PROPERTY_TYPES } from "@/components/naringsmegler/leadConstants"
import { subscribe } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"

export type CityLeadResult = { ok: true } | { ok: false; error: string }

// Hidden routing fields are attacker-controlled like everything else —
// constrain to slug shape so forged values can't smuggle text into the
// Discord digest / CRM via pageUrl.
const SLUG_RE = /^[a-z0-9-]{1,40}$/

/**
 * Trim + hard-cap a field, and neutralize Discord-markdown metacharacters and
 * newlines — intake values are interpolated into embed markdown that the team
 * reads as trusted (`**${k}:** ${v}`), so a submitter must not be able to
 * forge extra labelled lines or masked links.
 */
function clean(v: FormDataEntryValue | null, max: number): string {
  return String(v ?? "")
    .replace(/[\r\n*_`~|[\]]/g, " ")
    .replace(/\s+/g, " ")
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
 * every field is trimmed, length-capped and markdown-neutralized,
 * eiendomstype is validated against the shared option list, hidden routing
 * fields must match slug shape, and a honeypot field returns a silent
 * success so bots can't tell they were filtered.
 */
export async function submitCityLead(
  formData: FormData,
): Promise<CityLeadResult> {
  // Honeypot: real users never see or fill this field. Silent "success".
  // Logged so a false-positive spike (autofill heuristics) is observable.
  if (clean(formData.get("kontakt_url_x"), 50)) {
    console.warn("naringsmegler-lead: honeypot hit — submission dropped")
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
  const rawSlug = clean(formData.get("slug"), 100)
  const slug = SLUG_RE.test(rawSlug) ? rawSlug : "ukjent"

  if (!navn || !tlf || !epost) {
    return { ok: false, error: "Fyll ut navn, telefon og e-post." }
  }
  if (type && !(PROPERTY_TYPES as readonly string[]).includes(type)) {
    return { ok: false, error: "Ugyldig eiendomstype." }
  }

  const result = await subscribe({
    email: epost,
    firstName: navn,
    source: "naringsmegler",
    pageUrl: `/naringsmegler/${slug}`,
    intake: {
      // "Sted" is the key the CRM sink reads for behov_geografi
      // (src/lib/supabase/leads.ts) — same contract as the other intakes.
      Sted: by || undefined,
      Eiendomstype: type || undefined,
      "Adresse/område": adresse || undefined,
      Telefon: tlf,
    },
  })

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true }
}
