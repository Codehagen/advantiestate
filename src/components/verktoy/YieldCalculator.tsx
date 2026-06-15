"use client";

import { useEffect, useState } from "react";
import NumberFlow, { type Format } from "@number-flow/react";
import { RiInformationLine } from "@remixicon/react";

import { YIELDS, type PropertyType } from "@/lib/verktoy/naringskalkulator";

/* ---------- domain constants (delt med naringskalkulator) ---------- */
const TYPES: PropertyType[] = [
  "Kontor",
  "Handel",
  "Lager / logistikk",
  "Kombinasjon",
];

const STORE = "advanti-yield-v2";

const fmtInt = new Intl.NumberFormat("no-NO", { maximumFractionDigits: 0 });
const intParse = (s: string): number | null => {
  const n = parseInt(s.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(n) ? null : n;
};
const decParse = (s: string): number | null => {
  const n = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return Number.isNaN(n) ? null : n;
};

/* ---------- small shared bits ---------- */
function Info({ children }: { children: React.ReactNode }) {
  return (
    <span className="group/info relative ml-1.5 inline-flex cursor-help text-warm-grey-2">
      <RiInformationLine className="size-[15px]" />
      <span className="pointer-events-none absolute bottom-[130%] left-1/2 z-10 w-56 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs font-normal leading-snug text-warm-white opacity-0 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] transition-opacity group-hover/info:opacity-100">
        {children}
      </span>
    </span>
  );
}

interface FieldProps {
  label: string;
  tip?: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  format?: (n: number) => string;
  parse?: (s: string) => number | null;
  scaleLeft: string;
  scaleRight: string;
  right?: React.ReactNode;
}

function Field({
  label,
  tip,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  format = (n) => fmtInt.format(n),
  parse = intParse,
  scaleLeft,
  scaleRight,
  right,
}: FieldProps) {
  // `draft` lets the user type freely; null means "show the formatted value".
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? format(value);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-2.5">
        <span className="flex items-center text-sm font-medium text-warm-grey">
          {label}
          {tip && <Info>{tip}</Info>}
        </span>
        <span className="flex items-baseline gap-1.5">
          <input
            inputMode="numeric"
            aria-label={`${label} (${unit})`}
            value={display}
            onFocus={() => setDraft(String(value))}
            onChange={(e) => {
              setDraft(e.target.value);
              const n = parse(e.target.value);
              if (n != null) onChange(Math.min(max, Math.max(min, n)));
            }}
            onBlur={() => setDraft(null)}
            style={{ width: display.length + 1 + "ch" }}
            className="min-w-[40px] border-none bg-transparent p-0 text-right text-base font-semibold text-warm-grey outline-none [appearance:textfield]"
          />
          <span className="text-[13px] font-medium text-warm-grey-2">
            {unit}
          </span>
          {right}
        </span>
      </div>
      <input
        type="range"
        className="yk-range mt-4"
        aria-label={`${label} (${unit})`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-2 flex justify-between text-[11.5px] text-warm-grey-2">
        <span>{scaleLeft}</span>
        <span>{scaleRight}</span>
      </div>
    </div>
  );
}

function Seg({
  mode,
  onMode,
}: {
  mode: "pct" | "kr";
  onMode: (m: "pct" | "kr") => void;
}) {
  return (
    <span className="ml-2 inline-flex gap-0.5 rounded-lg bg-warm-grey/[0.05] p-[3px]">
      {(["pct", "kr"] as const).map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          onClick={() => onMode(m)}
          className={
            "rounded-md px-2.5 py-[3px] text-xs font-semibold transition-colors " +
            (mode === m
              ? "bg-warm-white text-warm-grey shadow-[0_1px_2px_rgba(44,40,37,0.12)]"
              : "text-warm-grey-2")
          }
        >
          {m === "pct" ? "%" : "kr"}
        </button>
      ))}
    </span>
  );
}

interface StatProps {
  k: string;
  tip?: string;
  value: number;
  unit?: string;
  decimals?: number;
  hint?: string;
  currency?: boolean;
}

function Stat({ k, tip, value, unit, decimals = 1, hint, currency }: StatProps) {
  const format: Format = currency
    ? { style: "currency", currency: "NOK", maximumFractionDigits: 0 }
    : { minimumFractionDigits: decimals, maximumFractionDigits: decimals };
  return (
    <div className="rounded-xl border border-warm-grey-1/20 bg-warm-white p-5">
      <div className="flex items-center text-[13px] font-medium text-warm-grey-2">
        {k}
        {tip && <Info>{tip}</Info>}
      </div>
      <div className="mt-2.5 flex items-baseline gap-1">
        <NumberFlow
          className="text-[26px] font-bold tracking-tight text-warm-grey"
          value={value}
          format={format}
          locales="no-NO"
        />
        {unit && (
          <span className="text-sm font-semibold text-warm-grey-2">{unit}</span>
        )}
      </div>
      {hint && <div className="mt-2 text-xs text-warm-grey-2">{hint}</div>}
    </div>
  );
}

const cardBase = "rounded-xl border border-warm-grey-1/20 bg-warm-white";

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
      if (s.type && TYPES.includes(s.type)) setType(s.type);
      if (typeof s.leie === "number") setLeie(s.leie);
      if (typeof s.kjop === "number") setKjop(s.kjop);
      if (s.driftMode === "pct" || s.driftMode === "kr") setDriftMode(s.driftMode);
      if (typeof s.driftKr === "number") setDriftKr(s.driftKr);
      if (typeof s.driftPct === "number") setDriftPct(s.driftPct);
      if (typeof s.finOn === "boolean") setFinOn(s.finOn);
      if (typeof s.ltv === "number") setLtv(s.ltv);
      if (typeof s.rente === "number") setRente(s.rente);
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

  /* ---------- derived ---------- */
  const drift = driftMode === "pct" ? leie * (driftPct / 100) : driftKr;
  const noi = Math.max(0, leie - drift);
  const brutto = kjop > 0 ? (leie / kjop) * 100 : 0;
  const netto = kjop > 0 ? (noi / kjop) * 100 : 0;
  const manedlig = noi / 12;
  const payback = noi > 0 ? kjop / noi : 0;

  const lan = kjop * (ltv / 100);
  const egenkapital = kjop - lan;
  const renter = lan * (rente / 100);
  const cfEtter = noi - renter;
  const coc = egenkapital > 0 ? (cfEtter / egenkapital) * 100 : 0;

  const market = YIELDS[type] ?? 7.0;
  const diff = netto - market;
  const diffStr = Math.abs(diff).toFixed(2).replace(".", ",");

  const SMIN = 3;
  const SMAX = 10;
  const pos = (v: number) =>
    Math.min(100, Math.max(0, ((v - SMIN) / (SMAX - SMIN)) * 100));

  const opexShare = leie > 0 ? Math.min(100, (drift / leie) * 100) : 0;
  const noiShare = 100 - opexShare;

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

          <div className="mt-5 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => setType(t)}
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
        </div>
      </div>

      {/* explainer */}
      <div className="mt-6 flex flex-wrap gap-4">
        {[
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
