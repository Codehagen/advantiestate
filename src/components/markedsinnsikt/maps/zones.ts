import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson"

export type ZoneSegment = "kontor" | "handel" | "logistikk"
export interface SegmentRange { minKrM2: number; maxKrM2: number } // kr/m²/år

export interface ZoneProps {
  id: string                 // stabil slug, React-key + layer-registry-key
  name: string
  segments: Record<ZoneSegment, SegmentRange> | null // null → sonen rendres IKKE
  reviewedBy: string | null  // hvem internt gjennomgikk tallene (null = utkast)
  reviewedAt: string | null  // "2025-12" — null = utkast
  sourceNote: string         // f.eks. "Advantis transaksjons- og leiedata, Q4 2025"
}
export type ZoneGeometry = Polygon | MultiPolygon // Burøya/havna er reelt diskontinuerlig
export type ZoneFeature = Feature<ZoneGeometry, ZoneProps>
export type ZoneCollection = FeatureCollection<ZoneGeometry, ZoneProps>

export interface CityZoneSet {
  cityId: string             // matcher CityMetrics.id ("bodo", "tromso", "mo", …)
  center: [number, number]   // [lat, lon] for flyTo/setView
  zoom: number               // by-detaljzoom (Bodø: 13)
  minZoneZoom: number        // sonelaget + WMS-toggle aktiveres fra denne zoomen (Bodø: 11)
  asOf: string               // "Q4 2025"
  disclaimer: string         // indikativ-disclaimer
  zones: ZoneCollection
}

/** Formaterer et prisintervall som "2 000–3 500 kr/m²" (NBSP-tusenskilletegn, en-dash). */
export function formatRange(r: SegmentRange): string {
  return `${r.minKrM2.toLocaleString("no-NO")}–${r.maxKrM2.toLocaleString("no-NO")} kr/m²`
}

// Indikative prissoner — koordinater er GeoJSON [lon,lat] og konsumeres av
// <GeoJSON> som-er (ikke gi disse til <Polygon>, som forventer [lat,lng]).
const BODO_FEATURES: ZoneFeature[] = [
  {
    type: "Feature",
    properties: {
      id: "sentrum",
      name: "Sentrum",
      segments: {
        kontor:    { minKrM2: 2000, maxKrM2: 3500 },
        handel:    { minKrM2: 1500, maxKrM2: 2000 },
        logistikk: { minKrM2: 1500, maxKrM2: 2000 },
      },
      reviewedBy: "Advanti megler- og analyseteam",
      reviewedAt: "2025-12",
      sourceNote: "Advantis indikative estimater, Q4 2025",
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
      id: "ronvik",
      name: "Rønvika",
      segments: {
        kontor:    { minKrM2: 1500, maxKrM2: 2000 },
        handel:    { minKrM2: 1500, maxKrM2: 2000 },
        logistikk: { minKrM2: 1500, maxKrM2: 2000 },
      },
      reviewedBy: "Advanti megler- og analyseteam",
      reviewedAt: "2025-12",
      sourceNote: "Advantis indikative estimater, Q4 2025",
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
  // TODO(christer): verifiser geometri + fyll leiepriser
  {
    type: "Feature",
    properties: {
      id: "city-nord",
      name: "City Nord / Stormyra",
      segments: null,
      reviewedBy: null,
      reviewedAt: null,
      sourceNote: "Utkast — ikke publisert",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [14.420, 67.265],
          [14.440, 67.265],
          [14.445, 67.270],
          [14.440, 67.277],
          [14.428, 67.278],
          [14.420, 67.273],
          [14.420, 67.265],
        ],
      ],
    },
  },
  // TODO(christer): verifiser geometri + fyll leiepriser
  {
    type: "Feature",
    properties: {
      id: "plassmyra",
      name: "Plassmyra / flyplassområdet",
      segments: null,
      reviewedBy: null,
      reviewedAt: null,
      sourceNote: "Utkast — ikke publisert",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [14.370, 67.263],
          [14.390, 67.263],
          [14.393, 67.268],
          [14.388, 67.274],
          [14.375, 67.274],
          [14.370, 67.268],
          [14.370, 67.263],
        ],
      ],
    },
  },
  // TODO(christer): verifiser geometri + fyll leiepriser
  {
    type: "Feature",
    properties: {
      id: "buroya-havna",
      name: "Burøya / havna",
      segments: null,
      reviewedBy: null,
      reviewedAt: null,
      sourceNote: "Utkast — ikke publisert",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [14.380, 67.288],
          [14.400, 67.288],
          [14.410, 67.295],
          [14.400, 67.302],
          [14.383, 67.300],
          [14.374, 67.295],
          [14.380, 67.288],
        ],
      ],
    },
  },
]

export const BODO_ZONES: CityZoneSet = {
  cityId: "bodo",
  center: [67.288, 14.395],
  zoom: 13,
  minZoneZoom: 11,
  asOf: "Q4 2025",
  disclaimer:
    "Soneinndeling og priser er Advantis indikative estimater per Q4 2025, ikke oppmålte tall.",
  zones: {
    type: "FeatureCollection",
    features: BODO_FEATURES,
  },
}

export const ZONE_SETS_BY_CITY: Record<string, CityZoneSet> = { bodo: BODO_ZONES }

/** Returnerer FeatureCollection (ikke Feature[]) — <GeoJSON data> forventer collection. */
export function publishedZones(s: CityZoneSet): ZoneCollection {
  return {
    type: "FeatureCollection",
    features: s.zones.features.filter(
      (f) => f.properties.segments !== null && f.properties.reviewedBy !== null,
    ),
  }
}
