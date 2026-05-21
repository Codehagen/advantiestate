"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

interface TocItem {
  slug: string
  title: string
}

/**
 * Article table of contents with scroll-spy. Highlights the section the reader
 * is currently on by observing each heading in the article body via an
 * IntersectionObserver, and reflects clicks immediately for a snappy feel.
 */
export function ArticleToc({
  toc,
  authorName,
}: {
  toc: TocItem[]
  authorName: string
}) {
  const [activeSlug, setActiveSlug] = useState<string>("")

  useEffect(() => {
    if (toc.length === 0) return

    const headings = toc
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Of the headings currently in the spy band, the topmost one wins.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )
        if (visible.length > 0) {
          setActiveSlug(visible[0].target.id)
        }
      },
      // Spy band: just below the fixed nav, down to the top third of the
      // viewport. A heading is "active" while it sits inside that band.
      { rootMargin: "-88px 0px -66% 0px", threshold: 0 },
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [toc])

  return (
    <aside className="ks-toc">
      <div className="toc-label">På denne siden</div>
      {toc.map((item) => (
        <Link
          key={item.slug}
          href={`#${item.slug}`}
          className={activeSlug === item.slug ? "active" : undefined}
          onClick={() => setActiveSlug(item.slug)}
        >
          {item.title}
        </Link>
      ))}

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
