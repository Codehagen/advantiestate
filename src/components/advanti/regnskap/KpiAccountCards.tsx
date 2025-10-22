"use client"

import { cx } from "@/lib/utils"

interface KpiData {
  name: string
  stat: string
  previousStat: string
  change: string
  changeType: "positive" | "negative"
  year?: string
}

interface KpiAccountCardsProps {
  data: KpiData[]
}

export default function KpiAccountCards({ data }: KpiAccountCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <div
          key={item.name}
          className="relative rounded-md border border-warm-grey-2/20 bg-warm-white px-4 py-3 shadow-sm dark:border-warm-grey-1/20 dark:bg-warm-grey"
        >
          <span
            className={cx(
              "absolute inset-x-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-md",
              item.changeType === "positive"
                ? "bg-emerald-500 dark:bg-emerald-500"
                : "bg-red-500 dark:bg-red-500",
            )}
            aria-hidden="true"
          />
          <div>
            <p className="flex items-center justify-between gap-2">
              <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                {item.name} {item.year}
              </span>
              <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                fra {item.previousStat}
              </span>
            </p>
            <p className="flex items-center justify-between gap-2">
              <span className="text-lg font-medium text-warm-grey dark:text-warm-white">
                {item.stat}
              </span>
              <span
                className={cx(
                  "text-sm font-medium",
                  item.changeType === "positive"
                    ? "text-emerald-700 dark:text-emerald-500"
                    : "text-red-700 dark:text-red-500",
                )}
              >
                {item.changeType === "positive" ? "+" : "-"}
                {item.change}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
