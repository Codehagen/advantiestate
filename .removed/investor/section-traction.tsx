"use client"

import Link from "next/link"
import { useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Sample data for the traction chart
const tractionData = [
  { month: "Jan", users: 0, revenue: 0 },
  { month: "Feb", users: 12, revenue: 0 },
  { month: "Mar", users: 35, revenue: 0 },
  { month: "Apr", users: 78, revenue: 15 },
  { month: "Mai", users: 120, revenue: 45 },
  { month: "Jun", users: 210, revenue: 85 },
]

// Sample metrics for key performance indicators
const kpiData = [
  {
    title: "Brukere",
    value: "210+",
    growth: "+75%",
    period: "siste måned",
  },
  {
    title: "Gjennomsnittlig tid brukt",
    value: "32 min",
    growth: "+28%",
    period: "siste måned",
  },
  {
    title: "Konverteringsrate",
    value: "18%",
    growth: "+5%",
    period: "siste måned",
  },
]

// Sample testimonials
const testimonials = [
  {
    quote:
      "Propdock har revolusjonert måten vi analyserer eiendomsmarkedet på. Vi sparer timer hver uke.",
    author: "Morten Hansen",
    role: "Investeringsdirektør, Oslo Eiendom AS",
  },
  {
    quote:
      "Endelig et verktøy som gir oss presise data for det norske markedet. Dette er fremtiden.",
    author: "Lise Johansen",
    role: "Porteføljeforvalter, Nordic Property Group",
  },
]

export function SectionTraction() {
  const [activeTab, setActiveTab] = useState<"users" | "revenue">("users")

  // Format numbers with Norwegian formatting
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("nb-NO").format(num)
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border border-warm-grey-2/20 bg-warm-grey p-3 shadow-md">
          <p className="mb-1 font-medium text-warm-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className="text-sm text-warm-grey-1"
              style={{ color: entry.color }}
            >
              {entry.name === "users"
                ? `${formatNumber(entry.value)} brukere`
                : `${formatNumber(entry.value)} KNOK`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <section className="relative w-full bg-warm-white py-24 text-warm-grey md:py-32 dark:bg-warm-grey dark:text-warm-white">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">06</span>
            <h2 className="text-xl font-medium tracking-tight">Traksjon</h2>
          </div>
          <Link
            href="/"
            className="text-warm-grey-2 transition-colors hover:text-warm-grey-1"
          >
            propdock.no
          </Link>
        </div>

        <div className="space-y-16">
          {/* Traction Overview */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-3xl font-medium leading-tight md:text-4xl">
                Sterk vekst og tidlig validering
              </h3>
              <p className="text-lg text-warm-grey-1 dark:text-warm-grey-1">
                Siden lanseringen av vår beta-versjon har vi sett en
                eksponentiell vekst i både brukere og engasjement, med sterke
                tilbakemeldinger fra nøkkelaktører i markedet.
              </p>

              {/* Tab buttons for chart */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "users"
                      ? "bg-warm-grey text-warm-white dark:bg-warm-white dark:text-warm-grey"
                      : "bg-warm-grey-2/10 text-warm-grey-1 hover:bg-warm-grey-2/20 dark:text-warm-grey-1"
                  }`}
                >
                  Brukeradopsjon
                </button>
                <button
                  onClick={() => setActiveTab("revenue")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "revenue"
                      ? "bg-warm-grey text-warm-white dark:bg-warm-white dark:text-warm-grey"
                      : "bg-warm-grey-2/10 text-warm-grey-1 hover:bg-warm-grey-2/20 dark:text-warm-grey-1"
                  }`}
                >
                  Inntektsvekst
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-2xl bg-warm-grey-2/10 p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={tractionData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(120, 113, 108, 0.2)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "currentColor", opacity: 0.7 }}
                      axisLine={{ stroke: "rgba(120, 113, 108, 0.2)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "currentColor", opacity: 0.7 }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {activeTab === "users" ? (
                      <Line
                        type="monotone"
                        dataKey="users"
                        name="users"
                        stroke="#78716c"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#78716c", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#78716c", strokeWidth: 0 }}
                      />
                    ) : (
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="revenue"
                        stroke="#78716c"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#78716c", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#78716c", strokeWidth: 0 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-warm-grey-1 dark:text-warm-grey-1">
                {activeTab === "users"
                  ? "Månedlig brukeradopsjon (beta-brukere)"
                  : "Månedlig inntektsvekst (KNOK)"}
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid gap-8 md:grid-cols-3">
            {kpiData.map((kpi, index) => (
              <div
                key={index}
                className="space-y-4 rounded-2xl bg-warm-grey-2/10 p-6"
              >
                <h4 className="font-medium">{kpi.title}</h4>
                <div className="space-y-2">
                  <p className="text-4xl font-medium">{kpi.value}</p>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                      {kpi.growth}
                    </span>
                    <span className="text-sm text-warm-grey-1 dark:text-warm-grey-1">
                      {kpi.period}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          {/* <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="space-y-4 rounded-2xl bg-warm-grey-2/10 p-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-warm-grey-2"
                >
                  <path
                    d="M11.3 5.2C9.9 5.9 8.7 6.8 7.7 7.8 6.7 8.8 6 9.8 5.5 10.9 5 12 4.8 13.1 4.8 14.2c0 1.5 0.4 2.7 1.3 3.7 0.9 1 2 1.5 3.4 1.5 1.2 0 2.2-0.4 3-1.1 0.8-0.7 1.2-1.7 1.2-2.8 0-1.1-0.4-2-1.1-2.7 -0.7-0.7-1.6-1.1-2.7-1.1 -0.2 0-0.4 0-0.6 0.1 -0.2 0.1-0.4 0.1-0.5 0.2 0.2-0.6 0.6-1.2 1.1-1.8 0.5-0.6 1.1-1.1 1.8-1.6 0.7-0.5 1.4-0.9 2.1-1.3l-2.5-4.1zM22.4 5.2C21 5.9 19.8 6.8 18.8 7.8c-1 1-1.7 2-2.2 3.1 -0.5 1.1-0.7 2.2-0.7 3.3 0 1.5 0.4 2.7 1.3 3.7 0.9 1 2 1.5 3.4 1.5 1.2 0 2.2-0.4 3-1.1 0.8-0.7 1.2-1.7 1.2-2.8 0-1.1-0.4-2-1.1-2.7 -0.7-0.7-1.6-1.1-2.7-1.1 -0.2 0-0.4 0-0.6 0.1 -0.2 0.1-0.4 0.1-0.5 0.2 0.2-0.6 0.6-1.2 1.1-1.8 0.5-0.6 1.1-1.1 1.8-1.6 0.7-0.5 1.4-0.9 2.1-1.3l-2.5-4.1z"
                    fill="currentColor"
                  />
                </svg>
                <p className="text-lg italic text-warm-grey-1 dark:text-warm-grey-1">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-warm-grey-1 dark:text-warm-grey-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div> */}

          {/* Early Customers */}
          {/* <div className="rounded-2xl bg-warm-grey-2/10 p-8">
            <div className="mb-6 text-center">
              <h4 className="text-xl font-medium">
                Tidlige kunder og partnere
              </h4>
              <p className="mt-2 text-warm-grey-1 dark:text-warm-grey-1">
                Vi har allerede sikret pilotkunder fra ledende aktører i
                bransjen
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-16 items-center justify-center rounded-lg bg-warm-grey-2/5 px-6"
                >
                  <div className="text-center font-medium text-warm-grey-2">
                    Kunde {i}
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Next Steps */}
          {/* <div className="mx-auto max-w-2xl text-center">
            <h4 className="text-xl font-medium">Neste milepæler</h4>
            <p className="mt-4 text-warm-grey-1 dark:text-warm-grey-1">
              Med vår nåværende vekstrate forventer vi å nå 500+ brukere innen
              Q4 2023, med en ARR på 5M NOK. Vi er i samtaler med flere større
              aktører for strategiske partnerskap som vil akselerere veksten
              ytterligere.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  )
}
