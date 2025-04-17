"use client"

import { Badge } from "@/components/Badge"
import {
  RiArrowRightLine,
  RiBarChartBoxLine,
  RiBuildingLine,
  RiDatabaseLine,
  RiLineChartLine,
  RiPieChartLine,
  RiStackLine,
} from "@remixicon/react"
import Link from "next/link"
import { Balancer } from "react-wrap-balancer"

const features = [
  {
    title: "Avansert verdivurdering",
    description:
      "Omfattende verktøy for DCF-analyse, yield-beregninger og sensitivitetsanalyser.",
    icon: RiLineChartLine,
    href: "/tjenester",
  },
  {
    title: "Markedsanalyse",
    description:
      "Få innsikt i markedstrender, sammenlignbare eiendommer og demografiske data.",
    icon: RiPieChartLine,
    href: "/tjenester",
  },
  {
    title: "Porteføljestyring",
    description:
      "Oversikt over eiendomsporteføljen med nøkkeltall, ytelse og optimeringsmuligheter.",
    icon: RiBuildingLine,
    href: "/tjenester",
  },
  {
    title: "Scenariomodellering",
    description:
      "Simuler ulike investeringsscenarier og sammenlign resultater for bedre beslutninger.",
    icon: RiStackLine,
    href: "/tjenester",
  },
  {
    title: "Markedsdata",
    description:
      "Tilgang til sanntidsdata og markedsinformasjon for bedre analyser og beslutninger.",
    icon: RiDatabaseLine,
    href: "/tjenester",
  },
  {
    title: "Finansiell analyse",
    description:
      "Detaljerte finansielle beregninger inkludert yield, ROI og kontantstrømanalyser.",
    icon: RiBarChartBoxLine,
    href: "/tjenester",
  },
]

export default function Features2() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-40">
      <div className="flex flex-col items-center gap-6 text-center">
        <Badge>Funksjoner</Badge>
        <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
          Kraftige verktøy for eiendomsanalyse
        </h2>
        <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
          <Balancer>
            Propdock gir deg avanserte analyseverktøy og markedsinnsikt for
            bedre investeringsbeslutninger i næringseiendom. Alt samlet på én
            plattform.
          </Balancer>
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group relative flex flex-col gap-4 rounded-xl p-6 transition-all hover:bg-warm-grey/[2.5%] dark:hover:bg-warm-grey-3/50"
          >
            <div className="flex size-12 items-center justify-center rounded-lg bg-warm-grey/5 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:ring-warm-white/5">
              <feature.icon className="size-6 text-warm-grey transition-transform group-hover:scale-110 dark:text-warm-white" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-warm-grey dark:text-warm-white">
                {feature.title}
                <RiArrowRightLine className="size-4 transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="text-balance text-base text-warm-grey-2 dark:text-warm-grey-1">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
