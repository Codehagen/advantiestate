// Tremor Button [v0.2.0]

import { Slot } from "@radix-ui/react-slot"
import { RiLoader2Fill } from "@remixicon/react"
import React from "react"
import { tv, type VariantProps } from "tailwind-variants"

import { cx, focusRing } from "@/lib/utils"

const buttonVariants = tv({
  base: [
    // base
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-center text-sm font-medium shadow-sm transition-[color,background-color,transform] duration-100 ease-out active:scale-[0.97] motion-reduce:active:scale-100",
    // disabled
    "disabled:pointer-events-none disabled:shadow-none",
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        "border-transparent",
        // text color
        "text-warm-white",
        // background color
        "bg-warm-grey",
        // hover color
        "hover:bg-warm-grey-3",
        // disabled
        "disabled:bg-warm-grey-1 disabled:text-warm-grey-2",
      ],
      secondary: [
        // border
        "border-warm-grey-1",
        // text color
        "text-warm-grey",
        // background color
        "bg-warm-white",
        //hover color
        "hover:bg-warm-white",
        // disabled
        "disabled:text-warm-grey-2",
      ],
      light: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-warm-grey",
        // background color
        "bg-light-blue-1",
        // hover color
        "hover:bg-light-blue-2",
        // disabled
        "disabled:bg-warm-grey-1 disabled:text-warm-grey-2",
      ],
      ghost: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-warm-grey",
        // hover color
        "bg-transparent hover:bg-light-blue-1",
        // disabled
        "disabled:text-warm-grey-2",
      ],
      destructive: [
        // text color
        "text-warm-white",
        // border
        "border-transparent",
        // background color
        "bg-red-600",
        // hover color
        "hover:bg-red-700",
        // disabled
        "disabled:bg-red-300 disabled:text-warm-white",
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
