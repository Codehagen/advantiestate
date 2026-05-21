import { constructMetadata } from "@/lib/utils";
import { SubHero } from "@/components/site/SubHero";
import { CtaStrip } from "@/components/site/CtaStrip";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";

export const metadata = constructMetadata({
  title: "Strategisk Rådgivning Næringseiendom | Advanti",
  description:
    "Advanti tilbyr strategisk rådgivning for eiendomsinvestorer og -utviklere i Nord-Norge, inkludert porteføljestrategi, akkvisisjon og exit-strategi.",
});

export default function StrategiskRadgivningPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Tjenester", url: "/tjenester" },
          {
            name: "Strategisk Rådgivning",
            url: "/tjenester/strategisk-radgivning",
          },
        ]}
      />
      <StructuredData
        type="service"
        data={{
          name: "Strategisk Rådgivning Næringseiendom",
          description:
            "Strategisk rådgivning for eiendomsinvestorer og utviklere i Nord-Norge.",
        }}
      />

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Tjenester", href: "/tjenester" },
          { label: "Strategisk rådgivning" },
        ]}
        eyebrow="Tjeneste 06 · Strategi"
        title={
          <>
            Strategisk <span className="italic">rådgivning.</span>
          </>
        }
        lede="Skreddersydd rådgivning for utvikling, akkvisisjon og optimalisering av eiendomsporteføljen — fra ett bygg til komplekse posisjoner."
        actions={[
          { label: "Avtal en samtale", href: "/kontakt" },
          { label: "Fokusområder", href: "#fokus", variant: "outline" },
        ]}
        metaRow={[
          { value: "Partner", label: "Sparringspartner" },
          { value: "Langsiktig", label: "3–10 års horisont" },
          { value: "Diskré", label: "NDA-styrt" },
        ]}
        photo={{
          src: "/building/pexels-pixabay-248877.jpg",
          alt: "Strategisk rådgivning næringseiendom",
        }}
      />

      {/* FOKUSOMRÅDER */}
      <section className="section section-divider" id="fokus">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Fokusområder</span>
            <div>
              <h2>
                Beslutninger som har <span className="italic">vekt.</span>
              </h2>
              <p>
                Strategisk rådgivning er ikke en transaksjon — det er en
                relasjon. Vi blir sparringspartner for de viktigste
                beslutningene knyttet til eiendomsporteføljen din over tid.
              </p>
            </div>
          </div>

          <div className="method-grid">
            <div className="method">
              <div className="pre">01 · Fokus</div>
              <h3>Porteføljestrategi</h3>
              <p>
                Hva skal porteføljen være om 5–10 år? Hvilke eiendommer skal
                beholdes, utvikles, eller avhendes? Vi setter strategien i tall
                — og holder den oppe.
              </p>
              <div className="meta">
                <span>3–10 års plan</span>
                <span>Styre-nivå</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">02 · Fokus</div>
              <h3>Akkvisisjonsstrategi</h3>
              <p>
                Systematisk pipeline-bygging og kvalifisering av mulige
                akkvisisjonsmål — basert på dine investeringskriterier og
                markedsdynamikken.
              </p>
              <div className="meta">
                <span>Buy-side</span>
                <span>Pipeline</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">03 · Fokus</div>
              <h3>Eierskapsstrukturer</h3>
              <p>
                Holdco, SPV, single asset eller portefølje — hvordan strukturere
                eierskapet for fleksibilitet ved exit, skattenøytralitet og
                finansiering.
              </p>
              <div className="meta">
                <span>Tidlig fase</span>
                <span>Skatt + jus</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">04 · Fokus</div>
              <h3>Exit-strategi</h3>
              <p>
                Når og hvordan avhende. Markedstiming, valg av prosess,
                kjøperprofil og prispåvirkning — uten emosjonelle beslutninger.
              </p>
              <div className="meta">
                <span>Senior partner</span>
                <span>Diskré</span>
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
                Vi er <span className="italic">sparringspartner.</span>
              </h2>
              <p>
                Vi er ikke en innleid konsulent som leverer rapporter og
                forsvinner. Vi er den du ringer når det er en viktig beslutning
                på bordet.
              </p>
            </div>
          </div>

          <div className="tc">
            <div>
              <h4>Tett relasjon</h4>
              <p>
                De aller fleste av våre strategiske oppdrag er løpende — med fast
                rytme av møter, oppdaterte analyser og åpen kommunikasjon mellom
                styremøtene.
              </p>
              <p>
                Du får én senior partner som blir kjent med porteføljen,
                ambisjonene og menneskene rundt — over tid.
              </p>
            </div>
            <div>
              <h4>Konfidensielt</h4>
              <p>
                Alt vi gjør under strategisk rådgivning er NDA-styrt. Vi
                opplyser om eventuelle interessekonflikter før vi tar oppdrag, og
                takker nei der det er nødvendig.
              </p>
              <p>
                Resultatet er at klienter snakker fritt — også om de tunge
                beslutningene som ikke skal ut.
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
                Strategisk innsikt,{" "}
                <span className="italic">lokal forankring.</span>
              </h2>
              <p>
                Vi forstår både porteføljedynamikken og markedet der eiendommene
                står. Det er den kombinasjonen som gjør strategien
                gjennomførbar.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Partnerskapsmodell</h3>
              <p>
                Langsiktige relasjoner — ikke transaksjoner. De fleste
                strategiske oppdrag løper i 3+ år.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Faktabasert</h3>
              <p>
                Beslutningsgrunnlag bygget på reelle markedsdata, ikke generelle
                antakelser eller bransje-narrativer.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Senior involvering</h3>
              <p>
                Du har én partner som er på saken. Ingen overlevering, ingen
                rotasjon, ingen junior-konsulent som gjør jobben din.
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
                Strategisk rådgivning{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  der eiendommene står.
                </span>
              </h2>
              <p>
                Vi dekker porteføljer i hele Nord-Norge — og kombinerer det med
                metodikk og nettverk på nasjonalt nivå.
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
        eyebrow="Behov for sparring?"
        title={
          <>
            Ta en uforpliktende{" "}
            <span className="italic">strategi-samtale.</span>
          </>
        }
        sub="Vi setter av tid til en åpen samtale om hvor porteføljen står og hva som kan forbedres — uten forpliktelser."
        primary={{ label: "Kontakt senior partner", href: "/kontakt" }}
        secondary={{ label: "Se alle våre tjenester", href: "/tjenester" }}
      />
    </>
  );
}
