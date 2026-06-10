"use client"

import { useEffect, useRef, useState } from "react"
import { LATEST_RELEASE } from "@/components/markedsinnsikt/marketReleases"
import { trackEvent } from "@/lib/analytics"

/** Kanonisk siteringstekst — én kilde til sannhet for hele presserom-siden. */
export const SITERINGSTEKST = `Kilde: Advanti Estate, ${LATEST_RELEASE.quarter}. advantiestate.no/presserom`

/**
 * Kopier-sitering-knapp. Klikk kopierer SITERINGSTEKST til utklippstavlen og
 * viser "Kopiert ✓" i ~2 sekunder. Hvis clipboard-tilgang avslås, vises
 * teksten i et felt med teksten autovalgt + tastaturtips (2B-vedtak).
 */
export function KopierSitering() {
  const [state, setState] = useState<"idle" | "copied" | "fallback">("idle")
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-select input tekst etter at fallback-tilstand er rendret.
  useEffect(() => {
    if (state === "fallback") {
      inputRef.current?.select()
    }
  }, [state])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SITERINGSTEKST)
      trackEvent("sitering_kopiert", { page_path: "/presserom" })
      setState("copied")
      setTimeout(() => setState("idle"), 2000)
    } catch {
      // Clipboard-tilgang avslått — vis tekst med autovalg (2B-fallback).
      setState("fallback")
    }
  }

  if (state === "fallback") {
    return (
      <div className="press-copy-fallback">
        <input
          ref={inputRef}
          readOnly
          value={SITERINGSTEKST}
          className="press-copy-input"
          aria-label="Siteringstekst — merk og kopier manuelt"
          onFocus={(e) => e.currentTarget.select()}
        />
        <span className="press-copy-hint">Trykk Cmd+C / Ctrl+C for å kopiere</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={handleCopy}
    >
      {state === "copied" ? "Kopiert ✓" : "Kopier sitering"}
    </button>
  )
}
