"use server"

import { subscribe } from "@/lib/email/subscribe"
import { checkRateLimit } from "@/lib/rate-limit"

export type PressevarselFormState =
  | { status: "idle" }
  | { status: "success"; alreadySubscribed: boolean }
  | { status: "error"; message: string }

/**
 * TODO 19 — pressevarsel-påmelding fra /presserom.
 *
 * Lagrer journalisten som lead med source "presserom" (Resend-audience +
 * Discord-digest + Supabase, samme tre destinasjoner som øvrige skjemaer).
 * Selve kvartalsutsendelsen er et runbook-steg ved hvert release-slipp
 * (docs/presserom-kvartalsrunbook.md, FASE 7) — filtrer på source=presserom.
 */
export async function subscribePressevarsel(
  _prev: PressevarselFormState,
  formData: FormData,
): Promise<PressevarselFormState> {
  if (!(await checkRateLimit("pressevarsel"))) {
    return {
      status: "error",
      message: "For mange forsøk. Prøv igjen om noen minutter.",
    }
  }

  const email = String(formData.get("email") ?? "")
  const firstName = String(formData.get("firstName") ?? "").trim() || undefined
  const redaksjon = String(formData.get("redaksjon") ?? "").trim() || undefined
  const pageUrl = String(formData.get("pageUrl") ?? "")

  if (!email || !firstName) {
    return { status: "error", message: "Fyll inn navn og e-post." }
  }

  const result = await subscribe({
    email,
    firstName,
    source: "presserom",
    pageUrl,
    intake: redaksjon ? { Redaksjon: redaksjon } : undefined,
  })

  if (!result.ok) return { status: "error", message: result.error }
  return { status: "success", alreadySubscribed: result.alreadySubscribed }
}
