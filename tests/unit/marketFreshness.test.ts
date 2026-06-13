import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const shellPath = path.resolve(
  __dirname,
  "../../src/components/markedsinnsikt/MarkedsinnsiktShell.tsx",
)

describe("markedsinnsikt freshness copy", () => {
  it("derives visible release dates instead of hardcoding them in the shell", () => {
    const source = readFileSync(shellPath, "utf8")

    expect(source).not.toMatch(/OPPDATERT \d{1,2}\. [A-ZÆØÅ]{3} \d{4}/)
    expect(source).not.toContain('<div className="val">15. juli 2026</div>')
    expect(source).toContain("LATEST_RELEASE_STAMP")
    expect(source).toContain("NEXT_RELEASE_DATE")
  })
})
