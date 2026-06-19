"use client"

import { motion } from "motion/react"

import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
}

const item = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 150,
      damping: 19,
      mass: 1.2,
    },
  },
}

// Reduced-motion variant: fade in opacity only — no translate, blur, or spring.
const reducedItem = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
}

function FadeContainer({
  children,
  className,
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FadeDiv({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div variants={reduce ? reducedItem : item} className={className}>
      {children}
    </motion.div>
  )
}
function FadeSpan({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.span variants={reduce ? reducedItem : item} className={className}>
      {children}
    </motion.span>
  )
}

export { FadeContainer, FadeDiv, FadeSpan }
