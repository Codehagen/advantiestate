"use client";

import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CITIES,
  PROPERTY_TYPES,
  RENT_RATE,
  computeEstimate,
  marketYield,
  parseNorwegianNumber,
  type City,
  type PropertyType,
} from "@/lib/verktoy/naringskalkulator";

const fmtInt = (n: number) => Math.round(n).toLocaleString("nb-NO");

/** Format a yield value in nb-NO, up to two decimals (e.g. "6,75", "7,9"). */
const fmtYield = (n: number) =>
  n.toLocaleString("nb-NO", { maximumFractionDigits: 2 });

/** Which yield the user is entering. Value math is always driven by net. */
type YieldMode = "net" | "gross";

/** Format a kr amount in millions, nb-NO, one decimal (e.g. "40,5"). */
function millOnly(n: number) {
  return (n / 1e6).toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function NaringskalkulatorClient() {
  const [type, setType] = useState<PropertyType>("Kontor");
  const [city, setCity] = useState<City>("Bodø");
  // Numeric fields kept as strings so we can show nb-NO thousands and tolerate
  // partial input; parsed via parseNorwegianNumber for the actual math.
  const [areaStr, setAreaStr] = useState("2 000");
  const [rentStr, setRentStr] = useState("3 200 000");
  const [vacancyStr, setVacancyStr] = useState("5");
  const [opexStr, setOpexStr] = useState("10");

  // Yield is editable via a single field with a Netto/Brutto toggle. The field
  // text is its own state (so partial input like "6," is tolerated); the value
  // math is always driven by the NET yield. `yieldEdited` tracks whether the
  // user has overridden the market default — while false the field follows the
  // market assumption for the current type/city/mode.
  const [yieldMode, setYieldMode] = useState<YieldMode>("net");
  const [yieldStr, setYieldStr] = useState(() =>
    fmtYield(marketYield("Kontor", "Bodø")),
  );
  const [yieldEdited, setYieldEdited] = useState(false);

  // While typing in a numeric field we update results instantly (no roll) and
  // only let NumberFlow animate once typing settles (~350ms after last change).
  // Vacancy/opex have no onBlur, so the debounce reset is the only signal back.
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

  // Market net yield for the current segment/city, and the net→gross factor:
  // gross = net / ((1 − vacancy)(1 − opex)). Used to convert between the two
  // toggle modes and to back-solve a typed gross yield into the net yield.
  const marketNet = marketYield(type, city);
  const factor = useMemo(() => {
    const vac = Math.min(100, Math.max(0, parseNorwegianNumber(vacancyStr) ?? 0));
    const opx = Math.min(100, Math.max(0, parseNorwegianNumber(opexStr) ?? 0));
    return (1 - vac / 100) * (1 - opx / 100);
  }, [vacancyStr, opexStr]);

  // While the user hasn't overridden the yield, keep the field showing the
  // market default for the current type/city/mode (gross default tracks the
  // vacancy/opex factor). Once edited, the field is left alone.
  useEffect(() => {
    if (yieldEdited) return;
    const def = yieldMode === "gross" && factor > 0 ? marketNet / factor : marketNet;
    setYieldStr(fmtYield(def));
  }, [marketNet, factor, yieldMode, yieldEdited]);

  // Net yield override passed to the estimate — only when the user has actually
  // adjusted it. Unedited input uses the exact market default (avoids the tiny
  // rounding drift a back-converted, 2-decimal gross display would introduce).
  const yieldOverride = useMemo(() => {
    if (!yieldEdited) return undefined;
    const n = parseNorwegianNumber(yieldStr);
    if (n == null || n <= 0) return undefined;
    return yieldMode === "gross" ? n * factor : n;
  }, [yieldEdited, yieldStr, yieldMode, factor]);

  function changeYieldMode(next: YieldMode) {
    if (next === yieldMode) return;
    // Converting preserves the underlying net yield exactly, so the valuation
    // doesn't move on toggle — only which number the field shows.
    if (yieldEdited && factor > 0) {
      const cur = parseNorwegianNumber(yieldStr);
      if (cur != null && cur > 0) {
        setYieldStr(fmtYield(next === "gross" ? cur / factor : cur * factor));
      }
    }
    setYieldMode(next);
  }

  function resetYield() {
    setYieldEdited(false);
    const def = yieldMode === "gross" && factor > 0 ? marketNet / factor : marketNet;
    setYieldStr(fmtYield(def));
  }

  const result = useMemo(
    () =>
      computeEstimate({
        type,
        city,
        area: parseNorwegianNumber(areaStr) ?? 0,
        grossRent: parseNorwegianNumber(rentStr) ?? 0,
        vacancyPct: parseNorwegianNumber(vacancyStr) ?? 0,
        opexPct: parseNorwegianNumber(opexStr) ?? 0,
        yieldOverride,
      }),
    [type, city, areaStr, rentStr, vacancyStr, opexStr, yieldOverride],
  );

  const rentRate = RENT_RATE[type];

  function useMarketRent() {
    const area = parseNorwegianNumber(areaStr);
    if (area && area > 0) setRentStr(fmtInt(area * rentRate));
  }

  function formatThousands(value: string, set: (v: string) => void) {
    const n = parseNorwegianNumber(value);
    if (n && n > 0) set(fmtInt(n));
  }

  // Prefill params carried into the verdivurdering funnel.
  const ctaHref = useMemo(() => {
    const params = new URLSearchParams({
      type,
      by: city,
      areal: String(Math.round(parseNorwegianNumber(areaStr) ?? 0)),
      leie: String(Math.round(parseNorwegianNumber(rentStr) ?? 0)),
    });
    return `/verdivurdering?${params.toString()}`;
  }, [type, city, areaStr, rentStr]);

  return (
    <div className="calc-grid">
      {/* INPUTS */}
      <div className="calc-inputs">
        <div className="step-mark">01 — Eiendommen</div>

        <span className="calc-lbl" id="lbl-type">
          Eiendomstype
        </span>
        <div className="vv-seg" role="radiogroup" aria-labelledby="lbl-type">
          {PROPERTY_TYPES.map((t) => (
            <label key={t}>
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>

        <span className="calc-lbl" id="lbl-by">
          By / marked
        </span>
        <div className="vv-seg" role="radiogroup" aria-labelledby="lbl-by">
          {CITIES.map((c) => (
            <label key={c}>
              <input
                type="radio"
                name="by"
                value={c}
                checked={city === c}
                onChange={() => setCity(c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>

        <div className="num-field">
          <label className="calc-lbl" htmlFor="in-areal">
            Utleibart areal
          </label>
          <div className="num-wrap">
            <input
              id="in-areal"
              type="text"
              inputMode="numeric"
              value={areaStr}
              onChange={(e) => {
                setAreaStr(e.target.value);
                markEditing();
              }}
              onBlur={() => formatThousands(areaStr, setAreaStr)}
            />
            <span className="suffix">m² BTA</span>
          </div>
        </div>

        <div className="step-mark">02 — Leieinntekter</div>

        <div className="num-field">
          <label className="calc-lbl" htmlFor="in-leie">
            Årlig brutto leieinntekt
          </label>
          <div className="num-wrap">
            <input
              id="in-leie"
              type="text"
              inputMode="numeric"
              value={rentStr}
              onChange={(e) => {
                setRentStr(e.target.value);
                markEditing();
              }}
              onBlur={() => formatThousands(rentStr, setRentStr)}
            />
            <span className="suffix">kr / år</span>
          </div>
          <p className="num-hint">
            Vet du ikke leien?{" "}
            <button type="button" onClick={useMarketRent}>
              Bruk et markedsanslag
            </button>{" "}
            basert på areal og type ({fmtInt(rentRate)} kr/m²).
          </p>
        </div>

        <div className="calc-two">
          <div className="num-field">
            <label className="calc-lbl" htmlFor="in-ledighet">
              Ledighet
            </label>
            <div className="num-wrap">
              <input
                id="in-ledighet"
                type="text"
                inputMode="numeric"
                value={vacancyStr}
                onChange={(e) => {
                  setVacancyStr(e.target.value);
                  markEditing();
                }}
              />
              <span className="suffix">%</span>
            </div>
          </div>
          <div className="num-field">
            <label className="calc-lbl" htmlFor="in-opex">
              Eierkostnader
            </label>
            <div className="num-wrap">
              <input
                id="in-opex"
                type="text"
                inputMode="numeric"
                value={opexStr}
                onChange={(e) => {
                  setOpexStr(e.target.value);
                  markEditing();
                }}
              />
              <span className="suffix">%</span>
            </div>
          </div>
        </div>

        <p className="num-hint" style={{ marginTop: 4 }}>
          Eierkostnader dekker forvaltning, vedlikehold, forsikring og
          eiendomsskatt — typisk 8–12 % av brutto leie for godt drevne bygg.
        </p>

        <div className="step-mark">03 — Yield</div>

        <div className="num-field">
          <div className="num-field-top">
            <label
              className="calc-lbl"
              htmlFor="in-yield"
              style={{ marginBottom: 0 }}
            >
              Avkastningskrav (yield)
            </label>
            <span
              className="unit-seg"
              role="group"
              aria-label="Netto eller brutto yield"
            >
              <button
                type="button"
                aria-pressed={yieldMode === "net"}
                onClick={() => changeYieldMode("net")}
              >
                Netto
              </button>
              <button
                type="button"
                aria-pressed={yieldMode === "gross"}
                onClick={() => changeYieldMode("gross")}
              >
                Brutto
              </button>
            </span>
          </div>
          <div className="num-wrap" style={{ marginTop: 12 }}>
            <input
              id="in-yield"
              type="text"
              inputMode="decimal"
              value={yieldStr}
              onChange={(e) => {
                setYieldStr(e.target.value);
                setYieldEdited(true);
                markEditing();
              }}
              onBlur={() => {
                const n = parseNorwegianNumber(yieldStr);
                if (n != null) setYieldStr(fmtYield(n));
              }}
            />
            <span className="suffix">
              % {yieldMode === "net" ? "netto" : "brutto"}
            </span>
          </div>
          <p className="num-hint">
            {yieldEdited ? (
              <>
                Justert. Markedsanslag for {type.toLowerCase()} i {city} er{" "}
                {fmtYield(marketNet)} % netto.{" "}
                <button type="button" onClick={resetYield}>
                  Tilbakestill
                </button>
              </>
            ) : (
              <>
                Markedsanslag for {type.toLowerCase()} i {city} (
                {fmtYield(marketNet)} % netto). Juster om du kjenner yielden for
                eiendommen.
              </>
            )}
          </p>
        </div>
      </div>

      {/* RESULT */}
      <div className="calc-result">
        <div className="r-lbl">Estimert markedsverdi</div>

        {result.valid ? (
          <>
            <div className="r-value">
              <NumberFlow
                value={Number(millOnly(result.value).replace(",", "."))}
                locales="nb-NO"
                format={{
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }}
                prefix="kr "
                suffix=" mill."
                animated={!isEditing}
              />
            </div>
            <div className="r-range">
              Sannsynlig intervall:{" "}
              <strong>
                kr {millOnly(result.low)} – {millOnly(result.high)} mill.
              </strong>
            </div>

            <div className="range-bar">
              <div className="fill" />
              <div className="dot" />
            </div>
            <div className="range-ends">
              <span>{millOnly(result.low)} mill.</span>
              <span>{millOnly(result.high)} mill.</span>
            </div>

            <div className="r-stats">
              <div className="r-stat">
                <div className="k">Netto leieinntekt</div>
                <div className="v">
                  <NumberFlow
                    value={Number(millOnly(result.noi).replace(",", "."))}
                    locales="nb-NO"
                    format={{
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }}
                    prefix="kr "
                    suffix=" mill."
                    animated={!isEditing}
                  />
                </div>
              </div>
              <div className="r-stat">
                <div className="k">Anvendt yield</div>
                <div className="v">
                  <NumberFlow
                    value={result.appliedYield}
                    locales="nb-NO"
                    format={{
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                    animated={!isEditing}
                  />
                  <span className="u">%</span>
                </div>
              </div>
              <div className="r-stat">
                <div className="k">Verdi pr. m²</div>
                <div className="v">
                  <NumberFlow
                    value={Math.round(result.valuePerM2)}
                    locales="nb-NO"
                    format={{ maximumFractionDigits: 0 }}
                    animated={!isEditing}
                  />
                  <span className="u">kr</span>
                </div>
              </div>
              <div className="r-stat">
                <div className="k">Brutto yield</div>
                <div className="v">
                  <NumberFlow
                    value={result.grossYield}
                    locales="nb-NO"
                    format={{
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }}
                    animated={!isEditing}
                  />
                  <span className="u">%</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="r-value">—</div>
            <div className="r-range">Fyll inn leie og areal</div>
            <div className="range-bar">
              <div className="fill" />
              <div className="dot" />
            </div>
            <div className="r-stats">
              <div className="r-stat">
                <div className="k">Netto leieinntekt</div>
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
