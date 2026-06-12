// Server component — ingen "use client" nødvendig.
// Rendereres null når links-arrayen er tom; skjærer til max 3 lenker.

import Link from "next/link"

interface SeOgsaLink {
  href: string
  label: string
  note?: string
}

interface SeOgsaProps {
  /** Eyebrow-overskrift som sier nøyaktig hva blokken gjør.
   *  Aldri generisk «Relatert innhold». */
  heading?: string
  /** Max 3 lenker — alt over 3 kuttes. */
  links: SeOgsaLink[]
}

/**
 * SeOgsa — redaksjonell kryss­lenkblokk.
 *
 * Regler (fra fase-4-spec):
 *  – Én eksplisitt jobb per blokk, uttrykt i heading
 *  – Max 3 lenker (slice 0..3)
 *  – Null når links er tom
 *  – Redaksjonell stil: hairline-top, eyebrow heading, ingen ikoner,
 *    ingen kort/skygger
 */
export function SeOgsa({ heading, links }: SeOgsaProps) {
  const displayed = links.slice(0, 3)
  if (displayed.length === 0) return null

  return (
    <div className="seogsa">
      {heading && <div className="seogsa-heading">{heading}</div>}
      <ul className="seogsa-list">
        {displayed.map(({ href, label, note }) => (
          <li key={href}>
            <Link href={href} className="seogsa-link">
              {label}
              <span className="seogsa-arrow">→</span>
            </Link>
            {note && <span className="seogsa-note">{note}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
