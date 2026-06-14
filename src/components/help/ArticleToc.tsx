"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

interface TocItem {
  slug: string
  title: string
}

interface NavCategory {
  slug: string
  title: string
  count: number
}

/**
 * Article left rail: table of contents with scroll-spy, category navigation
 * (only the active category is expanded with its articles), and related
 * services. The TOC ids come from data.tableOfContents (H2 slugs added by
 * rehype-slug), so they match the rendered heading ids.
 */
export function ArticleToc({
  toc,
  categories,
  activeCategory,
  categoryArticles,
  currentSlug,
}: {
  toc: TocItem[]
  categories: NavCategory[]
  activeCategory: string
  categoryArticles: { slug: string; title: string }[]
  currentSlug: string
}) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.slug ?? "")

  useEffect(() => {
    if (toc.length === 0) return
    const headings = toc
      .map((t) => document.getElementById(t.slug))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-100px 0px -65% 0px" },
    )
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [toc])

  return (
    <aside className="art-rail">
      {toc.length > 0 && (
        <nav className="art-toc" aria-label="På denne siden">
          <div className="lbl">På denne siden</div>
          {toc.map((item) => (
            <Link
              key={item.slug}
              href={`#${item.slug}`}
              className={activeId === item.slug ? "active" : undefined}
              aria-current={activeId === item.slug ? "location" : undefined}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      )}

      <nav className="art-nav" aria-label="Kunnskapssenter">
        <div className="lbl">Kunnskapssenter</div>
        {categories.map((c) => {
          const isActive = c.slug === activeCategory
          return (
            <div key={c.slug} className={`cat${isActive ? " active" : ""}`}>
              <Link href={`/help/category/${c.slug}`} className="ct">
                <span>{c.title}</span>
                <span className="cc">{c.count}</span>
              </Link>
              {isActive && categoryArticles.length > 0 && (
                <div className="arts">
                  {categoryArticles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/help/article/${a.slug}`}
                      className={a.slug === currentSlug ? "current" : undefined}
                      aria-current={a.slug === currentSlug ? "page" : undefined}
                      prefetch={false}
                    >
                      {a.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="art-rail-services">
        <div className="lbl">Relaterte tjenester</div>
        <Link href="/tjenester/verdivurdering">
          Verdivurdering av næringseiendom
        </Link>
        <Link href="/tjenester/salg">Salg av næringseiendom</Link>
        <Link href="/tjenester/utleie">Utleie av næringseiendom</Link>
        <Link href="/naringsmegler/bodo">Næringsmegler i Bodø</Link>
        <Link href="/naringsmegler">Alle markeder i Nord-Norge</Link>
      </div>
    </aside>
  )
}
