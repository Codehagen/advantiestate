import React from "react"
import { tv, type VariantProps } from "tailwind-variants"

import { cx } from "@/lib/utils"

const badgeVariants = tv({
  base: cx(
    "inline-flex items-center gap-x-1 whitespace-nowrap rounded-lg text-xs font-semibold uppercase tracking-tighter ring-1 ring-inset sm:text-sm",
  ),
  variants: {
    variant: {
      default: [
        "bg-light-blue-1/50 ring-warm-grey/20",
        "dark:bg-light-blue/20 dark:ring-warm-white/30",
      ],
      neutral: [
        "bg-gray-50 ring-gray-500/30",
        "dark:bg-gray-400/10 dark:ring-gray-400/20",
      ],
      success: [
        "bg-emerald-50 ring-emerald-600/30",
        "dark:bg-emerald-400/10 dark:ring-emerald-400/20",
      ],
      error: [
        "bg-rose-50 ring-rose-600/20",
        "dark:bg-rose-400/10 dark:ring-rose-400/20",
      ],
      warning: [
        "bg-orange-50 ring-orange-600/30",
        "dark:bg-orange-400/10 dark:ring-orange-400/20",
      ],
    },
    size: {
      default: "px-3 py-1.5",
      table: "px-2 py-0.5", // Smaller size for table usage
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface BadgeProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant, size, children, ...props }: BadgeProps,
    forwardedRef,
  ) => {
    return (
      <span
        ref={forwardedRef}
        className={cx(badgeVariants({ variant, size }), className)}
        tremor-id="tremor-raw"
        {...props}
      >
        <span className="bg-gradient-to-b from-warm-grey to-warm-grey-2 bg-clip-text text-transparent dark:from-warm-white dark:to-warm-grey-1">
          {children}
        </span>
      </span>
    )
  },
)

Badge.displayName = "Badge"

export { Badge, badgeVariants, type BadgeProps }
