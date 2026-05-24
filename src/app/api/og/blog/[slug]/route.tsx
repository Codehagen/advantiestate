import { ImageResponse } from "next/og"
import { EditorialCard } from "@/components/og/EditorialCard"
import { BLOG_CATEGORIES } from "@/lib/blog/content"
import { calculateReadingTime } from "@/lib/blog/utils"
import { getBlogPost } from "@/lib/content"
import { loadOgFonts } from "@/lib/og/fonts"

export const runtime = "nodejs"

const SIZE = { width: 1200, height: 630 }

// Mirrors AUTHOR_META in src/app/(blog)/blog/(post)/[slug]/page.tsx — kept
// colocated so the OG handler doesn't reach into a page module. Adding a new
// blog author means updating both places.
const AUTHOR_META: Record<
  string,
  { name: string; role: string; avatar: string }
> = {
  codehagen: {
    name: "Christer Hagen",
    role: "Partner · Advanti Estate",
    avatar:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/addc4b60-4c8f-47d7-10ab-6f9048432500/public",
  },
  vsoraas: {
    name: "Vegard Søraas",
    role: "Partner · Advanti Estate",
    avatar:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/76037f97-384f-4681-176e-5b8a0ba71300/public",
  },
}

const MONTHS_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAI",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OKT",
  "NOV",
  "DES",
]

function editorialDate(date: string) {
  const d = new Date(`${date}T00:00:00`)
  const day = String(d.getDate()).padStart(2, "0")
  return `${day}. ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

// Per D3: strip any `//italic//` markers from the title so the OG card
// renders straight Newsreader regular. Page <h1> is a separate concern.
function stripItalicMarkers(title: string) {
  return title.replace(/\/\//g, "")
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const post = getBlogPost(slug)
    const fonts = (await loadOgFonts()).map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style,
    }))

    // Fall back to the brand card if the slug doesn't resolve. notFound() at
    // the page level usually catches this first, but a social crawler can hit
    // the OG handler directly — better to return a valid 1200×630 than a 500.
    if (!post) {
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
    }

    const category = post.categories
      .map((c) => BLOG_CATEGORIES.find((bc) => bc.slug === c))
      .find((c) => c !== undefined)

    const authorMeta = AUTHOR_META[post.author]
    const readingTime = post.mdx ? calculateReadingTime(post.mdx) : 5

    return new ImageResponse(
      (
        <EditorialCard
          mode="article"
          category={category?.title ?? "Artikkel"}
          title={stripItalicMarkers(post.title)}
          date={editorialDate(post.publishedAt)}
          readtime={`${readingTime} min lesing`}
          authorName={authorMeta?.name ?? post.author}
          authorRole={authorMeta?.role ?? "Advanti Estate"}
          authorAvatar={authorMeta?.avatar ?? null}
        />
      ),
      { ...SIZE, fonts },
    )
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown"
    console.error(`Failed to generate blog OG image: ${msg}`)
    return new Response(`Failed to generate OG image: ${msg}`, { status: 500 })
  }
}
