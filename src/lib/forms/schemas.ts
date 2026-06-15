import { z } from "zod"

/**
 * Input-validation schemas for the lead/contact server actions.
 *
 * Each schema mirrors the action's existing required-field set and length caps —
 * the goal is to centralize and enforce validation (and reject oversized/
 * malformed payloads before they reach business logic), NOT to tighten what a
 * legitimate visitor can submit. Discord-markdown neutralization is handled
 * separately at the choke point (lib/email/sanitize.ts); these schemas are the
 * structural gate (shape, required fields, length, email format).
 *
 * Convention: FormData yields "" for empty fields; `optionalText` treats blank
 * as absent so optional fields don't become empty strings downstream.
 */

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v.length > 0 ? v : undefined))
    .optional()

const requiredText = (max: number, message = "Påkrevd felt mangler.") =>
  z.string().trim().min(1, message).max(max)

/** Lowercased, format-validated email. */
const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Fyll inn en gyldig e-postadresse."))

// ── newsletter (footer / lead-magnet signup) ────────────────────────────────
export const newsletterSchema = z.object({
  email,
  source: optionalText(60),
  pageUrl: optionalText(200),
  firstName: optionalText(200),
})

// ── CTA lead modal (service-page request) ───────────────────────────────────
// formType is optional to match the action's existing behavior (it defaults to
// "" when absent); name + email are the only hard requirements.
export const ctaLeadSchema = z.object({
  formType: optionalText(100),
  name: requiredText(200, "Fyll inn navn."),
  email,
  phone: optionalText(50),
  pageUrl: optionalText(200),
  fields: z.record(z.string(), z.string()).optional(),
})

// ── verdivurdering / beslutningsgrunnlag intake (hardest intent) ─────────────
export const verdivurderingIntakeSchema = z.object({
  email,
  firstName: optionalText(200),
  propertyType: requiredText(100, "Velg eiendomstype."),
  location: requiredText(100, "Fyll inn sted."),
  purpose: requiredText(100, "Velg formål."),
  address: optionalText(400),
  company: optionalText(200),
  areal: optionalText(50),
  leie: optionalText(50),
  size: optionalText(50),
  horizon: optionalText(50),
  phone: optionalText(50),
  notes: optionalText(2000),
  page: optionalText(200),
  intakeSource: optionalText(60),
})

// ── investor-portal access request ──────────────────────────────────────────
export const investorAccessSchema = z.object({
  name: requiredText(200, "Fyll inn navn."),
  email,
  company: optionalText(200),
  mandate: optionalText(500),
})

// ── kontakt (contact inquiry) ───────────────────────────────────────────────
export const contactInquirySchema = z.object({
  name: requiredText(200, "Fyll inn navn."),
  email,
  phone: optionalText(50),
  service: requiredText(200, "Velg tjeneste."),
  message: optionalText(2000),
})
