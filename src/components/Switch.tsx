// Tremor Switch [v0.0.1]

import * as SwitchPrimitives from "@radix-ui/react-switch"
import React from "react"
import { tv, VariantProps } from "tailwind-variants"

import { cx, focusRing } from "@/lib/utils"

const switchVariants = tv({
  slots: {
    root: [
      // base
      "group relative isolate inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 shadow-inner outline-none ring-1 ring-inset transition-all",
      "bg-warm-grey-1 dark:bg-warm-grey",
      // ring color
      "ring-warm-grey/5 dark:ring-warm-grey-2",
      // checked
      "data-[state=checked]:bg-warm-grey data-[state=checked]:dark:bg-warm-grey",
      // disabled
      "data-[disabled]:cursor-default",
      // disabled checked
      "data-[disabled]:data-[state=checked]:bg-warm-grey-1",
      "data-[disabled]:data-[state=checked]:ring-warm-grey-2",
      // disabled checked dark
      "data-[disabled]:data-[state=checked]:dark:ring-warm-grey-3",
      "data-[disabled]:data-[state=checked]:dark:bg-warm-grey-2",
      // disabled unchecked
      "data-[disabled]:data-[state=unchecked]:ring-warm-grey-2",
      "data-[disabled]:data-[state=unchecked]:bg-warm-grey-1",
      // disabled unchecked dark
      "data-[disabled]:data-[state=unchecked]:dark:ring-warm-grey-2",
      "data-[disabled]:data-[state=unchecked]:dark:bg-warm-grey-3",
      focusRing,
    ],
    thumb: [
      // base
      "pointer-events-none relative inline-block transform appearance-none rounded-full border-none shadow-lg outline-none transition-all duration-150 ease-in-out focus:border-none focus:outline-none focus:outline-transparent",
      // background color
      "bg-warm-white dark:bg-warm-white",
      // disabled
      "group-data-[disabled]:shadow-none",
      "group-data-[disabled]:bg-warm-grey-1 group-data-[disabled]:dark:bg-warm-grey-2",
    ],
  },
  variants: {
    size: {
      sm: {
        root: "h-4 w-7",
        thumb: "size-3 data-[state=checked]:translate-x-3.5",
      },
      md: {
        root: "h-5 w-9",
        thumb: "size-4 data-[state=checked]:translate-x-4",
      },
      lg: {
        root: "h-6 w-11",
        thumb: "size-5 data-[state=checked]:translate-x-5",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, ...props }, forwardedRef) => {
  const { root, thumb } = switchVariants({ size })
  return (
    <SwitchPrimitives.Root
      ref={forwardedRef}
      className={cx(root(), className)}
      {...props}
    >
      <SwitchPrimitives.Thumb className={thumb()} />
    </SwitchPrimitives.Root>
  )
})

Switch.displayName = "Switch"

export { Switch, type SwitchProps }
