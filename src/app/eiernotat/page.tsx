import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { SubHero } from "@/components/site/SubHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  VerdivurderingIntakeForm,
  type VerdivurderingPrefill,
} from "@/components/forms/VerdivurderingIntakeForm";

export const metadata = constructMetadata({
  path: "/eiernotat",
  // DRAFT conversion surface. noIndex until the partner-facing offer copy and
  // the 48-hour memo fulfilment workflow have had a human review (see PR #61 /
  // plan Track C1). Flip to indexed once the offer is signed off.
  noIndex: true,
  title: "Eiernotat — beslutningsgrunnlag for næringseiendom | Advanti Estate",
  description:
    "Bør du selge, refinansiere, holde, leie ut eller reposisjonere? Be om et eiernotat: et kort, partner-vurdert beslutningsnotat for eiendommen din innen 48 timer.",
});

export default function EiernotatPage() {
  // The eiernotat reuses the verdivurdering intake form (same fields), but
  // lands under its own CRM/analytics source and frames a different offer:
  // a written decision memo rather than a value estimate.
  const prefill: VerdivurderingPrefill = {};

  return (
    <>
      <SubHero
        breadcrumbs={<Breadcrumbs path="/eiernotat" />}
        eyebrow="Eiernotat · Partner-vurdert · 48 timer"
        title={
          <>
            Bør du selge, refinansiere
            <br />
            eller <span className="italic">holde</span>?
          </>
        }
        lede="Et eiernotat er et kort, skriftlig beslutningsgrunnlag fra en av partnerne våre — ikke en automatisk takst. Du får en indikativ yield-range, et bilde av hvem de sannsynlige kjøperne er, mulig leieoppside, og en konkret anbefaling om neste steg. Innen 48 timer, uforpliktende."
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
            Vil du bare ha et verdianslag?{" "}
            <Link
              href="/tjenester/verdivurdering"
              className="underline decoration-warm-grey-75 underline-offset-4 hover:text-warm-grey"
              style={{ fontWeight: 500, color: "var(--accent)" }}
            >
              Se verdivurdering →
            </Link>
          </span>
          <span>
            Vil du regne selv først?{" "}
            <Link
              href="/verktoy/naringskalkulator"
              className="underline decoration-warm-grey-75 underline-offset-4 hover:text-warm-grey"
              style={{ fontWeight: 500, color: "var(--accent)" }}
            >
              Prøv næringskalkulatoren →
            </Link>
          </span>
        </p>
      </SubHero>

      {/* FORM GRID */}
      <section className="section section-divider" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <div className="contact-grid">
            {/* LEFT: shared intake form, eiernotat source */}
            <VerdivurderingIntakeForm
              page="/eiernotat"
              source="eiernotat"
              intakeSource="eiernotat"
              prefill={prefill}
            />

            {/* RIGHT: what the memo contains + process */}
            <aside>
              <div className="vv-aside-card">
                <div className="pre">Hva notatet inneholder</div>
                <ul className="vv-gets">
                  <li>
                    <span className="ico" aria-hidden="true">
                      I
                    </span>
                    <div>
                      <h4>Indikativ yield og verdi-range</h4>
                      <p>
                        Avstemt mot reelle transaksjoner i ditt segment og din
                        by — fra vår egen database, ikke en generisk kalkulator.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="ico" aria-hidden="true">
                      II
                    </span>
                    <div>
                      <h4>Hvem som er de sannsynlige kjøperne</h4>
                      <p>
                        Hvilke kjøpergrupper som er aktive for en eiendom som
                        din nå, og hva de er villige til å betale for.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="ico" aria-hidden="true">
                      III
                    </span>
                    <div>
                      <h4>En konkret anbefaling</h4>
                      <p>
                        Selge, refinansiere, holde, leie ut eller reposisjonere
                        — med begrunnelse for hva som tjener deg best akkurat nå.
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
                      <p>Noen få felter om eiendommen og situasjonen din.</p>
                    </div>
                  </li>
                  <li>
                    <span className="n">02</span>
                    <div>
                      <h4>En partner går gjennom den</h4>
                      <p>
                        Vi vurderer eiendommen mot markedet og skriver notatet.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="n">03</span>
                    <div>
                      <h4>Du får notatet innen 48 timer</h4>
                      <p>
                        Skriftlig, uforpliktende. Vil du gå videre, tar vi en
                        samtale.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
