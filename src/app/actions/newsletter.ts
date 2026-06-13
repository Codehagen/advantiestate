"use server"

import { subscribe, type SubscribeSource } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"

// Form-state shape consumed by useFormState in NewsletterSignup. Lets the
// client component render the same surface for idle / success / error.
export type NewsletterFormState =
  | { status: "idle" }
  | { status: "success"; alreadySubscribed: boolean }
  | { status: "error"; message: string }

export async function subscribeNewsletter(
  _prev: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  if (!(await checkRateLimit("newsletter"))) {
    return { status: "error", message: "For mange forsøk. Prøv igjen om noen minutter." }
  }

  const email = String(formData.get("email") ?? "")
  const source = (String(formData.get("source") ?? "footer") as SubscribeSource)
  const pageUrl = String(formData.get("pageUrl") ?? "")
  const firstName = String(formData.get("firstName") ?? "") || undefined

  const result = await subscribe({
    email,
    source,
    pageUrl,
    firstName,
    marketingConsent: true,
  })

  if (!result.ok) return { status: "error", message: result.error }
  return { status: "success", alreadySubscribed: result.alreadySubscribed }
}
