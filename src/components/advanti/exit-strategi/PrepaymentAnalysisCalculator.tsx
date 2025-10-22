"use client"

import { Card } from "@/components/Card"
import { LineChart } from "@/components/LineChart"
import { Slider } from "@/components/Slider"
import { RiCalculatorLine } from "@remixicon/react"
import { useMemo, useState } from "react"

// Type definitions
interface PrepaymentAnalysis {
  earlyPayoffYear: number
  prepaymentPenalty: number
  interestSavings: number
  netBenefit: number
}

export default function PrepaymentAnalysisCalculator() {
  // State management
  const [loanAmount, setLoanAmount] = useState(10000000)
  const [interestRate, setInterestRate] = useState(5.0)
  const [loanTerm, setLoanTerm] = useState(20)
  const [prepaymentPenalty, setPrepaymentPenalty] = useState(2.0)
  const [currentYear, setCurrentYear] = useState(3)

  // Slider value change handlers
  const handleLoanAmountChange = (values: number[]) => {
    setLoanAmount(values[0])
  }

  const handleInterestRateChange = (values: number[]) => {
    setInterestRate(values[0])
  }

  const handleLoanTermChange = (values: number[]) => {
    setLoanTerm(values[0])
  }

  const handlePrepaymentPenaltyChange = (values: number[]) => {
    setPrepaymentPenalty(values[0])
  }

  const handleCurrentYearChange = (values: number[]) => {
    setCurrentYear(values[0])
  }

  // Formatting functions
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

  // Calculate prepayment analysis
  const prepaymentAnalysis = useMemo(() => {
    const results: PrepaymentAnalysis[] = []

    for (let year = 1; year <= loanTerm; year++) {
      // Remaining balance calculation (approximate for simplicity)
      const monthlyRate = interestRate / 100 / 12
      const monthlyPayment =
        (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, loanTerm * 12))) /
        (Math.pow(1 + monthlyRate, loanTerm * 12) - 1)

      // Remaining balance after 'year' years
      const monthsPassed = year * 12
      let remainingBalance = loanAmount
      let totalInterestPaid = 0

      for (let month = 1; month <= monthsPassed; month++) {
        const interestPayment = remainingBalance * monthlyRate
        const principalPayment = monthlyPayment - interestPayment
        remainingBalance -= principalPayment
        totalInterestPaid += interestPayment
      }

      // Calculate prepayment penalty
      const penalty = remainingBalance * (prepaymentPenalty / 100)

      // Future interest payments if loan continues
      let futureInterest = 0
      let futureBalance = remainingBalance

      for (let month = monthsPassed + 1; month <= loanTerm * 12; month++) {
        const interestPayment = futureBalance * monthlyRate
        const principalPayment = monthlyPayment - interestPayment
        futureBalance -= principalPayment
        futureInterest += interestPayment
      }

      // Net benefit of prepaying
      const netBenefit = futureInterest - penalty

      results.push({
        earlyPayoffYear: year,
        prepaymentPenalty: penalty,
        interestSavings: futureInterest,
        netBenefit,
      })
    }

    return results
  }, [loanAmount, interestRate, loanTerm, prepaymentPenalty])

  // Prepayment analysis chart data
  const prepaymentChartData = prepaymentAnalysis.map((analysis) => ({
    year: analysis.earlyPayoffYear,
    Straffgebyr: parseFloat((analysis.prepaymentPenalty / 1000000).toFixed(2)),
    Rentesparing: parseFloat((analysis.interestSavings / 1000000).toFixed(2)),
    "Netto fordel": parseFloat((analysis.netBenefit / 1000000).toFixed(2)),
  }))

  // Current prepayment analysis
  const currentPrepaymentAnalysis =
    prepaymentAnalysis[currentYear - 1] || prepaymentAnalysis[0]

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <RiCalculatorLine className="size-6 text-warm-grey dark:text-warm-grey-1" />
        <div>
          <h2 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
            Analyse av tidlig nedbetaling
          </h2>
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Evaluer kostnader og fordeler ved tidlig tilbakebetaling av lån
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Lånebeløp
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatCurrency(loanAmount)}
              </span>
            </div>
            <Slider
              min={1000000}
              max={50000000}
              step={1000000}
              value={[loanAmount]}
              onValueChange={handleLoanAmountChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Rentesats
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatPercent(interestRate)}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={0.1}
              value={[interestRate]}
              onValueChange={handleInterestRateChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Låneperiode
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {loanTerm} år
              </span>
            </div>
            <Slider
              min={5}
              max={30}
              step={1}
              value={[loanTerm]}
              onValueChange={handleLoanTermChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Straffgebyr for tidlig innfrielse
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatPercent(prepaymentPenalty)}
              </span>
            </div>
            <Slider
              min={0}
              max={5}
              step={0.1}
              value={[prepaymentPenalty]}
              onValueChange={handlePrepaymentPenaltyChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Nåværende år av lånet
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                År {currentYear}
              </span>
            </div>
            <Slider
              min={1}
              max={loanTerm}
              step={1}
              value={[currentYear]}
              onValueChange={handleCurrentYearChange}
            />
          </div>

          <div className="mt-6 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <h3 className="mb-2 text-sm font-medium text-warm-grey dark:text-warm-white">
              Hvordan fungerer analysen av tidlig nedbetaling?
            </h3>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Denne analysen hjelper deg med å avgjøre om det er økonomisk
              lønnsomt å innfri et lån før tiden. Kalkulatoren sammenligner
              straffgebyret ved tidlig innfrielse med de totale
              rentebesparelsene du vil oppnå. Hvis rentebesparelsene overstiger
              straffgebyret, kan tidlig nedbetaling være en smart finansiell
              strategi. Du kan justere lånebeløp, rentesats, låneperiode og
              straffgebyrprosent for å se hvordan det påvirker analysens
              resultat.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Straffgebyr
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(currentPrepaymentAnalysis.prepaymentPenalty)}
              </p>
            </div>

            <div className="flex-1 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Rentesparing
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(currentPrepaymentAnalysis.interestSavings)}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
              Netto fordel
            </p>
            <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
              {formatCurrency(currentPrepaymentAnalysis.netBenefit)}
            </p>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {currentPrepaymentAnalysis.netBenefit > 0
                ? "Tidlig tilbakebetaling anbefales"
                : "Fortsett med eksisterende lån"}
            </p>
          </div>

          <div className="h-80 w-full">
            <LineChart
              data={prepaymentChartData}
              index="year"
              categories={["Straffgebyr", "Rentesparing", "Netto fordel"]}
              colors={["red", "emerald", "light-blue"]}
              valueFormatter={(value) => `${value}M NOK`}
              yAxisWidth={60}
            />
          </div>

          <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <h3 className="mb-2 text-sm font-medium text-warm-grey dark:text-warm-white">
              Analysesresultat
            </h3>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Ved år {currentYear} av låneperioden vil tidlig innfrielse medføre
              et straffgebyr på{" "}
              {formatCurrency(currentPrepaymentAnalysis.prepaymentPenalty)}. Du
              vil spare{" "}
              {formatCurrency(currentPrepaymentAnalysis.interestSavings)} i
              fremtidige rentebetalinger, noe som gir en netto{" "}
              {currentPrepaymentAnalysis.netBenefit > 0 ? "fordel" : "kostnad"}{" "}
              på{" "}
              {formatCurrency(Math.abs(currentPrepaymentAnalysis.netBenefit))}.
              {currentPrepaymentAnalysis.netBenefit > 0
                ? " Det er økonomisk fordelaktig å innfri lånet nå."
                : " Det er ikke økonomisk fordelaktig å innfri lånet nå."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
