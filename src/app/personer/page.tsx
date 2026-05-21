import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { constructMetadata } from "@/lib/utils";
import { allPersonPosts } from "content-collections";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Vårt Team | Advanti",
  description:
    "Møt teamet bak Advanti - erfarne næringsmeglere og rådgivere med dyp kompetanse innen næringseiendom i Nord-Norge.",
});

// Per-person presentation metadata used by the editorial team-card design.
// Falls back gracefully for any person not listed here.
const PRESENTATION: Record<
  string,
  { office: string; specialty: string }
> = {
  "christer-hagen": {
    office: "Bodø",
    specialty: "Salg · Verdivurdering · Investeringsanalyse",
  },
  "mathias-nilssen": {
    office: "Bodø",
    specialty: "Strategisk rådgivning · Relasjonsbygging",
  },
  "daniel-adamsen": {
    office: "Alta",
    specialty: "Salg · Verdivurdering",
  },
  "ole-ostensen": {
    office: "NHH · Bergen",
    specialty: "Jus · DD",
  },
  "havard-nome": {
    office: "Alta",
    specialty: "Marked Finnmark · Utleie · Analyse",
  },
  "tobias-bronder": {
    office: "Bodø",
    specialty: "Næringseiendom · Rådgivning",
  },
};

export default function PersonerPage() {
  // Render all team members, in a stable, intentional order.
  const order = [
    "christer-hagen",
    "mathias-nilssen",
    "daniel-adamsen",
    "ole-ostensen",
    "havard-nome",
    "tobias-bronder",
  ];
  const people = order
    .map((slug) => allPersonPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Include any persons not covered by the explicit order.
  for (const p of allPersonPosts) {
    if (!people.includes(p)) people.push(p);
  }

  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Vårt team" }]}
        eyebrow="Vårt team · 6 senior partnere"
        title={
          <>
            Erfarne rådgivere <br />
            <span className="italic">som svarer telefonen selv.</span>
          </>
        }
        lede="Vi er et lite, dedikert team med 70+ års samlet erfaring fra næringseiendomsmarkedet. Hver klient møter senior rådgiver — fra første samtale til signert avtale."
      />

      {/* TEAM GRID */}
      <section className="section-tight" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="tm-grid">
            {people.map((person, index) => {
              const pres = PRESENTATION[person.slug ?? ""];
              const num = `_0${index + 1}`;
              return (
                <Link
                  key={person.slug}
                  className="tm-card"
                  href={`/personer/${person.slug}`}
                >
                  <div className="tm-portrait">
                    <span className="num">{num}</span>
                    {pres?.office && (
                      <span className="office">{pres.office}</span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={person.avatar} alt={person.name} />
                  </div>
                  <div className="tm-meta">
                    <h3>{person.name}</h3>
                    <div className="role">{person.role}</div>
                  </div>
                  <div className="tm-contact">
                    <span>{person.phone}</span>
                    <span>{person.email}</span>
                    {pres?.specialty && (
                      <div className="specialty">{pres.specialty}</div>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Vi vokser-kort: oppfordrer til å sende åpen søknad */}
            <Link
              className="tm-card"
              href="/kontakt"
              style={{
                background: "var(--accent-faint)",
                alignItems: "stretch",
              }}
            >
              <div
                className="tm-portrait"
                style={{
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "none",
                }}
              >
                <span
                  className="num"
                  style={{
                    background: "var(--warm-grey)",
                    position: "static",
                    padding: "8px 14px",
                  }}
                >
                  _0{people.length + 1}
                </span>
              </div>
              <div className="tm-meta" style={{ padding: "4px 0" }}>
                <h3 style={{ fontStyle: "italic", fontWeight: 300 }}>
                  Neste partner?
                </h3>
                <div className="role">Vi vokser forsiktig.</div>
              </div>
              <div className="tm-contact">
                <span
                  style={{ color: "var(--warm-grey-85)", fontSize: 13.5 }}
                >
                  Vi tar inn én ny senior i året. Send oss en åpen henvendelse.
                </span>
                <span
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  Send henvendelse →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section>
        <div className="wrap">
          <div className="tm-philo">
            <div>
              <span
                className="eyebrow"
                style={{ marginBottom: 20, display: "inline-flex" }}
              >
                Vår filosofi
              </span>
              <h2>
                Bevisst små. <br />
                <span className="italic">Mye senior erfaring.</span>
              </h2>
            </div>
            <div className="body">
              <p>
                Vi er ikke et meglerhus med titalls juniorrådgivere. Vi er seks
                partnere som tar oppdrag selv — og det er bevisst.{" "}
                <strong>
                  Du møter ikke en juniorkonsulent i forhandlingen
                </strong>
                , du møter den samme personen du snakket med på første samtale.
              </p>
              <p>
                Det betyr at hvert oppdrag er begrenset til hva seks mennesker
                faktisk kan levere godt på samtidig. Vi takker nei til oppdrag
                der vi ikke har kapasitet — eller der vi tror andre kan løse det
                bedre.
              </p>
              <p>
                Resultatet er klienter som kommer tilbake. Over 70 % av nye
                oppdrag i 2025 kom fra eksisterende relasjoner eller direkte
                anbefalinger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM NUMBERS */}
      <section className="market">
        <div className="wrap">
          <div className="head-compact">
            <span
              className="eyebrow"
              style={{ color: "rgba(243,241,239,0.7)" }}
            >
              Teamet i tall
            </span>
            <div>
              <h2 style={{ color: "var(--warm-white)" }}>
                Hva 70 års samlet{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  erfaring leverer.
                </span>
              </h2>
              <p style={{ color: "rgba(243,241,239,0.7)" }}>
                Vi måler oss på hva vi har gjennomført — ikke på
                pressemeldinger.
              </p>
            </div>
          </div>
          <div
            className="market-stats"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            <div className="stat">
              <div className="num-big">6</div>
              <p className="stat-label">Senior partnere</p>
            </div>
            <div
              className="stat"
              style={{ borderLeft: "1px solid rgba(243,241,239,0.18)" }}
            >
              <div className="num-big">
                70<span className="unit">år+</span>
              </div>
              <p className="stat-label">Samlet bransjeerfaring</p>
            </div>
            <div
              className="stat"
              style={{ borderLeft: "1px solid rgba(243,241,239,0.18)" }}
            >
              <div className="num-big">
                +2,1<span className="unit">mrd</span>
              </div>
              <p className="stat-label">Transaksjonsvolum siste 5 år</p>
            </div>
            <div
              className="stat"
              style={{ borderLeft: "1px solid rgba(243,241,239,0.18)" }}
            >
              <div className="num-big">2</div>
              <p className="stat-label">Kontor — Bodø &amp; Alta</p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Ønsker du å snakke med teamet?"
        title={
          <>
            Ta en uforpliktende <br />
            <span className="italic">samtale med en senior partner.</span>
          </>
        }
        sub="Vi setter av tid til en åpen samtale — uten forpliktelser. Du bestemmer hvem av oss du vil snakke med."
        primary={{ label: "Send henvendelse", href: "/kontakt" }}
        secondary={{ label: "+47 984 53 571", href: "tel:+4798453571" }}
      />
    </>
  );
}
