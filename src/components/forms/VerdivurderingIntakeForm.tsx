"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"

import { subscribeVerdivurderingIntake } from "@/app/actions/verdivurdering-intake"
import { trackEvent, trackLeadStart, trackLeadSubmit } from "@/lib/analytics"

type FormStatus =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string }

export type VerdivurderingPrefill = {
  type?: string
  by?: string
  areal?: string
  leie?: string
}

type Props = {
  /** Surface identifier carried into the lead payload + analytics. */
  page: string
  /** Analytics source dimension (distinguishes funnel surfaces). */
  source: string
  /** Optional prefill carried from the næringskalkulator via URL params. */
  prefill?: VerdivurderingPrefill
  /**
   * Render the form's own h2/sub. Off when the surrounding section already
   * provides a heading (e.g. the #bestill section on the service page).
   */
  showHeading?: boolean
}

const PROPERTY_TYPES = [
  "Kontor",
  "Handel",
  "Lager / logistikk",
  "Kombinasjon",
  "Annet",
] as const

const PURPOSES = [
  "Vurderer salg",
  "Refinansiering",
  "Regnskap / IFRS",
  "Vurderer kjøp",
  "Bare nysgjerrig",
] as const

/**
 * Tolerant match so calculator values like "Lager" hit "Lager / logistikk".
 * Requires a 3+ char token so a stray short param can't check several radios
 * at once (React errors on multiple defaultChecked in one group).
 */
function matchesType(prefill: string | undefined, value: string): boolean {
  if (!prefill) return false
  const a = prefill.trim().toLowerCase()
  if (a.length < 3) return false
  const b = value.toLowerCase()
  return a === b || b.includes(a) || a.includes(b)
}

/**
 * Shared verdivurdering intake form — single source of truth for the fields,
 * validation, submit and analytics. Rendered both on the dedicated
 * /verdivurdering conversion page and inside the /tjenester/verdivurdering
 * #bestill section, so there is never more than one form contract to maintain.
 *
 * Submits to subscribeVerdivurderingIntake (Resend + Discord + rate-limit).
 */
export function VerdivurderingIntakeForm({
  page,
  source,
  prefill,
  showHeading = true,
}: Props) {
  const [state, setState] = useState<FormStatus>({ status: "idle" })
  // Dedupe the lead_form_start event so it fires once per mount, on the first
  // real field interaction (not on mere view).
  const startedRef = useRef(false)

  // Fire once when the form is shown so we can measure form-views per surface.
  useEffect(() => {
    trackEvent("journey_step", { step: "skjema", source })
  }, [source])

  function handleFirstFocus() {
    if (startedRef.current) return
    startedRef.current = true
    trackLeadStart(source, "verdivurdering")
  }

  const hasPrefill = Boolean(
    prefill && (prefill.type || prefill.by || prefill.areal || prefill.leie),
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState({ status: "submitting" })
    const formData = new FormData(event.currentTarget)
    try {
      const result = await subscribeVerdivurderingIntake(formData)
      if (result.ok) {
        setState({ status: "success" })
        trackEvent("rapport_bestill", { source })
        trackLeadSubmit(source, "verdivurdering")
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
      <div className="form-success">
        <div className="check" aria-hidden="true">
          ✓
        </div>
        <h2>Takk — forespørselen er mottatt.</h2>
        <p className="sub" style={{ marginTop: 12, maxWidth: "38ch" }}>
          En av partnerne våre tar kontakt innen 24 timer på virkedager for en
          uforpliktende samtale om eiendommen din.
        </p>
      </div>
    )
  }

  const isSubmitting = state.status === "submitting"

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={handleFirstFocus}
      className="contact-form vv-form"
    >
      {showHeading && (
        <>
          <h2>Be om verdivurdering.</h2>
          <p className="sub">
            Det tar to minutter. Du forplikter deg ikke til noe.
          </p>
        </>
      )}

      <input type="hidden" name="page" value={page} />

      {hasPrefill && (
        <p className="vv-prefill-note">
          Vi tar utgangspunkt i tallene fra næringskalkulatoren — juster gjerne
          om noe har endret seg.
        </p>
      )}

      {/* STEG 1 — eiendommen */}
      <div className="step-mark">01 — Om eiendommen</div>

      <span className="vv-seg-label">Eiendomstype</span>
      <div className="vv-seg">
        {PROPERTY_TYPES.map((t, i) => (
          <label key={t}>
            <input
              type="radio"
              name="propertyType"
              value={t}
              required={i === 0}
              defaultChecked={matchesType(prefill?.type, t)}
              disabled={isSubmitting}
            />
            <span>{t}</span>
          </label>
        ))}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="address">Adresse</label>
          <input
            id="address"
            name="address"
            type="text"
            disabled={isSubmitting}
            placeholder="Gateadresse"
          />
        </div>
        <div className="field">
          <label htmlFor="location">By</label>
          <input
            id="location"
            name="location"
            type="text"
            required
            disabled={isSubmitting}
            defaultValue={prefill?.by ?? ""}
            placeholder="Bodø, Tromsø, Alta …"
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="areal">Areal (BTA m²)</label>
          <input
            id="areal"
            name="areal"
            type="text"
            inputMode="numeric"
            disabled={isSubmitting}
            defaultValue={prefill?.areal ?? ""}
            placeholder="f.eks. 2 400"
          />
        </div>
        <div className="field">
          <label htmlFor="leie">Årlig leieinntekt (valgfritt)</label>
          <input
            id="leie"
            name="leie"
            type="text"
            inputMode="numeric"
            disabled={isSubmitting}
            defaultValue={prefill?.leie ?? ""}
            placeholder="kr — om kjent"
          />
        </div>
      </div>

      {/* STEG 2 — formål */}
      <div className="step-mark">02 — Formål med vurderingen</div>
      <div className="vv-seg">
        {PURPOSES.map((p, i) => (
          <label key={p}>
            <input
              type="radio"
              name="purpose"
              value={p}
              required={i === 0}
              disabled={isSubmitting}
            />
            <span>{p}</span>
          </label>
        ))}
      </div>

      {/* STEG 3 — kontakt */}
      <div className="step-mark">03 — Dine opplysninger</div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="firstName">Fullt navn</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            disabled={isSubmitting}
            autoComplete="name"
            placeholder="Ola Nordmann"
          />
        </div>
        <div className="field">
          <label htmlFor="company">Selskap</label>
          <input
            id="company"
            name="company"
            type="text"
            disabled={isSubmitting}
            autoComplete="organization"
            placeholder="Selskapsnavn AS"
          />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="email">E-post</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isSubmitting}
            autoComplete="email"
            placeholder="ola@selskap.no"
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Telefon</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            disabled={isSubmitting}
            autoComplete="tel"
            placeholder="+47 000 00 000"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="notes">Noe mer vi bør vite? (valgfritt)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          disabled={isSubmitting}
          placeholder="Leietakere, kontraktslengde, tilstand, tidshorisont …"
        />
      </div>

      <label className="consent">
        <input type="checkbox" required disabled={isSubmitting} />
        <span>
          Jeg samtykker til at Advanti behandler personopplysningene mine for å
          besvare henvendelsen. Vi deler aldri kontaktinformasjon med
          tredjepart, og all informasjon behandles konfidensielt.
        </span>
      </label>

      {state.status === "error" && (
        <p
          role="alert"
          style={{ color: "#a3231b", fontSize: 14, marginTop: 8 }}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-dark submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sender …" : "Send forespørsel"}
        {!isSubmitting && <span className="arrow">→</span>}
      </button>
    </form>
  )
}
