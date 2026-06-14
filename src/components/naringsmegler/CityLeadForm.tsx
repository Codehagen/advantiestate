"use client"

// Inline lead form for the city pages — the page's primary conversion path.
// Four states (idle / pending / error / success) per the autoplan design spec:
// pending disables the button («Sender …»), errors render inline under the
// button as a live region, and the success receipt moves focus to its heading
// so the state change is announced. A thrown/rejected action (network drop
// mid-submit) lands in the same inline error state — never the route error
// boundary, which would destroy the visitor's typed lead.

import { useRef, useState, useTransition } from "react"
import { track } from "@vercel/analytics"

import { submitCityLead } from "@/app/actions/naringsmegler-lead"
import { trackLeadSubmit } from "@/lib/analytics"
import { useLeadStartOnFocus } from "@/lib/hooks/useLeadFunnel"
import { PROPERTY_TYPES } from "./leadConstants"

type Props = {
  cityName: string
  slug: string
  phone: string
}

export function CityLeadForm({ cityName, slug, phone }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const doneHeading = useRef<HTMLHeadingElement>(null)
  // Synchronous double-submit guard: `pending` only flips after a re-render,
  // so two clicks in the same frame would both dispatch the action.
  const submitting = useRef(false)
  const onFirstFocus = useLeadStartOnFocus("naringsmegler", "city-lead")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting.current) return
    submitting.current = true
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      try {
        const result = await submitCityLead(formData)
        if (result.ok) {
          setSent(true)
          track("naringsmegler_lead", { city: slug })
          trackLeadSubmit("naringsmegler", "city-lead")
          // Move focus to the receipt so the state change is announced.
          requestAnimationFrame(() => doneHeading.current?.focus())
        } else {
          setError(result.error)
        }
      } catch {
        setError(`Noe gikk galt. Prøv igjen — eller ring oss på ${phone}.`)
      } finally {
        submitting.current = false
      }
    })
  }

  const phoneHref = `tel:${phone.replace(/\s/g, "")}`

  if (sent) {
    return (
      <div className="cy-form" aria-live="polite">
        <div className="fdone">
          <div className="ok" aria-hidden="true">
            ✓
          </div>
          <h3 ref={doneHeading} tabIndex={-1}>
            Takk — vi tar kontakt.
          </h3>
          <p>
            Henvendelsen er registrert. En av partnerne tar kontakt, vanligvis
            samme dag.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className="cy-form" onSubmit={onSubmit} onFocusCapture={onFirstFocus}>
      <div className="fpre">Uforpliktende · svar vanligvis samme dag</div>
      <h3>
        Din eiendom, <span className="it">vurdert lokalt.</span>
      </h3>
      <p className="fsub">
        Vi bruker informasjonen kun til å forberede en relevant vurdering. Du
        får et skriftlig tilbud før vi starter — ingen skjulte kostnader.
      </p>

      {/* Honeypot — hidden from users, tempting for bots. Name avoids
          autofill heuristics (no "firma"/"web"/"company" tokens). */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`cy-hp-${slug}`}>Ikke fyll ut dette feltet</label>
        <input
          id={`cy-hp-${slug}`}
          name="kontakt_url_x"
          type="text"
          tabIndex={-1}
          autoComplete="one-time-code"
        />
      </div>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="by" value={cityName} />

      <div className="frow">
        <div className="cy-field">
          <label htmlFor="cy-navn">Navn</label>
          <input
            id="cy-navn"
            name="navn"
            type="text"
            placeholder="Ola Nordmann"
            autoComplete="name"
            required
          />
        </div>
        <div className="cy-field">
          <label htmlFor="cy-tlf">Telefon</label>
          <input
            id="cy-tlf"
            name="tlf"
            type="tel"
            placeholder="+47 …"
            autoComplete="tel"
            required
          />
        </div>
      </div>
      <div className="cy-field">
        <label htmlFor="cy-epost">E-post</label>
        <input
          id="cy-epost"
          name="epost"
          type="email"
          placeholder="ola@firma.no"
          autoComplete="email"
          required
        />
      </div>
      <div className="frow">
        <div className="cy-field">
          <label htmlFor="cy-type">Eiendomstype</label>
          <select id="cy-type" name="type" defaultValue="">
            <option value="">Velg type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="cy-field">
          <label htmlFor="cy-adr">Adresse / område</label>
          <input
            id="cy-adr"
            name="adresse"
            type="text"
            placeholder={`Sentrum, ${cityName}`}
          />
        </div>
      </div>
      <button type="submit" className="fbtn" disabled={pending}>
        {pending ? "Sender …" : "Send henvendelse"}{" "}
        <span className="arrow" aria-hidden="true">
          →
        </span>
      </button>
      {error && (
        <p className="ferr" role="alert">
          {error}
        </p>
      )}
      <p className="fnote">
        Eller ring oss direkte: <a href={phoneHref}>{phone}</a>
      </p>
    </form>
  )
}
