import { allCustomersPosts } from "content-collections";
import Image from "next/image";
import Link from "next/link";

import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  path: "/kunder",
  title: "Våre Kunder og Prosjekter - Advanti",
  description:
    "Se eksempler på vellykkede transaksjoner og prosjekter Advanti har gjennomført for våre kunder innen næringseiendom i Nord-Norge.",
});

// Editorial presentation metadata for the oppdrag grid. Falls back gracefully
// for any customer story not listed here — the card still renders from the
// content collection.
const PRESENTATION: Record<
  string,
  {
    image: string;
    imageAlt: string;
    category: string;
    year: string;
    kpis: { value: string; label: string }[];
  }
> = {
  "morkvedbadet-bodo": {
    image: "/building/pexels-abshky-18567185.jpg",
    imageAlt: "Mørkvedbadet, Bodø (illustrasjonsfoto)",
    category: "Salg · Kultur og idrett",
    year: "2025",
    kpis: [
      { value: ">60 MNOK", label: "Transaksjonsverdi" },
      { value: "3 005 m²", label: "BRA" },
      { value: "5 mnd", label: "Tid til salg" },
    ],
  },
  "naeringspark-helgeland": {
    image: "/building/pexels-expect-best-79873-351262.jpg",
    imageAlt: "Lager- og logistikkpark (illustrasjonsfoto)",
    category: "Salg · Lager og logistikk",
    year: "2025",
    kpis: [
      { value: "35–40 MNOK", label: "Transaksjonsverdi" },
      { value: "~8 %", label: "Yield" },
      { value: "100 %", label: "Utleiegrad" },
    ],
  },
  "reforhandling-kontor-bodo": {
    image: "/building/pexels-pixabay-248877.jpg",
    imageAlt: "Kontorbygg (illustrasjonsfoto)",
    category: "Reforhandling · Kontor",
    year: "Eksempel",
    kpis: [
      { value: "1 500 → 3 000", label: "kr/m² i årsleie" },
      { value: "2×", label: "Leienivå" },
      { value: "Lengre", label: "Bindingstid" },
    ],
  },
};

const ORDER: string[] = [
  "morkvedbadet-bodo",
  "naeringspark-helgeland",
  "reforhandling-kontor-bodo",
];

export default function Customers() {
  // Render all customer stories, in a stable, intentional order; include any
  // not covered by the explicit order.
  const stories = [
    ...ORDER.map((slug) => allCustomersPosts.find((p) => p.slug === slug)),
    ...allCustomersPosts.filter((p) => !ORDER.includes(p.slug)),
  ].filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Utvalgte oppdrag" }]}
        eyebrow="Case studies · 2024–2025"
        title={
          <>
            Et utvalg av oppdrag <br />
            <span className="italic">vi er stolte av.</span>
          </>
        }
        lede="Konkrete eksempler på hvordan vi har levert resultater for klienter i Nord-Norge — salg, verdivurdering, utleieformidling og strategisk rådgivning. Tallene er reelle der ikke annet er merket."
      />

      {/* KPI BAND */}
      <section className="section-tight">
        <div className="wrap">
          <div className="mi-kpis">
            <div className="mi-kpi">
              <div className="label">Oppdrag levert</div>
              <div className="val">
                +47<span className="unit">i 2025</span>
              </div>
              <div className="delta">
                <span className="arrow-up">▲ 24 %</span> mot 2024
              </div>
            </div>
            <div className="mi-kpi">
              <div className="label">Transaksjonsvolum</div>
              <div className="val">
                3,2<span className="unit">mrd</span>
              </div>
              <div className="delta">Salgsverdi · 2025</div>
            </div>
            <div className="mi-kpi">
              <div className="label">Gjentakende klienter</div>
              <div className="val">
                71<span className="unit">%</span>
              </div>
              <div className="delta">Av nye oppdrag i 2025</div>
            </div>
            <div className="mi-kpi">
              <div className="label">Snittpris vs. estimat</div>
              <div className="val">
                +12<span className="unit">%</span>
              </div>
              <div className="delta">Over første verdiestimat</div>
            </div>
          </div>
        </div>
      </section>

      {/* OPPDRAG GRID */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Utvalg</span>
            <div>
              <h2>
                Hva vi har <span className="italic">gjort for klienter.</span>
              </h2>
              <p>
                Klikk på et oppdrag for å se full case study — utfordring,
                løsning, resultater og hvordan vi jobbet sammen med klienten.
              </p>
            </div>
          </div>

          {stories.length === 0 ? (
            <p className="lead" style={{ maxWidth: 560, marginTop: 24 }}>
              Vi publiserer utvalgte case studies fortløpende etter hvert som
              oppdrag sluttføres og kunden godkjenner publisering.{" "}
              <Link
                href="/kontakt"
                style={{
                  color: "var(--warm-grey)",
                  borderBottom: "1px solid",
                }}
              >
                Ta kontakt
              </Link>{" "}
              for å høre mer om hvordan vi jobber.
            </p>
          ) : (
          <div className="op-grid">
            {stories.map((story) => {
              const pres = PRESENTATION[story.slug];
              return (
                <Link
                  key={story.slug}
                  className="op-card"
                  href={`/kunder/${story.slug}`}
                >
                  {pres?.image && (
                    <div className="op-img">
                      <Image
                        src={pres.image}
                        alt={pres.imageAlt}
                        width={480}
                        height={600}
                        sizes="(max-width: 768px) 100vw, 480px"
                      />
                    </div>
                  )}
                  <div className="op-meta">
                    <div className="top">
                      <span>{pres?.category ?? story.companyIndustry}</span>
                      <span>
                        {pres?.year ?? story.publishedAt.slice(0, 4)}
                      </span>
                    </div>
                    <h3>{story.title}</h3>
                    <p className="sum">{story.summary}</p>
                    {pres?.kpis && (
                      <div className="kpis">
                        {pres.kpis.map((kpi) => (
                          <div key={kpi.label}>
                            <span className="v">{kpi.value}</span>
                            <span className="l">{kpi.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          )}

          <div className="mi-footnote" style={{ marginTop: 48 }}>
            <span className="source">
              Klientnavn er anonymisert der ikke offentlig godkjent for
              publisering. Tallene er bekreftet via tinglysing, kontrakt eller
              direkte fra part. Case merket «Eksempel» er illustrasjoner av
              arbeidsmetodikk, ikke konkrete transaksjoner.
            </span>
            <span>
              <Link
                href="/kontakt"
                style={{
                  color: "var(--warm-grey)",
                  borderBottom: "1px solid",
                }}
              >
                Bli neste case →
              </Link>
            </span>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Klar for å bli neste case?"
        title={
          <>
            Vi behandler hvert oppdrag <br />
            <span className="italic">som det er vårt eget.</span>
          </>
        }
        sub="Senior partner på saken fra første samtale til signert avtale. Konkret rådgivning, dokumenterte resultater."
        primary={{ label: "Ta kontakt", href: "/kontakt" }}
        secondary={{ label: "Se våre tjenester", href: "/tjenester" }}
      />
    </>
  );
}
