"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { RiArrowRightUpLine, RiPlayCircleLine } from "@remixicon/react"
import { Balancer } from "react-wrap-balancer"

export default function CtaMiddle() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-40">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div>
            <Badge>Neste generasjons eiendomsanalyse</Badge>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="mb-2 text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-left text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
              Ta bedre beslutninger med data
            </h2>
            <p className="text-grey-800 max-w-md text-left text-lg leading-relaxed tracking-tight dark:text-warm-grey-1">
              <Balancer>
                Propdock kombinerer avansert analyse med sanntids markedsdata
                for å gi deg det komplette beslutningsgrunnlaget. Simuler ulike
                scenarioer, analyser yielder og optimaliser din
                eiendomsportefølje med våre kraftige verktøy.
              </Balancer>
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button variant="secondary" className="group gap-2">
              Se demo
              <RiPlayCircleLine className="size-4 transition-transform group-hover:scale-110" />
            </Button>
            <Button className="group gap-2">
              Prøv gratis
              <RiArrowRightUpLine className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="aspect-square rounded-xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
            {/* DCF Analysis Chart Placeholder */}
          </div>
          <div className="row-span-2 rounded-xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
            {/* Portfolio Overview Dashboard Placeholder */}
          </div>
          <div className="aspect-square rounded-xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
            {/* Market Analysis Graph Placeholder */}
          </div>
        </div>
      </div>
    </section>
  )
}
