// Versioned market release register.
//
// Stores NUMERIC values per city — display strings are derived in
// marketData.ts via the fmt-helpers there. CSV, Dataset, OG-kort and the
// quarterly archive all read numeric values directly from this module.

export interface CityMetrics {
  id: string
  name: string
  lat: number
  lon: number
  /** Prime yield in percent, e.g. 6.35 */
  yieldPct: number
  /** Prime office rent in NOK/m², e.g. 2400 */
  leieKrM2: number
  /** Office vacancy in percent, e.g. 4.6 */
  vacPct: number
  note: string
}

export interface MarketRelease {
  /** Human-readable quarter label, e.g. "Q4 2025" */
  quarter: string
  /** URL-safe slug, e.g. "q4-2025" */
  slug: string
  /** ISO date of publication, e.g. "2026-01-15" */
  publishedAt: string
  cities: CityMetrics[]
  /** Transaction volume time series (optional metadata) */
  volume?: {
    years: string[]
    /** Total transaction volume in billion NOK per year */
    total: number[]
  }
}

// ---------------------------------------------------------------------------
// Q4 2025
// ---------------------------------------------------------------------------

const Q4_2025: MarketRelease = {
  quarter: "Q4 2025",
  slug: "q4-2025",
  publishedAt: "2026-01-15",
  cities: [
    {
      id: "bodo",
      name: "Bodø",
      lat: 67.28,
      lon: 14.4,
      yieldPct: 6.35,
      leieKrM2: 2400,
      vacPct: 4.6,
      note: "Hovedkontor for Advanti. Voksende logistikkhubb.",
    },
    {
      id: "tromso",
      name: "Tromsø",
      lat: 69.65,
      lon: 18.95,
      yieldPct: 6.10,
      leieKrM2: 2950,
      vacPct: 3.4,
      note: "Største kontormarkedet i Nord-Norge.",
    },
    {
      id: "alta",
      name: "Alta",
      lat: 69.97,
      lon: 23.27,
      yieldPct: 6.75,
      leieKrM2: 1950,
      vacPct: 6.2,
      note: "Sterkt handelsmarked i Finnmark.",
    },
    {
      id: "mo",
      name: "Mo i Rana",
      lat: 66.32,
      lon: 14.14,
      yieldPct: 6.80,
      leieKrM2: 1750,
      vacPct: 5.4,
      note: "Industri og logistikk. Stor industriutbygging.",
    },
    {
      id: "narvik",
      name: "Narvik",
      lat: 68.44,
      lon: 17.43,
      yieldPct: 6.90,
      leieKrM2: 1820,
      vacPct: 7.5,
      note: "Transport- og næringspark. Lavere likviditet.",
    },
    {
      id: "harstad",
      name: "Harstad",
      lat: 68.8,
      lon: 16.55,
      yieldPct: 6.55,
      leieKrM2: 1875,
      vacPct: 5.8,
      note: "Stabilt kontor- og handelsmarked.",
    },
  ],
  volume: {
    years: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
    total: [1.8, 2.4, 2.1, 3.6, 4.5, 3.2, 4.1, 4.8],
  },
}

// ---------------------------------------------------------------------------
// Registry — newest first
// ---------------------------------------------------------------------------

/** All published market releases, newest first. */
export const RELEASES: MarketRelease[] = [Q4_2025]

/** The most recently published release. */
export const LATEST_RELEASE: MarketRelease = RELEASES[0]

export function formatReleaseStamp(release: MarketRelease): string {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAI",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OKT",
    "NOV",
    "DES",
  ]
  const d = new Date(release.publishedAt)
  return `OPPDATERT ${d.getUTCDate()}. ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** Display stamp for the most recently published market release. */
export const LATEST_RELEASE_STAMP = formatReleaseStamp(LATEST_RELEASE)

/** Public promise for the next quarterly data release. */
export const NEXT_RELEASE_DATE = "15. juli 2026"

/**
 * Look up a release by slug (e.g. "q4-2025").
 * Returns `undefined` for unknown slugs — callers should call `notFound()`.
 */
export function getRelease(slug: string): MarketRelease | undefined {
  return RELEASES.find((r) => r.slug === slug)
}
