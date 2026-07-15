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
  // follows the finger on the active slide; on release it advances on velocity
  // (|dx|/ms > 0.11) or distance (>50px), otherwise springs back. A
  // near-stationary tap dismisses; a vertical drag is ignored (native pan-y
  // scroll). Reduced motion skips the finger-tracking and keeps the release-only
  // threshold behaviour. Slides are pointer-events:none, so the stage owns the
  // gesture — see .ed-lb-stage (touch-action: pan-y).
  const SWIPE_DISTANCE = 50; // px — existing paging threshold
  const SWIPE_VELOCITY = 0.11; // px/ms — flick dismissal
  const AXIS_LOCK = 8; // px — intent before locking horizontal/vertical
  const TAP_SLOP = 10; // px — near-stationary tap
  const SPRING = "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";

  const stageRef = useRef<HTMLDivElement | null>(null);
  // Per-move state lives in refs so pointermove never triggers a re-render.
  const start = useRef<{ x: number; y: number; t: number } | null>(null);
  const axis = useRef<"h" | "v" | null>(null);
  const dragged = useRef<HTMLElement | null>(null);
  const springTimer = useRef<number | null>(null);

  const reducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const activeSlide = () =>
    stageRef.current?.querySelector<HTMLElement>(".ed-lb-slide.is-active") ??
    null;

  // Strip the inline drag styles off whichever slide we last touched. Uses the
  // stored ref (not a fresh query) so it targets the right node even after the
  // window re-renders on advance.
  const clearDrag = () => {
    const el = dragged.current;
    if (el) {
      el.style.transition = "";
      el.style.transform = "";
    }
    dragged.current = null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (springTimer.current) {
      window.clearTimeout(springTimer.current);
      springTimer.current = null;
    }
    clearDrag();
    start.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    axis.current = null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = start.current;
    if (!s || reducedMotion()) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (axis.current === null) {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      if (axis.current === "h") {
        const el = activeSlide();
        if (el) {
          dragged.current = el;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            /* pointer capture is best-effort */
          }
        }
      }
    }
    if (axis.current !== "h" || !dragged.current) return;
    // Rubber-band when dragging past the first/last slide.
    const atEnd =
      (index === 0 && dx > 0) || (index === count - 1 && dx < 0);
    const offset = atEnd ? dx * 0.3 : dx;
    dragged.current.style.transition = "none";
    dragged.current.style.transform = `translateX(${offset}px)`;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    const wasHorizontal = axis.current === "h";
    axis.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;

    // Reduced motion: original release-only threshold behaviour, no follow.
    if (reducedMotion()) {
      if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
      } else if (Math.abs(dx) < TAP_SLOP && Math.abs(dy) < TAP_SLOP) {
        onClose();
      }
      return;
    }

    // Non-horizontal gesture: tap-to-close, else ignore (vertical scroll).
    if (!wasHorizontal) {
      if (Math.abs(dx) < TAP_SLOP && Math.abs(dy) < TAP_SLOP) onClose();
      clearDrag();
      return;
    }

    const elapsed = Math.max(1, e.timeStamp - s.t);
    const velocity = Math.abs(dx) / elapsed;
    const wantsAdvance =
      velocity > SWIPE_VELOCITY || Math.abs(dx) > SWIPE_DISTANCE;
    const canAdvance =
      (dx > 0 && index > 0) || (dx < 0 && index < count - 1);

    if (wantsAdvance && canAdvance) {
      // Drop the drag transform instantly; the 180ms .ed-lb-slide cross-fade
      // handles the actual swap (opacity out on the old slide, in on the new).
      clearDrag();
      if (dx < 0) next();
      else prev();
      return;
    }

    // Not enough to advance (or blocked at an end): spring back to centre, then
    // clean up the inline styles once the transition has settled.
    const el = dragged.current;
    if (el) {
      el.style.transition = SPRING;
      el.style.transform = "translateX(0)";
      springTimer.current = window.setTimeout(() => {
        clearDrag();
        springTimer.current = null;
      }, 240);
    } else {
      clearDrag();
    }
  };

  // Clear any pending spring-cleanup timer if the lightbox unmounts mid-drag.
  useEffect(() => {
    return () => {
      if (springTimer.current) window.clearTimeout(springTimer.current);
    };
  }, []);

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
            ref={stageRef}
            className="ed-lb-stage"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
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
