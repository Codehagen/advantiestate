import { CalculatorLayout } from "@/components/verktoy/CalculatorLayout";
import { ROICalculator } from "@/components/verktoy/ROICalculator";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "ROI Kalkulator | Advanti",
  description:
    "Beregn avkastning på investering (ROI) for næringseiendom. Få oversikt over total avkastning inkludert leieinntekter og verdiøkning over tid.",
});

export default function ROIKalkulatorPage() {
  return (
    <CalculatorLayout
      title="ROI Kalkulator"
      description="Beregn total avkastning på investering (Return on Investment) for næringseiendom. ROI tar hensyn til både leieinntekter og forventet verdiøkning over holdeperioden."
      badge="ROI"
    >
      <ROICalculator />
    </CalculatorLayout>
  );
}
