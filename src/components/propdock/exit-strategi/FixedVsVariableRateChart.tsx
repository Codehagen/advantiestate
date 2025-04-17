"use client"

import { Card } from "@/components/Card"
import { LineChart } from "@/components/LineChart"
import { Slider } from "@/components/Slider"
import { RiScales3Line } from "@remixicon/react"
import { useMemo, useState } from "react"

export function FixedVsVariableRateChart() {
  // State for loan parameters
  const [loanAmount, setLoanAmount] = useState(3000000)
  const [fixedRate, setFixedRate] = useState(5.2)
  const [initialVariableRate, setInitialVariableRate] = useState(4.0)
  const [volatility, setVolatility] = useState(1.5) // How much rates can fluctuate
  const [loanTerm, setLoanTerm] = useState(20)

  // Generate comparison data
  const comparisonData = useMemo(() => {
    const yearlyData = []
    const fixedMonthlyRate = fixedRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    // Calculate fixed rate payment
    const fixedMonthlyPayment =
      (loanAmount *
        fixedMonthlyRate *
        Math.pow(1 + fixedMonthlyRate, numberOfPayments)) /
      (Math.pow(1 + fixedMonthlyRate, numberOfPayments) - 1)

    // Annual fixed costs
    const fixedAnnualPayment = fixedMonthlyPayment * 12

    // Generate 3 scenarios for variable rates: expected, low, high
    for (let year = 1; year <= loanTerm; year++) {
      // Model rate changes - gradually increasing volatility
      const expectedRate =
        initialVariableRate + Math.sin(year / 3) * (volatility / 2)
      const lowRate = Math.max(
        1,
        expectedRate - volatility * (Math.min(year, 10) / 10),
      )
      const highRate = expectedRate + volatility * (Math.min(year, 10) / 10)

      // Calculate variable payments for different scenarios
      const expectedMonthlyRate = expectedRate / 100 / 12
      const lowMonthlyRate = lowRate / 100 / 12
      const highMonthlyRate = highRate / 100 / 12

      // Calculate total annual payments for each scenario
      const expectedPayment =
        ((loanAmount *
          expectedMonthlyRate *
          Math.pow(1 + expectedMonthlyRate, numberOfPayments)) /
          (Math.pow(1 + expectedMonthlyRate, numberOfPayments) - 1)) *
        12

      const lowPayment =
        ((loanAmount *
          lowMonthlyRate *
          Math.pow(1 + lowMonthlyRate, numberOfPayments)) /
          (Math.pow(1 + lowMonthlyRate, numberOfPayments) - 1)) *
        12

      const highPayment =
        ((loanAmount *
          highMonthlyRate *
          Math.pow(1 + highMonthlyRate, numberOfPayments)) /
          (Math.pow(1 + highMonthlyRate, numberOfPayments) - 1)) *
        12

      yearlyData.push({
        year: `År ${year}`,
        "Fast rente": Math.round(fixedAnnualPayment),
        "Forventet flytende": Math.round(expectedPayment),
        "Lav flytende": Math.round(lowPayment),
        "Høy flytende": Math.round(highPayment),
        // Store the interest rates for the tooltip
        "Fast rentesats": fixedRate,
        "Forventet rentesats": parseFloat(expectedRate.toFixed(2)),
        "Lav rentesats": parseFloat(lowRate.toFixed(2)),
        "Høy rentesats": parseFloat(highRate.toFixed(2)),
      })
    }

    return yearlyData
  }, [loanAmount, fixedRate, initialVariableRate, volatility, loanTerm])

  // Format currency for display
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

  // Slider handlers
  const handleLoanAmountChange = (values: number[]) => {
    setLoanAmount(values[0])
  }

  const handleFixedRateChange = (values: number[]) => {
    setFixedRate(values[0])
  }

  const handleInitialVariableRateChange = (values: number[]) => {
    setInitialVariableRate(values[0])
  }

  const handleVolatilityChange = (values: number[]) => {
    setVolatility(values[0])
  }

  const handleLoanTermChange = (values: number[]) => {
    setLoanTerm(values[0])
  }

  // Calculate monthly payments for display
  const fixedMonthlyPayment = useMemo(() => {
    const monthlyRate = fixedRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    )
  }, [loanAmount, fixedRate, loanTerm])

  const initialVariableMonthlyPayment = useMemo(() => {
    const monthlyRate = initialVariableRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    )
  }, [loanAmount, initialVariableRate, loanTerm])

  // Calculate total lifetime costs
  const totalFixedCost = fixedMonthlyPayment * loanTerm * 12
  const initialTotalVariableCost = initialVariableMonthlyPayment * loanTerm * 12
  const costDifference = totalFixedCost - initialTotalVariableCost

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <RiScales3Line className="size-6 text-warm-grey dark:text-warm-grey-1" />
        <div>
          <h2 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
            Fast vs. Flytende Rente
          </h2>
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Sammenlign fast og flytende rente under ulike rentescenarier
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
              min={500000}
              max={10000000}
              step={100000}
              value={[loanAmount]}
              onValueChange={handleLoanAmountChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Fast rentesats
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatPercent(fixedRate)}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={0.1}
              value={[fixedRate]}
              onValueChange={handleFixedRateChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Flytende rente (initielt)
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatPercent(initialVariableRate)}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={0.1}
              value={[initialVariableRate]}
              onValueChange={handleInitialVariableRateChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Rentesvingning (volatilitet)
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatPercent(volatility)}
              </span>
            </div>
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={[volatility]}
              onValueChange={handleVolatilityChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Nedbetalingstid
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

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Fast månedlig betaling
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(fixedMonthlyPayment)}
              </p>
            </div>

            <div className="flex-1 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Flytende månedlig betaling (initielt)
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(initialVariableMonthlyPayment)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-80 w-full">
            <LineChart
              data={comparisonData}
              index="year"
              categories={[
                "Lav flytende",
                "Forventet flytende",
                "Høy flytende",
                "Fast rente",
              ]}
              colors={["emerald", "light-blue", "red", "yellow"]}
              valueFormatter={(value: number) => formatCurrency(value)}
              yAxisWidth={70}
            />
          </div>

          <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <h3 className="mb-2 text-sm font-medium text-warm-grey dark:text-warm-white">
              Risikovurdering
            </h3>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {fixedRate > initialVariableRate + volatility
                ? "Fast rente er vesentlig høyere enn flytende, selv med forventet volatilitet. " +
                  "Flytende rente kan være fordelaktig med mindre renten stiger betydelig."
                : fixedRate < initialVariableRate
                  ? "Fast rente er lavere enn dagens flytende rente. Dette er en gunstig fastrenteavtale " +
                    "som bør vurderes for å redusere risiko."
                  : "Fast rente gir forutsigbarhet, men med en premie på " +
                    formatCurrency(costDifference) +
                    " over lånets levetid sammenlignet med dagens flytende rente."}
              {
                " Grafen viser potensielle utviklingsbaner for flytende rente sammenlignet med fast rente."
              }
            </p>
          </div>

          <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <h3 className="mb-2 text-sm font-medium text-warm-grey dark:text-warm-white">
              Om fast vs. flytende rente
            </h3>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Fast rente gir stabilitet og forutsigbarhet i betalinger, men
              kommer ofte med en premie. Flytende rente gir lavere initielle
              betalinger, men introduserer risiko for at betalingene kan øke
              betydelig hvis rentene stiger. Denne kalkulatoren viser mulige
              scenarioer basert på historisk rentevolatilitet og hjelper deg å
              evaluere risikoen for hver strategi.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
