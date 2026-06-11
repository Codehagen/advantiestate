// Market block for the city pages — chart card + key-figure tiles.
//
// Server component: the chart SVG is rendered at build time from the
// whitelisted published series (cityMarketData.ts — autoplan E2), so the
// page ships no chart JS and has zero layout shift. The only client piece
// is the tooltip overlay (ChartTooltipOverlay), which receives precomputed
// serializable points.
//
// Honest labelling: the yield/styringsrente series are REGIONAL (Nord-Norge),
// never presented as city-specific. Per-city sparklines appear only for the
// three cities with canonical published leie history; vacancy is shown as the
// published snapshot without an invented trend.

import Link from "next/link"

import {
  CHART_QUARTERS,
  CHART_QUARTERS_F,
  fmtComma,
  fmtGroup,
  getLeieHist,
  getVacancySnapshot,
  PORTAL_CITY_BY_SLUG,
  PORTAL_PALETTE,
  STYRINGSRENTE_F,
  STYRINGSRENTE_HIST,
  YIELD_KONTOR_F,
  YIELD_KONTOR_HIST,
} from "./cityMarketData"
import { ChartTooltipOverlay, type ChartPoint } from "./ChartTooltipOverlay"

const W = 720
const H = 320
const PAD = { t: 18, r: 16, b: 34, l: 38 }
const Y_MIN = 2.5
const Y_MAX = 7.0
const TICKS = [3, 4, 5, 6, 7]

function sparkSvg(arr: number[], color: string) {
  const w = 92
  const h = 30
  const pad = 3
  const mn = Math.min(...arr)
  const mx = Math.max(...arr)
  const xx = (i: number) => pad + (w - 2 * pad) * (i / (arr.length - 1))
  const yy = (v: number) => pad + (h - 2 * pad) * (1 - (v - mn) / (mx - mn || 1))
  const d = arr
    .map((v, i) => `${i ? "L" : "M"}${xx(i).toFixed(1)} ${yy(v).toFixed(1)}`)
    .join(" ")
  const lastX = xx(arr.length - 1).toFixed(1)
  const lastY = yy(arr[arr.length - 1]!).toFixed(1)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2.6} fill={color} />
    </svg>
  )
}

type Delta = { text: string; cls: "up" | "down" | "flat"; note: string }

function DeltaNote({ delta }: { delta: Delta }) {
  return (
    <div className="td">
      <span className={delta.cls}>{delta.text}</span> · {delta.note}
    </div>
  )
}

export function CityMarketBlock({ slug }: { slug: string }) {
  const city = PORTAL_CITY_BY_SLUG[slug]
  if (!city) return null

  const labels = [...CHART_QUARTERS, ...CHART_QUARTERS_F]
  const histN = CHART_QUARTERS.length
  const ySeries = [...YIELD_KONTOR_HIST, ...YIELD_KONTOR_F]
  const rSeries = [...STYRINGSRENTE_HIST, ...STYRINGSRENTE_F]
  const n = labels.length

  const x = (i: number) => PAD.l + (W - PAD.l - PAD.r) * (i / (n - 1))
  const y = (v: number) =>
    PAD.t + (H - PAD.t - PAD.b) * (1 - (v - Y_MIN) / (Y_MAX - Y_MIN))

  const pathFor = (arr: number[], fromI: number) =>
    arr
      .map(
        (v, k) =>
          `${k === 0 ? "M" : "L"}${x(fromI + k).toFixed(1)} ${y(v).toFixed(1)}`,
      )
      .join(" ")

  // Solid history (incl. join point) + dashed forecast joined at the last
  // historical point — D-spec 4 acceptance criterion.
  const yHist = ySeries.slice(0, histN)
  const yFc = ySeries.slice(histN - 1)
  const rHist = rSeries.slice(0, histN)
  const rFc = rSeries.slice(histN - 1)

  const areaPts = yHist
    .map((v, k) => `${x(k).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" L ")
  const area = `M ${areaPts} L ${x(histN - 1).toFixed(1)} ${y(Y_MIN).toFixed(1)} L ${x(0).toFixed(1)} ${y(Y_MIN).toFixed(1)} Z`

  const points: ChartPoint[] = ySeries.map((v, i) => ({
    x: Number(x(i).toFixed(1)),
    y: Number(y(v).toFixed(1)),
    label: labels[i]!,
    yieldText: `${fmtComma(v, 2)} %`,
    renteText: `${fmtComma(rSeries[i]!, 2)} %`,
    forecast: i >= histN,
  }))

  // ── tiles ──────────────────────────────────────────────────────────────
  const yieldLast = YIELD_KONTOR_HIST[YIELD_KONTOR_HIST.length - 1]!
  const yieldYoY = Math.round(
    (yieldLast - YIELD_KONTOR_HIST[YIELD_KONTOR_HIST.length - 5]!) * 100,
  )
  const yieldDelta: Delta =
    yieldYoY === 0
      ? { text: "→ uendret", cls: "flat", note: "siste 12 mnd · Nord-Norge" }
      : {
          text: `${yieldYoY > 0 ? "▲" : "▼"} ${Math.abs(yieldYoY)} bps`,
          cls: yieldYoY > 0 ? "up" : "down",
          note: "siste 12 mnd · Nord-Norge",
        }

  const leieHist = getLeieHist(city)
  const leieLast = leieHist ? leieHist[leieHist.length - 1]! : null
  const leieYoY = leieHist
    ? (leieHist[leieHist.length - 1]! / leieHist[leieHist.length - 5]! - 1) * 100
    : null

  const vacancy = getVacancySnapshot(city)

  const summary = `Prime kontoryield i Nord-Norge er ${fmtComma(yieldLast, 2)} prosent per ${CHART_QUARTERS[histN - 1]}, mot en styringsrente på ${fmtComma(STYRINGSRENTE_HIST[histN - 1]!, 2)} prosent. Prognosen mot ${CHART_QUARTERS_F[CHART_QUARTERS_F.length - 1]} peker mot ${fmtComma(YIELD_KONTOR_F[YIELD_KONTOR_F.length - 1]!, 2)} prosent.`

  const ink = PORTAL_PALETTE.ink
  const terra = PORTAL_PALETTE.terra

  return (
    <div className="cy-market-grid">
      <div className="cy-chartcard">
        <div className="ch-head">
          <span className="ch-title">
            Prime kontoryield mot styringsrente — Nord-Norge
          </span>
          <span className="ch-leg">
            <span className="lg">
              <span className="sw" style={{ background: ink }} />
              Prime yield
            </span>
            <span className="lg">
              <span className="sw" style={{ background: terra }} />
              Styringsrente
            </span>
            <span className="lg" style={{ color: "var(--warm-grey-85)" }}>
              <span className="sw dash" />
              Prognose
            </span>
          </span>
        </div>
        <div className="cy-chart">
          <div className="cy-chartwrap">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label="Prime kontoryield mot styringsrente i Nord-Norge, siste tre år med prognose"
            >
              <rect
                x={x(histN - 1).toFixed(1)}
                y={PAD.t}
                width={(x(n - 1) - x(histN - 1)).toFixed(1)}
                height={H - PAD.t - PAD.b}
                fill={PORTAL_PALETTE.faint}
                opacity={0.4}
              />
              {TICKS.map((t) => (
                <g key={t}>
                  <line
                    x1={PAD.l}
                    x2={W - PAD.r}
                    y1={y(t).toFixed(1)}
                    y2={y(t).toFixed(1)}
                    stroke={PORTAL_PALETTE.grid}
                  />
                  <text
                    x={PAD.l - 9}
                    y={(y(t) + 3.5).toFixed(1)}
                    textAnchor="end"
                    fontSize={10.5}
                    fill="var(--warm-grey-85)"
                    fontFamily="var(--font-body)"
                  >
                    {t}%
                  </text>
                </g>
              ))}
              <path d={area} fill={ink} opacity={0.05} />
              <path d={pathFor(rHist, 0)} fill="none" stroke={terra} strokeWidth={2.2} />
              <path
                d={pathFor(rFc, histN - 1)}
                fill="none"
                stroke={terra}
                strokeWidth={2.2}
                strokeDasharray="2 4"
                opacity={0.85}
              />
              <path d={pathFor(yHist, 0)} fill="none" stroke={ink} strokeWidth={2.8} />
              <path
                d={pathFor(yFc, histN - 1)}
                fill="none"
                stroke={ink}
                strokeWidth={2.8}
                strokeDasharray="2 4"
                opacity={0.85}
              />
              {points.map((p, i) => (
                <circle
                  key={p.label}
                  cx={p.x}
                  cy={p.y}
                  r={3.2}
                  fill={ink}
                  opacity={i >= histN ? 0.55 : 1}
                />
              ))}
              {labels.map((l, i) =>
                i % 2 !== 0 && i !== n - 1 ? null : (
                  <text
                    key={l}
                    x={x(i).toFixed(1)}
                    y={H - 12}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--warm-grey-85)"
                    fontFamily="var(--font-body)"
                  >
                    {l}
                  </text>
                ),
              )}
            </svg>
            <ChartTooltipOverlay
              points={points}
              viewW={W}
              viewH={H}
              padT={PAD.t}
              padB={PAD.b}
              inkColor={ink}
              terraColor={terra}
            />
          </div>
          <p className="sr-only">{summary}</p>
        </div>
        <div className="ch-foot">
          <span>
            Prime yield = beste kontor i sentrum, lang WAULT. Skyggelagt =
            prognose 2026. Regionale tall — bynivå i tabellen under.
          </span>
          <Link href="/analyseportal">Full analyse →</Link>
        </div>
      </div>

      <div className="cy-tiles">
        <div className="cy-tile">
          <div className="tl">Prime kontoryield · Nord-Norge</div>
          <div className="row">
            <div className="tv">
              {fmtComma(yieldLast, 2)}
              <span className="u"> %</span>
            </div>
            <div className="spark">{sparkSvg(YIELD_KONTOR_HIST, ink)}</div>
          </div>
          <DeltaNote delta={yieldDelta} />
        </div>

        {leieLast != null && leieYoY != null && (
          <div className="cy-tile">
            <div className="tl">Prime kontorleie · {city}</div>
            <div className="row">
              <div className="tv">
                {fmtGroup(leieLast)}
                <span className="u"> kr/m²</span>
              </div>
              <div className="spark">{sparkSvg(getLeieHist(city)!, terra)}</div>
            </div>
            <DeltaNote
              delta={{
                text: `${leieYoY >= 0 ? "▲" : "▼"} ${fmtComma(Math.abs(leieYoY), 1)} %`,
                cls: leieYoY >= 0 ? "up" : "down",
                note: "YoY · publisert serie",
              }}
            />
          </div>
        )}

        {vacancy != null && (
          <div className="cy-tile">
            <div className="tl">Kontorledighet · {city}</div>
            <div className="row">
              <div className="tv">
                {fmtComma(vacancy, 1)}
                <span className="u"> %</span>
              </div>
            </div>
            <DeltaNote
              delta={{
                text: "publisert nivå",
                cls: "flat",
                note: "per Q4 2025",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
