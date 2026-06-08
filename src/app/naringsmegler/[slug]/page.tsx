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
import { siteConfig } from "@/app/siteConfig";
import { constructMetadata } from "@/lib/utils";
import {
  SERVICE_SLUGS,
  isServiceCity,
  getServiceDef,
} from "@/lib/service-cities";

/** Picks the value of the first marketStat whose label matches a keyword. */
function findStat(
  stats: { label: string; value: string }[],
  keyword: string,
) {
  return stats.find((s) =>
    s.label.toLowerCase().includes(keyword.toLowerCase()),
  )?.value;
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
  const vacancy = findStat(location.marketStats, "ledighet");
  const leadMember = location.localTeam?.[0];
  // `email` is present in the location frontmatter but not declared in the
  // content-collection schema; read it without changing the data layer.
  const locationEmail = (location as { email?: string }).email;

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
          email: locationEmail,
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
                <Link href="/kontakt" className="btn btn-dark">
                  Få lokal vurdering <span className="arrow">→</span>
                </Link>
                <Link href="#marked" className="btn btn-outline">
                  Se markedsdata
                </Link>
              </div>
              <div className="subhero-meta">
                {hasOfficeAddress ? (
                  <div>
                    <span className="v">
                      {isMainOffice ? "Hovedkontor" : "Lokalkontor"}
                    </span>
                    <span className="l">
                      {location.officeAddress?.streetAddress}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="v">Regionalt</span>
                    <span className="l">Dekker {location.name}</span>
                  </div>
                )}
                <div>
                  <span className="v">{location.phone}</span>
                  <span className="l">
                    {leadMember
                      ? `${leadMember.name}, ${leadMember.role}`
                      : "Lokal rådgiver"}
                  </span>
                </div>
                {vacancy && (
                  <div>
                    <span className="v">{vacancy}</span>
                    <span className="l">Ledighet · Q4 2025</span>
                  </div>
                )}
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
            </div>
          </div>
        </div>
      </section>

      {/* MARKEDSDATA */}
      <section className="section section-divider" id="marked">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Markedet i {location.name}</span>
            <div>
              <h2>
                Nøkkeltall og <br />
                <span className="italic">lokale drivere.</span>
              </h2>
              <p>
                Indikative markedsdata og lokale drivere som påvirker verdien
                av næringseiendom i {location.name}. Kvartalsvis oppdatert per
                Q4 2025.
              </p>
            </div>
          </div>

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

      {/* BODY + SIDEBAR */}
      <section className="section" style={{ paddingTop: 24 }}>
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
                    {locationEmail && (
                      <a href={`mailto:${locationEmail}`}>{locationEmail}</a>
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
                  <div className="toc-label">Lokalt team</div>
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

      {/* FAQ */}
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
            <span className="eyebrow">02 — Ofte stilte spørsmål</span>
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

          <div className="faq" style={{ maxWidth: 920 }}>
            {location.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <div className="a">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* TJENESTER I BYEN — intern lenking til tjeneste×by-sidene */}
      {isServiceCity(location.slug) && (
        <section className="section section-divider">
          <div className="wrap">
            <div className="head-compact">
              <span className="eyebrow">Tjenester i {location.name}</span>
              <div>
                <h2>
                  Hva vi kan gjøre{" "}
                  <span className="italic">i {location.name}.</span>
                </h2>
              </div>
            </div>

            <div className="feat-3">
              {SERVICE_SLUGS.map((slug) => {
                const svc = getServiceDef(slug);
                if (!svc) return null;
                return (
                  <Link
                    key={slug}
                    className="feat"
                    href={`/tjenester/${slug}/${location.slug}`}
                  >
                    <h3>
                      {svc.label} i {location.name}
                    </h3>
                    <p>{svc.heroLede(location.name)}</p>
                    <span className="eyebrow no-rule">Les mer →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ANDRE BYER */}
      {suggestedNearby.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="head-compact">
              <span className="eyebrow">03 — Andre markeder</span>
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
        primary={{ label: "Send henvendelse", href: "/kontakt" }}
        secondary={{ label: "Ta kontakt med teamet", href: "/personer" }}
      />
    </>
  );
}
