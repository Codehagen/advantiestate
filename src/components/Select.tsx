// Tremor Select [v0.0.3]

import * as SelectPrimitives from "@radix-ui/react-select"
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCheckLine,
  RiExpandUpDownLine,
} from "@remixicon/react"
import React from "react"

import { cx, focusInput, hasErrorInput } from "@/lib/utils"

const Select = SelectPrimitives.Root
Select.displayName = "Select"

const SelectGroup = SelectPrimitives.Group
SelectGroup.displayName = "SelectGroup"

const SelectValue = SelectPrimitives.Value
SelectValue.displayName = "SelectValue"

const selectTriggerStyles = [
  cx(
    // base
    "group/trigger flex w-full select-none items-center justify-between gap-2 truncate rounded-md border px-3 py-2 shadow-sm outline-none transition sm:text-sm",
    // border color
    "border-warm-grey-1 dark:border-warm-grey-2",
    // text color
    "text-warm-grey dark:text-warm-white",
    // placeholder
    "data-[placeholder]:text-warm-grey-2 data-[placeholder]:dark:text-warm-grey-1",
    // background color
    "bg-warm-white dark:bg-warm-grey",
    // hover
    "hover:bg-light-blue-1 hover:dark:bg-warm-grey-3",
    // disabled
    "data-[disabled]:bg-warm-grey-1 data-[disabled]:text-warm-grey-2",
    "data-[disabled]:dark:border-warm-grey-2 data-[disabled]:dark:bg-warm-grey-3 data-[disabled]:dark:text-warm-grey-1",
    focusInput,
  ),
]

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger> & {
    hasError?: boolean
  }
>(({ className, hasError, children, ...props }, forwardedRef) => {
  return (
    <SelectPrimitives.Trigger
      ref={forwardedRef}
      className={cx(
        selectTriggerStyles,
        hasError ? hasErrorInput : "",
        className,
      )}
      tremor-id="tremor-raw"
      {...props}
    >
      <span className="truncate">{children}</span>
      <SelectPrimitives.Icon asChild>
        <RiExpandUpDownLine
          className={cx(
            // base
            "size-4 shrink-0",
            // text color
            "text-warm-grey-2 dark:text-warm-grey-1",
            // disabled
            "group-data-[disabled]/trigger:text-warm-grey-1 group-data-[disabled]/trigger:dark:text-warm-grey-2",
          )}
        />
      </SelectPrimitives.Icon>
    </SelectPrimitives.Trigger>
  )
})

SelectTrigger.displayName = "SelectTrigger"

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.ScrollUpButton>
>(({ className, ...props }, forwardedRef) => (
  <SelectPrimitives.ScrollUpButton
    ref={forwardedRef}
    className={cx(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <RiArrowUpSLine className="size-3 shrink-0" aria-hidden="true" />
  </SelectPrimitives.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitives.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.ScrollDownButton>
>(({ className, ...props }, forwardedRef) => (
  <SelectPrimitives.ScrollDownButton
    ref={forwardedRef}
    className={cx(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <RiArrowDownSLine className="size-3 shrink-0" aria-hidden="true" />
  </SelectPrimitives.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitives.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Content>
>(
  (
    {
      className,
      position = "popper",
      children,
      sideOffset = 8,
      collisionPadding = 10,
      ...props
    },
    forwardedRef,
  ) => (
    <SelectPrimitives.Portal>
      <SelectPrimitives.Content
        ref={forwardedRef}
        className={cx(
          // base
          "relative z-50 overflow-hidden rounded-md border shadow-xl shadow-black/[2.5%]",
          // widths
          "min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]",
          // heights
          "max-h-[--radix-select-content-available-height]",
          // background color
          "bg-warm-white dark:bg-warm-grey",
          // text color
          "text-warm-grey dark:text-warm-white",
          // border color
          "border-warm-grey-1 dark:border-warm-grey-2",
          // transition
          "will-change-[transform,opacity]",
          "data-[state=closed]:animate-hide",
          "data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideLeftAndFade data-[side=right]:animate-slideRightAndFade data-[side=top]:animate-slideUpAndFade",
          className,
        )}
        sideOffset={sideOffset}
        position={position}
        collisionPadding={collisionPadding}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitives.Viewport
          className={cx(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[calc(var(--radix-select-trigger-width))]",
          )}
        >
          {children}
        </SelectPrimitives.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitives.Content>
    </SelectPrimitives.Portal>
  ),
)

SelectContent.displayName = "SelectContent"

const SelectGroupLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Label>
>(({ className, ...props }, forwardedRef) => (
  <SelectPrimitives.Label
    ref={forwardedRef}
    className={cx(
      // base
      "px-3 py-2 text-xs font-medium tracking-wide",
      // text color
      "text-warm-grey-2 dark:text-warm-grey-1",
      className,
    )}
    {...props}
  />
))

SelectGroupLabel.displayName = "SelectGroupLabel"

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Item>
>(({ className, children, ...props }, forwardedRef) => {
  return (
    <SelectPrimitives.Item
      ref={forwardedRef}
      className={cx(
        // base
        "grid cursor-pointer grid-cols-[1fr_20px] gap-x-2 rounded px-3 py-2 outline-none transition-colors data-[state=checked]:font-semibold sm:text-sm",
        // text color
        "text-warm-grey dark:text-warm-white",
        // disabled
        "data-[disabled]:text-warm-grey-2 dark:data-[disabled]:text-warm-grey-1 data-[disabled]:pointer-events-none data-[disabled]:hover:bg-none",
        // focus
        "focus-visible:bg-light-blue-1 focus-visible:dark:bg-warm-grey-3",
        // hover
        "hover:bg-light-blue-1 hover:dark:bg-warm-grey-3",
        className,
      )}
      {...props}
    >
      <SelectPrimitives.ItemText className="flex-1 truncate">
        {children}
      </SelectPrimitives.ItemText>
      <SelectPrimitives.ItemIndicator>
        <RiCheckLine
          className="text-warm-grey dark:text-warm-white size-5 shrink-0"
          aria-hidden="true"
        />
      </SelectPrimitives.ItemIndicator>
    </SelectPrimitives.Item>
  )
})

SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Separator>
>(({ className, ...props }, forwardedRef) => (
  <SelectPrimitives.Separator
    ref={forwardedRef}
    className={cx(
      // base
      "-mx-1 my-1 h-px",
      // background color
      "bg-warm-grey-1 dark:bg-warm-grey-2",
      className,
    )}
    {...props}
  />
))

SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
