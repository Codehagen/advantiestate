"use client"

// Client boundary for the /kart map. The route's page.tsx stays a Server
// Component (keeps its metadata export); this wrapper does the
// dynamic({ ssr: false }) import — Next 16 forbids ssr:false in Server
// Components, and Leaflet needs `window`.

import dynamic from "next/dynamic"

const MarkedsKartLeaflet = dynamic(
  () => import("./MarkedsKartLeaflet").then((m) => m.MarkedsKartLeaflet),
  {
    ssr: false,
    loading: () => <div className="mi-kart-shell mi-map-loading" />,
  },
)

export function MarkedsKartClient() {
  return (
    <div className="mi-kart-frame">
      <MarkedsKartLeaflet />
    </div>
  )
}
