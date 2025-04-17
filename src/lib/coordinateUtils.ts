import proj4 from "proj4"

// Define projections
// EPSG:32633 - UTM Zone 33N, EUREF89
proj4.defs("EPSG:32633", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs")

// EPSG:32632 - UTM Zone 32N, EUREF89
proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs")

// EPSG:4326 - WGS84 (standard lat/lon)
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs")

// List of supported EPSG codes
const SUPPORTED_EPSG_CODES = ["32633", "32632", "4326"]

/**
 * Converts UTM coordinates to WGS84 latitude/longitude
 *
 * @param easting Easting (X) UTM coordinate in meters
 * @param northing Northing (Y) UTM coordinate in meters
 * @param epsg EPSG code for the UTM zone (e.g., "32633" for UTM zone 33N)
 * @returns [longitude, latitude] array in WGS84 format
 */
export function utmToLatLng(
  easting: number,
  northing: number,
  epsg: string,
): [number, number] {
  // Check if the EPSG code is supported
  if (!SUPPORTED_EPSG_CODES.includes(epsg)) {
    throw new Error(
      `EPSG code ${epsg} is not supported. Supported codes: ${SUPPORTED_EPSG_CODES.join(", ")}`,
    )
  }

  // Convert from UTM to WGS84
  const result = proj4(`EPSG:${epsg}`, "EPSG:4326", [easting, northing])
  return [result[0], result[1]]
}

/**
 * Parse a representasjonspunkt string in the format "northing easting (epsg)"
 *
 * @param pointString String in format "7460592 516375 (32633)"
 * @returns Object with parsed values and converted lat/lng coordinates
 */
export function parseRepresentasjonspunkt(pointString: string): {
  northing: number
  easting: number
  epsg: string
  coordinates: [number, number] // [longitude, latitude]
} {
  // Parse the string - expecting format "northing easting (epsg)"
  const matches = pointString.match(/(\d+)\s+(\d+)\s+\((\d+)\)/)

  if (!matches || matches.length !== 4) {
    throw new Error(`Invalid representasjonspunkt format: ${pointString}`)
  }

  const northing = parseInt(matches[1], 10)
  const easting = parseInt(matches[2], 10)
  const epsg = matches[3]

  // Convert to lat/lng
  const coordinates = utmToLatLng(easting, northing, epsg)

  return {
    northing,
    easting,
    epsg,
    coordinates,
  }
}

/**
 * Format a representasjonspunkt object in the expected API format
 *
 * @param point Object containing coordinates info
 * @returns Formatted object matching the expected API response
 */
export function formatRepresentasjonspunkt(point: {
  northing: number
  easting: number
  epsg: string
  coordinates: [number, number]
}) {
  return {
    representasjonspunkt: {
      epsg: point.epsg,
      lat: point.coordinates[1],
      lon: point.coordinates[0],
    },
  }
}
