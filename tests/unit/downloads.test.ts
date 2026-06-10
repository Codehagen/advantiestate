import { describe, it, expect } from "vitest"
import { mapDownloads } from "@/lib/listing/downloads"

describe("mapDownloads", () => {
  it("maps a plain PDF row with null description and href", () => {
    const result = mapDownloads([
      { label: "Prospekt", description: null, href: null, requires_nda: false },
    ])
    expect(result).toEqual([
      { label: "Prospekt", sub: "", href: "#", kind: "pdf" },
    ])
  })

  it("sets kind to 'nda' when requires_nda is true", () => {
    const result = mapDownloads([
      { label: "NDA", description: null, href: null, requires_nda: true },
    ])
    expect(result[0].kind).toBe("nda")
  })

  it("uses provided description and href", () => {
    const result = mapDownloads([
      {
        label: "Salgsoppgave",
        description: "Full salgsoppgave",
        href: "/files/salgsoppgave.pdf",
        requires_nda: false,
      },
    ])
    expect(result[0].sub).toBe("Full salgsoppgave")
    expect(result[0].href).toBe("/files/salgsoppgave.pdf")
  })
})
