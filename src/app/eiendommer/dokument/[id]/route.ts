import "server-only"

import { NextResponse } from "next/server"

import { getSupabase } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const PUBLIC_BUCKET = "listing-documents"

/**
 * Clean redirect for an open listing download. The CRM stores this route as the
 * download's href (raw storage URLs are forbidden in the table); here we look up
 * the row, verify it's a published open download, and 302 to the public Supabase
 * object. `noindex` keeps the prospekt PDF out of search results.
 *
 *   GET /eiendommer/dokument/<id>
 *     → row (public_approved=true, has storage_path) → 302 public URL + noindex
 *     → else 404
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = getSupabase()
  if (!supabase) return new NextResponse("Not available", { status: 503 })

  const { data } = await supabase
    .from("crm_property_listing_downloads")
    .select("storage_path, public_approved, requires_nda")
    .eq("id", id)
    .maybeSingle()

  const row = data as
    | { storage_path: string | null; public_approved: boolean; requires_nda: boolean }
    | null

  // Open, published downloads only — never NDA rows, never unapproved/missing.
  if (!row || !row.public_approved || row.requires_nda || !row.storage_path) {
    return new NextResponse("Not found", { status: 404 })
  }

  const base = (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "")
  if (!base) return new NextResponse("Not available", { status: 503 })
  const url = `${base}/storage/v1/object/public/${PUBLIC_BUCKET}/${row.storage_path}`

  return NextResponse.redirect(url, {
    status: 302,
    headers: {
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=300",
    },
  })
}
