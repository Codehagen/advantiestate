import "server-only"
import { getSupabase, isSupabaseConfigured } from "./server"
import type { SubscribeSource } from "@/lib/email/subscribe"

type InsertLeadArgs = {
  email: string
  source: SubscribeSource
  pageUrl?: string
  firstName?: string
  intake?: Record<string, string | number | undefined>
  /** Mirrors the Discord/Resend high-intent classification — set by the
   *  caller so the team can filter in Supabase the same way they filter
   *  in Discord. */
  highIntent?: boolean
  /** True when Resend reported the contact already existed. Useful for
   *  attributing repeat touchpoints to the same lead. */
  alreadySubscribed?: boolean
}

/**
 * Insert one row per signup event into the `leads` table.
 *
 * Non-blocking by contract: this function never throws. Supabase failures
 * log to the server console and the caller (subscribe()) continues to fire
 * Resend + Discord regardless — Resend remains the source of truth for the
 * subscriber list; Supabase is a downstream sink for CRM/analytics.
 *
 * Each call creates a new row. Querying "all touchpoints for this email"
 * is a SELECT WHERE email = X. Dedup happens at the report layer, not at
 * insert time — we want every touchpoint recorded.
 */
export async function insertLead(args: InsertLeadArgs): Promise<void> {
  if (!isSupabaseConfigured()) {
    // No-op when env unset — funnel still works (Resend + Discord) but
    // nothing lands in Supabase. Documented behaviour.
    return
  }

  const supabase = getSupabase()
  if (!supabase) return

  try {
    const { error } = await supabase.from("leads").insert({
      email: args.email.toLowerCase(),
      source: args.source,
      page_url: args.pageUrl ?? null,
      first_name: args.firstName ?? null,
      phone:
        typeof args.intake?.["Telefon"] === "string"
          ? (args.intake["Telefon"] as string)
          : null,
      notes:
        typeof args.intake?.["Beskjed"] === "string"
          ? (args.intake["Beskjed"] as string)
          : null,
      intake: args.intake ?? null,
      high_intent: args.highIntent ?? false,
      already_subscribed: args.alreadySubscribed ?? false,
    })
    if (error) {
      console.error("Supabase leads.insert error:", error)
    }
  } catch (e) {
    console.error("Supabase leads.insert threw:", e)
  }
}
