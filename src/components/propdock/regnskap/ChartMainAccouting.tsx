"use client"

import { LineChart } from "@/components/LineChart"
import { Divider } from "@/components/ui/Divider"
import { cx } from "@/lib/utils"

interface ChartData {
  date: string
  "Sum driftsinntekter": number
  Driftsresultat: number
}

interface SummaryItem {
  name: string
  value: string
  bgColor: string
}

interface ChartMainAccountingProps {
  chartData: ChartData[]
  summaryData: SummaryItem[]
  period: string
}

export default function ChartMainAccounting({
  chartData,
  summaryData,
  period,
}: ChartMainAccountingProps) {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-warm-grey dark:text-warm-white">
            Regnskap
          </h2>
          <p className="text-warm-grey-2 sm:text-sm/6 dark:text-warm-grey-1">
            {period}
          </p>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-4">
          <LineChart
            data={chartData}
            index="date"
            categories={["Sum driftsinntekter", "Driftsresultat"]}
            colors={["light-blue", "warm-grey-2"]}
            valueFormatter={(value) => `${value}`}
            yAxisWidth={45}
            showLegend={false}
            showGridLines={true}
            minValue={-50}
            maxValue={150}
            className="h-[400px]"
          />
          <p className="mt-2 text-center text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Beløp i hele 1000
          </p>
        </div>
        <div className="lg:col-span-1">
          <ul role="list" className="space-y-6">
            {summaryData.map((item) => (
              <li key={item.name} className="flex space-x-3">
                <span
                  className={cx(item.bgColor, "w-1 shrink-0 rounded")}
                  aria-hidden={true}
                />
                <div className="flex w-full flex-col gap-1">
                  <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                    {item.name}
                  </p>
                  <p className="font-semibold text-warm-grey dark:text-warm-white">
                    {item.value}
                    {item.name !== "Valuta" ? " MNOK" : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
