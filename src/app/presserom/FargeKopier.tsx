"use client"

import { useRef, useState } from "react"

const FARGER = [
  { hex: "#2C2825", navn: "Warm Grey", rgb: "RGB 44 40 37", bruk: "Mørke flater, hovedtekst", lysCopy: false },
  { hex: "#F3F1EF", navn: "Warm White", rgb: "RGB 243 241 239", bruk: "Bakgrunn, lys logo", lysCopy: true },
  { hex: "#CBEEF2", navn: "Light Blue", rgb: "RGB 203 238 242", bruk: "Signaturaksent — punktumet", lysCopy: true },
  { hex: "#D7D0C8", navn: "Warm Grey 75", rgb: "RGB 215 208 200", bruk: "Hairlines, «ESTATE» på mørkt", lysCopy: true },
]

/**
 * Merkefarger med klikk-for-kopier + toast — fra Claude Design-handoffen
 * (advanti/presserom.html, seksjon «03 — Farger»).
 */
export function FargeKopier() {
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function kopier(hex: string) {
    let melding = hex
    try {
      await navigator.clipboard.writeText(hex)
      melding = `${hex} kopiert`
    } catch {
      // clipboard avslått — vis HEX-koden i toasten så den kan skrives av
    }
    setToast(melding)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 1600)
  }

  return (
    <>
      <div className="pk-colors">
        {FARGER.map((f) => (
          <div key={f.hex} className="pk-chip">
            <button
              type="button"
              className="sw"
              style={{ background: f.hex }}
              onClick={() => kopier(f.hex)}
              aria-label={`Kopier fargekoden ${f.hex} (${f.navn})`}
            >
              <span
                className="copy"
                style={{
                  color: f.lysCopy ? "var(--warm-grey-85)" : "rgba(255,255,255,.75)",
                }}
              >
                Klikk for å kopiere
              </span>
            </button>
            <div className="nm">{f.navn}</div>
            <div className="hx">
              {f.hex} · {f.rgb}
            </div>
            <div className="use">{f.bruk}</div>
          </div>
        ))}
      </div>
      <div className={`pk-toast${toast ? " show" : ""}`} role="status">
        {toast ?? "Kopiert til utklippstavlen"}
      </div>
    </>
  )
}
