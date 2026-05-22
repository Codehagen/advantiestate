import { constructMetadata } from "@/lib/utils";
import { SubHero } from "@/components/site/SubHero";
import { CtaStrip } from "@/components/site/CtaStrip";
import { PhotoBand } from "@/components/site/PhotoBand";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";

export const metadata = constructMetadata({
  path: "/tjenester/transaksjoner",
  title: "Transaksjoner Næringseiendom | Advanti",
  description:
    "Advanti bistår med kjøp og salg av næringseiendom i Nord-Norge. Ekspertise gjennom hele transaksjonsprosessen fra verdivurdering til overtakelse.",
});

export default function TransaksjonerPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Tjenester", url: "/tjenester" },
          { name: "Transaksjoner", url: "/tjenester/transaksjoner" },
        ]}
      />
      <StructuredData
        type="service"
        data={{
          name: "Transaksjoner Næringseiendom",
          description:
            "Ekspertise gjennom hele transaksjonsprosessen for kjøp og salg av næringseiendom i Nord-Norge.",
        }}
      />

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Tjenester", href: "/tjenester" },
          { label: "Transaksjonsrådgivning" },
        ]}
        eyebrow="Tjeneste 03 · Transaksjoner"
        title={
          <>
            Transaksjons- <br />
            <span className="italic">rådgivning.</span>
          </>
        }
        lede="Strukturert rådgivning gjennom hele kjøps- eller salgsprosessen — fra due diligence og verdidriver-analyse til forhandling og gjennomføring."
        actions={[
          { label: "Snakk med en rådgiver", href: "/kontakt" },
          {
            label: "Omfang og leveranser",
            href: "#omfang",
            variant: "outline",
          },
        ]}
        metaRow={[
          { value: "Senior", label: "Partner-ledet team" },
          { value: "NDA", label: "Konfidensielt fra dag 1" },
          { value: "M&A", label: "Erfaring fra store hus" },
        ]}
        photo={{
          src: "/building/pexels-expect-best-79873-351262.jpg",
          alt: "Næringseiendom under transaksjon",
        }}
      />

      {/* OMFANG */}
      <section className="section section-divider" id="omfang">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Omfang</span>
            <div>
              <h2>
                Ekspertise gjennom{" "}
                <span className="italic">hele prosessen.</span>
              </h2>
              <p>
                Fra verdivurdering og strukturering til forhandling og
                gjennomføring — Advanti tilbyr en helhetlig og profesjonell
                tjeneste, uavhengig av om du er kjøper eller selger.
              </p>
            </div>
          </div>

          <div className="method-grid">
            <div className="method">
              <div className="pre">01 · Tjeneste</div>
              <h3>Kjøp av næringseiendom</h3>
              <p>
                Vi bistår kjøpere med å identifisere, vurdere og forhandle kjøp
                av næringseiendom som møter investeringsmålene — uten
                emosjonelle blindsoner.
              </p>
              <div className="meta">
                <span>Senior partner</span>
                <span>Buy-side</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">02 · Tjeneste</div>
              <h3>Salg av næringseiendom</h3>
              <p>
                Profesjonell salgsprosess fra verdivurdering og markedsføring
                til forhandling og gjennomføring av transaksjonen.
              </p>
              <div className="meta">
                <span>Senior partner</span>
                <span>Sell-side</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">03 · Tjeneste</div>
              <h3>Due diligence</h3>
              <p>
                Grundige undersøkelser og analyser av eiendom, kontrakter og
                økonomiske forhold for å sikre trygge transaksjoner — vi finner
                det som ellers blir oversett.
              </p>
              <div className="meta">
                <span>4–6 uker</span>
                <span>Rapport + funn</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">04 · Tjeneste</div>
              <h3>Strukturering og finansiering</h3>
              <p>
                Vi strukturerer transaksjonen optimalt — single asset,
                portefølje, SPV eller eiendomsselskap — og koordinerer mot
                finansiering og rådgivere.
              </p>
              <div className="meta">
                <span>Tidlig fase</span>
                <span>Skattenøytralt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TILNÆRMING */}
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
            <span className="eyebrow">02 — Tilnærming</span>
            <div>
              <h2>
                Hvert oppdrag har{" "}
                <span className="italic">én senior partner.</span>
              </h2>
              <p>
                Du blir aldri overlevert til en juniorrådgiver. Senior partner
                som er på saken fra dag én, er der ved signering.
              </p>
            </div>
          </div>

          <div className="tc">
            <div>
              <h4>Buy-side</h4>
              <p>
                Vi representerer kjøper i hele prosessen — fra screening av
                mulige akkvisisjonsmål til signert kjøpekontrakt og overtagelse.
                Lojaliteten er kun mot deg.
              </p>
              <p>
                Typisk omfang: pipeline-bygging, kvalifisering, første
                verdiindikasjon, due diligence-ledelse, forhandling og
                finansieringskoordinering.
              </p>
            </div>
            <div>
              <h4>Sell-side</h4>
              <p>
                Vi representerer selger gjennom hele prosessen — fra strategivalg
                og prospekt, via budrunde og forhandling, til oppgjør og
                overtakelse.
              </p>
              <p>
                Vi prioriterer pris, vilkår og gjennomføringssikkerhet — i den
                rekkefølgen som er rett for ditt mandat.
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
                Din pålitelige partner{" "}
                <span className="italic">i transaksjoner.</span>
              </h2>
              <p>
                Med vår erfaring og lokale forankring sikrer vi at du får best
                mulig rådgivning gjennom alle faser av transaksjonen.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Markedskunnskap</h3>
              <p>
                Dyp innsikt i det nordnorske markedet for næringseiendom —
                verdier, segmenter, leietakere og utviklingstrender.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Bredt nettverk</h3>
              <p>
                Omfattende nettverk av kjøpere, selgere, investorer og
                samarbeidspartnere i regionalt, nasjonalt og internasjonalt
                marked.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Trygg gjennomføring</h3>
              <p>
                Erfarne rådgivere sikrer at hele transaksjonsprosessen
                gjennomføres trygt og effektivt — ingen overraskelser ved
                signering.
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
                Transaksjoner med{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  lokal kjennskap.
                </span>
              </h2>
              <p>
                Vi gjennomfører transaksjoner i sentrale byer og regioner i
                landsdelen — basert på reelle markedsdata.
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

      <PhotoBand src="/building/pexels-abshky-18566965.jpg" alt="Transaksjonsradgivning naeringseiendom" caption="Transaksjoner · Nord-Norge" />

      <CtaStrip
        eyebrow="Behov for transaksjonshjelp?"
        title={
          <>
            Skal du kjøpe eller{" "}
            <span className="italic">selge næringseiendom?</span>
          </>
        }
        sub="Ta kontakt med Advanti for en uforpliktende samtale om dine eiendomstransaksjoner."
        primary={{
          label: "Kontakt oss om transaksjoner",
          href: "/kontakt",
        }}
        secondary={{ label: "Se alle våre tjenester", href: "/tjenester" }}
      />
    </>
  );
}
