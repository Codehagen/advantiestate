/**
 * Plain, serialisable data for the Kunnskapssenter (knowledge center).
 *
 * IMPORTANT: this module must stay free of `content-collections` and JSX/icon
 * imports so it is safe to import from BOTH server and client components.
 * `src/lib/blog/content.tsx` pulls in content-collections + Remix icons, so it
 * must never be imported into a client component — use this module instead, and
 * pass MDX-derived data in as plain props/arguments.
 */

export type HelpCategorySlug =
  | "overview"
  | "getting-started"
  | "terms"
  | "for-investors"
  | "analysis"
  | "valuation"

/**
 * Canonical category order + labels, mirrored from HELP_CATEGORIES in
 * content.tsx (minus the JSX icons). Drives the library chips, the article
 * category nav, and the deterministic article ordering for prev/next.
 */
export const HELP_CATEGORY_META: { slug: HelpCategorySlug; title: string }[] = [
  { slug: "overview", title: "Om Advanti" },
  { slug: "getting-started", title: "Kom i gang" },
  { slug: "terms", title: "Begreper" },
  { slug: "for-investors", title: "For Investorer" },
  { slug: "analysis", title: "Markedsanalyse" },
  { slug: "valuation", title: "Verdivurdering" },
]

const CATEGORY_INDEX: Record<string, number> = Object.fromEntries(
  HELP_CATEGORY_META.map((c, i) => [c.slug, i]),
)

export function helpCategoryTitle(slug?: string): string {
  return HELP_CATEGORY_META.find((c) => c.slug === slug)?.title ?? "Artikkel"
}

/**
 * Norwegian-aware fold for search matching: lowercases and reduces æ/ø/å (and
 * other diacritics via NFD) to base letters, so a user typing ASCII ("naring",
 * "bodo", "drift") still matches "næring", "Bodø", etc. Used by both the hero
 * search and the library minisøk so their matching behaves identically.
 */
export function foldNo(s: string): string {
  return s
    .toLowerCase()
    .replace(/æ/g, "a")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
}

/** Search-suggestion pills shown under the hero search field. */
export const HELP_SEARCH_SUGGESTIONS = [
  "Yield",
  "Verdivurdering",
  "DCF",
  "Leiekontrakt",
  "WAULT",
  "Bodø",
]

/**
 * "Start her" reading paths. Each step is an existing help-article slug.
 * STOP and report (do not silently substitute) if a slug here no longer
 * exists in src/content/help/.
 */
export const HELP_PATHS: {
  num: string
  title: string
  italic: string
  desc: string
  steps: string[]
}[] = [
  {
    num: "01",
    title: "Du eier",
    italic: "næringseiendom",
    desc: "Forstå hva eiendommen er verdt og hva som driver tallet.",
    steps: [
      "verdivurdering-av-naringseiendom",
      "hva-er-yield",
      "sensitivitetsanalyse",
    ],
  },
  {
    num: "02",
    title: "Du vurderer",
    italic: "å investere",
    desc: "Fra første yield-betraktning til finansiering og analyse.",
    steps: [
      "hva-er-naringseiendom",
      "diskontert-kontantstrom",
      "finansiering-av-naringseiendom",
    ],
  },
  {
    num: "03",
    title: "Du leier ut",
    italic: "eller forvalter",
    desc: "Kontrakter, kostnader og leie som faktisk holder verdi.",
    steps: [
      "leiekontrakter-naringseiendom",
      "kpi-regulering-av-leie",
      "felleskostnader",
    ],
  },
]

/**
 * Hub-level "Hurtigsvar" FAQs. `answer` is plain text and is what the FAQPage
 * JSON-LD emits — it must mirror the visible answer (Google/schema.org policy).
 * `rel` is a separate visible "Les mer" link and may point at any internal
 * route (help article OR e.g. /naringsmegler), so it never breaks JSON-LD.
 */
export const HELP_FAQS: {
  question: string
  answer: string
  rel?: { label: string; href: string }
}[] = [
  {
    question: "Hva koster en verdivurdering hos Advanti?",
    answer:
      "En innledende verdivurdering er gratis og uforpliktende. For en full rapport med dokumentert metode — den banken og kjøper kan lene seg på — avtaler vi pris ut fra eiendommens kompleksitet. De fleste ligger mellom 15 000 og 40 000 kr.",
    rel: {
      label: "Verdivurdering — komplett guide",
      href: "/help/article/verdivurdering-av-naringseiendom",
    },
  },
  {
    question: "Hvor lang tid tar en verdivurdering?",
    answer:
      "Med komplett underlag leverer vi normalt innen 5–10 virkedager. Mangler du dokumentasjon, hjelper vi deg å hente inn det som trengs.",
    rel: {
      label: "Slik fungerer en verdivurdering",
      href: "/help/article/verdivurdering-av-naringseiendom",
    },
  },
  {
    question: "Hva er forskjellen på yield og avkastning?",
    answer:
      "Yield (direkteavkastning) er forholdet mellom netto leieinntekt og eiendomsverdi i ett år. Totalavkastning inkluderer i tillegg verdiendring over tid. Yield er øyeblikksbildet; avkastning er hele reisen.",
    rel: {
      label: "Hva er yield i næringseiendom?",
      href: "/help/article/hva-er-yield",
    },
  },
  {
    question: "Hvilken informasjon trenger dere for å vurdere eiendommen min?",
    answer:
      "Leiekontrakter, oversikt over drifts- og felleskostnader, areal/BTA, og gjerne siste års regnskap. Jo bedre grunnlag, jo mer presist tall — men vi kommer i gang med det du har.",
    rel: {
      label: "Leiekontrakter i næringseiendom",
      href: "/help/article/leiekontrakter-naringseiendom",
    },
  },
  {
    question: "Dekker dere hele Nord-Norge?",
    answer:
      "Ja. Vi har kontor i Bodø og Alta og jobber i hele landsdelen — Tromsø, Mo i Rana, Narvik, Harstad og resten av regionen. Markedsdataene våre er bygget by for by.",
    rel: {
      label: "Næringsmegler i Nord-Norge",
      href: "/naringsmegler",
    },
  },
  {
    question: "Kan jeg bruke kunnskapssenteret uten å være kunde?",
    answer:
      "Absolutt. Alt innholdet her er åpent og gratis. Vi deler metodene vi faktisk bruker — fordi en opplyst eier og investor er en bedre samarbeidspartner.",
  },
]

/**
 * Deterministic flat ordering for prev/next navigation: by category order
 * (HELP_CATEGORY_META), then title (Norwegian collation). Takes the posts as an
 * argument so this module stays free of content-collections.
 */
export function getOrderedHelpPosts<
  T extends { slug?: string; title: string; categories: readonly string[] },
>(posts: readonly T[]): T[] {
  return [...posts].sort((a, b) => {
    const ca = CATEGORY_INDEX[a.categories[0]] ?? 99
    const cb = CATEGORY_INDEX[b.categories[0]] ?? 99
    if (ca !== cb) return ca - cb
    return a.title.localeCompare(b.title, "nb")
  })
}

/** {prev, next} neighbours for a slug within the deterministic ordering. */
export function helpNeighbours<
  T extends { slug?: string; title: string; categories: readonly string[] },
>(posts: readonly T[], slug: string): { prev: T | null; next: T | null } {
  const ordered = getOrderedHelpPosts(posts)
  const i = ordered.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? ordered[i - 1] : null,
    next: i < ordered.length - 1 ? ordered[i + 1] : null,
  }
}
