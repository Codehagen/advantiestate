"use client"

import { useActionState } from "react"
import { usePathname } from "next/navigation"
import {
  subscribeNewsletter,
  type NewsletterFormState,
} from "@/app/actions/newsletter"

const INITIAL: NewsletterFormState = { status: "idle" }

/**
 * Email gate for the quarterly markedsrapport PDF. Pre-signup: editorial-dark
 * band with email form. Post-signup: same band collapses to a confirmation
 * + download CTA pointing at the file in /public/downloads/.
 *
 * The PDF is owned by Christer — drop a new file in /public/downloads/ and
 * bump RAPPORT_FILE in /markedsrapport/page.tsx for each quarterly issue.
 */
export function MarkedsrapportGate({
  fileUrl,
  label,
}: {
  fileUrl: string
  label: string
}) {
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
              <span className="eyebrow center no-rule">Klar for nedlasting</span>
              <h2>
                Takk — her er{" "}
                <span className="italic">rapporten din.</span>
              </h2>
              <p>
                {state.alreadySubscribed
                  ? "Du er allerede på listen — her er den nyeste rapporten."
                  : "Vi har lagt deg til på listen og sender en velkomsthilsen til innboksen din. Klikk under for å laste ned rapporten nå."}
              </p>
              <a
                className="btn btn-primary"
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "14px 28px",
                  fontSize: "13px",
                  background: "var(--warm-white)",
                  color: "var(--warm-grey)",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Last ned {label} (PDF)
              </a>
              <p className="newsletter-fineprint">
                Neste utgave kommer i april. Du får den automatisk i innboksen.
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow center no-rule">Last ned rapporten</span>
              <h2>
                Få {label.toLowerCase()}{" "}
                <span className="italic">på epost.</span>
              </h2>
              <p>
                Skriv inn e-postadressen din — vi sender lenken til rapporten,
                og melder deg samtidig på det kvartalsvise markedsbrevet. Du
                kan melde deg av når som helst.
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
                  {pending ? "Sender …" : "Last ned"}
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
