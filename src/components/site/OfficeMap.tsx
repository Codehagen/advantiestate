"use client";

// Server-Component-safe office map. Next 16 forbids ssr:false in Server
// Components and Leaflet needs `window`, so the dynamic import lives in this
// client boundary. Reuses the single-pin PropertyMapLeaflet (same CartoDB
// editorial palette, drag disabled so a touch-drag scrolls the page) framed at
// street level so you can read which building the office sits in.

import dynamic from "next/dynamic";

const PropertyMapLeaflet = dynamic(
  () =>
    import("@/components/eiendommer/PropertyMapLeaflet").then(
      (m) => m.PropertyMapLeaflet,
    ),
  {
    ssr: false,
    loading: () => <div className="office-map-loading" aria-hidden="true" />,
  },
);

export function OfficeMap({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) {
  return (
    <div className="office-map" aria-label={`Kart over kontoret i ${label}`}>
      <PropertyMapLeaflet
        lat={lat}
        lng={lng}
        label={label}
        zoom={15}
        zoomControl={false}
      />
    </div>
  );
}
