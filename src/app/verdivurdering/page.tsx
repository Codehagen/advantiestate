import Image from "next/image";
import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { SubHero } from "@/components/site/SubHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  VerdivurderingIntakeForm,
  type VerdivurderingPrefill,
} from "@/components/forms/VerdivurderingIntakeForm";

export const metadata = constructMetadata({
  path: "/verdivurdering",
  // Indexed conversion page. Its own canonical (/verdivurdering) and a distinct,
  // intent-led title ("Få verdivurdering …") keep it from cannibalising the
  // explainer at /tjenester/verdivurdering, which targets the informational query.
  title: "Få verdivurdering av næringseiendom | Advanti Estate",
  description:
    "Be om en uforpliktende verdivurdering av næringseiendommen din. Svar fra en partner innen 24 timer, basert på vår transaksjonsdatabase med over 1 400 eiendommer i Nord-Norge.",
});

const CHRISTER_PORTRAIT =
  "https://kukzjreikqbgbolxvqaj.supabase.co/storage/v1/object/public/press/christer-hagen-web.jpg";

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function FaaVerdivurderingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const prefill: VerdivurderingPrefill = {
    type: first(sp.type),
    by: first(sp.by),
    areal: first(sp.areal),
    leie: first(sp.leie),
  };

  return (
    <>
      <SubHero
        breadcrumbs={<Breadcrumbs path="/verdivurdering" />}
        eyebrow="Verdivurdering · Uforpliktende"
        title={
          <>
            Hva er <span className="italic">næringseiendommen</span> din
            <br />
            verdt i dagens marked?
          </>
        }
        lede="Fyll ut skjemaet under, så får du en konkret tilbakemelding fra en av partnerne våre innen 24 timer — basert på vår transaksjonsdatabase med over 1 400 eiendommer i Nord-Norge. Helt uforpliktende."
      >
        <p
          style={{
            marginTop: 24,
            fontSize: 15,
            color: "var(--warm-grey-85)",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 28px",
          }}
        >
          <span>
            Vil du ha et raskt anslag selv først?{" "}
            <Link
              href="/verktoy/naringskalkulator"
              className="underline decoration-warm-grey-75 underline-offset-4 hover:text-warm-grey"
              style={{ fontWeight: 500, color: "var(--warm-grey)" }}
            >
              Prøv næringskalkulatoren →
            </Link>
          </span>
          <span>
            Lurer du på hva vi trenger?{" "}
            <Link
              href="/sjekkliste-verdivurdering"
              className="underline decoration-warm-grey-75 underline-offset-4 hover:text-warm-grey"
              style={{ fontWeight: 500, color: "var(--warm-grey)" }}
            >
              Se sjekklisten →
            </Link>
          </span>
        </p>
      </SubHero>

      {/* FORM GRID */}
      <section className="section section-divider" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <div className="contact-grid">
            {/* LEFT: tailored valuation form */}
            <VerdivurderingIntakeForm
              page="/verdivurdering"
              source="verdivurdering_page"
              prefill={prefill}
            />

            {/* RIGHT: what you get + process + partner */}
            <aside>
              <div className="vv-aside-card">
                <div className="pre">Hva du får</div>
                <ul className="vv-gets">
                  <li>
                    <span className="ico" aria-hidden="true">
                      I
                    </span>
                    <div>
                      <h4>En konkret verdiindikasjon</h4>
                      <p>
                        Et begrunnet anslag på markedsverdi — ikke en generisk
                        kalkulator, men en faglig vurdering fra en partner.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="ico" aria-hidden="true">
                      II
                    </span>
                    <div>
                      <h4>Lokalt sammenlikningsgrunnlag</h4>
                      <p>
                        Vurderingen avstemmes mot reelle transaksjoner i ditt
                        segment og din by — fra vår egen database.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="ico" aria-hidden="true">
                      III
                    </span>
                    <div>
                      <h4>En ærlig samtale</h4>
                      <p>
                        Råd om timing, hva som driver verdien, og hva som
                        eventuelt kan løfte den før et salg.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div
                className="next-steps"
                style={{ borderTop: "none", paddingTop: 0, marginBottom: 32 }}
              >
                <h3>Slik går vi frem</h3>
                <ol>
                  <li>
                    <span className="n">01</span>
                    <div>
                      <h4>Du sender forespørselen</h4>
                      <p>
                        Noen få felter om eiendommen og formålet. To minutter.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="n">02</span>
                    <div>
                      <h4>Vi tar kontakt innen 24 timer</h4>
                      <p>
                        En partner ringer eller skriver for en kort,
                        uforpliktende avklaring.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="n">03</span>
                    <div>
                      <h4>Du får en verdiindikasjon</h4>
                      <p>
                        Vi gir et begrunnet anslag — og forklarer hva en full
                        rapport ev. vil innebære.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="vv-partner">
                <div className="portrait">
                  <Image
                    src={CHRISTER_PORTRAIT}
                    alt="Christer Hagen, partner og daglig leder i Advanti"
                    fill
                    sizes="88px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <div className="k">Din kontakt</div>
                  <h4>Christer Hagen</h4>
                  <div className="role">Partner &amp; daglig leder</div>
                  <a href="tel:+4798453571">+47 984 53 571</a>
                  <a className="mail" href="mailto:christer@advantiestate.no">
                    christer@advantiestate.no
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* TRYGG-RAD */}
      <section className="vv-trust">
        <div className="wrap">
          <div className="vv-trust-grid">
            <div>
              <div className="big">24 t</div>
              <p className="cap">SVAR FRA EN PARTNER</p>
            </div>
            <div>
              <div className="big">1 400+</div>
              <p className="cap">EIENDOMMER I DATABASEN</p>
            </div>
            <div>
              <div className="big">NDA</div>
              <p className="cap">KONFIDENSIELT FRA DAG 1</p>
            </div>
          </div>
        </div>
      </section>

      {/* METODE / TILLIT */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Hvordan vi vurderer</span>
            <div>
              <h2>
                Tall du kan <span className="italic">stole på.</span>
              </h2>
              <p>
                En verdivurdering fra Advanti er ingen automatisk kalkulator. Vi
                kombinerer anerkjent metodikk med reelle transaksjoner i ditt
                marked — slik at tallet tåler kritisk gjennomgang fra bank,
                revisor og kjøper.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>DCF + yield</h3>
              <p>
                Vi diskonterer eiendommens kontantstrøm og avstemmer mot prime
                yield i sammenlignbare segmenter — to metoder som kontrollerer
                hverandre.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Lokal forankring</h3>
              <p>
                Vi bor og jobber i Nord-Norge. Vurderingen speiler reelle
                prismekanismer i din by — ikke generelle antakelser fra et
                sentralt kontor.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Uavhengig</h3>
              <p>
                Som uavhengige rådgivere har vi ingen egeninteresse i tallet.
                Vår eneste lojalitet er mot oppdragsgiver og det markedet
                faktisk viser.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: 48,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link href="/tjenester/verdivurdering" className="btn btn-outline">
              Les mer om metoden vår <span className="arrow">→</span>
            </Link>
            <span style={{ fontSize: 14, color: "var(--warm-grey-85)" }}>
              Vil du heller ringe?{" "}
              <a href="tel:+4798453571" style={{ fontWeight: 500 }}>
                +47 984 53 571
              </a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
