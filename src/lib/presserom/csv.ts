// Pure CSV serialiser for market releases.
//
// No runtime imports beyond types — kept pure so it can be unit-tested
// in-process without any Next.js / browser globals.
import type { MarketRelease } from "@/components/markedsinnsikt/marketReleases"

/**
 * Serialise a market release to a UTF-8 CSV string.
 *
 * Format:
 *   - Starts with a UTF-8 BOM (U+FEFF) so Norwegian Excel opens correctly
 *     on double-click.
 *   - Semicolon-separated (Norwegian locale convention).
 *   - Norwegian header row.
 *   - One data row per city; numeric columns use dot as decimal separator
 *     (machine-readable).
 *   - No trailing source/comment rows.
 *
 * Columns: by ; prime_yield_pct ; markedsleie_kr_m2 ; kontorledighet_pct
 */
export function releaseToCsv(release: MarketRelease): string {
  const BOM = "﻿"
  const SEP = ";"
  const NL = "\r\n"

  const header = ["by", "prime_yield_pct", "markedsleie_kr_m2", "kontorledighet_pct"].join(SEP)

  const rows = release.cities.map((c) =>
    [c.name, c.yieldPct, c.leieKrM2, c.vacPct].join(SEP)
  )

  return BOM + [header, ...rows].join(NL) + NL
}
