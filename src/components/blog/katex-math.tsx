"use client"

// Isolated katex wrapper. react-katex and its ~100KB+ stylesheet load only on
// the rare MDX articles that actually render math — this module is pulled in via
// next/dynamic from mdx.tsx so it never ships with article pages that have no
// formulas. See PERFORMANCE_PLAN.md Phase 2.0.
import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "react-katex"

export function KatexMath({
  formula,
  mode = "block",
}: {
  formula: string
  mode?: "inline" | "block"
}) {
  return mode === "inline" ? (
    <InlineMath math={formula} />
  ) : (
    <BlockMath math={formula} />
  )
}
