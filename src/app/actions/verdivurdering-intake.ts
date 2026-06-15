"use server"

import { subscribe, type SubscribeSource } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"
import { verdivurderingIntakeSchema } from "@/lib/forms/schemas"

export type IntakeResult = { ok: true } | { ok: false; error: string }

// Surfaces allowed to reuse this intake. Both are high-intent owner
// requests with identical fields; they differ only in the offer framing and
// the CRM source they land under. A hidden `intakeSource` field selects which
// — whitelisted here so a tampered form can't inject an arbitrary source.
const ALLOWED_SOURCES: SubscribeSource[] = [
  "verdivurdering-intake",
  "beslutningsgrunnlag",
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

  // Validate + cap. Hard-intent minimum: email (valid) + property type +
  // location + purpose; firstName is required at the form level. Optional /
  // surface-specific fields (address, company, free-text areal/leie from the
  // næringskalkulator, legacy size/horizon) are length-capped and dropped when
  // blank so they don't clutter the Discord notification.
  const parsed = verdivurderingIntakeSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    firstName: String(formData.get("firstName") ?? ""),
    propertyType: String(formData.get("propertyType") ?? ""),
    location: String(formData.get("location") ?? ""),
    purpose: String(formData.get("purpose") ?? ""),
    address: String(formData.get("address") ?? ""),
    company: String(formData.get("company") ?? ""),
    areal: String(formData.get("areal") ?? ""),
    leie: String(formData.get("leie") ?? ""),
    size: String(formData.get("size") ?? ""),
    horizon: String(formData.get("horizon") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    page: String(formData.get("page") ?? ""),
    intakeSource: String(formData.get("intakeSource") ?? ""),
  })
  if (!parsed.success) {
    return { ok: false, error: "Fyll ut alle påkrevde felt." }
  }
  const d = parsed.data

  // `intakeSource` selects the CRM source (verdivurdering vs beslutningsgrunnlag).
  // Falls back to verdivurdering-intake for every existing form that doesn't
  // send it, and ignores any value not on the whitelist.
  const requested = d.intakeSource as SubscribeSource | undefined
  const source: SubscribeSource =
    requested && ALLOWED_SOURCES.includes(requested)
      ? requested
      : "verdivurdering-intake"

  // `page` distinguishes which surface produced the lead (funnel measurement).
  // Defaults to the legacy service page for backward compatibility.
  const page = d.page ?? "/tjenester/verdivurdering"

  const intake: Record<string, string | undefined> = {
    Eiendomstype: d.propertyType,
    Adresse: d.address,
    Sted: d.location,
    Areal: d.areal ? `${d.areal} m²` : undefined,
    "Årlig leie": d.leie,
    Størrelse: d.size,
    Formål: d.purpose,
    Tidshorisont: d.horizon,
    Selskap: d.company,
    Telefon: d.phone,
    Beskjed: d.notes,
  }

  const result = await subscribe({
    email: d.email,
    firstName: d.firstName,
    source,
    pageUrl: page,
    intake,
  })

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true }
}
