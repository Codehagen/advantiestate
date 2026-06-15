import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { ValuationYieldCalculator } from "@/components/verktoy/ValuationYieldCalculator";
import {
  JourneyStepTracker,
  SjekklisteJourneyLink,
} from "@/components/verktoy/JourneyStepTracker";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  path: "/verktoy/pris-verdivurdering",
  title: "Prøv en verdivurdering selv | Estimert eiendomsverdi | Advanti Estate",
  description:
    "Prøv en verdivurdering selv: sett leie, driftskostnader og avkastningskrav (yield), så ser du estimert markedsverdi for næringseiendommen din i sanntid. Yield-metoden meglere bruker — et godt utgangspunkt før en presis verdivurdering i Nord-Norge.",
});

export default function PrisVerdiPage() {
  return (
    <>
      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Verktøy", href: "/verktoy" },
          { label: "Prøv en verdivurdering" },
        ]}
        eyebrow="Verktøy · Verdivurdering på minuttet"
        title={
          <>
            Prøv en <span className="italic">verdivurdering</span> <br />
            på egen hånd.
          </>
        }
        lede="Sett leie, driftskostnader og avkastningskrav — så ser du estimert markedsverdi i sanntid. Det er den samme yield-metoden meglere bruker, og et godt utgangspunkt før den presise vurderingen."
      />

      {/* CALCULATOR */}
      <section className="section section-divider" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <ValuationYieldCalculator />

          {/* Muted support link to the preparation checklist. */}
          <p
            className="num-hint"
            style={{ marginTop: 40, textAlign: "center" }}
          >
            <SjekklisteJourneyLink />
          </p>
          <JourneyStepTracker />
        </div>
      </section>

      {/* SLIK REGNER VI */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Metoden bak tallet</span>
            <div>
              <h2>
                Yield-metoden, <span className="italic">forenklet.</span>
              </h2>
              <p>
                Estimatet bygger på den samme logikken meglere bruker i en
                verdivurdering. Den gir et godt utgangspunkt — men erstatter ikke
                en faglig vurdering av kontrakter, beliggenhet og tilstand.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Netto driftsinntekt</h3>
              <p>
                <em>Leie − Drift.</em> Vi trekker eierkostnadene fra brutto leie
                og står igjen med netto driftsinntekt (NOI) — det eiendommen
                faktisk kaster av seg.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Avkastningskrav</h3>
              <p>
                <em>Verdi = NOI ÷ Yield.</em> NOI deles på avkastningskravet for
                ditt segment i Nord-Norge. Lavere yield i likvide markeder,
                høyere der risikoen er større.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Verdiintervall</h3>
              <p>
                Vi viser et intervall rundt estimatet (yield ±0,5 prosentpoeng),
                fordi små endringer i avkastningskravet gir store utslag på
                verdien.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Klar for et presist tall?"
        title={
          <>
            Fra estimat til <span className="italic">verdivurdering.</span>
          </>
        }
        sub="Estimatet hviler på leien og yielden du oppgir. Vil du vite hva eiendommen faktisk er verdt i dagens marked, gir en av partnerne våre deg en presis vurdering innen 24 timer — uforpliktende."
        primary={{ label: "Få verdivurdering", href: "/kontakt" }}
        secondary={{
          label: "Se våre tjenester",
          href: "/tjenester/verdivurdering",
        }}
      />
    </>
  );
}
