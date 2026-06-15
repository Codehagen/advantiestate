"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NumberFlow from "@number-flow/react";

import { YIELDS, type PropertyType } from "@/lib/verktoy/naringskalkulator";
import { cardBase, decParse, Field, fmtInt, Seg, Stat } from "./calcFields";

/* ---------- domain constants (delt med naringskalkulator) ---------- */
const TYPES: PropertyType[] = [
  "Kontor",
  "Handel",
  "Lager / logistikk",
  "Kombinasjon",
];

const STORE = "advanti-pris-verdi-v2";

/** kr in millions, nb-NO, one decimal. */
const mill = (n: number) =>
  (n / 1e6).toLocaleString("no-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

export function ValuationYieldCalculator() {
  const [type, setType] = useState<PropertyType>("Kontor");
  const [leie, setLeie] = useState(1200000);
  const [driftMode, setDriftMode] = useState<"pct" | "kr">("pct");
  const [driftKr, setDriftKr] = useState(180000);
  const [driftPct, setDriftPct] = useState(15);
  const [ytelse, setYtelse] = useState(YIELDS["Kontor"]); // avkastningskrav (yield) %
  const [areal, setAreal] = useState(1000);

  // Hydrate from localStorage after mount (avoids SSR hydration mismatch).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || "{}");
      if (s.type && TYPES.includes(s.type)) setType(s.type);
      if (typeof s.leie === "number") setLeie(s.leie);
      if (s.driftMode === "pct" || s.driftMode === "kr") setDriftMode(s.driftMode);
      if (typeof s.driftKr === "number") setDriftKr(s.driftKr);
      if (typeof s.driftPct === "number") setDriftPct(s.driftPct);
      if (typeof s.ytelse === "number") setYtelse(s.ytelse);
      if (typeof s.areal === "number") setAreal(s.areal);
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORE,
      JSON.stringify({ type, leie, driftMode, driftKr, driftPct, ytelse, areal }),
    );
  }, [hydrated, type, leie, driftMode, driftKr, driftPct, ytelse, areal]);

  // Picking a property type resets the yield to that segment's market level —
  // a sensible starting point the user can then drag.
  function pickType(t: PropertyType) {
    setType(t);
    setYtelse(YIELDS[t] ?? 7.0);
  }

  /* ---------- derived ---------- */
  const drift = driftMode === "pct" ? leie * (driftPct / 100) : driftKr;
  const noi = Math.max(0, leie - drift);

  const verdi = ytelse > 0 ? noi / (ytelse / 100) : 0;
  const lowYield = ytelse + 0.5;
  const highYield = ytelse - 0.5;
  const low = lowYield > 0 ? noi / (lowYield / 100) : 0;
  const high = highYield > 0 ? noi / (highYield / 100) : verdi;
  const perM2 = areal > 0 ? verdi / areal : 0;
  const bruttoYield = verdi > 0 ? (leie / verdi) * 100 : 0;

  // Point estimate position within the [low, high] band.
  const dotPos =
    high > low ? Math.min(100, Math.max(0, ((verdi - low) / (high - low)) * 100)) : 50;

  const market = YIELDS[type] ?? 7.0;
  const opexShare = leie > 0 ? Math.min(100, (drift / leie) * 100) : 0;
  const noiShare = 100 - opexShare;

  // Prefill the verdivurdering funnel with what the user entered.
  const ctaHref = useMemo(() => {
    const params = new URLSearchParams({
      type,
      areal: String(Math.round(areal)),
      leie: String(Math.round(leie)),
    });
    return `/verdivurdering?${params.toString()}`;
  }, [type, areal, leie]);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        {/* ----- INPUTS ----- */}
        <div className={`${cardBase} p-6`}>
          <h2 className="text-xl font-semibold text-warm-grey">Legg inn verdier</h2>
          <p className="mt-1 text-[13.5px] text-warm-grey-2">
            Eiendomstype setter et typisk avkastningskrav — juster det selv og se
            verdien følge med.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => pickType(t)}
                className={
                  "rounded-lg border px-3.5 py-2 text-[13.5px] font-medium transition-colors " +
                  (type === t
                    ? "border-warm-grey bg-warm-grey text-warm-white"
                    : "border-warm-grey-1/20 text-warm-grey-3 hover:border-warm-grey-2")
                }
              >
                {t}
              </button>
            ))}
          </div>

          <Field
            label="Årlig leieinntekt"
            tip="Total brutto årlig leie før fradrag for driftskostnader."
            value={leie}
            onChange={setLeie}
            min={0}
            max={20000000}
            step={50000}
            unit="kr"
            scaleLeft="0"
            scaleRight="20 mill"
          />

          {driftMode === "pct" ? (
            <Field
              label="Driftskostnader"
              tip="Eierkostnader: forvaltning, vedlikehold, forsikring, eiendomsskatt m.m. Her som andel av leien."
              value={driftPct}
              onChange={setDriftPct}
              min={0}
              max={50}
              step={1}
              unit="%"
              format={(v) => String(v)}
              scaleLeft="0 %"
              scaleRight="50 %"
              right={<Seg mode={driftMode} onMode={setDriftMode} />}
            />
          ) : (
            <Field
              label="Driftskostnader"
              tip="Eierkostnader: forvaltning, vedlikehold, forsikring, eiendomsskatt m.m. Her i kroner per år."
              value={driftKr}
              onChange={setDriftKr}
              min={0}
              max={8000000}
              step={10000}
              unit="kr"
              scaleLeft="0"
              scaleRight="8 mill"
              right={<Seg mode={driftMode} onMode={setDriftMode} />}
            />
          )}

          <Field
            label="Avkastningskrav (yield)"
            tip="Yielden investorer krever for ditt segment. Lavere yield = høyere verdi. Vi viser et intervall på ±0,5 prosentpoeng rundt valget ditt."
            value={ytelse}
            onChange={setYtelse}
            min={3}
            max={10}
            step={0.05}
            unit="%"
            format={(v) => v.toFixed(2).replace(".", ",")}
            parse={decParse}
            scaleLeft="3 %"
            scaleRight="10 %"
          />

          <Field
            label="Utleibart areal"
            tip="Brukes kun til å vise verdi per m² — påvirker ikke selve verdiestimatet."
            value={areal}
            onChange={setAreal}
            min={0}
            max={20000}
            step={50}
            unit="m²"
            scaleLeft="0"
            scaleRight="20 000"
          />
        </div>

        {/* ----- RESULTS ----- */}
        <div className="flex flex-col gap-4">
          {/* hero: estimated value + range */}
          <div className="rounded-xl border border-light-blue/40 bg-light-blue/[0.16] p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-warm-grey-2">
                Estimert eiendomsverdi
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-light-blue-2 px-2.5 py-[5px] text-xs font-semibold text-warm-grey-3">
                yield {ytelse.toFixed(2).replace(".", ",")}%
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <NumberFlow
                className="text-[clamp(34px,5.5vw,48px)] font-bold leading-none tracking-tight text-warm-grey"
                value={verdi}
                format={{ style: "currency", currency: "NOK", maximumFractionDigits: 0 }}
                locales="no-NO"
              />
            </div>

            {/* range bar */}
            <div className="mt-6">
              <p className="text-[12.5px] text-warm-grey-2">
                Sannsynlig intervall:{" "}
                <b className="font-semibold text-warm-grey-3">
                  kr {mill(low)} – {mill(high)} mill.
                </b>
              </p>
              <div className="relative mt-3 h-1.5 rounded-full bg-warm-grey-1">
                <div
                  className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-warm-white bg-warm-grey shadow-[0_0_0_1px_var(--warm-grey-75)] transition-[left] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ left: dotPos + "%" }}
                />
              </div>
              <div className="mt-2.5 flex justify-between text-[11px] text-warm-grey-2">
                <span>kr {mill(low)} mill.</span>
                <span>kr {mill(high)} mill.</span>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-warm-grey-2">
                Verdien er <b className="font-semibold text-warm-grey-3">netto
                driftsinntekt delt på avkastningskravet</b>. Et avkastningskrav på{" "}
                {ytelse.toFixed(2).replace(".", ",")}% er typisk for{" "}
                {type.toLowerCase()} i Nord-Norge (marked ~
                {market.toFixed(2).replace(".", ",")}%).
              </p>
            </div>
          </div>

          {/* stat grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat
              k="Netto driftsinntekt"
              tip="Leie minus driftskostnader (NOI)."
              value={noi}
              currency
              hint="Leie − drift"
            />
            <Stat
              k="Brutto yield"
              tip="Leieinntekt delt på estimert verdi, før driftskostnader."
              value={bruttoYield}
              unit="%"
              decimals={2}
              hint="Før driftskostnader"
            />
            <Stat
              k="Verdi pr. m²"
              tip="Estimert verdi delt på utleibart areal."
              value={perM2}
              currency
              hint={areal > 0 ? `${fmtInt.format(areal)} m²` : "Sett areal"}
            />
          </div>

          {/* breakdown */}
          <div className={`${cardBase} px-6 py-[22px]`}>
            <span className="text-sm font-medium text-warm-grey-2">
              Slik fordeler leien seg
            </span>
            <div className="mt-3.5 flex h-9 overflow-hidden rounded-[9px] border border-warm-grey-1/20">
              <div
                className="flex min-w-[2px] items-center justify-center bg-warm-grey-1 text-xs font-semibold text-warm-grey-3 transition-[flex-basis] duration-[400ms] ease-out"
                style={{ flexBasis: opexShare + "%" }}
              >
                {opexShare > 12 ? Math.round(opexShare) + "%" : ""}
              </div>
              <div
                className="flex min-w-[2px] items-center justify-center bg-warm-grey text-xs font-semibold text-warm-white transition-[flex-basis] duration-[400ms] ease-out"
                style={{ flexBasis: noiShare + "%" }}
              >
                {noiShare > 12 ? Math.round(noiShare) + "%" : ""}
              </div>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-x-[22px] gap-y-2">
              <span className="flex items-center gap-2 text-[12.5px] text-warm-grey-3">
                <span className="size-[11px] rounded-[3px] bg-warm-grey-1" />
                Driftskostnader{" "}
                <b className="font-semibold text-warm-grey">
                  {fmtInt.format(Math.round(drift))} kr
                </b>
              </span>
              <span className="flex items-center gap-2 text-[12.5px] text-warm-grey-3">
                <span className="size-[11px] rounded-[3px] bg-warm-grey" />
                Netto driftsinntekt (NOI){" "}
                <b className="font-semibold text-warm-grey">
                  {fmtInt.format(Math.round(noi))} kr
                </b>
              </span>
            </div>
          </div>

          {/* bridge to a real verdivurdering, prefilled */}
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-warm-grey px-6 py-3 text-center text-sm font-medium text-warm-white transition-opacity hover:opacity-90"
          >
            Få en presis verdivurdering <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* explainer */}
      <div className="mt-6 flex flex-wrap gap-4">
        {[
          {
            h: "Yield-metoden",
            body: (
              <>
                <code className="font-semibold text-warm-grey-3">
                  Verdi = NOI ÷ Yield
                </code>
                . Netto driftsinntekt delt på avkastningskravet — den samme logikken
                meglere bruker i en verdivurdering.
              </>
            ),
          },
          {
            h: "Hvorfor et intervall",
            body: (
              <>
                Et halvt prosentpoeng endring i yield flytter verdien mye. Derfor viser
                vi et intervall på{" "}
                <code className="font-semibold text-warm-grey-3">±0,5 pp</code> rundt
                valget ditt.
              </>
            ),
          },
          {
            h: "Et estimat, ikke en fasit",
            body: (
              <>
                Tallet hviler på leien og yielden du oppgir. En presis verdivurdering
                tar i tillegg hensyn til kontrakter, beliggenhet og tilstand.
              </>
            ),
          },
        ].map((e) => (
          <div
            key={e.h}
            className="flex-1 basis-[200px] rounded-xl border border-warm-grey-1/20 bg-warm-white p-5"
          >
            <h4 className="text-sm font-semibold text-warm-grey">{e.h}</h4>
            <p className="mt-2 text-[12.5px] leading-relaxed text-warm-grey-2">
              {e.body}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
