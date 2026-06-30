"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import NumberFlow from "@number-flow/react";
import { Input } from "@/components/Input";
import { InfoTooltip } from "./InfoTooltip";

// Hoisted so the Intl.NumberFormat (CLDR parsing) is built once at module load,
// not reconstructed on every keystroke while editing the calculator inputs.
const NOK_FORMAT = new Intl.NumberFormat("no-NO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const formatCurrency = (value: number) => NOK_FORMAT.format(value);

export function ROICalculator() {
  // Input state
  const [initialInvestering, setInitialInvestering] = useState(15000000);
  const [arligLeieinntekt, setArligLeieinntekt] = useState(1200000);
  const [driftskostnader, setDriftskostnader] = useState(180000);
  const [verdiOkning, setVerdiOkning] = useState(3); // %
  const [holdeperiode, setHoldeperiode] = useState(10); // years

  // While typing in a numeric field we update results instantly (no roll) and
  // only let NumberFlow animate once typing settles (~350ms after last change).
  const [isEditing, setIsEditing] = useState(false);
  const editTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markEditing = () => {
    setIsEditing(true);
    if (editTimer.current) clearTimeout(editTimer.current);
    editTimer.current = setTimeout(() => setIsEditing(false), 350);
  };
  useEffect(() => {
    return () => {
      if (editTimer.current) clearTimeout(editTimer.current);
    };
  }, []);

  // Calculated values (derived — no 0→value roll on mount)
  const {
    totalAvkastningPercent,
    arligAvkastningPercent,
    totalVerdi,
    nettoGevinst,
  } = useMemo(() => {
    if (initialInvestering > 0 && holdeperiode > 0) {
      // Netto årlig leieinntekt
      const nettoArligInntekt = arligLeieinntekt - driftskostnader;

      // Total leieinntekt over holdeperioden
      const totalLeieinntekt = nettoArligInntekt * holdeperiode;

      // Estimert verdi ved salg (med verdiøkning)
      const salgsverdi =
        initialInvestering * Math.pow(1 + verdiOkning / 100, holdeperiode);

      // Kapitalgevinst
      const kapitalgevinst = salgsverdi - initialInvestering;

      // Total avkastning (leieinntekt + kapitalgevinst)
      const totalAvkastning = totalLeieinntekt + kapitalgevinst;

      // Total avkastning i prosent
      const totalAvkastningPct = (totalAvkastning / initialInvestering) * 100;

      // Gjennomsnittlig årlig avkastning
      const arligAvkastningPct = totalAvkastningPct / holdeperiode;

      return {
        totalAvkastningPercent: totalAvkastningPct,
        arligAvkastningPercent: arligAvkastningPct,
        // Total verdi (initial investering + total avkastning)
        totalVerdi: initialInvestering + totalAvkastning,
        // Netto gevinst
        nettoGevinst: totalAvkastning,
      };
    }
    return {
      totalAvkastningPercent: 0,
      arligAvkastningPercent: 0,
      totalVerdi: 0,
      nettoGevinst: 0,
    };
  }, [
    initialInvestering,
    arligLeieinntekt,
    driftskostnader,
    verdiOkning,
    holdeperiode,
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Input Section */}
      <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6">
        <h2 className="mb-6 text-xl font-semibold text-warm-grey">
          Legg inn verdier
        </h2>

        <div className="space-y-6">
          {/* Initial investering */}
          <div className="space-y-2">
            <div className="flex items-center">
              <label
                htmlFor="initialInvestering"
                className="text-sm font-medium text-warm-grey"
              >
                Initial investering (NOK)
              </label>
              <InfoTooltip text="Kjøpesum inkludert omkostninger" />
            </div>
            <div className="relative">
              <Input
                id="initialInvestering"
                type="text"
                value={formatCurrency(initialInvestering)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  const numValue = parseInt(value) || 0;
                  setInitialInvestering(numValue);
                  markEditing();
                }}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-warm-grey-2">
                kr
              </span>
            </div>
          </div>

          {/* Årlig leieinntekt */}
          <div className="space-y-2">
            <div className="flex items-center">
              <label
                htmlFor="arligLeieinntekt"
                className="text-sm font-medium text-warm-grey"
              >
                Årlig leieinntekt (NOK)
              </label>
              <InfoTooltip text="Forventet årlig leieinntekt" />
            </div>
            <div className="relative">
              <Input
                id="arligLeieinntekt"
                type="text"
                value={formatCurrency(arligLeieinntekt)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  const numValue = parseInt(value) || 0;
                  setArligLeieinntekt(numValue);
                  markEditing();
                }}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-warm-grey-2">
                kr
              </span>
            </div>
          </div>

          {/* Driftskostnader */}
          <div className="space-y-2">
            <div className="flex items-center">
              <label
                htmlFor="driftskostnader"
                className="text-sm font-medium text-warm-grey"
              >
                Årlige driftskostnader (NOK)
              </label>
              <InfoTooltip text="Vedlikehold, forsikring, eiendomsskatt, etc." />
            </div>
            <div className="relative">
              <Input
                id="driftskostnader"
                type="text"
                value={formatCurrency(driftskostnader)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  const numValue = parseInt(value) || 0;
                  setDriftskostnader(numValue);
                  markEditing();
                }}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-warm-grey-2">
                kr
              </span>
            </div>
          </div>

          {/* Verdiøkning per år */}
          <div className="space-y-2">
            <div className="flex items-center">
              <label
                htmlFor="verdiOkning"
                className="text-sm font-medium text-warm-grey"
              >
                Forventet verdiøkning per år (%)
              </label>
              <InfoTooltip text="Estimert årlig verdiøkning på eiendommen" />
            </div>
            <div className="relative">
              <Input
                id="verdiOkning"
                type="number"
                step="0.1"
                value={verdiOkning}
                onChange={(e) => {
                  setVerdiOkning(parseFloat(e.target.value) || 0);
                  markEditing();
                }}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-warm-grey-2">
                %
              </span>
            </div>
          </div>

          {/* Holdeperiode */}
          <div className="space-y-2">
            <div className="flex items-center">
              <label
                htmlFor="holdeperiode"
                className="text-sm font-medium text-warm-grey"
              >
                Holdeperiode (år)
              </label>
              <InfoTooltip text="Hvor lenge planlegger du å eie eiendommen?" />
            </div>
            <div className="relative">
              <Input
                id="holdeperiode"
                type="number"
                step="1"
                min="1"
                value={holdeperiode}
                onChange={(e) => {
                  setHoldeperiode(parseInt(e.target.value) || 1);
                  markEditing();
                }}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-warm-grey-2">
                år
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {/* Total avkastning % */}
        <div className="rounded-xl border border-light-blue/20 bg-gradient-to-br from-light-blue/5 to-transparent p-6">
          <div className="mb-2 text-sm font-medium text-warm-grey-2">
            Total avkastning
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={totalAvkastningPercent}
              format={{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
              animated={!isEditing}
              className="text-4xl font-bold text-warm-grey"
            />
            <span className="ml-2 text-2xl font-semibold text-warm-grey-2">
              %
            </span>
          </div>
          <p className="mt-2 text-xs text-warm-grey-2">
            Total avkastning over {holdeperiode} år
          </p>
        </div>

        {/* Gjennomsnittlig årlig avkastning */}
        <div className="rounded-xl border border-light-blue/20 bg-gradient-to-br from-light-blue/5 to-transparent p-6">
          <div className="mb-2 text-sm font-medium text-warm-grey-2">
            Gjennomsnittlig årlig avkastning
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={arligAvkastningPercent}
              format={{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
              animated={!isEditing}
              className="text-4xl font-bold text-warm-grey"
            />
            <span className="ml-2 text-2xl font-semibold text-warm-grey-2">
              %
            </span>
          </div>
          <p className="mt-2 text-xs text-warm-grey-2">
            Gjennomsnitt per år
          </p>
        </div>

        {/* Total verdi */}
        <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6">
          <div className="mb-2 text-sm font-medium text-warm-grey-2">
            Total verdi ved salg
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={totalVerdi}
              format={{
                style: "currency",
                currency: "NOK",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }}
              locales="no-NO"
              animated={!isEditing}
              className="text-3xl font-bold text-warm-grey"
            />
          </div>
          <p className="mt-2 text-xs text-warm-grey-2">
            Inkludert leieinntekter og verdiøkning
          </p>
        </div>

        {/* Netto gevinst */}
        <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6">
          <div className="mb-2 text-sm font-medium text-warm-grey-2">
            Netto gevinst
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={nettoGevinst}
              format={{
                style: "currency",
                currency: "NOK",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }}
              locales="no-NO"
              animated={!isEditing}
              className="text-3xl font-bold text-warm-grey"
            />
          </div>
          <p className="mt-2 text-xs text-warm-grey-2">
            Total gevinst etter {holdeperiode} år
          </p>
        </div>
      </div>
    </div>
  );
}
