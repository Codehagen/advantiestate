import { siteConfig } from "@/app/siteConfig";
import { AUTHORS } from "@/lib/authors";
import { jsonLdScriptProps } from "@/lib/jsonLd";

interface StructuredDataProps {
  type?:
    | "organization"
    | "realEstateAgent"
    | "website"
    | "article"
    | "faq"
    | "howto"
    | "person"
    | "service"
    | "dataset";
  data?: any;
}

export type HowToStep = { name: string; text: string };

// Topical entity association for the company (Organization + RealEstateAgent).
// Strengthens Knowledge Graph / AI resolution of what Advanti is expert in.
// Mirrors the actual services — no claims about services not offered.
const KNOWS_ABOUT = [
  "Næringseiendom",
  "Verdivurdering av næringseiendom",
  "DCF-analyse",
  "Yield",
  "Transaksjonsrådgivning",
  "Utleie av næringseiendom",
  "Næringsmegling i Nord-Norge",
];

export default function StructuredData({
  type = "organization",
  data,
}: StructuredDataProps) {
  const getSchemaData = () => {
    const baseUrl = siteConfig.url;
    const { contact } = siteConfig;

    switch (type) {
      case "service":
        return data
          ? {
              "@context": "https://schema.org",
              "@type": "Service",
              name: data.name,
              provider: {
                "@type": "LocalBusiness",
                name: "Advanti Estate",
                url: baseUrl,
                telephone: contact.phone,
                email: contact.email,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: contact.address.streetAddress,
                  addressLocality: contact.address.addressLocality,
                  addressRegion: contact.address.addressRegion,
                  postalCode: contact.address.postalCode,
                  addressCountry: contact.address.addressCountry,
                },
                sameAs: contact.social.sameAs,
              },
              areaServed: {
                "@type": "AdministrativeArea",
                name: "Nordland",
              },
              description: data.description,
            }
          : null;
      case "person": {
        if (!data) return null;
        const personSchema: Record<string, unknown> = {
          "@context": "https://schema.org",
          "@type": "Person",
          // Canonical @id for this person entity. Matches the @id emitted on
          // Article.author for posts written by this person, so that search
          // engines merge blog authorship and the profile page into one node.
          "@id": `${baseUrl}/personer/${data.slug}#person`,
          name: data.name,
          jobTitle: data.role,
          image: data.avatar,
          email: data.email,
          telephone: data.phone,
          url: `${baseUrl}/personer/${data.slug}`,
          worksFor: {
            "@type": "Organization",
            "@id": `${baseUrl}/#organization`,
            name: "Advanti Estate",
            url: baseUrl,
          },
          description: data.description || data.role,
        };
        // T4: sameAs (LinkedIn) — only when URL is present in frontmatter.
        if (data.linkedin) {
          personSchema.sameAs = [data.linkedin];
        }
        // T4: knowsAbout from specializations array.
        if (Array.isArray(data.specializations) && data.specializations.length > 0) {
          personSchema.knowsAbout = data.specializations;
        }
        return personSchema;
      }
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          // Shared node identity: the organization and realEstateAgent blocks
          // describe the same company. The matching @id makes search engines
          // merge them into one entity instead of two unconnected ones.
          "@id": `${baseUrl}/#organization`,
          name: "Advanti Estate",
          alternateName: ["Advanti", "Advanti Næringseiendom"],
          url: baseUrl,
          logo: `${baseUrl}/icon-512x512.png`,
          description:
            "Advanti tilbyr ekspertise innen kjøp, salg, utleie, verdivurdering og strategisk rådgivning for næringseiendom i Nord-Norge.",
          email: contact.email,
          telephone: contact.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.address.streetAddress,
            addressLocality: contact.address.addressLocality,
            addressRegion: contact.address.addressRegion,
            postalCode: contact.address.postalCode,
            addressCountry: contact.address.addressCountry,
          },
          areaServed: [
            {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: 67.2804,
                longitude: 14.4049,
              },
              geoRadius: 500000,
            },
          ],
          sameAs: contact.social.sameAs,
          legalName: siteConfig.legalName,
          identifier: {
            "@type": "PropertyValue",
            propertyID: "organisasjonsnummer",
            value: siteConfig.orgNumber,
          },
          vatID: siteConfig.vatId,
          knowsAbout: KNOWS_ABOUT,
          foundingDate: "2024",
          numberOfEmployees: {
            "@type": "QuantitativeValue",
            value: 6,
          },
        };

      case "realEstateAgent":
        const defaultAgent = {
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          // Same @id as the organization block — see the comment there.
          "@id": `${baseUrl}/#organization`,
          name: "Advanti Estate",
          url: baseUrl,
          logo: `${baseUrl}/icon-512x512.png`,
          image: [`${baseUrl}/opengraph-image.jpg`],
          description:
            "Profesjonell næringsmegler i Nord-Norge. Spesialisert på kjøp, salg, utleie og verdivurdering av næringseiendom.",
          priceRange: "Konsultasjon på forespørsel",
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.address.streetAddress,
            addressLocality: contact.address.addressLocality,
            addressRegion: contact.address.addressRegion,
            postalCode: contact.address.postalCode,
            addressCountry: contact.address.addressCountry,
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 67.2804,
            longitude: 14.4049,
          },
          telephone: contact.phone,
          email: contact.email,
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
              opens: "08:00",
              closes: "16:00",
            },
          ],
          areaServed: [
            {
              "@type": "City",
              name: "Bodø",
            },
            {
              "@type": "City",
              name: "Tromsø",
            },
            {
              "@type": "City",
              name: "Narvik",
            },
            {
              "@type": "City",
              name: "Alta",
            },
            {
              "@type": "AdministrativeArea",
              name: "Nordland",
            },
            {
              "@type": "AdministrativeArea",
              name: "Troms",
            },
          ],
          makesOffer: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Salg av Næringseiendom",
                description:
                  "Profesjonell bistand ved salg av næringseiendom i Nord-Norge",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Verdivurdering",
                description:
                  "Profesjonelle verdivurderinger og analyser av næringseiendom",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Utleie av Næringseiendom",
                description: "Utleie og leietakerhåndtering for næringslokaler",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Strategisk Rådgivning",
                description:
                  "Strategisk rådgivning for eiendomsinvesteringer og porteføljestyring",
              },
            },
          ],
          sameAs: contact.social.sameAs,
          legalName: siteConfig.legalName,
          identifier: {
            "@type": "PropertyValue",
            propertyID: "organisasjonsnummer",
            value: siteConfig.orgNumber,
          },
          vatID: siteConfig.vatId,
          knowsAbout: KNOWS_ABOUT,
        };

        if (!data) {
          return defaultAgent;
        }

        const mergedAgent = {
          ...defaultAgent,
          ...data,
          image: data.image ?? defaultAgent.image,
          telephone: data.telephone ?? defaultAgent.telephone,
          email: data.email ?? defaultAgent.email,
          address: data.address ?? defaultAgent.address,
          geo: data.geo ?? defaultAgent.geo,
          openingHoursSpecification:
            data.openingHoursSpecification ??
            defaultAgent.openingHoursSpecification,
          areaServed: data.areaServed ?? defaultAgent.areaServed,
          makesOffer: data.makesOffer ?? defaultAgent.makesOffer,
          sameAs: data.sameAs ?? defaultAgent.sameAs,
        };

        if (data.address === null) {
          delete mergedAgent.address;
        }

        if (data.geo === null) {
          delete mergedAgent.geo;
        }

        return mergedAgent;

      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Advanti Estate",
          url: baseUrl,
          description:
            "Advanti Estate - Din partner for næringseiendom i Nord-Norge. Ekspertise innen salg, kjøp, utleie og verdivurdering.",
          publisher: {
            "@type": "Organization",
            // Link the website's publisher to the shared organization node.
            "@id": `${baseUrl}/#organization`,
            name: "Advanti Estate",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/icon-512x512.png`,
            },
          },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${baseUrl}/help?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
          inLanguage: "nb-NO",
        };

      case "article":
        if (!data) return null;

        const articleUrl = data.url
          ? data.url.startsWith("http")
            ? data.url
            : `${baseUrl}${data.url}`
          : baseUrl;

        const articleImage = data.image
          ? data.image.startsWith("http")
            ? data.image
            : `${baseUrl}${data.image}`
          : `${baseUrl}/opengraph-image.jpg`;

        // Get author name from author username if available
        const authorName = data.authorName || data.author || "Advanti Estate";

        // Build author node. When the author handle maps to a /personer profile,
        // add @id and url so the article authorship merges with the person entity.
        const authorPersonSlug = data.author
          ? AUTHORS[data.author]?.personSlug
          : undefined;
        const authorNode: Record<string, unknown> = {
          "@type": "Person",
          name: authorName,
        };
        if (authorPersonSlug) {
          authorNode["@id"] = `${baseUrl}/personer/${authorPersonSlug}#person`;
          authorNode["url"] = `${baseUrl}/personer/${authorPersonSlug}`;
        }

        const schema: any = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: data.title,
          description: data.summary || data.description,
          image: [articleImage],
          datePublished: data.publishedAt,
          dateModified: data.updatedAt || data.publishedAt,
          author: authorNode,
          publisher: {
            "@type": "Organization",
            "@id": `${baseUrl}/#organization`,
            name: "Advanti Estate",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/icon-512x512.png`,
              width: 512,
              height: 512,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
          },
          url: articleUrl,
          inLanguage: "nb-NO",
        };

        // Add articleBody if MDX content is available
        if (data.articleBody) {
          schema.articleBody = data.articleBody;
        }

        // Add wordCount if available
        if (data.wordCount) {
          schema.wordCount = data.wordCount;
        }

        // Add timeRequired (reading time) if available
        if (data.timeRequired) {
          schema.timeRequired = `PT${data.timeRequired}M`;
        }

        // Add keywords/categories if available
        if (data.keywords && Array.isArray(data.keywords)) {
          schema.keywords = data.keywords.join(", ");
        }

        // Add articleSection (category) if available
        if (data.articleSection) {
          schema.articleSection = data.articleSection;
        }

        return schema;

      case "faq":
        return data
          ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: data.faqs.map(
                (faq: { question: string; answer: string }) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                }),
              ),
            }
          : null;

      case "howto":
        // Emit ONLY when the caller has both a non-empty `step` array AND
        // matching visible content on the page. The caller is responsible
        // for gating on `howto: true` in frontmatter. Each step gets
        // `@type: "HowToStep"` + `position` per schema.org.
        if (!data?.step || !Array.isArray(data.step) || data.step.length < 2) {
          return null;
        }
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: data.name,
          description: data.description,
          inLanguage: "nb-NO",
          step: data.step.map((s: HowToStep, i: number) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        };

      case "dataset": {
        if (!data) return null;
        // Derive ISO temporal coverage from quarter label, e.g. "Q4 2025" → "2025-10/2025-12".
        const qMatch = (data.quarter as string | undefined)?.match(/Q(\d)\s+(\d{4})/)
        let temporalCoverage: string = data.quarter ?? ""
        if (qMatch) {
          const q = parseInt(qMatch[1], 10)
          const yr = qMatch[2]
          const start = String((q - 1) * 3 + 1).padStart(2, "0")
          const end = String(q * 3).padStart(2, "0")
          temporalCoverage = `${yr}-${start}/${yr}-${end}`
        }
        return {
          "@context": "https://schema.org",
          "@type": "Dataset",
          "@id": `${baseUrl}/presserom#dataset`,
          name: `Markedstall næringseiendom Nord-Norge — ${data.quarter}`,
          description:
            "Kvartalsvise markedstall for næringseiendom i Nord-Norge: prime yield (kontor), markedsleie og kontorledighet per by. Frigitt til redaksjonell bruk med kreditering.",
          url: `${baseUrl}/presserom`,
          creator: {
            "@id": `${baseUrl}/#organization`,
          },
          license: `${baseUrl}/presserom#bruksvilkar`,
          temporalCoverage,
          spatialCoverage: {
            "@type": "Place",
            name: "Nord-Norge",
          },
          variableMeasured: [
            "Prime yield kontor",
            "Markedsleie kontor",
            "Kontorledighet",
          ],
          dateModified: data.publishedAt,
          distribution: {
            "@type": "DataDownload",
            encodingFormat: "text/csv",
            contentUrl: `${baseUrl}/presserom/markedstall.csv`,
          },
          inLanguage: "nb-NO",
        };
      }

      default:
        return null;
    }
  };

  const schemaData = getSchemaData();

  if (!schemaData) return null;

  return <script {...jsonLdScriptProps(schemaData)} />;
}

// Breadcrumb component for navigation paths.
// Used on pages outside the Breadcrumbs.tsx migration scope (presserom, blog,
// naringsmegler hub, etc.). Now uses the shared safe serialiser.
export function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const baseUrl = siteConfig.url;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  return <script {...jsonLdScriptProps(schemaData)} />;
}
