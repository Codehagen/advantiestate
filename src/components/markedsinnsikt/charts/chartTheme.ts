// Shared recharts styling for the Markedsinnsikt editorial charts.
//
// Colors are CSS variables, resolved at render — recharts stroke/fill accept
// them directly, exactly as the previous hand-rolled SVG charts did. Do NOT
// route through src/lib/chartUtils.ts: that returns Tailwind class names
// (e.g. "stroke-warm-grey"), not color values recharts can use.

export const CHART_HEIGHT = 360

// Editorial series palette — warm-grey tints only. Light-blue (--accent) is a
// fill, never a line stroke: it is too pale to read as a 1-2px line.
export const SERIES = {
  primary: "var(--warm-grey)",
  secondary: "var(--warm-grey-85)",
  tertiary: "var(--warm-grey-85)",
} as const

// Three-segment palette for grouped bars. Light-blue is allowed as a large
// fill, paired with a hairline border so it reads on a white card.
export const BAR_SERIES = ["var(--warm-grey)", "var(--warm-grey-85)", "var(--accent)"] as const

export const ACCENT_FILL = "var(--accent)"

export const CHART_MARGIN = { top: 8, right: 18, bottom: 4, left: 4 }

// Horizontal gridlines only, hairline weight.
export const GRID_STROKE = "var(--warm-grey-75)"

// SVG text props for axis ticks.
export const AXIS_TICK = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fill: "var(--warm-grey-85)",
} as const
