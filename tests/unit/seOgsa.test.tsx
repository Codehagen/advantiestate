// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"

import { SeOgsa } from "@/components/site/SeOgsa"

// SeOgsa-kontrakten (fase-4-spec + design-review):
//   – tom links-array → null (aldri tomt skall mellom PR 3 og PR 4)
//   – maks 3 lenker uansett input (redaksjonell regel)
//   – heading er valgfri; note rendres når satt
describe("SeOgsa", () => {
  const link = (n: number) => ({ href: `/lenke-${n}`, label: `Lenke ${n}` })

  it("rendrer null når links er tom", () => {
    const { container } = render(<SeOgsa links={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it("kutter til maks 3 lenker når 4 sendes inn", () => {
    const { getAllByRole } = render(
      <SeOgsa links={[link(1), link(2), link(3), link(4)]} />,
    )
    expect(getAllByRole("link")).toHaveLength(3)
  })

  it("utelater heading-elementet når heading ikke er satt", () => {
    const { container } = render(<SeOgsa links={[link(1)]} />)
    expect(container.querySelector(".seogsa-heading")).toBeNull()
  })

  it("rendrer heading og note når de er satt", () => {
    const { container, getByText } = render(
      <SeOgsa
        heading="Forstå markedet"
        links={[{ href: "/a", label: "A", note: "kvartalsvis" }]}
      />,
    )
    expect(getByText("Forstå markedet")).toBeTruthy()
    expect(container.querySelector(".seogsa-note")?.textContent).toBe(
      "kvartalsvis",
    )
  })
})
