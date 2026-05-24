"use client"

import { useActionState } from "react"
import { usePathname } from "next/navigation"
import {
  subscribeNewsletter,
  type NewsletterFormState,
} from "@/app/actions/newsletter"

const INITIAL: NewsletterFormState = { status: "idle" }

type Variant = "default" | "compact"

type Source =
  | "footer"
  | "blog"
  | "help"
  | "markedsinnsikt"
  | "service"
  | "markedsrapport"

type Props = {
  /** Which signup surface this is — populates Discord context. */
  source?: Source
  /** Replace the default copy if a surface needs its own hook. */
  eyebrow?: string
  title?: React.ReactNode
  description?: string
  /** "compact" drops the band styling and renders inline (footer use). */
  variant?: Variant
  /** Replace the fine-print line (e.g. for the markedsrapport gate). */
  fineprint?: string
}

/**
 * Newsletter signup — same React Email-backed `subscribe` server action for
 * every surface, but each instance passes its own `source` so the team's
 * Discord digest reads accurately ("Markedsinnsikt → +1 abonnent" vs
 * "Blog footer → +1 abonnent").
 *
 * The full editorial-dark band variant is used at the foot of the blog and
 * blog-category routes. The compact variant inlines into the footer / inside
 * marketing pages.
 */
export function NewsletterSection({
  source = "footer",
  eyebrow = "Få våre analyser i innboksen",
  title = (
    <>
      Markedsbrev til <span className="italic">de som faktisk leser.</span>
    </>
  ),
  description = "Kvartalsvis brev fra senior partner. Ingen massemarkedsføring, ingen klikkfeller — bare det vi ser i markedet og hvordan vi tolker det.",
  variant = "default",
  fineprint = "Vi sender én utgave per kvartal. Avmelding når som helst.",
}: Props) {
  const pathname = usePathname()
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    INITIAL,
  )

  const successCopy =
    state.status === "success"
      ? state.alreadySubscribed
        ? "Du er allerede på listen — takk for at du svingom innom igjen."
        : "Takk — vi har notert e-posten. Du får en velkomsthilsen i innboksen om et øyeblikk."
      : null

  const form = (
    <>
      {state.status === "success" ? (
        <p className="newsletter-success" role="status">
          {successCopy}
        </p>
      ) : (
        <form className="newsletter-form" action={formAction}>
          <input
            type="email"
            name="email"
            placeholder="din@epost.no"
            aria-label="E-postadresse"
            required
            autoComplete="email"
          />
          <input type="hidden" name="source" value={source} />
          <input
            type="hidden"
            name="pageUrl"
            value={pathname ?? "(unknown)"}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={pending}
          >
            {pending ? "Sender …" : "Abonner"}
          </button>
        </form>
      )}
      {state.status === "error" && (
        <p
          className="newsletter-fineprint"
          role="alert"
          style={{ color: "rgba(243, 241, 239, 0.85)" }}
        >
          {state.message}
        </p>
      )}
      <p className="newsletter-fineprint">{fineprint}</p>
    </>
  )

  if (variant === "compact") {
    return (
      <div className="newsletter-inner" style={{ textAlign: "left" }}>
        {form}
      </div>
    )
  }

  return (
    <section className="newsletter">
      <div className="wrap">
        <div className="newsletter-inner">
          <span className="eyebrow center no-rule">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
          {form}
        </div>
      </div>
    </section>
  )
}
