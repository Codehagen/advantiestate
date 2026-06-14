"use server"

import { subscribe, type SubscribeSource } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"

export type IntakeResult = { ok: true } | { ok: false; error: string }

// Surfaces allowed to reuse this intake. Both are high-intent owner
// requests with identical fields; they differ only in the offer framing and
// the CRM source they land under. A hidden `intakeSource` field selects which
// — whitelisted here so a tampered form can't inject an arbitrary source.
const ALLOWED_SOURCES: SubscribeSource[] = [
  "verdivurdering-intake",
  "eiernotat",
]

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

  const get = (k: string) => {
    const v = String(formData.get(k) ?? "").trim()
    return v.length > 0 ? v : undefined
  }

  const email = get("email") ?? ""
  const firstName = get("firstName")
  const propertyType = get("propertyType") ?? ""
  const location = get("location") ?? ""
  const purpose = get("purpose") ?? ""

  // Optional / surface-specific fields. The dedicated /verdivurdering page
  // sends address + company + free-text areal/leie (carried from the
  // næringskalkulator); the legacy #bestill form may send size/horizon.
  const address = get("address")
  const company = get("company")
  const areal = get("areal")
  const leie = get("leie")
  const size = get("size")
  const horizon = get("horizon")
  const phone = get("phone")
  const notes = get("notes")

  // `page` distinguishes which surface produced the lead so the funnel can be
  // measured (verdivurdering-page vs tjeneste-bestill). Defaults to the legacy
  // service page for backward compatibility.
  const page = get("page") ?? "/tjenester/verdivurdering"

  // `intakeSource` selects the CRM source (verdivurdering vs eiernotat).
  // Falls back to verdivurdering-intake for every existing form that doesn't
  // send it, and ignores any value not on the whitelist.
  const requested = get("intakeSource") as SubscribeSource | undefined
  const source: SubscribeSource =
    requested && ALLOWED_SOURCES.includes(requested)
      ? requested
      : "verdivurdering-intake"

  // Hard-intent minimum: email + property type + location + purpose. firstName
  // is required at the form level so we can address them in the welcome.
  if (!email || !propertyType || !location || !purpose) {
    return { ok: false, error: "Fyll ut alle påkrevde felt." }
  }

  // Build the structured context dynamically so empty optional fields don't
  // clutter the Discord notification.
  const intake: Record<string, string | undefined> = {
    Eiendomstype: propertyType,
    Adresse: address,
    Sted: location,
    Areal: areal ? `${areal} m²` : undefined,
    "Årlig leie": leie,
    Størrelse: size,
    Formål: purpose,
    Tidshorisont: horizon,
    Selskap: company,
    Telefon: phone,
    Beskjed: notes,
  }

  const result = await subscribe({
    email,
    firstName,
    source,
    pageUrl: page,
    intake,
  })

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true }
}
