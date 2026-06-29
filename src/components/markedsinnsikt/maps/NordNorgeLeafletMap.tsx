"use client"

// Tab-05 overview map — the six Advanti coverage cities on a real Leaflet
// basemap. Replaces the hand-rolled stylized SVG NordNorgeMap. Loaded by
// MarkedsinnsiktShell via next/dynamic({ ssr: false }) — Leaflet needs `window`.

import { useEffect, useMemo, useRef } from "react"
import type { CircleMarker as LeafletCircleMarker } from "leaflet"
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet"

import type { MapCity } from "../types"
import { MARKER, TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL } from "./mapTheme"

interface NordNorgeLeafletMapProps {
  cities: MapCity[]
  activeCityId: string
  onSelectCity: (id: string) => void
}

// Framed so all six cities (Mo i Rana in the south to Alta in the north-east)
// sit comfortably in view.
const CENTER: [number, number] = [68.7, 18]
const ZOOM = 5

// A single overview-map city marker. The visible CircleMarker is decorative
// (interactive:false); a transparent CircleMarker on top carries the click +
// keyboard handlers and the accessibility attributes, with radius >= 22 so the
// tap target clears 44px (the visible dot is only 14-20px). Mirrors CityMarker
// in MarkedsKartLeafletCelle.
function NordNorgeMarker({
  city,
  isActive,
  onSelectCity,
}: {
  city: MapCity
  isActive: boolean
  onSelectCity: (id: string) => void
}) {
  const markerRef = useRef<LeafletCircleMarker | null>(null)
  const radius = isActive ? MARKER.activeRadius : MARKER.radius
  const label = `${city.name}, velg by`

  const eventHandlers = useMemo(
    () => ({
      // The Leaflet element exists once added — set ARIA + role here.
      add: () => {
        const el = markerRef.current?.getElement() as SVGElement | null
        if (!el) return
        el.setAttribute("role", "button")
        el.setAttribute("tabindex", "0")
        el.setAttribute("aria-label", label)
        if (!el.hasAttribute("aria-pressed")) {
          el.setAttribute("aria-pressed", "false")
        }
      },
      click: () => onSelectCity(city.id),
      keydown: (e: unknown) => {
        const oe = (e as { originalEvent?: KeyboardEvent }).originalEvent
        if (oe?.key === "Enter" || oe?.key === " ") {
          oe.preventDefault()
          onSelectCity(city.id)
        }
      },
    }),
    [city.id, label, onSelectCity],
  )

  // Re-apply aria-pressed when the selection changes (Leaflet does not re-fire add).
  useEffect(() => {
    const el = markerRef.current?.getElement() as SVGElement | null
    if (!el) return
    el.setAttribute("aria-label", label)
    el.setAttribute("aria-pressed", String(isActive))
  }, [label, isActive])

  return (
    <>
      {/* Visible marker — decorative; the transparent hit-circle below carries input. */}
      <CircleMarker
        center={[city.lat, city.lon]}
        radius={radius}
        pathOptions={{
          color: isActive ? MARKER.activeHalo : MARKER.stroke,
          weight: isActive ? 3 : MARKER.strokeWidth,
          fillColor: MARKER.fill,
          fillOpacity: 1,
          interactive: false,
        }}
      >
        <Tooltip permanent direction="top" offset={[0, -6]} className="mi-map-label">
          {city.name}
        </Tooltip>
      </CircleMarker>

      {/* Transparent >=44px hit target carrying handlers + a11y. */}
      <CircleMarker
        ref={markerRef}
        center={[city.lat, city.lon]}
        radius={Math.max(radius, 22)}
        pathOptions={{
          color: "transparent",
          weight: 0,
          fillColor: "transparent",
          fillOpacity: 0,
        }}
        eventHandlers={eventHandlers}
      />
    </>
  )
}

export function NordNorgeLeafletMap({
  cities,
  activeCityId,
  onSelectCity,
}: NordNorgeLeafletMapProps) {
  return (
    <MapContainer
      center={CENTER}
      zoom={ZOOM}
      minZoom={4}
      maxZoom={TILE_MAX_ZOOM}
      // A fixed, clickable overview — pan/zoom disabled so a one-finger
      // touch-drag scrolls the page instead of being trapped by the map.
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={TILE_URL}
        attribution={TILE_ATTRIBUTION}
        maxZoom={TILE_MAX_ZOOM}
      />
      {cities.map((c) => (
        <NordNorgeMarker
          key={c.id}
          city={c}
          isActive={c.id === activeCityId}
          onSelectCity={onSelectCity}
        />
      ))}
    </MapContainer>
  )
}
