"use client"

// Hand-rolled inline SVG charts for the Markedsinnsikt editorial page.
// Ported from advanti/markedsinnsikt.js — pure data-in / SVG-out functions
// rendered as React components. No chart library by design.

export interface LineSeries {
  name: string
  color: string
  dashed?: boolean
  values: number[]
}

export interface LineChartProps {
  labels: string[]
  series: LineSeries[]
  yFormat?: (v: number) => string
  yMin?: number
  yMax?: number
  yTicks?: number
}

/**
 * SVG multi-series line chart. Mirrors renderLineChart() from the design JS:
 * fixed 800x360 viewBox, snapped y-domain, gridlines, x-axis labels every
 * Nth tick, end dots per series.
 */
export function LineChart({
  labels,
  series,
  yFormat,
  yMin: yMinProp,
  yMax: yMaxProp,
  yTicks = 5,
}: LineChartProps) {
  const W = 800
  const H = 360
  const padL = 56
  const padR = 16
  const padT = 8
  const padB = 36
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  const all = series.flatMap((s) => s.values)
  let yMin = yMinProp ?? Math.min(...all)
  let yMax = yMaxProp ?? Math.max(...all)
  const range = yMax - yMin || 1
  yMin = yMinProp ?? Math.floor((yMin - range * 0.08) * 10) / 10
  yMax = yMaxProp ?? Math.ceil((yMax + range * 0.08) * 10) / 10

  const n = labels.length
  const stepX = innerW / (n - 1)
  const xAt = (i: number) => padL + i * stepX
  const yAt = (v: number) =>
    padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH

  const yFmt = yFormat ?? ((v: number) => v.toFixed(1))

  const gridTicks: number[] = []
  for (let t = 0; t <= yTicks; t++) {
    gridTicks.push(yMin + (yMax - yMin) * (t / yTicks))
  }

  const xLabelEvery = n > 12 ? 4 : 2

  return (
    <svg
      className="mi-svg-chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="grid">
        {gridTicks.map((v, t) => {
          const y = yAt(v)
          return (
            <g key={`grid-${t}`}>
              <line x1={padL} x2={W - padR} y1={y} y2={y} />
              <text className="y" x={padL - 10} y={y + 4} textAnchor="end">
                {yFmt(v)}
              </text>
            </g>
          )
        })}
      </g>
      <g className="axis">
        {labels.map((label, i) => {
          if (i % xLabelEvery !== 0 && i !== n - 1) return null
          return (
            <text
              key={`x-${i}`}
              x={xAt(i)}
              y={H - padB + 22}
              textAnchor="middle"
            >
              {label}
            </text>
          )
        })}
      </g>
      <g>
        {series.map((s, si) => {
          let d = ""
          s.values.forEach((v, i) => {
            const cmd = i === 0 ? "M" : "L"
            d += `${cmd}${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)} `
          })
          return (
            <path
              key={`path-${si}`}
              className={`series${s.dashed ? " dash" : ""}`}
              d={d}
              stroke={s.color}
            />
          )
        })}
      </g>
      <g>
        {series.map((s, si) => {
          const li = s.values.length - 1
          return (
            <circle
              key={`dot-${si}`}
              className="dot"
              cx={xAt(li)}
              cy={yAt(s.values[li])}
              r={4}
              stroke={s.color}
            />
          )
        })}
      </g>
    </svg>
  )
}

export interface BarChartProps {
  labels: string[]
  values: number[]
}

/**
 * SVG bar chart. Mirrors renderTxView() from the design JS:
 * fixed 800x360 viewBox, latest bar highlighted, value labels above bars.
 */
export function BarChart({ labels, values }: BarChartProps) {
  const W = 800
  const H = 360
  const padL = 56
  const padR = 16
  const padT = 16
  const padB = 36
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  const yMax = Math.max(...values) * 1.15
  const xStep = innerW / values.length
  const barW = xStep * 0.55
  const yTicks = 5

  const gridTicks: number[] = []
  for (let t = 0; t <= yTicks; t++) {
    gridTicks.push((yMax * t) / yTicks)
  }

  return (
    <svg className="mi-svg-chart" viewBox={`0 0 ${W} ${H}`}>
      <g className="grid">
        {gridTicks.map((v, t) => {
          const y = padT + innerH - (v / yMax) * innerH
          return (
            <g key={`grid-${t}`}>
              <line x1={padL} x2={W - padR} y1={y} y2={y} />
              <text className="y" x={padL - 10} y={y + 4}>
                {v.toFixed(1)} mrd
              </text>
            </g>
          )
        })}
      </g>
      <g className="axis">
        {values.map((_, i) => (
          <text
            key={`x-${i}`}
            x={padL + i * xStep + xStep / 2}
            y={H - padB + 22}
            textAnchor="middle"
          >
            {labels[i]}
          </text>
        ))}
      </g>
      <g>
        {values.map((v, i) => {
          const x = padL + i * xStep + (xStep - barW) / 2
          const h = (v / yMax) * innerH
          const y = padT + innerH - h
          const isLatest = i === values.length - 1
          return (
            <g key={`bar-${i}`}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                fill={isLatest ? "var(--warm-grey)" : "var(--accent-soft)"}
                stroke="var(--warm-grey)"
                strokeWidth={isLatest ? 0 : 0.5}
              />
              <text
                x={x + barW / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize={11}
                fill="var(--warm-grey)"
                fontWeight={500}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {v.toFixed(1)}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export interface MapCity {
  id: string
  name: string
  lat: number
  lon: number
  yield: string
  leie: string
  vac: string
  note: string
}

export interface NordNorgeMapProps {
  cities: MapCity[]
  activeCityId: string
  onSelectCity: (id: string) => void
}

/**
 * Stylized Nord-Norge map. Mirrors renderMap() from the design JS —
 * abstracted coastline + inland border, lat/lon projected into the viewBox,
 * clickable city pins.
 */
export function NordNorgeMap({
  cities,
  activeCityId,
  onSelectCity,
}: NordNorgeMapProps) {
  const W = 700
  const H = 560
  const lonMin = 12
  const lonMax = 26
  const latMin = 65.5
  const latMax = 71

  const project = (lat: number, lon: number): [number, number] => {
    const x = ((lon - lonMin) / (lonMax - lonMin)) * W
    const y = ((latMax - lat) / (latMax - latMin)) * H
    return [x, y]
  }

  const COAST: [number, number][] = [
    [12.5, 66.2], [13.4, 66.5], [13.6, 66.9], [13.0, 67.0], [13.2, 67.4],
    [13.9, 67.6], [14.1, 67.9], [13.6, 68.0], [13.0, 68.2], [12.8, 68.4],
    [13.2, 68.55], [13.8, 68.5], [14.4, 68.4], [15.0, 68.5], [15.5, 68.7],
    [16.0, 68.85], [16.3, 68.6], [16.8, 68.55], [17.4, 68.5], [17.8, 68.65],
    [17.5, 69.0], [18.2, 69.2], [18.5, 69.4], [19.0, 69.55], [19.8, 69.7],
    [20.5, 69.9], [21.5, 70.1], [22.2, 70.3], [22.8, 70.5], [23.4, 70.6],
    [24.1, 70.8], [25.0, 71.0], [25.8, 71.05], [26.0, 70.8], [25.5, 70.4],
    [25.2, 70.0], [24.5, 69.6], [23.8, 69.3], [23.4, 69.0], [23.0, 68.9],
    [22.5, 68.8], [21.8, 68.7], [21.0, 68.6], [20.2, 68.5], [19.5, 68.4],
    [18.8, 68.2], [18.2, 67.95], [17.6, 67.7], [17.0, 67.45], [16.4, 67.2],
    [15.8, 66.95], [15.4, 66.7], [15.0, 66.5], [14.6, 66.3], [14.2, 66.0],
    [13.7, 65.8], [13.0, 65.6], [12.5, 66.2],
  ]
  const coastPts = COAST.map(([lon, lat]) =>
    project(lat, lon).join(","),
  ).join(" ")

  const BORDER: [number, number][] = [
    [12.2, 65.7], [13.5, 66.1], [14.7, 66.7], [15.6, 67.3], [16.5, 67.8],
    [17.3, 68.1], [18.5, 68.5], [19.5, 68.6], [20.4, 68.7], [21.0, 69.0],
    [21.7, 69.2], [22.5, 69.4], [23.2, 69.5], [24.0, 69.6], [24.8, 69.8],
    [25.5, 70.0], [25.9, 70.3], [26.0, 70.8],
  ]
  const borderPts = BORDER.map(([lon, lat]) =>
    project(lat, lon).join(","),
  ).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`}>
      <rect className="water" x={0} y={0} width={W} height={H} />
      <polygon className="land" points={coastPts} />
      <polyline
        points={borderPts}
        fill="none"
        stroke="var(--warm-grey-75)"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <g className="pins">
        {cities.map((c) => {
          const [x, y] = project(c.lat, c.lon)
          const isActive = c.id === activeCityId
          return (
            <g
              key={c.id}
              className={`pin${isActive ? " active" : ""}`}
              transform={`translate(${x},${y})`}
              onClick={() => onSelectCity(c.id)}
              style={{ cursor: "pointer" }}
            >
              <circle r={c.id === "bodo" ? 8 : 6} />
              <text y={-14}>{c.name}</text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
