"use client"

// Editorial multi-series line chart on recharts. Replaces the hand-rolled SVG
// LineChart from EditorialCharts.tsx. Props mirror the old component so the
// Markedsinnsikt views rewire with minimal change.

import { useId } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { AXIS_TICK, CHART_HEIGHT, CHART_MARGIN, GRID_STROKE } from "./chartTheme"
import { ChartTooltip } from "./ChartTooltip"

export interface LineSeries {
  name: string
  color: string
  dashed?: boolean
  values: number[]
}

export interface MarketLineChartProps {
  labels: string[]
  series: LineSeries[]
  yFormat?: (v: number) => string
  yMin?: number
  yMax?: number
  yTicks?: number
  /** Index of the series drawn as a soft-filled area. Default 0; pass -1 for none. */
  areaIndex?: number
  height?: number
  /** Accessible summary of what the chart shows. */
  ariaLabel: string
}

export function MarketLineChart({
  labels,
  series,
  yFormat,
  yMin,
  yMax,
  yTicks = 6,
  areaIndex = 0,
  height = CHART_HEIGHT,
  ariaLabel,
}: MarketLineChartProps) {
  // recharts wants an array of row objects, not parallel arrays.
  const data = labels.map((label, i) => {
    const row: Record<string, number | string> = { label }
    series.forEach((s, si) => {
      row[`s${si}`] = s.values[i]
    })
    return row
  })

  // useId() guarantees the gradient def id is unique per mounted instance.
  const gradId = `mi-area-${useId().replace(/:/g, "")}`

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.38} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={GRID_STROKE}
            strokeOpacity={0.7}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={AXIS_TICK}
            tickMargin={10}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis
            width={48}
            axisLine={false}
            tickLine={false}
            tick={AXIS_TICK}
            domain={[yMin ?? "auto", yMax ?? "auto"]}
            tickCount={yTicks}
            tickFormatter={yFormat}
          />
          <Tooltip
            content={<ChartTooltip valueFormatter={yFormat} />}
            cursor={{ stroke: "var(--warm-grey-75)", strokeWidth: 1 }}
          />
          {series.map((s, si) =>
            si === areaIndex ? (
              <Area
                key={si}
                type="linear"
                dataKey={`s${si}`}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#${gradId})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: s.color,
                  stroke: "var(--warm-white)",
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={600}
              />
            ) : (
              <Line
                key={si}
                type="linear"
                dataKey={`s${si}`}
                name={s.name}
                stroke={s.color}
                strokeWidth={1.75}
                strokeDasharray={s.dashed ? "4 4" : undefined}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: s.color,
                  stroke: "var(--warm-white)",
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={600}
              />
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
