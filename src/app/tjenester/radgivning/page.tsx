import { constructMetadata } from "@/lib/utils";
import { SubHero } from "@/components/site/SubHero";
import { CtaStrip } from "@/components/site/CtaStrip";
import { PhotoBand } from "@/components/site/PhotoBand";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";

export const metadata = constructMetadata({
  title: "Markedsdata og Rådgivning Næringseiendom | Advanti",
  description:
    "Advanti leverer markedsdata og kvantitativ rådgivning for næringseiendom i Nord-Norge. Egne databaser, kvartalsvise markedsrapporter og datatilgang via API.",
});

export default function RadgivningPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Tjenester", url: "/tjenester" },
          { name: "Markedsdata og rådgivning", url: "/tjenester/radgivning" },
        ]}
      />
      <StructuredData
        type="service"
        data={{
          name: "Markedsdata og Rådgivning Næringseiendom",
          description:
            "Markedsdata, kvantitativ analyse og rådgivning for næringseiendom i Nord-Norge.",
        }}
      />

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Tjenester", href: "/tjenester" },
          { label: "Markedsdata og rådgivning" },
        ]}
        eyebrow="Tjeneste 05 · Marked"
        title={
          <>
            Markedsdata <span className="italic">og rådgivning.</span>
          </>
        }
        lede="Egne databaser, kvantitativ analyse og en dedikert analyseavdeling som leverer faktagrunnlaget — så du kan ta beslutninger basert på data, ikke magefølelse."
        actions={[
          { label: "Få markedsrapport", href: "/kontakt" },
          {
            label: "Våre leveranser",
            href: "#leveranser",
            variant: "outline",
          },
        ]}
        metaRow={[
          { value: "1 400+", label: "Eiendommer sporet" },
          { value: "Kvartalsvis", label: "Markedsrapport" },
          { value: "Egne API", label: "Datatilgang for kunder" },
        ]}
        photo={{
          src: "/building/pexels-abshky-18567185.jpg",
          alt: "Markedsdata for næringseiendom",
        }}
      />

      {/* LEVERANSER */}
      <section className="section section-divider" id="leveranser">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Leveranser</span>
            <div>
              <h2>
                Fra rådata <span className="italic">til strategi.</span>
              </h2>
              <p>
                Vår analyseavdeling samler, systematiserer og tolker
                eiendomsdata fra hele landsdelen. Vi gjør det andre overser —
                slik at du får svar du kan handle på.
              </p>
            </div>
          </div>

          <div className="method-grid">
            <div className="method">
              <div className="pre">01 · Leveranse</div>
              <h3>Kvartalsvis markedsrapport</h3>
              <p>
                Yield, leienivå, ledighet og transaksjonsvolum per segment og by
                — en gjennomsiktig oversikt over hvor markedet faktisk står.
              </p>
              <div className="meta">
                <span>Hvert kvartal</span>
                <span>PDF + datasett</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">02 · Leveranse</div>
              <h3>Skreddersydd analyse</h3>
              <p>
                Spesifikke analyser for en eiendom, et segment eller en
                lokasjon. Vi kombinerer relevante data fra databasen og setter
                dem i kontekst.
              </p>
              <div className="meta">
                <span>1–3 uker</span>
                <span>Rapport + dialog</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">03 · Leveranse</div>
              <h3>Datasett og API</h3>
              <p>
                Direkte tilgang til vår transaksjons- og leiebase via
                lett-strukturerte datasett eller API — for kunder med egne
                analysemiljøer.
              </p>
              <div className="meta">
                <span>Abonnement</span>
                <span>Eksport CSV/JSON</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">04 · Leveranse</div>
              <h3>Markedsrådgivning</h3>
              <p>
                Konkrete, knowledge-based anbefalinger som svarer på hva du
                faktisk skal gjøre — ikke bare hva tallene er.
              </p>
              <div className="meta">
                <span>Senior team</span>
                <span>Resultatorientert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METODIKK */}
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
            <span className="eyebrow">02 — Metodikk</span>
            <div>
              <h2>
                Vi systematiserer{" "}
                <span className="italic">det andre overser.</span>
              </h2>
              <p>
                Markedet for næringseiendom i Nord-Norge er fragmentert og lite
                transparent. Det er nettopp derfor en god database har så høy
                verdi.
              </p>
            </div>
          </div>

          <div className="tc">
            <div>
              <h4>Innsamling</h4>
              <p>
                Vi sporer hver registrerte transaksjon, leiekontrakt og
                leieendring i markedet — kombinert med proprietære relasjoner,
                offentlig informasjon og dialog med aktører.
              </p>
              <p>
                Datapunktene kvalitetssikres manuelt: en transaksjon registrert
                hos oss er sjekket mot tinglysning, kjøpekontrakt eller direkte
                bekreftelse fra part.
              </p>
            </div>
            <div>
              <h4>Analyse</h4>
              <p>
                Vår analyseavdeling kjører kvantitative modeller på toppen av
                basen — yield-kurver, segmentbenchmarks, sensitivitetsmatriser
                og scenarier som faktisk reflekterer hvordan markedet beveger
                seg.
              </p>
              <p>
                Resultatet er beslutningsgrunnlag du kan stå inne for — i
                styremøtet, hos banken, hos revisor.
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
                Markedsdata du <span className="italic">kan stole på.</span>
              </h2>
              <p>
                Vi konkurrerer ikke med generelle markedsrapporter fra Oslo. Vi
                konkurrerer med antakelser. Og vi vinner.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Den dypeste databasen</h3>
              <p>
                Bransjens skarpeste markedsdatabase nord for Trondheim — over 1
                400 eiendommer, 10 års transaksjonshistorikk.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Faglig integritet</h3>
              <p>
                Vi viser metodikken, kildene og forutsetningene. Du kan utfordre
                tallene — og vi har svaret.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Bruksklart format</h3>
              <p>
                Rapporter, datasett og API som passer rett inn i bankens
                kredittvurdering, styrets beslutningsgrunnlag eller revisors
                verdsettelse.
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
                Markedsdata fra{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  hele landsdelen.
                </span>
              </h2>
              <p>
                Vi dekker næringssegmentene i de viktigste byene — med data som
                faktisk er samlet inn lokalt.
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

      <PhotoBand src="/building/pexels-abshky-18567185.jpg" alt="Markedsdata og radgivning" caption="Markedsdata · Nord-Norge" />

      <CtaStrip
        eyebrow="Trenger du markedsinnsikt?"
        title={
          <>
            Bestill <span className="italic">markedsrapporten.</span>
          </>
        }
        sub="Få vår siste kvartalsrapport eller en skreddersydd analyse for din eiendom eller portefølje."
        primary={{ label: "Bestill rapport", href: "/kontakt" }}
        secondary={{ label: "Se alle våre tjenester", href: "/tjenester" }}
      />
    </>
  );
}
