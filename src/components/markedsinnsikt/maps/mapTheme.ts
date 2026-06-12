// Shared Leaflet map config for Markedsinnsikt — one source of truth for the
// basemap, attribution, marker/zone style and the GeoNorge overlay, so the
// overview map and the /kart detail map cannot drift apart.
//
// Hex values mirror the advanti-design.css tokens (noted per line). Leaflet
// path/tile options are an imperative third-party layer; literal hex is the
// robust choice here (a CSS var would break under Leaflet's canvas renderer).

// CartoDB "light_all" — free, unauthenticated tiles that match the editorial
// warm-light palette. External dependency: a CARTO outage shows blank tiles
// (no throw); the side panels still carry the data.
export const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

// CartoDB "light_nolabels" — brukes av fase-2 hovedkartet så våre egne
// by-tooltips er kartets eneste typografi.
export const TILE_URL_NOLABELS =
  "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
export const TILE_MAX_ZOOM = 19

// Overview-map city markers — vector CircleMarkers, editorial palette.
export const MARKER = {
  fill: "#2c2825", // --warm-grey
  stroke: "#ffffff",
  strokeWidth: 2,
  radius: 7,
  activeRadius: 10,
  activeHalo: "#cbeef2", // --accent
} as const

// /kart price-zone polygons — indikative (see plan eD8).
export const ZONE = {
  fill: "#cbeef2", // --accent
  fillOpacity: 0.4,
  activeFillOpacity: 0.62,
  stroke: "#2c2825", // --warm-grey
  strokeWidth: 1.5,
} as const

// GeoNorge property-boundary WMS overlay (eD6). Official cadastral lines from
// Kartverket — free, no token. Default OFF: a government WMS server is slower
// than a CDN, so the base map paints first and the user opts in.
export const GEONORGE_WMS = {
  url: "https://wms.geonorge.no/skwms1/wms.matrikkelkart",
  layers: "eiendomsgrense",
  format: "image/png",
  transparent: true,
  attribution: "&copy; Kartverket",
} as const
