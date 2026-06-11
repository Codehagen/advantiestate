"use client"

// Client boundary for the location-panel map. The panel itself stays a Server
// Component; this wrapper does the dynamic({ ssr: false }) import — Next 16
// forbids ssr:false in Server Components, and Leaflet needs `window`.
// Reuses the single-pin PropertyMapLeaflet from eiendommer (same CartoDB
// editorial palette, drag disabled so touch scrolls the page).

import dynamic from "next/dynamic"

const PropertyMapLeaflet = dynamic(
  () =>
    import("@/components/eiendommer/PropertyMapLeaflet").then(
      (m) => m.PropertyMapLeaflet,
    ),
  { ssr: false, loading: () => <div style={{ height: "100%" }} /> },
)

export function CityLocationMapClient({
  lat,
  lng,
  label,
}: {
  lat: number
  lng: number
  label: string
}) {
  return (
    <PropertyMapLeaflet
      lat={lat}
      lng={lng}
      label={label}
      zoom={14}
      zoomControl={false}
    />
  )
}
