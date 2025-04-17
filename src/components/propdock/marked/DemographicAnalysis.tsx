"use client"

import { Card } from "@/components/Card"
import { LineChart } from "@/components/LineChart"

const populationTrends = [
  { year: "2019", population: 23850, workingAge: 14900 },
  { year: "2020", population: 24100, workingAge: 15100 },
  { year: "2021", population: 24350, workingAge: 15300 },
  { year: "2022", population: 24500, workingAge: 15450 },
  { year: "2023", population: 24703, workingAge: 15600 },
]

const ageDistribution = {
  labels: ["0-19", "20-34", "35-49", "50-64", "65+"],
  data: [22, 19, 21, 20, 18],
}

const householdData = {
  labels: ["Enslig", "Par u/barn", "Par m/barn", "Enslig m/barn", "Andre"],
  data: [35, 25, 28, 8, 4],
}

interface MetricCardProps {
  label: string
  value: string | number
  subValue?: string
}

function MetricCard({ label, value, subValue }: MetricCardProps) {
  return (
    <div className="rounded-lg bg-warm-white/50 p-4 dark:bg-warm-grey/30">
      <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">{label}</p>
      <p className="mt-1 text-lg font-medium text-warm-grey dark:text-warm-white">
        {value}
      </p>
      {subValue && (
        <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
          {subValue}
        </p>
      )}
    </div>
  )
}

export function DemographicAnalysis() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-warm-grey dark:text-warm-white">
              Befolkningsutvikling
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Total befolkning og arbeidsfør alder (20-64 år)
            </p>
          </div>

          <LineChart
            data={populationTrends}
            index="year"
            categories={["population", "workingAge"]}
            colors={["light-blue", "warm-grey-2"]}
            valueFormatter={(value) =>
              `${new Intl.NumberFormat("no").format(value)}`
            }
            yAxisWidth={80}
            className="h-[300px]"
          />

          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Årlig vekstrate"
              value="0.8%"
              subValue="Siste 5 år"
            />
            <MetricCard
              label="Arbeidsfør befolkning"
              value="63.2%"
              subValue="Av total befolkning"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-warm-grey dark:text-warm-white">
              Demografisk sammensetning
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Aldersfordeling og husholdningstyper
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="mb-4 text-sm font-medium text-warm-grey dark:text-warm-white">
                Aldersfordeling
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {ageDistribution.labels.map((label, index) => (
                  <div key={label} className="text-center">
                    <div className="relative mb-2">
                      <div
                        className="mx-auto h-24 w-full rounded-t-lg bg-light-blue dark:bg-light-blue/80"
                        style={{
                          height: `${ageDistribution.data[index] * 4}px`,
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium text-warm-grey dark:text-warm-white">
                      {label}
                    </p>
                    <p className="text-xs text-warm-grey-2 dark:text-warm-grey-1">
                      {ageDistribution.data[index]}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium text-warm-grey dark:text-warm-white">
                Husholdningstyper
              </h4>
              <div className="space-y-3">
                {householdData.labels.map((label, index) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-warm-grey-2 dark:text-warm-grey-1">
                        {label}
                      </span>
                      <span className="font-medium text-warm-grey dark:text-warm-white">
                        {householdData.data[index]}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-warm-grey-2/20 dark:bg-warm-grey-1/20">
                      <div
                        className="h-2 rounded-full bg-warm-grey-2 dark:bg-warm-grey-1"
                        style={{ width: `${householdData.data[index]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
