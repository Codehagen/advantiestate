import { constructMetadata } from "@/lib/utils";
import { SubHero } from "@/components/site/SubHero";
import { CtaStrip } from "@/components/site/CtaStrip";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";

export const metadata = constructMetadata({
  title: "Verdivurdering av Næringseiendom | Advanti",
  description:
    "Trenger du verdivurdering av næringseiendom? Advanti tilbyr profesjonelle analyser og verdivurderinger i Nord-Norge for et solid beslutningsgrunnlag.",
});

export default function VerdivurderingPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Tjenester", url: "/tjenester" },
          { name: "Verdivurdering", url: "/tjenester/verdivurdering" },
        ]}
      />
      <StructuredData
        type="service"
        data={{
          name: "Verdivurdering av Næringseiendom",
          description:
            "Profesjonell verdivurdering og analyse av næringseiendom i Nord-Norge.",
        }}
      />

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Tjenester", href: "/tjenester" },
          { label: "Verdivurdering" },
        ]}
        eyebrow="Tjeneste 01 · Verdivurdering"
        title={
          <>
            Verdivurdering <br />
            <span className="italic">av næringseiendom.</span>
          </>
        }
        lede="Grundige verdivurderinger basert på markedsanalyse, DCF og sammenlignbare transaksjoner — et solid beslutningsgrunnlag for investering, finansiering, regnskap og strategi."
        actions={[
          { label: "Bestill verdivurdering", href: "/kontakt" },
          { label: "Vår metode", href: "#metode", variant: "outline" },
        ]}
        metaRow={[
          { value: "DCF", label: "Kontantstrøm-modell" },
          { value: "Yield", label: "Markedsavkastning" },
          { value: "±2 %", label: "Typisk avvik vs. transaksjon" },
        ]}
        photo={{
          src: "/building/pexels-abshky-18567185.jpg",
          alt: "Næringsbygg under verdivurdering",
        }}
      />

      {/* VURDERINGSTYPER */}
      <section className="section section-divider">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Tjenester</span>
            <div>
              <h2>
                Solid grunnlag for <br />
                <span className="italic">dine beslutninger.</span>
              </h2>
              <p>
                Vi tilbyr tre hovedtyper verdivurdering. Hver leveres som en
                skriftlig rapport med metodikk, forutsetninger, sensitivitet og
                konklusjon — klar til bruk mot bank, revisor eller styre.
              </p>
            </div>
          </div>

          <div className="method-grid">
            <div className="method">
              <div className="pre">01 · Type</div>
              <h3>Markedsverdivurdering</h3>
              <p>
                Grundig vurdering basert på sammenlignbare transaksjoner,
                markedsanalyse og eiendomsspesifikke forhold. Standardrapporten
                for eiere som vurderer salg eller refinansiering.
              </p>
              <div className="meta">
                <span>3–4 uker</span>
                <span>Skriftlig rapport</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">02 · Type</div>
              <h3>Investeringsanalyse</h3>
              <p>
                Detaljert analyse av avkastning, kontantstrøm og verdiutvikling
                over tid. Til bruk for investorer som vurderer akkvisisjon,
                eller eiere som vil forstå hold-vs-sell.
              </p>
              <div className="meta">
                <span>2–3 uker</span>
                <span>Modell + rapport</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">03 · Type</div>
              <h3>Sensitivitetsanalyse</h3>
              <p>
                Hvordan endringer i leienivå, ledighet, yield og rentekostnad
                slår ut på verdien. Vi viser hvor robust eller skjør verdien er
                — og hva som faktisk driver tallet.
              </p>
              <div className="meta">
                <span>1–2 uker</span>
                <span>Scenariomatrise</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">04 · Type</div>
              <h3>Porteføljeverdsettelse</h3>
              <p>
                Konsistent vurdering av hele eiendomsporteføljen i én rapport —
                enten for IFRS-formål, oppgjør eller intern oppfølging av
                verdiutvikling kvartal for kvartal.
              </p>
              <div className="meta">
                <span>4–8 uker</span>
                <span>Eiendom for eiendom</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METODE */}
      <section
        className="section"
        id="metode"
        style={{
          background: "var(--accent-faint)",
          borderTop: "var(--hairline)",
          borderBottom: "var(--hairline)",
        }}
      >
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">02 — Metode</span>
            <div>
              <h2>
                Metoder for <br />
                <span className="italic">presis verdivurdering.</span>
              </h2>
              <p>
                Advanti benytter anerkjente metoder for verdivurdering av
                næringseiendom — i kombinasjon, og avstemt mot reelle
                transaksjoner i markedet.
              </p>
            </div>
          </div>

          <div className="tc">
            <div>
              <h4>Diskontert kontantstrøm (DCF)</h4>
              <p>
                Vi prognoserer kontantstrømmen til eiendommen i et 10-års
                perspektiv og diskonterer tilbake til nåverdi med et
                avkastningskrav som reflekterer reell risiko i markedet.
              </p>
              <p>
                Modellen tar høyde for leienivå, indeksregulering, ledighet,
                drifts­kostnader, vedlikehold og en terminalverdi som typisk
                utgjør 50–70 % av total verdi.
              </p>
            </div>
            <div>
              <h4>Yield-betraktning</h4>
              <p>
                Vi avstemmer DCF mot prime yield i sammenlignbare segmenter og
                beliggenheter — basert på vår transaksjonsdatabase med +1 400
                eiendommer i Nord-Norge.
              </p>
              <p>
                Yield-betraktningen er en kvalitetssjekk: stemmer DCF-verdien
                overens med hva markedet faktisk er villig til å betale per krone
                netto leieinntekt? Hvis ikke — hvorfor?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HVORFOR ADVANTI */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">03 — Hvorfor Advanti</span>
            <div>
              <h2>
                Pålitelige og{" "}
                <span className="italic">profesjonelle vurderinger.</span>
              </h2>
              <p>
                Vår erfaring og metodikk sikrer at du får objektive og grundige
                verdivurderinger du kan stole på — og som tåler kritisk
                gjennomgang fra bank, revisor og kontraparter.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Lokal markedskunnskap</h3>
              <p>
                Bred erfaring og dyp kunnskap om det nordnorske markedet gir
                verdivurderinger som speiler reelle prismekanismer — ikke
                generelle antakelser.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Grundig analyse</h3>
              <p>
                Omfattende analyser med tydelig metodikk og forutsetninger. Vi
                dokumenterer hvert valg, slik at andre kan etterprøve
                resultatet.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Uavhengig rådgivning</h3>
              <p>
                Som uavhengige rådgivere sikrer vi objektive vurderinger uten
                interessekonflikter. Vår eneste lojalitet er mot oppdragsgiver
                og tallene.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="coverage">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">04 — Dekning</span>
            <div>
              <h2>
                Verdivurdering med{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  lokal presisjon.
                </span>
              </h2>
              <p>
                Vi leverer verdivurderinger basert på lokale markedsdata og
                erfaring i byene vi dekker — ingen ekstern reise, ingen
                forsinkelser.
              </p>
            </div>
          </div>

          <div className="cities">
            <div className="city">
              <div className="pn">01</div>
              <h3>Bodø</h3>
              <p>Hovedkontor. Kontor, handel, logistikk.</p>
            </div>
            <div className="city">
              <div className="pn">02</div>
              <h3>Tromsø</h3>
              <p>Største kontormarkedet i landsdelen.</p>
            </div>
            <div className="city">
              <div className="pn">03</div>
              <h3>Alta</h3>
              <p>Lokalkontor. Handel og næring i Finnmark.</p>
            </div>
            <div className="city">
              <div className="pn">04</div>
              <h3>Mo i Rana</h3>
              <p>Industri- og logistikkbygg.</p>
            </div>
            <div className="city">
              <div className="pn">05</div>
              <h3>Narvik</h3>
              <p>Transport, lager og næringspark.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Behov for verdivurdering?"
        title={
          <>
            Bestill en{" "}
            <span className="italic">profesjonell vurdering.</span>
          </>
        }
        sub="Ta kontakt med Advanti for en samtale om hvordan vi kan bistå med verdivurdering av din næringseiendom — innen 24 timer."
        primary={{
          label: "Kontakt oss om verdivurdering",
          href: "/kontakt",
        }}
        secondary={{ label: "Se alle våre tjenester", href: "/tjenester" }}
      />
    </>
  );
}
