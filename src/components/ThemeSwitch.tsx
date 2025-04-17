"use client"
import { cx, focusRing } from "@/lib/utils"
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group"
import { RiComputerLine, RiMoonLine, RiSunLine } from "@remixicon/react"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"

// Based on Tremor Raw RadioGroup [v0.0.0]

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, forwardedRef) => {
  return (
    <RadioGroupPrimitives.Root
      ref={forwardedRef}
      className={cx("grid gap-2", className)}
      {...props}
    />
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item> & {
    icon: React.ElementType
  }
>(({ className, icon, ...props }, forwardedRef) => {
  const Icon = icon
  return (
    <RadioGroupPrimitives.Item
      ref={forwardedRef}
      className={cx(
        "group relative flex size-8 appearance-none items-center justify-center outline-none",
        className,
      )}
      {...props}
    >
      <div
        className={cx(
          // base
          "text-warm-grey-2 dark:text-warm-grey-1 flex size-full shrink-0 items-center justify-center rounded-lg",
          // background color
          "bg-transparent",
          // checked
          "group-data-[state=checked]:bg-light-blue-1 group-data-[state=checked]:text-warm-grey dark:group-data-[state=checked]:bg-warm-grey-3 dark:group-data-[state=checked]:text-warm-white",
          // focus
          focusRing,
        )}
      >
        <Icon className="size-4 text-inherit" />
      </div>
    </RadioGroupPrimitives.Item>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <RadioGroup
      value={theme}
      onValueChange={(value) => {
        setTheme(value)
      }}
      className="flex gap-1"
    >
      <RadioGroupItem
        aria-label="Switch to System Mode"
        icon={RiComputerLine}
        value="system"
        id="system"
      />

      <RadioGroupItem
        aria-label="Switch to Light Mode"
        icon={RiSunLine}
        value="light"
        id="light"
      />

      <RadioGroupItem
        aria-label="Switch to Dark Mode"
        icon={RiMoonLine}
        value="dark"
        id="dark"
      />
    </RadioGroup>
  )
}

export default ThemeSwitch
