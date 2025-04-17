// Tremor Button [v0.2.0]

import { Slot } from "@radix-ui/react-slot"
import { RiLoader2Fill } from "@remixicon/react"
import React from "react"
import { tv, type VariantProps } from "tailwind-variants"

import { cx, focusRing } from "@/lib/utils"

const buttonVariants = tv({
  base: [
    // base
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out",
    // disabled
    "disabled:pointer-events-none disabled:shadow-none",
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        "border-transparent dark:border-warm-white/20",
        // text color
        "text-warm-white dark:text-warm-white",
        // background color
        "bg-warm-grey dark:bg-warm-grey",
        // hover color
        "hover:bg-warm-grey-3 dark:hover:bg-warm-grey-3",
        // disabled
        "disabled:bg-warm-grey-1 disabled:text-warm-grey-2",
        "disabled:dark:bg-warm-grey-2 disabled:dark:text-warm-grey-1",
      ],
      secondary: [
        // border
        "border-warm-grey-1 dark:border-warm-white/20",
        // text color
        "text-warm-grey dark:text-warm-white",
        // background color
        "bg-warm-white dark:bg-warm-grey",
        //hover color
        "hover:bg-warm-white dark:hover:bg-warm-grey-3",
        // disabled
        "disabled:text-warm-grey-2",
        "disabled:dark:text-warm-grey-1",
      ],
      light: [
        // base
        "shadow-none",
        // border
        "border-transparent dark:border-warm-white/20",
        // text color
        "text-warm-grey dark:text-warm-white",
        // background color
        "bg-light-blue-1 dark:bg-warm-grey-3",
        // hover color
        "hover:bg-light-blue-2 dark:hover:bg-warm-grey-2",
        // disabled
        "disabled:bg-warm-grey-1 disabled:text-warm-grey-2",
        "disabled:dark:bg-warm-grey-2 disabled:dark:text-warm-grey-1",
      ],
      ghost: [
        // base
        "shadow-none",
        // border
        "border-transparent dark:border-warm-white/20",
        // text color
        "text-warm-grey dark:text-warm-white",
        // hover color
        "bg-transparent hover:bg-light-blue-1 dark:hover:bg-warm-grey-3",
        // disabled
        "disabled:text-warm-grey-2",
        "disabled:dark:text-warm-grey-1",
      ],
      destructive: [
        // text color
        "text-warm-white",
        // border
        "border-transparent dark:border-warm-white/20",
        // background color
        "bg-red-600 dark:bg-red-700",
        // hover color
        "hover:bg-red-700 dark:hover:bg-red-600",
        // disabled
        "disabled:bg-red-300 disabled:text-warm-white",
        "disabled:dark:bg-red-950 disabled:dark:text-red-400",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isLoading = false,
      loadingText,
      className,
      disabled,
      variant,
      children,
      ...props
    }: ButtonProps,
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : "button"
    return (
      <Component
        ref={forwardedRef}
        className={cx(buttonVariants({ variant }), className)}
        disabled={disabled || isLoading}
        tremor-id="tremor-raw"
        {...props}
      >
        {isLoading ? (
          <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
            <RiLoader2Fill
              className="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
            <span className="sr-only">
              {loadingText ? loadingText : "Loading"}
            </span>
            {loadingText ? loadingText : children}
          </span>
        ) : (
          children
        )}
      </Component>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }
