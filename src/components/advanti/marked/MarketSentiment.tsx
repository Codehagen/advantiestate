"use client"

import { Card } from "@/components/Card"
import { cx } from "@/lib/utils"
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiBuilding2Line,
  RiMoneyDollarCircleLine,
  RiRoadMapLine,
  RiUserLine,
} from "@remixicon/react"

interface SentimentIndicator {
  name: string
  score: number
  trend: "up" | "down" | "neutral"
  description: string
  icon: React.ReactNode
}

const indicators: SentimentIndicator[] = [
  {
    name: "Investeringsattraktivitet",
    score: 8.5,
    trend: "up",
    description: "Høy interesse fra investorer, særlig innen logistikk",
    icon: <RiMoneyDollarCircleLine className="size-5" />,
  },
  {
    name: "Markedslikviditet",
    score: 7.2,
    trend: "up",
    description: "God omsetning av næringseiendom",
    icon: <RiBuilding2Line className="size-5" />,
  },
  {
    name: "Utviklingspotensial",
    score: 8.0,
    trend: "up",
    description: "Flere større utviklingsprosjekter planlagt",
    icon: <RiRoadMapLine className="size-5" />,
  },
  {
    name: "Demografisk utvikling",
    score: 6.8,
    trend: "neutral",
    description: "Stabil befolkningsvekst",
    icon: <RiUserLine className="size-5" />,
  },
]

export function MarketSentiment() {
  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-warm-grey dark:text-warm-white">
            Markedssentiment
          </h3>
          <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Nøkkelindikatorer for markedets tilstand og utvikling
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {indicators.map((indicator) => (
            <div
              key={indicator.name}
              className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-warm-grey-2 dark:text-warm-grey-1">
                    {indicator.icon}
                  </div>
                  <div>
                    <p className="font-medium text-warm-grey dark:text-warm-white">
                      {indicator.name}
                    </p>
                    <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                      {indicator.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={cx(
                      "text-lg font-semibold",
                      indicator.score >= 8
                        ? "text-emerald-600 dark:text-emerald-500"
                        : indicator.score >= 6
                          ? "text-amber-600 dark:text-amber-500"
                          : "text-red-600 dark:text-red-500",
                    )}
                  >
                    {indicator.score}
                  </span>
                  {indicator.trend === "up" ? (
                    <RiArrowUpLine className="text-emerald-600 dark:text-emerald-500" />
                  ) : indicator.trend === "down" ? (
                    <RiArrowDownLine className="text-red-600 dark:text-red-500" />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
