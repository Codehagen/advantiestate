"use client"

// Small recharts-free building blocks for the Analyseportal. Statically
// imported (the chart frames themselves load via next/dynamic).

import { Component, type ReactNode } from "react"
import { PORTAL_CHART_HEIGHT } from "./chartConstants"
import { fmtComma, fmtGroup, type Dir } from "@/components/markedsinnsikt/portalSeries"
import type { SeriesDef } from "./seriesUtils"

// ── clickable legend (aria-pressed, min-1 guard) ────────────────────────────
export function PortalLegend({
  items,
  hidden,
  onToggle,
}: {
  items: Pick<SeriesDef, "key" | "label" | "color" | "dashed">[]
  hidden?: Record<string, boolean>
  onToggle?: (key: string) => void
}) {
  const visibleCount = items.filter((it) => !hidden?.[it.key]).length
  return (
    <div className="ap-legend">
      {items.map((it) => {
        const off = Boolean(hidden?.[it.key])
        // The last visible series cannot be hidden (an empty chart reads broken).
        const locked = !off && visibleCount === 1
        return (
          <button
            key={it.key}
            type="button"
            className={`ap-leg${off ? " off" : ""}`}
            aria-pressed={!off}
            disabled={!onToggle || locked}
            onClick={() => onToggle?.(it.key)}
          >
            <span
              className="sw"
              style={
                it.dashed
                  ? { background: "transparent", borderColor: it.color, borderWidth: 1.5, borderStyle: "dashed" }
                  : { background: it.color, borderColor: it.color }
              }
            />
            {it.label}
            <span className="sr-only">{off ? " (skjult — vis serie)" : " (skjul serie)"}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── chart loading state: flat block, card frame stays (no spinner, no CLS) ──
export function ChartSkeleton({ height }: { height?: number }) {
  return (
    <div
      className="ap-skel"
      style={{ height: height ?? PORTAL_CHART_HEIGHT }}
      aria-hidden="true"
    />
  )
}

// ── chart error fallback inside the card frame (height preserved) ──────────
export class ChartErrorBoundary extends Component<
  { children: ReactNode; height?: number },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.error("[analyseportal] chart render failed", error)
  }
  render() {
    if (this.state.failed) {
      return (
        <div
          className="ap-chart-error"
          style={{ height: this.props.height ?? PORTAL_CHART_HEIGHT }}
          role="status"
        >
          <p>
            Grafen kunne ikke lastes —{" "}
            <button type="button" onClick={() => window.location.reload()}>
              last siden på nytt
            </button>
            .
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

// ── delta indicator (arrow keeps it non-color-only) ─────────────────────────
export function Delta({
  n,
  unit,
  decimals = 0,
}: {
  n: number
  unit: string
  decimals?: number
}) {
  const cls: Dir = n === 0 ? "flat" : n > 0 ? "up" : "down"
  const arrow = n === 0 ? "→" : n > 0 ? "▲" : "▼"
  const mag = Math.abs(n)
  const txt = decimals > 0 ? fmtComma(mag, decimals) : fmtGroup(mag)
  return (
    <span className={`ap-delta ${cls}`}>
      {arrow} {txt}
      {unit}
    </span>
  )
}

// ── interpretation card ─────────────────────────────────────────────────────
export function Insight({
  n,
  h,
  children,
}: {
  n: string
  h: string
  children: ReactNode
}) {
  return (
    <div className="ap-insight">
      <div className="ipre">Tolkning · {n}</div>
      <h4>{h}</h4>
      <p>{children}</p>
    </div>
  )
}
