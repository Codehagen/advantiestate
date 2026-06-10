"use client"

import { useActionState } from "react"

import {
  subscribePressevarsel,
  type PressevarselFormState,
} from "@/app/actions/pressevarsel"

const INITIAL: PressevarselFormState = { status: "idle" }

/**
 * TODO 19 — «Få pressevarsel»-påmelding på /presserom.
 * Gjenbruker .ei-alert-bandet (samme mønster som oppdragsvarslet på
 * /eiendommer); lead lagres med source "presserom".
 */
export function PressevarselForm() {
  const [state, formAction] = useActionState(subscribePressevarsel, INITIAL)

  const success = state.status === "success"
  const successCopy = success
    ? state.alreadySubscribed
      ? "Du står allerede på presselisten — tallene kommer i innboksen ved neste kvartalsslipp."
      : "Registrert. Du får kvartalstallene i innboksen samme morgen de slippes."
    : null

  return (
    <div className="ei-alert">
      <div>
        <div className="pre">For redaksjoner</div>
        <h4>
          Få kvartalstallene{" "}
          <span className="italic">før du trenger dem.</span>
        </h4>
        <p>
          Vi sender markedstall, ferdige sitater og lenke til arkivutgivelsen
          én gang i kvartalet — fritt til redaksjonell bruk med kreditering.
        </p>
      </div>
      {success ? (
        <p role="status" className="ei-alert-success">
          {successCopy}
        </p>
      ) : (
        <form action={formAction}>
          <input
            type="text"
            name="firstName"
            placeholder="Navn"
            aria-label="Navn"
            autoComplete="name"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="navn@redaksjon.no"
            aria-label="E-post"
            autoComplete="email"
            required
          />
          <input
            type="text"
            name="redaksjon"
            placeholder="Redaksjon/medium (valgfritt)"
            aria-label="Redaksjon eller medium"
            autoComplete="organization"
          />
          <input type="hidden" name="pageUrl" value="/presserom" />
          <button type="submit" className="btn btn-dark">
            Få pressevarsel
          </button>
          {state.status === "error" && (
            <p role="alert" className="ei-alert-error">
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
