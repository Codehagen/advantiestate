export const siteConfig = {
  name: "Advanti - Intelligent verdsettelse av næringseiendom",
  url: "https://www.advantiestate.no",
  description:
    "Avansert plattform for verdivurdering og verdsettelse av næringseiendom. Få innsikt med DCF-analyser, yield-beregninger og markedsdata for bedre investeringsbeslutninger.",
  contact: {
    email: "Christer@advanti.no",
    phone: "+47 984 53 571",
    address: {
      streetAddress: "Dronningens gate 18, 8000 Bodø",
      addressLocality: "Bodø",
      addressRegion: "Nordland",
      postalCode: "8006",
      addressCountry: "NO",
    },
    social: {
      linkedin: "https://www.linkedin.com/company/advantiestate",
      twitter: "https://twitter.com/advantiestate",
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
  },
};

export type siteConfig = typeof siteConfig;
