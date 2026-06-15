import { CalculatorLayout } from "@/components/verktoy/CalculatorLayout";
import { ValuationYieldCalculator } from "@/components/verktoy/ValuationYieldCalculator";
import { constructMetadata } from "@/lib/utils";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import {
  JourneyStepTracker,
  SjekklisteJourneyLink,
} from "@/components/verktoy/JourneyStepTracker";

export const metadata = constructMetadata({
  path: "/verktoy/pris-verdivurdering",
  title: "Prøv en verdivurdering selv | Estimert eiendomsverdi | Advanti Estate",
  description:
    "Prøv en verdivurdering selv: sett leie, driftskostnader og avkastningskrav (yield), så ser du estimert markedsverdi for næringseiendommen din i sanntid. Yield-metoden meglere bruker — et godt utgangspunkt før en presis verdivurdering i Nord-Norge.",
});

export default function PrisVerdiPage() {
  return (
    <>
      <CalculatorLayout
        title="Prøv en verdivurdering"
        description="Sett leie, driftskostnader og avkastningskrav — så ser du estimert markedsverdi i sanntid. Det er den samme yield-metoden meglere bruker, og et godt utgangspunkt før en presis verdivurdering."
        badge="Verdivurdering"
      >
        <ValuationYieldCalculator />
      </CalculatorLayout>

      {/* CalculatorLayout already renders a CalculatorCTA; the in-calculator
          "Få en presis verdivurdering" link + the AnimatedCTA below carry the
          conversion path, so no extra CalculatorCTA here. */}

      {/* Typografisk dempet støtte­lenke — ikke en knapp, ikke konkurrent til
          primær-CTAen nedenfor. */}
      <p className="mx-auto mt-6 w-full max-w-6xl px-3 text-center text-sm">
        <SjekklisteJourneyLink />
      </p>
      <JourneyStepTracker />

      <section className="mx-auto mt-24 w-full max-w-6xl px-3 pb-24">
        <AnimatedCTA
          badge="Profesjonell Verdivurdering"
          title="Klar for en profesjonell verdivurdering?"
          description="En kalkulator gir et estimat, men en profesjonell verdivurdering tar hensyn til markedstrender, beliggenhet og eiendomsspesifikke forhold. Vi kombinerer solid fagkompetanse med lokal kunnskap om markedet i Nord-Norge."
          primaryAction={{
            label: "Få uforpliktende verdivurdering",
            href: "/kontakt",
          }}
          secondaryAction={{
            label: "Se våre tjenester",
            href: "/tjenester/verdivurdering",
          }}
          size="default"
        />
      </section>
    </>
  );
}
