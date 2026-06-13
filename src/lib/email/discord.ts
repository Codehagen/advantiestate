import "server-only"
import type { SubscribeSource } from "./subscribe"

const WEBHOOK = process.env.DISCORD_WEBHOOK_URL

const SOURCE_LABEL: Record<SubscribeSource, string> = {
  footer: "Footer newsletter",
  blog: "Blog footer",
  help: "Kunnskapsbase footer",
  markedsinnsikt: "Markedsinnsikt",
  analyseportal: "Analyseportal (datainteressert!)",
  service: "Tjeneste-side",
  "sjekkliste-verdivurdering": "Sjekkliste-PDF (verdivurdering)",
  markedsrapport: "Markedsrapport (lead magnet)",
  "verdivurdering-intake": "Verdivurdering-intake (HØY INTENT)",
  kontakt: "Kontakt-skjema",
  eiendommer: "Eiendommer (varsel om nye oppdrag)",
  presserom: "Presserom (pressevarsel — journalist!)",
  investorportal: "Investorportal (kvalifisert kjøper!)",
  naringsmegler: "Næringsmegler bysider (HØY INTENT — lokal selger!)",
}

// Pages that match a hard-intent signal get a high-priority colour stripe in
// Discord so they jump out of the digest. Marketing-funnel signups are
// brand-neutral; intake forms are light-blue.
const HIGH_INTENT: SubscribeSource[] = [
  "verdivurdering-intake",
  "kontakt",
  "eiendommer",
  "investorportal",
  "naringsmegler",
]
const WARM_GREY = 0x2c2825
const LIGHT_BLUE = 0xcbeef2

type Args = {
  email: string
  source: SubscribeSource
  pageUrl?: string
  firstName?: string
  intake?: Record<string, string | number | undefined>
  alreadySubscribed?: boolean
}

export async function notifyLead(args: Args): Promise<boolean> {
  if (!WEBHOOK) {
    console.error("DISCORD_WEBHOOK_URL not set; skipping team notification.")
    return false
  }

  const timestamp = new Date().toLocaleString("no-NO", {
    timeZone: "Europe/Oslo",
    dateStyle: "long",
    timeStyle: "short",
  })

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    { name: "📧 E-post", value: args.email, inline: false },
    {
      name: "🎯 Kilde",
      value: SOURCE_LABEL[args.source] ?? args.source,
      inline: true,
    },
    { name: "🕐 Tidspunkt", value: timestamp, inline: true },
  ]
  if (args.firstName) {
    fields.push({ name: "👤 Navn", value: args.firstName, inline: true })
  }
  if (args.pageUrl) {
    fields.push({ name: "🔗 Side", value: args.pageUrl, inline: false })
  }
  if (args.alreadySubscribed) {
    fields.push({
      name: "ℹ️ Repeat signup",
      value: "Allerede på listen — ny touchpoint registrert.",
      inline: false,
    })
  }
  if (args.intake) {
    const intakeFields = Object.entries(args.intake)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `**${k}:** ${v}`)
      .join("\n")
    if (intakeFields) {
      fields.push({
        name: "📝 Intake-data",
        value: intakeFields,
        inline: false,
      })
    }
  }

  const isHighIntent = HIGH_INTENT.includes(args.source)
  const title = isHighIntent ? "🔥 Ny lead — høy intent" : "📩 Ny abonnent"

  const body = {
    embeds: [
      {
        title,
        color: isHighIntent ? LIGHT_BLUE : WARM_GREY,
        fields,
        footer: { text: "Advanti funnel" },
        timestamp: new Date().toISOString(),
      },
    ],
  }

  const r = await fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    console.error("Discord webhook failed:", await r.text())
    return false
  }
  return true
}
