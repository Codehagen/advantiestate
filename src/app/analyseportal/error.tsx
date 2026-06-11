"use client"

// Route-level error boundary for /analyseportal — a client-rendered data page
// must never show users a blank screen if a chunk or render fails.

export default function AnalyseportalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error("[analyseportal] route error", error)
  return (
    <section className="section" style={{ paddingTop: 160 }}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Analyseportal</span>
          <h2>
            Noe gikk galt med <span className="italic">portalen.</span>
          </h2>
          <p>
            Grafene kunne ikke lastes. Prøv igjen — eller se{" "}
            <a href="/markedsinnsikt">markedsinnsikt</a> for hovedtallene.
          </p>
          <p style={{ marginTop: 24 }}>
            <button type="button" className="btn btn-dark" onClick={reset}>
              Prøv igjen
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}
