"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { Input } from "@/components/Input";
import { RiInformationLine } from "@remixicon/react";

export function MortgageCalculator() {
  // Input state
  const [kjopesum, setKjopesum] = useState(15000000);
  const [egenkapital, setEgenkapital] = useState(3000000);
  const [rentesats, setRentesats] = useState(5.5); // %
  const [nedbetalingstid, setNedbetalingstid] = useState(25); // years

  // Calculated values
  const [lanebelop, setLanebelop] = useState(0);
  const [manedligKostnad, setManedligKostnad] = useState(0);
  const [totalRentekostnad, setTotalRentekostnad] = useState(0);
  const [totalKostnad, setTotalKostnad] = useState(0);
  const [belaning, setBelaning] = useState(0);

  // Calculate on input change
  useEffect(() => {
    // Lånebeløp = Kjøpesum - Egenkapital
    const laneAmount = kjopesum - egenkapital;
    setLanebelop(laneAmount);

    if (laneAmount > 0 && rentesats > 0 && nedbetalingstid > 0) {
      // Månedlig rente
      const manedligRente = rentesats / 100 / 12;

      // Antall måneder
      const antallManeder = nedbetalingstid * 12;

      // Månedlig betaling (annuitetslån)
      // M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const manedlig =
        (laneAmount *
          (manedligRente * Math.pow(1 + manedligRente, antallManeder))) /
        (Math.pow(1 + manedligRente, antallManeder) - 1);
      setManedligKostnad(manedlig);

      // Total kostnad
      const totalCost = manedlig * antallManeder;
      setTotalKostnad(totalCost);

      // Total rentekostnad
      const totalRente = totalCost - laneAmount;
      setTotalRentekostnad(totalRente);

      // Belåningsgrad (LTV - Loan to Value)
      const ltv = (laneAmount / kjopesum) * 100;
      setBelaning(ltv);
    }
  }, [kjopesum, egenkapital, rentesats, nedbetalingstid]);

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

          {/* Egenkapital */}
          <div className="space-y-2">
            <label
              htmlFor="egenkapital"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Egenkapital (NOK)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Hvor mye skal du betale kontant?
                </div>
              </div>
            </label>
            <div className="relative">
              <Input
                id="egenkapital"
                type="text"
                value={formatCurrency(egenkapital)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  const numValue = parseInt(value) || 0;
                  setEgenkapital(numValue);
                }}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-warm-grey-2">
                kr
              </span>
            </div>
          </div>

          {/* Rentesats */}
          <div className="space-y-2">
            <label
              htmlFor="rentesats"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Rentesats (%)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Årlig rentesats på lånet
                </div>
              </div>
            </label>
            <div className="relative">
              <Input
                id="rentesats"
                type="number"
                step="0.1"
                value={rentesats}
                onChange={(e) => setRentesats(parseFloat(e.target.value) || 0)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-warm-grey-2">
                %
              </span>
            </div>
          </div>

          {/* Nedbetalingstid */}
          <div className="space-y-2">
            <label
              htmlFor="nedbetalingstid"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Nedbetalingstid (år)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Hvor mange år skal du betale ned lånet?
                </div>
              </div>
            </label>
            <div className="relative">
              <Input
                id="nedbetalingstid"
                type="number"
                step="1"
                min="1"
                value={nedbetalingstid}
                onChange={(e) =>
                  setNedbetalingstid(parseInt(e.target.value) || 1)
                }
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
        {/* Lånebeløp */}
        <div className="rounded-xl border border-light-blue/20 bg-gradient-to-br from-light-blue/5 to-transparent p-6 dark:border-light-blue/30 dark:from-light-blue/10">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Lånebeløp
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={lanebelop}
              format={{
                style: "currency",
                currency: "NOK",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }}
              locales="no-NO"
              className="text-4xl font-bold text-warm-grey dark:text-warm-white"
            />
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Kjøpesum minus egenkapital
          </p>
        </div>

        {/* Månedlig kostnad */}
        <div className="rounded-xl border border-light-blue/20 bg-gradient-to-br from-light-blue/5 to-transparent p-6 dark:border-light-blue/30 dark:from-light-blue/10">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Månedlig kostnad
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={manedligKostnad}
              format={{
                style: "currency",
                currency: "NOK",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }}
              locales="no-NO"
              className="text-4xl font-bold text-warm-grey dark:text-warm-white"
            />
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Månedlig avdrag og renter
          </p>
        </div>

        {/* Total rentekostnad */}
        <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6 dark:border-warm-white/10 dark:bg-warm-grey-2/20">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Total rentekostnad
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={totalRentekostnad}
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
            Total rente over {nedbetalingstid} år
          </p>
        </div>

        {/* Total kostnad */}
        <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6 dark:border-warm-white/10 dark:bg-warm-grey-2/20">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Total kostnad
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={totalKostnad}
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
            Lånebeløp + total rente
          </p>
        </div>

        {/* Belåningsgrad */}
        <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6 dark:border-warm-white/10 dark:bg-warm-grey-2/20">
          <div className="mb-2 text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
            Belåningsgrad (LTV)
          </div>
          <div className="flex items-baseline">
            <NumberFlow
              value={belaning}
              format={{
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }}
              className="text-3xl font-bold text-warm-grey dark:text-warm-white"
            />
            <span className="ml-2 text-xl font-semibold text-warm-grey-2 dark:text-warm-grey-1">
              %
            </span>
          </div>
          <p className="mt-2 text-xs text-warm-grey-2 dark:text-warm-grey-1">
            Lånebeløp i forhold til kjøpesum
          </p>
        </div>
      </div>
    </div>
  );
}
