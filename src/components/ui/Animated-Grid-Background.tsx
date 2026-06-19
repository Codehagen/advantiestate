"use client"

import { motion } from "motion/react"
import { useEffect, useId, useRef, useState } from "react"

import { useReducedMotion } from "@/lib/hooks/useReducedMotion"
import { cx } from "@/lib/utils"

interface AnimatedGridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: any
  numSquares?: number
  className?: string
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}

interface Square {
  id: number
  x: number
  y: number
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId()
  const reduce = useReducedMotion()
  const containerRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [squares, setSquares] = useState<Square[]>([])

  // Regenerate the whole set of squares once per animation cycle, on a single
  // timer. The previous version repositioned one square per motion.rect
  // onAnimationComplete — ~50 setState calls (each rebuilding the array) every
  // cycle. This is one setState per cycle. See PERFORMANCE_PLAN.md Phase 5.3.
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return

    const cols = Math.max(1, Math.floor(dimensions.width / width))
    const rows = Math.max(1, Math.floor(dimensions.height / height))

    let seq = 0
    const regenerate = () => {
      setSquares(
        Array.from({ length: numSquares }, () => ({
          id: seq++,
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
        })),
      )
    }

    regenerate()
    // Under reduced motion the grid is a static decoration: populate the
    // squares once above and skip arming the regeneration loop entirely.
    if (reduce) return
    // One full fade in/out plus the stagger of the last square — squares sit at
    // opacity 0 by then, so regenerating positions causes no visible jump.
    const cycleMs =
      (duration * 2 + repeatDelay + numSquares * 0.1 + 0.5) * 1000
    const timer = window.setInterval(regenerate, cycleMs)
    return () => window.clearInterval(timer)
  }, [dimensions, numSquares, width, height, duration, repeatDelay, reduce])

  // Single ResizeObserver tracks the container size.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) setDimensions({ width: rect.width, height: rect.height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map((square, index) =>
          reduce ? (
            // Static, visible rect — no opacity animation that would otherwise
            // settle invisible after the reverse cycle.
            <rect
              key={square.id}
              width={width - 1}
              height={height - 1}
              x={square.x * width + 1}
              y={square.y * height + 1}
              fill="currentColor"
              strokeWidth="0"
              opacity={maxOpacity}
            />
          ) : (
            <motion.rect
              key={square.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: maxOpacity }}
              transition={{
                duration,
                repeat: 1,
                delay: index * 0.1,
                repeatType: "reverse",
              }}
              width={width - 1}
              height={height - 1}
              x={square.x * width + 1}
              y={square.y * height + 1}
              fill="currentColor"
              strokeWidth="0"
            />
          ),
        )}
      </svg>
    </svg>
  )
}
