"use client"

import { Badge } from "@/components/Badge"
import DisplayChartLanding from "@/components/ui/Display-chart-landing"
import Link from "next/link"
import { Balancer } from "react-wrap-balancer"

export default function AnalyticsDashboard() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-40">
      <div className="flex flex-col items-center gap-6 text-center">
        <Badge>Markedsinnsikt</Badge>
        <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
          Databaserte beslutninger i sanntid
        </h2>
        <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
          <Balancer>
            Få tilgang til omfattende markedsdata og analyser for
            næringseiendom. Vår plattform gir deg sanntidsinnsikt i
            markedstrender, yielder, og sammenlignbare transaksjoner for bedre
            investeringsbeslutninger.
          </Balancer>
        </p>
        <div className="mb-2 mt-6 flex flex-wrap gap-4">
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-md bg-warm-grey px-5 py-2.5 text-sm font-medium text-warm-white shadow-lg transition-colors hover:bg-warm-grey-2 dark:bg-warm-grey-2 dark:hover:bg-warm-grey-1"
          >
            Utforsk markedsdata
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-md border border-warm-grey/20 bg-transparent px-5 py-2.5 text-sm font-medium text-warm-grey shadow-lg transition-colors hover:bg-warm-grey/5 dark:border-warm-white/20 dark:text-warm-white dark:hover:bg-warm-white/5"
          >
            Last ned markedsrapport
          </Link>
        </div>
        <div className="w-full max-w-5xl">
          <DisplayChartLanding />
        </div>
      </div>
    </section>
  )
}
