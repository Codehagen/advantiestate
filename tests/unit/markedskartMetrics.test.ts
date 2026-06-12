import { describe, it, expect } from "vitest"
import {
  METRICS,
  lerpColor,
  RAMP_LOW,
  RAMP_HIGH,
} from "@/components/markedsinnsikt/maps/metrics"
import { formatRange, publishedZones } from "@/components/markedsinnsikt/maps/zones"
import type { CityZoneSet } from "@/components/markedsinnsikt/maps/zones"

// lerpColor er den interne fargerampen som driver markørstørrelse og gradientlegende.
// Kanttilfellene t=0 og t=1 er garantiene for at rampen ikke inverterer.
describe("lerpColor", () => {
  it("returnerer RAMP_LOW-farge som rgb ved t=0 (nedre ende av rampen)", () => {
    // #dfeef0 → r=223, g=238, b=240
    expect(lerpColor(RAMP_LOW, RAMP_HIGH, 0)).toBe("rgb(223,238,240)")
  })

  it("returnerer RAMP_HIGH-farge som rgb ved t=1 (øvre ende av rampen)", () => {
    // #b4623f → r=180, g=98, b=63
    expect(lerpColor(RAMP_LOW, RAMP_HIGH, 1)).toBe("rgb(180,98,63)")
  })
})

// METRICS.fmt er de eneste konsumentene av toFixed()/replace()-mønsteret som gir
// norsk desimalkomma. Disse er rene funksjoner uten DOM-avhengighet.
describe("METRICS.fmt", () => {
  it("yield.fmt bruker komma som desimalskilletegn og %-suffiks", () => {
    expect(METRICS.yield.fmt(5.0)).toBe("5,00 %")
    // toFixed(2) runder halvt opp
    expect(METRICS.yield.fmt(6.789)).toBe("6,79 %")
  })

  it("ledighet.fmt viser én desimal med komma", () => {
    expect(METRICS.ledighet.fmt(3.1)).toBe("3,1 %")
  })

  it("leie.fmt avrunder og bruker no-NO-tusenskilletegn (NBSP) med kr-suffiks", () => {
    // toLocaleString("no-NO") gir U+00A0 som tusenskilletegn — regresjon her
    // betyr typisk at Node mangler full ICU-data i miljøet.
    expect(METRICS.leie.fmt(2500)).toBe("2\u00a0500 kr")
    expect(METRICS.leie.fmt(1800.7)).toBe("1\u00a0801 kr")
  })
})

// formatRange — kanttilfelle: minKrM2 = 0 skal ikke gi tusenskilletegn-feil
// eller produsere noe annet enn "0–X kr/m²".
describe("formatRange — kanttilfelle: minKrM2 = 0", () => {
  it("håndterer null-nedre grense uten tusenskilletegn-artefakter", () => {
    const result = formatRange({ minKrM2: 0, maxKrM2: 500 })
    // Null og 500 trenger ikke tusenskilletegn — resultatet er deterministisk
    expect(result).toBe("0–500 kr/m²")
  })
})

// publishedZones — kanttilfelle: alle soner er utkast (segments: null)
// Gaten skal gi tom FeatureCollection, ikke feil.
describe("publishedZones — kanttilfelle: alle soner er utkast", () => {
  it("returnerer tom FeatureCollection når alle features har segments: null", () => {
    const allDraft: CityZoneSet = {
      cityId: "test",
      center: [68, 14],
      zoom: 13,
      minZoneZoom: 11,
      asOf: "Q4 2025",
      disclaimer: "",
      zones: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              id: "a",
              name: "A",
              segments: null,
              reviewedBy: null,
              reviewedAt: null,
              sourceNote: "utkast",
            },
            geometry: { type: "Polygon", coordinates: [[]] },
          },
        ],
      },
    }
    const result = publishedZones(allDraft)
    expect(result.features).toHaveLength(0)
    expect(result.type).toBe("FeatureCollection")
  })
})
