import { describe, it, expect } from "vitest"
import { navItems, navGroups, footerColumns } from "@/lib/navigation"
import type { NavEntry } from "@/lib/navigation"

// ── navItems() ───────────────────────────────────────────────────────────────

describe("navItems()", () => {
  it("returns only entries with inNav:true and parent:null", () => {
    const items = navItems()
    for (const item of items) {
      expect(item.inNav).toBe(true)
      expect(item.parent).toBeNull()
    }
  })

  it("includes the expected top-level nav entries", () => {
    const paths = navItems().map((e) => e.path)
    // Top-level labels visible in the desktop nav bar
    expect(paths).toContain("/eiendommer")
    expect(paths).toContain("/kontakt")
    // Group triggers (Tjenester, Innsikt, Om oss) are also inNav:true + parent:null
    expect(paths).toContain("/tjenester")
    expect(paths).toContain("/markedsinnsikt")
    expect(paths).toContain("/om-oss")
  })

  it("does not include inNav:false portal entries", () => {
    const paths = navItems().map((e) => e.path)
    expect(paths).not.toContain("/analyseportal")
    expect(paths).not.toContain("/investorportal")
    expect(paths).not.toContain("/privacy")
    expect(paths).not.toContain("/terms")
  })

  it("does not include child entries (parent !== null)", () => {
    const items = navItems()
    for (const item of items) {
      // Defensive: no child entry should slip through
      expect(item.parent).toBeNull()
    }
  })
})

// ── footerColumns.tjenester ──────────────────────────────────────────────────

describe("footerColumns.tjenester", () => {
  it("excludes the /tjenester parent row (shown as heading, not a link)", () => {
    const paths = footerColumns.tjenester.map((e: NavEntry) => e.path)
    expect(paths).not.toContain("/tjenester")
  })

  it("includes /naringsmegler (the city-broker entry lives in the tjenester column)", () => {
    const paths = footerColumns.tjenester.map((e: NavEntry) => e.path)
    expect(paths).toContain("/naringsmegler")
  })

  it("includes all core service pages", () => {
    const paths = footerColumns.tjenester.map((e: NavEntry) => e.path)
    expect(paths).toContain("/tjenester/verdivurdering")
    expect(paths).toContain("/tjenester/salg")
    expect(paths).toContain("/tjenester/transaksjoner")
    expect(paths).toContain("/tjenester/utleie")
  })

  it("contains only entries that are inFooter:true", () => {
    for (const entry of footerColumns.tjenester) {
      expect(entry.inFooter).toBe(true)
    }
  })
})

// ── footerColumns.advanti ────────────────────────────────────────────────────

describe("footerColumns.advanti", () => {
  it("includes the gated portal entries that are footer-only links", () => {
    const paths = footerColumns.advanti.map((e: NavEntry) => e.path)
    expect(paths).toContain("/analyseportal")
    expect(paths).toContain("/investorportal")
  })

  it("includes key brand / about entries", () => {
    const paths = footerColumns.advanti.map((e: NavEntry) => e.path)
    expect(paths).toContain("/om-oss")
    expect(paths).toContain("/kunder")
    expect(paths).toContain("/karriere")
    expect(paths).toContain("/kontakt")
    expect(paths).toContain("/blog")
    expect(paths).toContain("/presserom")
  })

  it("resolves to real NavEntry objects (not undefined from .find())", () => {
    for (const entry of footerColumns.advanti) {
      expect(entry).toBeDefined()
      expect(typeof entry.label).toBe("string")
      expect(entry.label.length).toBeGreaterThan(0)
    }
  })

  it("no advanti paths were silently dropped — all hardcoded paths resolve to registry entries", () => {
    // The footerColumns.advanti list is built from 9 hardcoded paths via .find()
    // + .filter(). If any path is missing from REGISTRY it is silently dropped.
    // This assertion catches dangling paths before they reach production.
    const EXPECTED_ADVANTI_PATHS = [
      "/om-oss",
      "/kunder",
      "/markedsinnsikt",
      "/karriere",
      "/kontakt",
      "/presserom",
      "/analyseportal",
      "/investorportal",
      "/blog",
    ]
    expect(footerColumns.advanti.length).toBe(EXPECTED_ADVANTI_PATHS.length)
  })
})

// ── navGroups ────────────────────────────────────────────────────────────────

describe("navGroups.innsikt", () => {
  it("includes /markedsinnsikt/kart (new entry added in nav/IA redesign)", () => {
    const paths = navGroups.innsikt.map((e) => e.path)
    expect(paths).toContain("/markedsinnsikt/kart")
  })

  it("includes /markedsrapport (promoted to innsikt panel in redesign)", () => {
    const paths = navGroups.innsikt.map((e) => e.path)
    expect(paths).toContain("/markedsrapport")
  })

  it("includes /verktoy and /help (cross-links to tools and knowledge centre)", () => {
    const paths = navGroups.innsikt.map((e) => e.path)
    expect(paths).toContain("/verktoy")
    expect(paths).toContain("/help")
  })

  it("every entry has inNav:true and navGroup === 'innsikt'", () => {
    for (const entry of navGroups.innsikt) {
      expect(entry.inNav).toBe(true)
      expect(entry.navGroup).toBe("innsikt")
    }
  })
})

describe("navGroups registry completeness — no dynamic patterns in nav groups", () => {
  it("tjenester group contains no [param] pattern entries (panel renders real links only)", () => {
    for (const entry of navGroups.tjenester) {
      expect(entry.path).not.toMatch(/\[/)
    }
  })

  it("innsikt group contains no [param] pattern entries", () => {
    for (const entry of navGroups.innsikt) {
      expect(entry.path).not.toMatch(/\[/)
    }
  })

  it("om-oss group contains no [param] pattern entries", () => {
    for (const entry of navGroups["om-oss"]) {
      expect(entry.path).not.toMatch(/\[/)
    }
  })
})
