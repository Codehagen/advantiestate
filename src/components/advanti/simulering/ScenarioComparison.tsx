"use client"

import { Card } from "@/components/Card"
import { cx } from "@/lib/utils"
import { SimulationStats } from "@/types/simulation"

interface ScenarioComparisonProps {
  scenarios: Array<{
    id: string
    name: string
    stats: SimulationStats
  }>
}

interface ComparisonMetric {
  label: string
  getValue: (stats: SimulationStats) => number
  format: (value: number) => string
  unit: string
  compareValues?: (a: number, b: number) => "positive" | "negative" | "neutral"
}

const metrics: ComparisonMetric[] = [
  {
    label: "Kjøpspris",
    getValue: (stats) => stats.purchasePrice,
    format: (value) => new Intl.NumberFormat("no").format(value),
    unit: "NOK",
  },
  {
    label: "Lånefinansiering",
    getValue: (stats) => (stats.loanAmount / stats.purchasePrice) * 100,
    format: (value) => value.toFixed(1),
    unit: "%",
    compareValues: (a, b) =>
      a < b ? "positive" : a > b ? "negative" : "neutral",
  },
  {
    label: "Effektiv leieinntekt",
    getValue: (stats) => (stats.rentalIncome * stats.occupancyRate) / 100,
    format: (value) => new Intl.NumberFormat("no").format(value),
    unit: "NOK/år",
    compareValues: (a, b) =>
      a > b ? "positive" : a < b ? "negative" : "neutral",
  },
  {
    label: "Utleiegrad",
    getValue: (stats) => stats.occupancyRate,
    format: (value) => value.toFixed(1),
    unit: "%",
    compareValues: (a, b) =>
      a > b ? "positive" : a < b ? "negative" : "neutral",
  },
  {
    label: "Totale driftskostnader",
    getValue: (stats) =>
      stats.operatingCosts +
      stats.maintenanceCosts +
      stats.propertyTax +
      stats.insuranceCosts,
    format: (value) => new Intl.NumberFormat("no").format(value),
    unit: "NOK/år",
    compareValues: (a, b) =>
      a < b ? "positive" : a > b ? "negative" : "neutral",
  },
  {
    label: "Netto driftsinntekt",
    getValue: (stats) => {
      const effectiveRental = (stats.rentalIncome * stats.occupancyRate) / 100
      const totalCosts =
        stats.operatingCosts +
        stats.maintenanceCosts +
        stats.propertyTax +
        stats.insuranceCosts
      return effectiveRental - totalCosts
    },
    format: (value) => new Intl.NumberFormat("no").format(value),
    unit: "NOK/år",
    compareValues: (a, b) =>
      a > b ? "positive" : a < b ? "negative" : "neutral",
  },
  {
    label: "Direkteavkastning",
    getValue: (stats) => {
      const effectiveRental = (stats.rentalIncome * stats.occupancyRate) / 100
      const totalCosts =
        stats.operatingCosts +
        stats.maintenanceCosts +
        stats.propertyTax +
        stats.insuranceCosts
      const noi = effectiveRental - totalCosts
      return (noi / stats.purchasePrice) * 100
    },
    format: (value) => value.toFixed(2),
    unit: "%",
    compareValues: (a, b) =>
      a > b ? "positive" : a < b ? "negative" : "neutral",
  },
  {
    label: "Gjeldskostnad",
    getValue: (stats) => {
      const monthlyPayment =
        (stats.loanAmount *
          (stats.interestRate / 100 / 12) *
          Math.pow(1 + stats.interestRate / 100 / 12, stats.loanTerm * 12)) /
        (Math.pow(1 + stats.interestRate / 100 / 12, stats.loanTerm * 12) - 1)
      return monthlyPayment * 12
    },
    format: (value) => new Intl.NumberFormat("no").format(value),
    unit: "NOK/år",
    compareValues: (a, b) =>
      a < b ? "positive" : a > b ? "negative" : "neutral",
  },
  {
    label: "Kontantstrøm",
    getValue: (stats) => {
      const effectiveRental = (stats.rentalIncome * stats.occupancyRate) / 100
      const totalCosts =
        stats.operatingCosts +
        stats.maintenanceCosts +
        stats.propertyTax +
        stats.insuranceCosts
      const noi = effectiveRental - totalCosts
      const monthlyPayment =
        (stats.loanAmount *
          (stats.interestRate / 100 / 12) *
          Math.pow(1 + stats.interestRate / 100 / 12, stats.loanTerm * 12)) /
        (Math.pow(1 + stats.interestRate / 100 / 12, stats.loanTerm * 12) - 1)
      return noi - monthlyPayment * 12
    },
    format: (value) => new Intl.NumberFormat("no").format(value),
    unit: "NOK/år",
    compareValues: (a, b) =>
      a > b ? "positive" : a < b ? "negative" : "neutral",
  },
  {
    label: "Kontantavkastning",
    getValue: (stats) => {
      const effectiveRental = (stats.rentalIncome * stats.occupancyRate) / 100
      const totalCosts =
        stats.operatingCosts +
        stats.maintenanceCosts +
        stats.propertyTax +
        stats.insuranceCosts
      const noi = effectiveRental - totalCosts
      const monthlyPayment =
        (stats.loanAmount *
          (stats.interestRate / 100 / 12) *
          Math.pow(1 + stats.interestRate / 100 / 12, stats.loanTerm * 12)) /
        (Math.pow(1 + stats.interestRate / 100 / 12, stats.loanTerm * 12) - 1)
      const cashFlow = noi - monthlyPayment * 12
      return (cashFlow / (stats.purchasePrice - stats.loanAmount)) * 100
    },
    format: (value) => value.toFixed(2),
    unit: "%",
    compareValues: (a, b) =>
      a > b ? "positive" : a < b ? "negative" : "neutral",
  },
  {
    label: "Forventet verdivekst",
    getValue: (stats) => stats.rentGrowth,
    format: (value) => value.toFixed(1),
    unit: "%/år",
    compareValues: (a, b) =>
      a > b ? "positive" : a < b ? "negative" : "neutral",
  },
  {
    label: "Exit Yield",
    getValue: (stats) => stats.exitYield,
    format: (value) => value.toFixed(2),
    unit: "%",
    compareValues: (a, b) =>
      a < b ? "positive" : a > b ? "negative" : "neutral",
  },
]

export function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  if (scenarios.length === 0) return null

  const baseScenario = scenarios[0]
  const comparisonScenarios = scenarios.slice(1)

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-warm-grey dark:text-warm-white">
            Sammenligning av scenarioer
          </h3>
          <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Sammenligner {scenarios.length} scenarioer
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 text-left text-sm font-medium text-warm-grey dark:text-warm-white">
                  Metrikk
                </th>
                {scenarios.map((scenario) => (
                  <th
                    key={scenario.id}
                    className="px-4 py-2 text-left text-sm font-medium text-warm-grey dark:text-warm-white"
                  >
                    {scenario.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-grey-2/20 dark:divide-warm-grey-1/20">
              {metrics.map((metric) => (
                <tr key={metric.label}>
                  <td className="py-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                    {metric.label}
                  </td>
                  {scenarios.map((scenario) => {
                    const value = metric.getValue(scenario.stats)
                    const baseValue = metric.getValue(baseScenario.stats)
                    const comparison = metric.compareValues?.(value, baseValue)

                    return (
                      <td
                        key={scenario.id}
                        className="px-4 py-2 text-sm tabular-nums"
                      >
                        <span
                          className={cx(
                            "font-medium",
                            comparison === "positive"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : comparison === "negative"
                                ? "text-red-600 dark:text-red-400"
                                : "text-warm-grey dark:text-warm-white",
                          )}
                        >
                          {metric.format(value)} {metric.unit}
                        </span>
                        {comparison && scenario !== baseScenario && (
                          <span
                            className={cx(
                              "ml-2 text-xs",
                              comparison === "positive"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400",
                            )}
                          >
                            {comparison === "positive" ? "+" : "-"}
                            {Math.abs(
                              ((value - baseValue) / baseValue) * 100,
                            ).toFixed(1)}
                            %
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
