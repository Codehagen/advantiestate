"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { trackEvent } from "@/lib/analytics"

export interface HelpSearchItem {
  slug: string
  title: string
  summary: string
  category: string
  readingTime: number | null
}

const RECENT_KEY = "ks.recent"
const MAX_RESULTS = 6

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, 5) : []
  } catch {
    return []
  }
}

/** Highlights the query inside a title without dangerouslySetInnerHTML. */
function highlight(text: string, q: string) {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

/**
 * Kunnskapssenter search combobox. Instant results over an in-memory index,
 * suggestion pills, recent searches (localStorage), popular articles when
 * empty, full keyboard support (⌘K focus, ↑/↓ navigate, Enter open, Esc close)
 * and an ARIA combobox contract.
 */
export function HelpSearch({
  index,
  popular,
  suggestions,
}: {
  index: HelpSearchItem[]
  popular: { slug: string; title: string; category: string }[]
  suggestions: string[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [recent, setRecent] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => setRecent(readRecent()), [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const q = query.trim()
  const results = useMemo(() => {
    if (q.length === 0) return []
    const needle = q.toLowerCase()
    return index
      .filter(
        (item) =>
          item.title.toLowerCase().includes(needle) ||
          item.summary.toLowerCase().includes(needle) ||
          item.category.toLowerCase().includes(needle),
      )
      .slice(0, MAX_RESULTS)
  }, [index, q])

  const pushRecent = useCallback((term: string) => {
    const trimmed = term.trim()
    if (!trimmed) return
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((t) => t !== trimmed)].slice(0, 5)
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      } catch {
        /* private mode / quota — ignore */
      }
      return next
    })
  }, [])

  // Side effects for a selected result (record recent + analytics + close).
  // Used by the result <Link> onClick — the Link itself handles navigation,
  // so we must NOT also router.push or the page navigates twice.
  const recordSelect = useCallback(
    (slug: string, term: string) => {
      pushRecent(term)
      trackEvent("help_search_select", { query: term, slug })
      setOpen(false)
    },
    [pushRecent],
  )

  // Keyboard-Enter path has no <Link> click, so it navigates programmatically.
  const goTo = useCallback(
    (slug: string, term: string) => {
      recordSelect(slug, term)
      router.push(`/help/article/${slug}`)
    },
    [recordSelect, router],
  )

  const clearRecent = () => {
    setRecent([])
    try {
      window.localStorage.removeItem(RECENT_KEY)
    } catch {
      /* ignore */
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false)
      setActive(-1)
      inputRef.current?.blur()
      return
    }
    if (results.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % results.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (event.key === "Enter") {
      const hit = active >= 0 ? results[active] : results[0]
      if (hit) goTo(hit.slug, q)
    }
  }

  const showResults = open && q.length > 0
  const showRecent = open && q.length === 0

  return (
    <div className="hs-searchwrap" ref={containerRef}>
      <div
        className="hs-search"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? "hs-listbox" : undefined}
      >
        <span className="ic" aria-hidden="true">
          ⌕
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Søk — f.eks. «yield», «leiekontrakt», «Bodø»…"
          aria-label="Søk i kunnskapssenteret"
          aria-autocomplete="list"
          aria-controls={open ? "hs-listbox" : undefined}
          aria-activedescendant={
            showResults && active >= 0 ? `hs-opt-${active}` : undefined
          }
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(-1)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {q.length > 0 ? (
          <button
            type="button"
            className="clr"
            onClick={() => {
              setQuery("")
              setActive(-1)
              inputRef.current?.focus()
            }}
          >
            Tøm ✕
          </button>
        ) : (
          <kbd className="kbd">⌘ K</kbd>
        )}
      </div>

      {showResults && (
        <div className="hs-results" id="hs-listbox" role="listbox">
          {results.length > 0 ? (
            <>
              <div className="rhead">
                <span>Forslag</span>
                <span aria-live="polite">
                  {results.length} treff
                </span>
              </div>
              {results.map((item, i) => (
                <Link
                  key={item.slug}
                  id={`hs-opt-${i}`}
                  href={`/help/article/${item.slug}`}
                  className={`hs-res${i === active ? " active" : ""}`}
                  role="option"
                  aria-selected={i === active}
                  prefetch={false}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => recordSelect(item.slug, q)}
                >
                  <div>
                    <div className="rt">{highlight(item.title, q)}</div>
                    <div className="rm">
                      {item.category}
                      {item.readingTime ? ` · ${item.readingTime} min lesing` : ""}
                    </div>
                  </div>
                  <span className="rarrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </>
          ) : (
            <div className="hs-res-empty">
              <p>
                Ingen treff på <strong>«{q}»</strong>.
              </p>
              <p className="sub">
                Prøv et bredere ord — eller spør oss direkte, så svarer en
                rådgiver.
              </p>
              <Link className="hs-res-cta" href="/kontakt">
                Kontakt en rådgiver <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {showRecent && (recent.length > 0 || popular.length > 0) && (
        <div className="hs-results" id="hs-listbox" role="listbox">
          {recent.length > 0 && (
            <>
              <div className="rhead">
                <span>Nylige søk</span>
                <button type="button" className="rclear" onClick={clearRecent}>
                  Fjern
                </button>
              </div>
              {recent.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="hs-res-recent"
                  onClick={() => {
                    setQuery(term)
                    setOpen(true)
                    inputRef.current?.focus()
                  }}
                >
                  <span className="ric" aria-hidden="true">
                    ↺
                  </span>
                  <span className="rt-plain">{term}</span>
                  <span className="rarrow" aria-hidden="true">
                    →
                  </span>
                </button>
              ))}
            </>
          )}
          {popular.length > 0 && (
            <>
              <div className="rhead">
                <span>Populære artikler</span>
              </div>
              {popular.slice(0, 4).map((item) => (
                <Link
                  key={item.slug}
                  href={`/help/article/${item.slug}`}
                  className="hs-res"
                  role="option"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                >
                  <div>
                    <div className="rt">{item.title}</div>
                    <div className="rm">{item.category}</div>
                  </div>
                  <span className="rarrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </>
          )}
        </div>
      )}

      <div className="hs-suggest">
        <span className="lbl">Populært</span>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            className="hs-pill"
            onClick={() => {
              setQuery(s)
              setActive(-1)
              setOpen(true)
              inputRef.current?.focus()
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
