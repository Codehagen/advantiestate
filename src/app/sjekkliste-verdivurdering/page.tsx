import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { SjekklisteVerdivurderingClient } from "@/components/verktoy/SjekklisteVerdivurderingClient";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  path: "/sjekkliste-verdivurdering",
  title: "Sjekkliste for verdivurdering | Advanti Estate",
  description:
    "Hva trenger du for å verdivurdere næringseiendom? Kryss av for det du har, se hva som gjenstår. Interaktiv sjekkliste med må-ha- og bra-å-ha-dokumenter.",
});

export default function SjekklisteVerdivurderingPage() {
  return (
    <>
      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Sjekkliste for verdivurdering" },
        ]}
        eyebrow="Verktøy · Forberedelse"
        title={
          <>
            Dette trenger vi for å <br />
            <span className="italic">verdivurdere eiendommen din.</span>
          </>
        }
        lede="Jo bedre grunnlag, jo mer presist tall. Kryss av for det du har, så ser du hva som gjenstår. Du trenger ikke alt for å komme i gang — vi hjelper deg med å hente inn resten."
      />

      {/* CHECKLIST */}
      <section className="section section-divider" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <SjekklisteVerdivurderingClient />
        </div>
      </section>

      {/* HVORFOR */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Hvorfor det er verdt innsatsen</span>
            <div>
              <h2>
                Bedre grunnlag, <span className="italic">presist tall.</span>
              </h2>
              <p>
                En verdivurdering er aldri bedre enn grunnlaget den bygger på.
                Med god dokumentasjon kan vi gå rett på analysen — og gi deg et
                tall som tåler gjennomgang fra bank, revisor og kjøper.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Raskere leveranse</h3>
              <p>
                Når dokumentasjonen er på plass, slipper vi runder med
                etterspørsel — og du får vurderingen raskere.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Mindre usikkerhet</h3>
              <p>
                Faktiske kontrakter og regnskap reduserer behovet for
                antakelser, og gir et smalere, mer presist verdiintervall.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Trygt beslutningsgrunnlag</h3>
              <p>
                En godt dokumentert vurdering står seg i forhandlinger, mot
                långiver og i regnskapet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Klar til å sette i gang?"
        title={
          <>
            La oss <span className="italic">verdivurdere eiendommen.</span>
          </>
        }
        sub="Har du det meste klart — eller bare lurer på hvor du skal begynne? Ta kontakt, så tar en av partnerne våre deg gjennom resten. Innen 24 timer."
        primary={{ label: "Få verdivurdering", href: "/kontakt" }}
        secondary={{
          label: "Prøv næringskalkulatoren",
          href: "/verktoy/naringskalkulator",
        }}
      />
    </>
  );
}
