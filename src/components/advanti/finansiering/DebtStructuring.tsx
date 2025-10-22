"use client"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { LineChart } from "@/components/LineChart"
import { Slider } from "@/components/Slider"
import { RiMoneyDollarCircleLine } from "@remixicon/react"
import { useMemo, useState } from "react"

interface DebtScenario {
  id: string
  name: string
  loanAmount: number
  interestRate: number
  term: number
  amortization: number
  paymentStructure: "interest-only" | "amortizing" | "balloon"
  ltvRatio: number
  dscr: number
  monthlyPayment: number
  totalInterest: number
  totalCost: number
}

export default function DebtStructuring() {
  const [loanAmount, setLoanAmount] = useState(10000000)
  const [interestRate, setInterestRate] = useState(5.0)
  const [term, setTerm] = useState(20)
  const [amortization, setAmortization] = useState(25)
  const [paymentStructure, setPaymentStructure] =
    useState<DebtScenario["paymentStructure"]>("amortizing")
  const [propertyValue, setPropertyValue] = useState(15000000)
  const [netOperatingIncome, setNetOperatingIncome] = useState(900000)

  // Calculate derived values
  const ltvRatio = useMemo(() => {
    return (loanAmount / propertyValue) * 100
  }, [loanAmount, propertyValue])

  // Calculate monthly payment
  const monthlyPayment = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12

    if (paymentStructure === "interest-only") {
      return loanAmount * monthlyRate
    } else if (paymentStructure === "amortizing") {
      // Standard amortizing loan formula
      return (
        (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, amortization * 12))) /
        (Math.pow(1 + monthlyRate, amortization * 12) - 1)
      )
    } else {
      // Balloon payment (interest only with principal due at term)
      return loanAmount * monthlyRate
    }
  }, [loanAmount, interestRate, amortization, paymentStructure])

  // Calculate annual debt service
  const annualDebtService = useMemo(() => {
    return monthlyPayment * 12
  }, [monthlyPayment])

  // Calculate debt service coverage ratio (DSCR)
  const dscr = useMemo(() => {
    return netOperatingIncome / annualDebtService
  }, [netOperatingIncome, annualDebtService])

  // Calculate total interest over the life of the loan
  const totalInterest = useMemo(() => {
    if (paymentStructure === "interest-only") {
      return loanAmount * (interestRate / 100) * term
    } else if (paymentStructure === "amortizing") {
      return monthlyPayment * amortization * 12 - loanAmount
    } else {
      // Balloon - interest-only payments during term
      return loanAmount * (interestRate / 100) * term
    }
  }, [
    loanAmount,
    interestRate,
    term,
    amortization,
    monthlyPayment,
    paymentStructure,
  ])

  // Create scenario comparison data for charts
  const scenarios: DebtScenario[] = useMemo(() => {
    return [
      {
        id: "current",
        name: "Nåværende scenario",
        loanAmount,
        interestRate,
        term,
        amortization,
        paymentStructure,
        ltvRatio,
        dscr,
        monthlyPayment,
        totalInterest,
        totalCost: loanAmount + totalInterest,
      },
      {
        id: "alternative1",
        name: "Alternativ 1: Lavere rente",
        loanAmount,
        interestRate: interestRate - 1,
        term,
        amortization,
        paymentStructure,
        ltvRatio,
        dscr:
          netOperatingIncome /
          (loanAmount * ((interestRate - 1) / 100 / 12) * 12),
        monthlyPayment: calculateMonthlyPayment(
          loanAmount,
          interestRate - 1,
          amortization,
          paymentStructure,
        ),
        totalInterest: calculateTotalInterest(
          loanAmount,
          interestRate - 1,
          term,
          amortization,
          paymentStructure,
        ),
        totalCost:
          loanAmount +
          calculateTotalInterest(
            loanAmount,
            interestRate - 1,
            term,
            amortization,
            paymentStructure,
          ),
      },
      {
        id: "alternative2",
        name: "Alternativ 2: Lengre løpetid",
        loanAmount,
        interestRate,
        term: term + 5,
        amortization: amortization + 5,
        paymentStructure,
        ltvRatio,
        dscr: calculateDSCR(
          loanAmount,
          interestRate,
          amortization + 5,
          paymentStructure,
          netOperatingIncome,
        ),
        monthlyPayment: calculateMonthlyPayment(
          loanAmount,
          interestRate,
          amortization + 5,
          paymentStructure,
        ),
        totalInterest: calculateTotalInterest(
          loanAmount,
          interestRate,
          term + 5,
          amortization + 5,
          paymentStructure,
        ),
        totalCost:
          loanAmount +
          calculateTotalInterest(
            loanAmount,
            interestRate,
            term + 5,
            amortization + 5,
            paymentStructure,
          ),
      },
    ]
  }, [
    loanAmount,
    interestRate,
    term,
    amortization,
    paymentStructure,
    ltvRatio,
    dscr,
    monthlyPayment,
    totalInterest,
    netOperatingIncome,
  ])

  // Helper function to calculate monthly payment for scenarios
  function calculateMonthlyPayment(
    amount: number,
    rate: number,
    amort: number,
    structure: DebtScenario["paymentStructure"],
  ): number {
    const monthlyRate = rate / 100 / 12

    if (structure === "interest-only") {
      return amount * monthlyRate
    } else if (structure === "amortizing") {
      return (
        (amount * (monthlyRate * Math.pow(1 + monthlyRate, amort * 12))) /
        (Math.pow(1 + monthlyRate, amort * 12) - 1)
      )
    } else {
      return amount * monthlyRate
    }
  }

  // Helper function to calculate total interest for scenarios
  function calculateTotalInterest(
    amount: number,
    rate: number,
    trm: number,
    amort: number,
    structure: DebtScenario["paymentStructure"],
  ): number {
    if (structure === "interest-only" || structure === "balloon") {
      return amount * (rate / 100) * trm
    } else {
      const monthlyRate = rate / 100 / 12
      const monthlyPmt =
        (amount * (monthlyRate * Math.pow(1 + monthlyRate, amort * 12))) /
        (Math.pow(1 + monthlyRate, amort * 12) - 1)
      return monthlyPmt * amort * 12 - amount
    }
  }

  // Helper function to calculate DSCR for scenarios
  function calculateDSCR(
    amount: number,
    rate: number,
    amort: number,
    structure: DebtScenario["paymentStructure"],
    noi: number,
  ): number {
    const monthlyPmt = calculateMonthlyPayment(amount, rate, amort, structure)
    return noi / (monthlyPmt * 12)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format percent
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  // Format decimal
  const formatDecimal = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Prepare chart data
  const chartData = [
    {
      metric: "Månedlig betaling",
      "Nåværende scenario": scenarios[0].monthlyPayment,
      "Alternativ 1: Lavere rente": scenarios[1].monthlyPayment,
      "Alternativ 2: Lengre løpetid": scenarios[2].monthlyPayment,
    },
    {
      metric: "Total rentekostnad",
      "Nåværende scenario": scenarios[0].totalInterest,
      "Alternativ 1: Lavere rente": scenarios[1].totalInterest,
      "Alternativ 2: Lengre løpetid": scenarios[2].totalInterest,
    },
    {
      metric: "DSCR",
      "Nåværende scenario": scenarios[0].dscr * 100, // Scale for visualization
      "Alternativ 1: Lavere rente": scenarios[1].dscr * 100,
      "Alternativ 2: Lengre løpetid": scenarios[2].dscr * 100,
    },
  ]

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <RiMoneyDollarCircleLine className="size-5 text-warm-grey-2 dark:text-warm-grey-1" />
          <div>
            <h3 className="font-medium text-warm-grey dark:text-warm-white">
              Gjeldstrukturering og låneoptimalisering
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Analyser og optimaliser lånestrukturen for din eiendomsinvestering
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Input controls section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Lånebeløp: {formatCurrency(loanAmount)}
                </label>
              </div>
              <Slider
                value={[loanAmount]}
                min={1000000}
                max={50000000}
                step={1000000}
                onValueChange={(values) => setLoanAmount(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Rente: {formatPercent(interestRate)}
                </label>
              </div>
              <Slider
                value={[interestRate]}
                min={1}
                max={10}
                step={0.25}
                onValueChange={(values) => setInterestRate(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Løpetid: {term} år
                </label>
              </div>
              <Slider
                value={[term]}
                min={5}
                max={30}
                step={1}
                onValueChange={(values) => setTerm(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Nedbetalingstid: {amortization} år
                </label>
              </div>
              <Slider
                value={[amortization]}
                min={5}
                max={40}
                step={1}
                onValueChange={(values) => setAmortization(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Eiendomsverdi: {formatCurrency(propertyValue)}
                </label>
              </div>
              <Slider
                value={[propertyValue]}
                min={5000000}
                max={100000000}
                step={1000000}
                onValueChange={(values) => setPropertyValue(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Netto driftsinntekt: {formatCurrency(netOperatingIncome)}
                </label>
              </div>
              <Slider
                value={[netOperatingIncome]}
                min={100000}
                max={5000000}
                step={100000}
                onValueChange={(values) => setNetOperatingIncome(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Betalingsstruktur
              </label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={
                    paymentStructure === "amortizing" ? "primary" : "secondary"
                  }
                  onClick={() => setPaymentStructure("amortizing")}
                >
                  Nedbetaling
                </Button>
                <Button
                  variant={
                    paymentStructure === "interest-only"
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => setPaymentStructure("interest-only")}
                >
                  Kun renter
                </Button>
                <Button
                  variant={
                    paymentStructure === "balloon" ? "primary" : "secondary"
                  }
                  onClick={() => setPaymentStructure("balloon")}
                >
                  Balloon
                </Button>
              </div>
            </div>
          </div>

          {/* Results section */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-warm-white/50 p-4 ring-1 ring-warm-grey-2/20 dark:bg-warm-grey/30 dark:ring-warm-grey-1/20">
                <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                  Månedlig betaling
                </p>
                <p className="text-2xl font-bold text-warm-grey dark:text-warm-white">
                  {formatCurrency(monthlyPayment)}
                </p>
              </div>
              <div className="rounded-lg bg-warm-white/50 p-4 ring-1 ring-warm-grey-2/20 dark:bg-warm-grey/30 dark:ring-warm-grey-1/20">
                <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                  Belåningsgrad (LTV)
                </p>
                <p className="text-2xl font-bold text-warm-grey dark:text-warm-white">
                  {formatPercent(ltvRatio)}
                </p>
              </div>
              <div className="rounded-lg bg-warm-white/50 p-4 ring-1 ring-warm-grey-2/20 dark:bg-warm-grey/30 dark:ring-warm-grey-1/20">
                <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                  Gjeldsbetjeningsgrad (DSCR)
                </p>
                <p className="text-2xl font-bold text-warm-grey dark:text-warm-white">
                  {formatDecimal(dscr)}
                </p>
              </div>
              <div className="rounded-lg bg-warm-white/50 p-4 ring-1 ring-warm-grey-2/20 dark:bg-warm-grey/30 dark:ring-warm-grey-1/20">
                <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                  Total rentekostnad
                </p>
                <p className="text-2xl font-bold text-warm-grey dark:text-warm-white">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-md mb-4 font-medium">
                Scenario sammenligning
              </h3>
              <div className="h-64">
                <LineChart
                  data={chartData}
                  index="metric"
                  categories={[
                    "Nåværende scenario",
                    "Alternativ 1: Lavere rente",
                    "Alternativ 2: Lengre løpetid",
                  ]}
                  colors={["light-blue", "emerald", "warm-grey-2"]}
                  valueFormatter={(value) => {
                    if (value > 10000) {
                      return formatCurrency(value)
                    } else {
                      return formatDecimal(value / 100) // Adjusted for DSCR visualization
                    }
                  }}
                  showLegend={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scenario comparison table */}
        <div className="mt-8">
          <h3 className="text-md mb-4 font-medium text-warm-grey dark:text-warm-white">
            Detaljert scenariosammenligning
          </h3>
          <div className="overflow-x-auto rounded-lg ring-1 ring-warm-grey-2/20 dark:ring-warm-grey-1/20">
            <table className="min-w-full divide-y divide-warm-grey-2/20 dark:divide-warm-grey-1/20">
              <thead>
                <tr className="bg-warm-white/50 dark:bg-warm-grey/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-grey-2 dark:text-warm-grey-1">
                    Scenario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-grey-2 dark:text-warm-grey-1">
                    Lånebeløp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-grey-2 dark:text-warm-grey-1">
                    Rente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-grey-2 dark:text-warm-grey-1">
                    Nedbetalingstid
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-grey-2 dark:text-warm-grey-1">
                    Månedlig betaling
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-grey-2 dark:text-warm-grey-1">
                    DSCR
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warm-grey-2 dark:text-warm-grey-1">
                    Total rentekostnad
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-grey-2/20 dark:divide-warm-grey-1/20">
                {scenarios.map((scenario) => (
                  <tr
                    key={scenario.id}
                    className="hover:bg-warm-white/80 dark:hover:bg-warm-grey/40"
                  >
                    <td className="px-4 py-3 text-sm text-warm-grey dark:text-warm-white">
                      {scenario.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-warm-grey dark:text-warm-white">
                      {formatCurrency(scenario.loanAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-warm-grey dark:text-warm-white">
                      {formatPercent(scenario.interestRate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-warm-grey dark:text-warm-white">
                      {scenario.amortization} år
                    </td>
                    <td className="px-4 py-3 text-sm text-warm-grey dark:text-warm-white">
                      {formatCurrency(scenario.monthlyPayment)}
                    </td>
                    <td className="px-4 py-3 text-sm text-warm-grey dark:text-warm-white">
                      {formatDecimal(scenario.dscr)}
                    </td>
                    <td className="px-4 py-3 text-sm text-warm-grey dark:text-warm-white">
                      {formatCurrency(scenario.totalInterest)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  )
}
