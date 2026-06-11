"use client"

// Analyseportal app shell: sticky sector nav (APG tabs), controls row with
// per-sector visibility, chart/table/compare/insights area, right rail, toast.
//
// Deep links carry the FULL view state — #sector=leie&seg=kontor&byer=…&periode=…
// — parsed with a whitelist on mount (never in a useState initializer: the
// shell is SSR-rendered and React 19 is loud about hydration mismatches).

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import Link from "next/link"
import { trackEvent } from "@/lib/analytics"
import {
  PORTAL_SEGMENTS,
  SEGMENTS3,
  PORTAL_CITIES,
  PORTAL_LATEST,
  NEXT_RELEASE_DATE,
  CITY_COLOR,
  type PortalSegment,
  type PortalCity,
} from "@/components/markedsinnsikt/portalSeries"
import { downloadCsv, csvSupported } from "./csv"
import { ChartErrorBoundary } from "./bits"
import {
  SECTORS,
  CONTROLS,
  buildView,
  type SectorKey,
  type RangeKey,
} from "./sectorViews"

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "3y", label: "3 år" },
  { key: "5y", label: "5 år" },
  { key: "all", label: "Alt" },
]

const DEFAULT_CITIES: PortalCity[] = ["Tromsø", "Bodø", "Harstad"]

// ── hash <-> state (whitelist-validated both ways) ──────────────────────────
interface HashState {
  sector?: SectorKey
  segment?: PortalSegment
  cities?: PortalCity[]
  range?: RangeKey
}

function parseHash(hash: string): HashState {
  const out: HashState = {}
  const params = new URLSearchParams(hash.replace(/^#/, ""))
  const sector = params.get("sector")
  if (sector && SECTORS.some((s) => s.key === sector)) out.sector = sector as SectorKey
  const seg = params.get("seg")
  if (seg && PORTAL_SEGMENTS.some((s) => s.key === seg)) out.segment = seg as PortalSegment
  const byer = params.get("byer")
  if (byer) {
    const cities = byer
      .split(",")
      .filter((c): c is PortalCity => (PORTAL_CITIES as readonly string[]).includes(c))
    if (cities.length > 0) out.cities = cities
  }
  const range = params.get("periode")
  if (range && RANGES.some((r) => r.key === range)) out.range = range as RangeKey
  return out
}

function buildHash(
  sector: SectorKey,
  segment: PortalSegment,
  cities: PortalCity[],
  range: RangeKey,
): string {
  const params = new URLSearchParams()
  params.set("sector", sector)
  const c = CONTROLS[sector]
  if (c.segment) params.set("seg", segment)
  if (c.cities) params.set("byer", cities.join(","))
  if (c.range) params.set("periode", range)
  return `#${params.toString()}`
}

// ── date stamp from the release registry (deterministic, no locale API) ─────
const NO_MONTHS = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"]
function stampFromIso(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return `${d}. ${(NO_MONTHS[m - 1] ?? "").toUpperCase()} ${y}`
}

export interface AnalystCard {
  name: string
  role: string
  photoUrl: string | null
  href: string
}

export function AnalyseportalShell({ analyst }: { analyst: AnalystCard | null }) {
  const [sector, setSectorState] = useState<SectorKey>("yield")
  const [segment, setSegment] = useState<PortalSegment>("kontor")
  const [range, setRange] = useState<RangeKey>("5y")
  const [cities, setCities] = useState<PortalCity[]>(DEFAULT_CITIES)
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState("")
  const [canCsv, setCanCsv] = useState(false)
  // Animate charts only when the sector changes — not on control tweaks.
  const animateRef = useRef(false)
  const mountedRef = useRef(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Initial state from the hash — on mount only (hydration-safe).
  useEffect(() => {
    setCanCsv(csvSupported())
    const h = parseHash(window.location.hash)
    if (h.sector) {
      animateRef.current = true
      setSectorState(h.sector)
    }
    if (h.segment) setSegment(h.segment)
    if (h.cities) setCities(h.cities)
    if (h.range) setRange(h.range)
    // Mark mounted AFTER the state flush so the hash-writer effect below
    // skips its first run and clean URLs never get "#sector=yield" stamped.
    requestAnimationFrame(() => {
      mountedRef.current = true
    })
  }, [])

  // Keep the hash in sync after mount (replaceState — no history spam).
  useEffect(() => {
    if (!mountedRef.current) return
    const hash = buildHash(sector, segment, cities, range)
    window.history.replaceState(null, "", hash)
  }, [sector, segment, cities, range])

  // --nav-h drives where the sticky tabs/controls/rail stack beneath the
  // fixed nav. Static per-breakpoint values proved engine-dependent (±4px
  // between browser builds), so measure the real nav and keep the CSS
  // values only as the no-JS fallback. The observer also tracks the nav's
  // scrolled/unscrolled height transition.
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".nav")
    if (!nav || typeof ResizeObserver === "undefined") return
    const apply = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        // ceil: a fraction too low lets the tabs peek behind the nav.
        `${Math.ceil(nav.getBoundingClientRect().height)}px`,
      )
    apply()
    const ro = new ResizeObserver(apply)
    // border-box: the nav's scrolled state transitions PADDING, which never
    // fires a content-box observation.
    ro.observe(nav, { box: "border-box" })
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty("--nav-h")
    }
  }, [])

  const setSector = useCallback((key: SectorKey) => {
    animateRef.current = true
    setSectorState(key)
    setHidden({})
    trackEvent("analyseportal_sector_change", { sector: key })
  }, [])

  // Leie & ledighet have no hotell — auto-reset (design behavior).
  useEffect(() => {
    if ((sector === "leie" || sector === "ledighet") && segment === "hotell") {
      setSegment("kontor")
    }
  }, [sector, segment])

  const onToggleHidden = useCallback((key: string) => {
    animateRef.current = false
    setHidden((h) => ({ ...h, [key]: !h[key] }))
  }, [])

  const toggleCity = (c: PortalCity) => {
    animateRef.current = false
    setCities((cs) =>
      cs.includes(c) ? (cs.length > 1 ? cs.filter((x) => x !== c) : cs) : [...cs, c],
    )
  }

  const flash = (msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(""), 1800)
  }

  const share = () => {
    const url =
      window.location.origin +
      window.location.pathname +
      buildHash(sector, segment, cities, range)
    trackEvent("analyseportal_share", { sector })
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => flash("Lenke kopiert"))
        .catch(() => flash(`Lenke: ${url}`))
    } else {
      flash(`Lenke: ${url}`)
    }
  }

  const meta = SECTORS.find((s) => s.key === sector)!
  const controls = CONTROLS[sector]
  const segItems = controls.threeSeg ? SEGMENTS3 : PORTAL_SEGMENTS

  const view = useMemo(
    () =>
      buildView(sector, {
        segment,
        range,
        cities,
        hidden,
        onToggleHidden,
        animate: animateRef.current,
      }),
    [sector, segment, range, cities, hidden, onToggleHidden],
  )

  const exportCsv = () => {
    trackEvent("analyseportal_csv_download", { sector })
    if (downloadCsv(`advanti-${sector}.csv`, view.csv)) flash("CSV lastet ned")
  }

  // APG tabs: roving tabindex + arrow keys.
  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next: number | null = null
    if (e.key === "ArrowRight") next = (index + 1) % SECTORS.length
    else if (e.key === "ArrowLeft") next = (index - 1 + SECTORS.length) % SECTORS.length
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = SECTORS.length - 1
    if (next != null) {
      e.preventDefault()
      setSector(SECTORS[next].key)
      tabRefs.current[next]?.focus()
    }
  }

  return (
    <div className="ap-wrap">
      {/* sector nav */}
      <div className="ap-sectornav-clip">
        <div className="ap-sectornav" role="tablist" aria-label="Datakategorier">
          {SECTORS.map((s, i) => (
            <button
              key={s.key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              id={`ap-tab-${s.key}`}
              aria-selected={sector === s.key}
              aria-controls="ap-panel"
              tabIndex={sector === s.key ? 0 : -1}
              className={`ap-sectortab${sector === s.key ? " on" : ""}`}
              onClick={() => setSector(s.key)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              type="button"
            >
              <span className="n">{s.num}</span>
              <span className="l">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* controls */}
      <div className="ap-controls">
        <div className="ap-controls-l">
          {controls.segment && (
            <div className="ap-pills" role="group" aria-label="Segment">
              {segItems.map((it) => (
                <button
                  key={it.key}
                  type="button"
                  className={`ap-pill${segment === it.key ? " on" : ""}`}
                  aria-pressed={segment === it.key}
                  onClick={() => {
                    animateRef.current = false
                    setSegment(it.key)
                  }}
                >
                  {it.label}
                </button>
              ))}
            </div>
          )}
          {controls.cities && (
            <div className="ap-chips" role="group" aria-label="Byer">
              {PORTAL_CITIES.map((c) => {
                const on = cities.includes(c)
                return (
                  <button
                    key={c}
                    type="button"
                    className={`ap-chip${on ? " on" : ""}`}
                    aria-pressed={on}
                    onClick={() => toggleCity(c)}
                  >
                    <span
                      className="dot"
                      style={{
                        background: on ? CITY_COLOR[c] : "transparent",
                        borderColor: CITY_COLOR[c],
                      }}
                    />
                    {c}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <div className="ap-controls-r">
          {controls.range && (
            <div className="ap-seg" role="group" aria-label="Tidsperiode">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  className={range === r.key ? "on" : ""}
                  aria-pressed={range === r.key}
                  onClick={() => {
                    animateRef.current = false
                    setRange(r.key)
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
          {canCsv && (
            <button className="ap-action" type="button" onClick={exportCsv}>
              <span className="ic" aria-hidden="true">↓</span> CSV
            </button>
          )}
          <button className="ap-action" type="button" onClick={share}>
            <span className="ic" aria-hidden="true">⎘</span> Del
          </button>
        </div>
      </div>

      {/* main grid */}
      <div className="ap-grid">
        <div
          className="ap-main"
          id="ap-panel"
          role="tabpanel"
          aria-labelledby={`ap-tab-${sector}`}
        >
          {/* focus header */}
          <div className="ap-focus">
            <div>
              <div className="ap-focus-eyebrow">
                {meta.num} · {meta.label}
              </div>
              <h2>{view.focusTitle}</h2>
            </div>
            <div className="ap-focus-r">
              <div className="ap-focus-val">
                {view.focusValue}
                <span className="u">{view.focusUnit}</span>
              </div>
              <div className="ap-focus-delta">{view.focusDelta}</div>
            </div>
          </div>

          {/* chart card */}
          <div className="ap-chartcard">
            <div className="ap-chart-head">
              <div className="ap-chart-title">{view.chartTitle}</div>
              {view.legend}
            </div>
            <div className="ap-chart">
              <ChartErrorBoundary>{view.chart}</ChartErrorBoundary>
            </div>
            {view.chartFoot && <div className="ap-chart-foot">{view.chartFoot}</div>}
          </div>

          {/* accessible data alternative: the SSR tables further down */}
          <p className="ap-tablelink">
            <a href="#analyseportal-tall">Se tallene som tabell ↓</a>
          </p>

          {/* linked table */}
          {view.table && <div className="ap-tablewrap">{view.table}</div>}

          {/* compare small-multiples */}
          {view.compare}

          {/* insights */}
          <div className="ap-insights">{view.insights}</div>
        </div>

        {/* right rail */}
        <aside className="ap-rail">
          <div className="ap-rail-card">
            <div className="ap-rail-pre">Oppdatert</div>
            <div className="ap-rail-updated">
              {stampFromIso(PORTAL_LATEST.publishedAt)} · {PORTAL_LATEST.quarter}
            </div>
            <p className="ap-rail-note">{view.method}</p>
            <p className="ap-rail-note ap-rail-next">
              Neste oppdatering: {NEXT_RELEASE_DATE}
            </p>
          </div>
          {analyst && (
            <div className="ap-rail-card is-dark">
              <div className="ap-rail-pre">Din analytiker</div>
              <div className="ap-analyst">
                <div
                  className="pic"
                  style={
                    analyst.photoUrl
                      ? { backgroundImage: `url('${analyst.photoUrl}')` }
                      : undefined
                  }
                  aria-hidden="true"
                />
                <div>
                  <h4>{analyst.name}</h4>
                  <div className="role">{analyst.role}</div>
                </div>
              </div>
              <Link
                className="ap-rail-link"
                href="/kontakt"
                data-track="cta_clicked"
                onClick={() => trackEvent("analyseportal_rail_cta", { target: "kontakt" })}
              >
                Bestill skreddersydd analyse →
              </Link>
            </div>
          )}
          <div className="ap-rail-card">
            <div className="ap-rail-pre">Full datatilgang</div>
            <p className="ap-rail-note">
              Komplette tidsserier, eksport og kvartalsrapporter er tilgjengelig
              for investorer med aktivt mandat.
            </p>
            <Link
              className="ap-rail-link"
              href="/investorportal"
              onClick={() => trackEvent("analyseportal_rail_cta", { target: "investorportal" })}
            >
              Åpne investorportal →
            </Link>
          </div>
          <div className="ap-rail-card">
            <div className="ap-rail-pre">Markedskart</div>
            <p className="ap-rail-note">
              Prisnivåer og soner, by for by, finner du i markedskartet på
              markedsinnsikt.
            </p>
            <Link
              className="ap-rail-link"
              href="/markedsinnsikt/kart"
              onClick={() => trackEvent("analyseportal_rail_cta", { target: "kart" })}
            >
              Åpne markedskartet →
            </Link>
          </div>
        </aside>
      </div>

      <div className={`ap-toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  )
}
