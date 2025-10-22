"use client"

import { Card } from "@/components/Card"
import { LineChart } from "@/components/LineChart"
import { cx } from "@/lib/utils"
import { SimulationStats } from "@/types/simulation"
import { RiBarChartLine, RiMapPinLine } from "@remixicon/react"

interface MarketAnalysisProps {
  stats: SimulationStats
}

// Sample market data (this should come from an API/database in production)
const marketData = {
  historicalYields: [
    { year: "2019", yield: 5.2, marketAverage: 5.4 },
    { year: "2020", yield: 5.4, marketAverage: 5.6 },
    { year: "2021", yield: 5.6, marketAverage: 5.8 },
    { year: "2022", yield: 5.8, marketAverage: 6.0 },
    { year: "2023", yield: 5.9, marketAverage: 6.1 },
  ],
  rentalRates: [
    { year: "2019", rate: 1800, marketAverage: 1750 },
    { year: "2020", rate: 1850, marketAverage: 1800 },
    { year: "2021", rate: 1900, marketAverage: 1850 },
    { year: "2022", rate: 1950, marketAverage: 1900 },
    { year: "2023", rate: 2000, marketAverage: 1950 },
  ],
  marketBenchmarks: [
    {
      label: "Yield",
      value: 5.9,
      marketAvg: 6.1,
      range: "5.5% - 6.5%",
      trend: "stable",
    },
    {
      label: "Leiepris (NOK/m²)",
      value: 2000,
      marketAvg: 1950,
      range: "1800 - 2100",
      trend: "up",
    },
    {
      label: "Utleiegrad",
      value: 95,
      marketAvg: 93,
      range: "90% - 97%",
      trend: "up",
    },
    {
      label: "Driftskostnader (NOK/m²)",
      value: 450,
      marketAvg: 475,
      range: "400 - 550",
      trend: "down",
    },
  ],
  locationMetrics: [
    {
      area: "Sentrum",
      yield: 5.7,
      rent: 2200,
      vacancy: 4,
    },
    {
      area: "Vest",
      yield: 6.1,
      rent: 1900,
      vacancy: 6,
    },
    {
      area: "Øst",
      yield: 6.3,
      rent: 1800,
      vacancy: 8,
    },
    {
      area: "Sør",
      yield: 6.2,
      rent: 1850,
      vacancy: 7,
    },
  ],
}

export function MarketAnalysis({ stats }: MarketAnalysisProps) {
  return (
    <div className="space-y-8">
      {/* Market Benchmarks */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <RiBarChartLine className="size-5 text-warm-grey-2 dark:text-warm-grey-1" />
            <div>
              <h3 className="font-medium text-warm-grey dark:text-warm-white">
                Markedsbenchmark
              </h3>
              <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                Sammenligning med markedsgjennomsnitt
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left side: Key benchmarks */}
            <div className="space-y-4">
              {marketData.marketBenchmarks.slice(0, 2).map((benchmark) => (
                <div
                  key={benchmark.label}
                  className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-warm-grey dark:text-warm-white">
                        {benchmark.label}
                      </p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                          {benchmark.value}
                          {benchmark.label.includes("%") ? "%" : ""}
                        </p>
                        <span
                          className={cx(
                            "rounded-full px-2 py-1 text-xs font-medium",
                            benchmark.trend === "up"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : benchmark.trend === "down"
                                ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                : "bg-warm-grey-2/20 text-warm-grey-2 dark:bg-warm-grey-1/20 dark:text-warm-grey-1",
                          )}
                        >
                          {benchmark.trend === "up"
                            ? "Økende"
                            : benchmark.trend === "down"
                              ? "Synkende"
                              : "Stabil"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-sm">
                        <span className="text-warm-grey-2 dark:text-warm-grey-1">
                          vs. marked:
                        </span>{" "}
                        <span
                          className={cx(
                            "font-medium",
                            benchmark.value > benchmark.marketAvg
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400",
                          )}
                        >
                          {((benchmark.value - benchmark.marketAvg) /
                            benchmark.marketAvg) *
                            100 >
                          0
                            ? "+"
                            : ""}
                          {(
                            ((benchmark.value - benchmark.marketAvg) /
                              benchmark.marketAvg) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                        Spenn: {benchmark.range}
                      </div>
                    </div>
                  </div>
                  {/* Progress bar showing position within range */}
                  <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-warm-grey-2/20 dark:bg-warm-grey-1/20">
                      <div
                        className={cx(
                          "h-2 rounded-full",
                          benchmark.trend === "up"
                            ? "bg-emerald-500 dark:bg-emerald-400"
                            : benchmark.trend === "down"
                              ? "bg-red-500 dark:bg-red-400"
                              : "bg-warm-grey-2 dark:bg-warm-grey-1",
                        )}
                        style={{
                          width: `${
                            ((benchmark.value -
                              parseFloat(benchmark.range.split(" - ")[0])) /
                              (parseFloat(benchmark.range.split(" - ")[1]) -
                                parseFloat(benchmark.range.split(" - ")[0]))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Market Position Summary */}
            <div className="rounded-lg bg-warm-white/50 p-6 dark:bg-warm-grey/30">
              <h4 className="font-medium text-warm-grey dark:text-warm-white">
                Markedsposisjon
              </h4>
              <div className="mt-6 space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                      Yield vs. marked
                    </span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Sterk
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-warm-grey-2/20 dark:bg-warm-grey-1/20">
                    <div
                      className="h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                      Leiepris vs. marked
                    </span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Over snitt
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-warm-grey-2/20 dark:bg-warm-grey-1/20">
                    <div
                      className="h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
                      style={{ width: "70%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                      Markedsstyrke
                    </span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Positiv
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-warm-grey-2/20 dark:bg-warm-grey-1/20">
                    <div
                      className="h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-warm-white/30 p-4 dark:bg-warm-grey/20">
                  <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                    Markedskommentar
                  </p>
                  <p className="mt-2 text-sm text-warm-grey dark:text-warm-white">
                    Eiendommen har en sterk posisjon i markedet med yield og
                    leiepriser over markedssnittet. Vekstpotensialet er godt med
                    økende etterspørsel i området.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Historical Trends */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <RiBarChartLine className="size-5 text-warm-grey-2 dark:text-warm-grey-1" />
            <div>
              <h3 className="font-medium text-warm-grey dark:text-warm-white">
                Historisk utvikling
              </h3>
              <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                Yield og leiepriser over tid
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h4 className="mb-4 text-sm font-medium text-warm-grey dark:text-warm-white">
                Yield-utvikling
              </h4>
              <LineChart
                data={marketData.historicalYields}
                index="year"
                categories={["yield", "marketAverage"]}
                colors={["light-blue", "warm-grey-2"]}
                valueFormatter={(value) => `${value}%`}
                yAxisWidth={40}
                className="h-64"
              />
            </div>
            <div>
              <h4 className="mb-4 text-sm font-medium text-warm-grey dark:text-warm-white">
                Leieprisutvikling
              </h4>
              <LineChart
                data={marketData.rentalRates}
                index="year"
                categories={["rate", "marketAverage"]}
                colors={["light-blue", "warm-grey-2"]}
                valueFormatter={(value) => `${value} NOK/m²`}
                yAxisWidth={60}
                className="h-64"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Location Analysis */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <RiMapPinLine className="size-5 text-warm-grey-2 dark:text-warm-grey-1" />
            <div>
              <h3 className="font-medium text-warm-grey dark:text-warm-white">
                Områdeanalyse
              </h3>
              <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                Nøkkeltall for ulike områder
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {marketData.locationMetrics.map((location) => (
              <div
                key={location.area}
                className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30"
              >
                <h4 className="font-medium text-warm-grey dark:text-warm-white">
                  {location.area}
                </h4>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-grey-2 dark:text-warm-grey-1">
                      Yield
                    </span>
                    <span className="font-medium text-warm-grey dark:text-warm-white">
                      {location.yield}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-grey-2 dark:text-warm-grey-1">
                      Leie
                    </span>
                    <span className="font-medium text-warm-grey dark:text-warm-white">
                      {location.rent} NOK/m²
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-grey-2 dark:text-warm-grey-1">
                      Ledighet
                    </span>
                    <span className="font-medium text-warm-grey dark:text-warm-white">
                      {location.vacancy}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
