import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  path: "/off-market-tilgang",
  title: "Off-market tilgang — næringseiendom på invitasjon | Advanti Estate",
  description:
    "Vi formidler næringseiendom i Nord-Norge som ikke annonseres åpent. Registrer kjøpsmandat, så vurderer vi hvilke konfidensielle oppdrag som passer — diskré formidling mellom kvalifiserte parter.",
});

const FEATURES = [
  {
    num: "01",
    title: "Tilgang før markedet ser dem",
    body: "Konfidensielle salgsoppdrag og teasere fra vår nordnorske portefølje — ofte 4–8 uker før noe blir offentlig.",
  },
  {
    num: "02",
    title: "Kuratert for ditt mandat",
    body: "Vi sender kun objekter som matcher dine kriterier — beliggenhet, type, ticket-size og yield-krav. Ingen massemailer.",
  },
  {
    num: "03",
    title: "Diskré prosess",
    body: "Full informasjon deles først etter signert NDA. Selger får bekreftet at du er en reell og finansielt kvalifisert kjøper.",
  },
];

export default function OffMarketTilgangPage() {
  return (
    <>
      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Verktøy", href: "/verktoy" },
          { label: "Off-market tilgang" },
        ]}
        eyebrow="For kvalifiserte kjøpere"
        title={
          <>
            Off-market <span className="italic">— på invitasjon.</span>
          </>
        }
        lede="Vi formidler eiendommer som ikke annonseres åpent — av diskresjonshensyn, eller fordi selger ønsker en målrettet prosess mot et lite utvalg kjøpere. Vi vurderer hvilke oppdrag som passer ditt mandat og kontakter deg direkte."
        actions={[
          { label: "Be om tilgang", href: "/kontakt" },
          { label: "Se investorportalen", href: "/investorportal", variant: "outline" },
        ]}
      />

      {/* HVA DU FÅR */}
      <section className="section section-divider">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Hva du får</span>
            <div>
              <h2>
                Oppdrag før de blir <span className="italic">offentlige.</span>
              </h2>
              <p>
                Off-market-tilgang gir aktive kjøpere et forsprang på de mest
                attraktive oppdragene i landsdelen — diskré, kuratert og uten
                støy.
              </p>
            </div>
          </div>

          <div className="feat-3">
            {FEATURES.map((f) => (
              <div className="feat" key={f.num}>
                <div className="num">{f.num}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KOMMER SNART */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Kommer snart</span>
            <div>
              <h2>
                Selvbetjent <span className="italic">mandatregistrering.</span>
              </h2>
              <p>
                Vi jobber med et skjema der du registrerer kjøpsmandatet ditt og
                får tilgang vurdert av en seniormegler innen 48 timer. Inntil det
                er live: ta direkte kontakt, så setter vi deg på listen og
                matcher deg mot relevante oppdrag.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Registrer mandatet ditt"
        title={
          <>
            Leter du etter noe <br />
            <span className="italic">spesifikt?</span>
          </>
        }
        sub="Fortell oss hva du ser etter — beliggenhet, type, ticket-size og yield-krav — så tar en av rådgiverne våre kontakt med relevante off-market-oppdrag."
        primary={{ label: "Kontakt oss", href: "/kontakt" }}
        secondary={{ label: "+47 984 53 571", href: "tel:+4798453571" }}
      />
    </>
  );
}
