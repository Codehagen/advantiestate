import Link from "next/link";

import { SubHero } from "@/components/site/SubHero";
import { CtaStrip } from "@/components/site/CtaStrip";
import { PhotoBand } from "@/components/site/PhotoBand";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { ActiveListingsStrip } from "@/components/eiendommer/ActiveListingsStrip";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import {
  SERVICE_SLUGS,
  getServiceCityLocation,
  getServiceDef,
  type ServiceDef,
} from "@/lib/service-cities";

/** Picks the value of the first marketStat whose label matches a keyword. */
function findStat(
  stats: { label: string; value: string }[],
  keyword: string,
): string | undefined {
  return stats.find((s) =>
    s.label.toLowerCase().includes(keyword.toLowerCase()),
  )?.value;
}

/**
 * Shared renderer for every /tjenester/{service}/{by} landing page. Combines the
 * static per-service copy (process, value props, FAQ) with the city's real
 * market data and active mandates so each page carries substantial unique
 * content rather than a templated city-name swap.
 */
export function ServiceCityPage({
  serviceSlug,
  citySlug,
}: {
  serviceSlug: string;
  citySlug: string;
}) {
  const service = getServiceDef(serviceSlug);
  const location = getServiceCityLocation(citySlug);
  // Routes gate on notFound() before rendering; this guard is a type narrow.
  if (!service || !location) return null;

  const city = location.name;
  const region = location.region;
  const primeYield = findStat(location.marketStats, "prime yield");
  const officeHigh = findStat(location.marketStats, "kontorleie høy");
  const vacancy = findStat(location.marketStats, "ledighet");
  const secondaryYield = findStat(location.marketStats, "sekundær");

  const metaRow = [
    { value: primeYield ?? "—", label: "Prime yield" },
    { value: officeHigh ?? "—", label: "Kontorleie (høy std.)" },
    vacancy
      ? { value: vacancy, label: "Ledighet" }
      : { value: secondaryYield ?? "—", label: "Sekundær yield" },
  ];

  const introParagraphs = service.intro(city, region, primeYield);

  // Service FAQ + two city-specific questions for genuinely local depth.
  const faqItems: FaqItem[] = [
    ...service.baseFaqs,
    {
      question: `Hvilke områder dekker Advanti ved ${service.label.toLowerCase()} i ${city}?`,
      answer: `Vi bistår med ${service.keyword} i ${city} og ellers i ${region} og Nord-Norge. Ta kontakt for en lokal vurdering.`,
    },
    {
      question: `Hvordan kommer jeg i gang med ${service.label.toLowerCase()} i ${city}?`,
      answer: `Ta kontakt for en uforpliktende samtale. Vi setter sammen et team som kjenner ${city} og segmentet ditt, og legger en konkret plan.`,
    },
  ];

  // Sibling services in the same city + the city hub — internal linking that
  // keeps these pages out of orphan status.
  const otherServices = SERVICE_SLUGS.map((slug) => getServiceDef(slug))
    .filter((s): s is ServiceDef => !!s && s.slug !== service.slug);

  const canonicalPath = `/tjenester/${service.slug}/${location.slug}`;

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Tjenester", url: "/tjenester" },
          { name: service.label, url: `/tjenester/${service.slug}` },
          { name: city, url: canonicalPath },
        ]}
      />
      <StructuredData
        type="service"
        data={{
          name: `${service.noun} i ${city}`,
          description: service.serviceSchemaDesc(city),
        }}
      />
      {/* FAQ schema is emitted by the <Faq> component below — no standalone
          StructuredData here, or the page would carry two FAQPage blocks. */}

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Tjenester", href: "/tjenester" },
          { label: service.label, href: `/tjenester/${service.slug}` },
          { label: city },
        ]}
        eyebrow={`${service.heroEyebrow} · ${city}`}
        title={
          <>
            {service.noun} <span className="italic">i {city}.</span>
          </>
        }
        lede={service.heroLede(city)}
        actions={[
          { label: "Få lokal vurdering", href: "/kontakt" },
          { label: "Se markedsdata", href: "#marked", variant: "outline" },
        ]}
        metaRow={metaRow}
        photo={service.heroPhoto}
      />

      {/* INTRO + MARKEDSDATA */}
      <section className="section section-divider" id="marked">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">
              01 — {service.label} i {city}
            </span>
            <div>
              <h2>
                Lokalt marked,{" "}
                <span className="italic">lokal vurdering.</span>
              </h2>
              {introParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
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
            <span>
              <Link href={`/naringsmegler/${location.slug}`}>
                Mer om markedet i {city} →
              </Link>
            </span>
          </div>
        </div>
      </section>

      {/* PROSESS */}
      <section className="section" id="prosess">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">{service.processEyebrow}</span>
            <div>
              <h2>
                {service.processLead}{" "}
                <span className="italic">{service.processItalic}</span>
              </h2>
              <p>{service.processIntro}</p>
            </div>
          </div>

          <div className="method-grid">
            {service.steps.map((step) => (
              <div className="method" key={step.h3}>
                <div className="pre">{step.pre}</div>
                <h3>{step.h3}</h3>
                <p>{step.p}</p>
                <div className="meta">
                  <span>{step.meta[0]}</span>
                  <span>{step.meta[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HVORFOR ADVANTI */}
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
            <span className="eyebrow">02 — Hvorfor Advanti</span>
            <div>
              <h2>
                {service.whyLead}{" "}
                <span className="italic">{service.whyItalic}</span>
              </h2>
              <p>{service.whyIntro}</p>
            </div>
          </div>

          <div className="feat-3">
            {service.feats.map((feat) => (
              <div className="feat" key={feat.num}>
                <div className="num">{feat.num}</div>
                <h3>{feat.h3}</h3>
                <p>{feat.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ActiveListingsStrip
        eyebrow={`${service.listingsEyebrow} · ${city}`}
        title={
          <>
            Eiendommer vi formidler{" "}
            <span className="italic">i {city}.</span>
          </>
        }
        lede={service.listingsLede}
        city={location.slug}
        limit={3}
      />

      <Faq
        eyebrow="Ofte stilte spørsmål"
        title={
          <>
            Spørsmål om {service.label.toLowerCase()}{" "}
            <span className="italic">i {city}.</span>
          </>
        }
        lede="Finner du ikke svaret? Ta kontakt — vi setter av tid til en uforpliktende samtale uansett."
        items={faqItems}
      />

      {/* ANDRE TJENESTER I BYEN — intern lenking */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Andre tjenester i {city}</span>
            <div>
              <h2>
                Vi bistår også med{" "}
                <span className="italic">mer i {city}.</span>
              </h2>
            </div>
          </div>

          <div className="feat-3">
            {otherServices.map((other) => (
              <Link
                key={other.slug}
                className="feat"
                href={`/tjenester/${other.slug}/${location.slug}`}
              >
                <h3>
                  {other.label} i {city}
                </h3>
                <p>{other.heroLede(city)}</p>
                <span className="eyebrow no-rule">Les mer →</span>
              </Link>
            ))}
            <Link className="feat" href={`/naringsmegler/${location.slug}`}>
              <h3>Næringsmegler i {city}</h3>
              <p>
                Lokal markedsoversikt, team og hvordan vi jobber i {city}.
              </p>
              <span className="eyebrow no-rule">Les mer →</span>
            </Link>
          </div>
        </div>
      </section>

      <PhotoBand
        src={service.heroPhoto.src}
        alt={`${service.noun} i ${city}`}
        caption={`${service.label} · ${city}`}
      />

      <CtaStrip
        eyebrow={service.ctaEyebrow}
        title={
          <>
            {service.label} av næringseiendom{" "}
            <span className="italic">i {city}?</span>
          </>
        }
        sub={service.ctaSub(city)}
        primary={{ label: "Ta kontakt", href: "/kontakt" }}
        secondary={{
          label: `Alt om ${service.label.toLowerCase()}`,
          href: `/tjenester/${service.slug}`,
        }}
      />
    </>
  );
}
