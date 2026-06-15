// Pure financial math for the two yield calculators (YieldCalculator and
// ValuationYieldCalculator). No React, no DOM — so the money math is
// unit-testable in isolation from rendering, mirroring naringskalkulator.ts.
// The UI components own input state and formatting; every number they show
// comes from here.

import { YIELDS, type PropertyType } from "./naringskalkulator";

export type DriftMode = "pct" | "kr";

/** Clamp a number to [min, max]; returns min for non-finite input. */
export function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Owner costs in kr/year, from either a percent-of-rent or a kr amount. */
export function computeDrift(
  leie: number,
  driftMode: DriftMode,
  driftKr: number,
  driftPct: number,
): number {
  return driftMode === "pct" ? leie * (driftPct / 100) : driftKr;
}

/** Net operating income — never negative. */
export function computeNoi(leie: number, drift: number): number {
  return Math.max(0, leie - drift);
}

/** Drift as a share of gross rent, clamped to [0, 100]. */
export function opexSharePct(leie: number, drift: number): number {
  return leie > 0 ? Math.min(100, (drift / leie) * 100) : 0;
}

/** Prime-ish market yield for a segment (the calculators' benchmark). */
export function marketYield(type: PropertyType): number {
  return YIELDS[type] ?? 7.0;
}

/* ---------------- Yield calculator (yield from price + rent) ---------------- */

export interface YieldInputs {
  type: PropertyType;
  leie: number;
  kjop: number;
  driftMode: DriftMode;
  driftKr: number;
  driftPct: number;
  ltv: number;
  rente: number;
}

export interface YieldResult {
  drift: number;
  noi: number;
  brutto: number; // %
  netto: number; // %
  manedlig: number; // kr/month
  payback: number; // years
  lan: number; // kr
  egenkapital: number; // kr
  renter: number; // kr/year
  cfEtter: number; // kr/year
  coc: number; // % cash-on-cash
  market: number; // %
  diff: number; // pp (netto − market)
  opexShare: number; // %
  noiShare: number; // %
}

export function computeYield(inputs: YieldInputs): YieldResult {
  const { type, leie, kjop, driftMode, driftKr, driftPct, ltv, rente } = inputs;

  const drift = computeDrift(leie, driftMode, driftKr, driftPct);
  const noi = computeNoi(leie, drift);
  const brutto = kjop > 0 ? (leie / kjop) * 100 : 0;
  const netto = kjop > 0 ? (noi / kjop) * 100 : 0;
  const manedlig = noi / 12;
  const payback = noi > 0 ? kjop / noi : 0;

  const lan = kjop * (ltv / 100);
  const egenkapital = kjop - lan;
  const renter = lan * (rente / 100);
  const cfEtter = noi - renter;
  const coc = egenkapital > 0 ? (cfEtter / egenkapital) * 100 : 0;

  const market = marketYield(type);
  const diff = netto - market;
  const opexShare = opexSharePct(leie, drift);

  return {
    drift,
    noi,
    brutto,
    netto,
    manedlig,
    payback,
    lan,
    egenkapital,
    renter,
    cfEtter,
    coc,
    market,
    diff,
    opexShare,
    noiShare: 100 - opexShare,
  };
}

/* ------------- Valuation calculator (property value from yield) ------------- */

export interface ValuationInputs {
  type: PropertyType;
  leie: number;
  driftMode: DriftMode;
  driftKr: number;
  driftPct: number;
  /** avkastningskrav (yield), in percent, e.g. 6.75. */
  ytelse: number;
  /** lettable area in m²; only affects verdi pr. m². */
  areal: number;
}

export interface ValuationResult {
  drift: number;
  noi: number;
  verdi: number; // kr
  low: number; // kr (yield + 0.5pp)
  high: number; // kr (yield − 0.5pp)
  perM2: number; // kr/m²
  bruttoYield: number; // %
  market: number; // %
  opexShare: number; // %
  noiShare: number; // %
}

export function computeValuation(inputs: ValuationInputs): ValuationResult {
  const { type, leie, driftMode, driftKr, driftPct, ytelse, areal } = inputs;

  const drift = computeDrift(leie, driftMode, driftKr, driftPct);
  const noi = computeNoi(leie, drift);

  const verdi = ytelse > 0 ? noi / (ytelse / 100) : 0;
  const lowYield = ytelse + 0.5;
  const highYield = ytelse - 0.5;
  const low = lowYield > 0 ? noi / (lowYield / 100) : 0;
  const high = highYield > 0 ? noi / (highYield / 100) : verdi;
  const perM2 = areal > 0 ? verdi / areal : 0;
  const bruttoYield = verdi > 0 ? (leie / verdi) * 100 : 0;

  const market = marketYield(type);
  const opexShare = opexSharePct(leie, drift);

  return {
    drift,
    noi,
    verdi,
    low,
    high,
    perM2,
    bruttoYield,
    market,
    opexShare,
    noiShare: 100 - opexShare,
  };
}
