"use server"

import { subscribe } from "@/lib/email/subscribe"

export type EiendomVarselFormState =
  | { status: "idle" }
  | { status: "success"; alreadySubscribed: boolean }
  | { status: "error"; message: string }

export async function subscribeEiendomVarsel(
  _prev: EiendomVarselFormState,
  formData: FormData,
): Promise<EiendomVarselFormState> {
  const email = String(formData.get("email") ?? "")
  const firstName =
    String(formData.get("firstName") ?? "").trim() || undefined
  const phone = String(formData.get("phone") ?? "").trim() || undefined
  const pageUrl = String(formData.get("pageUrl") ?? "")

  if (!email || !firstName) {
    return { status: "error", message: "Fyll inn navn og e-post." }
  }

  const intake = phone ? { Telefon: phone } : undefined

  const result = await subscribe({
    email,
    firstName,
    source: "eiendommer",
    pageUrl,
    intake,
  })

  if (!result.ok) return { status: "error", message: result.error }
  return { status: "success", alreadySubscribed: result.alreadySubscribed }
}
