"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import { cx } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  alt: string;
}

/*
 * Listing photo lightbox — full-screen Radix Dialog viewer.
 *
 *   closed ──open(i)──► [ index ] ──► next() → clamp(i+1, len-1)
 *                          │ ▲           prev() → clamp(i-1, 0)
 *                          │ └── thumbnail tap (go i) · swipe · ‹ › · ←/→ keys
 *                          └──(Esc · ✕ · tap background)──► closed
 *
 * Only a 3-wide window [i-1, i, i+1] is mounted (never all N), so a listing with
 * 18 photos never loads 18 full-res images at once — neighbours are preloaded
 * for an instant cross-fade. Counter + navigation read images.length, NEVER the
 * listing's photoCount (which can exceed the real array in the MDX-fallback case).
 *
 * Radix Dialog owns focus-trap, Esc, scroll-lock and aria-modal. Swipe/tap is
 * scoped to the image stage only (slides are pointer-events:none) so it never
 * fights the thumbnail strip's horizontal scroll.
 */
export function ListingLightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: LightboxImage[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const count = images.length;
  const go = useCallback(
    (i: number) => onIndexChange(Math.max(0, Math.min(count - 1, i))),
    [count, onIndexChange],
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Keyboard arrows (Esc is handled by Radix Dialog).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Pointer swipe + tap-to-close on the image stage. Horizontal-dominant drag
  // (>50px, |dx|>|dy|) pages; a near-stationary tap dismisses; anything else
  // (vertical drag) is ignored.
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      onClose();
    }
  };

  // Keep the active thumbnail scrolled into view.
  const activeThumb = (el: HTMLButtonElement | null) => {
    el?.scrollIntoView({ block: "nearest", inline: "center" });
  };

  const windowIdx = [index - 1, index, index + 1].filter(
    (i) => i >= 0 && i < count,
  );

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="ed-lb-overlay" />
        <Dialog.Content
          className="ed-lightbox"
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Dialog.Title asChild>
            <VisuallyHidden>Bildegalleri</VisuallyHidden>
          </Dialog.Title>

          <div className="ed-lb-bar">
            <span className="ed-lb-counter" aria-live="polite">
              {index + 1} / {count}
            </span>
            <Dialog.Close className="ed-lb-close" aria-label="Lukk">
              ✕
            </Dialog.Close>
          </div>

          <div
            className="ed-lb-stage"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {windowIdx.map((i) => (
              <div
                key={i}
                className={cx("ed-lb-slide", i === index && "is-active")}
                aria-hidden={i !== index}
              >
                <Image
                  src={images[i].src}
                  alt={i === index ? images[i].alt : ""}
                  fill
                  sizes="100vw"
                  priority={i === index}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="ed-lb-nav prev"
            onClick={prev}
            disabled={index === 0}
            aria-label="Forrige bilde"
          >
            ‹
          </button>
          <button
            type="button"
            className="ed-lb-nav next"
            onClick={next}
            disabled={index === count - 1}
            aria-label="Neste bilde"
          >
            ›
          </button>

          {count > 1 && (
            <div className="ed-lb-thumbs" aria-label="Velg bilde">
              {images.map((img, i) => (
                <button
                  key={`${img.src}-${i}`}
                  type="button"
                  ref={i === index ? activeThumb : undefined}
                  className={cx("ed-lb-thumb", i === index && "is-active")}
                  onClick={() => go(i)}
                  aria-label={`Bilde ${i + 1} av ${count}`}
                  aria-current={i === index}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="72px"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
