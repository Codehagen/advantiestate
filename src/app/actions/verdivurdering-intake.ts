"use server"

import { subscribe } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"

export type IntakeResult = { ok: true } | { ok: false; error: string }

/**
 * Verdivurdering intake — the hardest-intent surface on the site.
 *
 * Routes through the same subscribe action as everything else (so the lead
 * lands in Resend + welcome email fires), but with the full intake context
 * attached to the Discord notification so Christer/Vegard can pick up the
 * phone with the right context already on screen.
 */
export async function subscribeVerdivurderingIntake(
  formData: FormData,
): Promise<IntakeResult> {
  if (!(await checkRateLimit("verdivurdering"))) {
    return { ok: false, error: "For mange forsøk. Prøv igjen om noen minutter." }
  }

  const email = String(formData.get("email") ?? "")
  const firstName = String(formData.get("firstName") ?? "") || undefined
  const propertyType = String(formData.get("propertyType") ?? "")
  const location = String(formData.get("location") ?? "")
  const size = String(formData.get("size") ?? "")
  const purpose = String(formData.get("purpose") ?? "")
  const horizon = String(formData.get("horizon") ?? "")
  const phone = String(formData.get("phone") ?? "") || undefined
  const notes = String(formData.get("notes") ?? "") || undefined

  // Minimum: email + the 5 intake fields. firstName is also required at the
  // form level so we can address them in the welcome.
  if (!email || !propertyType || !location || !size || !purpose || !horizon) {
    return { ok: false, error: "Fyll ut alle påkrevde felt." }
  }

  const result = await subscribe({
    email,
    firstName,
    source: "verdivurdering-intake",
    pageUrl: "/tjenester/verdivurdering",
    intake: {
      Eiendomstype: propertyType,
      Sted: location,
      Størrelse: size,
      Bakgrunn: purpose,
      Tidshorisont: horizon,
      Telefon: phone,
      Beskjed: notes,
    },
  })

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true }
}
