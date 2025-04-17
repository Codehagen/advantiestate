"use client"

import { Card } from "@/components/Card"
import { cx } from "@/lib/utils"

const propertyTypes = [
  {
    category: "Kontor",
    totalArea: 125430,
    percentage: 35,
  },
  {
    category: "Handel",
    totalArea: 89500,
    percentage: 25,
  },
  {
    category: "Lager/Logistikk",
    totalArea: 71600,
    percentage: 20,
  },
  {
    category: "Industri",
    totalArea: 53700,
    percentage: 15,
  },
  {
    category: "Kombinasjon",
    totalArea: 17900,
    percentage: 5,
  },
]

interface StatisticProps {
  label: string
  value: string | number
  change: number
  unit?: string
}

function Statistic({ label, value, change, unit }: StatisticProps) {
  return (
    <div>
      <dt className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
        {label}
      </dt>
      <dd className="mt-1 flex items-baseline">
        <span className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
          {typeof value === "number" ? value.toLocaleString("no") : value}
          {unit}
        </span>
        <span
          className={cx(
            "ml-2 text-sm",
            change > 0
              ? "text-emerald-600 dark:text-emerald-500"
              : "text-red-600 dark:text-red-500",
          )}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </span>
      </dd>
    </div>
  )
}

export function MarketStatistics() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-8">
      <Card className="lg:col-span-5">
        <h3 className="font-medium text-warm-grey dark:text-warm-white">
          Markedsstatistikk
        </h3>
        <dl className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-6">
            <Statistic
              label="Total eiendomsverdi"
              value="12.4"
              unit=" mrd"
              change={8.5}
            />
            <Statistic
              label="Gjennomsnittlig yield"
              value="5.8"
              unit="%"
              change={-0.3}
            />
            <Statistic
              label="Transaksjonsvolum"
              value="850"
              unit=" MNOK"
              change={12}
            />
          </div>

          <div className="space-y-6">
            <Statistic
              label="Totalt areal"
              value="358"
              unit="k m²"
              change={5.2}
            />
            <Statistic label="Utleiegrad" value="95.8" unit="%" change={2.1} />
            <Statistic label="Leietakere" value={284} change={4.8} />
          </div>

          <div className="space-y-6">
            <Statistic
              label="Gj.snitt leie"
              value="1450"
              unit=" kr/m²"
              change={3.2}
            />
            <Statistic label="Ledige lokaler" value={15} change={-25} />
            <Statistic label="Nye kontrakter" value={42} change={15} />
          </div>
        </dl>
      </Card>

      <Card className="lg:col-span-3">
        <h3 className="font-medium text-warm-grey dark:text-warm-white">
          Arealfordeling
        </h3>
        <ol className="mt-4 divide-y divide-warm-grey-2/20 dark:divide-warm-grey-1/20">
          {propertyTypes.map((type, index) => (
            <li
              key={type.category}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  {index + 1}.
                </span>
                <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                  {type.category}
                </span>
              </div>
              <div className="text-sm tabular-nums text-warm-grey-2 dark:text-warm-grey-1">
                {type.percentage}% ({type.totalArea.toLocaleString("no")} m²)
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
