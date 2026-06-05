"use client";

import { useState, type ReactNode } from "react";

import { ListingLightbox, type LightboxImage } from "./ListingLightbox";

/*
 * Client wrapper around the server-rendered .ed-gallery grid.
 *
 *   page.tsx (server) renders the tiles as {children} — markup + the priority
 *   hero image stay server-side. This wrapper adds interaction with ONE delegated
 *   click handler: each tile carries data-gallery-index, so a click anywhere in a
 *   tile (image, status badge, "+N bilder" overlay, or the focusable trigger
 *   button) resolves to its index and opens the lightbox there.
 *
 *   `images` is the full gallery (up to 18), so the viewer browses every photo —
 *   not just the 3 visible tiles.
 *
 * Uses display:contents (see .ed-gallery-interactive) so the wrapper adds no box
 * to the layout. The lightbox renders through a Radix portal, so clicks inside it
 * never bubble back to this delegated handler.
 */
export function GalleryLightbox({
  images,
  children,
}: {
  images: LightboxImage[];
  children: ReactNode;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const trigger = (e.target as HTMLElement).closest("[data-gallery-index]");
    if (!trigger) return;
    const i = Number(trigger.getAttribute("data-gallery-index"));
    if (!Number.isFinite(i)) return;
    setOpenIndex(i >= 0 && i < images.length ? i : 0);
  };

  return (
    <div className="ed-gallery-interactive" onClick={handleClick}>
      {children}
      {openIndex !== null && (
        <ListingLightbox
          images={images}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
}
