/**
 * Server-only navigation helpers — imports from content-collections.
 * Used by src/app/layout.tsx (server component) to derive the city list
 * that is passed as a prop into the <Nav> and <Footer> client/server
 * components respectively. Do NOT import this file in client components.
 */

import { allLocationPosts } from "content-collections";

export type CityLink = { name: string; slug: string };

/**
 * Returns all location pages sorted by the content-layer `order` field,
 * mapped to minimal { name, slug } objects safe to pass as serialised props.
 */
export function getCities(): CityLink[] {
  return [...allLocationPosts]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(({ name, slug }) => ({ name, slug }));
}
