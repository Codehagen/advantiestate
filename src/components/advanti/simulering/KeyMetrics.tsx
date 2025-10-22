"use client"

import { Card } from "@/components/Card"
import { RiPieChartLine } from "@remixicon/react"

interface KeyMetricsProps {
  effectiveRentalIncome: number
  totalOperatingCosts: number
  netOperatingIncome: number
  annualDebtService: number
  cashFlow: number
  currentYield: number
}

export function KeyMetrics({
  effectiveRentalIncome,
  totalOperatingCosts,
  netOperatingIncome,
  annualDebtService,
  cashFlow,
  currentYield,
}: KeyMetricsProps) {
  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <RiPieChartLine className="size-5 text-warm-grey-2 dark:text-warm-grey-1" />
          <div>
            <h3 className="font-medium text-warm-grey dark:text-warm-white">
              Nøkkeltall
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Beregnede verdier basert på input
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30">
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Effektiv leieinntekt
            </p>
            <p className="mt-1 text-lg font-medium text-warm-grey dark:text-warm-white">
              {new Intl.NumberFormat("no").format(
                Math.round(effectiveRentalIncome),
              )}{" "}
              NOK
            </p>
          </div>

          <div className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30">
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Totale driftskostnader
            </p>
            <p className="mt-1 text-lg font-medium text-warm-grey dark:text-warm-white">
              {new Intl.NumberFormat("no").format(
                Math.round(totalOperatingCosts),
              )}{" "}
              NOK
            </p>
          </div>

          <div className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30">
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Netto driftsinntekt
            </p>
            <p className="mt-1 text-lg font-medium text-warm-grey dark:text-warm-white">
              {new Intl.NumberFormat("no").format(
                Math.round(netOperatingIncome),
              )}{" "}
              NOK
            </p>
          </div>

          <div className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30">
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Årlig gjeldsbetjening
            </p>
            <p className="mt-1 text-lg font-medium text-warm-grey dark:text-warm-white">
              {new Intl.NumberFormat("no").format(
                Math.round(annualDebtService),
              )}{" "}
              NOK
            </p>
          </div>

          <div className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30">
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Kontantstrøm
            </p>
            <p className="mt-1 text-lg font-medium text-warm-grey dark:text-warm-white">
              {new Intl.NumberFormat("no").format(Math.round(cashFlow))} NOK
            </p>
          </div>

          <div className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30">
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Direkteavkastning
            </p>
            <p className="mt-1 text-lg font-medium text-warm-grey dark:text-warm-white">
              {currentYield.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
