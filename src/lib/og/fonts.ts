// Loads the TTF binaries used by both opengraph-image.tsx files. Uses
// `readFile(new URL(..., import.meta.url))` so Webpack tracks the asset
// references at build time and bundles the .ttf files alongside the OG
// handler — no runtime path lookup, no outputFileTracingIncludes needed.
// (Node's global `fetch` rejects file:// URLs, so we use fs/promises.)
//
// Five files, ~1.2 MB total. One-time read per cold start, then cached by
// `loadOgFonts()`'s memoised promise so repeated requests don't re-decode.

import "server-only"
import { readFile } from "node:fs/promises"

type OgFont = {
  name: string
  data: Buffer
  weight: 300 | 400 | 500 | 600 | 700
  style: "normal" | "italic"
}

let cached: Promise<OgFont[]> | null = null

export function loadOgFonts(): Promise<OgFont[]> {
  if (cached) return cached
  cached = (async () => {
    const [interReg, interMed, newsReg, newsSemi, newsLightIt] =
      await Promise.all([
        readFile(new URL("./fonts/Inter-Regular.ttf", import.meta.url)),
        readFile(new URL("./fonts/Inter-Medium.ttf", import.meta.url)),
        readFile(new URL("./fonts/Newsreader-Regular.ttf", import.meta.url)),
        readFile(new URL("./fonts/Newsreader-SemiBold.ttf", import.meta.url)),
        readFile(
          new URL("./fonts/Newsreader-LightItalic.ttf", import.meta.url),
        ),
      ])

    return [
      { name: "Inter", data: interReg, weight: 400, style: "normal" },
      { name: "Inter", data: interMed, weight: 500, style: "normal" },
      { name: "Newsreader", data: newsReg, weight: 400, style: "normal" },
      { name: "Newsreader", data: newsSemi, weight: 600, style: "normal" },
      { name: "Newsreader", data: newsLightIt, weight: 300, style: "italic" },
    ]
  })()
  return cached
}
