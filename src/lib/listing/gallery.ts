import "server-only"

import { getSupabase } from "@/lib/supabase/server"

/**
 * Listing gallery from the CRM Supabase projection (crm_property_listing_*),
 * populated by the CRM "Publiser til web" flow. Falls back to MDX in the page
 * when this returns null (no DB rows yet).
 *
 *   profiles (public_slug) ──▶ media (public_approved=true, opaque public URLs)
 *
 * SECURITY: service-role bypasses RLS, so every query MUST filter to published
 * rows. media.public_approved=true is the publish gate (only the publish action
 * ever inserts approved rows; unpublish deletes them). profile.cover_image is
 * likewise only set on publish.
 */

export interface ListingGalleryImage {
  src: string
  alt: string
}

export interface ListingGalleryResult {
  gallery: ListingGalleryImage[]
  cover: ListingGalleryImage | null
  photoCount: number
}

interface MediaRow {
  image_url: string
  alt: string | null
  is_cover: boolean
  sort_order: number | null
}
interface ProfileRow {
  cover_image: string | null
  cover_image_alt: string | null
  photo_count: number | null
}

/** Pure mapper — unit-tested in tests/unit/gallery.test.ts. */
export function mapMediaToGallery(
  rows: MediaRow[],
  profile: ProfileRow,
): ListingGalleryResult | null {
  if (rows.length === 0) return null
  const gallery = rows.map((r) => ({ src: r.image_url, alt: r.alt ?? "" }))
  const coverRow = rows.find((r) => r.is_cover) ?? rows[0]!
  const cover = profile.cover_image
    ? { src: profile.cover_image, alt: profile.cover_image_alt ?? "" }
    : { src: coverRow.image_url, alt: coverRow.alt ?? "" }
  return { gallery, cover, photoCount: profile.photo_count ?? rows.length }
}

export async function getListingGallery(
  slug: string,
): Promise<ListingGalleryResult | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data: profile } = await supabase
    .from("crm_property_listing_profiles")
    .select("id, cover_image, cover_image_alt, photo_count")
    .eq("public_slug", slug)
    .maybeSingle()
  if (!profile?.id) return null

  const { data: media } = await supabase
    .from("crm_property_listing_media")
    .select("image_url, alt, is_cover, sort_order")
    .eq("listing_profile_id", profile.id)
    .eq("public_approved", true)
    .order("is_cover", { ascending: false })
    .order("sort_order", { ascending: true })

  return mapMediaToGallery((media ?? []) as MediaRow[], profile as ProfileRow)
}

/** Batch cover lookup for the /eiendommer index cards (one query, not N). */
export async function getListingCovers(
  slugs: string[],
): Promise<Record<string, ListingGalleryImage>> {
  const supabase = getSupabase()
  if (!supabase || slugs.length === 0) return {}
  const { data } = await supabase
    .from("crm_property_listing_profiles")
    .select("public_slug, cover_image, cover_image_alt")
    .in("public_slug", slugs)
    .not("cover_image", "is", null)
  const map: Record<string, ListingGalleryImage> = {}
  for (const r of (data ?? []) as Array<{
    public_slug: string | null
    cover_image: string | null
    cover_image_alt: string | null
  }>) {
    if (r.public_slug && r.cover_image) {
      map[r.public_slug] = { src: r.cover_image, alt: r.cover_image_alt ?? "" }
    }
  }
  return map
}
