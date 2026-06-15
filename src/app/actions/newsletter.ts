"use server"

import { subscribe, type SubscribeSource } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"
import { newsletterSchema } from "@/lib/forms/schemas"

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

  const parsed = newsletterSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    source: String(formData.get("source") ?? ""),
    pageUrl: String(formData.get("pageUrl") ?? ""),
    firstName: String(formData.get("firstName") ?? ""),
  })
  if (!parsed.success) {
    return { status: "error", message: "Fyll inn en gyldig e-postadresse." }
  }

  const result = await subscribe({
    email: parsed.data.email,
    source: (parsed.data.source ?? "footer") as SubscribeSource,
    pageUrl: parsed.data.pageUrl ?? "",
    firstName: parsed.data.firstName,
    marketingConsent: true,
  })

  if (!result.ok) return { status: "error", message: result.error }
  return { status: "success", alreadySubscribed: result.alreadySubscribed }
}
