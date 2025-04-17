"use client"

import { Card } from "@/components/Card"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef, useState } from "react"

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

interface ZoneProperties {
  name: string
  kontor: {
    priceRange: string
    averagePrice: number
  }
  handel: {
    priceRange: string
    averagePrice: number
  }
  logistikk: {
    priceRange: string
    averagePrice: number
  }
  fillColor: string
}

interface ZoneInfo {
  name: string
  kontor: {
    priceRange: string
    averagePrice: number
  }
  handel: {
    priceRange: string
    averagePrice: number
  }
  logistikk: {
    priceRange: string
    averagePrice: number
  }
}

const priceZones: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Sentrum",
        kontorPriceRange: "2000-3500 kr/m²",
        kontorAveragePrice: 2750,
        handelPriceRange: "1500-2000 kr/m²",
        handelAveragePrice: 1750,
        logistikkPriceRange: "1500-2000 kr/m²",
        logistikkAveragePrice: 1750,
        fillColor: "#E5EEF5", // light-blue variant
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
        kontorPriceRange: "1500-2000 kr/m²",
        kontorAveragePrice: 1750,
        handelPriceRange: "1500-2000 kr/m²",
        handelAveragePrice: 1750,
        logistikkPriceRange: "1500-2000 kr/m²",
        logistikkAveragePrice: 1750,
        fillColor: "#F3F1EF", // warm-white variant
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

export default function MarkedsKart() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const draw = useRef<MapboxDraw | null>(null)
  const [selectedZone, setSelectedZone] = useState<ZoneInfo | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [14.365, 67.285], // Center on Bodø
      zoom: 13,
    })

    // Initialize the draw tool
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    })

    map.current.on("load", () => {
      if (!map.current || !draw.current) return

      // Add the draw tool
      map.current.addControl(draw.current)

      // Log coordinates when a polygon is created or updated
      map.current.on("draw.create", logCoordinates)
      map.current.on("draw.update", logCoordinates)

      // Add the price zones source
      map.current.addSource("zones", {
        type: "geojson",
        data: priceZones,
      })

      // Add a fill layer for the zones
      map.current.addLayer({
        id: "zone-fills",
        type: "fill",
        source: "zones",
        paint: {
          "fill-color": ["get", "fillColor"],
          "fill-opacity": 0.5,
        },
      })

      // Add an outline layer for the zones
      map.current.addLayer({
        id: "zone-borders",
        type: "line",
        source: "zones",
        paint: {
          "line-color": "#2C2825",
          "line-width": 2,
        },
      })

      // Handle mouse events
      map.current.on("mousemove", "zone-fills", (e) => {
        if (e.features?.[0]?.properties?.name) {
          const properties = e.features[0].properties
          setSelectedZone({
            name: properties.name,
            kontor: {
              priceRange: properties.kontorPriceRange,
              averagePrice: properties.kontorAveragePrice,
            },
            handel: {
              priceRange: properties.handelPriceRange,
              averagePrice: properties.handelAveragePrice,
            },
            logistikk: {
              priceRange: properties.logistikkPriceRange,
              averagePrice: properties.logistikkAveragePrice,
            },
          })
        }
      })

      map.current.on("mouseleave", "zone-fills", () => {
        setSelectedZone(null)
      })
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Function to log coordinates of drawn polygons
  const logCoordinates = (e: any) => {
    const data = draw.current?.getAll()
    const polygons = data?.features.filter(
      (f): f is GeoJSON.Feature<GeoJSON.Polygon> =>
        f.geometry.type === "Polygon",
    )

    polygons?.forEach((polygon, index) => {
      console.log(`Polygon ${index + 1} coordinates:`)
      console.log(JSON.stringify(polygon.geometry.coordinates, null, 2))
    })
  }

  return (
    <Card className="relative h-[calc(100vh-12rem)] w-full overflow-hidden">
      <div className="absolute inset-0 z-10">
        <div ref={mapContainer} className="h-full w-full" />
      </div>
      {selectedZone && (
        <div className="absolute bottom-4 right-4 z-20 w-80 rounded-lg border border-warm-grey/20 bg-warm-white p-4 shadow-lg dark:border-warm-white/20 dark:bg-warm-grey">
          <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
            {selectedZone.name}
          </h3>
          <div className="mt-2 space-y-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
            <div>
              <p className="font-medium text-warm-grey dark:text-warm-white">
                Kontor
              </p>
              <p>Prisintervall: {selectedZone.kontor.priceRange}</p>
              <p>Gjennomsnitt: {selectedZone.kontor.averagePrice} kr/m²</p>
            </div>
            <div>
              <p className="font-medium text-warm-grey dark:text-warm-white">
                Handel
              </p>
              <p>Prisintervall: {selectedZone.handel.priceRange}</p>
              <p>Gjennomsnitt: {selectedZone.handel.averagePrice} kr/m²</p>
            </div>
            <div>
              <p className="font-medium text-warm-grey dark:text-warm-white">
                Logistikk
              </p>
              <p>Prisintervall: {selectedZone.logistikk.priceRange}</p>
              <p>Gjennomsnitt: {selectedZone.logistikk.averagePrice} kr/m²</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
