import { CalculatorLayout } from "@/components/verktoy/CalculatorLayout";
import { YieldCalculator } from "@/components/verktoy/YieldCalculator";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Yield Kalkulator | Advanti",
  description:
    "Beregn brutto og netto yield for næringseiendom. Få umiddelbar oversikt over avkastning basert på leieinntekter og driftskostnader.",
});

export default function YieldKalkulatorPage() {
  return (
    <CalculatorLayout
      title="Yield Kalkulator"
      description="Beregn brutto og netto yield for næringseiendom. Yield er et viktig nøkkeltall som viser avkastningen på investeringen din basert på leieinntekter."
      badge="Yield"
    >
      <YieldCalculator />
    </CalculatorLayout>
  );
}
