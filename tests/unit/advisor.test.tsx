// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"

// next/image (via BlurImage) and next/link need framework context that jsdom
// doesn't provide — stub them to plain elements so the test isolates the
// Advisor card's own logic (tel/mailto normalization + the no-contact fallback).
vi.mock("@/lib/blog/blur-image", () => ({
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}))
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

import { Advisor } from "@/components/blog/Advisor"

describe("Advisor contact card", () => {
  it("normalizes tel: (digits only) and lowercases mailto:", () => {
    const { container } = render(
      <Advisor
        name="Christer Hagen"
        role="Partner"
        portrait="https://example.com/x.jpg"
        phone="+47 984 53 571"
        email="Christer@Advantiestate.no"
      />,
    )
    const tel = container.querySelector('a[href^="tel:"]')
    const mail = container.querySelector('a[href^="mailto:"]')
    expect(tel?.getAttribute("href")).toBe("tel:+4798453571")
    expect(mail?.getAttribute("href")).toBe("mailto:christer@advantiestate.no")
    // Display text keeps the human-readable casing/spacing.
    expect(tel?.textContent).toBe("+47 984 53 571")
  })

  it("falls back to a single Kontakt-oss link when phone and email are absent", () => {
    const { container, getByText } = render(
      <Advisor
        name="Vegard Søraas"
        role="Partner"
        portrait="https://example.com/x.jpg"
      />,
    )
    // The silent-failure branch: never an empty tel:/mailto:.
    expect(container.querySelector('a[href^="tel:"]')).toBeNull()
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
    const link = getByText(/Kontakt oss/i).closest("a")
    expect(link?.getAttribute("href")).toBe("/kontakt")
  })
})
