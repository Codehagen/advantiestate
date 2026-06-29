"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import { foldNo } from "@/lib/blog/help-data"

// Front-page index is capped — the design rule: never render 100+ rows at once.
// "Vis flere" reveals more; search/filter narrows the set rather than expanding
// the wall. The exhaustive list lives on the category pages.
const PAGE = 12

export interface LibraryItem {
  slug: string
  title: string
  summary: string
  category: string
  categorySlug: string
  author: string
  dateLabel: string
  updated: string
  readingTime: number | null
  popRank: number | null
}

type SortKey = "popular" | "new" | "az"

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Mest lest" },
  { key: "new", label: "Nyeste" },
  { key: "az", label: "A–Å" },
]

function highlight(text: string, q: string) {
  if (!q) return text
  const i = foldNo(text).indexOf(foldNo(q))
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

/** Deterministic sorting — never relies on incoming array order. */
function sortItems(items: LibraryItem[], sort: SortKey): LibraryItem[] {
  const byNew = (a: LibraryItem, b: LibraryItem) => {
    const d = Date.parse(b.updated) - Date.parse(a.updated)
    return d !== 0 ? d : a.slug.localeCompare(b.slug)
  }
  const copy = [...items]
  if (sort === "az") {
    copy.sort((a, b) => a.title.localeCompare(b.title, "nb"))
  } else if (sort === "new") {
    copy.sort(byNew)
  } else {
    // "Mest lest": curated popRank first (asc), then newest, slug tiebreak.
    copy.sort((a, b) => {
      const ra = a.popRank ?? Infinity
      const rb = b.popRank ?? Infinity
      if (ra !== rb) return ra - rb
      return byNew(a, b)
    })
  }
  return copy
}

export function HelpLibrary({
  items,
  categories,
}: {
  items: LibraryItem[]
  categories: { slug: string; title: string }[]
}) {
  const [cat, setCat] = useState<string>("all")
  const [filter, setFilter] = useState("")
  const [sort, setSort] = useState<SortKey>("popular")
  const [visible, setVisible] = useState(PAGE)

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const it of items) map[it.categorySlug] = (map[it.categorySlug] ?? 0) + 1
    return map
  }, [items])

  const q = foldNo(filter.trim())
  const list = useMemo(() => {
    const filtered = items.filter((it) => {
      if (cat !== "all" && it.categorySlug !== cat) return false
      if (q.length === 0) return true
      return (
        foldNo(it.title).includes(q) ||
        foldNo(it.summary).includes(q) ||
        foldNo(it.category).includes(q)
      )
    })
    return sortItems(filtered, q ? "popular" : sort)
  }, [items, cat, q, sort])

  // Reset the visible window whenever the result set changes, so a new
  // filter/search/sort always starts from the top of a fresh, capped list.
  useEffect(() => {
    setVisible(PAGE)
  }, [q, cat, sort])
  const shown = list.slice(0, visible)

  const reset = () => {
    setCat("all")
    setFilter("")
    setSort("popular")
  }

  const activeCat = categories.find((c) => c.slug === cat)

  return (
    <>
      <div className="hs-lib-head">
        <h2>
          Hele <span className="italic">biblioteket.</span>
        </h2>
        <span className="hs-count" aria-live="polite">
          <strong>{list.length}</strong>{" "}
          {list.length === 1 ? "artikkel" : "artikler"}
        </span>
      </div>

      <div className="hs-toolbar">
        <div className="hs-minisearch">
          <span className="ic" aria-hidden="true">
            ⌕
          </span>
          <input
            type="text"
            placeholder="Filtrer biblioteket…"
            aria-label="Filtrer biblioteket"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="hs-chips" role="group" aria-label="Filtrer på kategori">
          <button
            type="button"
            className="hs-chip"
            aria-pressed={cat === "all"}
            data-on={cat === "all" ? "1" : undefined}
            onClick={() => setCat("all")}
          >
            Alle <span className="cn">{items.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              className="hs-chip"
              aria-pressed={cat === c.slug}
              data-on={cat === c.slug ? "1" : undefined}
              onClick={() => setCat(c.slug)}
            >
              {c.title} <span className="cn">{counts[c.slug] ?? 0}</span>
            </button>
          ))}
        </div>

        {q.length === 0 && (
          <div className="hs-sort" role="group" aria-label="Sorter">
            <span className="lbl" aria-hidden="true">Sorter</span>
            {SORTS.map((s) => (
              <button
                key={s.key}
                type="button"
                className="hs-sortbtn"
                aria-pressed={sort === s.key}
                data-on={sort === s.key ? "1" : undefined}
                onClick={() => setSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {list.length > 0 ? (
        <>
        <div className="hs-index">
          {shown.map((it) => (
            <Link
              key={it.slug}
              className="hs-row"
              href={`/help/article/${it.slug}`}
              prefetch={false}
            >
              <div className="rmain">
                <div className="rtag">
                  <span className="dot" aria-hidden="true" />
                  {it.category}
                </div>
                <div className="rtitle">{highlight(it.title, q)}</div>
                <div className="rsum">{it.summary}</div>
              </div>
              <div className="rauthor">{it.author}<br />{it.dateLabel}</div>
              <div className="rread">
                {it.readingTime ? `${it.readingTime} min` : ""}
              </div>
              <span className="rarrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
        {list.length > visible && (
          <div className="hs-loadmore">
            <button type="button" onClick={() => setVisible((v) => v + PAGE)}>
              Vis flere{" "}
              <span className="lm-count">({list.length - visible} igjen)</span>
            </button>
          </div>
        )}
        </>
      ) : (
        <div className="hs-empty">
          <div className="em-mark" aria-hidden="true">
            ⌕
          </div>
          <h3>
            Ingen treff <span className="q">her.</span>
          </h3>
          <p>
            Vi fant ingen artikler som matcher
            {q ? ` «${filter.trim()}»` : " filteret"}
            {activeCat ? ` i ${activeCat.title}` : ""}. Prøv et bredere søk —
            eller spør oss direkte.
          </p>
          <div className="hs-empty-actions">
            <button type="button" className="clearbtn" onClick={reset}>
              Nullstill søk &amp; filter
            </button>
            <Link className="ghostbtn" href="/kontakt">
              Kontakt en rådgiver <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}

      {cat !== "all" && activeCat && (
        <p style={{ marginTop: 20, fontSize: 13.5 }}>
          <Link
            href={`/help/category/${activeCat.slug}`}
            style={{
              color: "var(--warm-grey)",
              borderBottom: "1px solid var(--warm-grey-75)",
            }}
          >
            Se hele kategorien {activeCat.title} →
          </Link>
        </p>
      )}
    </>
  )
}
