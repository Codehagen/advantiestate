"use client"

import { useState, type FormEvent } from "react"
import { subscribeVerdivurderingIntake } from "@/app/actions/verdivurdering-intake"

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string }

const PROPERTY_TYPES = [
  "Kontor",
  "Handel",
  "Logistikk / lager",
  "Kombinert",
  "Annet",
] as const

const SIZE_BUCKETS = [
  "Under 500 m²",
  "500 – 2 000 m²",
  "2 000 – 5 000 m²",
  "Over 5 000 m²",
] as const

const PURPOSES = [
  "Vurderer salg",
  "Refinansiering / banklån",
  "Regnskap / revisjon",
  "Strategi / hold-vs-sell",
  "Annet",
] as const

const HORIZONS = [
  "Så snart som mulig",
  "Innen 1–3 måneder",
  "3–6 måneder",
  "Lenger fram",
] as const

/**
 * Hard-intent intake form anchored at #bestill on /tjenester/verdivurdering.
 *
 * Reuses the same .contact-form / .field markup as the kontakt page so the
 * editorial typography stays consistent without bespoke CSS. Submitting
 * routes to subscribeVerdivurderingIntake which lands the lead in Resend
 * and pings Discord with the full intake context.
 */
export function VerdivurderingIntake() {
  const [state, setState] = useState<FormState>({ status: "idle" })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState({ status: "submitting" })
    const formData = new FormData(event.currentTarget)
    try {
      const result = await subscribeVerdivurderingIntake(formData)
      if (result.ok) {
        setState({ status: "success" })
      } else {
        setState({ status: "error", message: result.error })
      }
    } catch (e) {
      console.error(e)
      setState({
        status: "error",
        message: "Noe gikk galt. Prøv igjen om et øyeblikk.",
      })
    }
  }

  if (state.status === "success") {
    return (
      <section className="newsletter" id="bestill">
        <div className="wrap">
          <div className="newsletter-inner">
            <span className="eyebrow center no-rule">Mottatt</span>
            <h2>
              Takk — vi tar kontakt{" "}
              <span className="italic">innen 24 timer.</span>
            </h2>
            <p>
              Christer eller en av partnerne ringer deg innen én virkedag for å
              gå gjennom forespørselen og avtale neste steg. Du har samtidig
              fått en bekreftelse på epost — sjekk innboksen.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const isSubmitting = state.status === "submitting"

  return (
    <section className="section section-divider" id="bestill">
      <div className="wrap">
        <div className="head-compact">
          <span className="eyebrow">Bestilling</span>
          <div>
            <h2>
              Bestill verdivurdering{" "}
              <span className="italic">på din eiendom.</span>
            </h2>
            <p>
              Fyll ut det vi trenger — vi ringer deg innen 24 timer for å gå
              gjennom oppdraget og avtale neste steg. Uforpliktende.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="contact-form"
          style={{ maxWidth: 720, margin: "0 auto" }}
        >
          <div className="field">
            <label htmlFor="propertyType">01 · Eiendomstype</label>
            <select
              id="propertyType"
              name="propertyType"
              required
              disabled={isSubmitting}
              defaultValue=""
            >
              <option value="" disabled>
                Velg …
              </option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="location">02 · By / sted</label>
            <input
              id="location"
              name="location"
              type="text"
              required
              disabled={isSubmitting}
              placeholder="Bodø, Tromsø, Alta, Harstad …"
            />
          </div>

          <div className="field">
            <label htmlFor="size">03 · Størrelse</label>
            <select
              id="size"
              name="size"
              required
              disabled={isSubmitting}
              defaultValue=""
            >
              <option value="" disabled>
                Velg …
              </option>
              {SIZE_BUCKETS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="purpose">04 · Hva er bakgrunnen?</label>
            <select
              id="purpose"
              name="purpose"
              required
              disabled={isSubmitting}
              defaultValue=""
            >
              <option value="" disabled>
                Velg …
              </option>
              {PURPOSES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="horizon">05 · Tidshorisont</label>
            <select
              id="horizon"
              name="horizon"
              required
              disabled={isSubmitting}
              defaultValue=""
            >
              <option value="" disabled>
                Velg …
              </option>
              {HORIZONS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="firstName">Navn</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              disabled={isSubmitting}
              autoComplete="given-name"
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isSubmitting}
              autoComplete="email"
              placeholder="din@epost.no"
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Telefon (valgfritt)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              disabled={isSubmitting}
              autoComplete="tel"
              placeholder="+47 ..."
            />
          </div>

          <div className="field">
            <label htmlFor="notes">Beskjed (valgfritt)</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              disabled={isSubmitting}
              placeholder="Kort om eiendommen — leieforhold, alder, kjente utfordringer …"
            />
          </div>

          {state.status === "error" && (
            <p
              role="alert"
              style={{
                color: "#a3231b",
                fontSize: 14,
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sender …" : "Send bestilling"}
          </button>

          <p
            style={{
              fontSize: 12,
              color: "var(--warm-grey-85)",
              marginTop: 16,
              lineHeight: 1.5,
            }}
          >
            Vi behandler informasjonen din konfidensielt og kontakter deg kun
            om denne forespørselen. Du blir samtidig meldt på Advanti sitt
            kvartalsvise markedsbrev — du kan melde deg av når som helst.
          </p>
        </form>
      </div>
    </section>
  )
}
