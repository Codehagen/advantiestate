import "server-only"

import { getSupabase } from "@/lib/supabase/server"

/**
 * Listing downloads from the CRM projection (crm_property_listing_downloads),
 * published via the CRM. Open PDFs use the redirect route as their href (raw
 * storage URLs are forbidden by the table CHECK constraint); NDA rows carry a
 * broker-set "request access" CTA target. Falls back to MDX in the page.
 *
 * SECURITY: service-role bypasses RLS, so filter to public_approved=true. Only
 * the publish action ever inserts approved rows; unpublish deletes them.
 */

export interface ListingDownload {
  label: string
  sub: string
  href: string
  kind: "pdf" | "nda"
}

interface DownloadRow {
  label: string
  description: string | null
  href: string | null
  requires_nda: boolean
}

export function mapDownloads(rows: DownloadRow[]): ListingDownload[] {
  return rows.map((r) => ({
    label: r.label,
    sub: r.description ?? "",
    href: r.href ?? "#",
    kind: r.requires_nda ? "nda" : "pdf",
  }))
}

export async function getListingDownloads(
  slug: string,
): Promise<ListingDownload[] | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data: profile } = await supabase
    .from("crm_property_listing_profiles")
    .select("id")
    .eq("public_slug", slug)
    .maybeSingle()
  if (!profile?.id) return null

  const { data } = await supabase
    .from("crm_property_listing_downloads")
    .select("label, description, href, requires_nda")
    .eq("listing_profile_id", profile.id)
    .eq("public_approved", true)
    .order("sort_order", { ascending: true })

  const rows = (data ?? []) as DownloadRow[]
  if (rows.length === 0) return null
  return mapDownloads(rows)
}
