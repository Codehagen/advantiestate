import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { YieldCalculatorV2 } from "@/components/verktoy/YieldCalculatorV2";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  path: "/verktoy/yield-kalkulator",
  title: "Yield-kalkulator | Brutto, netto og cash-on-cash | Advanti Estate",
  description:
    "Beregn brutto- og netto-yield for næringseiendom i Nord-Norge — og se hva belåning gjør med egenkapitalavkastningen (cash-on-cash). I sanntid, målt mot markedsnivået. Gratis, uten innlogging.",
});

export default function YieldKalkulatorPage() {
  return (
    <>
      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Verktøy", href: "/verktoy" },
          { label: "Yield-kalkulator" },
        ]}
        eyebrow="Verktøy · Yield på minuttet"
        title={
          <>
            Regn ut <span className="italic">yield</span> og <br />
            egenkapitalavkastning.
          </>
        }
        lede="Legg inn leie, kjøpesum og driftskostnader — så får du brutto- og netto-yield i sanntid, satt opp mot markedsnivået i Nord-Norge. Slå på belåning for å se hva egenkapitalen faktisk forrenter."
      />

      {/* CALCULATOR */}
      <section className="section section-divider" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <YieldCalculatorV2 />
        </div>
      </section>

      {/* BEGREPENE BAK TALLET */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Begrepene bak tallet</span>
            <div>
              <h2>
                Tre tall, <span className="italic">tre spørsmål.</span>
              </h2>
              <p>
                Yield måler avkastning mot pris. Brutto er rått og raskt, netto
                er det meglere faktisk prater om, og cash-on-cash viser hva
                egenkapitalen din forrenter når lånet jobber med deg.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Brutto yield</h3>
              <p>
                <em>Leie ÷ Kjøpesum.</em> Avkastningen før driftskostnader — grei
                for raske sammenligninger mellom objekter, men overdriver hva du
                sitter igjen med.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Netto yield</h3>
              <p>
                <em>(Leie − Drift) ÷ Kjøpesum.</em> Netto driftsinntekt delt på
                pris. Dette er nøkkeltallet i en verdivurdering, og det vi måler
                mot markedsnivået i landsdelen.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Cash-on-cash</h3>
              <p>
                <em>(NOI − Renter) ÷ Egenkapital.</em> Avkastningen på pengene du
                faktisk binder. Belåning løfter den når yielden er høyere enn
                renta — og trekker den ned når den ikke er det.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Klar for et presist tall?"
        title={
          <>
            Fra overslag til <span className="italic">verdivurdering.</span>
          </>
        }
        sub="Kalkulatoren gir et godt utgangspunkt. Vil du vite hva eiendommen faktisk er verdt i dagens marked, gir en av partnerne våre deg en presis vurdering innen 24 timer — uforpliktende."
        primary={{ label: "Få verdivurdering", href: "/kontakt" }}
        secondary={{
          label: "Slik jobber vi med verdivurdering",
          href: "/tjenester/verdivurdering",
        }}
      />
    </>
  );
}
