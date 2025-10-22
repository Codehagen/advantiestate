"use client"

import { Card } from "@/components/Card"
import { LineChart } from "@/components/LineChart"
import { Slider } from "@/components/Slider"
import { RiLineChartLine } from "@remixicon/react"
import { useMemo, useState } from "react"

export function LoanAmortizationChart() {
  // State for loan parameters
  const [loanAmount, setLoanAmount] = useState(3000000)
  const [interestRate, setInterestRate] = useState(4.5)
  const [loanTerm, setLoanTerm] = useState(25)

  // Generate amortization schedule data
  const amortizationData = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    let balance = loanAmount
    const yearlyData = []

    // Combine monthly data into yearly data for cleaner chart
    for (let year = 1; year <= loanTerm; year++) {
      let yearlyPrincipal = 0
      let yearlyInterest = 0

      for (let month = 1; month <= 12; month++) {
        if ((year - 1) * 12 + month <= numberOfPayments) {
          const interestPayment = balance * monthlyRate
          const principalPayment = monthlyPayment - interestPayment

          yearlyPrincipal += principalPayment
          yearlyInterest += interestPayment
          balance -= principalPayment
        }
      }

      yearlyData.push({
        year: `År ${year}`,
        Avdrag: Math.round(yearlyPrincipal),
        Renter: Math.round(yearlyInterest),
        Restgjeld: Math.round(balance),
      })
    }

    return yearlyData
  }, [loanAmount, interestRate, loanTerm])

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

  const handleInterestRateChange = (values: number[]) => {
    setInterestRate(values[0])
  }

  const handleLoanTermChange = (values: number[]) => {
    setLoanTerm(values[0])
  }

  // Calculate monthly payment for display
  const monthlyPayment = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    )
  }, [loanAmount, interestRate, loanTerm])

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <RiLineChartLine className="size-6 text-warm-grey dark:text-warm-grey-1" />
        <div>
          <h2 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
            Nedbetalingsplan Visualisering
          </h2>
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Se hvordan lånet ditt nedbetales over tid med fordeling mellom
            renter og avdrag
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
                Månedlig betaling
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(monthlyPayment)}
              </p>
            </div>

            <div className="flex-1 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Totale rentekostnader
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(monthlyPayment * loanTerm * 12 - loanAmount)}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <h3 className="mb-2 text-sm font-medium text-warm-grey dark:text-warm-white">
              Om nedbetalingsplanen
            </h3>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Nedbetalingsplanen viser hvordan ditt lån blir nedbetalt over tid.
              I begynnelsen går størsteparten av betalingen til renter, mens
              andelen som går til avdrag øker gradvis utover i låneperioden.
              Grafen viser også hvordan restgjelden reduseres over tid.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* <div className="h-80 w-full">
            <AreaChart
              type="stacked"
              data={amortizationData}
              index="year"
              categories={["Renter", "Avdrag"]}
              colors={["red", "emerald"]}
              valueFormatter={(value) => formatCurrency(value)}
              yAxisWidth={65}
            />
          </div> */}

          <div className="h-64 w-full">
            <LineChart
              data={amortizationData}
              index="year"
              categories={["Restgjeld"]}
              colors={["light-blue"]}
              valueFormatter={(value) => formatCurrency(value)}
              yAxisWidth={65}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
