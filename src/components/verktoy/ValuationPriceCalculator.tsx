"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { Input } from "@/components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { RiInformationLine } from "@remixicon/react";

export function ValuationPriceCalculator() {
  // Input state
  const [areal, setAreal] = useState(1000);
  const [kompleksitet, setKompleksitet] = useState<"standard" | "middels" | "høy">("standard");
  const [formål, setFormål] = useState<"enkel" | "standard" | "omfattende">("standard");
  const [hastverk, setHastverk] = useState(false);

  // Calculated values
  const [estimertPris, setEstimertPris] = useState(0);
  const [prisRange, setPrisRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  // Base prices
  const basePrices = {
    enkel: { min: 15000, max: 30000 },
    standard: { min: 30000, max: 60000 },
    omfattende: { min: 60000, max: 150000 },
  };

  // Complexity multipliers
  const complexityMultipliers = {
    standard: 1.0,
    middels: 1.3,
    høy: 1.6,
  };

  // Area multipliers (for larger properties)
  const getAreaMultiplier = (area: number) => {
    if (area < 500) return 0.8;
    if (area < 1000) return 1.0;
    if (area < 2000) return 1.2;
    if (area < 5000) return 1.5;
    return 2.0;
  };

  // Calculate on input change
  useEffect(() => {
    const base = basePrices[formål];
    const complexityMult = complexityMultipliers[kompleksitet];
    const areaMult = getAreaMultiplier(areal);
    const rushMult = hastverk ? 1.3 : 1.0;

    const minPrice = Math.round(base.min * complexityMult * areaMult * rushMult);
    const maxPrice = Math.round(base.max * complexityMult * areaMult * rushMult);
    const avgPrice = Math.round((minPrice + maxPrice) / 2);

    setEstimertPris(avgPrice);
    setPrisRange({ min: minPrice, max: maxPrice });
  }, [areal, kompleksitet, formål, hastverk]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("no-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Input Section */}
      <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-6 dark:border-warm-grey-2/20 dark:border-warm-white/10 dark:bg-warm-grey-2/20">
        <h2 className="mb-6 text-xl font-semibold text-warm-grey dark:text-warm-white">
          Legg inn verdier
        </h2>

        <div className="space-y-6">
          {/* Areal */}
          <div className="space-y-2">
            <label
              htmlFor="areal"
              className="flex items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Areal (m²)
              <div className="group relative ml-2">
                <RiInformationLine className="size-4 text-warm-grey-2 dark:text-warm-grey-1" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs text-warm-white shadow-lg group-hover:block dark:bg-warm-white dark:text-warm-grey">
                  Total bruksareal for eiendommen
                </div>
              </div>
            </label>
            <Input
              id="areal"
              type="number"
              min="0"
              value={areal}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setAreal(value);
              }}
            />
          </div>

          {/* Kompleksitet */}
          <div className="space-y-2">
            <label
              htmlFor="kompleksitet"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Kompleksitet
            </label>
            <Select value={kompleksitet} onValueChange={(value: "standard" | "middels" | "høy") => setKompleksitet(value)}>
              <SelectTrigger id="kompleksitet">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (enkel struktur)</SelectItem>
                <SelectItem value="middels">Middels (flere bygninger/blandet bruk)</SelectItem>
                <SelectItem value="høy">Høy (spesielle karakteristikker)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-warm-grey-2 dark:text-warm-grey-1">
              Standard: En enkel bygning med én bruk. Middels: Flere bygninger eller blandet bruk.
              Høy: Spesielle karakteristikker som krever ekstra analyse.
            </p>
          </div>

          {/* Formål */}
          <div className="space-y-2">
            <label
              htmlFor="formål"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Formål med verdsettelsen
            </label>
            <Select
              value={formål}
              onValueChange={(value: "enkel" | "standard" | "omfattende") => setFormål(value)}
            >
              <SelectTrigger id="formål">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enkel">Enkel (rask indikasjon)</SelectItem>
                <SelectItem value="standard">Standard (salg/kjøp/finansiering)</SelectItem>
                <SelectItem value="omfattende">Omfattende (juridisk/strategisk)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-warm-grey-2 dark:text-warm-grey-1">
              Enkel: Rask indikasjon. Standard: For salg, kjøp eller finansiering. Omfattende: For
              juridiske formål eller strategisk planlegging.
            </p>
          </div>

          {/* Hastverk */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              <input
                type="checkbox"
                checked={hastverk}
                onChange={(e) => setHastverk(e.target.checked)}
                className="rounded border-warm-grey-2"
              />
              Hastverk (leveranse innen 48 timer)
            </label>
            <p className="text-xs text-warm-grey-2 dark:text-warm-grey-1">
              Hastverk kan øke prisen med 20-50% på grunn av prioritering og kortere tidsramme.
            </p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="rounded-xl border border-warm-grey-1/20 bg-gradient-to-br from-light-blue/10 to-warm-white p-6 dark:border-warm-white/10 dark:from-light-blue/5 dark:to-warm-grey-2/20">
        <h2 className="mb-6 text-xl font-semibold text-warm-grey dark:text-warm-white">
          Estimat
        </h2>

        <div className="space-y-6">
          {/* Estimert pris */}
          <div className="rounded-lg bg-warm-white p-4 ring-1 ring-warm-grey/10 dark:bg-warm-grey dark:ring-warm-white/10">
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">Estimert pris</p>
            <p className="mt-1 text-3xl font-bold text-warm-grey dark:text-warm-white">
              <NumberFlow value={estimertPris} format={(v) => formatCurrency(v) + " kr"} />
            </p>
          </div>

          {/* Prisrange */}
          <div className="rounded-lg bg-warm-white p-4 ring-1 ring-warm-grey/10 dark:bg-warm-grey dark:ring-warm-white/10">
            <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">Prisrange</p>
            <p className="mt-1 text-lg font-semibold text-warm-grey dark:text-warm-white">
              {formatCurrency(prisRange.min)} - {formatCurrency(prisRange.max)} kr
            </p>
          </div>

          {/* Info box */}
          <div className="rounded-lg bg-light-blue/20 p-4 dark:bg-light-blue/10">
            <p className="text-sm text-warm-grey dark:text-warm-white">
              <strong>Viktig:</strong> Dette er et estimat basert på generelle priser. Faktisk pris
              kan variere basert på spesifikke forhold, lokasjon og detaljer i din situasjon.
            </p>
          </div>

          {/* What's included */}
          <div className="space-y-2">
            <h3 className="font-semibold text-warm-grey dark:text-warm-white">
              Hva inkluderes typisk:
            </h3>
            <ul className="space-y-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {formål === "enkel" && (
                <>
                  <li>• Grunnleggende markedsanalyse</li>
                  <li>• Sammenligning med lignende eiendommer</li>
                  <li>• Enkel beregning av verdi</li>
                  <li>• Kort rapport (5-10 sider)</li>
                </>
              )}
              {formål === "standard" && (
                <>
                  <li>• Omfattende markedsanalyse</li>
                  <li>• Sammenligning med lignende eiendommer</li>
                  <li>• Inntektsmetode (yield eller DCF)</li>
                  <li>• Detaljert rapport (15-25 sider)</li>
                  <li>• Anbefalinger for verdimaksimering</li>
                </>
              )}
              {formål === "omfattende" && (
                <>
                  <li>• Omfattende markedsanalyse</li>
                  <li>• Flere verdsettelsesmetoder</li>
                  <li>• Detaljert DCF-analyse</li>
                  <li>• Sensitivitetsanalyse</li>
                  <li>• Omfattende rapport (30-50+ sider)</li>
                  <li>• Anbefalinger og strategi</li>
                  <li>• Oppfølging og konsultasjon</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
