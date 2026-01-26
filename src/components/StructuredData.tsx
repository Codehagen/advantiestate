import { siteConfig } from "@/app/siteConfig";

interface StructuredDataProps {
  type?:
    | "organization"
    | "realEstateAgent"
    | "website"
    | "article"
    | "faq"
    | "person"
    | "service";
  data?: any;
}

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
                name: "Advanti",
                url: baseUrl,
              },
              areaServed: {
                "@type": "State",
                name: "Nordland",
              },
              description: data.description,
            }
          : null;
      case "person":
        return data
          ? {
              "@context": "https://schema.org",
              "@type": "Person",
              name: data.name,
              jobTitle: data.role,
              image: data.avatar,
              email: data.email,
              telephone: data.phone,
              url: `${baseUrl}/personer/${data.slug}`,
              worksFor: {
                "@type": "Organization",
                name: "Advanti",
                url: baseUrl,
              },
              description: data.description || data.role,
            }
          : null;
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Advanti",
          alternateName: "Advanti Næringseiendom",
          url: baseUrl,
          logo: `${baseUrl}/opengraph-image.png`,
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
          geo: {
            "@type": "GeoCoordinates",
            latitude: "67.2804",
            longitude: "14.4049",
          },
          areaServed: [
            {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: "67.2804",
                longitude: "14.4049",
              },
              geoRadius: "500000",
            },
          ],
          sameAs: [contact.social.linkedin, contact.social.twitter],
          foundingDate: "2024",
          numberOfEmployees: {
            "@type": "QuantitativeValue",
            value: "4",
          },
        };

      case "realEstateAgent":
        return {
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "Advanti",
          url: baseUrl,
          logo: `${baseUrl}/opengraph-image.png`,
          image: [`${baseUrl}/opengraph-image.png`],
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
            latitude: "67.2804",
            longitude: "14.4049",
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
              "@type": "State",
              name: "Nordland",
            },
            {
              "@type": "State",
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
        };

      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Advanti",
          url: baseUrl,
          description:
            "Advanti - Din partner for næringseiendom i Nord-Norge. Ekspertise innen salg, kjøp, utleie og verdivurdering.",
          publisher: {
            "@type": "Organization",
            name: "Advanti",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/opengraph-image.png`,
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
          : `${baseUrl}/opengraph-image.png`;

        // Get author name from author username if available
        const authorName =
          data.authorName || data.author || "Advanti Estate";

        const schema: any = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: data.title,
          description: data.summary || data.description,
          image: [articleImage],
          datePublished: data.publishedAt,
          dateModified: data.updatedAt || data.publishedAt,
          author: {
            "@type": "Person",
            name: authorName,
          },
          publisher: {
            "@type": "Organization",
            name: "Advanti Estate",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/opengraph-image.png`,
              width: 1200,
              height: 630,
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

      default:
        return null;
    }
  };

  const schemaData = getSchemaData();

  if (!schemaData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// Breadcrumb component for navigation paths
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
