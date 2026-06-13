"use client";

import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  CITIES,
  PROPERTY_TYPES,
  RENT_RATE,
  computeEstimate,
  parseNorwegianNumber,
  type City,
  type PropertyType,
} from "@/lib/verktoy/naringskalkulator";

const fmtInt = (n: number) => Math.round(n).toLocaleString("nb-NO");

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

  const result = useMemo(
    () =>
      computeEstimate({
        type,
        city,
        area: parseNorwegianNumber(areaStr) ?? 0,
        grossRent: parseNorwegianNumber(rentStr) ?? 0,
        vacancyPct: parseNorwegianNumber(vacancyStr) ?? 0,
        opexPct: parseNorwegianNumber(opexStr) ?? 0,
      }),
    [type, city, areaStr, rentStr, vacancyStr, opexStr],
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
              onChange={(e) => setAreaStr(e.target.value)}
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
              onChange={(e) => setRentStr(e.target.value)}
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
                onChange={(e) => setVacancyStr(e.target.value)}
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
                onChange={(e) => setOpexStr(e.target.value)}
              />
              <span className="suffix">%</span>
            </div>
          </div>
        </div>

        <p className="num-hint" style={{ marginTop: 4 }}>
          Eierkostnader dekker forvaltning, vedlikehold, forsikring og
          eiendomsskatt — typisk 8–12 % av brutto leie for godt drevne bygg.
        </p>
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
