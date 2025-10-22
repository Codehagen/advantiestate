"use client"

import AssumableFinancingCalculator from "./AssumableFinancingCalculator"
import OptimalHoldPeriodCalculator from "./OptimalHoldPeriodCalculator"
import PrepaymentAnalysisCalculator from "./PrepaymentAnalysisCalculator"

export default function ExitStrategyPlanning() {
  return (
    <div className="space-y-8">
      <OptimalHoldPeriodCalculator />
      <PrepaymentAnalysisCalculator />
      <AssumableFinancingCalculator />
    </div>
  )
}
