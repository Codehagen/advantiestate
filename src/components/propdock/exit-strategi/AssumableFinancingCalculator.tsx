"use client"

import { Card } from "@/components/Card"
import { Slider } from "@/components/Slider"
import { RiMoneyDollarCircleLine } from "@remixicon/react"
import { useMemo, useState } from "react"

// Type definitions
interface AssumableFinancing {
  remainingLoanAmount: number
  currentMarketRate: number
  loanRate: number
  remainingTerm: number
  valuePremium: number
}

export default function AssumableFinancingCalculator() {
  // State management
  const [remainingLoanAmount, setRemainingLoanAmount] = useState(9000000)
  const [loanRate, setLoanRate] = useState(4.0)
  const [currentMarketRate, setCurrentMarketRate] = useState(6.0)
  const [remainingTerm, setRemainingTerm] = useState(15)

  // Slider value change handlers
  const handleRemainingLoanAmountChange = (values: number[]) => {
    setRemainingLoanAmount(values[0])
  }

  const handleLoanRateChange = (values: number[]) => {
    setLoanRate(values[0])
  }

  const handleCurrentMarketRateChange = (values: number[]) => {
    setCurrentMarketRate(values[0])
  }

  const handleRemainingTermChange = (values: number[]) => {
    setRemainingTerm(values[0])
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

  // Helper function to calculate monthly payment
  function calculateMonthlyPayment(
    principal: number,
    rate: number,
    years: number,
  ): number {
    const monthlyRate = rate / 100 / 12
    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, years * 12))) /
      (Math.pow(1 + monthlyRate, years * 12) - 1)
    )
  }

  // Calculate assumable financing value
  const assumableFinancingValue = useMemo(() => {
    // Calculate the value of below-market financing

    // Present value of payment difference between the assumable loan and market rate loan
    const monthlyPaymentCurrentLoan = calculateMonthlyPayment(
      remainingLoanAmount,
      loanRate,
      remainingTerm,
    )
    const monthlyPaymentMarketRate = calculateMonthlyPayment(
      remainingLoanAmount,
      currentMarketRate,
      remainingTerm,
    )

    // Monthly payment savings
    const monthlySavings = monthlyPaymentMarketRate - monthlyPaymentCurrentLoan

    // Calculate present value of savings over remaining term
    const marketMonthlyRate = currentMarketRate / 100 / 12
    let presentValueOfSavings = 0

    for (let month = 1; month <= remainingTerm * 12; month++) {
      presentValueOfSavings +=
        monthlySavings / Math.pow(1 + marketMonthlyRate, month)
    }

    return {
      remainingLoanAmount,
      currentMarketRate,
      loanRate,
      remainingTerm,
      valuePremium: presentValueOfSavings,
    }
  }, [remainingLoanAmount, loanRate, currentMarketRate, remainingTerm])

  // Total monthly savings
  const totalSavings =
    (calculateMonthlyPayment(
      remainingLoanAmount,
      currentMarketRate,
      remainingTerm,
    ) -
      calculateMonthlyPayment(remainingLoanAmount, loanRate, remainingTerm)) *
    12 *
    remainingTerm

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <RiMoneyDollarCircleLine className="size-6 text-warm-grey dark:text-warm-grey-1" />
        <div>
          <h2 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
            Overdragbar finansiering verdsettelse
          </h2>
          <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
            Beregn verdien av å overdra eksisterende finansiering under
            markedsrenten
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Gjenværende lånebeløp
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatCurrency(remainingLoanAmount)}
              </span>
            </div>
            <Slider
              min={1000000}
              max={50000000}
              step={1000000}
              value={[remainingLoanAmount]}
              onValueChange={handleRemainingLoanAmountChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Nåværende lånerente
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatPercent(loanRate)}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={0.1}
              value={[loanRate]}
              onValueChange={handleLoanRateChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Gjeldende markedsrente
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {formatPercent(currentMarketRate)}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={0.1}
              value={[currentMarketRate]}
              onValueChange={handleCurrentMarketRateChange}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Gjenværende løpetid
              </label>
              <span className="text-sm font-medium text-warm-grey dark:text-warm-white">
                {remainingTerm} år
              </span>
            </div>
            <Slider
              min={1}
              max={30}
              step={1}
              value={[remainingTerm]}
              onValueChange={handleRemainingTermChange}
            />
          </div>

          <div className="mt-6 rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <h3 className="mb-2 text-sm font-medium text-warm-grey dark:text-warm-white">
              Hva er overdragbar finansiering?
            </h3>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Overdragbar finansiering betyr at eksisterende lån kan overføres
              til en ny eier. Når renten på eksisterende lån er lavere enn
              gjeldende markedsrente, representerer dette en ekstra verdi for
              eiendommen. Denne kalkulatoren beregner nåverdien av besparelsene
              en kjøper vil oppnå ved å overta eksisterende finansiering,
              istedenfor å ta opp et nytt lån til gjeldende markedsrente. Denne
              verdien kan ofte brukes som et forhandlingspunkt ved salg av
              eiendommen.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Nåværende lånerente
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatPercent(assumableFinancingValue.loanRate)}
              </p>
            </div>

            <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Markedsrente
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatPercent(assumableFinancingValue.currentMarketRate)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Månedlig betaling (nåværende)
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(
                  calculateMonthlyPayment(
                    remainingLoanAmount,
                    loanRate,
                    remainingTerm,
                  ),
                )}
              </p>
            </div>

            <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
              <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                Månedlig betaling (marked)
              </p>
              <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                {formatCurrency(
                  calculateMonthlyPayment(
                    remainingLoanAmount,
                    currentMarketRate,
                    remainingTerm,
                  ),
                )}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
              Premiumverdi av lån under markedsrente
            </p>
            <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
              {formatCurrency(assumableFinancingValue.valuePremium)}
            </p>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {loanRate < currentMarketRate
                ? "Eksisterende lån har en positiv verdi ved overdragelse"
                : "Eksisterende lån har ingen premiumverdi"}
            </p>
          </div>

          <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <p className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
              Total besparelse over lånets løpetid
            </p>
            <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
              {formatCurrency(totalSavings)}
            </p>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Dette representerer den nominelle besparelsen over hele lånets
              løpetid, mens premiumverdien over er nåverdien av disse
              besparelsene, diskontert med markedsrenten.
            </p>
          </div>

          <div className="rounded-lg bg-light-blue-1 p-4 ring-1 ring-warm-grey-1/10 dark:bg-warm-grey-3 dark:ring-warm-white/10">
            <h3 className="mb-2 text-sm font-medium text-warm-grey dark:text-warm-white">
              Analysesresultat
            </h3>
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {loanRate < currentMarketRate
                ? `Overtagelse av det eksisterende lånet på ${formatCurrency(remainingLoanAmount)} til ${formatPercent(loanRate)} rente 
                   fremfor å ta opp et nytt lån til ${formatPercent(currentMarketRate)}, gir en verdi på ${formatCurrency(assumableFinancingValue.valuePremium)}. 
                   Dette kan potensielt øke salgsprisen på eiendommen eller gi deg en fordel i forhandlinger.`
                : `Renten på det eksisterende lånet (${formatPercent(loanRate)}) er høyere enn dagens markedsrente (${formatPercent(currentMarketRate)}). 
                   I dette tilfellet gir ikke overdragbar finansiering noen ekstra verdi for eiendommen.`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
