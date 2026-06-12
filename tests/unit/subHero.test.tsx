// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"

import { SubHero } from "@/components/site/SubHero"

// Begge crumb-propene er valgfrie etter breadcrumb-konsolideringen — en side
// som dropper begge skal rendre uten sti og uten å kaste (testing-funn,
// pre-landing review 2026-06-12).
describe("SubHero uten breadcrumbs", () => {
  it("rendrer uten crumb-nav når verken crumb eller breadcrumbs er satt", () => {
    const { container } = render(<SubHero title="Testside" />)
    expect(container.querySelector(".crumb")).toBeNull()
    expect(container.textContent).toContain("Testside")
  })

  it("rendrer breadcrumbs-noden når den sendes inn", () => {
    const { getByText } = render(
      <SubHero title="Testside" breadcrumbs={<nav className="crumb">Hjem</nav>} />,
    )
    expect(getByText("Hjem")).toBeTruthy()
  })
})
