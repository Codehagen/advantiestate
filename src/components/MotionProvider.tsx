"use client"

import { MotionConfig } from "motion/react"

/**
 * Site-wide motion primitive. `reducedMotion="user"` makes every Framer
 * `motion` element honour the OS "reduce motion" setting by default —
 * transform/layout animations are dropped, opacity is kept — so new motion
 * components are accessible without each one re-implementing the gate.
 * Server children passed through stay server-rendered.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
