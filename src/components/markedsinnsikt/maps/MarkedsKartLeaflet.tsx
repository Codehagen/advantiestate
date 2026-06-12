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
import { GeoJSON, MapContainer, TileLayer, WMSTileLayer } from "react-leaflet"

import {
  GEONORGE_WMS,
  TILE_ATTRIBUTION,
  TILE_MAX_ZOOM,
  TILE_URL,
  ZONE,
} from "./mapTheme"
import { BODO_ZONES, formatRange, publishedZones } from "./zones"
import type { ZoneFeature, ZoneProps } from "./zones"

// Alle publiserte soner — publishedZones-gaten holder utkast (segments: null) ute.
// Avledet fra BODO_ZONES for å unngå drift mellom kartlag og knapperekke.
const ZONES: ZoneProps[] = publishedZones(BODO_ZONES).features.map(
  (f) => f.properties,
)

const zoneStyle = {
  fillColor: ZONE.fill,
  fillOpacity: ZONE.fillOpacity,
  color: ZONE.stroke,
  weight: ZONE.strokeWidth,
}

export function MarkedsKartLeaflet() {
  // Two-state selection so touch users can pin a zone without the next stray
  // mouseout clearing it. `hovered` reflects current mouse position on the
  // map; `pinned` reflects an explicit click / Enter / chip selection. The
  // visible panel shows `pinned ?? hovered`.
  const [hovered, setHovered] = useState<ZoneProps | null>(null)
  const [pinned, setPinned] = useState<ZoneProps | null>(null)
  const [showCadastre, setShowCadastre] = useState(false)
  // Maps zone id → its Leaflet Path so we can sync visual state (fill
  // opacity) when the user picks a zone from the chip list above the map.
  const layerById = useRef<Map<string, Path>>(new Map())

  const active = pinned ?? hovered

  const applyFillOpacity = useCallback(
    (id: string, opacity: number) => {
      layerById.current.get(id)?.setStyle({ fillOpacity: opacity })
    },
    [],
  )

  // When `pinned` changes, sync fill on the active zone. Hover updates already
  // run inside the Leaflet event handler. This effect catches selections that
  // came from outside the map (chip click, keyboard).
  useEffect(() => {
    ZONES.forEach((z) => {
      const isActive = active?.id === z.id
      applyFillOpacity(
        z.id,
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
    setPinned((current) => (current?.id === zone.id ? null : zone))
  }, [])

  const onEachZone = (feature: ZoneFeature, layer: Layer) => {
    const path = layer as Path
    const props = feature.properties
    layerById.current.set(props.id, path)

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
      if (pinned?.id !== props.id) {
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
          const isPinned = pinned?.id === z.id
          const isHovered = hovered?.id === z.id && !isPinned
          return (
            <button
              key={z.id}
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
        center={BODO_ZONES.center}
        zoom={BODO_ZONES.zoom}
        minZoom={BODO_ZONES.minZoneZoom}
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
          data={publishedZones(BODO_ZONES)}
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
          {active.segments && (
            <>
              <div className="mi-zone-row">
                <span className="l">Kontor</span>
                <span className="v">{formatRange(active.segments.kontor)}</span>
              </div>
              <div className="mi-zone-row">
                <span className="l">Handel</span>
                <span className="v">{formatRange(active.segments.handel)}</span>
              </div>
              <div className="mi-zone-row">
                <span className="l">Logistikk</span>
                <span className="v">{formatRange(active.segments.logistikk)}</span>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mi-kart-disclaimer">
        {BODO_ZONES.disclaimer}
      </div>
    </div>
  )
}
