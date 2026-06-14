/**
 * Canonical author registry for blog posts.
 *
 * Single source of truth for blog-author handle → display metadata.
 * Both src/app/(blog)/blog/(post)/[slug]/page.tsx and
 * src/app/api/og/blog/[slug]/route.tsx import from here.
 *
 * Adding a new blog author: add one entry below — no other file needs editing.
 */

import { allPersonPosts } from "content-collections";

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
      "https://kukzjreikqbgbolxvqaj.supabase.co/storage/v1/object/public/press/christer-hagen-web.jpg",
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

/** Resolved data for the editorial advisor/contact card. */
export interface AuthorCard {
  name: string;
  role: string;
  portrait: string;
  phone?: string;
  email?: string;
}

/**
 * Resolves a blog-author handle to the data the <Advisor> card needs.
 *
 * Server-only: reads the people collection so phone/email come from the
 * matching /personer profile when one exists (via `personSlug`). Authors
 * without a public profile (or unknown handles) still get a valid card from
 * the AUTHORS metadata — `portrait` always falls back to the author image —
 * and the card itself degrades to a "Kontakt oss" link when phone/email are
 * absent. Returns null only for a completely unknown handle.
 */
export function resolveAuthorCard(handle: string): AuthorCard | null {
  const meta = AUTHORS[handle];
  if (!meta) return null;
  const person = meta.personSlug
    ? allPersonPosts.find((p) => p.slug === meta.personSlug)
    : undefined;
  return {
    name: meta.name,
    // Use the canonical AUTHORS role (editorial " · " form) so the card matches
    // the byline above it — the people-collection `role` uses a hyphenated form
    // ("Partner - Næringsmegler") that breaks the design separator convention.
    role: meta.role,
    portrait: meta.image,
    phone: person?.phone,
    email: person?.email,
  };
}
