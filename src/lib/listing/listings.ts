import "server-only"

import { cache } from "react"

import { getActiveListings, getListingPost } from "@/lib/content"
import { getSupabase } from "@/lib/supabase/server"

/**
 * Unified listing source for the public /eiendommer pages.
 *
 * Source of truth is the CRM Supabase projection
 * (crm_property_listing_profiles), populated by the CRM "Website listing"
 * authoring + "Publiser til web" flow. A profile is only public when
 * is_public_ready = true (the service-role client bypasses RLS, so EVERY query
 * here MUST keep that filter — see lib/listing/gallery.ts).
 *
 * MDX listings (src/content/listings) remain a fallback for any slug not yet
 * published from the CRM. When the CRM publishes a slug that also exists as
 * MDX, the CRM row wins.
 *
 * Numeric prices are stored in NOK in the DB (prisantydning_nok) but the UI
 * works in mnok, matching the MDX `prisantydning` field — convert on read.
 */

export interface ListingMegler {
  name: string
  role: string
  avatar: string
  email: string
  phone: string
  slug?: string
}

export interface ListingTenant {
  name: string
  sector: string
  etasjer: string
  areal: number
  leieKrM2?: number
  leieArlig: number
  leieArligEstimat: boolean
  kontraktTil?: string
  andel: number
  ledig: boolean
}

export interface Listing {
  source: "crm" | "mdx"
  slug: string

  title: string
  titleHead: string
  titleTail: string

  status: string
  statusLabel?: string
  type: string
  typeLabel: string
  city: string

  address: string
  reference: string
  cardEyebrow: string
  featured: boolean
  featuredEyebrow?: string
  order: number
  publishedAt: string
  updatedAt?: string

  bta: number
  prisantydning?: number
  prisantydningEstimat: boolean
  leieKrM2?: number // asking rent NOK/m²/year — shown instead of price for "til-leie"
  yieldNetto?: number
  yieldEstimat: boolean
  utleiegrad?: number
  wault?: number
  ferdig?: string

  coverImage: string
  coverImageAlt: string
  photoCount?: number
  gallery?: { src: string; alt: string }[]

  summary: string
  lede?: string

  megler?: ListingMegler

  facts?: { label: string; value: string }[]
  tenants?: ListingTenant[]
  tenantsNote?: string
  financials?: {
    bruttoLeie: number
    eierkostnader: number
    noi: number
    yieldNetto: number
    intro?: string
  }
  location?: {
    title: string
    titleTail: string
    body: string
    geo?: { lat: number; lng: number }
    pois: { name: string; distance: string }[]
  }
  downloads?: { label: string; sub: string; kind: "pdf" | "nda"; href: string }[]

  /** Compiled MDX code (MDX listings only). */
  mdx?: string
  /** Raw prose body (CRM listings only) — rendered by ListingProse. */
  body?: string
}

// Editorial placeholder covers for CRM listings published without photos yet.
// Deterministic per slug so a given listing keeps the same placeholder.
const PLACEHOLDER_COVERS = [
  "/building/pexels-abshky-18566965.jpg",
  "/building/pexels-abshky-18567185.jpg",
  "/building/pexels-balconies-4353068.jpg",
  "/building/munster-lvm-building.jpg",
]

function placeholderFor(slug: string): string {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0
  return PLACEHOLDER_COVERS[Math.abs(hash) % PLACEHOLDER_COVERS.length]!
}

function nok(value: number | null | undefined): number | undefined {
  return value === null || value === undefined ? undefined : value / 1_000_000
}

type MdxListing = ReturnType<typeof getActiveListings>[number]

function mapMdxToListing(post: MdxListing): Listing {
  return {
    source: "mdx",
    slug: post.slug,
    title: post.title,
    titleHead: post.titleHead,
    titleTail: post.titleTail,
    status: post.status,
    statusLabel: post.statusLabel,
    type: post.type,
    typeLabel: post.typeLabel,
    city: post.city,
    address: post.address,
    reference: post.reference,
    cardEyebrow: post.cardEyebrow,
    featured: post.featured ?? false,
    featuredEyebrow: post.featuredEyebrow,
    order: post.order,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    bta: post.bta,
    prisantydning: post.prisantydning,
    prisantydningEstimat: post.prisantydningEstimat ?? false,
    yieldNetto: post.yieldNetto,
    yieldEstimat: post.yieldEstimat ?? false,
    utleiegrad: post.utleiegrad,
    wault: post.wault,
    ferdig: post.ferdig,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    photoCount: post.photoCount,
    gallery: post.gallery,
    summary: post.summary,
    lede: post.lede,
    megler: post.megler,
    facts: post.facts,
    tenants: post.tenants,
    tenantsNote: post.tenantsNote,
    financials: post.financials,
    location: post.location,
    downloads: post.downloads,
    mdx: post.mdx,
  }
}

// Shape of the columns we read from crm_property_listing_profiles.
interface ProfileRow {
  public_slug: string
  website_status: string | null
  website_type: string | null
  type_label: string | null
  city_slug: string | null
  reference: string | null
  title: string | null
  title_head: string | null
  title_tail: string | null
  status_label: string | null
  card_eyebrow: string | null
  featured: boolean | null
  featured_eyebrow: string | null
  sort_order: number | null
  published_at: string | null
  listing_updated_at: string | null
  cover_image: string | null
  cover_image_alt: string | null
  photo_count: number | null
  summary: string | null
  lede: string | null
  body_mdx: string | null
  bta_m2: number | null
  prisantydning_nok: number | null
  prisantydning_estimat: boolean | null
  leie_kr_m2: number | null
  yield_netto: number | null
  yield_estimat: boolean | null
  utleiegrad: number | null
  wault: number | null
  ferdig: string | null
  brutto_leie_nok: number | null
  eierkostnader_nok: number | null
  noi_nok: number | null
  financials_intro: string | null
  tenants_note: string | null
  location_title: string | null
  location_title_tail: string | null
  location_body: string | null
  geo_lat: number | null
  geo_lng: number | null
  address: string | null
  megler: ListingMegler | null
  facts: { label: string; value: string }[] | null
  pois: { name: string; distance: string }[] | null
  downloads: { label: string; sub: string; kind: "pdf" | "nda"; href: string }[] | null
}

const PROFILE_COLUMNS = [
  "public_slug",
  "website_status",
  "website_type",
  "type_label",
  "city_slug",
  "reference",
  "title",
  "title_head",
  "title_tail",
  "status_label",
  "card_eyebrow",
  "featured",
  "featured_eyebrow",
  "sort_order",
  "published_at",
  "listing_updated_at",
  "cover_image",
  "cover_image_alt",
  "photo_count",
  "summary",
  "lede",
  "body_mdx",
  "bta_m2",
  "prisantydning_nok",
  "prisantydning_estimat",
  "leie_kr_m2",
  "yield_netto",
  "yield_estimat",
  "utleiegrad",
  "wault",
  "ferdig",
  "brutto_leie_nok",
  "eierkostnader_nok",
  "noi_nok",
  "financials_intro",
  "tenants_note",
  "location_title",
  "location_title_tail",
  "location_body",
  "geo_lat",
  "geo_lng",
  "address",
  "megler",
  "facts",
  "pois",
  "downloads",
].join(", ")

function mapProfileToListing(row: ProfileRow): Listing {
  const slug = row.public_slug
  const titleHead = row.title_head ?? row.title ?? slug
  const titleTail = row.title_tail ?? ""
  const financials =
    row.noi_nok !== null || row.brutto_leie_nok !== null
      ? {
          bruttoLeie: nok(row.brutto_leie_nok) ?? 0,
          eierkostnader: nok(row.eierkostnader_nok) ?? 0,
          noi: nok(row.noi_nok) ?? 0,
          yieldNetto: row.yield_netto ?? 0,
          intro: row.financials_intro ?? undefined,
        }
      : undefined
  const location = row.location_body
    ? {
        title: row.location_title ?? "Beliggenhet",
        titleTail: row.location_title_tail ?? "",
        body: row.location_body,
        geo:
          row.geo_lat !== null && row.geo_lng !== null
            ? { lat: row.geo_lat, lng: row.geo_lng }
            : undefined,
        pois: row.pois ?? [],
      }
    : undefined

  return {
    source: "crm",
    slug,
    title: row.title ?? `${titleHead} ${titleTail}`.trim(),
    titleHead,
    titleTail,
    status: row.website_status ?? "til-salgs",
    statusLabel: row.status_label ?? undefined,
    type: row.website_type ?? "kontor",
    typeLabel: row.type_label ?? "Næringseiendom",
    city: row.city_slug ?? "bodo",
    address: row.address ?? "",
    reference: row.reference ?? "",
    cardEyebrow: row.card_eyebrow ?? row.type_label ?? "Næringseiendom",
    featured: row.featured ?? false,
    featuredEyebrow: row.featured_eyebrow ?? undefined,
    order: row.sort_order ?? 999,
    publishedAt: row.published_at ?? new Date().toISOString().slice(0, 10),
    updatedAt: row.listing_updated_at ?? undefined,
    bta: row.bta_m2 ?? 0,
    prisantydning: nok(row.prisantydning_nok),
    prisantydningEstimat: row.prisantydning_estimat ?? false,
    leieKrM2: row.leie_kr_m2 ?? undefined,
    yieldNetto: row.yield_netto ?? undefined,
    yieldEstimat: row.yield_estimat ?? false,
    utleiegrad: row.utleiegrad ?? undefined,
    wault: row.wault ?? undefined,
    ferdig: row.ferdig ?? undefined,
    coverImage: row.cover_image ?? placeholderFor(slug),
    coverImageAlt: row.cover_image_alt ?? `${titleHead} ${titleTail}`.trim(),
    photoCount: row.photo_count ?? undefined,
    summary: row.summary ?? "",
    lede: row.lede ?? undefined,
    megler: row.megler ?? undefined,
    facts: row.facts ?? undefined,
    tenantsNote: row.tenants_note ?? undefined,
    financials,
    location,
    downloads: row.downloads ?? undefined,
    body: row.body_mdx ?? undefined,
  }
}

async function fetchPublishedProfiles(): Promise<Listing[]> {
  const supabase = getSupabase()
  if (!supabase) return []
  const { data, error } = await supabase
    .from("crm_property_listing_profiles")
    .select(PROFILE_COLUMNS)
    .eq("is_public_ready", true)
    .not("public_slug", "is", null)
    .order("sort_order", { ascending: true, nullsFirst: false })
  if (error) {
    console.error("[listings] failed to load published profiles:", error.message)
    return []
  }
  return ((data ?? []) as unknown as ProfileRow[]).map(mapProfileToListing)
}

/**
 * All public listings: CRM-published profiles first (source of truth), then
 * any MDX listing whose slug has not been published from the CRM.
 */
export const getListings = cache(async (): Promise<Listing[]> => {
  const profiles = await fetchPublishedProfiles()
  const publishedSlugs = new Set(profiles.map((p) => p.slug))
  const mdx = getActiveListings()
    .filter((post) => !publishedSlugs.has(post.slug))
    .map(mapMdxToListing)
  return [...profiles, ...mdx].sort((a, b) => a.order - b.order)
})

/** A single listing by slug — CRM profile wins, MDX is the fallback. */
export const getListing = cache(async (slug: string): Promise<Listing | null> => {
  const supabase = getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from("crm_property_listing_profiles")
      .select(PROFILE_COLUMNS)
      .eq("is_public_ready", true)
      .eq("public_slug", slug)
      .maybeSingle()
    if (error) {
      console.error(`[listings] failed to load profile ${slug}:`, error.message)
    } else if (data) {
      return mapProfileToListing(data as unknown as ProfileRow)
    }
  }
  const post = getListingPost(slug)
  return post ? mapMdxToListing(post) : null
})
