import {
  allBlogPosts,
  allHelpPosts,
  allLocationPosts,
  allCustomersPosts,
} from "content-collections";
import { siteConfig } from "../siteConfig";
import { getListings } from "@/lib/listing/listings";
import {
  SERVICE_SLUGS,
  SERVICE_CITY_SLUGS,
  getServiceDef,
  getServiceCityLocation,
} from "@/lib/service-cities";

// llmstxt.org-compliant Markdown for AI engines (ChatGPT, Claude, Perplexity,
// Google AI Overviews). Hand-curated section headings + descriptions; auto-listed
// entries inside each section from the same sources that drive sitemap.ts.
//
// ISR (not force-static): the listing section is sourced from the CRM (Supabase)
// via getListings(), so revalidate on the same window as /eiendommer + sitemap so
// a newly published mandate is exposed to AI engines without a redeploy.
export const revalidate = 600;

const SERVICES: Array<{
  path: string;
  title: string;
  description: string;
}> = [
  {
    path: "/tjenester/salg",
    title: "Salg av næringseiendom",
    description:
      "Salgsprosess fra verdivurdering til oppgjør. Åpen eller diskré markedsføring; resultatbasert honorar.",
  },
  {
    path: "/tjenester/utleie",
    title: "Utleie av næringseiendom",
    description:
      "Utleie av kontor, butikk og lager. Leietakerstrategi, markedsføring og kontraktsforhandling.",
  },
  {
    path: "/tjenester/verdivurdering",
    title: "Verdivurdering",
    description:
      "DCF-analyse, yield-beregning og markedsbaserte verdivurderinger av næringseiendom.",
  },
  {
    path: "/tjenester/radgivning",
    title: "Rådgivning",
    description:
      "Strategisk og transaksjonsrettet rådgivning for eiere og investorer i næringseiendom.",
  },
  {
    path: "/tjenester/transaksjoner",
    title: "Transaksjoner",
    description:
      "Due diligence, forhandling og strukturering av eiendomstransaksjoner.",
  },
  {
    path: "/tjenester/strategisk-radgivning",
    title: "Strategisk rådgivning",
    description:
      "Porteføljestrategi, exit-planlegging og langsiktig posisjonering i eiendomsmarkedet.",
  },
];

function line(title: string, url: string, description?: string): string {
  return description
    ? `- [${title}](${url}): ${description}`
    : `- [${title}](${url})`;
}

async function buildBody(baseUrl: string): Promise<string> {
  const sections: string[] = [];

  // H1 + blockquote summary per llmstxt.org spec.
  sections.push(`# Advanti`);
  sections.push(
    `> Næringsmegler i Nord-Norge. Salg, utleie, verdivurdering og rådgivning for næringseiendom i Nordland, Troms og Finnmark. Datadrevet, lokalt forankret, partnerstyrt.`,
  );

  sections.push(
    [
      `Advanti er et meglerhus for næringseiendom med kontorer i Nord-Norge.`,
      `Vi kombinerer lokal markedskunnskap med kvantitativ analyse (DCF, yield, sensitivitet) for å hjelpe eiere, investorer og leietakere ta bedre beslutninger.`,
      `Hovedmarkedene er Bodø, Tromsø, Alta, Harstad, Narvik, Mo i Rana og Lofoten.`,
      `Kontakt: ${siteConfig.contact?.email ?? "post@advantiestate.no"}.`,
    ].join(" "),
  );

  sections.push(`## Tjenester`);
  sections.push(
    SERVICES.map((s) => line(s.title, `${baseUrl}${s.path}`, s.description)).join(
      "\n",
    ),
  );

  // Service × city landing pages — the high-intent combinations ("salg av
  // næringseiendom i Bodø" etc.) that AI engines map directly to a query.
  const serviceCityLines: string[] = [];
  for (const citySlug of SERVICE_CITY_SLUGS) {
    const location = getServiceCityLocation(citySlug);
    if (!location) continue;
    for (const serviceSlug of SERVICE_SLUGS) {
      const service = getServiceDef(serviceSlug);
      if (!service) continue;
      serviceCityLines.push(
        line(
          `${service.noun} i ${location.name}`,
          `${baseUrl}/tjenester/${service.slug}/${location.slug}`,
          service.metaDescription(location.name, location.region),
        ),
      );
    }
  }
  if (serviceCityLines.length > 0) {
    sections.push(`## Tjenester per by`);
    sections.push(serviceCityLines.join("\n"));
  }

  sections.push(`## Lokasjoner`);
  const orderedLocations = [...allLocationPosts].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  sections.push(
    orderedLocations
      .map((loc) =>
        line(
          `Næringsmegler i ${loc.name}`,
          `${baseUrl}/naringsmegler/${loc.slug}`,
          loc.hero?.description,
        ),
      )
      .join("\n"),
  );

  // Active mandates — surfaces the eiendommer inventory directly to AI engines
  // (ChatGPT, Claude, Perplexity, Google AI Overviews). Source of truth is the
  // CRM (Supabase) via getListings(), with MDX folded in as a fallback — the
  // same source that drives the public /eiendommer index and sitemap, so the
  // three sources cannot drift apart. Excludes sold listings.
  const activeListings = (await getListings())
    .filter((listing) => listing.status !== "solgt")
    .sort((a, b) => a.order - b.order);
  if (activeListings.length > 0) {
    sections.push(`## Eiendommer for salg og leie`);
    sections.push(
      activeListings
        .map((listing) =>
          line(
            `${listing.titleHead} ${listing.titleTail}`.replace(/\s+/g, " ").trim(),
            `${baseUrl}/eiendommer/${listing.slug}`,
            listing.summary,
          ),
        )
        .join("\n"),
    );
  }

  sections.push(`## Hjelp og terminologi`);
  sections.push(
    [...allHelpPosts]
      .sort((a, b) => a.title.localeCompare(b.title, "nb-NO"))
      .map((post) =>
        line(post.title, `${baseUrl}/help/article/${post.slug}`, post.summary),
      )
      .join("\n"),
  );

  sections.push(`## Kundehistorier`);
  sections.push(
    [...allCustomersPosts]
      .sort((a, b) =>
        (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
      )
      .map((post) =>
        line(post.title, `${baseUrl}/kunder/${post.slug}`, post.summary),
      )
      .join("\n"),
  );

  // ## Optional per llmstxt.org spec — secondary content the AI should treat
  // as supporting context, not primary signal.
  sections.push(`## Optional`);
  sections.push(
    [
      line(
        "Markedsinnsikt",
        `${baseUrl}/markedsinnsikt`,
        "Datadrevet markedsanalyse for næringseiendom i Nord-Norge.",
      ),
      line(
        "Markedskart",
        `${baseUrl}/markedsinnsikt/kart`,
        "Interaktivt kart over prissoner og transaksjoner.",
      ),
      line(
        "Markedsrapport",
        `${baseUrl}/markedsrapport`,
        "Kvartalsvis PDF-rapport med yield, leiepriser og transaksjoner.",
      ),
      line(
        "Verktøy",
        `${baseUrl}/verktoy`,
        "Yield-, ROI- og boliglånkalkulatorer.",
      ),
      line(
        "Blogg",
        `${baseUrl}/blog`,
        "Artikler om næringseiendom, verdsettelse og markedet i Nord-Norge.",
      ),
      ...[...allBlogPosts]
        .sort((a, b) =>
          (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
        )
        .slice(0, 12)
        .map((post) =>
          line(post.title, `${baseUrl}/blog/${post.slug}`, post.summary),
        ),
      line("Om oss", `${baseUrl}/om-oss`),
      line("Personer", `${baseUrl}/personer`),
      line("Karriere", `${baseUrl}/karriere`),
      line("Kontakt", `${baseUrl}/kontakt`),
    ].join("\n"),
  );

  return sections.join("\n\n") + "\n";
}

export async function GET(): Promise<Response> {
  const body = await buildBody(siteConfig.url);
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
