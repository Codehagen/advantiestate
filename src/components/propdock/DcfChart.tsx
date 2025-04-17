"use client"

import React from "react"

import { Card } from "@/components/Card"
import { ComboChart, type TooltipProps } from "@/components/ComboChart"
import { valueFormatter } from "@/lib/formatters"
import { cx } from "@/lib/utils"

interface DcfChartProps {
  rentalIncome: number
  operatingCosts: number
  discountRate: number
  exitYield: number
  years: number
  growthRate?: number
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={cx(
          "overflow-hidden rounded-md text-sm shadow-md",
          "bg-gray-900 dark:bg-gray-800",
        )}
      >
        <div
          className={cx(
            "border-b border-warm-grey/10 px-4 py-2 dark:border-warm-grey-1/10",
          )}
        >
          <p className={cx("font-medium text-warm-grey dark:text-warm-grey-1")}>
            Kontantstrøm
          </p>
        </div>
        <div
          className={cx(
            "space-y-1 bg-warm-grey/5 px-4 py-2 dark:bg-warm-grey/20",
          )}
        >
          {payload.map(({ category, value }, index) => (
            <div
              key={`id-${index}`}
              className="flex items-center justify-between space-x-8"
            >
              <div className="flex items-center space-x-2">
                <span
                  aria-hidden="true"
                  className={cx(
                    "h-[3px] w-3.5 shrink-0 rounded-full",
                    category === "noi"
                      ? "bg-warm-grey-2 dark:bg-warm-grey-1"
                      : "bg-light-blue",
                  )}
                />
                <p className="whitespace-nowrap text-warm-grey-2 dark:text-warm-grey-1">
                  {category === "noi"
                    ? "Netto driftsinntekt"
                    : "Akkumulert nåverdi"}
                </p>
              </div>
              <p className="whitespace-nowrap text-right tabular-nums text-warm-grey dark:text-warm-grey-1">
                {valueFormatter(value)} kr
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function DcfChart({
  rentalIncome,
  operatingCosts,
  discountRate,
  exitYield,
  years = 5,
  growthRate = 2.0,
}: DcfChartProps) {
  // Calculate DCF data
  const data = React.useMemo(() => {
    const result = []
    let cumulativePV = 0

    for (let year = 1; year <= years; year++) {
      // Calculate growing NOI
      const growthFactor = Math.pow(1 + growthRate / 100, year - 1)
      const yearlyIncome = rentalIncome * growthFactor
      const yearlyOperatingCosts = operatingCosts * growthFactor
      const noi = yearlyIncome - yearlyOperatingCosts

      // Calculate terminal value in final year
      const terminalValue = year === years ? noi / (exitYield / 100) : 0

      // Calculate present value
      const discountFactor = Math.pow(1 + discountRate / 100, year)
      const presentValue = (noi + terminalValue) / discountFactor
      cumulativePV += presentValue

      result.push({
        year: `År ${year}`,
        noi: noi,
        terminalValue: terminalValue,
        presentValue: presentValue,
        cumulativePV: cumulativePV,
      })
    }

    return result
  }, [rentalIncome, operatingCosts, discountRate, exitYield, years, growthRate])

  const [tooltipData, setTooltipData] = React.useState<TooltipProps | null>(
    null,
  )

  const payload = tooltipData?.payload?.[0]?.payload
  const currentNOI = payload?.noi ?? data[data.length - 1].noi
  const currentPV = payload?.presentValue ?? data[data.length - 1].presentValue
  const currentTerminalValue =
    payload?.terminalValue ?? data[data.length - 1].terminalValue

  return (
    <Card className="mt-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-warm-grey dark:text-warm-white">
          Diskontert kontantstrøm (DCF)
        </h3>
        <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
          Viser netto driftsinntekter og nåverdi over tid
        </p>
      </div>
      <div className="mt-6 flex gap-8">
        <div>
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Netto driftsinntekt (NOI)
          </p>
          <p className="mt-2 text-xl font-semibold text-warm-grey dark:text-warm-white">
            {valueFormatter(currentNOI)} kr
          </p>
        </div>
        <div>
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Nåverdi
          </p>
          <p className="mt-2 text-xl font-semibold text-warm-grey dark:text-warm-white">
            {valueFormatter(currentPV)} kr
          </p>
        </div>
        {currentTerminalValue > 0 && (
          <div>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Terminal verdi
            </p>
            <p className="mt-2 text-xl font-semibold text-warm-grey dark:text-warm-white">
              {valueFormatter(currentTerminalValue)} kr
            </p>
          </div>
        )}
      </div>
      <ComboChart
        data={data}
        index="year"
        enableBiaxial={true}
        barSeries={{
          colors: ["warm-grey-2"],
          categories: ["noi"],
          valueFormatter: (v) => `${valueFormatter(v)} kr`,
          yAxisLabel: "Netto driftsinntekt",
        }}
        lineSeries={{
          colors: ["light-blue"],
          categories: ["cumulativePV"],
          valueFormatter: (v) => `${valueFormatter(v)} kr`,
          yAxisLabel: "Akkumulert nåverdi",
        }}
        tooltipCallback={(props) => {
          if (props.active) {
            setTooltipData((prev) => {
              if (prev?.label === props.label) return prev
              return props
            })
          } else {
            setTooltipData(null)
          }
        }}
        customTooltip={CustomTooltip}
      />
    </Card>
  )
}
