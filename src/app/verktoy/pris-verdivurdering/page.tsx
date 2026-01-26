import { CalculatorLayout } from "@/components/verktoy/CalculatorLayout";
import { ValuationPriceCalculator } from "@/components/verktoy/ValuationPriceCalculator";
import { constructMetadata } from "@/lib/utils";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import { CalculatorCTA } from "@/components/verktoy/CalculatorCTA";

export const metadata = constructMetadata({
  title: "Pris på Verdivurdering Kalkulator | Estimat for Næringseiendom | Advanti",
  description:
    "Beregn estimert pris for verdivurdering av næringseiendom basert på størrelse, kompleksitet og formål. Få en indikasjon på kostnaden før du bestiller en profesjonell verdsettelse.",
});

export default function PrisVerdiPage() {
  return (
    <>
      <CalculatorLayout
        title="Pris på Verdivurdering Kalkulator"
        description="Beregn estimert pris for verdivurdering av din næringseiendom. Prisen varierer basert på størrelse, kompleksitet, formål og tidsramme. Dette er et estimat – kontakt oss for et nøyaktig tilbud."
        badge="Prisestimering"
      >
        <ValuationPriceCalculator />
      </CalculatorLayout>

      <section className="mx-auto mt-12 w-full max-w-6xl px-3">
        <CalculatorCTA
          title="Trenger du et nøyaktig tilbud?"
          description="Denne kalkulatoren gir et estimat basert på generelle priser. For et nøyaktig tilbud tilpasset din spesifikke situasjon, kontakt oss for en uforpliktende samtale. Vi leverer verdsettelser på 48 timer med lokal markedsinnsikt i Nord-Norge."
        />
      </section>

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
