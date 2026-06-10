// Frozen CSV endpoint for a specific quarterly archive.
//
// URL contract: /presserom/arkiv/[kvartal]/data.csv
// Statically rendered at build time per release slug.

import { notFound } from "next/navigation"
import { RELEASES, getRelease } from "@/components/markedsinnsikt/marketReleases"
import { releaseToCsv } from "@/lib/presserom/csv"

export const dynamic = "force-static"

export function generateStaticParams() {
  return RELEASES.map((r) => ({ kvartal: r.slug }))
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kvartal: string }> },
): Promise<Response> {
  const { kvartal } = await params
  const release = getRelease(kvartal)
  if (!release) notFound()

  const csv = releaseToCsv(release)
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `inline; filename="advanti-estate-markedstall-${release.slug}.csv"`,
    },
  })
}
