// Tremor Checkbox [v0.0.3]

import * as CheckboxPrimitives from "@radix-ui/react-checkbox"
import React from "react"

import { cx, focusRing } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitives.Root>
>(({ className, checked, ...props }, forwardedRef) => {
  return (
    <CheckboxPrimitives.Root
      ref={forwardedRef}
      {...props}
      checked={checked}
      className={cx(
        // base
        "relative inline-flex size-4 shrink-0 appearance-none items-center justify-center rounded shadow-sm outline-none ring-1 ring-inset transition duration-100 enabled:cursor-pointer",
        // text color
        "text-warm-white dark:text-warm-white",
        // background color
        "bg-warm-white dark:bg-warm-grey",
        // ring color
        "ring-warm-grey-2/30 dark:ring-warm-grey-1/30",
        // disabled
        "data-[disabled]:bg-warm-grey-2/10 data-[disabled]:text-warm-grey-2 data-[disabled]:ring-warm-grey-2/20",
        "data-[disabled]:dark:bg-warm-grey-1/10 data-[disabled]:dark:text-warm-grey-1 data-[disabled]:dark:ring-warm-grey-1/20",
        // checked and enabled
        "enabled:data-[state=checked]:bg-warm-grey enabled:data-[state=checked]:ring-0 enabled:data-[state=checked]:ring-transparent",
        // indeterminate
        "enabled:data-[state=indeterminate]:bg-warm-grey enabled:data-[state=indeterminate]:ring-0 enabled:data-[state=indeterminate]:ring-transparent",
        // focus
        focusRing,
        className,
      )}
      tremor-id="tremor-raw"
    >
      <CheckboxPrimitives.Indicator
        asChild
        className="flex size-full items-center justify-center"
      >
        {checked === "indeterminate" ? (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              x1="4"
              x2="12"
              y1="8"
              y2="8"
            ></line>
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2 5.59998L6.79999 9.99998L4.79999 7.99998"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        )}
      </CheckboxPrimitives.Indicator>
    </CheckboxPrimitives.Root>
  )
})

Checkbox.displayName = "Checkbox"

const CheckboxExclude = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitives.Root>
>(({ className, checked, ...props }, forwardedRef) => {
  return (
    <CheckboxPrimitives.Root
      ref={forwardedRef}
      {...props}
      checked={checked}
      className={cx(
        // base
        "relative inline-flex size-4 shrink-0 appearance-none items-center justify-center rounded shadow-sm outline-none ring-1 ring-inset transition duration-100 enabled:cursor-pointer",
        // text color
        "text-warm-white dark:text-warm-white",
        // background color
        "bg-warm-white dark:bg-warm-grey",
        // ring color
        "ring-warm-grey-2/30 dark:ring-warm-grey-1/30",
        // disabled
        "data-[disabled]:bg-warm-grey-2/10 data-[disabled]:text-warm-grey-2 data-[disabled]:ring-warm-grey-2/20",
        "data-[disabled]:dark:bg-warm-grey-1/10 data-[disabled]:dark:text-warm-grey-1 data-[disabled]:dark:ring-warm-grey-1/20",
        // checked and enabled
        "enabled:data-[state=checked]:bg-warm-grey enabled:data-[state=checked]:ring-0 enabled:data-[state=checked]:ring-transparent",
        // indeterminate
        "enabled:data-[state=indeterminate]:bg-warm-grey enabled:data-[state=indeterminate]:ring-0 enabled:data-[state=indeterminate]:ring-transparent",
        // focus
        focusRing,
        className,
      )}
      tremor-id="tremor-raw"
    >
      <CheckboxPrimitives.Indicator
        asChild
        className="flex size-full items-center justify-center"
      >
        {checked === "indeterminate" ? (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              x1="4"
              x2="12"
              y1="8"
              y2="8"
            ></line>
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 5.5L5.5 10.5M10.5 10.5L5.50003 5.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </CheckboxPrimitives.Indicator>
    </CheckboxPrimitives.Root>
  )
})

CheckboxExclude.displayName = "CheckboxExclude"

export { Checkbox, CheckboxExclude }
