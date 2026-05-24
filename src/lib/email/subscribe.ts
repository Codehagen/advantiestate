import "server-only"
import { render } from "@react-email/render"
import { WelcomeEmail } from "@/emails/WelcomeEmail"
import { AUDIENCE_ID, EMAIL_FROM, getResend } from "./resend"
import { notifyLead } from "./discord"
import { recordSignup } from "@/lib/supabase/leads"

// All the surfaces that can trigger a subscribe. Used for analytics on the
// Discord side ("which page / lead magnet drove this signup?") and to pick
// the right welcome variant.
export type SubscribeSource =
  | "footer"
  | "blog"
  | "help"
  | "markedsinnsikt"
  | "service"
  | "sjekkliste-verdivurdering"
  | "markedsrapport"
  | "verdivurdering-intake"
  | "kontakt"

export type SubscribeInput = {
  email: string
  source: SubscribeSource
  /** Page URL the visitor was on when they signed up. Used in Discord digest. */
  pageUrl?: string
  /** Optional first name from intake forms. */
  firstName?: string
  /** Optional structured intake context (verdivurdering form, etc). */
  intake?: Record<string, string | number | undefined>
}

export type SubscribeResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Idempotent subscribe — adds the email to the Advanti audience in Resend
 * and fires the welcome email. Safe to call multiple times: Resend's contact
 * API returns the existing contact instead of erroring.
 *
 * Also pings the team Discord with source/context so Christer + Vegard see
 * pipeline in real time. Discord failure does NOT block the signup —
 * subscriber data is the source of truth.
 */
export async function subscribe(input: SubscribeInput): Promise<SubscribeResult> {
  const email = input.email.trim().toLowerCase()

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Ugyldig e-postadresse." }
  }
  if (!AUDIENCE_ID || !process.env.RESEND_API_KEY) {
    console.error(
      "Resend env not configured (RESEND_API_KEY or RESEND_AUDIENCE_ID missing); aborting subscribe.",
    )
    return { ok: false, error: "Tjenesten er midlertidig utilgjengelig." }
  }

  let resend
  try {
    resend = getResend()
  } catch (e) {
    console.error("Resend client init failed:", e)
    return { ok: false, error: "Tjenesten er midlertidig utilgjengelig." }
  }

  // Resend's contacts.create returns 200 even for existing contacts (the API
  // is upsert-shaped) so we read `alreadySubscribed` from the unsubscribed
  // flag. If the contact was previously unsubscribed, re-subscribe them.
  let alreadySubscribed = false
  try {
    const created = await resend.contacts.create({
      email,
      firstName: input.firstName,
      unsubscribed: false,
      audienceId: AUDIENCE_ID,
    })
    if (created.error) {
      // Treat "already exists" as a soft success — flag it so we skip the
      // welcome email but still ping Discord (the source/intake context is
      // valuable even for repeat signups, e.g. someone grabbing a second
      // gated asset).
      const msg = created.error.message ?? ""
      if (/already|exists|duplicate/i.test(msg)) {
        alreadySubscribed = true
      } else {
        console.error("Resend contacts.create error:", created.error)
        return { ok: false, error: "Kunne ikke registrere e-post." }
      }
    }
  } catch (e) {
    console.error("Resend contacts.create threw:", e)
    return { ok: false, error: "Kunne ikke registrere e-post." }
  }

  // Welcome email — first-time signups only.
  if (!alreadySubscribed) {
    try {
      const html = await render(WelcomeEmail({ firstName: input.firstName }))
      const text = await render(WelcomeEmail({ firstName: input.firstName }), {
        plainText: true,
      })
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: "Velkommen til Advanti",
        html,
        text,
      })
    } catch (e) {
      // Welcome failure is non-fatal — we have the subscriber, the drip
      // sequence will pick them up. Logged for ops to investigate.
      console.error("Welcome email failed for", email, e)
    }
  }

  // Discord digest — non-blocking.
  notifyLead({
    email,
    source: input.source,
    pageUrl: input.pageUrl,
    firstName: input.firstName,
    intake: input.intake,
    alreadySubscribed,
  }).catch((e) => console.error("Discord notify failed:", e))

  // Supabase routing — non-blocking, same contract as Discord. High-intent
  // signups (verdivurdering-intake, kontakt) land in crm_leads + a notat
  // activity; everything else lands in web_signups. Resend stays the source
  // of truth for the newsletter list.
  recordSignup({
    email,
    source: input.source,
    pageUrl: input.pageUrl,
    firstName: input.firstName,
    intake: input.intake,
    alreadySubscribed,
  }).catch((e) => console.error("Supabase recordSignup failed:", e))

  return { ok: true, alreadySubscribed }
}
