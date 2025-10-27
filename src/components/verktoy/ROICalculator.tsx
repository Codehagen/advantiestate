"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { Input } from "@/components/Input";
import { RiInformationLine } from "@remixicon/react";

export function ROICalculator() {
  // Input state
  const [initialInvestering, setInitialInvestering] = useState(15000000);
  const [arligLeieinntekt, setArligLeieinntekt] = useState(1200000);
  const [driftskostnader, setDriftskostnader] = useState(180000);
  const [verdiOkning, setVerdiOkning] = useState(3); // %
  const [holdeperiode, setHoldeperiode] = useState(10); // years

  // Calculated values
  const [totalAvkastningPercent, setTotalAvkastningPercent] = useState(0);
  const [arligAvkastningPercent, setArligAvkastningPercent] = useState(0);
  const [totalVerdi, setTotalVerdi] = useState(0);
  const [nettoGevinst, setNettoGevinst] = useState(0);

  // Calculate on input change
  useEffect(() => {
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
      setTotalAvkastningPercent(totalAvkastningPct);

      // Gjennomsnittlig årlig avkastning
      const arligAvkastningPct = totalAvkastningPct / holdeperiode;
      setArligAvkastningPercent(arligAvkastningPct);

      // Total verdi (initial investering + total avkastning)
      setTotalVerdi(initialInvestering + totalAvkastning);

      // Netto gevinst
      setNettoGevinst(totalAvkastning);
    }
  }, [
    initialInvestering,
    arligLeieinntekt,
    driftskostnader,
    verdiOkning,
    holdeperiode,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("no-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Input Section */}
      <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6 dark:border-warm-white/10 dark:bg-warm-grey-2/20">
        <h2 className="mb-6 text-xl font-semibold text-warm-grey dark:text-warm-white">
          Legg inn verdier
        </h2>

        <div className="space-y-6">
          {/* Initial investering */}
          <div className="space-y-2">
            <label
              htmlFor="initialInvestering"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Initial investering (NOK)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Kjøpesum inkludert omkostninger
                </div>
              </div>
            </label>
            <div className="relative">
              <Input
                id="initialInvestering"
                type="text"
                value={formatCurrency(initialInvestering)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  const numValue = parseInt(value) || 0;
                  setInitialInvestering(numValue);
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
            <label
              htmlFor="arligLeieinntekt"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Årlig leieinntekt (NOK)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Forventet årlig leieinntekt
                </div>
              </div>
            </label>
            <div className="relative">
              <Input
                id="arligLeieinntekt"
                type="text"
                value={formatCurrency(arligLeieinntekt)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  const numValue = parseInt(value) || 0;
                  setArligLeieinntekt(numValue);
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
            <label
              htmlFor="driftskostnader"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Årlige driftskostnader (NOK)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Vedlikehold, forsikring, eiendomsskatt, etc.
                </div>
              </div>
            </label>
            <div className="relative">
              <Input
                id="driftskostnader"
                type="text"
                value={formatCurrency(driftskostnader)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  const numValue = parseInt(value) || 0;
                  setDriftskostnader(numValue);
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
            <label
              htmlFor="verdiOkning"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Forventet verdiøkning per år (%)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Estimert årlig verdiøkning på eiendommen
                </div>
              </div>
            </label>
            <div className="relative">
              <Input
                id="verdiOkning"
                type="number"
                step="0.1"
                value={verdiOkning}
                onChange={(e) => setVerdiOkning(parseFloat(e.target.value) || 0)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-warm-grey-2">
                %
              </span>
            </div>
          </div>

          {/* Holdeperiode */}
          <div className="space-y-2">
            <label
              htmlFor="holdeperiode"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Holdeperiode (år)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Hvor lenge planlegger du å eie eiendommen?
                </div>
              </div>
            </label>
            <div className="relative">
              <Input
                id="holdeperiode"
                type="number"
                step="1"
                min="1"
                value={holdeperiode}
                onChange={(e) => setHoldeperiode(parseInt(e.target.value) || 1)}
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
        <div className="rounded-xl border border-light-blue/20 bg-gradient-to-br from-light-blue/5 to-transparent p-6 dark:border-light-blue/30 dark:from-light-blue/10">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Total avkastning
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={totalAvkastningPercent}
              format={{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
              className="text-4xl font-bold text-warm-grey dark:text-warm-white"
            />
            <span className="ml-2 text-2xl font-semibold text-warm-grey-2 dark:text-warm-grey-1">
              %
            </span>
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Total avkastning over {holdeperiode} år
          </p>
        </div>

        {/* Gjennomsnittlig årlig avkastning */}
        <div className="rounded-xl border border-light-blue/20 bg-gradient-to-br from-light-blue/5 to-transparent p-6 dark:border-light-blue/30 dark:from-light-blue/10">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Gjennomsnittlig årlig avkastning
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={arligAvkastningPercent}
              format={{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
              className="text-4xl font-bold text-warm-grey dark:text-warm-white"
            />
            <span className="ml-2 text-2xl font-semibold text-warm-grey-2 dark:text-warm-grey-1">
              %
            </span>
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Gjennomsnitt per år
          </p>
        </div>

        {/* Total verdi */}
        <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6 dark:border-warm-white/10 dark:bg-warm-grey-2/20">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
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
              className="text-3xl font-bold text-warm-grey dark:text-warm-white"
            />
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Inkludert leieinntekter og verdiøkning
          </p>
        </div>

        {/* Netto gevinst */}
        <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6 dark:border-warm-white/10 dark:bg-warm-grey-2/20">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
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
              className="text-3xl font-bold text-warm-grey dark:text-warm-white"
            />
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Total gevinst etter {holdeperiode} år
          </p>
        </div>
      </div>
    </div>
  );
}
