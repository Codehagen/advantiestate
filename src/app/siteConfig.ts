export const siteConfig = {
  name: "Advanti Estate",
  // "Advanti Estate" er merkenavnet; "Eiendomsmegler Nord AS" er det
  // juridiske selskapet (org.nr 927102234, Bodø). Begge eksponeres i
  // structured data for entydig entitet-oppløsning (Knowledge Graph / AI).
  legalName: "Eiendomsmegler Nord AS",
  orgNumber: "927102234",
  vatId: "NO927102234MVA",
  url: "https://www.advantiestate.no",
  description:
    "Din lokale næringsmegler i Nord-Norge. Vi er eksperter på salg og verdivurdering av næringseiendom. Vi kombinerer lokal markedsinnsikt med avansert analyse for å sikre deg det beste resultatet.",
  contact: {
    email: "Christer@advantiestate.no",
    phone: "+47 984 53 571",
    address: {
      streetAddress: "Dronningens gate 18",
      addressLocality: "Bodø",
      addressRegion: "Nordland",
      postalCode: "8006",
      addressCountry: "NO",
    },
    social: {
      linkedin: "https://www.linkedin.com/company/advantiestate",
      twitter: "https://twitter.com/advantiestate",
      // Twitter/X @handle — distinct from the profile URL above. The
      // openGraph/twitter card metadata expects a handle, not a URL.
      twitterHandle: "@advantiestate",
      // Canonical sameAs set for the company entity. Single source consumed
      // by every Organization/RealEstateAgent block in StructuredData.tsx.
      // Only verified, owned profiles belong here (wrong sameAs harms entity
      // trust): LinkedIn, X, Google Knowledge Graph (kgmid /g/11n3wx2cqx),
      // Brønnøysundregistrene (org.nr 927102234).
      sameAs: [
        "https://www.linkedin.com/company/advantiestate",
        "https://twitter.com/advantiestate",
        "https://www.google.com/search?kgmid=/g/11n3wx2cqx",
        "https://virksomhet.brreg.no/nb/oppslag/enheter/927102234",
      ],
    },
  },
  baseLinks: {
    home: "/",
    about: "/om-oss",
    tjenester: "/tjenester",
    personer: "/personer",
    privacy: "/privacy",
    terms: "/terms",
    markedsinnsikt: "/markedsinnsikt",
    help: "/help",
    kontakt: "/kontakt",
    blog: "/blog",
    verktoy: "/verktoy",
    naringsmegler: "/naringsmegler",
    eiendommer: "/eiendommer",
  },
};

export type siteConfig = typeof siteConfig;
