/**
 * Canonical author registry for blog posts.
 *
 * Single source of truth for blog-author handle → display metadata.
 * Both src/app/(blog)/blog/(post)/[slug]/page.tsx and
 * src/app/api/og/blog/[slug]/route.tsx import from here.
 *
 * Adding a new blog author: add one entry below — no other file needs editing.
 */

export interface AuthorMeta {
  name: string;
  /** Short role line shown beneath the author name. */
  role: string;
  /**
   * CDN URL for the author portrait.
   * Exposed as `image` (blog page) and read as `image` in the OG route too.
   */
  image: string;
  /**
   * Slug of the matching /personer/[slug] profile page.
   * Present only when a public profile exists for this author.
   * Used to populate @id / url on the Article.author JSON-LD node so that
   * the blog authorship and the person page merge into the same entity.
   */
  personSlug?: string;
}

/** Map from blog-post `author` handle to display metadata. */
export const AUTHORS: Record<string, AuthorMeta> = {
  codehagen: {
    name: "Christer Hagen",
    role: "Partner · Advanti Estate",
    image:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/addc4b60-4c8f-47d7-10ab-6f9048432500/public",
    personSlug: "christer-hagen",
  },
  vsoraas: {
    name: "Vegard Søraas",
    role: "Partner · Advanti Estate",
    image:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/76037f97-384f-4681-176e-5b8a0ba71300/public",
    // No public /personer profile — intentionally omitted.
  },
};

/**
 * Returns the display name for a blog author handle.
 * Falls back to the raw handle string when not found
 * (covers guests, initials, legacy values, etc.).
 */
export function getAuthorName(handle: string): string {
  return AUTHORS[handle]?.name ?? handle;
}
