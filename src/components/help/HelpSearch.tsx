"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export interface HelpSearchItem {
  slug: string
  title: string
  summary: string
  category: string
}

/**
 * Knowledge-base search. Filters help articles client-side by title and
 * summary, shows a results panel, supports ⌘K / Ctrl+K to focus, Enter to
 * jump to the top hit, and Escape to dismiss.
 */
export function HelpSearch({ index }: { index: HelpSearchItem[] }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ⌘K / Ctrl+K focuses the search field from anywhere on the page.
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

  // Dismiss the results panel when clicking outside the search box.
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

  const q = query.trim().toLowerCase()
  const results =
    q.length > 0
      ? index
          .filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.summary.toLowerCase().includes(q),
          )
          .slice(0, 6)
      : []

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false)
      inputRef.current?.blur()
    }
    if (event.key === "Enter" && results.length > 0) {
      router.push(`/help/article/${results[0].slug}`)
      setOpen(false)
    }
  }

  return (
    <div className="ks-search" ref={containerRef}>
      <span className="ks-search-icon" aria-hidden="true">
        ⌕
      </span>
      <input
        ref={inputRef}
        type="search"
        placeholder="Søk i kunnskapssenteret — yield, DCF, leiekontrakt…"
        aria-label="Søk i kunnskapssenteret"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <kbd className="kbd">⌘ K</kbd>

      {open && q.length > 0 && (
        <div className="ks-search-results" role="listbox">
          {results.length > 0 ? (
            results.map((item) => (
              <Link
                key={item.slug}
                href={`/help/article/${item.slug}`}
                className="ks-search-result"
                role="option"
                onClick={() => setOpen(false)}
              >
                <span className="r-title">{item.title}</span>
                <span className="r-cat">{item.category}</span>
              </Link>
            ))
          ) : (
            <div className="ks-search-empty">
              Ingen treff på «{query.trim()}». Prøv et annet søkeord.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
