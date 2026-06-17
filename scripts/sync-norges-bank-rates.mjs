// Norges Bank rate sync — quarterly helper for the analyseportal.
//
// Prints the latest Norges Bank rate levels and compares them to the rate
// endpoints currently baked into the portal's static data (marketData.ts RATES
// + portalSeries.ts MAKRO/PORTAL_RATES), so the rate numbers for the quarterly
// update come from the source instead of a manual lookup.
//
//   pnpm rates:sync
//
// Source: prefers Supabase crm_market_rate_curve (the app's stored copy) when
// SUPABASE_SERVICE_ROLE_KEY is set; otherwise reads data.norges-bank.no directly
// (public, no auth — the same source that feeds Supabase). So it runs anywhere,
// including CI/cron, with zero secret management.
//
// Mapping (Norges Bank publishes government bonds + policy rate, NOT swaps):
//   styringsrente  → MAKRO.styringsrente / PORTAL_RATES.styringsrente
//   govbond_10y    → RATES.gov10y ("10 år stat")
//   govbond_5y     → RATES.swap5y ("5 års SWAP" — proxied by the 5Y gov yield;
//                    a true swap rate sits ~20–40 bps above).

import { readFileSync } from "node:fs"

const round2 = (v) => Math.round(Number(v) * 100) / 100
const fmt = (v) => `${Number(v).toFixed(2).replace(".", ",")} %`

function loadEnv() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
    }
  } catch {
    /* no .env.local */
  }
}

// ── Source A: Supabase (preferred when a service key is available) ──────────
async function fromSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const { createClient } = await import("@supabase/supabase-js")
  const sb = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await sb
    .from("crm_market_rate_curve")
    .select("observation_date, instrument, value_pct")
    .in("instrument", ["styringsrente", "govbond_5y", "govbond_10y"])
    .order("observation_date", { ascending: false })
    .limit(90)
  if (error || !data?.length) return null
  const latest = {}
  for (const r of data) if (!latest[r.instrument]) latest[r.instrument] = r
  if (!latest.styringsrente || !latest.govbond_5y || !latest.govbond_10y) return null
  return {
    source: "Supabase crm_market_rate_curve",
    date: latest.govbond_10y.observation_date,
    styringsrente: +latest.styringsrente.value_pct,
    govbond_5y: +latest.govbond_5y.value_pct,
    govbond_10y: +latest.govbond_10y.value_pct,
  }
}

// ── Source B: Norges Bank API direct (public, no auth) ──────────────────────
function parseCsv(csv) {
  const lines = csv.trim().split("\n")
  const head = lines[0].split(";")
  return lines.slice(1).map((l) => {
    const cells = l.split(";")
    const o = {}
    head.forEach((h, i) => (o[h] = cells[i]))
    return o
  })
}
async function fromNorgesBank() {
  const [govCsv, irCsv] = await Promise.all([
    fetch("https://data.norges-bank.no/api/data/GOVT_GENERIC_RATES/?lastNObservations=1&format=csv").then((r) => r.text()),
    fetch("https://data.norges-bank.no/api/data/IR/?lastNObservations=1&format=csv").then((r) => r.text()),
  ])
  const gov = parseCsv(govCsv)
  const latestBy = (rows) => rows.sort((a, b) => (a.TIME_PERIOD < b.TIME_PERIOD ? 1 : -1))[0]
  const g5 = latestBy(gov.filter((r) => r.FREQ === "B" && r.TENOR === "5Y" && r.INSTRUMENT_TYPE === "GBON"))
  const g10 = latestBy(gov.filter((r) => r.FREQ === "B" && r.TENOR === "10Y" && r.INSTRUMENT_TYPE === "GBON"))
  const ir = parseCsv(irCsv)
  const sr = latestBy(ir.filter((r) => r.FREQ === "B" && r.INSTRUMENT_TYPE === "KPRA" && r.TENOR === "SD"))
  if (!g5 || !g10 || !sr) throw new Error("Uventet svar fra Norges Bank API")
  return {
    source: "data.norges-bank.no (direkte)",
    date: g10.TIME_PERIOD,
    styringsrente: +sr.OBS_VALUE,
    govbond_5y: +g5.OBS_VALUE,
    govbond_10y: +g10.OBS_VALUE,
  }
}

// ── current portal endpoints (last element of the static series) ────────────
function lastInArray(src, name) {
  const m = src.match(new RegExp(`${name}:\\s*\\[([^\\]]*)\\]`))
  if (!m) return null
  const nums = m[1].split(",").map((s) => s.trim()).filter(Boolean)
  return Number(nums[nums.length - 1])
}

// ── main ────────────────────────────────────────────────────────────────────
loadEnv()
let nb
try {
  nb = (await fromSupabase()) ?? (await fromNorgesBank())
} catch (e) {
  console.error("✗ Klarte ikke hente renter:", e.message)
  process.exit(1)
}

const marketData = readFileSync("src/components/markedsinnsikt/marketData.ts", "utf8")
const portalSeries = readFileSync("src/components/markedsinnsikt/portalSeries.ts", "utf8")
const portal = {
  styringsrente: lastInArray(portalSeries, "styringsrente"),
  swap5y: lastInArray(marketData, "swap5y"),
  gov10y: lastInArray(marketData, "gov10y"),
}

const rows = [
  { label: "Styringsrente", nb: nb.styringsrente, key: "styringsrente", field: "MAKRO/PORTAL_RATES.styringsrente" },
  { label: "5 år (gov → «SWAP»)", nb: nb.govbond_5y, key: "swap5y", field: "RATES.swap5y" },
  { label: "10 år stat", nb: nb.govbond_10y, key: "gov10y", field: "RATES.gov10y" },
]

console.log(`\nNorges Bank renter — kilde: ${nb.source}`)
console.log(`Observasjonsdato: ${nb.date}\n`)
console.log("Instrument               Norges Bank   Portal (nå)      Avvik   → felt")
console.log("─".repeat(84))
let drift = false
for (const r of rows) {
  const v = round2(r.nb)
  const p = portal[r.key]
  const delta = p == null ? null : round2(v - p)
  if (delta !== null && Math.abs(delta) >= 0.05) drift = true
  const ds = delta == null ? "  ?" : `${delta > 0 ? "+" : ""}${delta.toFixed(2).replace(".", ",")}`
  console.log(`${r.label.padEnd(24)} ${fmt(v).padStart(11)} ${(p == null ? "—" : fmt(p)).padStart(13)} ${ds.padStart(10)}   ${r.field}`)
}
console.log("─".repeat(84))
console.log(
  drift
    ? "\n→ Avvik ≥ 0,05 pp. Sett disse som siste element i seriene ved neste kvartalsoppdatering."
    : "\n✓ Portalen er på linje med siste Norges Bank-observasjon.",
)
console.log(
  "\nMerk: Norges Bank publiserer ikke swap-rente. «5 års SWAP» speiles av 5-års\n" +
    "statsobligasjon (govbond_5y); en ekte swap ligger typisk 20–40 bps over.\n",
)
