"use client"

// /markedsinnsikt/kart — Bodø price-zone detail map on Leaflet. Replaces the
// Mapbox MarkedsKart that white-screened in production. Loaded browser-only by
// MarkedsKartClient via next/dynamic({ ssr: false }).
//
// The price zones are Advanti's *indicative* estimates — labelled as such, so
// the authoritative Leaflet basemap + official GeoNorge cadastral overlay do
// not lend false precision to hand-drawn shapes (see plan eD8).

import { useState } from "react"
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

export function MarkedsKartLeaflet() {
  const [selectedZone, setSelectedZone] = useState<ZoneProps | null>(null)
  const [showCadastre, setShowCadastre] = useState(false)
  const [tileError, setTileError] = useState(false)

  const onEachZone = (feature: Feature<Polygon, ZoneProps>, layer: Layer) => {
    const path = layer as Path
    layer.on({
      mouseover: () => {
        path.setStyle({ fillOpacity: ZONE.activeFillOpacity })
        setSelectedZone(feature.properties)
      },
      mouseout: () => {
        path.setStyle({ fillOpacity: ZONE.fillOpacity })
        setSelectedZone(null)
      },
    })
  }

  return (
    <div className="mi-kart-shell">
      <MapContainer
        center={BODO_CENTER}
        zoom={BODO_ZOOM}
        minZoom={11}
        maxZoom={TILE_MAX_ZOOM}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={TILE_URL}
          attribution={TILE_ATTRIBUTION}
          maxZoom={TILE_MAX_ZOOM}
          eventHandlers={{ tileerror: () => setTileError(true) }}
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

      {selectedZone && (
        <div className="mi-zone-panel">
          <div className="mi-zone-eyebrow">Indikativ prissone</div>
          <h3>{selectedZone.name}</h3>
          <div className="mi-zone-row">
            <span className="l">Kontor</span>
            <span className="v">{selectedZone.kontorPriceRange}</span>
          </div>
          <div className="mi-zone-row">
            <span className="l">Handel</span>
            <span className="v">{selectedZone.handelPriceRange}</span>
          </div>
          <div className="mi-zone-row">
            <span className="l">Logistikk</span>
            <span className="v">{selectedZone.logistikkPriceRange}</span>
          </div>
        </div>
      )}

      <div className="mi-kart-disclaimer">
        Soneinndeling og priser er Advantis indikative estimater per Q4 2025,
        ikke oppmålte tall.
        {tileError ? " Noen kartfliser kunne ikke lastes." : ""}
      </div>
    </div>
  )
}
