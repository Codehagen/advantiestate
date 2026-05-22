import { constructMetadata } from "@/lib/utils";
import { SubHero } from "@/components/site/SubHero";
import { CtaStrip } from "@/components/site/CtaStrip";
import Link from "next/link";

export const metadata = constructMetadata({
  path: "/tjenester",
  title: "Tjenester innen Næringseiendom i Nord-Norge | Advanti",
  description:
    "Profesjonell salg og verdivurdering av næringseiendom i Nord-Norge. Vi tilbyr også utleie, transaksjoner og strategisk rådgivning for eiendomsbesittere.",
});

export default function TjenesterPage() {
  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Tjenester" }]}
        eyebrow="Tjenester & rådgivning"
        title={
          <>
            Et komplett spekter <br />
            innen næringseiendom{" "}
            <span className="italic">— levert med presisjon.</span>
          </>
        }
        lede="Vi hjelper eiendomsbesittere, investorer og utviklere i Nord-Norge gjennom hele eiendommens livsløp. Fra første verdivurdering til gjennomført transaksjon — ett dedikert miljø."
        actions={[
          { label: "Få uforpliktende samtale", href: "/kontakt" },
          {
            label: "Se alle tjenester",
            href: "#tjenester-liste",
            variant: "outline",
          },
        ]}
        metaRow={[
          { value: "+47", label: "Oppdrag i 2025" },
          { value: "1 400+", label: "Eiendommer i database" },
          { value: "2", label: "Kontorer · Bodø & Alta" },
        ]}
        photo={{
          src: "/building/pexels-pixabay-248877.jpg",
          alt: "Næringsbygg i Nord-Norge",
        }}
      />

      {/* TJENESTER LISTE */}
      <section className="section section-divider" id="tjenester-liste">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Oversikt</span>
            <div>
              <h2>
                Seks kjernetjenester. <br />
                <span className="italic">Ett kompetansemiljø.</span>
              </h2>
              <p>
                Hver tjeneste leveres av seniorrådgivere med dyp erfaring fra
                næringseiendomsmarkedet i Nord-Norge — og støttet av en dedikert
                analyseavdeling som leverer faktagrunnlaget.
              </p>
            </div>
          </div>

          <div className="tile-grid">
            <Link href="/tjenester/verdivurdering" className="tile">
              <div>
                <div className="num">TJENESTE 01</div>
                <h3 style={{ marginTop: 18 }}>
                  Verdivurdering <span className="italic">og analyse</span>
                </h3>
                <p style={{ marginTop: 16 }}>
                  Markedsverdivurdering, DCF-analyse og sensitivitet — et solid
                  beslutningsgrunnlag for investering, finansiering og
                  strategiske valg.
                </p>
              </div>
              <div className="tile-foot">
                <span className="count">+200 vurderinger</span>
                <span className="more">
                  Les mer <span>→</span>
                </span>
              </div>
            </Link>

            <Link href="/tjenester/salg" className="tile">
              <div>
                <div className="num">TJENESTE 02</div>
                <h3 style={{ marginTop: 18 }}>
                  Salg <span className="italic">av næringseiendom</span>
                </h3>
                <p style={{ marginTop: 16 }}>
                  Strategisk salgsprosess med nasjonalt og internasjonalt
                  nettverk. Vi sikrer at riktig kjøper finner riktig eiendom —
                  til riktig pris.
                </p>
              </div>
              <div className="tile-foot">
                <span className="count">3,2 mrd · 2025</span>
                <span className="more">
                  Les mer <span>→</span>
                </span>
              </div>
            </Link>

            <Link href="/tjenester/transaksjoner" className="tile">
              <div>
                <div className="num">TJENESTE 03</div>
                <h3 style={{ marginTop: 18 }}>
                  Transaksjons- <span className="italic">rådgivning</span>
                </h3>
                <p style={{ marginTop: 16 }}>
                  Strukturert rådgivning gjennom hele kjøps- eller
                  salgsprosessen — fra due diligence og verdidriver-analyse til
                  forhandling og gjennomføring.
                </p>
              </div>
              <div className="tile-foot">
                <span className="count">Senior team</span>
                <span className="more">
                  Les mer <span>→</span>
                </span>
              </div>
            </Link>

            <Link href="/tjenester/utleie" className="tile">
              <div>
                <div className="num">TJENESTE 04</div>
                <h3 style={{ marginTop: 18 }}>
                  Utleie <span className="italic">av næringslokaler</span>
                </h3>
                <p style={{ marginTop: 16 }}>
                  Effektiv utleieformidling og reforhandling for kontor, handel,
                  bevertning og logistikk. Vi kjenner aktørene som søker areal i
                  Nord-Norge.
                </p>
              </div>
              <div className="tile-foot">
                <span className="count">+38 leieavtaler · 2025</span>
                <span className="more">
                  Les mer <span>→</span>
                </span>
              </div>
            </Link>

            <Link href="/tjenester/radgivning" className="tile">
              <div>
                <div className="num">TJENESTE 05</div>
                <h3 style={{ marginTop: 18 }}>
                  Markedsdata <span className="italic">og rådgivning</span>
                </h3>
                <p style={{ marginTop: 16 }}>
                  Egne databaser, kvantitativ analyse og konkrete anbefalinger.
                  Vi systematiserer det andre overser, og gjør tall til
                  strategiske valg.
                </p>
              </div>
              <div className="tile-foot">
                <span className="count">Kvartalsvise rapporter</span>
                <span className="more">
                  Les mer <span>→</span>
                </span>
              </div>
            </Link>

            <Link href="/tjenester/strategisk-radgivning" className="tile">
              <div>
                <div className="num">TJENESTE 06</div>
                <h3 style={{ marginTop: 18 }}>
                  Strategisk <span className="italic">rådgivning</span>
                </h3>
                <p style={{ marginTop: 16 }}>
                  Skreddersydd rådgivning for utvikling, akkvisisjon og
                  optimalisering av eiendomsporteføljen — fra ett bygg til
                  komplekse posisjoner.
                </p>
              </div>
              <div className="tile-foot">
                <span className="count">Senior partner</span>
                <span className="more">
                  Les mer <span>→</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* HVORDAN VI JOBBER */}
      <section
        className="section"
        style={{
          background: "var(--accent-faint)",
          borderTop: "var(--hairline)",
          borderBottom: "var(--hairline)",
        }}
      >
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">02 — Prosess</span>
            <div>
              <h2>
                Hvordan vi <span className="italic">jobber.</span>
              </h2>
              <p>
                En strukturert prosess som sikrer forutsigbarhet, maksimal verdi
                og en gjennomarbeidet beslutning — uavhengig av om det handler om
                salg, utleie eller verdivurdering.
              </p>
            </div>
          </div>

          <div className="process">
            <div className="process-step">
              <div className="pn">01</div>
              <h3>Analyse & strategi</h3>
              <p>
                Vi starter med en grundig verdivurdering og markedsanalyse.
                Sammen legger vi den strategien som best realiserer eiendommens
                potensial.
              </p>
            </div>
            <div className="process-step">
              <div className="pn">02</div>
              <h3>Markedsføring & nettverk</h3>
              <p>
                Gjennom målrettet eksponering og vårt nasjonale nettverk når vi
                de rette investorene, kjøperne og leietakerne — diskré eller
                åpent.
              </p>
            </div>
            <div className="process-step">
              <div className="pn">03</div>
              <h3>Gjennomføring</h3>
              <p>
                Vi leder forhandlinger, due diligence og dokumentasjon fram til
                signering og overtakelse. Du har én rådgiver gjennom hele
                prosessen.
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
                Lokal markedsleder. <br />
                <span className="italic">Nasjonalt nettverk.</span>
              </h2>
              <p>
                Vi bor og jobber i Nord-Norge. Det gir oss en forståelse av
                markedet som ikke kan reises inn — kombinert med metodikk og
                nettverk fra de største transaksjonshusene i landet.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Lokal markedsleder</h3>
              <p>
                Vi sporer alle relevante transaksjoner, kontrakter og leienivåer
                i regionen. Vår markedsdatabase er bransjens skarpeste nord for
                Trondheim.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Erfarne rådgivere</h3>
              <p>
                Teamet kombinerer erfaring fra de største meglerhusene med dyp
                lokal forankring i Bodø, Tromsø, Alta og resten av landsdelen.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Uavhengig metodikk</h3>
              <p>
                Vi er uavhengige rådgivere. Det betyr at vår eneste lojalitet er
                mot oppdragsgiver — og mot fakta som tåler å bli stilt spørsmål
                ved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="section"
        style={{ background: "var(--warm-grey)", color: "var(--warm-white)" }}
      >
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow" style={{ color: "rgba(243,241,239,0.7)" }}>
              04 — Ofte stilte spørsmål
            </span>
            <div>
              <h2 style={{ color: "var(--warm-white)" }}>
                Spørsmål vi{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  ofte får.
                </span>
              </h2>
              <p style={{ color: "rgba(243,241,239,0.7)" }}>
                Finner du ikke svaret? Ta kontakt — vi setter av tid til en
                uforpliktende samtale uansett.
              </p>
            </div>
          </div>

          <div
            className="faq"
            style={{
              borderColor: "rgba(243,241,239,0.2)",
              maxWidth: 920,
            }}
          >
            <details>
              <summary
                style={{
                  color: "var(--warm-white)",
                  borderBottomColor: "rgba(243,241,239,0.2)",
                }}
              >
                Hva koster en verdivurdering?
              </summary>
              <div className="a" style={{ color: "rgba(243,241,239,0.75)" }}>
                Vi tilbyr en gratis og uforpliktende førstegangsverdsettelse for
                eiendomsbesittere i Nord-Norge. For mer omfattende rapporter til
                bank eller regnskap avtaler vi pris basert på oppdragets
                kompleksitet.
              </div>
            </details>
            <details style={{ borderBottomColor: "rgba(243,241,239,0.2)" }}>
              <summary style={{ color: "var(--warm-white)" }}>
                Hvor lang tid tar en salgsprosess?
              </summary>
              <div className="a" style={{ color: "rgba(243,241,239,0.75)" }}>
                En typisk salgsprosess for næringseiendom tar mellom 3 og 6
                måneder fra oppstart til signert avtale — avhengig av
                eiendomstype, beliggenhet og markedsforhold.
              </div>
            </details>
            <details style={{ borderBottomColor: "rgba(243,241,239,0.2)" }}>
              <summary style={{ color: "var(--warm-white)" }}>
                Hvilke områder dekker dere?
              </summary>
              <div className="a" style={{ color: "rgba(243,241,239,0.75)" }}>
                Vårt hovedfokus er Nordland, Troms og Finnmark, med spesielt god
                kjennskap til Bodø, Tromsø, Mo i Rana, Narvik og Alta. Vi tar
                oppdrag i hele Nord-Norge.
              </div>
            </details>
            <details style={{ borderBottomColor: "rgba(243,241,239,0.2)" }}>
              <summary style={{ color: "var(--warm-white)" }}>
                Bistår dere med utleie av alle typer lokaler?
              </summary>
              <div className="a" style={{ color: "rgba(243,241,239,0.75)" }}>
                Ja. Vi har erfaring med kontorlokaler, butikklokaler, lager- og
                logistikkbygg, samt kombinasjonseiendommer og spesialiserte
                formål.
              </div>
            </details>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Klar for neste steg?"
        title={
          <>
            Klar for å realisere <br />
            <span className="italic">verdiene i din eiendom?</span>
          </>
        }
        sub="Ta kontakt for en uforpliktende prat om dine muligheter i dagens marked. Vi tar en åpen samtale uten forpliktelser."
        primary={{ label: "Kontakt oss", href: "/kontakt" }}
        secondary={{ label: "Ta kontakt med teamet", href: "/personer" }}
      />
    </>
  );
}
