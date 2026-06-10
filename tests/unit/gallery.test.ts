import { describe, it, expect } from "vitest"
import { mapMediaToGallery } from "@/lib/listing/gallery"

const emptyProfile = {
  cover_image: null,
  cover_image_alt: null,
  photo_count: null,
}

describe("mapMediaToGallery", () => {
  it("returns null for empty rows", () => {
    expect(mapMediaToGallery([], emptyProfile)).toBeNull()
  })

  it("selects the is_cover row as cover and uses rows.length for photoCount", () => {
    const rows = [
      { image_url: "a", alt: null, is_cover: false, sort_order: 1 },
      { image_url: "b", alt: "B", is_cover: true, sort_order: 2 },
    ]
    const result = mapMediaToGallery(rows, emptyProfile)
    expect(result).not.toBeNull()
    expect(result!.cover!.src).toBe("b")
    expect(result!.photoCount).toBe(2)
    // alt for first gallery item (image_url "a") should fall back to ""
    expect(result!.gallery[0].alt).toBe("")
  })

  it("overrides cover with profile.cover_image when set", () => {
    const rows = [
      { image_url: "a", alt: null, is_cover: false, sort_order: 1 },
      { image_url: "b", alt: "B", is_cover: true, sort_order: 2 },
    ]
    const profile = {
      cover_image: "c",
      cover_image_alt: "C",
      photo_count: 7,
    }
    const result = mapMediaToGallery(rows, profile)
    expect(result).not.toBeNull()
    expect(result!.cover).toEqual({ src: "c", alt: "C" })
    expect(result!.photoCount).toBe(7)
  })

  it("falls back to first row when no is_cover row exists", () => {
    const rows = [
      { image_url: "first", alt: "First", is_cover: false, sort_order: 1 },
      { image_url: "second", alt: "Second", is_cover: false, sort_order: 2 },
    ]
    const result = mapMediaToGallery(rows, emptyProfile)
    expect(result).not.toBeNull()
    expect(result!.cover!.src).toBe("first")
  })
})
