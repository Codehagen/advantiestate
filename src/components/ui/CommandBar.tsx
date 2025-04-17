"use client"

import * as Popover from "@radix-ui/react-popover"
import * as React from "react"

import { cx, focusRing } from "@/lib/utils"

const shortcutStyles = cx(
  "hidden h-6 select-none items-center justify-center rounded-md bg-warm-grey px-2 font-mono text-xs text-warm-grey-1 ring-1 ring-inset ring-warm-grey-1/30 transition sm:flex",
)

interface CommandBarProps extends React.PropsWithChildren {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  disableAutoFocus?: boolean
}

const CommandBar = ({
  open = false,
  onOpenChange,
  defaultOpen = false,
  disableAutoFocus = true,
  children,
}: CommandBarProps) => {
  return (
    <Popover.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      <Popover.Anchor
        className={cx(
          "fixed inset-x-0 bottom-8 mx-auto flex w-fit items-center",
        )}
      />
      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={0}
          onOpenAutoFocus={(e) => {
            if (disableAutoFocus) {
              e.preventDefault()
            }
          }}
          className={cx(
            "z-50",
            "data-[state=closed]:animate-hide",
            "data-[side=top]:animate-slideUpAndFade",
          )}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
CommandBar.displayName = "CommandBar"

const CommandBarValue = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cx(
        "px-3 py-2.5 text-sm tabular-nums text-warm-white",
        className,
      )}
      {...props}
    />
  )
})
CommandBarValue.displayName = "CommandBar.Value"

const CommandBarBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cx(
        "relative flex items-center rounded-lg bg-warm-grey/90 px-1 shadow-lg shadow-warm-grey/30 dark:ring-1 dark:ring-warm-white/10",
        className,
      )}
      {...props}
    />
  )
})
CommandBarBar.displayName = "CommandBarBar"

const CommandBarSeperator = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<"div">, "children">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cx("h-8 w-px bg-warm-grey-1/20", className)}
      {...props}
    />
  )
})
CommandBarSeperator.displayName = "CommandBarSeperator"

interface CommandProps
  extends Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "onClick"
  > {
  action: () => void | Promise<void>
  label: string
  shortcut: { shortcut: string; label?: string }
}

const CommandBarCommand = React.forwardRef<HTMLButtonElement, CommandProps>(
  ({ className, action, label, shortcut, disabled, ...props }, ref) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const handleClick = async () => {
      try {
        setIsLoading(true)
        await action()
      } finally {
        setIsLoading(false)
      }
    }

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === shortcut.shortcut.toLowerCase()) {
          const noModifiersPressed =
            !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
          const isTypingInInput =
            document.activeElement instanceof HTMLInputElement ||
            document.activeElement instanceof HTMLTextAreaElement

          if (noModifiersPressed && !isTypingInInput && !disabled) {
            event.preventDefault()
            event.stopPropagation()
            void handleClick()
          }
        }
      }
      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }, [action, disabled, shortcut.shortcut])

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={cx(
          "group inline-flex h-10 cursor-default select-none items-center gap-3 px-2 outline-none transition",
          "focus-visible:bg-warm-grey-2/10 aria-disabled:opacity-50",
          focusRing,
          className,
        )}
        {...props}
      >
        <span className="text-sm text-warm-white">{label}</span>
        <span className={shortcutStyles}>
          {shortcut.label || shortcut.shortcut}
        </span>
      </button>
    )
  },
)
CommandBarCommand.displayName = "CommandBarCommand"

export {
  CommandBar,
  CommandBarBar,
  CommandBarCommand,
  CommandBarSeperator,
  CommandBarValue,
}
