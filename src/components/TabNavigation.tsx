// Tremor TabNavigation [v0.1.0]

import * as NavigationMenuPrimitives from "@radix-ui/react-navigation-menu"
import React from "react"

import { cx, focusRing } from "@/lib/utils"

interface SubtreeOptions {
  asChild?: boolean
  children: React.ReactNode
}

type ContentRenderer = (children: React.ReactNode) => React.ReactNode

export function getSubtree(
  options: SubtreeOptions,
  content: React.ReactNode | ContentRenderer,
): React.ReactNode {
  const { asChild, children } = options

  if (!asChild) {
    return typeof content === "function" ? content(children) : content
  }

  const firstChild = React.Children.only(children) as React.ReactElement<{
    children?: React.ReactNode
  }>
  const contentValue =
    typeof content === "function" ? content(firstChild.props.children) : content

  return React.cloneElement(firstChild, { children: contentValue })
}

const TabNavigation = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitives.Root>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitives.Root>,
    "orientation" | "defaultValue" | "dir"
  >
>(({ className, children, ...props }, forwardedRef) => (
  <NavigationMenuPrimitives.Root
    ref={forwardedRef}
    {...props}
    tremor-id="tremor-raw"
    asChild={false}
  >
    <NavigationMenuPrimitives.List
      className={cx(
        // base
        "flex items-center justify-start whitespace-nowrap border-b [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        // border color
        "border-warm-grey-2/20 dark:border-warm-grey-1/20",
        className,
      )}
    >
      {children}
    </NavigationMenuPrimitives.List>
  </NavigationMenuPrimitives.Root>
))

TabNavigation.displayName = "TabNavigation"

const TabNavigationLink = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitives.Link>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitives.Link>,
    "onSelect"
  > & { disabled?: boolean }
>(({ asChild, disabled, className, children, ...props }, forwardedRef) => (
  <NavigationMenuPrimitives.Item className="flex" aria-disabled={disabled}>
    <NavigationMenuPrimitives.Link
      aria-disabled={disabled}
      className={cx(
        "group relative flex shrink-0 select-none items-center justify-center",
        disabled ? "pointer-events-none" : "",
      )}
      ref={forwardedRef}
      onSelect={() => {}}
      asChild={asChild}
      {...props}
    >
      {getSubtree({ asChild, children }, (children) => (
        <span
          className={cx(
            // base
            "flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-3 pb-2 text-sm font-medium transition-all",
            // text color
            "text-warm-grey-2 dark:text-warm-grey-1",
            // hover
            "group-hover:text-warm-grey group-hover:dark:text-warm-white",
            // border hover
            "group-hover:border-warm-grey-2/30 group-hover:dark:border-warm-grey-1/30",
            // selected
            "group-data-[active]:border-warm-grey group-data-[active]:text-warm-grey",
            "group-data-[active]:dark:border-warm-white group-data-[active]:dark:text-warm-white",
            // disabled
            disabled
              ? "pointer-events-none text-warm-grey-2/50 dark:text-warm-grey-1/50"
              : "",
            focusRing,
            className,
          )}
        >
          {children}
        </span>
      ))}
    </NavigationMenuPrimitives.Link>
  </NavigationMenuPrimitives.Item>
))

TabNavigationLink.displayName = "TabNavigationLink"

export { TabNavigation, TabNavigationLink }
