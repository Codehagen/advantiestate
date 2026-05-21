import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { constructMetadata } from "@/lib/utils";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Om Advanti | Din Næringsmegler i Nord-Norge",
  description:
    "Advanti er din erfarne partner for kjøp, salg og utleie av næringseiendom i Nord-Norge. Vi tilbyr lokal kunnskap og skreddersydde løsninger.",
});

export default function About() {
  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Om Advanti" }]}
        eyebrow="Om Advanti Estate"
        title={
          <>
            Din ledende næringsmegler <br />
            <span className="italic">i Nord-Norge.</span>
          </>
        }
        lede="Med solid erfaring og lokal kunnskap er Advanti den naturlige partneren for kjøp, salg, utleie og verdivurdering av næringseiendom. Vi leverer profesjonell rådgivning og skreddersydde løsninger — basert på data og dyp lokal forankring."
        photo={{
          src: "/building/pexels-pixabay-248877.jpg",
          alt: "Næringsbygg, Tromsø",
        }}
      />

      {/* VISJON */}
      <section className="section section-divider">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Vår visjon</span>
            <div>
              <h2>
                Analyse skal være et <br />
                <span className="italic">
                  konkurransefortrinn — ikke en kompleksitet.
                </span>
              </h2>
              <p>
                Vi ser for oss en fremtid der analyse av næringseiendom ikke
                lenger er en kompleks utfordring, men et kraftig
                konkurransefortrinn.
              </p>
            </div>
          </div>

          <div className="tc" style={{ marginTop: 16 }}>
            <div>
              <h4>I dag</h4>
              <p>
                Markedet for næringseiendom i Nord-Norge er fragmentert, lite
                transparent og dårlig dokumentert. Mange beslutninger tas på
                magefølelse, og det er ingen som har systematisert
                datagrunnlaget som faktisk finnes i markedet.
              </p>
              <p>
                Det betyr at vurderinger ofte spriker mer enn de burde, at
                forhandlinger føres på ufullstendig grunnlag, og at risiko
                prises høyere enn nødvendig.
              </p>
            </div>
            <div>
              <h4>Vår ambisjon</h4>
              <p>
                Ved å integrere strukturert markedsdata med dyp
                rådgivningserfaring transformerer vi rådata til strategiske
                beslutningsgrunnlag. Vi tror på å fjerne barrierene for kompleks
                eiendomsanalyse, slik at team kan fokusere på innsikt og
                muligheter fremfor manuelt arbeid.
              </p>
              <p>
                Vårt mål er å gi hver organisasjon verktøyene de trenger for å
                utnytte det fulle potensialet i sin eiendomsportefølje —
                uavhengig av om det handler om ett bygg eller hundre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRINSIPPER */}
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
            <span className="eyebrow">02 — Prinsipper</span>
            <div>
              <h2>
                Fire prinsipper{" "}
                <span className="italic">som styrer arbeidet.</span>
              </h2>
              <p>
                Når vi tar beslutninger om oppdrag, metode og rådgivning, faller
                vi alltid tilbake på disse fire. De er ikke forhandlingsbare.
              </p>
            </div>
          </div>

          <div className="principles">
            <div className="principle">
              <div className="pre">I.</div>
              <h3>Lokal ekspertise, bredere perspektiv</h3>
              <p>
                Røtter i Nord-Norge, øye for de nasjonale og internasjonale
                strømningene som beveger markedet. Vi bor her — det er ikke en
                satellitt-strategi.
              </p>
            </div>
            <div className="principle">
              <div className="pre">II.</div>
              <h3>Datadrevet metodikk</h3>
              <p>
                Egne databaser, kvantitativ analyse og en dedikert
                analyseavdeling som leverer faktagrunnlaget. Magefølelse er fint
                — men tallene har siste ord.
              </p>
            </div>
            <div className="principle">
              <div className="pre">III.</div>
              <h3>Klientens beslutninger i sentrum</h3>
              <p>
                Vi gir deg det best mulige faktabaserte grunnlaget — ikke for å
                imponere, men for å gjøre deg trygg på neste steg. Du bestemmer.
              </p>
            </div>
            <div className="principle">
              <div className="pre">IV.</div>
              <h3>Komplett livssyklus</h3>
              <p>
                Fra første verdivurdering til avhendelse — én partner gjennom
                alle faser av eiendommens livsløp. Ingen overleveringer, ingen
                rotasjon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE — Christer */}
      <section className="section">
        <div className="wrap">
          <div className="pullquote">
            <div>
              <div className="label">Daglig leder</div>
              <div className="attr" style={{ marginTop: 24 }}>
                <div
                  className="ph"
                  style={{ backgroundImage: "url('/havard.jpg')" }}
                />
                <div className="who">
                  <strong>Christer Hagen</strong>
                  <span>Partner &amp; daglig leder · Bodø</span>
                </div>
              </div>
            </div>
            <blockquote>
              Vårt mål er å fjerne barrierene{" "}
              <span className="italic">for kompleks eiendomsanalyse,</span> slik
              at team kan fokusere på innsikt og muligheter — fremfor
              tidkrevende manuelt arbeid.
            </blockquote>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section section-divider">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">03 — Teamet</span>
            <div>
              <h2>
                Et lite team. <span className="italic">Mye erfaring.</span>
              </h2>
              <p>
                Vi er bevisst små. Hver klient møter senior rådgiver — fra
                første samtale til signering. Ingen overlevering til junior,
                ingen generelle prosjektkonsulenter.
              </p>
            </div>
          </div>

          <div className="team">
            <div className="member">
              <div
                className="portrait"
                style={{ backgroundColor: "var(--warm-grey-75)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/havard.jpg" alt="Christer Hagen" />
              </div>
              <div className="member-meta">
                <h3>Christer Hagen</h3>
                <div className="role">Partner &amp; daglig leder</div>
              </div>
              <div className="member-contact">
                <a href="tel:+4798453571">
                  <span className="key">Telefon</span> +47 984 53 571
                </a>
                <a href="mailto:Christer@advanti.no">
                  <span className="key">E-post</span> Christer@advanti.no
                </a>
              </div>
            </div>

            <div className="member">
              <div className="portrait" />
              <div className="member-meta">
                <h3>Håvard Walgermo</h3>
                <div className="role">Partner · Næringsmegler</div>
              </div>
              <div className="member-contact">
                <a href="tel:+4798038737">
                  <span className="key">Telefon</span> +47 980 38 737
                </a>
                <a href="mailto:Havard@advanti.no">
                  <span className="key">E-post</span> Havard@advanti.no
                </a>
              </div>
            </div>

            <div className="member">
              <div className="portrait" />
              <div className="member-meta">
                <h3>Senior analytiker</h3>
                <div className="role">Verdivurdering &amp; DCF</div>
              </div>
              <div className="member-contact">
                <Link href="/kontakt">
                  <span className="key">Kontakt</span> Via skjema →
                </Link>
              </div>
            </div>

            <div className="member">
              <div className="portrait" />
              <div className="member-meta">
                <h3>Markedsanalytiker</h3>
                <div className="role">Markedsdata &amp; rapporter</div>
              </div>
              <div className="member-contact">
                <Link href="/kontakt">
                  <span className="key">Kontakt</span> Via skjema →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TALL */}
      <section className="market">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">04 — Tallene</span>
            <div>
              <h2 style={{ color: "var(--warm-white)" }}>
                Advanti i{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  tall.
                </span>
              </h2>
              <p style={{ color: "rgba(243,241,239,0.7)" }}>
                Vi måler oss på resultater. Her er hva vi har levert det siste
                året — og hvor mye av landsdelen vi faktisk dekker.
              </p>
            </div>
          </div>
          <div
            className="market-stats"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            <div className="stat">
              <div className="num-big">+47</div>
              <p className="stat-label">Oppdrag levert i 2025</p>
            </div>
            <div
              className="stat"
              style={{ borderLeft: "1px solid rgba(243,241,239,0.18)" }}
            >
              <div className="num-big">
                4,8<span className="unit">mrd</span>
              </div>
              <p className="stat-label">Eiendomsverdier under rådgivning</p>
            </div>
            <div
              className="stat"
              style={{ borderLeft: "1px solid rgba(243,241,239,0.18)" }}
            >
              <div className="num-big">
                1 400<span className="unit">+</span>
              </div>
              <p className="stat-label">Eiendommer i markedsdatabasen</p>
            </div>
            <div
              className="stat"
              style={{ borderLeft: "1px solid rgba(243,241,239,0.18)" }}
            >
              <div className="num-big">2</div>
              <p className="stat-label">Kontor — Bodø og Alta</p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Vil du jobbe med oss?"
        title={
          <>
            Vi vokser <span className="italic">forsiktig.</span>
          </>
        }
        sub="Vi tar inn én ny senior om året — og ser etter mennesker som tror på data, lokal forankring og lange relasjoner."
        primary={{ label: "Se ledige stillinger", href: "/karriere" }}
        secondary={{ label: "Ta uforpliktende kontakt", href: "/kontakt" }}
      />
    </>
  );
}
