// Leaflet's stylesheet, loaded once for all /markedsinnsikt routes (the
// overview map and the /kart detail map) rather than per-component.
import "leaflet/dist/leaflet.css"

export default function MarkedsinnsiktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
