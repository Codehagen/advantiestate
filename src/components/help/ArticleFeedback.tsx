"use client"

import { useState } from "react"

import { trackEvent } from "@/lib/analytics"

/**
 * Article feedback widget. "Var denne til hjelp?" → Ja/Nei, then a thank-you.
 * Pushes a help_feedback event to dataLayer via the shared analytics helper.
 */
export function ArticleFeedback({ slug }: { slug: string }) {
  const [done, setDone] = useState<"yes" | "no" | null>(null)

  const submit = (helpful: "yes" | "no") => {
    setDone(helpful)
    trackEvent("help_feedback", { slug, helpful: helpful === "yes" })
  }

  if (done) {
    return (
      <div className="ks-feedback">
        <p>
          Takk for{" "}
          <span
            style={{
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--warm-grey-85)",
            }}
          >
            tilbakemeldingen.
          </span>
        </p>
        <span className="art-feedback-done">
          {done === "yes"
            ? "Så bra at den var nyttig."
            : "Vi tar det med i forbedringen."}
        </span>
      </div>
    )
  }

  return (
    <div className="ks-feedback">
      <p>
        Var denne artikkelen{" "}
        <span
          style={{
            fontStyle: "italic",
            fontWeight: 300,
            color: "var(--warm-grey-85)",
          }}
        >
          til hjelp?
        </span>
      </p>
      <div className="btn-row">
        <button type="button" onClick={() => submit("yes")}>
          Ja
        </button>
        <button type="button" onClick={() => submit("no")}>
          Nei
        </button>
      </div>
    </div>
  )
}
