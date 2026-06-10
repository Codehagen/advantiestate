import { describe, it, expect } from "vitest"
import { mapProfileToListing, type ProfileRow } from "@/lib/listing/listings"

// Full ProfileRow fixture — null for everything not under test.
const baseRow: ProfileRow = {
  public_slug: "test-slug",
  website_status: null,
  website_type: null,
  type_label: null,
  city_slug: null,
  reference: null,
  title: "Test Property",
  title_head: "Test",
  title_tail: "Property",
  status_label: null,
  card_eyebrow: null,
  featured: null,
  featured_eyebrow: null,
  sort_order: null,
  published_at: null,
  listing_updated_at: null,
  cover_image: null,
  cover_image_alt: null,
  photo_count: null,
  summary: null,
  lede: null,
  body_mdx: null,
  bta_m2: null,
  prisantydning_nok: null,
  prisantydning_estimat: null,
  leie_kr_m2: null,
  yield_netto: null,
  yield_estimat: null,
  utleiegrad: null,
  wault: null,
  ferdig: null,
  brutto_leie_nok: null,
  eierkostnader_nok: null,
  noi_nok: null,
  financials_intro: null,
  tenants_note: null,
  location_title: null,
  location_title_tail: null,
  location_body: null,
  geo_lat: null,
  geo_lng: null,
  address: null,
  megler: null,
  facts: null,
  pois: null,
  downloads: null,
}

describe("mapProfileToListing", () => {
  it("converts NOK to mNOK for prisantydning", () => {
    const listing = mapProfileToListing({
      ...baseRow,
      prisantydning_nok: 25_000_000,
    })
    expect(listing.prisantydning).toBe(25)
  })

  it("returns undefined prisantydning when prisantydning_nok is null", () => {
    const listing = mapProfileToListing({ ...baseRow, prisantydning_nok: null })
    expect(listing.prisantydning).toBeUndefined()
  })

  it("defaults status to 'til-salgs' when website_status is null", () => {
    const listing = mapProfileToListing({ ...baseRow, website_status: null })
    expect(listing.status).toBe("til-salgs")
  })

  it("defaults order to 999 when sort_order is null", () => {
    const listing = mapProfileToListing({ ...baseRow, sort_order: null })
    expect(listing.order).toBe(999)
  })

  it("defaults city to 'bodo' when city_slug is null", () => {
    const listing = mapProfileToListing({ ...baseRow, city_slug: null })
    expect(listing.city).toBe("bodo")
  })

  it("always sets source to 'crm'", () => {
    const listing = mapProfileToListing(baseRow)
    expect(listing.source).toBe("crm")
  })

  it("uses deterministic placeholder cover when cover_image is null", () => {
    const first = mapProfileToListing({ ...baseRow, cover_image: null })
    const second = mapProfileToListing({ ...baseRow, cover_image: null })
    expect(first.coverImage).toBe(second.coverImage)
    expect(first.coverImage).toMatch(/^\/building\//)
  })

  it("includes geo when both geo_lat and geo_lng are present", () => {
    const listing = mapProfileToListing({
      ...baseRow,
      geo_lat: 67.28,
      geo_lng: 14.4,
      location_body: "x",
    })
    expect(listing.location?.geo).toEqual({ lat: 67.28, lng: 14.4 })
  })

  it("omits geo when geo_lat is null", () => {
    const listing = mapProfileToListing({
      ...baseRow,
      geo_lat: null,
      geo_lng: 14.4,
      location_body: "x",
    })
    expect(listing.location?.geo).toBeUndefined()
  })
})
