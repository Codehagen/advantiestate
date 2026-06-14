"use client"

// Recharts chart frames for the Analyseportal: trend lines with forecast
// shading, stacked bars with hatched forecast cells, a snapshot bar with a
// reference line, and sparklines. Branded dark tooltip + clickable legend.
//
// Loaded via next/dynamic({ ssr: false }) from the shell — keep this module
// free of server-only imports. Recharts children are returned as ARRAYS, not
// Fragments: Recharts 2.x silently drops children wrapped in a Fragment.

import { useReducedMotion } from "@/lib/hooks/useReducedMotion"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  Cell,
} from "recharts"
import { PORTAL_PALETTE } from "@/components/markedsinnsikt/portalSeries"
import type { ChartRow, SeriesDef } from "../seriesUtils"
import { forecastFromLabel } from "../seriesUtils"
import { PORTAL_CHART_HEIGHT, SNAPSHOT_CHART_HEIGHT, SPARK_HEIGHT } from "../chartConstants"

const TICK = {
  fontSize: 11,
  fill: "var(--warm-grey-85)",
  fontFamily: "var(--font-body)",
} as const

// ── branded tooltip ─────────────────────────────────────────────────────────
interface PortalTooltipExtras {
  valueFormatter?: (v: number) => string
  names?: Record<string, string>
  colors?: Record<string, string>
}

type PortalTooltipPayload = {
  value?: number | string
  dataKey?: string | number
  name?: string | number
  color?: string
}

type PortalTooltipProps = PortalTooltipExtras & {
  active?: boolean
  payload?: PortalTooltipPayload[]
  label?: string | number
}

function PortalTooltip(props: PortalTooltipProps) {
  const { active, payload, label, valueFormatter, names, colors } = props
  if (!active || !payload || payload.length === 0) return null
  // Dedupe solid/forecast pairs by base key.
  const seen = new Set<string>()
  const rows: { base: string; name: string; color: string; value: number }[] = []
  for (const p of payload) {
    if (p.value == null) continue
    const base = String(p.dataKey ?? "").replace(/_f$/, "")
    if (seen.has(base)) continue
    seen.add(base)
    rows.push({
      base,
      name: names?.[base] ?? String(p.name ?? base),
      color: colors?.[base] ?? String(p.color ?? PORTAL_PALETTE.ink),
      value: Number(p.value),
    })
  }
  if (rows.length === 0) return null
  return (
    <div className="ap-tip">
      <div className="ap-tip-x">{label}</div>
      {rows.map((r) => (
        <div className="ap-tip-row" key={r.base}>
          <span className="ap-tip-dot" style={{ background: r.color }} />
          <span className="ap-tip-name">{r.name}</span>
          <span className="ap-tip-val">
            {valueFormatter ? valueFormatter(r.value) : r.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── shared chart props ──────────────────────────────────────────────────────
interface FrameProps {
  data: ChartRow[]
  series: SeriesDef[]
  hidden?: Record<string, boolean>
  yFmt?: (v: number) => string
  yDomain?: [number, number]
  yTicks?: number
  tipFmt?: (v: number) => string
  names?: Record<string, string>
  colors?: Record<string, string>
  /** Animate this render (the shell sets it true only on sector change). */
  animate?: boolean
  height?: number
}

// ── trend line chart with forecast shading ──────────────────────────────────
export function TrendChart({
  data,
  series,
  hidden,
  yFmt,
  yDomain,
  yTicks,
  tipFmt,
  names,
  colors,
  animate,
  height,
}: FrameProps) {
  const reduced = useReducedMotion()
  const doAnimate = Boolean(animate) && !reduced
  const fcFrom = forecastFromLabel(data)
  const last = data[data.length - 1]
  return (
    <ResponsiveContainer width="100%" height={height ?? PORTAL_CHART_HEIGHT}>
      <LineChart data={data} margin={{ top: 12, right: 18, bottom: 6, left: 6 }}>
        <CartesianGrid stroke={PORTAL_PALETTE.grid} vertical={false} />
        {fcFrom && last && fcFrom !== last.label && (
          <ReferenceArea
            x1={fcFrom}
            x2={last.label}
            fill={PORTAL_PALETTE.faint}
            fillOpacity={0.45}
            stroke=""
            ifOverflow="extendDomain"
          />
        )}
        <XAxis
          dataKey="label"
          tick={TICK}
          tickLine={false}
          axisLine={{ stroke: PORTAL_PALETTE.grid }}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis
          tick={TICK}
          tickLine={false}
          axisLine={false}
          width={48}
          domain={yDomain ?? ["auto", "auto"]}
          tickCount={yTicks ?? 6}
          tickFormatter={yFmt}
        />
        <Tooltip
          content={<PortalTooltip valueFormatter={tipFmt} names={names} colors={colors} />}
          cursor={{ stroke: "#b9b0a7", strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        {series.flatMap((s) =>
          hidden?.[s.key]
            ? []
            : [
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={s.width ?? 2.2}
                  strokeDasharray={s.dashed ? "5 4" : "0"}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: s.color }}
                  isAnimationActive={doAnimate}
                  animationDuration={650}
                  connectNulls
                />,
                <Line
                  key={`${s.key}_f`}
                  type="monotone"
                  dataKey={`${s.key}_f`}
                  stroke={s.color}
                  strokeWidth={s.width ?? 2.2}
                  strokeDasharray="2 4"
                  dot={false}
                  activeDot={{ r: 3, strokeWidth: 0, fill: s.color }}
                  isAnimationActive={doAnimate}
                  animationDuration={650}
                  connectNulls
                  opacity={0.85}
                />,
              ],
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── stacked bar with hatched forecast cells ─────────────────────────────────
export function StackedBar({
  data,
  series,
  hidden,
  yFmt,
  tipFmt,
  names,
  colors,
  animate,
  height,
}: FrameProps) {
  const reduced = useReducedMotion()
  const doAnimate = Boolean(animate) && !reduced
  const fcFrom = forecastFromLabel(data)
  const last = data[data.length - 1]
  return (
    <ResponsiveContainer width="100%" height={height ?? PORTAL_CHART_HEIGHT}>
      <ComposedChart data={data} margin={{ top: 16, right: 18, bottom: 6, left: 6 }}>
        <CartesianGrid stroke={PORTAL_PALETTE.grid} vertical={false} />
        {fcFrom && last && fcFrom !== last.label && (
          <ReferenceArea
            x1={fcFrom}
            x2={last.label}
            fill={PORTAL_PALETTE.faint}
            fillOpacity={0.4}
            stroke=""
          />
        )}
        <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={{ stroke: PORTAL_PALETTE.grid }} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={46} tickFormatter={yFmt} />
        <Tooltip
          content={<PortalTooltip valueFormatter={tipFmt} names={names} colors={colors} />}
          cursor={{ fill: "rgba(44,40,37,0.05)" }}
        />
        {series.flatMap((s) =>
          hidden?.[s.key]
            ? []
            : [
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  stackId="hist"
                  fill={s.color}
                  isAnimationActive={doAnimate}
                  animationDuration={650}
                  maxBarSize={46}
                >
                  {data.map((d, i) => (
                    <Cell
                      key={i}
                      fillOpacity={d._f ? 0.5 : 1}
                      stroke={d._f ? s.color : "none"}
                      strokeDasharray={d._f ? "3 2" : "0"}
                      strokeWidth={d._f ? 1 : 0}
                    />
                  ))}
                </Bar>,
              ],
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// ── snapshot bar (vacancy by city) with a reference line ────────────────────
export function SnapshotBar({
  data,
  dataKey,
  yFmt,
  tipFmt,
  name,
  refLine,
  refLabel,
  animate,
  height,
}: {
  data: { label: string; color?: string; [k: string]: string | number | undefined }[]
  dataKey: string
  yFmt?: (v: number) => string
  tipFmt?: (v: number) => string
  name: string
  refLine?: number
  refLabel?: string
  animate?: boolean
  height?: number
}) {
  const reduced = useReducedMotion()
  const doAnimate = Boolean(animate) && !reduced
  return (
    <ResponsiveContainer width="100%" height={height ?? SNAPSHOT_CHART_HEIGHT}>
      <BarChart data={data} margin={{ top: 16, right: 18, bottom: 6, left: 6 }}>
        <CartesianGrid stroke={PORTAL_PALETTE.grid} vertical={false} />
        <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={{ stroke: PORTAL_PALETTE.grid }} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={42} tickFormatter={yFmt} />
        <Tooltip
          content={
            <PortalTooltip
              valueFormatter={tipFmt}
              names={{ [dataKey]: name }}
              colors={{ [dataKey]: PORTAL_PALETTE.ink }}
            />
          }
          cursor={{ fill: "rgba(44,40,37,0.05)" }}
        />
        {refLine != null && (
          <ReferenceLine
            y={refLine}
            stroke={PORTAL_PALETTE.terra}
            strokeDasharray="4 4"
            label={{ value: refLabel ?? "", position: "right", fontSize: 10, fill: PORTAL_PALETTE.terra }}
          />
        )}
        <Bar
          dataKey={dataKey}
          fill={PORTAL_PALETTE.ink}
          maxBarSize={54}
          isAnimationActive={doAnimate}
          animationDuration={650}
          radius={[2, 2, 0, 0]}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={(d.color as string) ?? PORTAL_PALETTE.ink} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── sparkline for small-multiples ───────────────────────────────────────────
export function Spark({ data, color, height }: { data: { v: number }[]; color: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height ?? SPARK_HEIGHT}>
      <LineChart data={data} margin={{ top: 6, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
