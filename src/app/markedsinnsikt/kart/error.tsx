"use client"

// Next App Router route error boundary for /markedsinnsikt/kart. Catches any
// render crash in the page and shows an editorial fallback instead of the
// white "Application error" screen the Mapbox version produced.

export default function MarkedskartError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="pr-4 pt-32">
      <div className="mi-kart-frame mi-kart-error">
        <div className="mi-kart-error-inner">
          <div className="mi-zone-eyebrow">Markedskart</div>
          <h2>Kartet kunne ikke lastes</h2>
          <p>
            Noe gikk galt da kartet skulle vises. Prøv igjen, eller gå tilbake
            til markedsinnsikt.
          </p>
          <div className="mi-kart-error-actions">
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => reset()}
            >
              Prøv igjen
            </button>
            <a href="/markedsinnsikt" className="btn btn-outline">
              Til markedsinnsikt
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
