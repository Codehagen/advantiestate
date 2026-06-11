"use client"

// Inline lead form for the city pages — the page's primary conversion path.
// Four states (idle / pending / error / success) per the autoplan design spec:
// pending disables the button («Sender …»), errors render inline under the
// button as a live region, and the success receipt moves focus to its heading
// so the state change is announced.

import { useRef, useState, useTransition } from "react"
import { track } from "@vercel/analytics"

import { submitCityLead } from "@/app/actions/naringsmegler-lead"

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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pending) return
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await submitCityLead(formData)
      if (result.ok) {
        setSent(true)
        track("naringsmegler_lead", { city: slug })
        // Move focus to the receipt so the state change is announced.
        requestAnimationFrame(() => doneHeading.current?.focus())
      } else {
        setError(result.error)
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
          <h4 ref={doneHeading} tabIndex={-1}>
            Takk — vi tar kontakt.
          </h4>
          <p>
            Henvendelsen er registrert. En av partnerne tar kontakt, vanligvis
            samme dag.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className="cy-form" onSubmit={onSubmit}>
      <div className="fpre">Uforpliktende · svar vanligvis samme dag</div>
      <h3>
        Din eiendom, <span className="it">vurdert lokalt.</span>
      </h3>
      <p className="fsub">
        Vi bruker informasjonen kun til å forberede en relevant vurdering. Du
        får et skriftlig tilbud før vi starter — ingen skjulte kostnader.
      </p>

      {/* Honeypot — hidden from users, tempting for bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`cy-hp-${slug}`}>Firma web</label>
        <input
          id={`cy-hp-${slug}`}
          name="firma_web"
          type="text"
          tabIndex={-1}
          autoComplete="off"
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
            <option>Kontor</option>
            <option>Handel</option>
            <option>Logistikk / lager</option>
            <option>Kombinert bygg</option>
            <option>Annet</option>
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
