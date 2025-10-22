"use client"

import { Card } from "@/components/Card"
import { SimulationStats } from "@/types/simulation"
import { RiMoneyDollarCircleLine } from "@remixicon/react"

interface InvestmentParametersProps {
  stats: SimulationStats
  onStatsChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof SimulationStats,
  ) => void
}

export function InvestmentParameters({
  stats,
  onStatsChange,
}: InvestmentParametersProps) {
  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <RiMoneyDollarCircleLine className="size-5 text-warm-grey-2 dark:text-warm-grey-1" />
          <div>
            <h3 className="font-medium text-warm-grey dark:text-warm-white">
              Investeringsparametere
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Juster parametere for å simulere ulike scenarioer
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div>
            <label className="text-sm font-medium text-warm-grey dark:text-warm-white">
              Kjøpspris (NOK)
            </label>
            <input
              type="number"
              value={stats.purchasePrice}
              onChange={(e) => onStatsChange(e, "purchasePrice")}
              className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-warm-grey dark:text-warm-white">
                Lånebeløp (NOK)
              </label>
              <input
                type="number"
                value={stats.loanAmount}
                onChange={(e) => onStatsChange(e, "loanAmount")}
                className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-warm-grey dark:text-warm-white">
                Rente (%)
              </label>
              <input
                type="number"
                value={stats.interestRate}
                onChange={(e) => onStatsChange(e, "interestRate")}
                step="0.1"
                className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-warm-grey dark:text-warm-white">
                Leieinntekter (NOK/år)
              </label>
              <input
                type="number"
                value={stats.rentalIncome}
                onChange={(e) => onStatsChange(e, "rentalIncome")}
                className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-warm-grey dark:text-warm-white">
                Utleiegrad (%)
              </label>
              <input
                type="number"
                value={stats.occupancyRate}
                onChange={(e) => onStatsChange(e, "occupancyRate")}
                max="100"
                className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-warm-grey dark:text-warm-white">
                Driftskostnader (NOK/år)
              </label>
              <input
                type="number"
                value={stats.operatingCosts}
                onChange={(e) => onStatsChange(e, "operatingCosts")}
                className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-warm-grey dark:text-warm-white">
                Vedlikeholdskostnader (NOK/år)
              </label>
              <input
                type="number"
                value={stats.maintenanceCosts}
                onChange={(e) => onStatsChange(e, "maintenanceCosts")}
                className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-warm-grey dark:text-warm-white">
                Årlig leieprisvekst (%)
              </label>
              <input
                type="number"
                value={stats.rentGrowth}
                onChange={(e) => onStatsChange(e, "rentGrowth")}
                step="0.1"
                className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-warm-grey dark:text-warm-white">
                Exit Yield (%)
              </label>
              <input
                type="number"
                value={stats.exitYield}
                onChange={(e) => onStatsChange(e, "exitYield")}
                step="0.1"
                className="mt-1 block w-full rounded-md border border-warm-grey-2/20 bg-warm-white px-3 py-2 text-warm-grey shadow-sm focus:border-light-blue focus:outline-none focus:ring-1 focus:ring-light-blue dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
