import { constructMetadata, formatDate } from "@/lib/utils";
import { SubHero } from "@/components/site/SubHero";
import { CtaStrip } from "@/components/site/CtaStrip";
import { PhotoBand } from "@/components/site/PhotoBand";
import { Faq, type FaqItem } from "@/components/site/Faq";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";

const LAST_UPDATED = "2026-05-22";

export const metadata = constructMetadata({
  path: "/tjenester/utleie",
  title: "Utleie av Næringseiendom | Advanti",
  description:
    "Advanti tilbyr skreddersydde løsninger for utleie av kontor, handel- og logistikkeiendom, samt leietaker- og gårdeierrådgivning i Nord-Norge.",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Representerer Advanti både gårdeiere og leietakere?",
    answer:
      "Ja, men aldri på samme sak. Vi tar én side av bordet om gangen — gårdeier eller leietaker. Lojaliteten er klar fra første samtale, og vi opplyser åpent om eventuelle interessekonflikter før vi tar oppdrag.",
  },
  {
    question: "Hvilke typer næringslokaler hjelper Advanti med å leie ut?",
    answer:
      "Vi dekker fire segmenter: kontorutleie i klasse A til C, handel og bevertning, lager og logistikk fra 500 til 25 000 m², og spesialiserte formål som helse, undervisning, kultur og produksjon.",
  },
  {
    question: "Hva kan en leietaker spare på å bruke Advanti?",
    answer:
      "Når Advanti representerer leietaker i søk etter nye lokaler eller reforhandling, er resultatet ofte 10–20 % lavere kostnad sammenlignet med direkte forhandling — eller bedre vilkår på samme kostnad.",
  },
  {
    question: "Hjelper Advanti med reforhandling av eksisterende leieavtaler?",
    answer:
      "Ja. Vi bistår gårdeiere med reforhandling av eksisterende kontrakter og rådgivning ved leietakerbytter, og vi representerer leietakere ved reforhandling av eksisterende avtaler og flytteprosesser.",
  },
];

export default function UtleiePage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Tjenester", url: "/tjenester" },
          { name: "Utleie", url: "/tjenester/utleie" },
        ]}
      />
      <StructuredData
        type="service"
        data={{
          name: "Utleie av Næringseiendom",
          description:
            "Skreddersydde løsninger for utleie av kontor, handel og logistikkeiendom i Nord-Norge.",
        }}
      />

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Tjenester", href: "/tjenester" },
          { label: "Utleie" },
        ]}
        eyebrow="Tjeneste 04 · Utleie"
        title={
          <>
            Utleie <span className="italic">av næringslokaler.</span>
          </>
        }
        lede="Effektiv utleieformidling og reforhandling for kontor, handel, bevertning og logistikk. Vi kjenner aktørene som søker areal i Nord-Norge."
        actions={[
          { label: "Snakk om dine lokaler", href: "/kontakt" },
          {
            label: "Våre segmenter",
            href: "#segmenter",
            variant: "outline",
          },
        ]}
        metaRow={[
          { value: "+38", label: "Leieavtaler · 2025" },
          { value: "12 år", label: "Snittlengde WAULT" },
          { value: "100 %", label: "Utleiegrad nye bygg" },
        ]}
        photo={{
          src: "/building/pexels-abshky-18567185.jpg",
          alt: "Næringslokaler til utleie",
        }}
      />

      {/* SEGMENTER */}
      <section className="section section-divider" id="segmenter">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Segmenter</span>
            <div>
              <h2>
                Skreddersydd for <span className="italic">dine behov.</span>
              </h2>
              <p>
                Vi tilbyr et bredt spekter av utleietjenester — enten du skal
                leie ut, finne nye lokaler eller reforhandle eksisterende
                avtaler.
              </p>
            </div>
          </div>

          <div className="method-grid">
            <div className="method">
              <div className="pre">01 · Segment</div>
              <h3>Kontorutleie</h3>
              <p>
                Vi bistår gårdeiere med utleie og reforhandling av
                kontorlokaler, og hjelper bedrifter med å finne kontorarealer
                som matcher faktisk arbeidsform og kostnadsramme.
              </p>
              <div className="meta">
                <span>Klasse A–C</span>
                <span>Sentrum + næringspark</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">02 · Segment</div>
              <h3>Handel og bevertning</h3>
              <p>
                Spesialisert rådgivning for utleie av butikklokaler,
                kjøpesenter­enheter og serveringssteder — med kjennskap til
                leietakerøkonomi og omsetningsmodeller.
              </p>
              <div className="meta">
                <span>High street</span>
                <span>Senter + sentrum</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">03 · Segment</div>
              <h3>Lager og logistikk</h3>
              <p>
                Effektiv formidling av lager-, logistikk- og
                kombinasjons­eiendommer tilpasset bedriftens reelle behov for
                høyde, last og rampe.
              </p>
              <div className="meta">
                <span>Mod. terminaler</span>
                <span>500–25 000 m²</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">04 · Segment</div>
              <h3>Spesialiserte formål</h3>
              <p>
                Helse, undervisning, kultur, produksjon — vi har erfaring med
                utleie der standard ikke gjelder og hver kontrakt må
                skreddersys.
              </p>
              <div className="meta">
                <span>Skreddersydd</span>
                <span>Lange kontrakter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLLER */}
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
            <span className="eyebrow">02 — Roller</span>
            <div>
              <h2>
                Gårdeier eller <span className="italic">leietaker?</span>
              </h2>
              <p>
                Vi tar én side av bordet om gangen. Lojaliteten er klar fra
                første samtale, og vi opplyser åpent om eventuelle
                interessekonflikter før vi tar oppdrag.
              </p>
            </div>
          </div>

          <div className="tc">
            <div>
              <h4>Gårdeierrådgivning</h4>
              <p>
                Strategisk rådgivning for å optimalisere utleie, minimere
                tomgang og øke eiendommens netto driftsresultat. Vi designer
                leieobjektet sammen med deg — fra arealplan til prising.
              </p>
              <p>
                Typiske leveranser: utleiestrategi, prospekt og kampanje,
                reforhandling av eksisterende kontrakter, og rådgivning ved
                leietakerbytter.
              </p>
            </div>
            <div>
              <h4>Leietakerrådgivning</h4>
              <p>
                Vi representerer leietakere i søk etter nye lokaler,
                reforhandling av eksisterende avtaler og flytteprosesser. Vi
                forhandler på din side, mot et marked vi kjenner inngående.
              </p>
              <p>
                Resultatet er ofte 10–20 % lavere kostnad sammenlignet med
                direkte forhandling — eller bedre vilkår på samme kostnad.
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
                Din partner i <span className="italic">utleiemarkedet.</span>
              </h2>
              <p>
                Med vår ekspertise og lokale forankring er vi godt posisjonert
                for å hjelpe deg å lykkes i leiemarkedet — fra første visning til
                signert kontrakt.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Markedsinnsikt</h3>
              <p>
                Dybdegående kunnskap om leiemarkedet i Nord-Norge, trender,
                leietakerpreferanser og prising — kvartalsvis oppdatert.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Bredt nettverk</h3>
              <p>
                Et omfattende nettverk av gårdeiere, leietakere og
                samarbeidspartnere for effektiv og rask matching.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Forhandlingsstyrke</h3>
              <p>
                Erfarne rådgivere som sikrer de beste betingelsene for deg,
                enten du er leietaker eller gårdeier.
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
                Utleiekompetanse{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  i lokale markeder.
                </span>
              </h2>
              <p>
                Vi finner riktige leietakere og strukturerer leieavtaler i byer
                og regioner vi kjenner godt.
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

      <Faq
        eyebrow="05 — Ofte stilte spørsmål"
        title={
          <>
            Spørsmål om <span className="italic">utleie.</span>
          </>
        }
        lede="Finner du ikke svaret? Ta kontakt — vi setter av tid til en uforpliktende samtale uansett."
        items={FAQ_ITEMS}
      />

      <PhotoBand src="/building/pexels-expect-best-79873-351262.jpg" alt="Utleie av næringslokaler" caption="Utleie · Nord-Norge" />

      <CtaStrip
        eyebrow="Behov for utleiehjelp?"
        title={
          <>
            Skal du leie ut{" "}
            <span className="italic">eller finne nye lokaler?</span>
          </>
        }
        sub="Ta kontakt med Advanti for en uforpliktende prat om dine utfordringer og muligheter i leiemarkedet."
        primary={{ label: "Kontakt oss om utleie", href: "/kontakt" }}
        secondary={{ label: "Se alle våre tjenester", href: "/tjenester" }}
      />
      <div className="wrap pb-16 text-center">
        <p className="eyebrow no-rule">
          Sist oppdatert · {formatDate(LAST_UPDATED)}
        </p>
      </div>
    </>
  );
}
