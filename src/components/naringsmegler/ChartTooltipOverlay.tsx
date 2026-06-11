"use client"

// Tooltip layer for the city-page market chart. The chart itself is a static,
// server-rendered SVG (zero CLS, no chart JS shipped) — this overlay adds the
// hover/focus/touch tooltip on top. It receives plain serializable props
// (precomputed viewBox coordinates) and renders its own transparent SVG
// OUTSIDE the chart's role="img" element, so the interactive layer stays
// reachable for assistive tech.

import { useCallback, useEffect, useRef, useState } from "react"

export type ChartPoint = {
  /** viewBox coords of the yield point */
  x: number
  y: number
  label: string
  /** preformatted display values ("6,20 %") */
  yieldText: string
  renteText: string
  forecast: boolean
}

type Props = {
  points: ChartPoint[]
  viewW: number
  viewH: number
  padT: number
  padB: number
  inkColor: string
  terraColor: string
}

export function ChartTooltipOverlay({
  points,
  viewW,
  viewH,
  padT,
  padB,
  inkColor,
  terraColor,
}: Props) {
  const [active, setActive] = useState<number | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const show = useCallback((i: number) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setActive(i)
  }, [])
  const hide = useCallback(() => {
    hideTimer.current = setTimeout(() => setActive(null), 80)
  }, [])

  // Touch has no mouseleave: dismiss when a touch lands outside the overlay,
  // so the first tap doesn't leave a permanently stuck tooltip. Also clear
  // the pending hide timer on unmount.
  useEffect(() => {
    const onTouchOutside = (e: TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setActive(null)
      }
    }
    document.addEventListener("touchstart", onTouchOutside, { passive: true })
    return () => {
      document.removeEventListener("touchstart", onTouchOutside)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  const colW = viewW / points.length
  const pt = active != null ? points[active] : null

  return (
    <div className="overlay" ref={rootRef}>
      <svg viewBox={`0 0 ${viewW} ${viewH}`} onMouseLeave={hide}>
        {points.map((p, i) => (
          <rect
            key={p.label}
            className="pt-hit"
            x={p.x - colW / 2}
            y={padT}
            width={colW}
            height={viewH - padT - padB}
            tabIndex={0}
            aria-label={`${p.label}${p.forecast ? " (prognose)" : ""}: prime yield ${p.yieldText}, styringsrente ${p.renteText}`}
            onMouseEnter={() => show(i)}
            onFocus={() => show(i)}
            onBlur={hide}
            onTouchStart={() => show(i)}
          />
        ))}
      </svg>
      {pt && (
        <div
          className="cy-tip show"
          style={{
            left: `${(pt.x / viewW) * 100}%`,
            top: `${(pt.y / viewH) * 100}%`,
          }}
        >
          <div className="x">
            {pt.label}
            {pt.forecast ? " · prognose" : ""}
          </div>
          <div className="r">
            <span className="d" style={{ background: inkColor }} />
            Prime yield <b>{pt.yieldText}</b>
          </div>
          <div className="r">
            <span className="d" style={{ background: terraColor }} />
            Styringsrente <b>{pt.renteText}</b>
          </div>
        </div>
      )}
    </div>
  )
}
