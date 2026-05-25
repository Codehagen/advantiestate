import { constructMetadata, formatDate } from "@/lib/utils";
import { SubHero } from "@/components/site/SubHero";
import { CtaStrip } from "@/components/site/CtaStrip";
import { PhotoBand } from "@/components/site/PhotoBand";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { ActiveListingsStrip } from "@/components/eiendommer/ActiveListingsStrip";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";

const LAST_UPDATED = "2026-05-22";

export const metadata = constructMetadata({
  path: "/tjenester/salg",
  title: "Salg av Næringseiendom i Nord-Norge | Advanti",
  description:
    "Planlegger du salg av næringseiendom? Advanti bistår deg gjennom hele salgsprosessen, fra verdivurdering og markedsføring til forhandlinger og oppgjør.",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Hvor lang tid tar en salgsprosess for næringseiendom?",
    answer:
      "En typisk salgsprosess hos Advanti tar tre til seks måneder. Den følger seks dokumenterte faser: forberedelse og verdivurdering (2–4 uker), markedsføring og prospekt (2–3 uker), visninger og interessenter (løpende), budrunde og forhandlinger (1–2 uker), kontrakt og oppgjør (2–4 uker) og til slutt overtakelse og oppfølging.",
  },
  {
    question: "Hva koster det å selge næringseiendom gjennom Advanti?",
    answer:
      "Honoraret er resultatbasert — vi tjener når du tjener. Det gir oss alle insentiver til å oppnå best mulig pris og vilkår for deg som selger. Ta kontakt for en konfidensiell salgsvurdering.",
  },
  {
    question: "Kan eiendommen selges uten åpen markedsføring?",
    answer:
      "Ja. Advanti tilbyr to salgsspor. En åpen salgsprosess markedsfører eiendommen bredt gjennom prospekt, annonser og målrettet outreach til nettverket vårt. En diskré prosess går målrettet til en kuratert liste investorer under NDA, uten åpen markedsføring eller offentlig omtale. Vi velger spor sammen med deg ut fra eiendomstype, marked og konfidensialitetskrav.",
  },
  {
    question: "Hvilke områder dekker Advanti ved salg av næringseiendom?",
    answer:
      "Vi gjennomfører salgsprosesser i hele Nord-Norge, med lokal markedskunnskap i Bodø, Tromsø, Alta, Mo i Rana og Narvik.",
  },
];

export default function SalgPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Tjenester", url: "/tjenester" },
          { name: "Salg", url: "/tjenester/salg" },
        ]}
      />
      <StructuredData
        type="service"
        data={{
          name: "Salg av Næringseiendom i Nord-Norge",
          description:
            "Profesjonell bistand ved salg av næringseiendom i Nord-Norge, fra verdivurdering til oppgjør.",
        }}
      />

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Tjenester", href: "/tjenester" },
          { label: "Salg" },
        ]}
        eyebrow="Tjeneste 02 · Salg"
        title={
          <>
            Salg <span className="italic">av næringseiendom.</span>
          </>
        }
        lede="Strategisk salgsprosess fra verdivurdering og prospekt til budrunde, kontrakt og overtakelse. Vi sikrer at riktig kjøper finner riktig eiendom — til riktig pris."
        actions={[
          { label: "Bestill salgsvurdering", href: "/kontakt" },
          {
            label: "Vår salgsprosess",
            href: "#prosess",
            variant: "outline",
          },
        ]}
        metaRow={[
          { value: "3,2 mrd", label: "Salgsverdi · 2025" },
          { value: "3–6 mnd", label: "Typisk prosess" },
          { value: "+89 %", label: "Eiendommer solgt over verdi" },
        ]}
        photo={{
          src: "/building/pexels-abshky-18566965.jpg",
          alt: "Næringseiendom i salgsprosess",
        }}
      />

      {/* SALGSPROSESSEN */}
      <section className="section section-divider" id="prosess">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Salgsprosessen</span>
            <div>
              <h2>
                En strukturert <span className="italic">salgsprosess.</span>
              </h2>
              <p>
                Vi følger en transparent, dokumentert prosess i seks faser. Du
                vet til enhver tid hvor prosessen står, hva som skjer neste fase,
                og hvilke beslutninger som ligger foran.
              </p>
            </div>
          </div>

          <div className="method-grid">
            <div className="method">
              <div className="pre">01 · Fase</div>
              <h3>Forberedelse og verdivurdering</h3>
              <p>
                Grundig gjennomgang av eiendommen, innhenting av dokumentasjon
                og en nøyaktig verdivurdering for å fastsette korrekt
                markedspris.
              </p>
              <div className="meta">
                <span>2–4 uker</span>
                <span>Rapport + strategi</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">02 · Fase</div>
              <h3>Markedsføring og prospekt</h3>
              <p>
                Utvikling av profesjonelt salgsmateriell og en målrettet
                strategi for å nå de rette potensielle kjøperne — diskré eller
                åpent.
              </p>
              <div className="meta">
                <span>2–3 uker</span>
                <span>Prospekt + lansering</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">03 · Fase</div>
              <h3>Visninger og interessenter</h3>
              <p>
                Profesjonell gjennomføring av visninger og kontinuerlig
                oppfølging av interessenter for å sikre god dialog og fremdrift.
              </p>
              <div className="meta">
                <span>Løpende</span>
                <span>NDA-styrt</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">04 · Fase</div>
              <h3>Budrunde og forhandlinger</h3>
              <p>
                Effektiv håndtering av budrunder og erfarne forhandlinger for å
                oppnå best mulig pris og betingelser for deg som selger.
              </p>
              <div className="meta">
                <span>1–2 uker</span>
                <span>Senior partner</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">05 · Fase</div>
              <h3>Kontrakt og oppgjør</h3>
              <p>
                Utarbeidelse av kjøpekontrakt og en trygg, etterprøvbar
                gjennomføring av det økonomiske oppgjøret.
              </p>
              <div className="meta">
                <span>2–4 uker</span>
                <span>Eksterne advokater</span>
              </div>
            </div>

            <div className="method">
              <div className="pre">06 · Fase</div>
              <h3>Overtakelse og oppfølging</h3>
              <p>
                Bistand med en ryddig overtakelse — og oppfølging i etterkant
                for å sikre at alle parter er trygge på handelen.
              </p>
              <div className="meta">
                <span>Etter signering</span>
                <span>Garantert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGI */}
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
            <span className="eyebrow">02 — Strategi</span>
            <div>
              <h2>
                To salgsspor —{" "}
                <span className="italic">én tilpasset strategi.</span>
              </h2>
              <p>
                Hvert salg er forskjellig. Vi velger spor sammen med deg —
                basert på eiendomstype, beliggenhet, markedsforhold og dine
                konfidensialitetskrav.
              </p>
            </div>
          </div>

          <div className="tc">
            <div>
              <h4>Åpen salgsprosess</h4>
              <p>
                Eiendommen markedsføres åpent gjennom prospekt, annonser og
                målrettet outreach til vårt nettverk. Største mulige
                interessebase, optimal priskonkurranse.
              </p>
              <p>
                Anbefales for veldokumenterte eiendommer der bred eksponering
                driver verdi — kontorbygg i sentrum, logistikkbygg med solide
                leietakere, handel i etablerte lokasjoner.
              </p>
            </div>
            <div>
              <h4>Diskré prosess</h4>
              <p>
                Vi går målrettet til en kuratert liste investorer under NDA.
                Ingen åpen markedsføring, ingen omtale i offentligheten — kun de
                aktørene vi vurderer som relevante kjøpere blir kontaktet.
              </p>
              <p>
                Anbefales når signaleffekt eller leietaker­relasjoner krever
                konfidensialitet, eller ved spesialiserte eiendommer med en
                avgrenset kjøperkrets.
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
                Din fordel <span className="italic">med Advanti.</span>
              </h2>
              <p>
                Med oss får du en partner som kjenner markedet, jobber målrettet
                og dedikert — og oppnår resultater som tåler å bli målt.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Lokalkunnskap og nettverk</h3>
              <p>
                Dyptgående kjennskap til markedet i Nord-Norge og et omfattende
                nettverk sikrer maksimal eksponering for din eiendom.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Dedikert seniorteam</h3>
              <p>
                Et erfarent og dedikert team følger deg tett gjennom hele
                prosessen, med personlig service og profesjonell håndtering.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Resultatorientert</h3>
              <p>
                Vi jobber målrettet for å oppnå best mulig pris og mest gunstige
                vilkår. Honoraret er resultatbasert — vi tjener når du tjener.
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
                Salgsprosesser{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  i hele Nord-Norge.
                </span>
              </h2>
              <p>
                Vi gjennomfører salgsprosesser i sentrale byer og regioner — med
                lokal markedskunnskap og profesjonell oppfølging.
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

      <ActiveListingsStrip
        eyebrow="05 — Aktuelle salgsoppdrag"
        title={
          <>
            Eiendommer vi har <span className="italic">til salgs nå.</span>
          </>
        }
        lede="Et utvalg av aktive mandater. Se hele inventaret på /eiendommer."
        limit={3}
      />

      <Faq
        eyebrow="06 — Ofte stilte spørsmål"
        title={
          <>
            Spørsmål om{" "}
            <span className="italic">salg av næringseiendom.</span>
          </>
        }
        lede="Finner du ikke svaret? Ta kontakt — vi setter av tid til en uforpliktende samtale uansett."
        items={FAQ_ITEMS}
      />

      <PhotoBand src="/building/pexels-pixabay-248877.jpg" alt="Salg av næringseiendom i Nord-Norge" caption="Salg · Nord-Norge" />

      <CtaStrip
        eyebrow="Klar til å selge?"
        title={
          <>
            Ønsker du å selge{" "}
            <span className="italic">din næringseiendom?</span>
          </>
        }
        sub="Ta kontakt for en konfidensiell samtale om salg av din eiendom og hvordan vi kan oppnå best mulig resultat."
        primary={{ label: "Kontakt oss om salg", href: "/kontakt" }}
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
