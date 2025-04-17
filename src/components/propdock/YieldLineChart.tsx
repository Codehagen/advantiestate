"use client"

import { Card } from "@/components/Card"
import { LineChart } from "@/components/LineChart"
import { valueFormatter } from "@/lib/formatters"

interface YieldLineChartProps {
  netOperatingIncome: number
  currentYield: number
}

export function YieldLineChart({
  netOperatingIncome,
  currentYield,
}: YieldLineChartProps) {
  // Generate data points for yield rates from 4% to 12%
  const data = Array.from({ length: 17 }, (_, i) => {
    const yieldRate = i * 0.5 + 4 // Start at 4%, increment by 0.5% up to 12%
    const propertyValue = netOperatingIncome / (yieldRate / 100)
    return {
      yield: yieldRate,
      value: propertyValue,
    }
  })

  const currentValue = netOperatingIncome / (currentYield / 100)
  const valueAtHigherYield = netOperatingIncome / ((currentYield + 1) / 100)
  const valueAtLowerYield = netOperatingIncome / ((currentYield - 1) / 100)
  const valueDiffHigher = currentValue - valueAtHigherYield
  const valueDiffLower = valueAtLowerYield - currentValue
  const percentDiffHigher = (valueDiffHigher / currentValue) * 100
  const percentDiffLower = (valueDiffLower / currentValue) * 100

  return (
    <Card className="mt-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-warm-grey dark:text-warm-white">
          Yield-sensitivitet
        </h3>
        <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
          Viser hvordan endringer i yield påvirker eiendomsverdien
        </p>
      </div>
      <div className="mt-6">
        <LineChart
          data={data}
          index="yield"
          categories={["value"]}
          colors={["light-blue"]}
          valueFormatter={(value) => `${valueFormatter(value)} kr`}
          yAxisWidth={80}
          showLegend={false}
          className="h-72"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-warm-white/50 p-3 ring-1 ring-warm-grey-2/20 dark:bg-warm-grey/30 dark:ring-warm-grey-1/20">
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Ved {(currentYield - 1).toFixed(1)}% yield
          </p>
          <p className="mt-1 font-medium text-warm-grey dark:text-warm-white">
            {valueFormatter(valueAtLowerYield)} kr
          </p>
          <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            +{percentDiffLower.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-lg bg-warm-white/50 p-3 ring-1 ring-warm-grey-2/20 dark:bg-warm-grey/30 dark:ring-warm-grey-1/20">
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Ved {currentYield.toFixed(1)}% yield (nå)
          </p>
          <p className="mt-1 font-medium text-warm-grey dark:text-warm-white">
            {valueFormatter(currentValue)} kr
          </p>
        </div>
        <div className="rounded-lg bg-warm-white/50 p-3 ring-1 ring-warm-grey-2/20 dark:bg-warm-grey/30 dark:ring-warm-grey-1/20">
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Ved {(currentYield + 1).toFixed(1)}% yield
          </p>
          <p className="mt-1 font-medium text-warm-grey dark:text-warm-white">
            {valueFormatter(valueAtHigherYield)} kr
          </p>
          <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
            {percentDiffHigher.toFixed(1)}%
          </p>
        </div>
      </div>
    </Card>
  )
}
