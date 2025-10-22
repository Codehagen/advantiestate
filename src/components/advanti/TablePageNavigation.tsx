"use client"

import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation"
import { Divider } from "@/components/ui/Divider"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationItem {
  href: string
  label: string
  description?: string
}

const navigationItems: NavigationItem[] = [
  {
    href: "/advanti/dashboard",
    label: "Alle eiendommer",
  },
  {
    href: "/advanti/dashboard/map",
    label: "Kart",
  },
]

export function TablePageNavigation() {
  const pathname = usePathname()

  return (
    <>
      <div className="flex flex-col gap-4 pt-32 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
            Næringseiendommer
          </h1>
          <p className="text-warm-grey-2 sm:text-sm/6 dark:text-warm-grey-1">
            Oversikt over alle næringseiendommer
          </p>
        </div>
      </div>
      <Divider className="my-4" />
      <div>
        <TabNavigation className="border-b border-warm-grey-2/20 dark:border-warm-grey-1/20">
          <div className="flex items-center">
            {navigationItems.map((item) => (
              <TabNavigationLink
                key={item.href}
                className="inline-flex gap-2"
                asChild
                active={
                  pathname === item.href ||
                  (item.href === "/advanti/table" &&
                    pathname === "/advanti/table/")
                }
              >
                <Link href={item.href}>{item.label}</Link>
              </TabNavigationLink>
            ))}
          </div>
        </TabNavigation>
      </div>
    </>
  )
}
