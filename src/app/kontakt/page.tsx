import { allPersonPosts } from "content-collections";

import ContactUsForm from "@/components/ContactUsForm";
import { SubHero } from "@/components/site/SubHero";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Kontakt Advanti for Salg og Verdivurdering av Næringseiendom",
  description:
    "Trenger du hjelp med salg eller verdivurdering av næringseiendom i Nord-Norge? Kontakt Advanti for en uforpliktende samtale. Vi hjelper eiendomsbesittere med å oppnå best mulig resultat.",
});

// Direkte kontaktpersoner. Navn, tittel, bilde, e-post og telefon hentes fra
// people-samlingen (src/content/people) slik at kortene ikke kan drifte fra
// /personer — kun kontoret er sidespesifikt.
const CONTACT_PEOPLE = [
  { slug: "christer-hagen", office: "Bodø" },
  { slug: "mathias-nilssen", office: "Bodø" },
  { slug: "havard-nome", office: "Alta" },
];

export default function KontaktPage() {
  const team = CONTACT_PEOPLE.map(({ slug, office }) => {
    const person = allPersonPosts.find((p) => p.slug === slug);
    return person ? { ...person, office } : null;
  }).filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Kontakt" }]}
        eyebrow="05 — Kontakt"
        title={
          <>
            Ta kontakt for en <br />
            <span className="italic">uforpliktende samtale.</span>
          </>
        }
        lede="Enten du vurderer å selge, kjøpe eller bare ønsker en oppdatert verdivurdering — vi tar en samtale uten forpliktelser."
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            marginTop: 28,
            flexWrap: "wrap",
          }}
        >
          <a
            href="#kontakt-skjema"
            className="btn btn-dark"
            style={{ fontSize: 15, fontWeight: 500, textDecoration: "none" }}
          >
            Send henvendelse →
          </a>
          <a
            href="tel:+4798453571"
            style={{
              fontSize: 22,
              fontWeight: 500,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
              textDecoration: "none",
            }}
          >
            +47 984 53 571
          </a>
        </div>
      </SubHero>

      {/* CONTACT GRID */}
      <section className="section section-divider" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <div className="contact-grid">
            {/* LEFT: form */}
            <div className="contact-form" id="kontakt-skjema">
              <h2>Send oss en henvendelse.</h2>
              <p className="sub">Vi svarer innen 24 timer på virkedager.</p>
              <ContactUsForm />
            </div>

            {/* RIGHT: offices + next steps */}
            <aside>
              <div className="office">
                <div className="pre">Kontor · 01</div>
                <h3>Bodø</h3>
                <address className="addr">
                  Dronningens gate 18
                  <br />
                  8006 Bodø
                </address>
                <div className="ch">
                  <div className="contact-person">
                    <span className="contact-person-name">Christer Hagen</span>
                    <div className="contact-person-links">
                      <a href="tel:+4798453571">+47 984 53 571</a>
                      <a href="mailto:Christer@advanti.no">Christer@advanti.no</a>
                    </div>
                  </div>
                  <div className="contact-person">
                    <span className="contact-person-name">Mathias Nilsen</span>
                    <div className="contact-person-links">
                      <a href="tel:+4790519901">+47 905 19 901</a>
                      <a href="mailto:mathias@advanti.no">mathias@advanti.no</a>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener"
                    className="contact-maps"
                  >
                    <span className="key">Veibeskrivelse</span>
                    <span>Google Maps →</span>
                  </a>
                </div>
              </div>

              <div className="office">
                <div className="pre">Kontor · 02</div>
                <h3>Alta</h3>
                <address className="addr">
                  AMFI Alta, Markedsgata 21/25
                  <br />
                  9510 Alta
                </address>
                <div className="ch">
                  <div className="contact-person">
                    <span className="contact-person-name">Håvard Walgermo</span>
                    <div className="contact-person-links">
                      <a href="tel:+4798038737">+47 980 38 737</a>
                      <a href="mailto:Havard@advanti.no">Havard@advanti.no</a>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener"
                    className="contact-maps"
                  >
                    <span className="key">Veibeskrivelse</span>
                    <span>Google Maps →</span>
                  </a>
                </div>
              </div>

              <div className="next-steps">
                <h3>Hva skjer videre?</h3>
                <ol>
                  <li>
                    <span className="n">01</span>
                    <div>
                      <h4>Du sender inn henvendelsen</h4>
                      <p>
                        Fyll ut skjemaet med opplysninger og hvilken tjeneste du
                        er interessert i.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="n">02</span>
                    <div>
                      <h4>Vi tar kontakt</h4>
                      <p>
                        Vi ringer eller skriver innen 24 timer for en kort,
                        uforpliktende avklaring.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="n">03</span>
                    <div>
                      <h4>Skreddersydd forslag</h4>
                      <p>
                        Basert på din situasjon lager vi et konkret forslag til
                        hvordan vi kan hjelpe.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* TRYGG-RAD */}
      <section
        style={{
          background: "var(--accent-faint)",
          borderTop: "var(--hairline)",
          borderBottom: "var(--hairline)",
          padding: "56px 0",
        }}
      >
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                24 t
              </div>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 13.5,
                  color: "var(--warm-grey-85)",
                  letterSpacing: "0.04em",
                }}
              >
                SVARTID PÅ HENVENDELSER
              </p>
            </div>
            <div
              style={{
                borderLeft: "var(--hairline)",
                borderRight: "var(--hairline)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Senior
              </div>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 13.5,
                  color: "var(--warm-grey-85)",
                  letterSpacing: "0.04em",
                }}
              >
                PARTNER PÅ HVER SAK
              </p>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Lokalt
              </div>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 13.5,
                  color: "var(--warm-grey-85)",
                  letterSpacing: "0.04em",
                }}
              >
                EKSPERTER PÅ NORD-NORGE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM CARD */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Snakk direkte</span>
            <div>
              <h2>
                Foretrekker du å <span className="italic">ringe?</span>
              </h2>
              <p>Du kan også ringe oss direkte.</p>
            </div>
          </div>

          <div
            className="team"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 48 }}
          >
            {team.map((person) => (
              <div
                key={person.slug}
                className="member"
                style={{
                  flexDirection: "row",
                  gap: 24,
                  alignItems: "center",
                }}
              >
                <div
                  className="portrait"
                  style={{
                    width: 140,
                    height: 175,
                    flexShrink: 0,
                    backgroundImage: `url('${person.avatar}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--warm-grey-85)",
                    }}
                  >
                    {person.office}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 400,
                      letterSpacing: "-0.018em",
                    }}
                  >
                    {person.name}
                  </h3>
                  <div
                    style={{
                      fontSize: 14,
                      color: "var(--warm-grey-85)",
                      marginBottom: 12,
                    }}
                  >
                    {person.role}
                  </div>
                  <a
                    href={`tel:${person.phone.replace(/\s+/g, "")}`}
                    style={{ fontSize: 15, fontWeight: 500 }}
                  >
                    {person.phone}
                  </a>
                  {person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      style={{ fontSize: 14.5, color: "var(--warm-grey-85)" }}
                    >
                      {person.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
