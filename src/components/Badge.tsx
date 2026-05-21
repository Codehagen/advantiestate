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
      ],
      neutral: [
        "bg-gray-50 ring-gray-500/30",
      ],
      success: [
        "bg-emerald-50 ring-emerald-600/30",
      ],
      error: [
        "bg-rose-50 ring-rose-600/20",
      ],
      warning: [
        "bg-orange-50 ring-orange-600/30",
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
        <span className="bg-gradient-to-b from-warm-grey to-warm-grey-2 bg-clip-text text-transparent">
          {children}
        </span>
      </span>
    )
  },
)

Badge.displayName = "Badge"

export { Badge, badgeVariants, type BadgeProps }
