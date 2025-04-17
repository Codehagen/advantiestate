// Tremor Raw Radio Card [v0.0.1]

import * as RadioGroupPrimitives from "@radix-ui/react-radio-group"
import React from "react"

import { cx, focusInput, focusRing } from "@/lib/utils"

const RadioCardGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, forwardedRef) => {
  return (
    <RadioGroupPrimitives.Root
      ref={forwardedRef}
      className={cx("grid gap-2", className)}
      tremor-id="tremor-raw"
      {...props}
    />
  )
})

RadioCardGroup.displayName = "RadioCardGroup"

const RadioCardItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <RadioGroupPrimitives.Item
      ref={forwardedRef}
      className={cx(
        // base
        "group relative w-full rounded-md border p-4 text-left shadow-sm transition focus:outline-none",
        // background color
        "bg-warm-white dark:bg-warm-grey",
        // border color
        "border-warm-grey-2/20 dark:border-warm-grey-1/20",
        // checked state
        "data-[state=checked]:border-warm-grey data-[state=checked]:ring-1 data-[state=checked]:ring-warm-grey",
        "data-[state=checked]:dark:border-warm-white data-[state=checked]:dark:ring-warm-white",
        // hover state
        "hover:bg-warm-grey-2/5 dark:hover:bg-warm-grey-1/5",
        // disabled state
        "data-[disabled]:border-warm-grey-2/10 data-[disabled]:bg-warm-grey-2/5 data-[disabled]:shadow-none",
        "data-[disabled]:dark:border-warm-grey-1/10 data-[disabled]:dark:bg-warm-grey-1/5",
        focusInput,
        className,
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitives.Item>
  )
})

RadioCardItem.displayName = "RadioCardItem"

const RadioCardIndicator = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Indicator>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Indicator>
>(({ className, ...props }, forwardedRef) => {
  return (
    <div
      className={cx(
        // base
        "relative flex size-4 shrink-0 appearance-none items-center justify-center rounded-full border shadow-sm outline-none",
        // border color
        "border-warm-grey-2/20 dark:border-warm-grey-1/20",
        // background color
        "bg-warm-white dark:bg-warm-grey",
        // checked state
        "group-data-[state=checked]:border-0 group-data-[state=checked]:border-transparent",
        "group-data-[state=checked]:bg-warm-grey dark:group-data-[state=checked]:bg-warm-white",
        // disabled state
        "group-data-[disabled]:border-warm-grey-2/20 group-data-[disabled]:bg-warm-grey-2/10",
        "group-data-[disabled]:dark:border-warm-grey-1/20 group-data-[disabled]:dark:bg-warm-grey-1/10",
        // focus
        focusRing,
        className,
      )}
    >
      <RadioGroupPrimitives.Indicator
        ref={forwardedRef}
        className={cx("flex items-center justify-center")}
        {...props}
      >
        <div
          className={cx(
            // base
            "size-1.5 shrink-0 rounded-full",
            // indicator color
            "bg-warm-white dark:bg-warm-grey",
            // disabled state
            "group-data-[disabled]:bg-warm-grey-2 group-data-[disabled]:dark:bg-warm-grey-1",
          )}
        />
      </RadioGroupPrimitives.Indicator>
    </div>
  )
})

RadioCardIndicator.displayName = "RadioCardIndicator"

export { RadioCardGroup, RadioCardIndicator, RadioCardItem }
