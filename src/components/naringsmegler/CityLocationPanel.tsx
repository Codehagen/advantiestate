// Dark panel beside the lead form — two honest tiers (autoplan E3):
//   · Office cities (officeAddress set): real Leaflet map + address, phone,
//     email, opening hours, and a Google Maps link.
//   · Coverage cities: no map, no address — plain copy stating the city is
//     served from the nearest office, plus phone/email.

import { CityLocationMapClient } from "./CityLocationMapClient"

type Props = {
  cityName: string
  isMainOffice: boolean
  office?: {
    streetAddress: string
    postalCode: string
    addressLocality: string
    addressRegion: string
  } | null
  geo?: { latitude: number; longitude: number } | null
  mapUrl?: string
  phone: string
  email?: string
  openingHours?: string
}

export function CityLocationPanel({
  cityName,
  isMainOffice,
  office,
  geo,
  mapUrl,
  phone,
  email,
  openingHours,
}: Props) {
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`

  if (!office) {
    return (
      <aside className="cy-loc">
        <div className="inner">
          <div className="lpre">Dekning · {cityName}</div>
          <h4>Vi dekker {cityName}</h4>
          <p className="lcover">
            Oppdrag i {cityName} håndteres fra hovedkontoret i Bodø — med
            befaring på stedet og et dedikert team for hele Nord-Norge.
          </p>
          <div className="lrow">
            <span className="k">Telefon</span>
            <a href={phoneHref}>{phone}</a>
          </div>
          {email && (
            <div className="lrow">
              <span className="k">E-post</span>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          )}
        </div>
      </aside>
    )
  }

  return (
    <aside className="cy-loc">
      {geo && (
        <div className="loc-map">
          <CityLocationMapClient
            lat={geo.latitude}
            lng={geo.longitude}
            label={`Advanti · ${office.addressLocality}`}
          />
        </div>
      )}
      <div className="inner">
        <div className="lpre">
          {isMainOffice ? "Hovedkontor" : "Lokalkontor"} · {cityName}
        </div>
        <h4>{office.streetAddress}</h4>
        <address>
          {office.postalCode} {office.addressLocality}
          <br />
          {office.addressRegion}
        </address>
        <div className="lrow">
          <span className="k">Telefon</span>
          <a href={phoneHref}>{phone}</a>
        </div>
        {email && (
          <div className="lrow">
            <span className="k">E-post</span>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        )}
        {openingHours && (
          <div className="lrow">
            <span className="k">Åpningstid</span>
            <span>{openingHours}</span>
          </div>
        )}
        {mapUrl && (
          <div className="lrow">
            <span className="k">Veibeskrivelse</span>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              Se i kart →
            </a>
          </div>
        )}
      </div>
    </aside>
  )
}
