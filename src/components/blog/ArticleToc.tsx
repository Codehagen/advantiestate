"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface TocItem {
  slug: string
  title: string
}

// Height of the fixed site nav. The scroll-spy band starts just below it.
const NAV_OFFSET = 88

/**
 * Article table of contents with scroll-spy. Highlights the section the reader
 * is currently on by observing each heading in the article body via an
 * IntersectionObserver. A click pins the highlight to its target while the
 * page smooth-scrolls, so it jumps straight there instead of flickering
 * through every section it passes on the way.
 */
export function ArticleToc({
  toc,
  authorName,
}: {
  toc: TocItem[]
  authorName: string
}) {
  const [activeSlug, setActiveSlug] = useState<string>("")
  // True while smooth-scrolling to a clicked heading: the observer is paused
  // so the highlight stays on the target instead of running down the list.
  const clickLock = useRef(false)
  const lockFallback = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  useEffect(() => {
    if (toc.length === 0) return

    const headings = toc
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickLock.current) return

        // Of the headings currently in the spy band, the topmost one wins.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )
        if (visible.length > 0) {
          setActiveSlug(visible[0].target.id)
          return
        }
        // Nothing in the band. If every heading still sits below it, the
        // reader is up in the intro — clear the highlight rather than
        // stranding it on the first section.
        const allBelow = headings.every(
          (heading) => heading.getBoundingClientRect().top > NAV_OFFSET,
        )
        if (allBelow) setActiveSlug("")
      },
      // Spy band: just below the fixed nav, down to the top third of the
      // viewport. A heading is "active" while it sits inside that band.
      { rootMargin: `-${NAV_OFFSET}px 0px -66% 0px`, threshold: 0 },
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [toc])

  // Release the click lock once the page settles. `scrollend` covers modern
  // browsers; the timeout in handleClick is the fallback for the rest.
  useEffect(() => {
    const release = () => {
      clearTimeout(lockFallback.current)
      clickLock.current = false
    }
    window.addEventListener("scrollend", release)
    return () => {
      window.removeEventListener("scrollend", release)
      clearTimeout(lockFallback.current)
    }
  }, [])

  // A click reflects on the highlight immediately, then pins it there until
  // the smooth scroll comes to rest.
  function handleClick(slug: string) {
    setActiveSlug(slug)
    clickLock.current = true
    clearTimeout(lockFallback.current)
    lockFallback.current = setTimeout(() => {
      clickLock.current = false
    }, 1000)
  }

  return (
    <aside className="ks-toc">
      <div className="toc-label" id="toc-heading">
        På denne siden
      </div>
      <nav aria-labelledby="toc-heading">
        {toc.map((item) => {
          const isActive = activeSlug === item.slug
          return (
            <Link
              key={item.slug}
              href={`#${item.slug}`}
              className={isActive ? "active" : undefined}
              aria-current={isActive ? "location" : undefined}
              onClick={() => handleClick(item.slug)}
            >
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="toc-meta">
        Skrevet av {authorName}.
        <br />
        <br />
        Vil du diskutere?
        <Link
          href="/kontakt"
          style={{
            color: "var(--warm-grey)",
            borderBottom: "1px solid",
            display: "block",
            marginTop: 6,
          }}
        >
          Ta kontakt →
        </Link>
      </div>
    </aside>
  )
}
