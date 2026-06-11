"use client";

import "leaflet/dist/leaflet.css";

import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";

import {
  MARKER,
  TILE_ATTRIBUTION,
  TILE_MAX_ZOOM,
  TILE_URL,
} from "@/components/markedsinnsikt/maps/mapTheme";

interface PropertyMapLeafletProps {
  lat: number;
  lng: number;
  label: string;
  /** Override the default street-level zoom (15) when needed. */
  zoom?: number;
  /** Hide the +/- control for small embeds (e.g. the city-page location panel). */
  zoomControl?: boolean;
}

/**
 * Single-property Leaflet map. Mirrors the editorial CartoDB-tile palette used
 * by the markedsinnsikt overview map, but framed tight enough to read the
 * street grid. Drag/wheel-zoom are kept off so a one-finger touch-drag scrolls
 * the page instead of being trapped by the map; the +/- control stays for
 * intentional zoom.
 */
export function PropertyMapLeaflet({
  lat,
  lng,
  label,
  zoom = 15,
  zoomControl = true,
}: PropertyMapLeafletProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      minZoom={5}
      maxZoom={TILE_MAX_ZOOM}
      zoomControl={zoomControl}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={TILE_URL}
        attribution={TILE_ATTRIBUTION}
        maxZoom={TILE_MAX_ZOOM}
      />
      <CircleMarker
        center={[lat, lng]}
        radius={MARKER.activeRadius}
        pathOptions={{
          color: MARKER.activeHalo,
          weight: 3,
          fillColor: MARKER.fill,
          fillOpacity: 1,
        }}
      >
        <Tooltip
          permanent
          direction="top"
          offset={[0, -8]}
          className="mi-map-label"
        >
          {label}
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
