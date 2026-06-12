"use client"

// Leaflet-kartcelle for /markedsinnsikt/kart — alle Leaflet-importer bor HER.
// Lastes som next/dynamic({ ssr: false }) fra MarkedsKartHoved.tsx.
// Tar imot props/callbacks fra forelderen; eier ingen global state.
//
// Stale-closure-fiks: onEachZone-handlere leser pinnedRef.current (en ref som
// speiler pinnedZoneId-prop via effekt) i stedet for å lukke over prop-verdien
// som var gyldig da onEachZone ble kalt (én gang per GeoJSON-mount).

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import L from "leaflet"
import type { Layer, Path, CircleMarker as LeafletCircleMarker } from "leaflet"
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
  WMSTileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"

import {
  GEONORGE_WMS,
  MARKER,
  TILE_ATTRIBUTION,
  TILE_MAX_ZOOM,
  TILE_URL_NOLABELS,
  ZONE,
} from "./mapTheme"
import { ZONE_SETS_BY_CITY } from "./zones"
import type { ZoneCollection, ZoneFeature } from "./zones"
import { RAMP_HIGH, RAMP_LOW, lerpColor } from "./metrics"

// ── Eksporterte typer (brukes av MarkedsKartHoved) ───────────────────────────

export interface CellCity {
  id: string
  name: string
  lat: number
  lon: number
  /** Normalisert metricverdi 0–1 — driver markørstørrelse og farge. */
  norm: number
  formattedValue: string
  /** Forhåndsberegnet for aria-label: "{name}: {formattedValue}" */
  ariaLabel: string
}

/** Eksplisitt kartbevegelse fra forelderen (ikke byvalg — håndteres via selected-effekt). */
export type ViewRequest = {
  kind: "zones" | "zone-bounds" | "reset"
  id?: string
  /** Monotont stigende teller — effekten kjøres kun ved ny n. */
  n: number
} | null

// ── Props ────────────────────────────────────────────────────────────────────

interface Props {
  cities: CellCity[]
  selected: string
  /** null = sonelaget ikke aktivt (zoom for lavt eller by uten soner). */
  zoneCollection: ZoneCollection | null
  pinnedZoneId: string | null
  showCadastre: boolean
  viewRequest: ViewRequest
  onSelectCity: (id: string) => void
  onZoomChange: (z: number) => void
  onZoneHover: (id: string | null) => void
  /** null = fjern pin; id = toggle (forelderen håndterer toggle-logikken). */
  onZonePin: (id: string | null) => void
}

// Oversiktsutsnittet for Nord-Norge — brukes både som MapContainer-default og
// av reset-knappens moveTo, så de to aldri driver fra hverandre.
const NORD_NORGE_CENTER: [number, number] = [68.7, 18]
const NORD_NORGE_ZOOM = 5

// Sonestil er konstant (alle verdier fra ZONE) — modulnivå så <GeoJSON> ikke
// får ny referanse per render (react-leaflet differ på referanse og kaller
// ellers setStyle på alle lag hver gang forelderen rendrer).
const zoneStyle = {
  fillColor: ZONE.fill,
  fillOpacity: ZONE.fillOpacity,
  color: ZONE.stroke,
  weight: ZONE.strokeWidth,
}

// ── CityMarker ──────────────────────────────────────────────────────────────

interface CityMarkerProps {
  city: CellCity
  isSelected: boolean
  onSelectCity: (id: string) => void
}

function CityMarker({ city, isSelected, onSelectCity }: CityMarkerProps) {
  const [isHovered, setIsHovered] = useState(false)
  const markerRef = useRef<LeafletCircleMarker | null>(null)

  const radius = 8 + city.norm * 10
  const fillColor = lerpColor(RAMP_LOW, RAMP_HIGH, city.norm)
  const showValue = isSelected || isHovered

  // Stabil handler-referanse: react-leaflet v5 av-/på-registrerer ALLE lyttere
  // når eventHandlers-objektet bytter referanse — uten memo skjer det på hver
  // isHovered-flip (5 off + 5 on × 6 markører per hover). aria-attributtene
  // som add-closuren setter re-appliseres uansett av effekten over.
  const eventHandlers = useMemo(
    () => ({
      add: () => {
        // Leaflet-elementet finnes nå — sett accessibility-attributter og
        // DOM-lyttere for focus/blur (ikke i LeafletEventHandlerFnMap)
        const el = markerRef.current?.getElement() as SVGElement | null
        if (!el) return
        el.setAttribute("role", "button")
        el.setAttribute("tabindex", "0")
        el.setAttribute("aria-label", city.ariaLabel)
        // aria-pressed settes initielt av aria-effekten, men add kan fyre før
        // effekten på første mount — sett en trygg default her også.
        if (!el.hasAttribute("aria-pressed")) {
          el.setAttribute("aria-pressed", "false")
        }
        el.addEventListener("focus", () => setIsHovered(true))
        el.addEventListener("blur", () => setIsHovered(false))
      },
      click: () => onSelectCity(city.id),
      mouseover: () => setIsHovered(true),
      mouseout: () => setIsHovered(false),
      keydown: (e: unknown) => {
        const oe = (e as { originalEvent?: KeyboardEvent }).originalEvent
        if (oe?.key === "Enter" || oe?.key === " ") {
          oe.preventDefault()
          onSelectCity(city.id)
        }
      },
    }),
    [city.id, city.ariaLabel, onSelectCity],
  )

  // Re-applikér aria etter metrikebytte (ariaLabel inkluderer formatert verdi)
  // og etter valg-endring (aria-pressed). Leaflet fyrer ikke add på ny.
  useEffect(() => {
    const el = markerRef.current?.getElement() as SVGElement | null
    if (!el) return
    el.setAttribute("aria-label", city.ariaLabel)
    el.setAttribute("aria-pressed", String(isSelected))
  }, [city.ariaLabel, isSelected])

  return (
    <>
      {/* Halo bak hovedmarkøren — alltid rendret for stabil z-rekkefølge.
          interactive: false hindrer halo i å fange klikk. */}
      <CircleMarker
        center={[city.lat, city.lon]}
        radius={radius + 6}
        pathOptions={{
          fillColor: MARKER.activeHalo,
          fillOpacity: isSelected ? 0.4 : 0,
          color: "transparent",
          weight: 0,
          interactive: false,
        }}
      />

      {/* Hovedmarkør */}
      <CircleMarker
        ref={markerRef}
        center={[city.lat, city.lon]}
        radius={radius}
        pathOptions={{
          fillColor,
          fillOpacity: 1,
          color: MARKER.stroke,
          weight: isSelected ? 3 : MARKER.strokeWidth,
        }}
        eventHandlers={eventHandlers}
      >
        <Tooltip
          permanent
          direction="top"
          offset={[0, -(radius + 8)]}
          className={`mi-map-marker-label${isSelected ? " is-active" : ""}`}
        >
          {showValue ? `${city.name} · ${city.formattedValue}` : city.name}
        </Tooltip>
      </CircleMarker>
    </>
  )
}

// ── MapController ───────────────────────────────────────────────────────────

interface ControllerProps {
  selected: string
  cities: CellCity[]
  zoneCollection: ZoneCollection | null
  viewRequest: ViewRequest
  onZoomChange: (z: number) => void
}

function MapController({
  selected,
  cities,
  zoneCollection,
  viewRequest,
  onZoomChange,
}: ControllerProps) {
  const map = useMap()
  const isFirstRender = useRef(true)
  const lastViewN = useRef<number | null>(null)

  // Stabile refs — effekter trenger fersk data uten å reregistrere seg
  const citiesRef = useRef(cities)
  useEffect(() => { citiesRef.current = cities }, [cities])
  const zoneCollectionRef = useRef(zoneCollection)
  useEffect(() => { zoneCollectionRef.current = zoneCollection }, [zoneCollection])
  const selectedRef = useRef(selected)
  useEffect(() => { selectedRef.current = selected }, [selected])

  // ZoomReporter — stabilt handler-MAP (ikke bare stabil funksjon) så
  // react-leaflet ikke av-/på-registrerer zoomend-lytteren på hver
  // MapController-render (cities/viewRequest-endringer)
  const mapEvents = useMemo(
    () => ({ zoomend: () => onZoomChange(map.getZoom()) }),
    [map, onZoomChange],
  )
  useMapEvents(mapEvents)

  // Hjelpefunksjon: respekterer prefers-reduced-motion (sjekkes per kall)
  const moveTo = useCallback(
    (lat: number, lon: number, zoom: number) => {
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
      if (reduced) map.setView([lat, lon], zoom)
      else map.flyTo([lat, lon], zoom)
    },
    [map],
  )

  // (a) Valgt by endres etter første render → fly til by- eller sone-senter
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const city = citiesRef.current.find((c) => c.id === selected)
    if (!city) return
    const zs = ZONE_SETS_BY_CITY[selected] ?? null
    if (zs) moveTo(zs.center[0], zs.center[1], zs.zoom)
    else moveTo(city.lat, city.lon, 11)
    // Bare selected som trigger — andre deps via stabile refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, moveTo])

  // (b) ViewRequest → eksplisitt kartbevegelse (CTA, chip, reset)
  useEffect(() => {
    if (!viewRequest || viewRequest.n === lastViewN.current) return
    lastViewN.current = viewRequest.n

    const { kind, id } = viewRequest
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false

    if (kind === "zones") {
      const zs = ZONE_SETS_BY_CITY[selectedRef.current] ?? null
      if (zs) moveTo(zs.center[0], zs.center[1], zs.zoom)
    } else if (kind === "zone-bounds" && id) {
      const feature = zoneCollectionRef.current?.features.find(
        (f) => f.properties.id === id,
      )
      if (!feature) return
      try {
        const bounds = L.geoJSON(feature).getBounds()
        if (reduced) map.fitBounds(bounds, { padding: [24, 24] })
        else map.flyToBounds(bounds, { padding: [24, 24] })
      } catch {
        /* ugyldig geometri — ignorer */
      }
    } else if (kind === "reset") {
      moveTo(NORD_NORGE_CENTER[0], NORD_NORGE_CENTER[1], NORD_NORGE_ZOOM)
    }
  }, [viewRequest, moveTo, map])

  return null
}

// ── Hoved-eksport ───────────────────────────────────────────────────────────

export function MarkedsKartLeafletCelle({
  cities,
  selected,
  zoneCollection,
  pinnedZoneId,
  showCadastre,
  viewRequest,
  onSelectCity,
  onZoomChange,
  onZoneHover,
  onZonePin,
}: Props) {
  // Touch-enheter: deaktiver pan (én-finger-scroll scroller siden i stedet).
  // Trygt i useState-initializer siden komponen aldri SSR-es (ssr:false).
  const [isCoarse] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)")?.matches ?? false),
  )

  const layerByIdRef = useRef<Map<string, Path>>(new Map())

  // Speil pinnedZoneId-prop til en ref — stale-closure-fiks for onEachZone
  const pinnedRef = useRef<string | null>(pinnedZoneId)
  useEffect(() => {
    pinnedRef.current = pinnedZoneId
  }, [pinnedZoneId])

  // MERK: registeret tømmes BEVISST IKKE ved bybytte. GeoJSON-remounten (via
  // key={selected}) kaller onEachZone i commit-fasen — FØR en eventuell
  // forelder-effekt ville kjørt — så en clear() her ville slette de ferske
  // lagene og drepe pin-highlighten etter en by-rundtur. Stale entries fra
  // avmonterte lag er ufarlige: setStyle på dem er pakket i try/catch, og
  // sone-id-er overskriver per id ved neste mount.

  // Synk fill-opacity på alle registrerte lag ved pin-endring (f.eks. chip-klikk)
  useEffect(() => {
    layerByIdRef.current.forEach((path, id) => {
      try {
        path.setStyle({
          fillOpacity: id === pinnedZoneId ? ZONE.activeFillOpacity : ZONE.fillOpacity,
        })
      } catch {
        /* fjernet lag — ignorer */
      }
    })
  }, [pinnedZoneId])

  // Esc-lytter scoped til pinnet tilstand — tastaturvei for å løsne sone
  useEffect(() => {
    if (!pinnedZoneId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onZonePin(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pinnedZoneId, onZonePin])

  const onEachZone = useCallback(
    (feature: ZoneFeature, layer: Layer) => {
      const path = layer as Path
      const props = feature.properties
      layerByIdRef.current.set(props.id, path)

      // Accessibility-attributter settes etter at Leaflet har laget SVG-elementet
      layer.on("add", () => {
        const el = (path as unknown as { getElement?: () => SVGElement | null }).getElement?.()
        if (!el) return
        el.setAttribute("role", "button")
        el.setAttribute("tabindex", "0")
        el.setAttribute(
          "aria-label",
          `Prissone ${props.name}. Trykk for å feste detaljene.`,
        )
      })

      layer.on("mouseover", () => {
        path.setStyle({ fillOpacity: ZONE.activeFillOpacity })
        onZoneHover(props.id)
      })

      layer.on("mouseout", () => {
        // Behold aktiv farge på festet sone — stale-closure-fiks: les pinnedRef
        if (pinnedRef.current !== props.id) {
          path.setStyle({ fillOpacity: ZONE.fillOpacity })
        }
        onZoneHover(null)
      })

      layer.on("click", () => onZonePin(props.id))

      layer.on("keydown", (e: unknown) => {
        const oe = (e as { originalEvent?: KeyboardEvent }).originalEvent
        if (oe?.key === "Enter" || oe?.key === " ") {
          oe.preventDefault()
          onZonePin(props.id)
        }
      })
    },
    [onZoneHover, onZonePin],
  )

  return (
    <MapContainer
      center={NORD_NORGE_CENTER}
      zoom={NORD_NORGE_ZOOM}
      minZoom={4}
      maxZoom={TILE_MAX_ZOOM}
      scrollWheelZoom={false}
      dragging={!isCoarse}
      touchZoom={isCoarse}
      zoomControl
      style={{ height: "100%", width: "100%" }}
    >
      <MapController
        selected={selected}
        cities={cities}
        zoneCollection={zoneCollection}
        viewRequest={viewRequest}
        onZoomChange={onZoomChange}
      />

      {/* light_nolabels: egne by-tooltips er kartets eneste typografi (design 4.1) */}
      <TileLayer
        url={TILE_URL_NOLABELS}
        attribution={TILE_ATTRIBUTION}
        maxZoom={TILE_MAX_ZOOM}
      />

      {/* GeoNorge matrikkelkart — standard AV, sakte statlig server (se mapTheme) */}
      {showCadastre && (
        <WMSTileLayer
          url={GEONORGE_WMS.url}
          layers={GEONORGE_WMS.layers}
          format={GEONORGE_WMS.format}
          transparent={GEONORGE_WMS.transparent}
          attribution={GEONORGE_WMS.attribution}
        />
      )}

      {cities.map((c) => (
        <CityMarker
          key={c.id}
          city={c}
          isSelected={c.id === selected}
          onSelectCity={onSelectCity}
        />
      ))}

      {/* key={selected} tvinger remount ved bybytte — rydder opp i gamle lag */}
      {zoneCollection && (
        <GeoJSON
          key={selected}
          data={zoneCollection}
          style={zoneStyle}
          onEachFeature={onEachZone}
        />
      )}
    </MapContainer>
  )
}
