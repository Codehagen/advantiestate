import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { allLocationPosts } from "content-collections";

import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { CtaStrip } from "@/components/site/CtaStrip";
import { ProseShell } from "@/components/site/ProseShell";
import { LocationMdx } from "@/components/locations/LocationMdx";
import { ActiveListingsStrip } from "@/components/eiendommer/ActiveListingsStrip";
import { CityLeadForm } from "@/components/naringsmegler/CityLeadForm";
import { CityLocationPanel } from "@/components/naringsmegler/CityLocationPanel";
import { CityMarketBlock } from "@/components/naringsmegler/CityMarketBlock";
import { PORTAL_CITY_BY_SLUG } from "@/components/naringsmegler/cityMarketData";
import { siteConfig } from "@/app/siteConfig";
import { constructMetadata } from "@/lib/utils";
import { isServiceCity, type ServiceSlug } from "@/lib/service-cities";

/** Picks the value of the first marketStat whose label matches a keyword. */
function findStat(
  stats: { label: string; value: string }[],
  keyword: string,
) {
  return stats.find((s) =>
    s.label.toLowerCase().includes(keyword.toLowerCase()),
  )?.value;
}

// Service grid — the four jobs the design's section 03 lists. The three
// service-city slugs link to /tjenester/<svc>/<city> when the city has
// service pages; rådgivning always links to the generic service page.
// (Named CITY_SERVICE_CARDS to avoid colliding with the canonical SERVICES
// record in src/lib/service-cities.ts.)
const CITY_SERVICE_CARDS: Array<{
  slug: ServiceSlug | "radgivning";
  title: string;
  body: (city: string) => string;
}> = [
  {
    slug: "verdivurdering",
    title: "Verdivurdering",
    body: () =>
      "Markedsbasert vurdering for salg, refinansiering eller strategisk planlegging — underbygget med lokale sammenlignbare.",
  },
  {
    slug: "salg",
    title: "Salg & transaksjon",
    body: () =>
      "Strukturert salgsprosess med profesjonell markedsføring og målrettet interessenthåndtering mot riktige kjøpere.",
  },
  {
    slug: "utleie",
    title: "Utleie",
    body: (city) =>
      `Utleieformidling og reforhandling av leiekontrakter — for både utleiere og leietakere i ${city}-markedet.`,
  },
  {
    slug: "radgivning",
    title: "Markedsdata & rådgivning",
    body: () =>
      "Strategisk rådgivning for eiendomsporteføljer, basert på kvartalsvise markedsdata for Nord-Norge.",
  },
];

// Region-generic «Hvorfor Advanti»-points — used when the city's frontmatter
// doesn't carry city-specific whyPoints (the degraded page is still complete).
function fallbackWhyPoints(city: string) {
  return [
    {
      title: "Forankret i Nord-Norge",
      body: `Vi kjenner markedene i nord fra innsiden — med hovedkontor i Bodø, befaring på stedet og et nettverk av kjøpere, leietakere og rådgivere som dekker ${city}.`,
    },
    {
      title: "Data bak hver pris",
      body: "Prising og rådgivning bygger på vår egen markedsdatabase for næringseiendom i Nord-Norge — ikke magefølelse. Du får tallene som ligger bak vurderingen.",
    },
    {
      title: "Strukturert prosess",
      body: "Fra verdivurdering til signert kontrakt kjører vi en ryddig prosess med klare frister, profesjonell markedsføring og målrettet interessenthåndtering.",
    },
    {
      title: "Senior partner på hvert oppdrag",
      body: "Du jobber direkte med en partner som har ansvaret hele veien — ikke en juniormegler som sendes videre. Kontinuitet og eierskap fra start til slutt.",
    },
  ];
}

// ISR: the ActiveListingsStrip pulls CRM-published covers (Supabase); revalidate
// so a publish appears without a redeploy, same window as /eiendommer.
export const revalidate = 600;

export async function generateStaticParams() {
  return allLocationPosts.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const location = allLocationPosts.find((post) => post.slug === slug);
  if (!location) {
    return;
  }

  const title = location.seoTitle ?? `${location.hero.title} | Advanti`;
  const description = location.seoDescription ?? location.hero.description;

  return constructMetadata({
    title,
    description,
    path: `/naringsmegler/${location.slug}`,
  });
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = allLocationPosts.find((post) => post.slug === slug);
  if (!location) {
    notFound();
  }

  const suggestedNearby = [...allLocationPosts]
    .filter((post) => post.slug !== location.slug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 3);

  const locationUrl = `https://www.advantiestate.no/naringsmegler/${location.slug}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location.geo.latitude},${location.geo.longitude}`;
  const sameAs = [
    siteConfig.contact.social.linkedin,
    siteConfig.contact.social.twitter,
  ].filter(Boolean);

  const areaServed = {
    "@type": location.serviceArea === "Region" ? "AdministrativeArea" : "City",
    name: location.name,
  };

  const hasOfficeAddress =
    !!location.officeAddress?.streetAddress &&
    !!location.officeAddress?.addressLocality;

  const isMainOffice = location.officeAddress?.addressLocality === "Bodø";

  // ── truthfulness gates (autoplan E1/E12) ────────────────────────────────
  // Proof band only with explicitly verified numbers; deals only when ≥2
  // carry verified: true. Draft frontmatter can never reach production.
  const proofStats = location.proofStatsVerified
    ? (location.proofStats ?? [])
    : [];
  const verifiedDeals = (location.referenceDeals ?? []).filter(
    (deal) => deal.verified,
  );
  const showDeals = verifiedDeals.length >= 2;

  const whyPoints =
    location.whyPoints && location.whyPoints.length > 0
      ? location.whyPoints
      : fallbackWhyPoints(location.name);

  const hasPortalData = Boolean(PORTAL_CITY_BY_SLUG[location.slug]);
  const teamAvatars = (location.localTeam ?? [])
    .map((member) => member.image)
    .filter(Boolean) as string[];

  // Computed section numbers — only sections whose presence is known from
  // frontmatter at render time are numbered; async/self-suppressing sections
  // (ActiveListingsStrip) and the CTA stay unnumbered so the sequence never
  // shows gaps (autoplan D-spec 1 / eng F9).
  const numberedSections = [
    "marked",
    "hvorfor",
    "tjenester",
    ...(showDeals ? ["oppdrag"] : []),
    "kontakt",
    "faq",
    ...(suggestedNearby.length > 0 ? ["andre"] : []),
  ];
  const num = (key: string) =>
    String(numberedSections.indexOf(key) + 1).padStart(2, "0");

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Næringsmegler", url: "/naringsmegler" },
          { name: location.name, url: `/naringsmegler/${location.slug}` },
        ]}
      />
      <StructuredData
        type="realEstateAgent"
        data={{
          "@id": `${locationUrl}#realestateagent`,
          name: `Advanti – Næringsmegler i ${location.name}`,
          url: locationUrl,
          description: location.hero.description,
          address: hasOfficeAddress
            ? {
                "@type": "PostalAddress",
                streetAddress: location.officeAddress?.streetAddress,
                addressLocality: location.officeAddress?.addressLocality,
                addressRegion: location.officeAddress?.addressRegion,
                postalCode: location.officeAddress?.postalCode,
                addressCountry: location.officeAddress?.addressCountry,
              }
            : null,
          geo: {
            "@type": "GeoCoordinates",
            latitude: Number.parseFloat(location.geo.latitude),
            longitude: Number.parseFloat(location.geo.longitude),
          },
          hasMap: mapUrl,
          telephone: location.phone,
          email: location.email,
          areaServed: [areaServed],
          sameAs,
        }}
      />
      <StructuredData type="faq" data={{ faqs: location.faqs }} />

      <div className="page-pad" />

      {/* SUBHERO */}
      <section className="subhero">
        <div className="wrap">
          <nav className="crumb" aria-label="Brødsmuler">
            <Link href="/">Hjem</Link>
            <span className="sep">/</span>
            <Link href="/naringsmegler">Næringsmegler</Link>
            <span className="sep">/</span>
            <span className="here">{location.name}</span>
          </nav>

          <div className="subhero-grid">
            <div>
              <span
                className="eyebrow"
                style={{ marginBottom: 28, display: "inline-flex" }}
              >
                {isMainOffice
                  ? `Hovedkontor · ${location.name}`
                  : hasOfficeAddress
                    ? `Lokalkontor · ${location.name}`
                    : location.serviceArea === "Region"
                      ? `Region · ${location.region}`
                      : `By · ${location.region}`}
              </span>
              <h1>
                Næringsmegler <br />
                <span className="italic">i {location.name}.</span>
              </h1>
              <p className="lede">{location.hero.description}</p>
              <div className="hero-cta-row">
                <a href="#kontakt" className="btn btn-dark">
                  Få lokal vurdering <span className="arrow">→</span>
                </a>
                <a href="#marked" className="btn btn-outline">
                  Se markedsdata
                </a>
              </div>
              <div className="cy-trustline">
                {teamAvatars.length > 0 && (
                  <span className="avstack" aria-hidden="true">
                    {/* next/image, NOT background-image: the press-bucket web
                        variants are full-size; unoptimized they'd cost
                        hundreds of KB above the fold for 30px circles. */}
                    {teamAvatars.slice(0, 3).map((src) => (
                      <span key={src}>
                        <Image src={src} alt="" width={30} height={30} />
                      </span>
                    ))}
                  </span>
                )}
                {/* Copy tier keyed on officeAddress, NOT team presence — every
                    city lists its responsible partners, but «lokalt team» is
                    only true where we have an office (autoplan E3). */}
                <span>
                  {hasOfficeAddress ? (
                    <>
                      <b>Lokalt team i {location.name}</b> · svar vanligvis
                      samme dag · uforpliktende
                    </>
                  ) : (
                    <>
                      <b>Dekkes fra hovedkontoret i Bodø</b> · svar vanligvis
                      samme dag · uforpliktende
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="subhero-photo">
              <Image
                src={location.hero.image}
                alt={`Næringseiendom i ${location.name}`}
                fill
                priority
                sizes="(max-width: 980px) 100vw, 45vw"
                style={{ objectFit: "cover" }}
              />
              {location.heroCaption && (
                <span className="photo-cap">
                  <span className="pin" aria-hidden="true" />
                  {location.heroCaption}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROOF BAND — gated bak proofStatsVerified (autoplan E1) */}
      {proofStats.length >= 2 && (
        <section className="cy-proof" data-count={proofStats.length}>
          <div className="wrap">
            {proofStats.map((stat) => (
              <div className="p" key={stat.label}>
                <div className="pv">
                  {stat.value}
                  {stat.unit && <span className="u">{stat.unit}</span>}
                </div>
                <div className="pl">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MARKEDSDATA */}
      <section className="section section-divider" id="marked">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">
              {num("marked")} — Markedet i {location.name}
            </span>
            <div>
              <h2>
                Nøkkeltall og <br />
                <span className="italic">lokale drivere.</span>
              </h2>
              <p>
                Indikative markedsdata for næringseiendom i {location.name},
                oppdatert per Q4 2025. Se hele tidsserien og alle byer i{" "}
                <Link
                  href="/analyseportal"
                  style={{ borderBottom: "1px solid var(--warm-grey)" }}
                >
                  Analyseportalen
                </Link>
                .
              </p>
            </div>
          </div>

          {hasPortalData && <CityMarketBlock slug={location.slug} />}

          <table className="cy-stats-table">
            <thead>
              <tr>
                <th style={{ width: "32%" }}>Indikator</th>
                <th style={{ width: "24%" }}>Nivå</th>
                <th>Kommentar</th>
              </tr>
            </thead>
            <tbody>
              {location.marketStats.map((stat) => (
                <tr key={stat.label}>
                  <td>
                    <span className="label">{stat.label}</span>
                  </td>
                  <td>
                    <span className="val">{stat.value}</span>
                  </td>
                  <td>
                    <span className="detail">{stat.detail ?? ""}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mi-footnote" style={{ marginTop: 24 }}>
            <span className="source">
              Tall er indikative. For nøyaktig vurdering av din eiendom — ta
              kontakt.
            </span>
            <span>Q4 2025 · Advanti markedsdata</span>
          </div>
        </div>
      </section>

      {/* HVORFOR ADVANTI */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cy-why">
            <div className="head-compact" style={{ display: "block" }}>
              <span className="eyebrow">{num("hvorfor")} — Hvorfor Advanti</span>
              <h2 style={{ marginTop: 18 }}>
                Lokalt forankret, <span className="italic">datadrevet.</span>
              </h2>
              <p style={{ marginTop: 16 }}>
                Vi kjenner {location.name}-markedet fra innsiden — og
                underbygger hver anbefaling med data.
              </p>
            </div>
            <div className="cy-why-points">
              {whyPoints.map((point, index) => (
                <div className="cy-why-pt" key={point.title}>
                  <span className="n">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TJENESTER */}
      <section className="section section-divider" style={{ paddingTop: 96 }}>
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">{num("tjenester")} — Tjenester</span>
            <div>
              <h2>
                Hva vi gjør <span className="italic">i {location.name}.</span>
              </h2>
              <p>
                Full bistand på næringseiendom — fra verdivurdering til
                gjennomført transaksjon.
              </p>
            </div>
          </div>

          <div className="cy-services">
            {CITY_SERVICE_CARDS.map((service, index) => {
              const cityLink =
                service.slug !== "radgivning" && isServiceCity(location.slug);
              const href = cityLink
                ? `/tjenester/${service.slug}/${location.slug}`
                : `/tjenester/${service.slug}`;
              return (
                <Link className="cy-svc" href={href} key={service.slug}>
                  <span className="num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>
                      {service.title}
                      {cityLink ? ` i ${location.name}` : ""}
                    </h3>
                    <p>{service.body(location.name)}</p>
                    <span className="go">
                      Les mer <span className="arrow">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* BODY + SIDEBAR */}
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="ks-article">
            <article className="ks-art-body" style={{ maxWidth: 720 }}>
              <ProseShell>
                <LocationMdx code={location.mdx} />
              </ProseShell>
            </article>

            <aside className="ks-toc" style={{ fontSize: 14 }}>
              {hasOfficeAddress && (
                <div
                  className="ks-toc"
                  style={{
                    position: "static",
                    padding: "24px 0 0",
                    marginTop: 0,
                  }}
                >
                  <div className="toc-label">
                    {isMainOffice ? "Hovedkontor" : "Lokalkontor"} · Advanti
                  </div>
                  <address
                    className="addr"
                    style={{
                      fontStyle: "normal",
                      fontSize: 13.5,
                      color: "var(--warm-grey-85)",
                      lineHeight: 1.6,
                      marginBottom: 16,
                    }}
                  >
                    {location.officeAddress?.streetAddress}
                    <br />
                    {location.officeAddress?.postalCode}{" "}
                    {location.officeAddress?.addressLocality}
                  </address>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      fontSize: 13.5,
                    }}
                  >
                    <a href={`tel:${location.phone.replace(/\s/g, "")}`}>
                      {location.phone}
                    </a>
                    {location.email && (
                      <a href={`mailto:${location.email}`}>{location.email}</a>
                    )}
                  </div>
                </div>
              )}

              {location.localTeam && location.localTeam.length > 0 && (
                <div
                  className="ks-toc"
                  style={{
                    position: "static",
                    padding: "24px 0",
                    borderTop: "var(--hairline)",
                    marginTop: 0,
                  }}
                >
                  <div className="toc-label">
                    {hasOfficeAddress ? "Lokalt team" : "Ansvarlig team"}
                  </div>
                  <div className="cy-side-team">
                    {location.localTeam.map((member) => {
                      const card = (
                        <>
                          {member.image ? (
                            <div
                              className="av"
                              style={{
                                backgroundImage: `url('${member.image}')`,
                              }}
                            />
                          ) : (
                            <div className="av" />
                          )}
                          <div>
                            <div className="name">{member.name}</div>
                            <div className="role">{member.role}</div>
                          </div>
                        </>
                      );
                      return member.slug ? (
                        <Link
                          key={member.name}
                          className="member"
                          href={`/personer/${member.slug}`}
                        >
                          {card}
                        </Link>
                      ) : (
                        <div key={member.name} className="member">
                          {card}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div
                style={{ padding: "24px 0", borderTop: "var(--hairline)" }}
              >
                <div className="toc-label" style={{ marginBottom: 14 }}>
                  Eksempel fra {location.name}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--warm-grey-85)",
                    lineHeight: 1.55,
                    marginBottom: 10,
                  }}
                >
                  {location.localCaseStudy.summary}
                </p>
                <Link
                  href={location.localCaseStudy.href}
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  {location.localCaseStudy.title} →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* UTVALGTE OPPDRAG — gated: ≥2 verifiserte oppdrag (autoplan E12) */}
      {showDeals && (
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
              <span className="eyebrow">
                {num("oppdrag")} — Utvalgte oppdrag
              </span>
              <div>
                <h2>
                  Nylige oppdrag <br />
                  <span className="italic">
                    i {location.name}-regionen.
                  </span>
                </h2>
                <p>
                  Et utvalg av transaksjoner og oppdrag vi har gjennomført
                  lokalt.
                </p>
              </div>
            </div>

            <div
              className="cy-deals"
              data-count={Math.min(verifiedDeals.length, 3)}
            >
              {verifiedDeals.slice(0, 3).map((deal) => (
                <article className="cy-deal" key={deal.title}>
                  <div className={`dimg${deal.image ? "" : " no-photo"}`}>
                    <span className="dtag">{deal.tag}</span>
                    {deal.image && (
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        fill
                        sizes="(max-width: 860px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="dbody">
                    <span className="drole">{deal.role}</span>
                    <h3>{deal.title}</h3>
                    <div className="dstats">
                      {deal.stats.map((stat) => (
                        <div key={stat.label}>
                          <span className="v">{stat.value}</span>
                          <span className="l">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="cases-foot" style={{ marginTop: 40 }}>
              <span className="count">
                Oppdrag gjennomført i {location.name}-regionen
              </span>
              <Link href="/eiendommer" className="service-link">
                Se alle eiendommer <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* LEAD FORM + LOKASJON */}
      <section className="section section-divider" id="kontakt">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">{num("kontakt")} — Få vurdering</span>
            <div>
              <h2>
                Be om en lokal <span className="italic">verdivurdering.</span>
              </h2>
              <p>
                Fortell oss kort om eiendommen din i {location.name}, så tar
                en av partnerne kontakt — vanligvis samme dag.
              </p>
            </div>
          </div>

          <div className="cy-lead">
            <CityLeadForm
              cityName={location.name}
              slug={location.slug}
              phone={location.phone}
            />
            <CityLocationPanel
              cityName={location.name}
              isMainOffice={isMainOffice}
              office={
                hasOfficeAddress && location.officeAddress
                  ? {
                      streetAddress: location.officeAddress.streetAddress,
                      postalCode: location.officeAddress.postalCode,
                      addressLocality: location.officeAddress.addressLocality,
                      addressRegion: location.officeAddress.addressRegion,
                    }
                  : null
              }
              geo={(() => {
                // geo fields are free-form frontmatter strings — a decimal
                // comma typo would crash Leaflet client-side with [NaN, NaN].
                const lat = Number.parseFloat(location.geo.latitude);
                const lng = Number.parseFloat(location.geo.longitude);
                return hasOfficeAddress &&
                  Number.isFinite(lat) &&
                  Number.isFinite(lng)
                  ? { latitude: lat, longitude: lng }
                  : null;
              })()}
              mapUrl={mapUrl}
              phone={location.phone}
              email={location.email}
              openingHours={location.openingHours}
            />
          </div>
        </div>
      </section>

      {/* FAQ — mørk seksjon (fargene bor i .cy-faq-section, advanti-design.css) */}
      <section className="section cy-faq-section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">
              {num("faq")} — Ofte stilte spørsmål
            </span>
            <div>
              <h2>
                Spørsmål om næringsmegling <br />
                <span className="italic">i {location.name}.</span>
              </h2>
              <p>
                Finner du ikke svaret? Ta kontakt — vi setter av tid til en
                uforpliktende samtale uansett.
              </p>
            </div>
          </div>

          <div className="faq faq-dark" style={{ maxWidth: 920 }}>
            {location.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <div className="a">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ANDRE BYER */}
      {suggestedNearby.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="head-compact">
              <span className="eyebrow">{num("andre")} — Andre markeder</span>
              <div>
                <h2>
                  Vi dekker også <span className="italic">disse byene.</span>
                </h2>
              </div>
            </div>

            <div
              className="cy-grid"
              style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
              {suggestedNearby.map((nearby, index) => {
                const primeYield = findStat(
                  nearby.marketStats,
                  "prime yield",
                );
                const nearbyVacancy = findStat(
                  nearby.marketStats,
                  "ledighet",
                );
                return (
                  <Link
                    key={nearby.slug}
                    className="cy-card"
                    href={`/naringsmegler/${nearby.slug}`}
                  >
                    <div className="cy-image">
                      <Image
                        src={nearby.hero.image}
                        alt={`${nearby.name} næringseiendom`}
                        fill
                        sizes="(max-width: 980px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                      <span className="label">
                        _0{index + 1} · {nearby.region}
                      </span>
                    </div>
                    <div>
                      <span className="reg">{nearby.region}</span>
                      <h3>{nearby.name}</h3>
                    </div>
                    {(primeYield || nearbyVacancy) && (
                      <div className="stats">
                        {primeYield && (
                          <div>
                            <span className="v">{primeYield}</span>
                            <span className="l">Prime yield</span>
                          </div>
                        )}
                        {nearbyVacancy && (
                          <div>
                            <span className="v">{nearbyVacancy}</span>
                            <span className="l">Ledighet</span>
                          </div>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <ActiveListingsStrip
        eyebrow={`Aktuelle oppdrag · ${location.name}`}
        title={
          <>
            Eiendommer vi formidler{" "}
            <span className="italic">i {location.name}.</span>
          </>
        }
        lede="Pluss off-market-portefølje for kvalifiserte investorer."
        city={location.slug}
        limit={3}
      />

      <CtaStrip
        eyebrow={`Næringsmegler i ${location.name}`}
        title={
          <>
            Få lokal vurdering <br />
            <span className="italic">på din eiendom.</span>
          </>
        }
        sub="Vi setter av tid til en uforpliktende samtale om eiendommen din — basert på lokale markedsdata og konkret erfaring."
        primary={{ label: "Send henvendelse", href: "#kontakt" }}
        secondary={{ label: location.phone, href: `tel:${location.phone.replace(/\s/g, "")}` }}
      />
    </>
  );
}
