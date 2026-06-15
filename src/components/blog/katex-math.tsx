"use client"

// Isolated katex wrapper. react-katex and its ~100KB+ stylesheet load only on
// the rare MDX articles that actually render math — this module is pulled in via
// next/dynamic from mdx.tsx so it never ships with article pages that have no
// formulas. See PERFORMANCE_PLAN.md Phase 2.0.
import "katex/dist/katex.min.css"
import { useEffect, useLayoutEffect, useRef } from "react"
import { BlockMath, InlineMath } from "react-katex"

// SSR-safe layout effect: useLayoutEffect on the client (avoids a flash of the
// unscaled formula), useEffect during SSR (React warns otherwise).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

// Block formulas (e.g. the full DCF expression) can be wider than the capped
// 720px article column. Rather than scrolling the formula inside its box —
// which leaves an ugly scrollbar — shrink the font just enough that the whole
// equation fits. KaTeX sizes everything in em, so reducing the container
// font-size scales the layout width proportionally with no clipping.
function useFitToWidth(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    let lastWidth = -1

    const fit = () => {
      const avail = el.clientWidth
      if (avail === 0) return
      // Reset to the CSS-defined size before measuring.
      el.style.fontSize = ""
      // Fraction rules and struts have sub-pixel minimums that don't scale
      // perfectly linearly with font-size, so converge in a few passes rather
      // than trusting a single ratio. 0.99 leaves a hair against rounding.
      for (let i = 0; i < 4; i++) {
        const content = el.scrollWidth
        if (content <= avail) break
        const current = parseFloat(getComputedStyle(el).fontSize)
        el.style.fontSize = `${(current * avail) / content * 0.99}px`
      }
    }

    fit()

    const ro = new ResizeObserver((entries) => {
      const width = Math.round(entries[0].contentRect.width)
      // Only recompute when the container's width changes. Our own font-size
      // tweak alters height, not width, so this guard prevents a feedback loop.
      if (width === lastWidth) return
      lastWidth = width
      fit()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [enabled])

  return ref
}

export function KatexMath({
  formula,
  mode = "block",
  fit = mode !== "inline",
}: {
  formula: string
  mode?: "inline" | "block"
  // Auto-scale to fit the container. On by default for block math; callers that
  // render math inside a fixed-width box (MathBlock) opt in for inline too, so
  // a wide formula shrinks instead of scrolling or clipping. In-text inline
  // math leaves this off and flows with the paragraph.
  fit?: boolean
}) {
  const ref = useFitToWidth(fit)
  const math =
    mode === "inline" ? (
      <InlineMath math={formula} />
    ) : (
      <BlockMath math={formula} />
    )

  return fit ? <div ref={ref}>{math}</div> : math
}
