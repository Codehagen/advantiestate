import { VerdivurderingIntakeForm } from "@/components/forms/VerdivurderingIntakeForm"

/**
 * Hard-intent intake anchored at #bestill on /tjenester/verdivurdering.
 *
 * Renders the shared VerdivurderingIntakeForm so the service page and the
 * dedicated /verdivurdering conversion page use exactly one form contract
 * (fields, validation, submit, analytics). The surrounding section keeps the
 * service-page framing; the form drops its own heading via showHeading={false}.
 */
export function VerdivurderingIntake() {
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

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <VerdivurderingIntakeForm
            page="/tjenester/verdivurdering"
            source="tjeneste_bestill"
            showHeading={false}
          />
        </div>
      </div>
    </section>
  )
}
