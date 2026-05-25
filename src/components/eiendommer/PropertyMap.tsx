"use client";

// Server-Component-safe wrapper. Next 16 disallows ssr:false in Server
// Components, and Leaflet needs `window`, so the dynamic import lives here.

import dynamic from "next/dynamic";

const PropertyMapLeaflet = dynamic(
  () => import("./PropertyMapLeaflet").then((m) => m.PropertyMapLeaflet),
  {
    ssr: false,
    loading: () => <div className="ed-map ed-map-loading" aria-hidden="true" />,
  },
);

export function PropertyMap({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) {
  return (
    <div className="ed-map ed-map-real" aria-label={`Kart over ${label}`}>
      <PropertyMapLeaflet lat={lat} lng={lng} label={label} />
    </div>
  );
}
