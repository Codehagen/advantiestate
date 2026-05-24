import { ImageResponse } from "next/og"
import { EditorialCard } from "@/components/og/EditorialCard"
import { loadOgFonts } from "@/lib/og/fonts"

export const runtime = "nodejs"

const SIZE = { width: 1200, height: 630 }

export async function GET() {
  try {
    const fonts = (await loadOgFonts()).map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style,
    }))
    return new ImageResponse(
      (
        <EditorialCard
          mode="brand"
          title="Næringseiendom i Nord-Norge."
          tagline="Verdivurdering, transaksjoner, utleie og markedsanalyse — basert på data og dyp lokal kunnskap."
          metaLeft="advanti.no — Bodø · Alta"
          metaRight="advanti.no"
        />
      ),
      { ...SIZE, fonts },
    )
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown"
    console.error(`Failed to generate brand OG image: ${msg}`)
    return new Response(`Failed to generate OG image: ${msg}`, { status: 500 })
  }
}
