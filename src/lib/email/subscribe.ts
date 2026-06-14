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
  | "analyseportal"
  | "service"
  | "service-modal"
  | "sjekkliste-verdivurdering"
  | "markedsrapport"
  | "verdivurdering-intake"
  | "eiernotat"
  | "kontakt"
  | "eiendommer"
  | "presserom"
  | "investorportal"
  | "naringsmegler"

export type SubscribeInput = {
  email: string
  source: SubscribeSource
  /** Page URL the visitor was on when they signed up. Used in Discord digest. */
  pageUrl?: string
  /** Optional first name from intake forms. */
  firstName?: string
  /** Optional structured intake context (verdivurdering form, etc). */
  intake?: Record<string, string | number | undefined>
  /**
   * Explicit consent to add the address to the marketing/newsletter audience
   * and send the newsletter welcome email. Sales-intake forms are lead
   * requests, not newsletter opt-ins.
   */
  marketingConsent?: boolean
}

export type SubscribeResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const RESEND_CONFIGURED = () =>
  Boolean(AUDIENCE_ID && process.env.RESEND_API_KEY)

const HIGH_INTENT: SubscribeSource[] = [
  "verdivurdering-intake",
  "eiernotat",
  "service-modal",
  "kontakt",
  "eiendommer",
  "investorportal",
  "naringsmegler",
]

type DestinationResult = {
  destination: "resend" | "discord" | "supabase"
  configured: boolean
  ok: boolean
}

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

  const wantsMarketing = input.marketingConsent === true

  // If literally nothing relevant is configured, fail loudly so we don't ghost
  // the visitor with a "success" that wrote to nothing. Resend only counts as
  // relevant when this specific form has marketing consent.
  const anyConfigured =
    (wantsMarketing && RESEND_CONFIGURED()) ||
    Boolean(process.env.DISCORD_WEBHOOK_URL) ||
    Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!anyConfigured) {
    console.error(
      "subscribe(): no destinations configured (Resend, Discord, Supabase all unset).",
    )
    return { ok: false, error: "Tjenesten er midlertidig utilgjengelig." }
  }

  const results: DestinationResult[] = []

  // 1. Resend — only for explicit marketing consent. Detects repeat signups
  //    so we don't double-fire the welcome email. Sales-intake forms still use
  //    Discord/Supabase, but do not enter the newsletter audience by default.
  let alreadySubscribed = false
  if (wantsMarketing && RESEND_CONFIGURED()) {
    let resendOk = false
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
          resendOk = true
        } else {
          console.error("Resend contacts.create error:", created.error)
          // Don't bail — Supabase + Discord should still fire.
        }
      } else {
        resendOk = true
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
    } finally {
      results.push({
        destination: "resend",
        configured: true,
        ok: resendOk,
      })
    }
  } else if (wantsMarketing) {
    console.warn(
      "subscribe(): Resend env unset — skipping audience + welcome; Discord + Supabase still fire.",
    )
    results.push({
      destination: "resend",
      configured: false,
      ok: false,
    })
  }

  // 2 + 3. Discord + Supabase — both must AWAIT, in parallel. Earlier
  // versions used .catch() fire-and-forget, which Vercel's serverless
  // runtime silently truncates the moment the function returns. Symptom
  // before the fix: one-write paths (web_signups) sometimes landed, the
  // two-write path (crm_leads + crm_activities) usually got cut off
  // mid-flight with no error log. Promise.all so the function waits for
  // both to settle, .catch() inside so a failure in one doesn't poison
  // the other or the response.
  const [discordOk, supabaseOk] = await Promise.all([
    notifyLead({
      email,
      source: input.source,
      pageUrl: input.pageUrl,
      firstName: input.firstName,
      intake: input.intake,
      alreadySubscribed,
    }).catch((e) => {
      console.error("Discord notify failed:", e)
      return false
    }),
    recordSignup({
      email,
      source: input.source,
      pageUrl: input.pageUrl,
      firstName: input.firstName,
      intake: input.intake,
      alreadySubscribed,
    }).catch((e) => {
      console.error("Supabase recordSignup failed:", e)
      return false
    }),
  ])
  results.push(
    {
      destination: "discord",
      configured: Boolean(process.env.DISCORD_WEBHOOK_URL),
      ok: discordOk,
    },
    {
      destination: "supabase",
      configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      ok: supabaseOk,
    },
  )

  const configuredResults = results.filter((r) => r.configured)
  const hasSuccessfulDestination = configuredResults.some((r) => r.ok)
  if (!hasSuccessfulDestination) {
    console.error(
      `subscribe(): all configured destinations failed for source "${input.source}".`,
    )
    return { ok: false, error: "Tjenesten er midlertidig utilgjengelig." }
  }

  if (HIGH_INTENT.includes(input.source)) {
    const durableOk = results.some(
      (r) => r.ok && (r.destination === "supabase" || r.destination === "discord"),
    )
    if (!durableOk) {
      console.error(
        `subscribe(): high-intent lead had no durable destination for source "${input.source}".`,
      )
      return { ok: false, error: "Tjenesten er midlertidig utilgjengelig." }
    }
  }

  return { ok: true, alreadySubscribed }
}
