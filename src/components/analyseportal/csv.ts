// CSV export for the Analyseportal. Pure row→string builder (unit-tested)
// plus a browser download helper.

export type CsvRow = Record<string, string | number | null | undefined>

/**
 * Escape a cell against spreadsheet formula injection: cells starting with
 * = + - @ tab or CR get a leading apostrophe (today's data is our own static
 * module, but the helper must stay safe when the data source becomes a CMS).
 */
function escapeCell(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}

/**
 * Build a semicolon-separated CSV (Norwegian Excel convention) with comma
 * decimals. Keys starting with `_` are internal chart state and excluded.
 * Column order follows the first row's key order.
 */
export function buildCsv(rows: CsvRow[]): string {
  if (rows.length === 0) return ""
  const cols = Object.keys(rows[0]).filter((k) => !k.startsWith("_"))
  const head = cols.map(escapeCell).join(";")
  const body = rows
    .map((row) =>
      cols
        .map((col) => {
          const v = row[col]
          if (v == null) return ""
          if (typeof v === "number") return String(v).replace(".", ",")
          return escapeCell(v)
        })
        .join(";"),
    )
    .join("\n")
  // ﻿ BOM so Excel detects UTF-8 (æøå in headers/labels).
  return `﻿${head}\n${body}`
}

/** True when the browser supports Blob downloads (drives CSV-button visibility). */
export function csvSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof Blob !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function"
  )
}

/** Trigger a client-side download of the rows as `filename`. */
export function downloadCsv(filename: string, rows: CsvRow[]): boolean {
  if (!csvSupported() || rows.length === 0) return false
  const blob = new Blob([buildCsv(rows)], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}
