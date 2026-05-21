"use client"
import { Badge } from "@/components/Badge"
import { AnimatedGridPattern } from "@/components/ui/Animated-Grid-Background"
import { cx } from "@/lib/utils"
import Link from "next/link"

interface AnimatedCTAProps {
  badge?: string
  title: string
  description: string
  primaryAction?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    href: string
  }
  className?: string
  size?: "default" | "large"
}

export function AnimatedCTA({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  size = "default",
}: AnimatedCTAProps) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl bg-warm-grey/5 p-8 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5",
        size === "large" && "min-h-[400px]",
        className,
      )}
    >
      <AnimatedGridPattern
        className="absolute inset-0 opacity-50"
        width={32}
        height={32}
        strokeDasharray="4 2"
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-6 text-center">
        {badge && <Badge>{badge}</Badge>}
        <h3 className="text-2xl font-semibold tracking-tight text-warm-grey">
          {title}
        </h3>
        <p className="text-warm-grey-2">{description}</p>
        {(primaryAction || secondaryAction) && (
          <div className="flex gap-4">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="inline-flex items-center justify-center rounded-full bg-warm-grey px-6 py-2 font-medium text-white transition-colors hover:bg-warm-grey-2"
              >
                {primaryAction.label}
              </Link>
            )}
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center justify-center rounded-full px-6 py-2 font-medium text-warm-grey ring-1 ring-warm-grey/20 transition-colors hover:bg-warm-grey/5"
              >
                {secondaryAction.label} →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
