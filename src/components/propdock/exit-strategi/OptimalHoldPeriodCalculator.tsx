"use client"

import { Card } from "@/components/Card"
import { LineChart } from "@/components/LineChart"
import { Slider } from "@/components/Slider"
import { RiTimerLine } from "@remixicon/react"
import { useMemo, useState } from "react"

// Type definitions
interface ExitStrategy {
  id: string
  name: string
  holdPeriod: number
  exitValue: number
  irr: number
  equityMultiple: number
  netProfit: number
}

export default function OptimalHoldPeriodCalculator() {
  // State management
  const [initialInvestment, setInitialInvestment] = useState(10000000)
  const [acquisitionPrice, setAcquisitionPrice] = useState(15000000)
  const [annualAppreciation, setAnnualAppreciation] = useState(3.0)
  const [annualNOI, setAnnualNOI] = useState(900000)
  const [noiGrowthRate, setNoiGrowthRate] = useState(2.5)
  const [holdPeriod, setHoldPeriod] = useState(7)

  // ===== Optimal Hold Period Calculator Calculations =====
  const holdPeriodAnalysis = useMemo(() => {
    // Calculate future values for different hold periods
    const strategies: ExitStrategy[] = []

    for (let year = 1; year <= 15; year++) {
      // Calculate property value after appreciation
      const exitValue =
        acquisitionPrice * Math.pow(1 + annualAppreciation / 100, year)

      // Calculate total NOI over hold period (with growth)
      let totalNOI = 0
      for (let i = 0; i < year; i++) {
        totalNOI += annualNOI * Math.pow(1 + noiGrowthRate / 100, i)
      }

      // Calculate net profit (exit value + total NOI - acquisition price)
      const netProfit = exitValue + totalNOI - acquisitionPrice

      // Calculate equity multiple
      const equityMultiple = (initialInvestment + netProfit) / initialInvestment

      // Calculate IRR (simplified)
      const cashFlows = [-initialInvestment]
      for (let i = 0; i < year; i++) {
        cashFlows.push(annualNOI * Math.pow(1 + noiGrowthRate / 100, i))
      }
      cashFlows[cashFlows.length - 1] +=
        exitValue - acquisitionPrice + initialInvestment

      // Simplified IRR calculation using NPV formula and bisection method
      const irr = calculateIRR(cashFlows, 0, 100)

      strategies.push({
        id: `year-${year}`,
        name: `${year} år`,
        holdPeriod: year,
        exitValue,
        irr,
        equityMultiple,
        netProfit,
      })
    }

    return strategies
  }, [
    initialInvestment,
    acquisitionPrice,
    annualAppreciation,
    annualNOI,
    noiGrowthRate,
  ])

  // Helper functions
  function calculateIRR(
    cashFlows: number[],
    lowerBound: number,
    upperBound: number,
    precision = 0.01,
  ): number {
    // Simplified IRR calculation using bisection method
    const maxIterations = 100
    let iteration = 0

    while (upperBound - lowerBound > precision && iteration < maxIterations) {
      const midRate = (lowerBound + upperBound) / 2
      const npv = calculateNPV(cashFlows, midRate / 100)

      if (npv > 0) {
        lowerBound = midRate
      } else {
        upperBound = midRate
      }

      iteration++
    }

    return (lowerBound + upperBound) / 2
  }

  function calculateNPV(cashFlows: number[], rate: number): number {
    return cashFlows.reduce((npv, cf, index) => {
      return npv + cf / Math.pow(1 + rate, index)
    }, 0)
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(value)
  }

  function formatPercent(value: number): string {
    return new Intl.NumberFormat("no-NO", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  // Optimal hold period chart data
  const optimalHoldPeriodChartData = holdPeriodAnalysis.map((strategy) => ({
    year: strategy.holdPeriod,
    IRR: parseFloat(strategy.irr.toFixed(2)),
    "Equity Multiple": parseFloat(strategy.equityMultiple.toFixed(2)),
  }))

  // Current hold period strategy
  const currentHoldPeriodStrategy =
    holdPeriodAnalysis.find((s) => s.holdPeriod === holdPeriod) ||
    holdPeriodAnalysis[0]

  // Slider value change handlers
  const handleInitialInvestmentChange = (values: number[]) => {
    setInitialInvestment(values[0])
  }

  const handleAcquisitionPriceChange = (values: number[]) => {
    setAcquisitionPrice(values[0])
  }

  const handleAnnualAppreciationChange = (values: number[]) => {
    setAnnualAppreciation(values[0])
  }

  const handleAnnualNOIChange = (values: number[]) => {
    setAnnualNOI(values[0])
  }

  const handleNoiGrowthRateChange = (values: number[]) => {
    setNoiGrowthRate(values[0])
  }

  const handleHoldPeriodChange = (values: number[]) => {
    setHoldPeriod(values[0])
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <RiTimerLine className="size-6 text-warm-grey dark:text-warm-grey-1" />
        <div>
          <h2 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
            Optimal holdeperiode kalkulator
          </h2>
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Bestem optimal horisont for investeringen basert på IRR og
            egenkapitalmultippel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Egenkapital investering
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatCurrency(initialInvestment)}
              </span>
            </div>
            <Slider
              min={1000000}
              max={50000000}
              step={1000000}
              value={[initialInvestment]}
              onValueChange={handleInitialInvestmentChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Kjøpspris
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatCurrency(acquisitionPrice)}
              </span>
            </div>
            <Slider
              min={5000000}
              max={100000000}
              step={1000000}
              value={[acquisitionPrice]}
              onValueChange={handleAcquisitionPriceChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Årlig verdiøkning
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatPercent(annualAppreciation)}
              </span>
            </div>
            <Slider
              min={0}
              max={10}
              step={0.1}
              value={[annualAppreciation]}
              onValueChange={handleAnnualAppreciationChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Årlig netto driftsinntekt (NOI)
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatCurrency(annualNOI)}
              </span>
            </div>
            <Slider
              min={100000}
              max={5000000}
              step={100000}
              value={[annualNOI]}
              onValueChange={handleAnnualNOIChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                NOI vekstrate
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatPercent(noiGrowthRate)}
              </span>
            </div>
            <Slider
              min={0}
              max={10}
              step={0.1}
              value={[noiGrowthRate]}
              onValueChange={handleNoiGrowthRateChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Holdeperiode (år)
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {holdPeriod} år
              </span>
            </div>
            <Slider
              min={1}
              max={15}
              step={1}
              value={[holdPeriod]}
              onValueChange={handleHoldPeriodChange}
            />
          </div>

          <div className="mt-6 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <h3 className="mb-2 text-sm font-medium text-warm-grey dark:text-warm-white">
              Hva er optimal holdeperiode?
            </h3>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Optimal holdeperiode er den tidsrammen som gir best avkastning på
              investeringen din. Kalkulatoren analyserer flere faktorer for å
              finne den perioden der IRR (internrente) og egenkapitalmultippel
              er på sitt høyeste. Ved å justere parameterne ovenfor kan du se
              hvordan ulike scenarioer påvirker den ideelle holdeperioden for
              din eiendomsinvestering.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                IRR
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatPercent(currentHoldPeriodStrategy.irr)}
              </p>
            </div>

            <div className="flex-1 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Egenkapitalmultippel
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {currentHoldPeriodStrategy.equityMultiple.toFixed(2)}x
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Anslått exit-verdi
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(currentHoldPeriodStrategy.exitValue)}
              </p>
            </div>

            <div className="flex-1 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Netto gevinst
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(currentHoldPeriodStrategy.netProfit)}
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <LineChart
              data={optimalHoldPeriodChartData}
              index="year"
              categories={["IRR", "Equity Multiple"]}
              colors={["light-blue", "emerald"]}
              valueFormatter={(value) => `${value}`}
              yAxisWidth={60}
            />
          </div>

          <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <h3 className="mb-2 text-sm font-medium text-warm-grey dark:text-warm-white">
              Analysesresultat
            </h3>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Basert på dine input viser analysen at en {holdPeriod} års
              holdeperiode gir en IRR på{" "}
              {formatPercent(currentHoldPeriodStrategy.irr)}
              og en egenkapitalmultippel på{" "}
              {currentHoldPeriodStrategy.equityMultiple.toFixed(2)}x. Eiendommen
              anslås å ha en exit-verdi på{" "}
              {formatCurrency(currentHoldPeriodStrategy.exitValue)}, som
              resulterer i en netto gevinst på{" "}
              {formatCurrency(currentHoldPeriodStrategy.netProfit)}.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
