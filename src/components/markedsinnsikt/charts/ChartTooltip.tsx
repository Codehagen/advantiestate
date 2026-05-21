"use client"

// Editorial recharts tooltip — white card, hairline border, no shadow.
// Pattern from DcfChart.tsx, but light instead of dark. Passed to recharts
// via <Tooltip content={<ChartTooltip valueFormatter={...} />} />; recharts
// clones it and injects `active` / `payload` / `label`.

import type { TooltipProps } from "recharts"

type ValueType = number | string | Array<number | string>
type NameType = number | string

interface ChartTooltipProps extends TooltipProps<ValueType, NameType> {
  valueFormatter?: (value: number) => string
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const fmt = valueFormatter ?? ((v: number) => String(v))

  return (
    <div
      style={{
        background: "var(--warm-white)",
        border: "1px solid var(--warm-grey-75)",
        padding: "10px 12px",
        fontFamily: "var(--font-body)",
        fontSize: 12.5,
        lineHeight: 1.4,
        minWidth: 168,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.04em",
          color: "var(--warm-grey-85)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {payload.map((entry) => (
        <div
          key={String(entry.dataKey)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 0" }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              flexShrink: 0,
              background: entry.color,
              border: "1px solid var(--warm-grey-75)",
            }}
          />
          <span style={{ color: "var(--warm-grey-85)", marginRight: "auto" }}>
            {entry.name}
          </span>
          <span
            style={{
              fontWeight: 500,
              fontVariantNumeric: "tabular-nums",
              color: "var(--warm-grey)",
            }}
          >
            {typeof entry.value === "number" ? fmt(entry.value) : String(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}
