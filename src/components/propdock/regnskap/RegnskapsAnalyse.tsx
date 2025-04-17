"use client"

import { Card } from "@/components/Card"
import { cx } from "@/lib/utils"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import { useState } from "react"

interface AnalysisData {
  year: string
  trendRevenue: number
  trendGrossMargin: number
  grossMargin: number
  operatingResult: number
  operatingCashFlow: number
  profitBeforeTax: number
  subsidiaryValue: number
  equity: number
}

interface MetricProps {
  label: string
  value: number
  description: string
  target: string
  format: "percent" | "decimal"
  status: "good" | "poor"
}

function Metric({
  label,
  value,
  description,
  target,
  format,
  status,
}: MetricProps) {
  return (
    <div
      className={cx(
        "relative rounded-lg border p-4",
        "border-warm-grey-2/20 dark:border-warm-grey-1/20",
        "bg-warm-white/50 dark:bg-warm-grey/30",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-warm-grey dark:text-warm-white">
            {label}
          </h4>
          <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
            {description}
          </p>
        </div>
        <span
          className={cx(
            "rounded-full px-2 py-1 text-xs font-medium",
            status === "good"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
          )}
        >
          {format === "percent" ? `${value.toFixed(1)}%` : value.toFixed(2)}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <svg
          className={cx(
            "size-4 shrink-0",
            status === "good" ? "text-emerald-500" : "text-red-500",
          )}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {status === "good" ? (
            <path
              d="M7.75 12.75L10 15.25L16.25 8.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
          {target}
        </span>
      </div>
    </div>
  )
}

interface RegnskapsAnalyseProps {
  data: AnalysisData[]
}

export function RegnskapsAnalyse({ data }: RegnskapsAnalyseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentYear = data[currentIndex]

  const handlePrevYear = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNextYear = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // Helper function to determine metric status
  const getMetricStatus = (value: number, type: string): "good" | "poor" => {
    switch (type) {
      case "trendRevenue":
        return value > 0 ? "good" : "poor"
      case "grossMargin":
        return value > 10 ? "good" : "poor"
      case "operatingResult":
        return value > 0 ? "good" : "poor"
      case "operatingCashFlow":
        return value > 0 ? "good" : "poor"
      case "profitBeforeTax":
        return value > 0 ? "good" : "poor"
      default:
        return "poor"
    }
  }

  return (
    <Card className="mt-8">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-warm-grey dark:text-warm-white">
              Regnskapsanalyse {currentYear.year}
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Oversikt over selskapets økonomiske nøkkeltall
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevYear}
              disabled={currentIndex === 0}
              className={cx(
                "rounded p-1 hover:bg-warm-white/50 dark:hover:bg-warm-grey/30",
                currentIndex === 0 && "opacity-50",
              )}
            >
              <RiArrowLeftSLine className="size-5" />
            </button>
            <button
              onClick={handleNextYear}
              disabled={currentIndex === data.length - 1}
              className={cx(
                "rounded p-1 hover:bg-warm-white/50 dark:hover:bg-warm-grey/30",
                currentIndex === data.length - 1 && "opacity-50",
              )}
            >
              <RiArrowRightSLine className="size-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <Metric
            label="Omsetningstrend"
            value={currentYear.trendRevenue}
            description="Endring i omsetning fra forrige år"
            target="Bør være > 0%"
            format="percent"
            status={getMetricStatus(currentYear.trendRevenue, "trendRevenue")}
          />
          <Metric
            label="Bruttofortjeneste"
            value={currentYear.grossMargin}
            description="Driftsinntekter minus varekostnad"
            target="Bør være > 10%"
            format="decimal"
            status={getMetricStatus(currentYear.grossMargin, "grossMargin")}
          />
          <Metric
            label="Driftsresultat"
            value={currentYear.operatingResult}
            description="Resultat før finansposter og skatt"
            target="Bør være positivt"
            format="decimal"
            status={getMetricStatus(
              currentYear.operatingResult,
              "operatingResult",
            )}
          />
          <Metric
            label="Kontantstrøm fra drift"
            value={currentYear.operatingCashFlow}
            description="Netto kontantstrøm fra operasjonelle aktiviteter"
            target="Bør være positivt"
            format="decimal"
            status={getMetricStatus(
              currentYear.operatingCashFlow,
              "operatingCashFlow",
            )}
          />
          <Metric
            label="Resultat før skatt"
            value={currentYear.profitBeforeTax}
            description="Resultat før skattekostnad"
            target="Bør være positivt"
            format="decimal"
            status={getMetricStatus(
              currentYear.profitBeforeTax,
              "profitBeforeTax",
            )}
          />
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h4 className="font-medium text-warm-grey dark:text-warm-white">
              Om nøkkeltallene
            </h4>
            <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Omsetningstrenden viser endringen i selskapets inntekter
              sammenlignet med forrige år. En positiv trend indikerer vekst,
              mens en negativ trend kan være et tegn på utfordringer.
            </p>
            <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Bruttofortjenesten er et mål på hvor mye selskapet sitter igjen
              med etter at direkte kostnader er trukket fra. En høy
              bruttofortjeneste indikerer god lønnsomhet i kjernevirksomheten.
            </p>
            <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Driftsresultatet viser lønnsomheten i den ordinære driften, før
              finansposter og skatt. Et positivt driftsresultat er viktig for
              langsiktig overlevelse.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
