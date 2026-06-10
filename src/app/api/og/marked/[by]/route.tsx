// OG tallkort per by — GET /api/og/marked/[by]
//
// Review-vedtak 2A: by-param whitelistes mot LATEST_RELEASE.cities[].id.
// Ukjent by → 404. Uvalidert param-tekst rendres ALDRI inn i bildet.
//
// Review-vedtak D6.3: LATEST_RELEASE.quarter bakes inn i bildet slik at
// delte kort ikke blir stille utdaterte ved kvartalsskifte.
//
// Cache: public, max-age 24h / s-maxage 24h / swr 7d — kortene endres
// kun per kvartal.

import { ImageResponse } from "next/og"
import { loadOgFonts } from "@/lib/og/fonts"
import { LATEST_RELEASE } from "@/components/markedsinnsikt/marketReleases"
import {
  fmtYieldPct,
  fmtLeieKrM2,
  fmtPct1,
} from "@/components/markedsinnsikt/marketData"

export const runtime = "nodejs"

const SIZE = { width: 1200, height: 630 }

// Design-token mirror — kept colocated so this file is self-contained.
const WARM_GREY = "#2c2825"
const WARM_WHITE = "#f3f1ef"
const LIGHT_BLUE = "#cbeef2"
const HAIRLINE = "rgba(243, 241, 239, 0.18)"
const FADE_55 = "rgba(243, 241, 239, 0.55)"
const FADE_60 = "rgba(243, 241, 239, 0.60)"

const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ by: string }> },
) {
  const { by } = await params

  // --- 2A: Whitelist validation ------------------------------------------------
  // Only proceed when `by` matches a known city id. This ensures no unvalidated
  // user-controlled text is ever rendered into the credited graphic.
  const city = LATEST_RELEASE.cities.find((c) => c.id === by)
  if (!city) {
    return new Response("Not found", { status: 404 })
  }

  // All display strings derived from validated numeric city data (never raw param).
  const yieldStr = fmtYieldPct(city.yieldPct) // e.g. "6,35 %"
  const leieStr = fmtLeieKrM2(city.leieKrM2) // e.g. "2 400 kr/m²"
  const vacStr = fmtPct1(city.vacPct) // e.g. "4,6 %"
  // D6.3: quarter baked in — "Q4 2025" — so shared/cached cards stay accurate
  const quarter = LATEST_RELEASE.quarter

  try {
    const fonts = (await loadOgFonts()).map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style,
    }))

    const response = new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: WARM_GREY,
            color: WARM_WHITE,
            padding: "64px 72px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "Inter",
          }}
        >
          {/* ── TOP: logo + category eyebrow ─────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Logo — mirrors EditorialCard Logo() */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                color: WARM_WHITE,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 12,
                  height: 12,
                  backgroundColor: LIGHT_BLUE,
                  borderRadius: 9999,
                  marginRight: 10,
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontFamily: "Newsreader",
                  fontWeight: 600,
                  fontSize: 28,
                  letterSpacing: "-0.01em",
                }}
              >
                Advanti.
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  color: FADE_55,
                  textTransform: "uppercase",
                  marginLeft: 10,
                }}
              >
                Estate
              </div>
            </div>

            {/* Eyebrow — mirrors EditorialCard CategoryEyebrow() */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: LIGHT_BLUE,
                fontFamily: "Inter",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 28,
                  height: 1,
                  backgroundColor: LIGHT_BLUE,
                  marginRight: 14,
                }}
              />
              {`MARKEDSDATA · ${quarter}`}
            </div>
          </div>

          {/* ── MIDDLE: city name + three key metrics ────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* City name — validated; never raw param */}
            <div
              style={{
                display: "flex",
                fontFamily: "Newsreader",
                fontWeight: 400,
                fontSize: 80,
                lineHeight: 1.0,
                letterSpacing: "-0.024em",
                color: WARM_WHITE,
                marginBottom: 36,
              }}
            >
              {city.name}
            </div>

            {/* Metrics row */}
            <div style={{ display: "flex", flexDirection: "row" }}>
              {/* Metric 1: Prime yield */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis: 0,
                  paddingRight: 40,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: FADE_55,
                    marginBottom: 10,
                  }}
                >
                  Prime yield kontor
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Newsreader",
                    fontWeight: 400,
                    fontSize: 56,
                    lineHeight: 1.0,
                    letterSpacing: "-0.02em",
                    color: LIGHT_BLUE,
                  }}
                >
                  {yieldStr}
                </div>
              </div>

              {/* Metric 2: Market rent */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis: 0,
                  paddingLeft: 40,
                  paddingRight: 40,
                  borderLeftWidth: 1,
                  borderLeftStyle: "solid",
                  borderLeftColor: HAIRLINE,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: FADE_55,
                    marginBottom: 10,
                  }}
                >
                  Markedsleie kontor
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Newsreader",
                    fontWeight: 400,
                    fontSize: 56,
                    lineHeight: 1.0,
                    letterSpacing: "-0.02em",
                    color: WARM_WHITE,
                  }}
                >
                  {leieStr}
                </div>
              </div>

              {/* Metric 3: Office vacancy */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis: 0,
                  paddingLeft: 40,
                  borderLeftWidth: 1,
                  borderLeftStyle: "solid",
                  borderLeftColor: HAIRLINE,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: FADE_55,
                    marginBottom: 10,
                  }}
                >
                  Kontorledighet
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Newsreader",
                    fontWeight: 400,
                    fontSize: 56,
                    lineHeight: 1.0,
                    letterSpacing: "-0.02em",
                    color: WARM_WHITE,
                  }}
                >
                  {vacStr}
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM: hairline + credit ─────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: `1px solid ${HAIRLINE}`,
              paddingTop: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Left: context label with quarter baked in (D6.3) */}
              <div
                style={{
                  display: "flex",
                  fontFamily: "Newsreader",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: 18,
                  color: FADE_60,
                }}
              >
                {`Nøkkeltall næringseiendom · ${quarter}`}
              </div>

              {/* Right: non-removable credit */}
              <div
                style={{
                  display: "flex",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: 13,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: FADE_55,
                }}
              >
                Kilde: Advanti Estate · advantiestate.no
              </div>
            </div>
          </div>
        </div>
      ),
      { ...SIZE, fonts },
    )

    response.headers.set("Cache-Control", CACHE_CONTROL)
    return response
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown"
    console.error(`Failed to generate market OG image for "${by}": ${msg}`)
    return new Response(`Failed to generate OG image: ${msg}`, { status: 500 })
  }
}
