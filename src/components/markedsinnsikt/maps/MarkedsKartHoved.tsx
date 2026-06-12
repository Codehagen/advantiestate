"use client"

// Fase 2: SSR-bar forelder for det ekte Leaflet-hovedkartet.
// Eier all state (metric, selected, pin, zoom, viewRequest) og rendrer:
//   – pills-overlay + gradient-legende (absolutt i kartcellen)
//   – bunnrail med sone-chips, WMS-toggle og reset-knapp
//   – bypanel (høyre kolonne) med sone-blokk og megler-CTAer
//   – rangert tabell i full bredde under kartflaten
//
// Selve Leaflet-kartcellen lastes som next/dynamic({ ssr: false }) — alle
// Leaflet-importer bor i MarkedsKartLeafletCelle.tsx.

import dynamic from "next/dynamic"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { MapErrorBoundary } from "@/components/markedsinnsikt/MapErrorBoundary"
import { trackEvent } from "@/lib/analytics"
import { LATEST_RELEASE } from "@/components/markedsinnsikt/marketReleases"
import { PORTAL_CITY_BY_SLUG } from "@/components/naringsmegler/cityMarketData"

import type { MetricKey } from "./metrics"
import {
  METRIC_KEYS,
  METRICS,
  RAMP_HIGH,
  RAMP_LOW,
  lerpColor,
  useMetricHash,
} from "./metrics"
import {
  ZONE_SETS_BY_CITY,
  formatRange,
  publishedZones,
} from "./zones"
import type { CellCity, ViewRequest } from "./MarkedsKartLeafletCelle"

// ── Bydata ───────────────────────────────────────────────────────────────────

type KartCity = {
  id: string
  name: string
  lat: number
  lon: number
  note: string
  values: Record<MetricKey, number>
}

// PORTAL_CITY_BY_SLUG er den eneste kilden til sannhet for slug-navne-mapping.
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

// ── Dynamic import av Leaflet-kartcellen ─────────────────────────────────────
// next/dynamic med ssr:false må kalles i en "use client"-komponent — OK her.
// Høydereserverende loading-flate hindrer CLS (mi-map-leaflet setter 620/420px).

const MarkedsKartLeafletCelle = dynamic(
  () =>
    import("./MarkedsKartLeafletCelle").then((m) => m.MarkedsKartLeafletCelle),
  {
    ssr: false,
    loading: () => (
      <div className="mi-map-loading" style={{ height: "100%", width: "100%" }}>
        <span>Laster kart …</span>
      </div>
    ),
  },
)

// ── Komponent ────────────────────────────────────────────────────────────────

export function MarkedsKartHoved() {
  const [metric, pickMetric] = useMetricHash()
  const [selected, setSelected] = useState<string>("bodo")
  const [pinnedZoneId, setPinnedZoneId] = useState<string | null>(null)
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null)
  const [showCadastre, setShowCadastre] = useState(false)
  const [zoom, setZoom] = useState(5)
  const [viewRequest, setViewRequest] = useState<ViewRequest>(null)
  const viewNRef = useRef(0)

  const m = METRICS[metric]

  // Norm/min/max for aktiv metric — driver markørstørrelse og ramp
  const { min, max } = useMemo(() => {
    const vals = CITIES.map((c) => c.values[metric])
    return { min: Math.min(...vals), max: Math.max(...vals) }
  }, [metric])

  const norm = useCallback(
    (c: KartCity) =>
      max === min ? 0.5 : (c.values[metric] - min) / (max - min),
    [metric, min, max],
  )

  // Sortert rangert liste — re-sorteres ved metric-bytte
  const ranked = useMemo(
    () => [...CITIES].sort((a, b) => b.values[metric] - a.values[metric]),
    [metric],
  )

  const selectedCity = CITIES.find((c) => c.id === selected) ?? CITIES[0]!

  // Sone-data for valgt by
  const zoneSet = ZONE_SETS_BY_CITY[selected] ?? null
  const pubZones = useMemo(
    () => (zoneSet ? publishedZones(zoneSet) : null),
    [zoneSet],
  )
  const zonesActive = !!(zoneSet && zoom >= zoneSet.minZoneZoom)

  // Aktiv sone (festet > hover) — vises i panel og mobil-overlay
  const activeZoneId = pinnedZoneId ?? hoveredZoneId
  const activeZone = useMemo(
    () =>
      activeZoneId && pubZones
        ? (pubZones.features.find((f) => f.properties.id === activeZoneId)
            ?.properties ?? null)
        : null,
    [activeZoneId, pubZones],
  )

  // Publiserte soner som prop-array for chip-rendering
  const publishedZoneProps = useMemo(
    () => (pubZones ? pubZones.features.map((f) => f.properties) : []),
    [pubZones],
  )

  // Pre-beregn cell-data til Leaflet-barnet — holder barnet "dumt"
  const cellCities = useMemo(
    (): CellCity[] =>
      CITIES.map((c) => ({
        id: c.id,
        name: c.name,
        lat: c.lat,
        lon: c.lon,
        norm: norm(c),
        formattedValue: m.fmt(c.values[metric]),
        ariaLabel: `${c.name}: ${m.fmt(c.values[metric])}`,
      })),
    [metric, norm, m],
  )

  // Nullstill pin + hover ved bytte av by eller ved zoom under terskel
  useEffect(() => {
    setPinnedZoneId(null)
    setHoveredZoneId(null)
    // WMS-laget hører til sonevisningen — uten denne ville laget fortsette å
    // hente GeoNorge-tiles etter bybytte mens togglen (eneste av-knapp) er
    // skjult (codex-funn).
    setShowCadastre(false)
  }, [selected])

  useEffect(() => {
    if (zoneSet && zoom < zoneSet.minZoneZoom) {
      setPinnedZoneId(null)
      setHoveredZoneId(null)
      setShowCadastre(false)
    }
  }, [zoom, zoneSet])

  // ── Callbacks ───────────────────────────────────────────────────────────────

  const handleSelectCity = useCallback((id: string) => {
    setSelected(id)
    // Bytte av selected trigger selected-change-effekten i MapController
  }, [])

  const handleZoneViewCta = useCallback(() => {
    viewNRef.current += 1
    setViewRequest({ kind: "zones", n: viewNRef.current })
  }, [])

  const handleZonePin = useCallback((id: string | null) => {
    setPinnedZoneId((cur) => (id === null || cur === id ? null : id))
  }, [])

  const handleChipClick = useCallback(
    (id: string) => {
      // Toggle: andre klikk på samme chip LØSNER pinnen — da skal kartet stå
      // i ro, ikke fly mot sonen brukeren nettopp lukket (red-team-funn).
      const isPinning = pinnedZoneId !== id
      setPinnedZoneId(isPinning ? id : null)
      if (isPinning) {
        viewNRef.current += 1
        setViewRequest({ kind: "zone-bounds", id, n: viewNRef.current })
      }
    },
    [pinnedZoneId],
  )

  const handleReset = useCallback(() => {
    setPinnedZoneId(null)
    setHoveredZoneId(null)
    viewNRef.current += 1
    setViewRequest({ kind: "reset", n: viewNRef.current })
  }, [])

  // Scroll til panel på mobil (fra mini-overlay-lenke)
  const scrollToPanel = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    // Motion-guard (samme mønster som moveTo i kartcellen): smooth kun når
    // brukeren ikke har bedt om redusert bevegelse.
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    document.getElementById("mi-map-info")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
    })
  }, [])

  return (
    <>
      {/* ── Kartflate-grid ─────────────────────────────────────────────────── */}
      <div className="mi-map-card">
        {/* VENSTRE: kartcelle med overlays */}
        <div className="mi-map-leaflet">
          {/* Pills-overlay absolutt topp-venstre — rendret i SSR for CLS/SEO */}
          <div className="mi-map-pills-overlay">
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

          {/* Leaflet-kartcelle — lastes dynamisk, tiles blokkeres i test */}
          <MapErrorBoundary>
            <MarkedsKartLeafletCelle
              cities={cellCities}
              selected={selected}
              zoneCollection={zonesActive ? pubZones : null}
              pinnedZoneId={pinnedZoneId}
              showCadastre={showCadastre}
              viewRequest={viewRequest}
              onSelectCity={handleSelectCity}
              onZoomChange={setZoom}
              onZoneHover={setHoveredZoneId}
              onZonePin={handleZonePin}
            />
          </MapErrorBoundary>

          {/* Bunnrail: chips venstre, kontroller høyre */}
          <div className="mi-map-rail" aria-hidden={!zonesActive && zoom <= 6}>
            <div
              className="mi-rail-left"
              role={zonesActive ? "group" : undefined}
              aria-label={zonesActive ? "Velg prissone" : undefined}
            >
              {zonesActive &&
                publishedZoneProps.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    className="mi-zone-chip mi-rail-btn"
                    aria-pressed={pinnedZoneId === z.id}
                    onClick={() => handleChipClick(z.id)}
                  >
                    {z.name}
                  </button>
                ))}
            </div>
            <div className="mi-rail-right">
              {zonesActive && (
                <button
                  type="button"
                  className="mi-rail-btn"
                  aria-pressed={showCadastre}
                  onClick={() => setShowCadastre((v) => !v)}
                >
                  {showCadastre
                    ? "Skjul eiendomsgrenser"
                    : "Vis eiendomsgrenser"}
                </button>
              )}
              {zoom > 6 && (
                <button
                  type="button"
                  className="mi-rail-btn"
                  onClick={handleReset}
                >
                  Hele Nord-Norge
                </button>
              )}
            </div>
          </div>

          {/* Mobil sone-overlay — ≤880px, vises kun når en sone er festet */}
          {pinnedZoneId && activeZone?.segments && (
            <div className="mi-zone-mini">
              <span className="mi-zone-mini-name">{activeZone.name}</span>
              <span className="mi-zone-mini-kontor">
                Kontor {formatRange(activeZone.segments.kontor)}
              </span>
              <a
                href="#mi-map-info"
                className="mi-zone-mini-link"
                onClick={scrollToPanel}
              >
                Se detaljer
              </a>
            </div>
          )}
        </div>

        {/* HØYRE: bypanel */}
        <div
          className="mi-map-info"
          id="mi-map-info"
          aria-live="polite"
          aria-label={`Markedsdetaljer for ${selectedCity.name}`}
        >
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
              <span className="v">
                {METRICS[key].fmt(selectedCity.values[key])}
              </span>
            </div>
          ))}

          {/* Prissone-CTA eller Bodø-only-note (design 2.1) */}
          {zoneSet ? (
            <button
              type="button"
              className="btn btn-dark btn-sm mi-map-info-zone-cta"
              onClick={handleZoneViewCta}
            >
              Se prissoner i {selectedCity.name}
            </button>
          ) : (
            <p className="mi-map-info-zone-note">
              Prissoner finnes foreløpig kun for Bodø — flere byer kommer.
            </p>
          )}

          {/* Sone-blokk — vises kun når sone er aktiv og soner er aktiverte */}
          {activeZone && zonesActive && activeZone.segments && (
            <div className="mi-zone-block">
              <div className="mi-zone-eyebrow">
                Prissone · {activeZone.name}
              </div>
              <div className="mi-zone-row">
                <span className="l">Kontor</span>
                <span className="v">
                  {formatRange(activeZone.segments.kontor)}
                </span>
              </div>
              <div className="mi-zone-row">
                <span className="l">Handel</span>
                <span className="v">
                  {formatRange(activeZone.segments.handel)}
                </span>
              </div>
              <div className="mi-zone-row">
                <span className="l">Logistikk</span>
                <span className="v">
                  {formatRange(activeZone.segments.logistikk)}
                </span>
              </div>
              {activeZone.sourceNote && (
                <p className="mi-zone-source-note">{activeZone.sourceNote}</p>
              )}
              {/* Konverteringslenke — typografisk dempet, ikke en tredje pill (design 3.1) */}
              <Link
                href="/tjenester/verdivurdering"
                className="mi-zone-valuation-link"
              >
                Indikative tall — bestill en konkret verdivurdering
              </Link>
            </div>
          )}

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

          {/* Se også — redaksjonell kryss­lenke­blokk for aktiv by.
              Inline markup (klient­komponent) med seogsa-klasser. */}
          {(() => {
            const bySlug = BROKER_SLUG_BY_NAME[selectedCity.name] ?? selectedCity.id
            const seLinks = [
              { href: `/naringsmegler/${bySlug}`, label: `Næringsmegler i ${selectedCity.name}` },
              { href: "/help/article/prime-yield", label: "Prime yield forklart" },
              { href: "/markedsrapport", label: "Markedsrapport" },
            ]
            return (
              <div className="seogsa">
                <div className="seogsa-heading">Gå videre med {selectedCity.name}</div>
                <ul className="seogsa-list">
                  {seLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="seogsa-link"
                        onClick={() => trackEvent("seogsa_click", { from: "kart", to: href })}
                      >
                        {label}
                        <span className="seogsa-arrow">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Disclaimer under kartflaten — vises kun når soner er aktive */}
      {zonesActive && zoneSet && (
        <p className="mi-kart-disclaimer mi-kart-disclaimer--static">
          {zoneSet.disclaimer}
        </p>
      )}

      {/* ── Rangert tabell ────────────────────────────────────────────────── */}
      <div className="mi-rank">
        <div className="rank-head">
          <span>Rangert · {m.label.toLowerCase()}</span>
          <span>{m.hint}</span>
        </div>
        <table className="mi-rank-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Marked</th>
              <th>{METRICS[metric].label}</th>
              {METRIC_KEYS.filter((k) => k !== metric).map((k) => (
                <th key={k} className="mi-rank-secondary">
                  {METRICS[k].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranked.map((c, i) => {
              const t = norm(c)
              return (
                <tr
                  key={c.id}
                  className={c.id === selected ? "active" : ""}
                  onClick={() => handleSelectCity(c.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleSelectCity(c.id)
                    }
                  }}
                  aria-label={`${c.name}, velg by`}
                >
                  <td className="rk">{i + 1}</td>
                  <td className="rc">{c.name}</td>
                  <td className="rb-cell">
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
                  </td>
                  {METRIC_KEYS.filter((k) => k !== metric).map((k) => (
                    <td key={k} className="mi-rank-secondary">
                      {METRICS[k].fmt(c.values[k])}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
