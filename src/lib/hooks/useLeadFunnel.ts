"use client"

import { useCallback, useRef } from "react"

import { trackLeadStart } from "@/lib/analytics"

/**
 * Returns an `onFocusCapture` handler that fires `lead_form_start` exactly once
 * per mount, on the first real field interaction (not on mere view). Shared by
 * every lead form so the start→submit funnel is measured consistently and we
 * don't repeat the dedupe-ref boilerplate in each component.
 *
 * `source` is the analytics source dimension (e.g. "service-modal"); `form` is
 * the human form label (e.g. "Verdsettelse").
 */
export function useLeadStartOnFocus(source: string, form: string): () => void {
  const started = useRef(false)
  return useCallback(() => {
    if (started.current) return
    started.current = true
    trackLeadStart(source, form)
  }, [source, form])
}
