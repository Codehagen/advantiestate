import { describe, it, expect } from "vitest"
import path from "node:path"
import { readdirSync, statSync } from "node:fs"
import {
  REGISTRY,
  parentChain,
  stripHash,
  navGroups,
} from "@/lib/navigation"
import type { NavEntry } from "@/lib/navigation"

const APP_ROOT = path.resolve(__dirname, "../../src/app")

// ── filesystem helpers ──────────────────────────────────────────────────────

/** Recursively collect all page.tsx file paths under a directory. */
function findPages(dir: string): string[] {
  const result: string[] = []
  for (const item of readdirSync(dir)) {
    const full = path.join(dir, item)
    if (statSync(full).isDirectory()) {
      result.push(...findPages(full))
    } else if (item === "page.tsx") {
      result.push(full)
    }
  }
  return result
}

/**
 * Convert an absolute page.tsx file path to its URL route.
 * Strips the src/app prefix, removes route-group segments like (blog),
 * and removes the trailing /page.tsx.
 */
function fileToRoute(filePath: string): string {
  // Normaliser til POSIX-separatorer så testen også er korrekt på Windows.
  const posix = filePath.split(path.sep).join("/")
  const rel = posix.replace(APP_ROOT.split(path.sep).join("/"), "").replace(/\/page\.tsx$/, "")
  const clean = rel.replace(/\/\([^)]+\)/g, "")
  return clean || "/"
}

/** True if a URL route matches a registry pattern (handles [param] segments). */
function routeMatchesEntry(route: string, entryPath: string): boolean {
  if (route === entryPath) return true
  const rp = route.split("/")
  const ep = entryPath.split("/")
  if (rp.length !== ep.length) return false
  return ep.every((part, i) => part.startsWith("[") || part === rp[i])
}

// ── bidirectional coverage tests ────────────────────────────────────────────

describe("Navigation registry — bidirectional page coverage", () => {
  const allPages = findPages(APP_ROOT)
  const allRoutes = allPages.map(fileToRoute)

  it("every non-pattern registry entry resolves to an existing page.tsx", () => {
    const staticEntries = REGISTRY.filter((e) => !e.path.includes("["))
    const missing: string[] = []
    for (const entry of staticEntries) {
      const matched = allRoutes.some((r) => r === entry.path)
      if (!matched) missing.push(entry.path)
    }
    if (missing.length > 0) {
      throw new Error(
        `Registry entries with no matching page.tsx:\n${missing.map((p) => `  ${p}`).join("\n")}`,
      )
    }
  })

  it("every page.tsx resolves to a registry entry (static or pattern match)", () => {
    const unregistered: string[] = []
    for (const route of allRoutes) {
      const matched = REGISTRY.some((e) => routeMatchesEntry(route, e.path))
      if (!matched) unregistered.push(route)
    }
    if (unregistered.length > 0) {
      throw new Error(
        `Pages with no registry entry:\n${unregistered.map((r) => `  ${r}`).join("\n")}`,
      )
    }
  })
})

// ── parentChain tests ───────────────────────────────────────────────────────

describe("parentChain", () => {
  it("returns null for an unregistered path", () => {
    expect(parentChain("/this-route-does-not-exist")).toBeNull()
    expect(parentChain("/tjenester/finnes-ikke")).toBeNull()
  })

  it("returns the full ancestor chain for a static path", () => {
    const chain = parentChain("/tjenester/verdivurdering")
    expect(chain).not.toBeNull()
    const paths = chain!.map((e) => e.path)
    expect(paths).toContain("/tjenester/verdivurdering")
    expect(paths).toContain("/tjenester")
    // /tjenester is first (root ancestor), /tjenester/verdivurdering is last
    expect(paths[paths.length - 1]).toBe("/tjenester/verdivurdering")
    expect(paths[0]).toBe("/tjenester")
  })

  it("resolves dynamic pattern entries", () => {
    const chain = parentChain("/naringsmegler/bodo")
    expect(chain).not.toBeNull()
    const paths = chain!.map((e) => e.path)
    expect(paths).toContain("/naringsmegler/[slug]")
    expect(paths).toContain("/naringsmegler")
  })

  it("survives a circular registry fixture — depth cap + visited-set guard", () => {
    const circular: NavEntry[] = [
      { path: "/x", label: "X", parent: "/y" },
      { path: "/y", label: "Y", parent: "/x" },
    ]
    // Must not throw or hang; returns a partial chain after hitting the guard.
    expect(() => parentChain("/x", circular)).not.toThrow()
    const result = parentChain("/x", circular)
    expect(result).not.toBeNull()
    expect(result!.length).toBeGreaterThan(0)
    expect(result!.length).toBeLessThanOrEqual(20) // depth cap
  })

  it("does not throw for unregistered path in a circular fixture", () => {
    const circular: NavEntry[] = [
      { path: "/a", label: "A", parent: "/b" },
      { path: "/b", label: "B", parent: "/a" },
    ]
    expect(parentChain("/unknown", circular)).toBeNull()
  })

  it("dangling parent — returns partial chain containing the entry, not null", () => {
    // Entry whose parent path does not exist in the registry.
    // parentChain should return a chain with the entry itself rather than null,
    // because the entry IS registered — the parent is simply unresolvable.
    const registry: NavEntry[] = [
      { path: "/child", label: "Child", parent: "/nonexistent" },
    ]
    const result = parentChain("/child", registry)
    expect(result).not.toBeNull()
    expect(result!.some((e) => e.path === "/child")).toBe(true)
    // Should not contain a fabricated entry for the missing parent.
    expect(result!.some((e) => e.path === "/nonexistent")).toBe(false)
  })
})

// ── stripHash tests ─────────────────────────────────────────────────────────

describe("stripHash", () => {
  it("removes the hash fragment from a path", () => {
    expect(stripHash("/markedsinnsikt#yield")).toBe("/markedsinnsikt")
    expect(stripHash("/analyseportal#sector=leie")).toBe("/analyseportal")
  })

  it("leaves paths without a hash unchanged", () => {
    expect(stripHash("/markedsinnsikt")).toBe("/markedsinnsikt")
    expect(stripHash("/")).toBe("/")
  })

  it("hash-stripped path matches a registry entry", () => {
    const raw = "/markedsinnsikt#yield"
    const clean = stripHash(raw)
    const entry = REGISTRY.find((e) => e.path === clean)
    expect(entry).toBeDefined()
    expect(entry!.path).toBe("/markedsinnsikt")
    // The same path is the innsikt group parent — active trail logic should
    // light up the Innsikt group button on /markedsinnsikt#yield.
    expect(
      navGroups.innsikt.some((e) => e.path === clean),
    ).toBe(true)
  })
})
