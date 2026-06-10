import { ImageResponse } from "next/og"
import { EditorialCard } from "@/components/og/EditorialCard"
import { BLOG_CATEGORIES } from "@/lib/blog/content"
import { calculateReadingTime } from "@/lib/blog/utils"
import { getBlogPost } from "@/lib/content"
import { loadOgFonts } from "@/lib/og/fonts"
import { AUTHORS } from "@/lib/authors"

export const runtime = "nodejs"

const SIZE = { width: 1200, height: 630 }

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

    const authorMeta = AUTHORS[post.author]
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
          authorAvatar={authorMeta?.image ?? null}
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
