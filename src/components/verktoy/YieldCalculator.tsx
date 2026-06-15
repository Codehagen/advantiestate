"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

import { type PropertyType } from "@/lib/verktoy/naringskalkulator";
import { clamp, computeYield } from "@/lib/verktoy/yieldCalc";
import {
  BreakdownBar,
  cardBase,
  Chips,
  decParse,
  ExplainerCards,
  Field,
  Seg,
  Stat,
} from "./calcFields";

/* ---------- domain constants (delt med naringskalkulator) ---------- */
const TYPES: PropertyType[] = [
  "Kontor",
  "Handel",
  "Lager / logistikk",
  "Kombinasjon",
];

const STORE = "advanti-yield-v2";

export function YieldCalculator() {
  const [type, setType] = useState<PropertyType>("Kontor");
  const [leie, setLeie] = useState(1200000);
  const [kjop, setKjop] = useState(15000000);
  const [driftMode, setDriftMode] = useState<"pct" | "kr">("pct");
  const [driftKr, setDriftKr] = useState(180000);
  const [driftPct, setDriftPct] = useState(15);

  const [finOn, setFinOn] = useState(true);
  const [ltv, setLtv] = useState(70);
  const [rente, setRente] = useState(5.5);

  // Hydrate from localStorage after mount (avoids SSR hydration mismatch;
  // NumberFlow then rolls from the defaults to the saved values).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || "{}");
      // Clamp stored numbers to each field's range so a stale/edited value
      // can't render out of sync with its slider.
      if (s.type && TYPES.includes(s.type)) setType(s.type);
      if (typeof s.leie === "number") setLeie(clamp(s.leie, 0, 10000000));
      if (typeof s.kjop === "number") setKjop(clamp(s.kjop, 1000000, 150000000));
      if (s.driftMode === "pct" || s.driftMode === "kr") setDriftMode(s.driftMode);
      if (typeof s.driftKr === "number") setDriftKr(clamp(s.driftKr, 0, 5000000));
      if (typeof s.driftPct === "number") setDriftPct(clamp(s.driftPct, 0, 50));
      if (typeof s.finOn === "boolean") setFinOn(s.finOn);
      if (typeof s.ltv === "number") setLtv(clamp(s.ltv, 0, 85));
      if (typeof s.rente === "number") setRente(clamp(s.rente, 1, 10));
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORE,
      JSON.stringify({
        type,
        leie,
        kjop,
        driftMode,
        driftKr,
        driftPct,
        finOn,
        ltv,
        rente,
      }),
    );
  }, [hydrated, type, leie, kjop, driftMode, driftKr, driftPct, finOn, ltv, rente]);

  /* ---------- derived (pure math in lib/verktoy/yieldCalc) ---------- */
  const {
    drift,
    noi,
    brutto,
    netto,
    manedlig,
    payback,
    egenkapital,
    cfEtter,
    coc,
    market,
    diff,
    opexShare,
    noiShare,
  } = computeYield({ type, leie, kjop, driftMode, driftKr, driftPct, ltv, rente });
  const diffStr = Math.abs(diff).toFixed(2).replace(".", ",");

  // Benchmark-bar position (UI only): map a yield onto the 3–10% track.
  const SMIN = 3;
  const SMAX = 10;
  const pos = (v: number) =>
    Math.min(100, Math.max(0, ((v - SMIN) / (SMAX - SMIN)) * 100));

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        {/* ----- INPUTS ----- */}
        <div className={`${cardBase} p-6`}>
          <h2 className="text-xl font-semibold text-warm-grey">
            Legg inn verdier
          </h2>
          <p className="mt-1 text-[13.5px] text-warm-grey-2">
            Eiendomstype styrer markedsreferansen.
          </p>

          <Chips items={TYPES} value={type} onPick={setType} />

          <Field
            label="Årlig leieinntekt"
            tip="Total brutto årlig leie før fradrag for driftskostnader."
            value={leie}
            onChange={setLeie}
            min={0}
            max={10000000}
            step={50000}
            unit="kr"
            scaleLeft="0"
            scaleRight="10 mill"
          />

          <Field
            label="Kjøpesum"
            tip="Total kjøpesum / verdi for eiendommen."
            value={kjop}
            onChange={setKjop}
            min={1000000}
            max={150000000}
            step={100000}
            unit="kr"
            scaleLeft="1 mill"
            scaleRight="150 mill"
          />

          {driftMode === "pct" ? (
            <Field
              label="Driftskostnader"
              tip="Eierkostnader: vedlikehold, forsikring, eiendomsskatt m.m. Her som andel av leien."
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
              tip="Eierkostnader: vedlikehold, forsikring, eiendomsskatt m.m. Her i kroner per år."
              value={driftKr}
              onChange={setDriftKr}
              min={0}
              max={5000000}
              step={10000}
              unit="kr"
              scaleLeft="0"
              scaleRight="5 mill"
              right={<Seg mode={driftMode} onMode={setDriftMode} />}
            />
          )}

          {/* financing toggle */}
          <div className="mt-7 flex items-center justify-between gap-3.5 border-t border-warm-grey-1/20 pt-5">
            <span className="text-sm font-semibold text-warm-grey">
              Regn med belåning
              <small className="mt-0.5 block text-[12.5px] font-normal text-warm-grey-2">
                Se egenkapitalavkastning (cash-on-cash)
              </small>
            </span>
            <button
              type="button"
              aria-pressed={finOn}
              aria-label="Regn med belåning"
              onClick={() => setFinOn((v) => !v)}
              className={
                "relative h-[25px] w-11 flex-none rounded-full transition-colors " +
                (finOn ? "bg-warm-grey" : "bg-warm-grey-1") +
                " after:absolute after:left-[3px] after:top-[3px] after:size-[19px] after:rounded-full after:bg-white after:shadow-[0_1px_3px_rgba(0,0,0,0.25)] after:transition-transform" +
                (finOn ? " after:translate-x-[19px]" : "")
              }
            />
          </div>

          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: finOn ? 360 : 0,
              opacity: finOn ? 1 : 0,
              marginTop: finOn ? 4 : 0,
            }}
          >
            <Field
              label="Belåningsgrad (LTV)"
              tip="Andel av kjøpesummen finansiert med lån."
              value={ltv}
              onChange={setLtv}
              min={0}
              max={85}
              step={1}
              unit="%"
              format={(v) => String(v)}
              scaleLeft="0 %"
              scaleRight="85 %"
            />
            <Field
              label="Lånerente"
              tip="Nominell årlig rente på lånet (kun renter, ikke avdrag)."
              value={rente}
              onChange={setRente}
              min={1}
              max={10}
              step={0.1}
              unit="%"
              format={(v) => String(v).replace(".", ",")}
              parse={decParse}
              scaleLeft="1 %"
              scaleRight="10 %"
            />
          </div>
        </div>

        {/* ----- RESULTS ----- */}
        <div className="flex flex-col gap-4">
          {/* hero: netto yield + benchmark */}
          <div className="rounded-xl border border-light-blue/40 bg-light-blue/[0.16] p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-warm-grey-2">
                Netto yield
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-light-blue-2 px-2.5 py-[5px] text-xs font-semibold text-warm-grey-3">
                {diff >= 0 ? "▲" : "▼"} {diffStr} pp vs. marked
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <NumberFlow
                className="text-[clamp(40px,6vw,52px)] font-bold leading-none tracking-tight text-warm-grey"
                value={netto}
                format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                locales="no-NO"
              />
              <span className="text-[26px] font-semibold text-warm-grey-2">%</span>
            </div>

            {/* benchmark bar */}
            <div className="mt-6">
              <div className="relative mt-5 h-1.5 rounded-full bg-warm-grey-1">
                <div
                  className="absolute -top-1.5 h-[18px] w-0.5 rounded-sm bg-warm-grey-3"
                  style={{ left: pos(market) + "%" }}
                >
                  <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10.5px] font-semibold text-warm-grey-3">
                    Marked {market.toFixed(2).replace(".", ",")}%
                  </span>
                </div>
                <div
                  className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-warm-white bg-warm-grey shadow-[0_0_0_1px_var(--warm-grey-75)] transition-[left] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ left: pos(netto) + "%" }}
                />
              </div>
              <div className="mt-2.5 flex justify-between text-[11px] text-warm-grey-2">
                <span>3%</span>
                <span>5%</span>
                <span>7%</span>
                <span>10%</span>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-warm-grey-2">
                Din netto yield er{" "}
                <b className="font-semibold text-warm-grey-3">
                  {diffStr} prosentpoeng {diff >= 0 ? "høyere" : "lavere"}
                </b>{" "}
                enn typisk prime-yield for {type.toLowerCase()} i Nord-Norge (
                {market.toFixed(2).replace(".", ",")}%).
              </p>
            </div>
          </div>

          {/* stat grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat
              k="Brutto yield"
              tip="Leieinntekt delt på kjøpesum, før driftskostnader."
              value={brutto}
              unit="%"
              decimals={2}
              hint="Før driftskostnader"
            />
            <Stat
              k="Kontantstrøm / mnd"
              value={manedlig}
              currency
              hint="Netto driftsinntekt / 12"
            />
            <Stat
              k="Tilbakebetaling"
              value={payback}
              unit="år"
              decimals={1}
              hint="Uten belåning"
            />
          </div>

          {/* financing result */}
          {finOn && (
            <div className={`${cardBase} px-6 py-5`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-warm-grey-2">
                  Med belåning
                </span>
                <span className="text-[13.5px] text-warm-grey-2">
                  {ltv}% lån · {String(rente).replace(".", ",")}% rente
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-[18px] sm:grid-cols-2">
                <div className="col-span-full border-b border-warm-grey-1/20 pb-4">
                  <div className="text-[13px] font-medium text-warm-grey-2">
                    Egenkapitalavkastning (cash-on-cash)
                  </div>
                  <div className="mt-[7px] flex items-baseline gap-1">
                    <NumberFlow
                      className="text-[34px] font-bold tracking-tight text-warm-grey"
                      value={coc}
                      format={{
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }}
                      locales="no-NO"
                    />
                    <span className="text-[13px] font-semibold text-warm-grey-2">
                      %
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[13px] font-medium text-warm-grey-2">
                    Egenkapital
                  </div>
                  <div className="mt-[7px] flex items-baseline gap-1">
                    <NumberFlow
                      className="text-[22px] font-bold tracking-tight text-warm-grey"
                      value={egenkapital}
                      format={{
                        style: "currency",
                        currency: "NOK",
                        maximumFractionDigits: 0,
                      }}
                      locales="no-NO"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-[13px] font-medium text-warm-grey-2">
                    Kontantstrøm etter renter
                  </div>
                  <div className="mt-[7px] flex items-baseline gap-1">
                    <NumberFlow
                      className="text-[22px] font-bold tracking-tight text-warm-grey"
                      value={cfEtter}
                      format={{
                        style: "currency",
                        currency: "NOK",
                        maximumFractionDigits: 0,
                      }}
                      locales="no-NO"
                    />
                    <span className="text-[13px] font-semibold text-warm-grey-2">
                      /år
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* breakdown */}
          <BreakdownBar
            opexShare={opexShare}
            noiShare={noiShare}
            drift={drift}
            noi={noi}
          />
        </div>
      </div>

      {/* explainer */}
      <ExplainerCards
        items={[
          {
            h: "Brutto yield",
            body: (
              <>
                <code className="font-semibold text-warm-grey-3">
                  Leie ÷ Kjøpesum
                </code>
                . Avkastningen før driftskostnader — grei for raske
                sammenligninger.
              </>
            ),
          },
          {
            h: "Netto yield",
            body: (
              <>
                <code className="font-semibold text-warm-grey-3">
                  (Leie − Drift) ÷ Kjøpesum
                </code>
                . NOI delt på pris. Dette er tallet meglere og investorer faktisk
                prater om.
              </>
            ),
          },
          {
            h: "Cash-on-cash",
            body: (
              <>
                <code className="font-semibold text-warm-grey-3">
                  (NOI − Renter) ÷ Egenkapital
                </code>
                . Hva egenkapitalen din faktisk forrenter når lånet jobber for
                deg.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
