// Pure value-estimate logic for the næringskalkulator (commercial-property
// value estimate). No React, no DOM — so the math is unit-testable in isolation
// from the rendering component. The UI layer (NaringskalkulatorClient) only
// owns input state and formatting; every number it shows comes from here.

export const PROPERTY_TYPES = [
  "Kontor",
  "Handel",
  "Lager / logistikk",
  "Kombinasjon",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const CITIES = [
  "Bodø",
  "Tromsø",
  "Alta",
  "Mo i Rana",
  "Narvik",
  "Harstad",
] as const;
export type City = (typeof CITIES)[number];

// Indicative standard assumptions for Nord-Norge. These are NOT verified
// per-deal proof stats — they are tool defaults ("standardforutsetninger"),
// surfaced to the user as such. Keep them here, stamped, so they are trivial
// to revise (or later swap for a verified data source) in one place.
export const ASSUMPTIONS_UPDATED_AT = "2026-06";

// Prime-ish base yields by segment (%).
export const YIELDS: Record<PropertyType, number> = {
  Kontor: 6.75,
  Handel: 7.25,
  "Lager / logistikk": 7.25,
  Kombinasjon: 7.0,
};

// City adjustment in percentage points — liquid markets lower, peripheral higher.
export const CITY_ADJ: Record<City, number> = {
  Bodø: 0,
  Tromsø: -0.25,
  Alta: 0.25,
  "Mo i Rana": 0.5,
  Narvik: 0.5,
  Harstad: 0.25,
};

// Indicative market rent per m²/year by type — used by the "bruk et
// markedsanslag" helper to prefill gross rent from area.
export const RENT_RATE: Record<PropertyType, number> = {
  Kontor: 1600,
  Handel: 1800,
  "Lager / logistikk": 900,
  Kombinasjon: 1400,
};

// Yield band applied around the point estimate (±0.5 pp).
export const YIELD_RANGE_PP = 0.5;

export interface EstimateInputs {
  type: PropertyType;
  city: City;
  /** Lettable area, m² BTA. */
  area: number;
  /** Annual gross rent, kr/year. */
  grossRent: number;
  /** Vacancy as a percent value, e.g. 5 means 5%. */
  vacancyPct: number;
  /** Owner costs as a percent value, e.g. 10 means 10%. */
  opexPct: number;
}

export interface ValidEstimate {
  valid: true;
  appliedYield: number; // %
  noi: number; // kr/year
  value: number; // kr
  low: number; // kr
  high: number; // kr
  valuePerM2: number; // kr/m²
  grossYield: number; // %
}

export interface InvalidEstimate {
  valid: false;
}

export type EstimateResult = ValidEstimate | InvalidEstimate;

/**
 * Parse a Norwegian-formatted number string ("3 200 000", "1,5") into a finite
 * non-negative number, or null when the input is empty/garbage/negative.
 * Returns null rather than 0 so callers can tell "blank" from "zero".
 */
export function parseNorwegianNumber(input: string): number | null {
  const cleaned = input
    .replace(/\s/g, "")
    .replace(/ /g, "")
    .replace(",", ".");
  if (cleaned === "" || !/^\d*\.?\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function clampPct(pct: number): number {
  if (!Number.isFinite(pct)) return 0;
  // Clamp to [0, 100]. 100% lands on NOI = 0, which the `noi > 0` guard rejects
  // as an invalid (empty) result — never a negative value.
  return Math.min(100, Math.max(0, pct));
}

/**
 * Yield-based value estimate. value = NOI / yield, with NOI = gross net of
 * vacancy and owner costs. Returns { valid: false } for any input that would
 * produce a non-finite, zero, or negative result so the UI never renders
 * NaN / Infinity / a negative "value".
 */
export function computeEstimate(inputs: EstimateInputs): EstimateResult {
  const { type, city, area, grossRent } = inputs;
  const vacancy = clampPct(inputs.vacancyPct) / 100;
  const opex = clampPct(inputs.opexPct) / 100;

  const appliedYield = (YIELDS[type] ?? 7.0) + (CITY_ADJ[city] ?? 0);
  const noi = grossRent * (1 - vacancy) * (1 - opex);

  const lowYield = appliedYield + YIELD_RANGE_PP;
  const highYield = appliedYield - YIELD_RANGE_PP;

  // Guard every denominator and the result sign. highYield (the smaller yield
  // that produces the HIGH value) must stay positive too.
  if (
    !(area > 0) ||
    !(grossRent > 0) ||
    !(appliedYield > 0) ||
    !(highYield > 0) ||
    !(noi > 0)
  ) {
    return { valid: false };
  }

  const value = noi / (appliedYield / 100);
  const low = noi / (lowYield / 100);
  const high = noi / (highYield / 100);

  if (!Number.isFinite(value) || value <= 0) return { valid: false };

  return {
    valid: true,
    appliedYield,
    noi,
    value,
    low,
    high,
    valuePerM2: value / area,
    grossYield: (grossRent / value) * 100,
  };
}
