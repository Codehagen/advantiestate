import { describe, it, expect } from "vitest"

import {
  foldNo,
  getOrderedHelpPosts,
  helpNeighbours,
  helpCategoryTitle,
  HELP_CATEGORY_META,
} from "@/lib/blog/help-data"

type Post = { slug: string; title: string; categories: string[] }

// Deliberately unsorted: category order is overview → getting-started → terms →
// for-investors → analysis → valuation (HELP_CATEGORY_META), then title (nb).
const POSTS: Post[] = [
  { slug: "zeta", title: "Zeta", categories: ["valuation"] },
  { slug: "yield", title: "Yield", categories: ["terms"] },
  { slug: "aksje", title: "Åpning", categories: ["terms"] },
  { slug: "advanti", title: "Advanti", categories: ["overview"] },
  { slug: "alfa", title: "Alfa", categories: ["terms"] },
  { slug: "invest", title: "Invest", categories: ["for-investors"] },
]

describe("foldNo()", () => {
  it("lets ASCII input match Norwegian special characters", () => {
    // The whole point: a user typing without æ/ø/å still matches.
    expect(foldNo("Hva er næringseiendom").includes(foldNo("naring"))).toBe(true)
    expect(foldNo("Næringsmarkedet i Bodø").includes(foldNo("bodo"))).toBe(true)
    expect(foldNo("Driftsøkonomi").includes(foldNo("drifts"))).toBe(true)
  })

  it("is case-insensitive and idempotent on plain ASCII", () => {
    expect(foldNo("YIELD")).toBe("yield")
    expect(foldNo(foldNo("Felleskostnader"))).toBe("felleskostnader")
  })

  it("folds æ→a, ø→o, å→a", () => {
    expect(foldNo("æøå")).toBe("aoa")
  })
})

describe("getOrderedHelpPosts()", () => {
  it("orders by category index then title (nb collation, deterministic)", () => {
    const ordered = getOrderedHelpPosts(POSTS).map((p) => p.slug)
    // overview, then terms (Alfa < Yield < Åpning in nb), then for-investors, then valuation
    expect(ordered).toEqual([
      "advanti",
      "alfa",
      "yield",
      "aksje",
      "invest",
      "zeta",
    ])
  })

  it("is a pure sort — does not mutate the input array", () => {
    const input = [...POSTS]
    getOrderedHelpPosts(input)
    expect(input.map((p) => p.slug)).toEqual(POSTS.map((p) => p.slug))
  })

  it("puts unknown categories last without throwing", () => {
    const withUnknown = [
      { slug: "weird", title: "Weird", categories: ["nope"] },
      ...POSTS,
    ]
    const ordered = getOrderedHelpPosts(withUnknown).map((p) => p.slug)
    expect(ordered[ordered.length - 1]).toBe("weird")
  })
})

describe("helpNeighbours()", () => {
  it("returns the adjacent posts in the deterministic order", () => {
    const { prev, next } = helpNeighbours(POSTS, "yield")
    expect(prev?.slug).toBe("alfa")
    expect(next?.slug).toBe("aksje")
  })

  it("first post has no prev, last has no next", () => {
    expect(helpNeighbours(POSTS, "advanti").prev).toBeNull()
    expect(helpNeighbours(POSTS, "zeta").next).toBeNull()
  })

  it("returns nulls for an unknown slug", () => {
    expect(helpNeighbours(POSTS, "missing")).toEqual({ prev: null, next: null })
  })
})

describe("helpCategoryTitle()", () => {
  it("maps known slugs to their labels", () => {
    expect(helpCategoryTitle("terms")).toBe("Begreper")
    expect(helpCategoryTitle("valuation")).toBe("Verdivurdering")
  })

  it("falls back to a neutral label for unknown/undefined", () => {
    expect(helpCategoryTitle("nope")).toBe("Artikkel")
    expect(helpCategoryTitle(undefined)).toBe("Artikkel")
  })

  it("HELP_CATEGORY_META covers all six help categories", () => {
    expect(HELP_CATEGORY_META).toHaveLength(6)
  })
})
