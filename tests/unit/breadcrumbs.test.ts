import { describe, it, expect } from "vitest"
import { buildCrumbs } from "@/components/site/Breadcrumbs"

describe("buildCrumbs", () => {
  // ── unknown path ────────────────────────────────────────────────────────────

  it("returns null for a path not in the registry", () => {
    expect(buildCrumbs("/this-route-does-not-exist")).toBeNull()
    expect(buildCrumbs("/finnes/ikke")).toBeNull()
  })

  it("returns null for an empty string", () => {
    expect(buildCrumbs("")).toBeNull()
  })

  // ── single-level guard ──────────────────────────────────────────────────────

  it("returns null for the root path '/' (would produce only Hjem)", () => {
    // "/" maps to the root entry; after prepend it's still just ["/"].
    // full.length === 1 → null.
    expect(buildCrumbs("/")).toBeNull()
  })

  // ── static routes ───────────────────────────────────────────────────────────

  it("builds a 3-level chain for /tjenester/salg", () => {
    const crumbs = buildCrumbs("/tjenester/salg")
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(3)
    expect(crumbs![0]).toMatchObject({ label: "Hjem", href: "/" })
    expect(crumbs![1]).toMatchObject({ label: "Tjenester", href: "/tjenester" })
    expect(crumbs![2]).toMatchObject({ label: "Salg", href: "/tjenester/salg" })
  })

  it("always starts with Hjem for top-level routes like /eiendommer", () => {
    const crumbs = buildCrumbs("/eiendommer")
    expect(crumbs).not.toBeNull()
    expect(crumbs![0]).toMatchObject({ label: "Hjem", href: "/" })
    expect(crumbs![1].href).toBe("/eiendommer")
  })

  // ── dynamic routes ──────────────────────────────────────────────────────────

  it("resolves a dynamic route and uses leafLabel for the leaf", () => {
    const crumbs = buildCrumbs("/naringsmegler/bodo", "Bodø")
    expect(crumbs).not.toBeNull()
    // [Hjem, Næringsmegler i din by, Bodø]
    expect(crumbs).toHaveLength(3)
    expect(crumbs![0]).toMatchObject({ label: "Hjem", href: "/" })
    // Middle entry: registry label for /naringsmegler
    expect(crumbs![1].href).toBe("/naringsmegler")
    // Leaf: real path, custom label
    expect(crumbs![2]).toMatchObject({
      label: "Bodø",
      href: "/naringsmegler/bodo",
    })
  })

  it("uses the registry label for the leaf when no leafLabel is provided", () => {
    const crumbs = buildCrumbs("/naringsmegler/tromso")
    expect(crumbs).not.toBeNull()
    // Leaf label falls back to registry pattern label
    expect(crumbs!.at(-1)!.label).toBeTruthy()
    expect(crumbs!.at(-1)!.href).toBe("/naringsmegler/tromso")
  })

  it("resolves nested dynamic route /tjenester/verdivurdering/bodo with leafLabel", () => {
    const crumbs = buildCrumbs("/tjenester/verdivurdering/bodo", "Bodø")
    expect(crumbs).not.toBeNull()
    // [Hjem, Tjenester, Verdivurdering, Bodø]
    expect(crumbs).toHaveLength(4)
    expect(crumbs![0].href).toBe("/")
    expect(crumbs![1].href).toBe("/tjenester")
    expect(crumbs![2].href).toBe("/tjenester/verdivurdering")
    expect(crumbs![3]).toMatchObject({
      label: "Bodø",
      href: "/tjenester/verdivurdering/bodo",
    })
  })

  it("strips hash fragments from the path", () => {
    const crumbs = buildCrumbs("/tjenester/salg#anchor")
    expect(crumbs).not.toBeNull()
    // Leaf href must not include the hash
    expect(crumbs!.at(-1)!.href).toBe("/tjenester/salg")
  })

  // ── help / deep chains ──────────────────────────────────────────────────────

  it("resolves /help/article/[slug] through the full parent chain", () => {
    const crumbs = buildCrumbs("/help/article/some-article", "Hva er næringseiendom?")
    expect(crumbs).not.toBeNull()
    // Hjem → Markedsinnsikt → Kunnskapssenter → [article title]
    expect(crumbs![0].href).toBe("/")
    const hrefs = crumbs!.map((c) => c.href)
    expect(hrefs).toContain("/markedsinnsikt")
    expect(hrefs).toContain("/help")
    // Leaf
    expect(crumbs!.at(-1)).toMatchObject({
      label: "Hva er næringseiendom?",
      href: "/help/article/some-article",
    })
  })
})
