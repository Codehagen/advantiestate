import { useCallback, useEffect, useState } from "react"

export type MetricKey = "yield" | "leie" | "ledighet"

export const METRICS: Record<
  MetricKey,
  { label: string; hint: string; fmt: (v: number) => string }
> = {
  yield: {
    label: "Prime yield",
    hint: "Avkastningskrav, kontor sentrum",
    fmt: (v) => `${v.toFixed(2).replace(".", ",")} %`,
  },
  leie: {
    label: "Markedsleie",
    hint: "Prime kontorleie, kr/m²/år",
    fmt: (v) => `${Math.round(v).toLocaleString("no-NO")} kr`,
  },
  ledighet: {
    label: "Ledighet",
    hint: "Andel ledig kontorareal",
    fmt: (v) => `${v.toFixed(1).replace(".", ",")} %`,
  },
}
export const METRIC_KEYS = Object.keys(METRICS) as MetricKey[]

// Fargerampe for boblene — lav→høy. Imperativ SVG-fyll trenger literal hex
// (samme begrunnelse som mapTheme.ts); begge ender speiler den redaksjonelle paletten.
export const RAMP_LOW = "#dfeef0"
export const RAMP_HIGH = "#b4623f"

function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
export function lerpColor(a: string, b: string, t: number): string {
  // Clamp: t utenfor [0,1] ville gitt stille feilfarger (CSS klipper 0–255)
  const tc = Math.max(0, Math.min(1, t))
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * tc)},${Math.round(A[1] + (B[1] - A[1]) * tc)},${Math.round(A[2] + (B[2] - A[2]) * tc)})`
}

// #yield / #leie / #ledighet deep-link-hook. Hash leses i mount-effect, ALDRI
// i useState-initializer — React 19 hydreringskrav (forelderen kan SSR-es).
export function useMetricHash(): [MetricKey, (m: MetricKey) => void] {
  const [metric, setMetric] = useState<MetricKey>("yield")

  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.slice(1)
      if (METRIC_KEYS.includes(hash as MetricKey)) setMetric(hash as MetricKey)
    }
    apply()
    window.addEventListener("hashchange", apply)
    return () => window.removeEventListener("hashchange", apply)
  }, [])

  const pickMetric = useCallback((m: MetricKey) => {
    setMetric(m)
    try {
      history.replaceState(null, "", `#${m}`)
    } catch {
      // ignore — history may be unavailable in odd embeds
    }
  }, [])

  return [metric, pickMetric]
}
