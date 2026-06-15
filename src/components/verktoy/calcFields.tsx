"use client";

// Shared v2 calculator primitives — used by YieldCalculator and
// ValuationYieldCalculator. Flat warm-white card idiom (Tailwind), draggable
// sliders (the .yk-range class lives in advanti-design.css), NumberFlow on the
// result numbers. Keep these generic; tool-specific constants stay in the
// consuming component.

import { useState } from "react";
import NumberFlow, { type Format } from "@number-flow/react";
import { RiInformationLine } from "@remixicon/react";

export const fmtInt = new Intl.NumberFormat("no-NO", { maximumFractionDigits: 0 });

/** Strip everything but digits → integer (or null on empty/garbage). */
export const intParse = (s: string): number | null => {
  const n = parseInt(s.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(n) ? null : n;
};

/** Norwegian decimal parse ("5,5" → 5.5). */
export const decParse = (s: string): number | null => {
  const n = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return Number.isNaN(n) ? null : n;
};

export const cardBase = "rounded-xl border border-warm-grey-1/20 bg-warm-white";

export function Info({ children }: { children: React.ReactNode }) {
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

export function Field({
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

export function Seg({
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

export function Stat({ k, tip, value, unit, decimals = 1, hint, currency }: StatProps) {
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

/** Property-type selector (the segment chips both calculators share). */
export function Chips<T extends string>({
  items,
  value,
  onPick,
}: {
  items: readonly T[];
  value: T;
  onPick: (t: T) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {items.map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={value === t}
          onClick={() => onPick(t)}
          className={
            "rounded-lg border px-3.5 py-2 text-[13.5px] font-medium transition-colors " +
            (value === t
              ? "border-warm-grey bg-warm-grey text-warm-white"
              : "border-warm-grey-1/20 text-warm-grey-3 hover:border-warm-grey-2")
          }
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/** "Slik fordeler leien seg" — opex vs NOI split bar + legend. */
export function BreakdownBar({
  opexShare,
  noiShare,
  drift,
  noi,
}: {
  opexShare: number;
  noiShare: number;
  drift: number;
  noi: number;
}) {
  return (
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
  );
}

/** Row of explainer cards under the calculator grid. */
export function ExplainerCards({
  items,
}: {
  items: { h: string; body: React.ReactNode }[];
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-4">
      {items.map((e) => (
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
  );
}
