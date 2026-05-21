"use client"

// Tab-05 overview map — the six Advanti coverage cities on a real Leaflet
// basemap. Replaces the hand-rolled stylized SVG NordNorgeMap. Loaded by
// MarkedsinnsiktShell via next/dynamic({ ssr: false }) — Leaflet needs `window`.

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
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={TILE_URL}
        attribution={TILE_ATTRIBUTION}
        maxZoom={TILE_MAX_ZOOM}
      />
      {cities.map((c) => {
        const isActive = c.id === activeCityId
        return (
          <CircleMarker
            key={c.id}
            center={[c.lat, c.lon]}
            radius={isActive ? MARKER.activeRadius : MARKER.radius}
            pathOptions={{
              color: isActive ? MARKER.activeHalo : MARKER.stroke,
              weight: isActive ? 3 : MARKER.strokeWidth,
              fillColor: MARKER.fill,
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onSelectCity(c.id) }}
          >
            <Tooltip
              permanent
              direction="top"
              offset={[0, -6]}
              className="mi-map-label"
            >
              {c.name}
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
