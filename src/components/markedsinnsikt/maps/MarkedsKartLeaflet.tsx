"use client"

// /markedsinnsikt/kart — Bodø price-zone detail map on Leaflet. Replaces the
// Mapbox MarkedsKart that white-screened in production. Loaded browser-only by
// MarkedsKartClient via next/dynamic({ ssr: false }).
//
// The price zones are Advanti's *indicative* estimates — labelled as such, so
// the authoritative Leaflet basemap + official GeoNorge cadastral overlay do
// not lend false precision to hand-drawn shapes (see plan eD8).

import { useCallback, useEffect, useRef, useState } from "react"
import type { Layer, Path } from "leaflet"
import type { Feature, FeatureCollection, Polygon } from "geojson"
import { GeoJSON, MapContainer, TileLayer, WMSTileLayer } from "react-leaflet"

import {
  GEONORGE_WMS,
  TILE_ATTRIBUTION,
  TILE_MAX_ZOOM,
  TILE_URL,
  ZONE,
} from "./mapTheme"

interface ZoneProps {
  name: string
  kontorPriceRange: string
  kontorAveragePrice: number
  handelPriceRange: string
  handelAveragePrice: number
  logistikkPriceRange: string
  logistikkAveragePrice: number
}

// Indikative prissoner — coordinates are GeoJSON [lon,lat] and consumed by
// <GeoJSON> as-is (do not hand-feed these to <Polygon>, which wants [lat,lng]).
const priceZones: FeatureCollection<Polygon, ZoneProps> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Sentrum",
        kontorPriceRange: "2 000–3 500 kr/m²",
        kontorAveragePrice: 2750,
        handelPriceRange: "1 500–2 000 kr/m²",
        handelAveragePrice: 1750,
        logistikkPriceRange: "1 500–2 000 kr/m²",
        logistikkAveragePrice: 1750,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [14.370563966178764, 67.27879976112578],
            [14.368664862445641, 67.27928290394863],
            [14.367028537137116, 67.27996903714362],
            [14.37448051543059, 67.2844751344199],
            [14.387516535248835, 67.28654585542375],
            [14.40129045058805, 67.28592939148456],
            [14.400217384935331, 67.28239565973027],
            [14.387462095820695, 67.28078001617851],
            [14.370563966178764, 67.27879976112578],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Rønvika",
        kontorPriceRange: "1 500–2 000 kr/m²",
        kontorAveragePrice: 1750,
        handelPriceRange: "1 500–2 000 kr/m²",
        handelAveragePrice: 1750,
        logistikkPriceRange: "1 500–2 000 kr/m²",
        logistikkAveragePrice: 1750,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [14.40133818208966, 67.28595838252039],
            [14.387681604284523, 67.28672771550177],
            [14.389541431144778, 67.2884428562522],
            [14.394339152821402, 67.28824672294678],
            [14.402176452041203, 67.29449011861325],
            [14.396294798219458, 67.29656755587308],
            [14.393797869710198, 67.29691020863993],
            [14.390857042799269, 67.29641764374736],
            [14.387971703187475, 67.29721002579319],
            [14.390999470205799, 67.2991081570988],
            [14.39449517011792, 67.30024305533345],
            [14.418132760009087, 67.29077678748808],
            [14.409239716176216, 67.28870355676895],
            [14.401970879847653, 67.28585413162625],
            [14.401654530968656, 67.28590625707332],
            [14.40133818208966, 67.28595838252039],
          ],
        ],
      },
    },
  ],
}

const BODO_CENTER: [number, number] = [67.288, 14.395]
const BODO_ZOOM = 13

const zoneStyle = {
  fillColor: ZONE.fill,
  fillOpacity: ZONE.fillOpacity,
  color: ZONE.stroke,
  weight: ZONE.strokeWidth,
}

// All zone-feature properties for the parallel accessible button list.
// Source of truth is `priceZones.features` — keep this derived to avoid drift.
const ZONES: ZoneProps[] = priceZones.features.map((f) => f.properties)

export function MarkedsKartLeaflet() {
  // Two-state selection so touch users can pin a zone without the next stray
  // mouseout clearing it. `hovered` reflects current mouse position on the
  // map; `pinned` reflects an explicit click / Enter / chip selection. The
  // visible panel shows `pinned ?? hovered`.
  const [hovered, setHovered] = useState<ZoneProps | null>(null)
  const [pinned, setPinned] = useState<ZoneProps | null>(null)
  const [showCadastre, setShowCadastre] = useState(false)
  // Maps zone name → its Leaflet Path so we can sync visual state (fill
  // opacity) when the user picks a zone from the chip list above the map.
  const layerByName = useRef<Map<string, Path>>(new Map())

  const active = pinned ?? hovered

  const applyFillOpacity = useCallback(
    (name: string, opacity: number) => {
      layerByName.current.get(name)?.setStyle({ fillOpacity: opacity })
    },
    [],
  )

  // When `pinned` changes, sync fill on the active zone. Hover updates already
  // run inside the Leaflet event handler. This effect catches selections that
  // came from outside the map (chip click, keyboard).
  useEffect(() => {
    ZONES.forEach((z) => {
      const isActive = active?.name === z.name
      applyFillOpacity(
        z.name,
        isActive ? ZONE.activeFillOpacity : ZONE.fillOpacity,
      )
    })
  }, [active, applyFillOpacity])

  // Escape clears the pin so keyboard users can dismiss without a close button
  // reach. The close button still exists for pointer users.
  useEffect(() => {
    if (!pinned) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pinned])

  const togglePin = useCallback((zone: ZoneProps) => {
    setPinned((current) => (current?.name === zone.name ? null : zone))
  }, [])

  const onEachZone = (feature: Feature<Polygon, ZoneProps>, layer: Layer) => {
    const path = layer as Path
    const props = feature.properties
    layerByName.current.set(props.name, path)

    // Surface the zone to assistive tech directly on the SVG path. Leaflet
    // creates the SVG element after `add` fires; getElement is safe by then.
    layer.on("add", () => {
      const el = path.getElement() as SVGElement | null
      if (!el) return
      el.setAttribute("role", "button")
      el.setAttribute("tabindex", "0")
      el.setAttribute(
        "aria-label",
        `Prissone ${props.name}. Trykk for å feste detaljene.`,
      )
    })

    layer.on("mouseover", () => {
      path.setStyle({ fillOpacity: ZONE.activeFillOpacity })
      setHovered(props)
    })
    layer.on("mouseout", () => {
      // Keep active styling on a pinned zone — only revert the rest.
      if (pinned?.name !== props.name) {
        path.setStyle({ fillOpacity: ZONE.fillOpacity })
      }
      setHovered(null)
    })
    layer.on("click", () => togglePin(props))
    // Leaflet wires DOM events on the SVG path; `keypress` covers Enter/Space.
    layer.on("keypress", (e: any) => {
      const key: string | undefined = e?.originalEvent?.key
      if (key === "Enter" || key === " ") {
        e?.originalEvent?.preventDefault?.()
        togglePin(props)
      }
    })
  }

  return (
    <div className="mi-kart-shell">
      {/* Parallel accessible zone list — rendered before the map in the DOM so
          keyboard users encounter it first. Visible as a chip cluster
          overlaid top-left of the map. */}
      <div
        className="mi-zone-list"
        role="group"
        aria-label="Velg prissone"
      >
        {ZONES.map((z) => {
          const isPinned = pinned?.name === z.name
          const isHovered = hovered?.name === z.name && !isPinned
          return (
            <button
              key={z.name}
              type="button"
              className="mi-zone-chip"
              aria-pressed={isPinned}
              data-hovered={isHovered ? "true" : undefined}
              onClick={() => togglePin(z)}
              onMouseEnter={() => setHovered(z)}
              onMouseLeave={() => setHovered(null)}
            >
              {z.name}
            </button>
          )
        })}
      </div>

      <MapContainer
        center={BODO_CENTER}
        zoom={BODO_ZOOM}
        minZoom={11}
        maxZoom={TILE_MAX_ZOOM}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        {/* A few tile 404s (sea, beyond coverage) are normal Leaflet
            behaviour — Leaflet shows blank tiles, no action needed. A
            genuine map crash is caught by the route error.tsx instead. */}
        <TileLayer
          url={TILE_URL}
          attribution={TILE_ATTRIBUTION}
          maxZoom={TILE_MAX_ZOOM}
        />
        {showCadastre && (
          <WMSTileLayer
            url={GEONORGE_WMS.url}
            layers={GEONORGE_WMS.layers}
            format={GEONORGE_WMS.format}
            transparent={GEONORGE_WMS.transparent}
            attribution={GEONORGE_WMS.attribution}
          />
        )}
        <GeoJSON
          data={priceZones}
          style={zoneStyle}
          onEachFeature={onEachZone}
        />
      </MapContainer>

      <button
        type="button"
        className="mi-map-toggle"
        aria-pressed={showCadastre}
        onClick={() => setShowCadastre((v) => !v)}
      >
        {showCadastre ? "Skjul eiendomsgrenser" : "Vis eiendomsgrenser"}
      </button>

      {active && (
        <div
          className="mi-zone-panel"
          role="region"
          aria-live="polite"
          aria-label={`Detaljer for prissone ${active.name}`}
        >
          {pinned && (
            <button
              type="button"
              className="mi-zone-close"
              aria-label="Lukk detaljpanel"
              onClick={() => setPinned(null)}
            >
              ×
            </button>
          )}
          <div className="mi-zone-eyebrow">Indikativ prissone</div>
          <h3>{active.name}</h3>
          <div className="mi-zone-row">
            <span className="l">Kontor</span>
            <span className="v">{active.kontorPriceRange}</span>
          </div>
          <div className="mi-zone-row">
            <span className="l">Handel</span>
            <span className="v">{active.handelPriceRange}</span>
          </div>
          <div className="mi-zone-row">
            <span className="l">Logistikk</span>
            <span className="v">{active.logistikkPriceRange}</span>
          </div>
        </div>
      )}

      <div className="mi-kart-disclaimer">
        Soneinndeling og priser er Advantis indikative estimater per Q4 2025,
        ikke oppmålte tall.
      </div>
    </div>
  )
}
