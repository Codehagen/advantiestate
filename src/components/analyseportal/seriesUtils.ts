// Pure series helpers for the Analyseportal charts. No React, no Recharts —
// importable from unit tests and from both server and client components.

/** One chart series: canonical history + optional forecast tail. */
export interface SeriesDef {
  key: string
  label: string
  color: string
  hist: number[]
  fc?: number[]
  width?: number
  dashed?: boolean
}

/**
 * Chart row: solid value under `key`, forecast under `key_f`. `_f` marks
 * forecast rows (drives the hatched bar cells and the range window).
 */
export type ChartRow = {
  label: string
  _f: boolean
} & { [k: string]: string | number | boolean | null }

/**
 * Merge history + forecast into chart rows. The forecast series duplicates the
 * last historical point on the join row so the dashed line continues the solid
 * one without a gap.
 */
export function mergeForecast(
  histLabels: readonly string[],
  fcLabels: readonly string[],
  series: readonly SeriesDef[],
): ChartRow[] {
  const rows: ChartRow[] = histLabels.map((label, i) => {
    const row: ChartRow = { label, _f: false }
    for (const s of series) {
      row[s.key] = s.hist[i] ?? null
      row[`${s.key}_f`] = null
    }
    return row
  })
  if (rows.length > 0) {
    const join = rows[rows.length - 1]
    for (const s of series) join[`${s.key}_f`] = s.hist[s.hist.length - 1] ?? null
  }
  for (const [i, label] of fcLabels.entries()) {
    const row: ChartRow = { label, _f: true }
    for (const s of series) {
      row[s.key] = null
      row[`${s.key}_f`] = s.fc ? (s.fc[i] ?? null) : null
    }
    rows.push(row)
  }
  return rows
}

/** Slice the historical window by range key; the forecast tail is always kept. */
export function rangeWindow(
  rows: ChartRow[],
  range: "1y" | "3y" | "5y" | "all",
): ChartRow[] {
  const hist = rows.filter((r) => !r._f)
  const fc = rows.filter((r) => r._f)
  const windows: Record<string, number> = { "1y": 4, "3y": 12, "5y": 20 }
  const n = windows[range] ?? hist.length
  return hist.slice(Math.max(0, hist.length - n)).concat(fc)
}

/**
 * The label the forecast shading starts from: the last historical row.
 * Derived — never hardcode a quarter label (it goes stale at the next release).
 */
export function forecastFromLabel(rows: ChartRow[]): string | undefined {
  const hist = rows.filter((r) => !r._f)
  return hist.length > 0 ? hist[hist.length - 1].label : undefined
}
