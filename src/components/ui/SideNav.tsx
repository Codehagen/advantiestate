"use client"

import { cx } from "@/lib/utils"
import {
  RiBarChartBoxLine,
  RiDatabase2Line,
  RiFileChartLine,
  RiMapLine,
  RiPieChartLine,
} from "@remixicon/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Oversikt",
    href: "/markedsinnsikt",
    icon: RiPieChartLine,
  },
  {
    name: "Rapporter",
    href: "/markedsinnsikt/",
    icon: RiFileChartLine,
  },
  {
    name: "Nøkkeltall",
    href: "/markedsinnsikt/",
    icon: RiBarChartBoxLine,
  },
  {
    name: "Data",
    href: "/markedsinnsikt/",
    icon: RiDatabase2Line,
  },
  {
    name: "Markedskart",
    href: "/markedsinnsikt/",
    icon: RiMapLine,
  },
]

export default function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-32 w-64 space-y-1 pt-8">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cx(
              isActive
                ? "bg-light-blue-1 text-warm-grey dark:bg-warm-grey-3 dark:text-warm-white"
                : "text-warm-grey-2 hover:bg-light-blue-1 hover:text-warm-grey dark:text-warm-grey-1 dark:hover:bg-warm-grey-3 dark:hover:text-warm-white",
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon
              className={cx(
                "size-5 shrink-0 transition-colors",
                isActive
                  ? "text-warm-grey dark:text-warm-white"
                  : "text-warm-grey-2 group-hover:text-warm-grey dark:text-warm-grey-1 dark:group-hover:text-warm-white",
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
