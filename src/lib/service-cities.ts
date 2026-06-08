// Data layer for the service × city landing pages
// (/tjenester/{salg|verdivurdering|utleie}/{by}). Pure data + lookups, no JSX —
// the rendering lives in components/tjenester/ServiceCityPage.tsx, and sitemap.ts
// imports the slug lists from here to enumerate the routes.
import type { Metadata } from "next";
import { allLocationPosts } from "content-collections";
import { constructMetadata } from "@/lib/utils";

export const SERVICE_SLUGS = ["salg", "verdivurdering", "utleie"] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// Curated to the strongest markets (richest marketStats + an office or active
// mandates). Kept deliberately tight — quality over a thin 60-page matrix.
export const SERVICE_CITY_SLUGS = [
  "bodo",
  "tromso",
  "alta",
  "harstad",
  "narvik",
  "mo-i-rana",
] as const;
export type ServiceCitySlug = (typeof SERVICE_CITY_SLUGS)[number];

export type ProcessStep = {
  pre: string;
  h3: string;
  p: string;
  meta: [string, string];
};
export type Feat = { num: string; h3: string; p: string };
export type Faq = { question: string; answer: string };

export type ServiceDef = {
  slug: ServiceSlug;
  /** Short label, e.g. "Salg". */
  label: string;
  /** Full noun phrase for titles/H1, e.g. "Salg av næringseiendom". */
  noun: string;
  /** Target keyword, lowercase, e.g. "salg av næringseiendom". */
  keyword: string;
  heroEyebrow: string;
  heroLede: (city: string) => string;
  heroPhoto: { src: string; alt: string };
  metaDescription: (city: string, region: string) => string;
  serviceSchemaDesc: (city: string) => string;
  /** City-unique intro paragraphs (the bulk of the per-page unique content). */
  intro: (city: string, region: string, primeYield?: string) => string[];
  processEyebrow: string;
  processLead: string;
  processItalic: string;
  processIntro: string;
  steps: ProcessStep[];
  whyLead: string;
  whyItalic: string;
  whyIntro: string;
  feats: Feat[];
  listingsEyebrow: string;
  listingsLede: string;
  baseFaqs: Faq[];
  ctaEyebrow: string;
  ctaSub: (city: string) => string;
};

const SALG: ServiceDef = {
  slug: "salg",
  label: "Salg",
  noun: "Salg av næringseiendom",
  keyword: "salg av næringseiendom",
  heroEyebrow: "Tjeneste · Salg",
  heroLede: (city) =>
    `Strukturert salgsprosess i ${city} — fra verdivurdering og prospekt til budrunde, kontrakt og overtakelse. Vi sikrer at riktig kjøper finner riktig eiendom, til riktig pris.`,
  heroPhoto: {
    src: "/building/pexels-abshky-18566965.jpg",
    alt: "Næringseiendom i salgsprosess",
  },
  metaDescription: (city, region) =>
    `Skal du selge næringseiendom i ${city}? Advanti bistår med hele salgsprosessen — verdivurdering, prospekt, budrunde og oppgjør — med lokal markedskunnskap i ${region}.`,
  serviceSchemaDesc: (city) =>
    `Profesjonell bistand ved salg av næringseiendom i ${city}, fra verdivurdering til oppgjør.`,
  intro: (city, region, primeYield) => [
    `Vurderer du salg av næringseiendom i ${city}? Et vellykket salg avhenger av riktig prising, riktig kjøper og en profesjonell prosess. Advanti gjennomfører strukturerte salgsprosesser i ${city} og resten av ${region}, med lokal markedskunnskap og datadrevet verdivurdering i bunn.`,
    `Vi posisjonerer eiendommen mot de rette kjøperne — åpent eller diskré — og følger oppdraget tett fra verdivurdering og prospekt til budrunde, kontrakt og overtakelse.${
      primeYield
        ? ` Indikativ prime yield i ${city} ligger nå rundt ${primeYield}.`
        : ""
    }`,
  ],
  processEyebrow: "01 — Salgsprosessen",
  processLead: "En strukturert",
  processItalic: "salgsprosess.",
  processIntro:
    "Vi følger en transparent, dokumentert prosess i seks faser. Du vet til enhver tid hvor prosessen står, hva som skjer neste fase, og hvilke beslutninger som ligger foran.",
  steps: [
    {
      pre: "01 · Fase",
      h3: "Forberedelse og verdivurdering",
      p: "Grundig gjennomgang av eiendommen, innhenting av dokumentasjon og en nøyaktig verdivurdering for å fastsette korrekt markedspris.",
      meta: ["2–4 uker", "Rapport + strategi"],
    },
    {
      pre: "02 · Fase",
      h3: "Markedsføring og prospekt",
      p: "Utvikling av profesjonelt salgsmateriell og en målrettet strategi for å nå de rette kjøperne — diskré eller åpent.",
      meta: ["2–3 uker", "Prospekt + lansering"],
    },
    {
      pre: "03 · Fase",
      h3: "Visninger og interessenter",
      p: "Profesjonell gjennomføring av visninger og kontinuerlig oppfølging av interessenter for god dialog og fremdrift.",
      meta: ["Løpende", "NDA-styrt"],
    },
    {
      pre: "04 · Fase",
      h3: "Budrunde og forhandlinger",
      p: "Effektiv håndtering av budrunder og erfarne forhandlinger for best mulig pris og betingelser for deg som selger.",
      meta: ["1–2 uker", "Senior partner"],
    },
    {
      pre: "05 · Fase",
      h3: "Kontrakt og oppgjør",
      p: "Utarbeidelse av kjøpekontrakt og en trygg, etterprøvbar gjennomføring av det økonomiske oppgjøret.",
      meta: ["2–4 uker", "Eksterne advokater"],
    },
    {
      pre: "06 · Fase",
      h3: "Overtakelse og oppfølging",
      p: "Bistand med en ryddig overtakelse — og oppfølging i etterkant for å sikre at alle parter er trygge på handelen.",
      meta: ["Etter signering", "Garantert"],
    },
  ],
  whyLead: "Din fordel",
  whyItalic: "med Advanti.",
  whyIntro:
    "Med oss får du en partner som kjenner markedet, jobber målrettet og dedikert — og oppnår resultater som tåler å bli målt.",
  feats: [
    {
      num: "I",
      h3: "Lokalkunnskap og nettverk",
      p: "Dyptgående kjennskap til markedet i Nord-Norge og et omfattende nettverk sikrer maksimal eksponering for din eiendom.",
    },
    {
      num: "II",
      h3: "Dedikert seniorteam",
      p: "Et erfarent og dedikert team følger deg tett gjennom hele prosessen, med personlig service og profesjonell håndtering.",
    },
    {
      num: "III",
      h3: "Resultatorientert",
      p: "Vi jobber målrettet for best mulig pris og vilkår. Honoraret er resultatbasert — vi tjener når du tjener.",
    },
  ],
  listingsEyebrow: "Aktuelle salgsoppdrag",
  listingsLede:
    "Et utvalg aktive mandater. Se hele inventaret på /eiendommer.",
  baseFaqs: [
    {
      question: "Hvor lang tid tar en salgsprosess for næringseiendom?",
      answer:
        "En typisk salgsprosess hos Advanti tar tre til seks måneder, og følger seks dokumenterte faser: forberedelse og verdivurdering, markedsføring og prospekt, visninger, budrunde og forhandlinger, kontrakt og oppgjør, og til slutt overtakelse og oppfølging.",
    },
    {
      question: "Hva koster det å selge næringseiendom gjennom Advanti?",
      answer:
        "Honoraret er resultatbasert — vi tjener når du tjener. Det gir oss alle insentiver til å oppnå best mulig pris og vilkår for deg som selger. Ta kontakt for en konfidensiell salgsvurdering.",
    },
    {
      question: "Kan eiendommen selges uten åpen markedsføring?",
      answer:
        "Ja. Vi tilbyr en diskré prosess der vi går målrettet til en kuratert liste investorer under NDA, uten åpen markedsføring eller offentlig omtale. Vi velger spor sammen med deg ut fra eiendomstype, marked og konfidensialitetskrav.",
    },
  ],
  ctaEyebrow: "Klar til å selge?",
  ctaSub: (city) =>
    `Ta kontakt for en konfidensiell samtale om salg av eiendommen din i ${city} og hvordan vi kan oppnå best mulig resultat.`,
};

const VERDIVURDERING: ServiceDef = {
  slug: "verdivurdering",
  label: "Verdivurdering",
  noun: "Verdivurdering av næringseiendom",
  keyword: "verdivurdering av næringseiendom",
  heroEyebrow: "Tjeneste · Verdivurdering",
  heroLede: (city) =>
    `Profesjonell verdivurdering av næringseiendom i ${city}, basert på DCF-analyse, yield og reelle, lokale markedsdata — for salg, refinansiering eller strategisk planlegging.`,
  heroPhoto: {
    src: "/building/pexels-glass-panels-10156132.jpg",
    alt: "Verdivurdering av næringseiendom",
  },
  metaDescription: (city, region) =>
    `Profesjonell verdivurdering av næringseiendom i ${city}. DCF, yield og lokale markedsdata for salg, refinansiering og strategi. Advanti — næringsmegler i ${region}.`,
  serviceSchemaDesc: (city) =>
    `Profesjonell verdivurdering og analyse av næringseiendom i ${city}, basert på DCF, yield og lokale markedsdata.`,
  intro: (city, region, primeYield) => [
    `Trenger du en verdivurdering av næringseiendom i ${city}? Advanti leverer profesjonelle verdivurderinger basert på DCF-analyse, yield og reelle, lokale markedsdata — for salg, refinansiering, regnskap eller strategisk planlegging.`,
    `Vi kjenner markedet i ${city} og ${region}, og bygger hver vurdering på sammenlignbare transaksjoner, faktiske leienivåer og kontantstrømanalyser — ikke nasjonale gjennomsnitt.${
      primeYield
        ? ` Indikativ prime yield i ${city} ligger nå rundt ${primeYield}.`
        : ""
    }`,
  ],
  processEyebrow: "01 — Verdivurderingen",
  processLead: "En etterprøvbar",
  processItalic: "metodikk.",
  processIntro:
    "Hver verdivurdering bygges i seks steg — fra datagrunnlag til verdikonklusjon — slik at forutsetningene er transparente og tåler å bli etterprøvd av bank, revisor og motpart.",
  steps: [
    {
      pre: "01 · Steg",
      h3: "Befaring og dokumentasjon",
      p: "Gjennomgang av eiendom, leiekontrakter, kostnader og teknisk tilstand for et korrekt datagrunnlag.",
      meta: ["1–2 uker", "Datagrunnlag"],
    },
    {
      pre: "02 · Steg",
      h3: "Markeds- og leieanalyse",
      p: "Analyse av lokale leienivåer, ledighet og etterspørsel i markedet for å forankre forutsetningene.",
      meta: ["Lokale data", "Kvartalsvis"],
    },
    {
      pre: "03 · Steg",
      h3: "Kontantstrøm og DCF",
      p: "Modellering av netto kontantstrøm og diskontert nåverdi (DCF) over analyseperioden, med sensitiviteter.",
      meta: ["DCF", "Sensitivitet"],
    },
    {
      pre: "04 · Steg",
      h3: "Yield og sammenlignbare",
      p: "Avkastningskrav avstemt mot sammenlignbare transaksjoner og segment i det lokale markedet.",
      meta: ["Yield", "Transaksjoner"],
    },
    {
      pre: "05 · Steg",
      h3: "Rapport og verdikonklusjon",
      p: "En tydelig, etterprøvbar rapport med verdikonklusjon, forutsetninger og metodikk.",
      meta: ["Rapport", "Verdikonklusjon"],
    },
    {
      pre: "06 · Steg",
      h3: "Gjennomgang og rådgivning",
      p: "Vi går gjennom vurderingen med deg og rådgir om bruk mot bank, ved salg eller i strategisk planlegging.",
      meta: ["Gjennomgang", "Rådgivning"],
    },
  ],
  whyLead: "Hvorfor",
  whyItalic: "Advanti.",
  whyIntro:
    "Verdivurdering er kjernen i alt vi gjør. Vi kombinerer finansiell metodikk fra de største transaksjonshusene med lokale data fra landsdelen.",
  feats: [
    {
      num: "I",
      h3: "Datadrevet metodikk",
      p: "DCF, yield og sensitivitetsanalyser — en vurdering fundert i tall, ikke skjønn alene.",
    },
    {
      num: "II",
      h3: "Lokale markedsdata",
      p: "Vi sporer over 1 400 eiendommer i landsdelen, kvartalsvis oppdatert. Hver vurdering hviler på reelle tall.",
    },
    {
      num: "III",
      h3: "Står seg mot bank",
      p: "Etterprøvbare rapporter som tåler gjennomgang av bank, revisor og motpart ved refinansiering og salg.",
    },
  ],
  listingsEyebrow: "Aktuelle oppdrag",
  listingsLede:
    "Et utvalg aktive mandater i markedet. Se hele inventaret på /eiendommer.",
  baseFaqs: [
    {
      question: "Hva koster en verdivurdering av næringseiendom?",
      answer:
        "Honorar avhenger av eiendomstype, størrelse og kompleksitet. Ta kontakt for et konkret tilbud basert på din eiendom.",
    },
    {
      question: "Hvilke metoder bruker dere i verdivurderingen?",
      answer:
        "Vi kombinerer DCF-analyse, yield og avkastningskrav og sammenlignbare transaksjoner, forankret i lokale leie- og markedsdata.",
    },
    {
      question: "Kan verdivurderingen brukes mot bank og refinansiering?",
      answer:
        "Ja. Rapportene er etterprøvbare og brukes til refinansiering, salg, regnskap og strategisk planlegging.",
    },
  ],
  ctaEyebrow: "Trenger du en verdivurdering?",
  ctaSub: (city) =>
    `Ta kontakt for en profesjonell verdivurdering av eiendommen din i ${city}, basert på lokale markedsdata.`,
};

const UTLEIE: ServiceDef = {
  slug: "utleie",
  label: "Utleie",
  noun: "Utleie av næringseiendom",
  keyword: "utleie av næringseiendom",
  heroEyebrow: "Tjeneste · Utleie",
  heroLede: (city) =>
    `Vi bistår både utleiere og leietakere i ${city} — med leieprisanalyse, markedsføring av lokalet, leietakersøk og forhandling av leiekontrakt.`,
  heroPhoto: {
    src: "/building/pexels-building-10156174.jpg",
    alt: "Næringslokaler til leie",
  },
  metaDescription: (city, region) =>
    `Utleie av næringslokaler i ${city}. Advanti bistår utleiere og leietakere med leieprisanalyse, markedsføring, leietakersøk og forhandling i ${region}.`,
  serviceSchemaDesc: (city) =>
    `Utleie og leietakerhåndtering for næringslokaler i ${city}, for både utleiere og leietakere.`,
  intro: (city, region) => [
    `Skal du leie ut næringslokaler i ${city}, eller leter du etter lokaler? Advanti bistår både utleiere og leietakere i ${city} med leieprisanalyse, markedsføring, leietakersøk og forhandling av leiekontrakter.`,
    `Målet er riktig leienivå, høyt belegg og solide, langsiktige leietakere. Vi kjenner leietakermarkedet i ${city} og ${region}, og gjennomfører ryddige prosesser fra strategi til signert kontrakt.`,
  ],
  processEyebrow: "01 — Utleieprosessen",
  processLead: "En målrettet",
  processItalic: "utleieprosess.",
  processIntro:
    "Vi følger en strukturert prosess i seks faser — fra leieprisanalyse til signert kontrakt og videre oppfølging — som balanserer leienivå mot belegg.",
  steps: [
    {
      pre: "01 · Fase",
      h3: "Leieprisanalyse og strategi",
      p: "Vi fastsetter riktig leienivå og utleiestrategi basert på lokale markedsdata og segment.",
      meta: ["Leienivå", "Strategi"],
    },
    {
      pre: "02 · Fase",
      h3: "Klargjøring og markedsføring",
      p: "Profesjonell presentasjon og målrettet markedsføring av lokalet mot relevante leietakere.",
      meta: ["Prospekt", "Annonsering"],
    },
    {
      pre: "03 · Fase",
      h3: "Leietakersøk og visninger",
      p: "Aktiv prospektering i nettverket og gjennomføring av visninger med kvalifiserte leietakere.",
      meta: ["Løpende", "Nettverk"],
    },
    {
      pre: "04 · Fase",
      h3: "Forhandling av leievilkår",
      p: "Forhandling av leie, varighet, opsjoner og betingelser som sikrer langsiktig verdi.",
      meta: ["Vilkår", "Opsjoner"],
    },
    {
      pre: "05 · Fase",
      h3: "Kontrakt og inngåelse",
      p: "Utarbeidelse av leiekontrakt og en ryddig inngåelse mellom partene.",
      meta: ["Leiekontrakt", "Signering"],
    },
    {
      pre: "06 · Fase",
      h3: "Oppfølging og reforhandling",
      p: "Oppfølging gjennom leieforholdet og bistand ved reforhandling og fornyelse.",
      meta: ["Oppfølging", "Reforhandling"],
    },
  ],
  whyLead: "Din fordel",
  whyItalic: "med Advanti.",
  whyIntro:
    "Vi jobber for høyt belegg og stabil kontantstrøm — med markedsbasert prising og solide leietakere som står seg over tid.",
  feats: [
    {
      num: "I",
      h3: "Riktig leienivå",
      p: "Markedsbasert prising som balanserer leieinntekt og belegg, forankret i lokale data.",
    },
    {
      num: "II",
      h3: "Solide leietakere",
      p: "Vi kvalifiserer leietakere for langsiktig, stabil kontantstrøm — ikke bare rask utleie.",
    },
    {
      num: "III",
      h3: "Lokalt nettverk",
      p: "Direkte tilgang til leietakere og aktører i landsdelen gir raskere og bedre treff.",
    },
  ],
  listingsEyebrow: "Ledige lokaler",
  listingsLede:
    "Et utvalg lokaler i markedet. Se hele inventaret på /eiendommer.",
  baseFaqs: [
    {
      question: "Bistår dere både utleiere og leietakere?",
      answer:
        "Ja. Vi representerer utleiere i utleieprosesser og bistår leietakere med å finne og forhandle riktige lokaler.",
    },
    {
      question: "Hvordan fastsetter dere riktig leienivå?",
      answer:
        "Vi analyserer lokale leienivåer, ledighet og etterspørsel i segmentet, og setter en markedsbasert leie som balanserer inntjening og belegg.",
    },
    {
      question: "Hva koster utleiemegling?",
      answer:
        "Honoraret tilpasses oppdragets omfang. Ta kontakt for et konkret tilbud basert på lokalet og markedet.",
    },
  ],
  ctaEyebrow: "Skal du leie ut?",
  ctaSub: (city) =>
    `Ta kontakt for en uforpliktende prat om utleie av lokalet ditt i ${city} — vi finner riktig leietaker til riktig leie.`,
};

export const SERVICES: Record<ServiceSlug, ServiceDef> = {
  salg: SALG,
  verdivurdering: VERDIVURDERING,
  utleie: UTLEIE,
};

export function getServiceDef(slug: string): ServiceDef | undefined {
  return (SERVICES as Record<string, ServiceDef>)[slug];
}

export function getServiceCityLocation(citySlug: string) {
  return allLocationPosts.find((location) => location.slug === citySlug) ?? null;
}

/** True only for an allowlisted city slug that also resolves to a location. */
export function isServiceCity(citySlug: string): boolean {
  return (
    (SERVICE_CITY_SLUGS as readonly string[]).includes(citySlug) &&
    !!getServiceCityLocation(citySlug)
  );
}

/** Per-page metadata for a service × city route. Undefined for unknown combos. */
export function buildServiceCityMetadata(
  serviceSlug: string,
  citySlug: string,
): Metadata | undefined {
  const service = getServiceDef(serviceSlug);
  const location = getServiceCityLocation(citySlug);
  if (!service || !location) return undefined;
  return constructMetadata({
    title: `${service.noun} i ${location.name} | Advanti`,
    description: service.metaDescription(location.name, location.region),
    path: `/tjenester/${service.slug}/${location.slug}`,
  });
}
