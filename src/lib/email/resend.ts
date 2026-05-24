import "server-only"
import { Resend } from "resend"

// Singleton Resend client. Lazy-instantiated so that build-time module
// evaluation doesn't fail when RESEND_API_KEY is unset in CI / local without
// secrets.
let cached: Resend | null = null

export function getResend(): Resend {
  if (cached) return cached
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error(
      "RESEND_API_KEY is not set. See .env.example for the keys the funnel system needs.",
    )
  }
  cached = new Resend(key)
  return cached
}

export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Advanti Estate <hei@advantiestate.no>"

export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? ""
