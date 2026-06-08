"use client"

import { useActionState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  subscribeNewsletter,
  type NewsletterFormState,
} from "@/app/actions/newsletter"

const INITIAL: NewsletterFormState = { status: "idle" }

const LINK_STYLE = {
  color: "var(--warm-white)",
  borderBottom: "1px solid",
} as const

/**
 * Email gate for the quarterly markedsrapport. Captures the lead and confirms
 * the report is sent at the next issue — no immediate file download (the report
 * is distributed by email each quarter). The live data summary lives on this
 * page (#sammendrag) and on /markedsinnsikt, so visitors get value immediately
 * while the gated PDF stays an email deliverable.
 */
export function MarkedsrapportGate({ label }: { label: string }) {
  const pathname = usePathname()
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    INITIAL,
  )

  const submitted = state.status === "success"

  return (
    <section className="newsletter">
      <div className="wrap">
        <div className="newsletter-inner">
          {submitted ? (
            <>
              <span className="eyebrow center no-rule">Påmeldt</span>
              <h2>
                Takk — du står <span className="italic">på listen.</span>
              </h2>
              <p>
                {state.alreadySubscribed
                  ? `Du er allerede påmeldt. Du får ${label} i innboksen ved neste utgivelse.`
                  : `Vi har lagt deg til. Du får ${label} i innboksen ved neste utgivelse, sammen med det kvartalsvise markedsbrevet.`}
              </p>
              <p className="newsletter-fineprint">
                Vil du ha tallene nå? Se{" "}
                <Link href="/markedsinnsikt" style={LINK_STYLE}>
                  markedsinnsikt
                </Link>{" "}
                eller{" "}
                <Link href="/kontakt" style={LINK_STYLE}>
                  ta kontakt
                </Link>{" "}
                for en vurdering av din eiendom.
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow center no-rule">Få rapporten på epost</span>
              <h2>
                Få {label.toLowerCase()}{" "}
                <span className="italic">ved neste utgivelse.</span>
              </h2>
              <p>
                Skriv inn e-postadressen din, så sender vi {label} til deg ved
                neste kvartalsvise utgivelse — og melder deg samtidig på
                markedsbrevet. Du kan melde deg av når som helst.
              </p>

              <form className="newsletter-form" action={formAction}>
                <input
                  type="email"
                  name="email"
                  placeholder="din@epost.no"
                  aria-label="E-postadresse"
                  required
                  autoComplete="email"
                />
                <input type="hidden" name="source" value="markedsrapport" />
                <input
                  type="hidden"
                  name="pageUrl"
                  value={pathname ?? "/markedsrapport"}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={pending}
                >
                  {pending ? "Sender …" : "Meld meg på"}
                </button>
              </form>

              {state.status === "error" && (
                <p
                  className="newsletter-fineprint"
                  role="alert"
                  style={{ color: "rgba(243, 241, 239, 0.85)" }}
                >
                  {state.message}
                </p>
              )}

              <p className="newsletter-fineprint">
                Vi sender én utgave per kvartal pluss eventuell hastesak. Ingen
                spam.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
