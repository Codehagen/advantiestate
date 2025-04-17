"use client"

import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation"
import { Divider } from "@/components/ui/Divider"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationItem {
  href: string
  label: string
  description: string
}

const navigationItems: NavigationItem[] = [
  {
    href: "/propdock/eiendom",
    label: "Eiendom",
    description: "Eiendomsinformasjon",
  },
  {
    href: "/propdock/marked",
    label: "Marked",
    description: "Markedsanalyse og områdeinformasjon",
  },
  {
    href: "/propdock/regnskap",
    label: "Regnskap",
    description: "Oversikt over inntekter og kostnader",
  },
  {
    href: "/propdock/leietakere",
    label: "Leietakeroversikt",
    description: "Oversikt over leietakere og kontrakter",
  },
  {
    href: "/propdock/selskap",
    label: "Selskap",
    description: "Selskapsinformasjon og roller",
  },
  {
    href: "/propdock/verdivurdering",
    label: "Verdivurdering",
    description: "Verdivurdering av eiendom",
  },
  {
    href: "/propdock/finansiering",
    label: "Finansiering",
    description: "Finansieringsverktøy og gjeldstrukturering",
  },
  {
    href: "/propdock/simulering",
    label: "Simulering",
    description: "Investeringsscenarioer og simuleringer",
  },
  {
    href: "/propdock/exit-strategi",
    label: "Exit Strategi",
    description: "Exit strategi og realiseringsanalyse",
  },
]

export function PropdockNavigation() {
  const pathname = usePathname()
  const currentPage = navigationItems.find((item) => item.href === pathname)

  return (
    <>
      <div className="flex flex-col gap-4 pt-32 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
            {currentPage?.label}
          </h1>
          <p className="text-warm-grey-2 sm:text-sm/6 dark:text-warm-grey-1">
            {currentPage?.description}
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
                active={pathname === item.href}
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
