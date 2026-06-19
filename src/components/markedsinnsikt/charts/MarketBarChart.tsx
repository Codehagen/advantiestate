"use client"

// Editorial bar chart on recharts. Two shapes:
//  - "columns" (default): vertical bars, single series, optional highlight on
//    the latest bar. Used by the Transaksjoner volume chart.
//  - "rows": horizontal grouped bars. Used by the new Ledighet vacancy chart.
//
// recharts only discovers axis/bar children that are *direct* children of
// <BarChart> — it does not look through React Fragments. So the axes are
// rendered as direct conditional children, never wrapped in <>...</>.

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { AXIS_TICK, CHART_HEIGHT, CHART_MARGIN, GRID_STROKE } from "./chartTheme"
import { ChartTooltip } from "./ChartTooltip"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

export interface BarSeries {
  name: string
  color: string
  values: number[]
}

export interface MarketBarChartProps {
  labels: string[]
  series: BarSeries[]
  orientation?: "columns" | "rows"
  /** columns mode only: paint the last bar in warm-grey, the rest in accent. */
  highlightLast?: boolean
  valueFormatter?: (v: number) => string
  height?: number
  ariaLabel: string
}

export function MarketBarChart({
  labels,
  series,
  orientation = "columns",
  highlightLast = false,
  valueFormatter,
  height = CHART_HEIGHT,
  ariaLabel,
}: MarketBarChartProps) {
  const data = labels.map((label, i) => {
    const row: Record<string, number | string> = { label }
    series.forEach((s, si) => {
      row[`s${si}`] = s.values[i]
    })
    return row
  })

  const isRows = orientation === "rows"
  // Respect prefers-reduced-motion: skip the bar-grow animation.
  const animate = !useReducedMotion()

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isRows ? "vertical" : "horizontal"}
          margin={CHART_MARGIN}
          barCategoryGap={isRows ? "22%" : "32%"}
        >
          <CartesianGrid
            horizontal={!isRows}
            vertical={isRows}
            stroke={GRID_STROKE}
            strokeOpacity={0.7}
          />
          {isRows && (
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              tickFormatter={valueFormatter}
            />
          )}
          {isRows && (
            <YAxis
              type="category"
              dataKey="label"
              width={92}
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
            />
          )}
          {!isRows && (
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              tickMargin={10}
            />
          )}
          {!isRows && (
            <YAxis
              width={48}
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              tickFormatter={valueFormatter}
            />
          )}
          <Tooltip
            content={<ChartTooltip valueFormatter={valueFormatter} />}
            cursor={{ fill: "var(--accent-faint)" }}
          />
          {series.map((s, si) => (
            <Bar
              key={si}
              dataKey={`s${si}`}
              name={s.name}
              fill={s.color}
              stroke="var(--warm-grey-75)"
              strokeWidth={0.75}
              isAnimationActive={animate}
              animationDuration={500}
              animationEasing="ease-out"
              radius={isRows ? [0, 1, 1, 0] : [1, 1, 0, 0]}
            >
              {highlightLast &&
                !isRows &&
                data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === data.length - 1
                        ? "var(--warm-grey)"
                        : "var(--accent)"
                    }
                    stroke={
                      i === data.length - 1
                        ? "var(--warm-grey)"
                        : "var(--warm-grey-75)"
                    }
                  />
                ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
