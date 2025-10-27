"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { Input } from "@/components/Input";
import { RiInformationLine } from "@remixicon/react";

export function YieldCalculator() {
  // Input state
  const [arligLeieinntekt, setArligLeieinntekt] = useState(1200000);
  const [kjopesum, setKjopesum] = useState(15000000);
  const [driftskostnader, setDriftskostnader] = useState(180000);

  // Calculated values
  const [bruttoYield, setBruttoYield] = useState(0);
  const [nettoYield, setNettoYield] = useState(0);
  const [manedligKontantStrom, setManedligKontantStrom] = useState(0);
  const [paybackPeriod, setPaybackPeriod] = useState(0);

  // Calculate on input change
  useEffect(() => {
    if (kjopesum > 0) {
      // Brutto yield = (Årlig leieinntekt / Kjøpesum) * 100
      const brutto = (arligLeieinntekt / kjopesum) * 100;
      setBruttoYield(brutto);

      // Netto yield = ((Årlig leieinntekt - Driftskostnader) / Kjøpesum) * 100
      const netto = ((arligLeieinntekt - driftskostnader) / kjopesum) * 100;
      setNettoYield(netto);

      // Månedlig kontantstrøm = (Årlig leieinntekt - Driftskostnader) / 12
      const manedlig = (arligLeieinntekt - driftskostnader) / 12;
      setManedligKontantStrom(manedlig);

      // Payback period = Kjøpesum / (Årlig leieinntekt - Driftskostnader)
      const nettoInntekt = arligLeieinntekt - driftskostnader;
      const payback = nettoInntekt > 0 ? kjopesum / nettoInntekt : 0;
      setPaybackPeriod(payback);
    }
  }, [arligLeieinntekt, kjopesum, driftskostnader]);

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
                  Total årlig leieinntekt før fradrag for driftskostnader
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

          {/* Kjøpesum */}
          <div className="space-y-2">
            <label
              htmlFor="kjopesum"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Kjøpesum (NOK)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Total kjøpesum for eiendommen
                </div>
              </div>
            </label>
            <div className="relative">
              <Input
                id="kjopesum"
                type="text"
                value={formatCurrency(kjopesum)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  const numValue = parseInt(value) || 0;
                  setKjopesum(numValue);
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
                  Inkluderer vedlikehold, forsikring, eiendomsskatt, etc.
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
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {/* Brutto Yield */}
        <div className="rounded-xl border border-light-blue/20 bg-gradient-to-br from-light-blue/5 to-transparent p-6 dark:border-light-blue/30 dark:from-light-blue/10">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Brutto Yield
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={bruttoYield}
              format={{
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }}
              className="text-4xl font-bold text-warm-grey dark:text-warm-white"
            />
            <span className="ml-2 text-2xl font-semibold text-warm-grey-2 dark:text-warm-grey-1">
              %
            </span>
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Avkastning før driftskostnader
          </p>
        </div>

        {/* Netto Yield */}
        <div className="rounded-xl border border-light-blue/20 bg-gradient-to-br from-light-blue/5 to-transparent p-6 dark:border-light-blue/30 dark:from-light-blue/10">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Netto Yield
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={nettoYield}
              format={{
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }}
              className="text-4xl font-bold text-warm-grey dark:text-warm-white"
            />
            <span className="ml-2 text-2xl font-semibold text-warm-grey-2 dark:text-warm-grey-1">
              %
            </span>
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Avkastning etter driftskostnader
          </p>
        </div>

        {/* Månedlig kontantstrøm */}
        <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6 dark:border-warm-white/10 dark:bg-warm-grey-2/20">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Månedlig kontantstrøm
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={manedligKontantStrom}
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
            Netto inntekt per måned
          </p>
        </div>

        {/* Payback Period */}
        <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6 dark:border-warm-white/10 dark:bg-warm-grey-2/20">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Tilbakebetalingstid
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={paybackPeriod}
              format={{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
              className="text-3xl font-bold text-warm-grey dark:text-warm-white"
            />
            <span className="ml-2 text-xl font-semibold text-warm-grey-2 dark:text-warm-grey-1">
              år
            </span>
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Tid til investeringen er tilbakebetalt
          </p>
        </div>
      </div>
    </div>
  );
}
