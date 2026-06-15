import Link from "next/link"

/**
 * Professional-advice disclaimer rendered at the bottom of tax/legal/finance
 * help articles (opt-in via the `advisory` frontmatter field). Centralised here
 * so the wording and source links live in ONE place rather than being pasted
 * into every article body. Reuses the editorial `.ae-note.is-caution` styling.
 */

type Advisory = "tax" | "legal" | "finance"

/** Authoritative sources cited per advisory type. */
const SOURCES: Record<Advisory, { label: string; href: string }[]> = {
  tax: [
    { label: "Skatteetaten", href: "https://www.skatteetaten.no" },
    { label: "Lovdata", href: "https://lovdata.no" },
  ],
  finance: [
    { label: "Skatteetaten", href: "https://www.skatteetaten.no" },
    { label: "Lovdata", href: "https://lovdata.no" },
  ],
  legal: [
    { label: "Lovdata", href: "https://lovdata.no" },
    { label: "Kartverket", href: "https://www.kartverket.no" },
  ],
}

const ADVICE: Record<Advisory, string> = {
  tax: "skattemessig eller juridisk rådgivning",
  finance: "finansiell, skattemessig eller juridisk rådgivning",
  legal: "juridisk eller skattemessig rådgivning",
}

export function HelpDisclaimer({ advisory }: { advisory: Advisory }) {
  const sources = SOURCES[advisory]
  return (
    <div className="ae-note is-caution" role="note">
      <span className="ae-label">Søk profesjonell rådgivning</span>
      <p>
        Dette er generell informasjon om næringseiendom, ikke individuell{" "}
        {ADVICE[advisory]}, og regelverket kan endres. Ta alltid kontakt med
        advokat og/eller revisor før du tar konkrete beslutninger. Advanti
        samarbeider med advokat og revisor som er spesialister på
        næringseiendom, og vi formidler gjerne kontakt og kommer med
        anbefalinger — <Link href="/kontakt">ta kontakt</Link> så hjelper vi deg
        videre.
      </p>
      <p>
        Kilder:{" "}
        {sources.map((s, i) => (
          <span key={s.href}>
            {i > 0 && " og "}
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </span>
        ))}
        .
      </p>
    </div>
  )
}
