"use client";

import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  PROPERTY_TYPES,
  parseNorwegianNumber,
  type PropertyType,
} from "@/lib/verktoy/naringskalkulator";
import { clamp, computeYield, type DriftMode } from "@/lib/verktoy/yieldCalc";

const fmtInt = (n: number) => Math.round(n).toLocaleString("nb-NO");

/** kr X,X mill. for ≥ 1 mill, else kr N — mirrors the prototype. */
const fmtMoney = (n: number) =>
  Math.abs(n) >= 1e6
    ? "kr " +
      (n / 1e6).toLocaleString("nb-NO", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }) +
      " mill."
    : "kr " + fmtInt(n);

const num = (s: string) => parseNorwegianNumber(s) ?? 0;

// Hoisted formatters — built once instead of constructing a transient
// Intl.NumberFormat on every call (pct2 runs for diff/netto/brutto/market/payback
// on each render). Output is identical to the previous toLocaleString calls.
const _PCT1 = new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const _PCT2 = new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const pct1 = (n: number) => _PCT1.format(n);
const pct2 = (n: number) => _PCT2.format(n);

// Benchmark track runs 3 %–10 %; position the market mark + result dot on it.
const SMIN = 3;
const SMAX = 10;
const pos = (v: number) =>
  Math.min(100, Math.max(0, ((v - SMIN) / (SMAX - SMIN)) * 100));

export function YieldCalculatorV2() {
  const [type, setType] = useState<PropertyType>("Kontor");
  const [leieStr, setLeieStr] = useState("1 200 000");
  const [kjopStr, setKjopStr] = useState("15 000 000");
  const [driftMode, setDriftMode] = useState<DriftMode>("pct");
  const [driftPctStr, setDriftPctStr] = useState("15");
  const [driftKrStr, setDriftKrStr] = useState("180 000");
  const [finOn, setFinOn] = useState(true);
  const [ltvStr, setLtvStr] = useState("70");
  const [renteStr, setRenteStr] = useState("5,5");

  // While typing in a numeric field we update results instantly (no roll) and
  // only let NumberFlow animate once typing settles (~350ms after last change).
  const [isEditing, setIsEditing] = useState(false);
  const editTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markEditing = () => {
    setIsEditing(true);
    if (editTimer.current) clearTimeout(editTimer.current);
    editTimer.current = setTimeout(() => setIsEditing(false), 350);
  };
  useEffect(() => {
    return () => {
      if (editTimer.current) clearTimeout(editTimer.current);
    };
  }, []);

  // Clamp the free-text finance fields so impossible input (e.g. LTV > 100,
  // which would make egenkapital negative) can't drive the result card into
  // nonsensical territory. Display uses the clamped values too.
  const ltv = clamp(num(ltvStr), 0, 95);
  const rente = clamp(num(renteStr), 0, 30);
  const driftPct = clamp(num(driftPctStr), 0, 60);

  const r = useMemo(
    () =>
      computeYield({
        type,
        leie: num(leieStr),
        kjop: num(kjopStr),
        driftMode,
        driftKr: num(driftKrStr),
        driftPct,
        ltv,
        rente,
      }),
    [type, leieStr, kjopStr, driftMode, driftKrStr, driftPct, ltv, rente],
  );

  const ctaHref = useMemo(() => {
    const params = new URLSearchParams({
      type,
      leie: String(Math.round(num(leieStr))),
      kjop: String(Math.round(num(kjopStr))),
    });
    return `/verdivurdering?${params.toString()}`;
  }, [type, leieStr, kjopStr]);

  function blurThousands(s: string, set: (v: string) => void) {
    const n = parseNorwegianNumber(s);
    if (n != null) set(fmtInt(n));
  }

  const driftStr = driftMode === "pct" ? driftPctStr : driftKrStr;
  const setDriftStr = driftMode === "pct" ? setDriftPctStr : setDriftKrStr;

  return (
    <>
      <div className="calc-grid">
        {/* INPUTS */}
        <div className="calc-inputs">
        <div className="step-mark">01 — Eiendommen</div>

        <span className="calc-lbl" id="yk-lbl-type">
          Eiendomstype
        </span>
        <div className="vv-seg" role="radiogroup" aria-labelledby="yk-lbl-type">
          {PROPERTY_TYPES.map((t) => (
            <label key={t}>
              <input
                type="radio"
                name="yk-type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>

        <div className="step-mark">02 — Tall</div>

        <div className="num-field">
          <label className="calc-lbl" htmlFor="yk-leie">
            Årlig brutto leieinntekt
          </label>
          <div className="num-wrap">
            <input
              id="yk-leie"
              type="text"
              inputMode="numeric"
              value={leieStr}
              onChange={(e) => {
                setLeieStr(e.target.value);
                markEditing();
              }}
              onBlur={() => blurThousands(leieStr, setLeieStr)}
            />
            <span className="suffix">kr / år</span>
          </div>
          <p className="num-hint">Total leie før fradrag for driftskostnader.</p>
        </div>

        <div className="num-field">
          <label className="calc-lbl" htmlFor="yk-kjop">
            Kjøpesum / verdi
          </label>
          <div className="num-wrap">
            <input
              id="yk-kjop"
              type="text"
              inputMode="numeric"
              value={kjopStr}
              onChange={(e) => {
                setKjopStr(e.target.value);
                markEditing();
              }}
              onBlur={() => blurThousands(kjopStr, setKjopStr)}
            />
            <span className="suffix">kr</span>
          </div>
          <p className="num-hint">Total kjøpesum eller antatt markedsverdi.</p>
        </div>

        <div className="num-field">
          <div className="num-field-top">
            <label
              className="calc-lbl"
              htmlFor="yk-drift"
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
              id="yk-drift"
              type="text"
              inputMode="numeric"
              value={driftStr}
              onChange={(e) => {
                setDriftStr(e.target.value);
                markEditing();
              }}
              onBlur={() => {
                if (driftMode === "kr") blurThousands(driftKrStr, setDriftKrStr);
              }}
            />
            <span className="suffix">
              {driftMode === "pct" ? "% av leie" : "kr / år"}
            </span>
          </div>
          <p className="num-hint">
            Eierkostnader: forvaltning, vedlikehold, forsikring og eiendomsskatt
            — typisk 10–18 % av leien.
          </p>
        </div>

        <div className="step-mark">03 — Finansiering</div>

        <div className="fin-switch">
          <span className="txt">
            <span className="t">Regn med belåning</span>
            <span className="s">Se egenkapitalavkastning (cash-on-cash)</span>
          </span>
          <button
            type="button"
            className="switch"
            aria-pressed={finOn}
            aria-label="Regn med belåning"
            onClick={() => setFinOn((v) => !v)}
          />
        </div>

        {finOn && (
          <div className="fin-body">
            <div className="calc-two">
              <div className="num-field">
                <label className="calc-lbl" htmlFor="yk-ltv">
                  Belåningsgrad (LTV)
                </label>
                <div className="num-wrap">
                  <input
                    id="yk-ltv"
                    type="text"
                    inputMode="numeric"
                    value={ltvStr}
                    onChange={(e) => {
                      setLtvStr(e.target.value);
                      markEditing();
                    }}
                  />
                  <span className="suffix">%</span>
                </div>
              </div>
              <div className="num-field">
                <label className="calc-lbl" htmlFor="yk-rente">
                  Lånerente
                </label>
                <div className="num-wrap">
                  <input
                    id="yk-rente"
                    type="text"
                    inputMode="numeric"
                    value={renteStr}
                    onChange={(e) => {
                      setRenteStr(e.target.value);
                      markEditing();
                    }}
                    onBlur={() => setRenteStr(pct1(num(renteStr)))}
                  />
                  <span className="suffix">%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RESULT */}
      <div className="calc-result yk-result">
        <div className="r-lbl">
          <span>Netto yield</span>
          <span className={"r-pill" + (r.diff < 0 ? " neg" : "")}>
            {(r.diff >= 0 ? "▲ " : "▼ ") + pct2(Math.abs(r.diff))} pp vs. marked
          </span>
        </div>
        <div className="r-value">
          <NumberFlow
            value={r.netto}
            locales="nb-NO"
            format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
            animated={!isEditing}
          />
          <span className="u">%</span>
        </div>

        <div className="bench">
          <div className="bench-track">
            <div className="bench-mark" style={{ left: pos(r.market) + "%" }}>
              <span className="cap">Marked {pct2(r.market)} %</span>
            </div>
            <div className="bench-dot" style={{ left: pos(r.netto) + "%" }} />
          </div>
          <div className="bench-scale">
            <span>3 %</span>
            <span>5 %</span>
            <span>7 %</span>
            <span>10 %</span>
          </div>
          <p className="bench-note">
            Din netto yield er{" "}
            <strong>
              {pct2(Math.abs(r.diff))} pp {r.diff >= 0 ? "høyere" : "lavere"}
            </strong>{" "}
            enn typisk prime-yield for {type.toLowerCase()} i Nord-Norge (
            {pct2(r.market)} %).
          </p>
        </div>

        <div className="r-stats">
          <div className="r-stat">
            <div className="k">Brutto yield</div>
            <div className="v">
              <NumberFlow
                value={r.brutto}
                locales="nb-NO"
                format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                animated={!isEditing}
              />
              <span className="u">%</span>
            </div>
            <div className="hint">Før driftskostnader</div>
          </div>
          <div className="r-stat">
            <div className="k">Netto driftsinntekt</div>
            <div className="v">{fmtMoney(r.noi)}</div>
            <div className="hint">NOI per år</div>
          </div>
          <div className="r-stat">
            <div className="k">Kontantstrøm / mnd</div>
            <div className="v">{fmtMoney(r.manedlig)}</div>
            <div className="hint">NOI / 12</div>
          </div>
          <div className="r-stat">
            <div className="k">Tilbakebetaling</div>
            <div className="v">
              {r.payback > 0 ? (
                <>
                  <NumberFlow
                    value={r.payback}
                    locales="nb-NO"
                    format={{
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }}
                    animated={!isEditing}
                  />
                  <span className="u">år</span>
                </>
              ) : (
                "—"
              )}
            </div>
            <div className="hint">Uten belåning</div>
          </div>
        </div>

        {finOn && (
          <div className="r-fin">
            <div className="r-fin-head">
              <span className="lbl">Med belåning</span>
              <span className="params">
                {fmtInt(ltv)} % lån · {pct1(rente)} % rente
              </span>
            </div>
            <div className="coc-lbl">Egenkapitalavkastning (cash-on-cash)</div>
            <div className="coc">
              <span className="nf">{pct1(r.coc)}</span>
              <span className="u">%</span>
            </div>
            <div className="fin-rows">
              <div className="fin-cell">
                <div className="k">Egenkapital</div>
                <div className="v">{fmtMoney(r.egenkapital)}</div>
              </div>
              <div className="fin-cell">
                <div className="k">Kontantstrøm etter renter</div>
                <div className="v">
                  {fmtMoney(r.cfEtter)}
                  <span className="u">/år</span>
                </div>
              </div>
            </div>
          </div>
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

      {/* BREAKDOWN */}
      <div className="yk-break">
        <div className="bk-head">
          <h3>
            Slik fordeler <span className="italic">leien seg.</span>
          </h3>
          <p>
            Driftskostnader trekkes fra brutto leie. Det som står igjen er netto
            driftsinntekt — tallet yielden regnes av.
          </p>
        </div>
        <div>
          <div className="bk-bar">
            <div
              className="bk-seg opex"
              style={{ flexBasis: r.opexShare + "%" }}
            >
              {r.opexShare > 14 ? Math.round(r.opexShare) + " %" : ""}
            </div>
            <div className="bk-seg noi" style={{ flexBasis: r.noiShare + "%" }}>
              {r.noiShare > 14 ? Math.round(r.noiShare) + " %" : ""}
            </div>
          </div>
          <div className="bk-legend">
            <span className="bk-leg">
              Driftskostnader<span className="vv">{fmtMoney(r.drift)}</span>
            </span>
            <span className="bk-leg">
              Netto driftsinntekt (NOI)
              <span className="vv">{fmtMoney(r.noi)}</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
