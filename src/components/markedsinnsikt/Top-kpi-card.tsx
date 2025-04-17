// 'use client';

import { RiArrowDownSFill, RiArrowUpSFill } from "@remixicon/react"

import { cx } from "@/lib/utils"

import { Card } from "@/components/Card"

const data = [
  {
    name: "Transaksjonsvolum 2024",
    stat: "12,4 mrd",
    previousStat: "10,8 mrd",
    change: "14,8%",
    changeType: "positive",
    description: "sammenlignet med 2023",
  },
  {
    name: "5 års SWAP rente",
    stat: "3,92%",
    previousStat: "4,30%",
    change: "38",
    changeType: "negative",
    description: "basispunkter siste 3 måneder",
  },
  {
    name: "Prime yield kontor",
    stat: "4,75%",
    previousStat: "4,50%",
    change: "25",
    changeType: "positive",
    description: "basispunkter siste 12 måneder",
  },
]

export default function TopKpiCard() {
  return (
    <>
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <Card key={item.name}>
            <dt className="text-warm-grey-2 dark:text-warm-grey-1 text-sm font-medium">
              {item.name}
            </dt>
            <dd className="mt-1 flex items-baseline space-x-2.5">
              <p className="text-warm-grey dark:text-warm-white text-3xl font-semibold">
                {item.stat}
              </p>
            </dd>
            <dd className="mt-4 flex items-center space-x-2">
              <p className="flex items-center space-x-0.5">
                {item.changeType === "positive" ? (
                  <RiArrowUpSFill
                    className="size-5 shrink-0 text-emerald-700 dark:text-emerald-500"
                    aria-hidden={true}
                  />
                ) : (
                  <RiArrowDownSFill
                    className="size-5 shrink-0 text-emerald-700 dark:text-emerald-500"
                    aria-hidden={true}
                  />
                )}
                <span
                  className={cx(
                    item.changeType === "positive"
                      ? "text-emerald-700 dark:text-emerald-500"
                      : "text-emerald-700 dark:text-emerald-500",
                    "text-sm font-medium",
                  )}
                >
                  {item.change}
                  {item.name.includes("SWAP") || item.name.includes("yield")
                    ? " bp"
                    : "%"}
                </span>
              </p>
              <p className="text-warm-grey-2 dark:text-warm-grey-1 text-sm">
                {item.description}
              </p>
            </dd>
          </Card>
        ))}
      </dl>
    </>
  )
}
