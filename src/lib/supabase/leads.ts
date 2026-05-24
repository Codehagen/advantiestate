import "server-only"
import { getSupabase, isSupabaseConfigured } from "./server"
import type { SubscribeSource } from "@/lib/email/subscribe"

type RecordSignupArgs = {
  email: string
  source: SubscribeSource
  pageUrl?: string
  firstName?: string
  intake?: Record<string, string | number | undefined>
  /** True when Resend reported the contact already existed. */
  alreadySubscribed?: boolean
}

// Sources that are sales-qualified and warrant a row in the curated CRM.
// Everything else lands in the lightweight web_signups table.
const HIGH_INTENT: SubscribeSource[] = ["verdivurdering-intake", "kontakt"]

// Visitor-facing Norwegian terms → crm_leads `property_type` enum values.
// The enum is: kontor, industri, lager, butikk, senter, tomt.
function mapPropertyType(value: string | undefined): string[] {
  if (!value) return []
  const v = value.toLowerCase()
  if (v.startsWith("kontor")) return ["kontor"]
  if (v.startsWith("handel")) return ["butikk"]
  if (v.startsWith("logistikk") || v.startsWith("lager")) return ["lager"]
  if (v.startsWith("kombinert")) return ["kontor", "lager"]
  // "Annet" / anything we don't recognise → empty array, not unknown.
  return []
}

function intakeString(
  intake: Record<string, string | number | undefined> | undefined,
  key: string,
): string | undefined {
  const v = intake?.[key]
  return typeof v === "string" && v.length > 0 ? v : undefined
}

const SOURCE_LABEL: Partial<Record<SubscribeSource, string>> = {
  "verdivurdering-intake": "Verdivurdering-intake (skjema)",
  kontakt: "Kontaktskjema",
}

/**
 * Route a signup to the right Supabase destination.
 *
 * - HIGH_INTENT sources (verdivurdering-intake, kontakt) → crm_leads +
 *   crm_activities (a `notat` entry linked to the new lead). These are
 *   sales-qualified rows the team's CRM tooling already understands.
 * - Everything else (newsletter, markedsrapport, sjekkliste, footer, blog,
 *   help, markedsinnsikt, service) → web_signups. Top-of-funnel only, kept
 *   out of the curated CRM so it stays clean.
 *
 * Non-blocking contract: never throws. Resend is still the source of truth
 * for "is this email on the newsletter list?"; Supabase is a downstream
 * sink. Failures log to the server console only.
 */
export async function recordSignup(args: RecordSignupArgs): Promise<void> {
  if (!isSupabaseConfigured()) return
  const supabase = getSupabase()
  if (!supabase) return

  const email = args.email.toLowerCase()
  const isHighIntent = HIGH_INTENT.includes(args.source)

  try {
    if (isHighIntent) {
      await insertCrmLead(supabase, { ...args, email })
    } else {
      await insertWebSignup(supabase, { ...args, email })
    }
  } catch (e) {
    console.error("Supabase recordSignup threw:", e)
  }
}

async function insertWebSignup(
  // Loosely typed because the @supabase/supabase-js generic is heavy and
  // we don't have generated types for this project yet.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  args: RecordSignupArgs,
): Promise<void> {
  const { error } = await supabase.from("web_signups").insert({
    email: args.email,
    first_name: args.firstName ?? null,
    source: args.source,
    page_url: args.pageUrl ?? null,
    intake: args.intake ?? null,
    already_subscribed: args.alreadySubscribed ?? false,
  })
  if (error) {
    console.error("Supabase web_signups.insert error:", error)
  }
}

async function insertCrmLead(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  args: RecordSignupArgs,
): Promise<void> {
  const intake = args.intake ?? {}
  const sourceLabel = SOURCE_LABEL[args.source] ?? args.source
  const pageRef = args.pageUrl ? ` fra ${args.pageUrl}` : ""

  // Build the lead row. Most fields default to NULL / empty array when the
  // intake didn't supply them; only firma_navn, kontakt_navn, kontakt_epost
  // are NOT NULL at the schema level.
  const leadRow = {
    firma_navn: intakeString(intake, "Bedrift") ?? "Ukjent (skjema-innsending)",
    kontakt_navn: args.firstName ?? "Ukjent",
    kontakt_epost: args.email,
    kontakt_telefon: intakeString(intake, "Telefon") ?? null,
    behov_type_eiendom: mapPropertyType(intakeString(intake, "Eiendomstype")),
    behov_geografi: intakeString(intake, "Sted")
      ? [intakeString(intake, "Sted")!]
      : [],
    tidshorisont: intakeString(intake, "Tidshorisont") ?? null,
    behov_beskrivelse: intakeString(intake, "Bakgrunn") ?? null,
    notater: intakeString(intake, "Beskjed") ?? null,
    kilde: `web: ${sourceLabel}${pageRef}`,
    status: "ny" as const,
    tags: ["web", args.source],
  }

  const { data, error } = await supabase
    .from("crm_leads")
    .insert(leadRow)
    .select("id")
    .single()

  if (error || !data) {
    console.error("Supabase crm_leads.insert error:", error)
    return
  }

  // Activity timeline entry so the lead shows up with context in the CRM's
  // activity feed instead of appearing as an empty new row.
  const summary = buildActivitySummary(args, intake)
  const { error: actErr } = await supabase.from("crm_activities").insert({
    type: "notat",
    beskrivelse: summary,
    relatert_til: data.id,
    relatert_type: "lead",
    utført_av: "system: advantiestate.no",
  })
  if (actErr) {
    console.error("Supabase crm_activities.insert error:", actErr)
  }
}

function buildActivitySummary(
  args: RecordSignupArgs,
  intake: Record<string, string | number | undefined>,
): string {
  const lines: string[] = []
  if (args.source === "verdivurdering-intake") {
    lines.push(
      "Lead bestilte verdivurdering via skjema på /tjenester/verdivurdering.",
    )
  } else if (args.source === "kontakt") {
    lines.push("Henvendelse via kontaktskjema.")
  } else {
    lines.push(`Web-skjemainnsending (${args.source}).`)
  }
  if (args.pageUrl) lines.push(`Side: ${args.pageUrl}`)
  if (args.firstName) lines.push(`Navn: ${args.firstName}`)
  for (const [k, v] of Object.entries(intake)) {
    if (v === undefined || v === "") continue
    lines.push(`${k}: ${v}`)
  }
  if (args.alreadySubscribed) {
    lines.push(
      "Hadde allerede en e-postoppføring i Resend (repeat touchpoint).",
    )
  }
  return lines.join("\n")
}
