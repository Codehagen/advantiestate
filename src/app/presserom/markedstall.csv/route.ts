// Stable CSV endpoint for the latest market release.
//
// URL contract: /presserom/markedstall.csv
// Referenced by the Dataset JSON-LD `distribution.contentUrl` and in llms.txt.
//
// Statically rendered at build time (force-static). The filename in
// Content-Disposition includes the release slug so downloaders get a
// descriptive filename even though the URL itself is version-agnostic.

import { LATEST_RELEASE } from "@/components/markedsinnsikt/marketReleases"
import { releaseToCsv } from "@/lib/presserom/csv"

export const dynamic = "force-static"

export function GET(): Response {
  const csv = releaseToCsv(LATEST_RELEASE)
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `inline; filename="advanti-estate-markedstall-${LATEST_RELEASE.slug}.csv"`,
    },
  })
}
