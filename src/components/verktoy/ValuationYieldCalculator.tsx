"use client";

import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  PROPERTY_TYPES,
  YIELDS,
  parseNorwegianNumber,
  type PropertyType,
} from "@/lib/verktoy/naringskalkulator";
import { computeValuation, type DriftMode } from "@/lib/verktoy/yieldCalc";

const fmtInt = (n: number) => Math.round(n).toLocaleString("nb-NO");

/** kr in millions, nb-NO, one decimal (e.g. "16,0"). */
const millOnly = (n: number) =>
  (n / 1e6).toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const num = (s: string) => parseNorwegianNumber(s) ?? 0;
const pct2 = (n: number) =>
  n.toLocaleString("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function ValuationYieldCalculator() {
  const [type, setType] = useState<PropertyType>("Kontor");
  const [leieStr, setLeieStr] = useState("1 200 000");
  const [driftMode, setDriftMode] = useState<DriftMode>("pct");
  const [driftPctStr, setDriftPctStr] = useState("15");
  const [driftKrStr, setDriftKrStr] = useState("180 000");
  const [ytelseStr, setYtelseStr] = useState(pct2(YIELDS["Kontor"]));
  const [arealStr, setArealStr] = useState("1 000");

  // Picking a property type resets the yield to that segment's market level.
  function pickType(t: PropertyType) {
    setType(t);
    setYtelseStr(pct2(YIELDS[t] ?? 7.0));
  }

  const r = useMemo(
    () =>
      computeValuation({
        type,
        leie: num(leieStr),
        driftMode,
        driftKr: num(driftKrStr),
        driftPct: num(driftPctStr),
        ytelse: num(ytelseStr),
        areal: num(arealStr),
      }),
    [type, leieStr, driftMode, driftKrStr, driftPctStr, ytelseStr, arealStr],
  );

  const valid = num(leieStr) > 0 && num(ytelseStr) > 0;

  // Point estimate position within the [low, high] band (UI only).
  const dotPos =
    r.high > r.low
      ? Math.min(100, Math.max(0, ((r.verdi - r.low) / (r.high - r.low)) * 100))
      : 50;

  const ctaHref = useMemo(() => {
    const params = new URLSearchParams({
      type,
      areal: String(Math.round(num(arealStr))),
      leie: String(Math.round(num(leieStr))),
    });
    return `/verdivurdering?${params.toString()}`;
  }, [type, arealStr, leieStr]);

  function blurThousands(s: string, set: (v: string) => void) {
    const n = parseNorwegianNumber(s);
    if (n != null) set(fmtInt(n));
  }

  const driftStr = driftMode === "pct" ? driftPctStr : driftKrStr;
  const setDriftStr = driftMode === "pct" ? setDriftPctStr : setDriftKrStr;

  return (
    <div className="calc-grid">
      {/* INPUTS */}
      <div className="calc-inputs">
        <div className="step-mark">01 — Eiendommen</div>

        <span className="calc-lbl" id="vy-lbl-type">
          Eiendomstype
        </span>
        <div className="vv-seg" role="radiogroup" aria-labelledby="vy-lbl-type">
          {PROPERTY_TYPES.map((t) => (
            <label key={t}>
              <input
                type="radio"
                name="vy-type"
                value={t}
                checked={type === t}
                onChange={() => pickType(t)}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>

        <div className="num-field">
          <label className="calc-lbl" htmlFor="vy-areal">
            Utleibart areal
          </label>
          <div className="num-wrap">
            <input
              id="vy-areal"
              type="text"
              inputMode="numeric"
              value={arealStr}
              onChange={(e) => setArealStr(e.target.value)}
              onBlur={() => blurThousands(arealStr, setArealStr)}
            />
            <span className="suffix">m²</span>
          </div>
          <p className="num-hint">Brukes kun til å vise verdi pr. m².</p>
        </div>

        <div className="step-mark">02 — Tall</div>

        <div className="num-field">
          <label className="calc-lbl" htmlFor="vy-leie">
            Årlig brutto leieinntekt
          </label>
          <div className="num-wrap">
            <input
              id="vy-leie"
              type="text"
              inputMode="numeric"
              value={leieStr}
              onChange={(e) => setLeieStr(e.target.value)}
              onBlur={() => blurThousands(leieStr, setLeieStr)}
            />
            <span className="suffix">kr / år</span>
          </div>
          <p className="num-hint">Total leie før fradrag for driftskostnader.</p>
        </div>

        <div className="num-field">
          <div className="num-field-top">
            <label
              className="calc-lbl"
              htmlFor="vy-drift"
              style={{ marginBottom: 0 }}
            >
              Driftskostnader
            </label>
            <span
              className="unit-seg"
              role="group"
              aria-label="Enhet for driftskostnader"
            >
              <button
                type="button"
                aria-pressed={driftMode === "pct"}
                onClick={() => setDriftMode("pct")}
              >
                %
              </button>
              <button
                type="button"
                aria-pressed={driftMode === "kr"}
                onClick={() => setDriftMode("kr")}
              >
                kr
              </button>
            </span>
          </div>
          <div className="num-wrap" style={{ marginTop: 12 }}>
            <input
              id="vy-drift"
              type="text"
              inputMode="numeric"
              value={driftStr}
              onChange={(e) => setDriftStr(e.target.value)}
              onBlur={() => {
                if (driftMode === "kr") blurThousands(driftKrStr, setDriftKrStr);
              }}
            />
            <span className="suffix">
              {driftMode === "pct" ? "% av leie" : "kr / år"}
            </span>
          </div>
        </div>

        <div className="num-field">
          <label className="calc-lbl" htmlFor="vy-ytelse">
            Avkastningskrav (yield)
          </label>
          <div className="num-wrap">
            <input
              id="vy-ytelse"
              type="text"
              inputMode="numeric"
              value={ytelseStr}
              onChange={(e) => setYtelseStr(e.target.value)}
              onBlur={() => setYtelseStr(pct2(num(ytelseStr)))}
            />
            <span className="suffix">%</span>
          </div>
          <p className="num-hint">
            Yielden investorer krever for ditt segment — lavere yield gir høyere
            verdi. Marked for {type.toLowerCase()}: ~{pct2(r.market)} %.
          </p>
        </div>
      </div>

      {/* RESULT */}
      <div className="calc-result">
        <div className="r-lbl">Estimert markedsverdi</div>

        {valid ? (
          <>
            <div className="r-value">
              <NumberFlow
                value={r.verdi / 1e6}
                locales="nb-NO"
                format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
                prefix="kr "
                suffix={" mill."}
              />
            </div>
            <div className="r-range">
              Sannsynlig intervall:{" "}
              <strong>
                kr {millOnly(r.low)} – {millOnly(r.high)} mill.
              </strong>
            </div>

            <div className="range-bar">
              <div className="fill" />
              <div className="dot" style={{ left: dotPos + "%" }} />
            </div>
            <div className="range-ends">
              <span>{millOnly(r.low)} mill.</span>
              <span>{millOnly(r.high)} mill.</span>
            </div>

            <div className="r-stats">
              <div className="r-stat">
                <div className="k">Netto driftsinntekt</div>
                <div className="v">
                  <NumberFlow
                    value={r.noi / 1e6}
                    locales="nb-NO"
                    format={{
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }}
                    prefix="kr "
                    suffix=" mill."
                  />
                </div>
              </div>
              <div className="r-stat">
                <div className="k">Anvendt yield</div>
                <div className="v">
                  <NumberFlow
                    value={num(ytelseStr)}
                    locales="nb-NO"
                    format={{
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                  />
                  <span className="u">%</span>
                </div>
              </div>
              <div className="r-stat">
                <div className="k">Verdi pr. m²</div>
                <div className="v">
                  <NumberFlow
                    value={Math.round(r.perM2)}
                    locales="nb-NO"
                    format={{ maximumFractionDigits: 0 }}
                  />
                  <span className="u">kr</span>
                </div>
              </div>
              <div className="r-stat">
                <div className="k">Brutto yield</div>
                <div className="v">
                  <NumberFlow
                    value={r.bruttoYield}
                    locales="nb-NO"
                    format={{
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }}
                  />
                  <span className="u">%</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="r-value">—</div>
            <div className="r-range">Fyll inn leie og avkastningskrav</div>
            <div className="range-bar">
              <div className="fill" />
              <div className="dot" />
            </div>
            <div className="r-stats">
              <div className="r-stat">
                <div className="k">Netto driftsinntekt</div>
                <div className="v">—</div>
              </div>
              <div className="r-stat">
                <div className="k">Anvendt yield</div>
                <div className="v">—</div>
              </div>
              <div className="r-stat">
                <div className="k">Verdi pr. m²</div>
                <div className="v">—</div>
              </div>
              <div className="r-stat">
                <div className="k">Brutto yield</div>
                <div className="v">—</div>
              </div>
            </div>
          </>
        )}

        <Link className="r-cta" href={ctaHref}>
          Få en presis verdivurdering <span className="arrow">→</span>
        </Link>
        <p className="r-foot">
          Et veiledende estimat — ikke en formell verdivurdering. En partner kan
          gi deg et presist tall basert på kontrakter, beliggenhet og tilstand.
        </p>
      </div>
    </div>
  );
}
