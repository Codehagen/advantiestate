import { CalculatorLayout } from "@/components/verktoy/CalculatorLayout";
import { MortgageCalculator } from "@/components/verktoy/MortgageCalculator";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Boliglån Kalkulator | Advanti",
  description:
    "Beregn månedlige kostnader, total rentekostnad og nedbetalingsplan for næringslån. Få oversikt over finansieringen av din næringseiendom.",
});

export default function BoliglanKalkulatorPage() {
  return (
    <CalculatorLayout
      title="Boliglån Kalkulator"
      description="Beregn månedlige kostnader og total rentekostnad for næringslån. Kalkulatoren viser deg hvor mye du må betale hver måned og hvor mye lånet koster deg totalt."
      badge="Lån"
    >
      <MortgageCalculator />
    </CalculatorLayout>
  );
}
