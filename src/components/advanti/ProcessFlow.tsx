"use client"
import {
  RiArrowRightLine,
  RiBarChartBoxLine,
  RiFileChartLine,
  RiFlowChart,
  RiPieChartLine,
} from "@remixicon/react"
import { useState } from "react"

interface Step {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const steps: Step[] = [
  {
    id: "market",
    title: "Markedsanalyse",
    description:
      "Start med en grundig analyse av markedet basert på sanntidsdata og sammenlignbare transaksjoner.",
    icon: <RiBarChartBoxLine className="h-7 w-7" />,
    color: "rgb(59, 130, 246)", // blue-500
    bgColor: "bg-[rgb(59,130,246)]",
  },
  {
    id: "dcf",
    title: "Kontantstrømanalyse",
    description:
      "Utfør detaljerte DCF-analyser for å beregne nåverdien av fremtidige inntekter.",
    icon: <RiFlowChart className="h-7 w-7" />,
    color: "rgb(16, 185, 129)", // emerald-500
    bgColor: "bg-[rgb(16,185,129)]",
  },
  {
    id: "sensitivity",
    title: "Sensitivitetsanalyse",
    description:
      "Test ulike scenarioer og parametere for å forstå verdidriverne.",
    icon: <RiPieChartLine className="h-7 w-7" />,
    color: "rgb(168, 85, 247)", // purple-500
    bgColor: "bg-[rgb(168,85,247)]",
  },
  {
    id: "report",
    title: "Rapportgenerering",
    description:
      "Generer en omfattende rapport med all analyse og dokumentasjon.",
    icon: <RiFileChartLine className="h-7 w-7" />,
    color: "rgb(249, 115, 22)", // orange-500
    bgColor: "bg-[rgb(249,115,22)]",
  },
]

export function ProcessFlow() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="w-full">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-warm-grey-3/20" />

        {/* Active progress line */}
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-warm-grey-3/50 transition-all duration-300"
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative z-10 flex justify-between px-4">
          {steps.map((step, index) => {
            const isActive = index === activeStep
            const isPast = index < activeStep

            return (
              <div
                key={step.id}
                className="group flex flex-col items-center"
                onMouseEnter={() => setActiveStep(index)}
                role="button"
                tabIndex={0}
                onClick={() => setActiveStep(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveStep(index)
                  }
                }}
              >
                <div
                  className={`mb-4 flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-2xl transition-all duration-300 ${
                    step.bgColor
                  } ${
                    isActive
                      ? "scale-110 opacity-100"
                      : isPast
                        ? "opacity-80"
                        : "opacity-60"
                  }`}
                  style={{
                    boxShadow: isActive
                      ? `0 8px 24px -4px ${step.color}40`
                      : "none",
                  }}
                >
                  {step.icon}
                </div>
                <h4
                  className={`text-center text-base font-medium transition-colors ${
                    isActive ? "text-warm-white" : "text-warm-grey-1"
                  }`}
                >
                  {step.title}
                </h4>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-12">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`transition-all duration-300 ${
              index === activeStep ? "block" : "hidden"
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-1 rounded-2xl bg-[rgb(32,33,31)] p-8 ring-1 ring-warm-grey-1/10">
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${step.bgColor}`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-warm-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-warm-grey-1">
                  {step.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-warm-grey-1">
                  <span>Neste steg</span>
                  <RiArrowRightLine className="h-4 w-4" />
                  <span>{steps[(index + 1) % steps.length].title}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
