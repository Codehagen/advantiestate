"use client"

// Interactive Nord-Norge market map for /markedsinnsikt/kart — the dedicated
// by-for-by page from the 2026-06 design handoff. Stylized SVG (no tiles):
// bubble pins encode the selected metric (size + colour ramp), with a
// gradient legend, hover/focus tooltip, ranked list and a city panel that
// links to the city broker pages.
//
// Data: LATEST_RELEASE.cities — published per-city yield/leie/ledighet only.
// The prototype's fourth metric (per-city transaction volume) and 8-quarter
// per-city trend sparkline have no published source and are deliberately
// omitted (same honest-data rule as the city pages, autoplan E2).

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"

import { LATEST_RELEASE } from "@/components/markedsinnsikt/marketReleases"
import { PORTAL_CITY_BY_SLUG } from "@/components/naringsmegler/cityMarketData"
import {
  METRIC_KEYS,
  METRICS,
  RAMP_HIGH,
  RAMP_LOW,
  lerpColor,
  useMetricHash,
} from "./metrics"
import type { MetricKey } from "./metrics"

type KartCity = {
  id: string
  name: string
  lat: number
  lon: number
  note: string
  values: Record<MetricKey, number>
}

// City display name → /naringsmegler location slug, DERIVED from the
// unit-tested PORTAL_CITY_BY_SLUG map (single source of truth — no second
// hand-maintained slug list that can drift when a city is added/renamed).
const BROKER_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(PORTAL_CITY_BY_SLUG).map(([slug, name]) => [name, slug]),
)

const CITIES: KartCity[] = LATEST_RELEASE.cities.map((c) => ({
  id: c.id,
  name: c.name,
  lat: c.lat,
  lon: c.lon,
  note: c.note,
  values: { yield: c.yieldPct, leie: c.leieKrM2, ledighet: c.vacPct },
}))

// ── stylized geography (from the design prototype) ─────────────────────────
const W = 700
const H = 560
const LON_MIN = 12
const LON_MAX = 26
const LAT_MIN = 65.5
const LAT_MAX = 71

const project = (lat: number, lon: number): [number, number] => [
  ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W,
  ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H,
]

// prettier-ignore
const COAST: Array<[number, number]> = [
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

// prettier-ignore
const BORDER: Array<[number, number]> = [
  [12.2, 65.7], [13.5, 66.1], [14.7, 66.7], [15.6, 67.3], [16.5, 67.8],
  [17.3, 68.1], [18.5, 68.5], [19.5, 68.6], [20.4, 68.7], [21.0, 69.0],
  [21.7, 69.2], [22.5, 69.4], [23.2, 69.5], [24.0, 69.6], [24.8, 69.8],
  [25.5, 70.0], [25.9, 70.3], [26.0, 70.8],
]

const COAST_PTS = COAST.map(([lon, lat]) => project(lat, lon).join(",")).join(" ")
const BORDER_PTS = BORDER.map(([lon, lat]) => project(lat, lon).join(",")).join(" ")

export function MarkedsKartNordNorge() {
  const [metric, pickMetric] = useMetricHash()
  const [selected, setSelected] = useState<string>("bodo")
  const [hovered, setHovered] = useState<string | null>(null)

  const m = METRICS[metric]
  const { min, max } = useMemo(() => {
    const vals = CITIES.map((c) => c.values[metric])
    return { min: Math.min(...vals), max: Math.max(...vals) }
  }, [metric])

  const norm = useCallback(
    (c: KartCity) =>
      max === min ? 0.5 : (c.values[metric] - min) / (max - min),
    [metric, min, max],
  )

  const ranked = useMemo(
    () => [...CITIES].sort((a, b) => b.values[metric] - a.values[metric]),
    [metric],
  )

  const selectedCity = CITIES.find((c) => c.id === selected) ?? CITIES[0]!
  const hoveredCity = hovered ? CITIES.find((c) => c.id === hovered) : null

  return (
    <>
      <div className="mi-map-toolbar">
        {/* Segmented control, not tabs: tab semantics promise aria-controls/
            arrow-key navigation we don't implement — aria-pressed is honest. */}
        <div className="mi-metric-pills" role="group" aria-label="Nøkkeltall">
          {METRIC_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={metric === key}
              onClick={() => pickMetric(key)}
            >
              {METRICS[key].label}
            </button>
          ))}
        </div>
        <div className="mi-map-legend">
          <span className="lg-cap">{m.label}</span>
          <span
            className="lg-bar"
            style={{
              background: `linear-gradient(90deg, ${RAMP_LOW}, ${RAMP_HIGH})`,
            }}
          />
          <span className="lg-range">
            <b>{m.fmt(min)}</b> lav · <b>{m.fmt(max)}</b> høy
          </span>
        </div>
      </div>

      <div className="mi-map-card">
        <div className="mi-map">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="group"
            aria-label={`Kart over Nord-Norge med ${m.label.toLowerCase()} per by`}
          >
            <rect className="water" x={0} y={0} width={W} height={H} />
            <polygon className="land" points={COAST_PTS} />
            <polyline
              points={BORDER_PTS}
              fill="none"
              stroke="var(--warm-grey-75)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {CITIES.map((c) => {
              const [x, y] = project(c.lat, c.lon)
              const t = norm(c)
              const r = 9 + t * 15
              return (
                <g
                  key={c.id}
                  className={`pin${c.id === selected ? " active" : ""}`}
                  transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${c.name}: ${m.fmt(c.values[metric])}`}
                  aria-pressed={c.id === selected}
                  onClick={() => setSelected(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setSelected(c.id)
                    }
                  }}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(c.id)}
                  onBlur={() => setHovered(null)}
                >
                  <circle className="halo" r={(r + 7).toFixed(1)} />
                  <circle
                    className="bubble"
                    r={r.toFixed(1)}
                    style={{ fill: lerpColor(RAMP_LOW, RAMP_HIGH, t) }}
                  />
                  <text y={(-r - 8).toFixed(1)}>{c.name}</text>
                </g>
              )
            })}
          </svg>
          {hoveredCity &&
            (() => {
              const [x, y] = project(hoveredCity.lat, hoveredCity.lon)
              return (
                <div
                  className="mi-map-tip show"
                  style={{
                    left: `${(x / W) * 100}%`,
                    top: `${(y / H) * 100}%`,
                  }}
                >
                  <span className="tn">{hoveredCity.name}</span>
                  <span className="tv">{m.fmt(hoveredCity.values[metric])}</span>
                </div>
              )
            })()}
        </div>

        <div className="mi-map-info" aria-live="polite">
          <div className="city-label">Marked · {selectedCity.name}</div>
          <h3>{selectedCity.name}</h3>
          <div className="city-note">{selectedCity.note}</div>
          {METRIC_KEYS.map((key) => (
            <div
              key={key}
              className={`city-stat${key === metric ? " hot" : ""}`}
            >
              <span className="l">
                {key === "yield"
                  ? "Prime yield kontor"
                  : key === "leie"
                    ? "Markedsleie kontor"
                    : "Kontorledighet"}
              </span>
              <span className="v">{METRICS[key].fmt(selectedCity.values[key])}</span>
            </div>
          ))}
          <div className="city-links">
            <Link
              href={`/naringsmegler/${BROKER_SLUG_BY_NAME[selectedCity.name] ?? selectedCity.id}`}
              className="btn btn-dark btn-sm"
            >
              Næringsmegler i {selectedCity.name}{" "}
              <span className="arrow">→</span>
            </Link>
            <Link href="/analyseportal" className="btn btn-outline btn-sm">
              Se i Analyseportalen
            </Link>
          </div>
        </div>
      </div>

      <div className="mi-rank">
        <div className="rank-head">
          <span>Rangert · {m.label.toLowerCase()}</span>
          <span>{m.hint}</span>
        </div>
        {ranked.map((c, i) => {
          const t = norm(c)
          return (
            <button
              key={c.id}
              type="button"
              className={`rank-row${c.id === selected ? " active" : ""}`}
              onClick={() => setSelected(c.id)}
            >
              <span className="rk">{i + 1}</span>
              <span className="rc">{c.name}</span>
              <span className="rb">
                <span
                  className="rb-fill"
                  style={{
                    width: `${(12 + t * 88).toFixed(0)}%`,
                    background: lerpColor(RAMP_LOW, RAMP_HIGH, t),
                  }}
                />
              </span>
              <span className="rv">{m.fmt(c.values[metric])}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
