"use client"

import { RiCalendarLine } from "@remixicon/react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef } from "react"

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

interface PropertyMapProps {
  address: string
  coordinates?: [number, number]
}

export function PropertyMap({
  address,
  coordinates = [14.365, 67.285], // Default to Bodø center if no coordinates provided
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: coordinates,
      zoom: 15,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    // Add marker
    marker.current = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map.current)

    return () => {
      marker.current?.remove()
      map.current?.remove()
      map.current = null
    }
  }, [coordinates])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-warm-grey dark:text-warm-white">
            Kart
          </h3>
          <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
            {address}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
          <RiCalendarLine className="size-4" />
          <span>24.05.2023</span>
        </div>
      </div>

      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
        <div ref={mapContainer} className="h-full w-full" />
      </div>
    </div>
  )
}
