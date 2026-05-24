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

const RESEND_CONFIGURED = () =>
  Boolean(AUDIENCE_ID && process.env.RESEND_API_KEY)

/**
 * Idempotent subscribe.
 *
 * Three independent destinations, each non-blocking:
 *   1. Resend (newsletter audience + welcome email) — optional, skipped
 *      when env unset.
 *   2. Discord (team digest webhook) — optional, skipped when env unset.
 *   3. Supabase (web_signups / crm_leads + crm_activities) — optional,
 *      skipped when env unset.
 *
 * The visitor only sees a hard failure when none of the three could fire
 * AND email validation passed — i.e. the funnel has no destination at all.
 * In every other case we return ok so the form flips to the success state.
 *
 * Re-subscribing the same email is safe: Resend treats contacts.create as
 * an upsert, Discord pings are dedupable by the team, and Supabase records
 * one row per touchpoint by design (see supabase/README.md).
 */
export async function subscribe(input: SubscribeInput): Promise<SubscribeResult> {
  const email = input.email.trim().toLowerCase()

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Ugyldig e-postadresse." }
  }

  // If literally nothing is configured, fail loudly so we don't ghost the
  // visitor with a "success" that wrote to nothing.
  const anyConfigured =
    RESEND_CONFIGURED() ||
    Boolean(process.env.DISCORD_WEBHOOK_URL) ||
    Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!anyConfigured) {
    console.error(
      "subscribe(): no destinations configured (Resend, Discord, Supabase all unset).",
    )
    return { ok: false, error: "Tjenesten er midlertidig utilgjengelig." }
  }

  // 1. Resend — when configured. Detects repeat signups so we don't double-
  //    fire the welcome email. When env is unset, alreadySubscribed stays
  //    false and we skip the welcome.
  let alreadySubscribed = false
  if (RESEND_CONFIGURED()) {
    try {
      const resend = getResend()
      const created = await resend.contacts.create({
        email,
        firstName: input.firstName,
        unsubscribed: false,
        audienceId: AUDIENCE_ID,
      })
      if (created.error) {
        const msg = created.error.message ?? ""
        if (/already|exists|duplicate/i.test(msg)) {
          alreadySubscribed = true
        } else {
          console.error("Resend contacts.create error:", created.error)
          // Don't bail — Supabase + Discord should still fire.
        }
      }

      // Welcome email — first-time signups only.
      if (!alreadySubscribed) {
        try {
          const html = await render(
            WelcomeEmail({ firstName: input.firstName }),
          )
          const text = await render(
            WelcomeEmail({ firstName: input.firstName }),
            { plainText: true },
          )
          await resend.emails.send({
            from: EMAIL_FROM,
            to: email,
            subject: "Velkommen til Advanti",
            html,
            text,
          })
        } catch (e) {
          console.error("Welcome email failed for", email, e)
        }
      }
    } catch (e) {
      console.error("Resend pipeline threw:", e)
    }
  } else {
    console.warn(
      "subscribe(): Resend env unset — skipping audience + welcome; Discord + Supabase still fire.",
    )
  }

  // 2. Discord — when configured. notifyLead() already early-returns on
  //    missing DISCORD_WEBHOOK_URL and never throws.
  notifyLead({
    email,
    source: input.source,
    pageUrl: input.pageUrl,
    firstName: input.firstName,
    intake: input.intake,
    alreadySubscribed,
  }).catch((e) => console.error("Discord notify failed:", e))

  // 3. Supabase — when configured. recordSignup() routes high-intent
  //    signups into crm_leads + crm_activities, everything else into
  //    web_signups. Already non-blocking + env-gated internally.
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
