import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { NaringskalkulatorClient } from "@/components/verktoy/NaringskalkulatorClient";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  path: "/verktoy/naringskalkulator",
  title: "Næringskalkulator | Verdiestimat på næringseiendom | Advanti Estate",
  description:
    "Regn ut et verdiestimat for næringseiendommen din på minuttet. Yield-basert anslag på markedsverdi for Nord-Norge — et godt utgangspunkt før en presis verdivurdering.",
});

export default function NaringskalkulatorPage() {
  return (
    <>
      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Verktøy", href: "/verktoy" },
          { label: "Næringskalkulator" },
        ]}
        eyebrow="Verktøy · Verdiestimat på minuttet"
        title={
          <>
            Regn ut et <span className="italic">verdiestimat</span> <br />
            for næringseiendommen din.
          </>
        }
        lede="Legg inn noen få tall, så får du et øyeblikkelig anslag på markedsverdi — basert på samme yield-metodikk vi bruker i ekte verdivurderinger. Et godt utgangspunkt før den presise vurderingen."
      />

      {/* CALCULATOR */}
      <section className="section section-divider" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <NaringskalkulatorClient />
        </div>
      </section>

      {/* SLIK REGNER VI */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Metoden bak tallet</span>
            <div>
              <h2>
                Samme prinsipp som{" "}
                <span className="italic">en ekte vurdering.</span>
              </h2>
              <p>
                Kalkulatoren bruker en forenklet yield-betraktning. Den gir et
                godt utgangspunkt — men erstatter ikke en faglig vurdering av
                kontrakter, beliggenhet og tilstand.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Netto leieinntekt</h3>
              <p>
                Vi tar brutto leie, trekker fra forventet ledighet og
                eierkostnader, og står igjen med netto leieinntekt (NOI) — det
                eiendommen faktisk kaster av seg.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Markedsyield</h3>
              <p>
                NOI deles på en yield som speiler avkastningskravet for ditt
                segment og din by i Nord-Norge. Lavere yield i likvide markeder,
                høyere der risikoen er større.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Verdiintervall</h3>
              <p>
                Vi viser et intervall rundt estimatet (yield ±0,5
                prosentpoeng), fordi små endringer i avkastningskravet gir store
                utslag på verdien.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Klar for et presist tall?"
        title={
          <>
            Fra estimat til <span className="italic">verdivurdering.</span>
          </>
        }
        sub="Estimatet er et godt utgangspunkt. Vil du vite hva eiendommen faktisk er verdt i dagens marked, gir en av partnerne våre deg en presis vurdering innen 24 timer — uforpliktende."
        primary={{ label: "Få verdivurdering", href: "/kontakt" }}
        secondary={{
          label: "Slik jobber vi med verdivurdering",
          href: "/tjenester/verdivurdering",
        }}
      />
    </>
  );
}
