// Path → markdown representation, for Accept: text/markdown content negotiation.
//
// Coverage contract: every URL in sitemap.ts must resolve here. That is the
// whole point — an agent that follows the sitemap must never hit a "no markdown
// for this page" hole, and a path that is NOT in the sitemap must resolve to
// null so the handler can answer a real 404. The two files therefore enumerate
// the same route families, in the same order, from the same sources.

import {
  allBlogPosts,
  allCustomersPosts,
  allHelpPosts,
  allIntegrationsPosts,
  allLegalPosts,
  allLocationPosts,
  allPersonPosts,
} from "content-collections";
import { BLOG_CATEGORIES, HELP_CATEGORIES } from "@/lib/blog/content";
import { getListings } from "@/lib/listing/listings";
import {
  SERVICE_CITY_SLUGS,
  SERVICE_SLUGS,
  getServiceCityLocation,
  getServiceDef,
} from "@/lib/service-cities";
import { RELEASES } from "@/components/markedsinnsikt/marketReleases";
import { siteConfig } from "@/app/siteConfig";
import { SERVICE_PAGES } from "@/lib/servicePages";
import { mdxToMarkdown } from "./mdxToMarkdown";

export type MarkdownDoc = {
  /** Canonical path, without the .md suffix. */
  path: string;
  title: string;
  /** Rendered markdown body, without the H1 (the handler adds the header). */
  body: string;
  description?: string;
};

const baseUrl = siteConfig.url;

function abs(path: string): string {
  return `${baseUrl}${path}`;
}

function link(title: string, path: string, description?: string): string {
  return description
    ? `- [${title}](${abs(path)}): ${description}`
    : `- [${title}](${abs(path)})`;
}

/**
 * Static pages have no MDX body — they are React routes. Rather than scrape
 * their rendered HTML, we serve a curated summary plus the outbound links that
 * matter, which is what an agent actually needs from a landing page. The
 * descriptions are deliberately the same strings the pages use as their meta
 * description, so the two cannot drift into telling different stories.
 */
const STATIC_PAGES: Record<
  string,
  { title: string; description: string; body?: () => string }
> = {
  "/": {
    title: "Advanti Estate — næringsmegler i Nord-Norge",
    description: siteConfig.description,
    body: () =>
      [
        "Advanti Estate er et meglerhus for næringseiendom med kontorer i Nord-Norge.",
        "Vi kombinerer lokal markedskunnskap med kvantitativ analyse (DCF, yield, sensitivitet)",
        "for å hjelpe eiere, investorer og leietakere ta bedre beslutninger.",
        "",
        "## Tjenester",
        "",
        link("Salg av næringseiendom", "/tjenester/salg"),
        link("Utleie av næringseiendom", "/tjenester/utleie"),
        link("Verdivurdering", "/tjenester/verdivurdering"),
        link("Rådgivning", "/tjenester/radgivning"),
        link("Transaksjoner", "/tjenester/transaksjoner"),
        link("Strategisk rådgivning", "/tjenester/strategisk-radgivning"),
        "",
        "## Finn fram",
        "",
        link("Eiendommer til salgs og leie", "/eiendommer"),
        link("Markedsinnsikt", "/markedsinnsikt"),
        link("Kunnskapssenter", "/help"),
        link("Om oss", "/om-oss"),
        link("Kontakt", "/kontakt"),
        "",
        "## For agenter",
        "",
        `- Sidekart: ${abs("/sitemap.xml")}`,
        `- Nettstedsguide: ${abs("/llms.txt")}`,
        `- Markedstall (CSV): ${abs("/presserom/markedstall.csv")}`,
      ].join("\n"),
  },
  "/om-oss": {
    title: "Om Advanti Estate",
    description:
      "Advanti Estate er en partnerstyrt næringsmegler i Nord-Norge med kontorer i Bodø. Vi jobber med salg, utleie, verdivurdering og rådgivning for næringseiendom.",
  },
  "/kontakt": {
    title: "Kontakt Advanti Estate",
    description:
      "Kontakt Advanti Estate for verdivurdering, salg, utleie eller rådgivning på næringseiendom i Nord-Norge.",
  },
  "/karriere": {
    title: "Karriere i Advanti Estate",
    description:
      "Ledige stillinger og hvordan det er å jobbe som næringsmegler eller analytiker i Advanti Estate.",
  },
  "/tjenester": {
    title: "Tjenester",
    description:
      "Salg, utleie, verdivurdering, rådgivning og transaksjonsstøtte for næringseiendom i Nord-Norge.",
  },
  "/verdivurdering": {
    title: "Verdivurdering av næringseiendom",
    description:
      "Be om en verdivurdering av næringseiendommen din. DCF-analyse, yield-beregning og markedsbasert vurdering.",
  },
  "/beslutningsgrunnlag": {
    title: "Beslutningsgrunnlag",
    description:
      "Analyse og dokumentasjon som beslutningsgrunnlag for kjøp, salg og utvikling av næringseiendom.",
  },
  "/verktoy": {
    title: "Verktøy og kalkulatorer",
    description:
      "Gratis kalkulatorer for yield, ROI, prisvurdering og lån på næringseiendom.",
  },
  "/verktoy/yield-kalkulator": {
    title: "Yield-kalkulator",
    description:
      "Regn ut netto yield på næringseiendom fra leieinntekter, eierkostnader og kjøpesum.",
  },
  "/verktoy/boliglan-kalkulator": {
    title: "Lånekalkulator",
    description: "Regn ut månedlig kostnad og total rentekostnad på lån.",
  },
  "/verktoy/roi-kalkulator": {
    title: "ROI-kalkulator",
    description:
      "Regn ut avkastning på egenkapital for en eiendomsinvestering.",
  },
  "/verktoy/pris-verdivurdering": {
    title: "Hva koster en verdivurdering?",
    description:
      "Prisnivå og innhold i en verdivurdering av næringseiendom fra Advanti Estate.",
  },
  "/markedsinnsikt": {
    title: "Markedsinnsikt",
    description:
      "Datadrevet markedsanalyse for næringseiendom i Nord-Norge — yield, leiepriser og ledighet per by.",
  },
  "/markedsinnsikt/kart": {
    title: "Markedskart",
    description: "Interaktivt kart over prissoner og transaksjoner i Nord-Norge.",
  },
  "/analyseportal": {
    title: "Analyseportal",
    description:
      "Portal for markedsdata og analyse av næringseiendom i Nord-Norge.",
  },
  "/markedsrapport": {
    title: "Markedsrapport",
    description:
      "Kvartalsvis rapport med yield, leiepriser og transaksjoner i Nord-Norge.",
  },
  "/investorportal": {
    title: "Investorportal",
    description: "Off-market muligheter og investorinformasjon fra Advanti Estate.",
  },
  "/presserom": {
    title: "Presserom",
    description:
      "Markedstall for næringseiendom i Nord-Norge til fri bruk for media med kreditering «Advanti Estate · advantiestate.no».",
    body: () =>
      [
        link(
          "Markedstall CSV (stabil, siste utgivelse)",
          "/presserom/markedstall.csv",
          "Maskinlesbar CSV med prime yield, markedsleie og kontorledighet per by.",
        ),
        link("Kvartalsarkiv", "/presserom/arkiv"),
      ].join("\n"),
  },
  "/presserom/arkiv": {
    title: "Kvartalsarkiv",
    description:
      "Permanente arkivsider for alle kvartalsutgivelser — fryst snapshot per kvartal.",
    body: () =>
      RELEASES.map((r) =>
        link(
          `Markedstall ${r.quarter}`,
          `/presserom/arkiv/${r.slug}`,
          `Fryst snapshot publisert ${r.publishedAt}.`,
        ),
      ).join("\n"),
  },
  "/help": {
    title: "Kunnskapssenter",
    description:
      "Begreper, metoder og guider for næringseiendom — yield, DCF, leiekontrakter og verdivurdering.",
    body: () =>
      HELP_CATEGORIES.map((c) =>
        link(c.title, `/help/category/${c.slug}`, c.description),
      ).join("\n"),
  },
  "/blog": {
    title: "Blogg",
    description:
      "Artikler om næringseiendom, verdsettelse og markedet i Nord-Norge.",
    body: () =>
      [...allBlogPosts]
        .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
        .map((p) => link(p.title, `/blog/${p.slug}`, p.summary))
        .join("\n"),
  },
  "/kunder": {
    title: "Kundehistorier",
    description: "Case studies fra oppdrag Advanti Estate har gjennomført.",
    body: () =>
      allCustomersPosts
        .map((p) => link(p.title, `/kunder/${p.slug}`, p.summary))
        .join("\n"),
  },
  "/integrasjoner": {
    title: "Integrasjoner",
    description: "Integrasjoner mot Advanti Estate sine data og tjenester.",
    body: () =>
      allIntegrationsPosts
        .map((p) => link(p.title, `/integrasjoner/${p.slug}`))
        .join("\n"),
  },
  "/personer": {
    title: "Personer",
    description: "Meglerne og analytikerne i Advanti Estate.",
    body: () =>
      allPersonPosts
        .map((p) => link(p.name, `/personer/${p.slug}`, p.role))
        .join("\n"),
  },
  "/naringsmegler": {
    title: "Næringsmegler i Nord-Norge",
    description:
      "Advanti Estate dekker Bodø, Tromsø, Alta, Harstad, Narvik, Mo i Rana og Lofoten.",
    body: () =>
      [...allLocationPosts]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((l) =>
          link(
            `Næringsmegler i ${l.name}`,
            `/naringsmegler/${l.slug}`,
            l.hero?.description,
          ),
        )
        .join("\n"),
  },
  "/eiendommer": {
    title: "Eiendommer til salgs og leie",
    description:
      "Aktive salgs- og utleieoppdrag på næringseiendom i Nord-Norge.",
  },
  // Real routes that are deliberately absent from sitemap.ts — campaign
  // landing pages and gated surfaces. They are still live URLs, so they need a
  // markdown representation: answering 404 here would tell an agent the page
  // does not exist, which is exactly the failure the agent-friendly-404 check
  // exists to prevent.
  "/verktoy/naringskalkulator": {
    title: "Næringskalkulator",
    description:
      "Kalkulator for nøkkeltall på næringseiendom — leie, kostnader og yield.",
  },
  "/sjekkliste-verdivurdering": {
    title: "Sjekkliste for verdivurdering",
    description:
      "Hva du bør ha klart før en verdivurdering av næringseiendom.",
  },
  "/off-market-tilgang": {
    title: "Off-market-tilgang",
    description:
      "Få tilgang til salgsobjekter som ikke annonseres åpent i markedet.",
  },
  "/landing/verdivurdering": {
    title: "Verdivurdering av næringseiendom",
    description:
      "Be om en verdivurdering av næringseiendommen din fra Advanti Estate.",
  },
  "/presentasjon": {
    title: "Presentasjon",
    description: "Presentasjon av Advanti Estate.",
  },
};

// The six service pages are React routes with no MDX body, and their one-line
// descriptions already live in the shared SERVICE_PAGES list that llms.txt
// reads. Fold them in rather than restating them.
for (const service of SERVICE_PAGES) {
  STATIC_PAGES[service.path] = {
    title: service.title,
    description: service.description,
    body: () =>
      [
        link("Alle tjenester", "/tjenester"),
        link("Kontakt oss", "/kontakt"),
        link("Om Advanti Estate", "/om-oss"),
      ].join("\n"),
  };
}

function normalise(rawPath: string): string {
  let path = rawPath.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.toLowerCase().endsWith(".md")) path = path.slice(0, -3);
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  try {
    path = decodeURIComponent(path);
  } catch {
    // Malformed percent-encoding: fall through with the raw path, which will
    // simply not match anything and produce a 404.
  }
  return path || "/";
}

function fromMdx(
  path: string,
  doc: { title: string; content?: string; summary?: string },
): MarkdownDoc {
  return {
    path,
    title: doc.title,
    description: doc.summary,
    body: mdxToMarkdown(doc.content ?? ""),
  };
}

export async function resolveMarkdown(
  rawPath: string,
): Promise<MarkdownDoc | null> {
  const path = normalise(rawPath);

  // 1. Curated static routes.
  const staticPage = STATIC_PAGES[path];
  if (staticPage) {
    return {
      path,
      title: staticPage.title,
      description: staticPage.description,
      body: staticPage.body
        ? `${staticPage.description}\n\n${staticPage.body()}`
        : staticPage.description,
    };
  }

  const segments = path.split("/").filter(Boolean);

  // 2. Legal pages (/privacy, /terms) — real MDX bodies.
  const legal = allLegalPosts.find((p) => `/${p.slug}` === path);
  if (legal) return fromMdx(path, legal);

  // 3. Content collections, keyed by their route family.
  if (segments[0] === "blog" && segments.length === 2) {
    const post = allBlogPosts.find((p) => p.slug === segments[1]);
    if (post) return fromMdx(path, post);
  }
  if (segments[0] === "blog" && segments[1] === "category" && segments.length === 3) {
    const category = BLOG_CATEGORIES.find((c) => c.slug === segments[2]);
    if (category) {
      const posts = allBlogPosts.filter((p) =>
        (p.categories as string[]).includes(category.slug),
      );
      return {
        path,
        title: category.title,
        description: category.description,
        body: `${category.description}\n\n${posts
          .map((p) => link(p.title, `/blog/${p.slug}`, p.summary))
          .join("\n")}`,
      };
    }
  }
  if (segments[0] === "help" && segments[1] === "article" && segments.length === 3) {
    const post = allHelpPosts.find((p) => p.slug === segments[2]);
    if (post) return fromMdx(path, post);
  }
  if (segments[0] === "help" && segments[1] === "category" && segments.length === 3) {
    const category = HELP_CATEGORIES.find((c) => c.slug === segments[2]);
    if (category) {
      const posts = allHelpPosts.filter((p) =>
        (p.categories as string[]).includes(category.slug),
      );
      // Mirrors sitemap.ts: empty categories are not public URLs.
      if (posts.length > 0) {
        return {
          path,
          title: category.title,
          description: category.description,
          body: `${category.description}\n\n${posts
            .map((p) => link(p.title, `/help/article/${p.slug}`, p.summary))
            .join("\n")}`,
        };
      }
    }
  }
  if (segments[0] === "kunder" && segments.length === 2) {
    const post = allCustomersPosts.find((p) => p.slug === segments[1]);
    if (post) return fromMdx(path, post);
  }
  if (segments[0] === "integrasjoner" && segments.length === 2) {
    const post = allIntegrationsPosts.find((p) => p.slug === segments[1]);
    if (post) return fromMdx(path, post);
  }
  if (segments[0] === "personer" && segments.length === 2) {
    const person = allPersonPosts.find((p) => p.slug === segments[1]);
    if (person) {
      const description = `${person.name} er ${person.role} i Advanti Estate.${
        person.specializations?.length
          ? ` Spesialområder: ${person.specializations.join(", ")}.`
          : ""
      }`;
      return {
        path,
        title: `${person.name} — ${person.role}`,
        description,
        body: mdxToMarkdown(person.content ?? "") || description,
      };
    }
  }
  if (segments[0] === "naringsmegler" && segments.length === 2) {
    const location = allLocationPosts.find((p) => p.slug === segments[1]);
    if (location) {
      return {
        path,
        title: `Næringsmegler i ${location.name}`,
        description: location.hero?.description,
        body:
          mdxToMarkdown(location.content ?? "") ||
          (location.hero?.description ?? ""),
      };
    }
  }

  // 4. Service × city landing pages, enumerated from the same allowlist the
  //    routes' generateStaticParams and sitemap.ts use.
  if (segments[0] === "tjenester" && segments.length === 3) {
    const service = getServiceDef(segments[1]);
    const location = getServiceCityLocation(segments[2]);
    if (
      service &&
      location &&
      (SERVICE_SLUGS as readonly string[]).includes(segments[1]) &&
      (SERVICE_CITY_SLUGS as readonly string[]).includes(segments[2])
    ) {
      const description = service.metaDescription(location.name, location.region);
      return {
        path,
        title: `${service.noun} i ${location.name}`,
        description,
        body: [
          description,
          "",
          link(`Alle tjenester i ${location.name}`, `/naringsmegler/${location.slug}`),
          link(service.noun, `/tjenester/${service.slug}`),
          link("Kontakt oss", "/kontakt"),
        ].join("\n"),
      };
    }
  }

  // 5. Quarterly archive snapshots.
  if (segments[0] === "presserom" && segments[1] === "arkiv" && segments.length === 3) {
    const release = RELEASES.find((r) => r.slug === segments[2]);
    if (release) {
      return {
        path,
        title: `Markedstall ${release.quarter}`,
        description: `Fryst snapshot av markedstall for næringseiendom i Nord-Norge, publisert ${release.publishedAt}.`,
        body: [
          `Fryst snapshot publisert ${release.publishedAt}. Tallene på denne siden endres ikke.`,
          "",
          `- CSV: ${abs(`/presserom/arkiv/${release.slug}/data.csv`)}`,
          link("Siste utgivelse", "/presserom"),
        ].join("\n"),
      };
    }
  }

  // 6. Listings — CRM-backed, so this is the one branch that hits the network.
  //    Deliberately last: everything above resolves synchronously from the
  //    content collections, so only a genuine /eiendommer/* miss pays for it.
  if (segments[0] === "eiendommer" && segments.length === 2) {
    const listings = await getListings();
    const listing = listings.find((l) => l.slug === segments[1]);
    if (listing) {
      const facts: string[] = [
        `- **Adresse:** ${listing.address}`,
        `- **By:** ${listing.city}`,
        `- **Type:** ${listing.typeLabel}`,
        `- **Status:** ${listing.statusLabel ?? listing.status}`,
        `- **BTA:** ${listing.bta} m²`,
      ];
      if (listing.prisantydning != null) {
        facts.push(
          `- **Prisantydning:** ${listing.prisantydning} NOK${listing.prisantydningEstimat ? " (estimat)" : ""}`,
        );
      }
      if (listing.leieKrM2 != null) {
        facts.push(`- **Leie:** ${listing.leieKrM2} NOK/m²/år`);
      }
      if (listing.yieldNetto != null) {
        facts.push(
          `- **Netto yield:** ${listing.yieldNetto} %${listing.yieldEstimat ? " (estimat)" : ""}`,
        );
      }
      return {
        path,
        title: listing.title,
        description: listing.summary,
        body: [
          listing.summary,
          "",
          "## Nøkkeltall",
          "",
          ...facts,
          "",
          link("Alle eiendommer", "/eiendommer"),
          link("Kontakt megler", "/kontakt"),
        ].join("\n"),
      };
    }
  }

  return null;
}

/**
 * The body served on a 404. Kept here rather than in the route handler so the
 * agent-facing recovery links live next to the resolver that decides what a
 * valid path is.
 */
export function notFoundMarkdown(path: string): string {
  return [
    "# 404 — siden finnes ikke",
    "",
    `Ingen side på \`${path}\` på ${baseUrl}.`,
    "",
    "## Kom videre",
    "",
    `- Nettstedsguide for agenter: ${abs("/llms.txt")}`,
    `- Sidekart (alle URL-er): ${abs("/sitemap.xml")}`,
    `- Kunnskapssenter: ${abs("/help")}`,
    `- Eiendommer til salgs og leie: ${abs("/eiendommer")}`,
    `- Kontakt: ${abs("/kontakt")}`,
    "",
  ].join("\n");
}
