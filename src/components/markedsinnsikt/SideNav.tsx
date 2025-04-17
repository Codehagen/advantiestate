"use client"

import { cx } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Oversikt", href: "/markedsinnsikt" },
  { name: "Rapporter", href: "/markedsinnsikt/rapporter" },
  { name: "Nøkkeltall", href: "/markedsinnsikt/nokkeltall" },
  { name: "Data", href: "/markedsinnsikt/data" },
  { name: "Markedskart", href: "/markedsinnsikt/kart" },
]

export default function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-32 w-64 space-y-1">
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
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
