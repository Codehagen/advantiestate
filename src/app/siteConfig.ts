export const siteConfig = {
  name: "Advanti Estate",
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
