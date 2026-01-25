import { CalculatorLayout } from "@/components/verktoy/CalculatorLayout";
import { YieldCalculator } from "@/components/verktoy/YieldCalculator";
import { constructMetadata } from "@/lib/utils";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";

export const metadata = constructMetadata({
  title: "Yield Kalkulator | Advanti",
  description:
    "Beregn brutto og netto yield for næringseiendom. Få umiddelbar oversikt over avkastning basert på leieinntekter og driftskostnader.",
});

export default function YieldKalkulatorPage() {
  return (
    <>
      <CalculatorLayout
        title="Yield Kalkulator"
        description="Beregn brutto og netto yield for næringseiendom. Yield er et viktig nøkkeltall som viser avkastningen på investeringen din basert på leieinntekter."
        badge="Yield"
      >
        <YieldCalculator />
      </CalculatorLayout>

      <section className="mx-auto mt-24 w-full max-w-6xl px-3 pb-24">
        <AnimatedCTA
          badge="Profesjonell Vurdering"
          title="Trenger du en nøyaktig verdivurdering?"
          description="En kalkulator gir et estimat, men en profesjonell verdivurdering tar hensyn til markedstrender, beliggenhet og eiendomsspesifikke forhold."
          primaryAction={{
            label: "Kontakt oss for verdivurdering",
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
