import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { getActiveListings } from "@/lib/content";
import { SubHero } from "@/components/site/SubHero";
import {
  ListingsBrowser,
  type ListingCardData,
} from "@/components/eiendommer/ListingsBrowser";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

const CITY_LABELS: Record<string, string> = {
  bodo: "Bodø",
  tromso: "Tromsø",
  harstad: "Harstad",
  alta: "Alta",
  narvik: "Narvik",
  lofoten: "Lofoten",
  "mo-i-rana": "Mo i Rana",
};

const STATUS_LABELS: Record<string, string> = {
  "til-salgs": "Til salgs",
  reservert: "Reservert",
  kommer: "Kommer",
  solgt: "Solgt",
};

// Off-market teasers — static editorial content, not driven by the collection.
// These exist to communicate Advanti's confidential mandate book without
// publishing identifying details.
const OFF_MARKET = [
  {
    ref: "OM-241",
    titleHead: "Hotell- og konferanseanlegg",
    titleTail: "i Lofoten.",
    type: "Hotell",
    bta: "8 600",
    price: "~180",
    status: "NDA",
  },
  {
    ref: "OM-238",
    titleHead: "Logistikkportefølje —",
    titleTail: "tre eiendommer, samme leietaker.",
    type: "Logistikk",
    bta: "28 400",
    price: "~340",
    status: "Aktiv",
  },
  {
    ref: "OM-235",
    titleHead: "Sentrumskvartal",
    titleTail: "med utviklingspotensial, Tromsø.",
    type: "Utvikling",
    bta: "12 800",
    price: "~260",
    status: "Teaser",
  },
  {
    ref: "OM-231",
    titleHead: "Single-tenant kontor —",
    titleTail: "offentlig leietaker, 12 år.",
    type: "Kontor",
    bta: "5 200",
    price: "~118",
    status: "NDA",
  },
];

export const metadata = constructMetadata({
  path: "/eiendommer",
  title: "Eiendommer for salg i Nord-Norge | Advanti Estate",
  description:
    "Kuratert utvalg av næringseiendommer Advanti har til salgs i Nord-Norge — kontor, logistikk, handel og kombinasjonsbygg. Pluss off-market-oppdrag for kvalifiserte investorer.",
});

function formatInt(value: number) {
  return new Intl.NumberFormat("nb-NO").format(value);
}

function formatDecimal(value: number, max = 1) {
  return new Intl.NumberFormat("nb-NO", { maximumFractionDigits: max }).format(
    value,
  );
}

function formatEditorialDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EiendommerPage() {
  const listings = getActiveListings();

  // KPI totals
  const activeCount = listings.filter(
    (listing) => listing.status === "til-salgs" || listing.status === "reservert",
  ).length;
  const totalBta = listings.reduce((acc, listing) => acc + listing.bta, 0);
  const totalPrice = listings.reduce(
    (acc, listing) => acc + (listing.prisantydning ?? 0),
    0,
  );
  const yieldWeighted =
    listings.reduce(
      (acc, listing) =>
        acc + (listing.yieldNetto ?? 0) * listing.bta,
      0,
    ) /
    (listings.reduce(
      (acc, listing) => acc + (listing.yieldNetto ? listing.bta : 0),
      0,
    ) || 1);

  const newestUpdated = listings
    .map((listing) => listing.updatedAt ?? listing.publishedAt)
    .sort()
    .at(-1)!;

  // Status / type / city counts for filter chips
  const statusCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  for (const listing of listings) {
    statusCounts[listing.status] = (statusCounts[listing.status] ?? 0) + 1;
    typeCounts[listing.type] = (typeCounts[listing.type] ?? 0) + 1;
    cityCounts[listing.city] = (cityCounts[listing.city] ?? 0) + 1;
  }

  // Build cards (featured separated from the grid items)
  const allCards: ListingCardData[] = listings.map((listing, index) => ({
    slug: listing.slug,
    href: `/eiendommer/${listing.slug}`,
    status: listing.status,
    statusLabel: listing.statusLabel ?? STATUS_LABELS[listing.status],
    type: listing.type,
    typeLabel: listing.typeLabel,
    city: listing.city,
    cityLabel: CITY_LABELS[listing.city] ?? listing.city,
    titleHead: listing.titleHead,
    titleTail: listing.titleTail,
    address: listing.address,
    cardEyebrow: listing.cardEyebrow,
    bta: listing.bta,
    prisantydning: listing.prisantydning,
    prisantydningEstimat: listing.prisantydningEstimat ?? false,
    yieldNetto: listing.yieldNetto,
    yieldEstimat: listing.yieldEstimat ?? false,
    ferdig: listing.ferdig,
    coverImage: listing.coverImage,
    coverImageAlt: listing.coverImageAlt,
    featured: listing.featured ?? false,
    featuredEyebrow: listing.featuredEyebrow,
    summary: listing.summary,
    utleiegrad: listing.utleiegrad,
    megler: listing.megler
      ? {
          name: listing.megler.name,
          role: listing.megler.role,
          avatar: listing.megler.avatar,
        }
      : undefined,
    position: index + 1,
  }));

  const featuredCard = allCards.find((card) => card.featured);
  const gridCards = allCards.filter((card) => !card.featured);

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Eiendommer for salg", url: "/eiendommer" },
        ]}
      />

      <SubHero
        crumb={[
          { label: "Hjem", href: "/" },
          { label: "Eiendommer for salg" },
        ]}
        eyebrow={`Aktive salgsoppdrag · oppdatert ${formatEditorialDate(newestUpdated)}`}
        title={
          <>
            Næringseiendom <br />
            <span className="italic">til salgs i nord.</span>
          </>
        }
        lede="Et kuratert utvalg av eiendommer vi har til salgs i Nord-Norge — kontor, logistikk, handel og kombinasjonsbygg. Pluss konfidensielle oppdrag for kvalifiserte investorer."
      />

      {/* KPI BAND */}
      <section className="section-tight">
        <div className="wrap">
          <div className="mi-kpis">
            <div className="mi-kpi">
              <div className="label">Aktive oppdrag</div>
              <div className="val">
                {activeCount}
                <span className="unit">til salgs nå</span>
              </div>
              <div className="delta">Oppdatert {formatEditorialDate(newestUpdated)}</div>
            </div>
            <div className="mi-kpi">
              <div className="label">Totalareal</div>
              <div className="val">
                {formatInt(totalBta)}
                <span className="unit">m²</span>
              </div>
              <div className="delta">På {listings.length} eiendommer</div>
            </div>
            <div className="mi-kpi">
              <div className="label">Samlet prisantydning</div>
              <div className="val">
                {formatDecimal(totalPrice / 1000, 2)}
                <span className="unit">mrd</span>
              </div>
              <div className="delta">
                Spenn: {formatInt(Math.min(...listings.filter(l => l.prisantydning).map(l => l.prisantydning!)))}
                {" – "}
                {formatInt(Math.max(...listings.filter(l => l.prisantydning).map(l => l.prisantydning!)))}{" mnok"}
              </div>
            </div>
            <div className="mi-kpi">
              <div className="label">Snitt-yield</div>
              <div className="val">
                {formatDecimal(yieldWeighted, 1).replace(".", ",")}
                <span className="unit">%</span>
              </div>
              <div className="delta">Vektet på areal</div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER + FEATURED + GRID + ALERT */}
      <ListingsBrowser
        featured={featuredCard}
        items={gridCards}
        counts={{
          status: statusCounts,
          type: typeCounts,
          by: cityCounts,
          total: listings.length,
        }}
      />

      {/* OFF-MARKET BAND */}
      <section className="ei-offmarket">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="pre">Konfidensielle oppdrag</div>
              <h2>
                Off-market — <span className="italic">for kvalifiserte kjøpere.</span>
              </h2>
            </div>
            <p>
              Vi formidler et utvalg av eiendommer som ikke annonseres åpent — av
              diskresjonshensyn, eller fordi selger ønsker en målrettet prosess.{" "}
              <Link href="/kontakt">Meld deg på for å få tilgang</Link>, så
              tar vi en samtale om hva som er aktuelt for deg.
            </p>
          </div>

          <div className="ei-offmarket-list">
            {OFF_MARKET.map((row) => (
              <Link
                key={row.ref}
                className="ei-offmarket-row"
                href="/kontakt"
              >
                <span className="ref">{row.ref}</span>
                <div>
                  <div className="title">
                    {row.titleHead}{" "}
                    <span className="it">{row.titleTail}</span>
                  </div>
                </div>
                <div>
                  <div className="cell-l">Type</div>
                  <div className="cell-v">{row.type}</div>
                </div>
                <div className="col-hide">
                  <div className="cell-l">BTA</div>
                  <div className="cell-v">
                    {row.bta}
                    <span className="unit">m²</span>
                  </div>
                </div>
                <div className="col-hide-m">
                  <div className="cell-l">Prisant.</div>
                  <div className="cell-v">
                    {row.price}
                    <span className="unit">mnok</span>
                  </div>
                </div>
                <div className="col-hide">
                  <div className="cell-l">Status</div>
                  <div className="cell-v">{row.status}</div>
                </div>
                <div className="arr">→</div>
              </Link>
            ))}
          </div>

          <div className="ei-offmarket-foot">
            <span className="nda">
              Off-market-eiendommer deles kun etter en innledende samtale og
              signert taushetserklæring.
            </span>
            <Link href="/kontakt" className="btn-light">
              Få tilgang til off-market <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="cta-strip">
        <div className="wrap">
          <span
            className="eyebrow center no-rule"
            style={{ marginBottom: 24 }}
          >
            For selgere
          </span>
          <h2>
            Vurderer du å selge <br />
            <span className="italic">din eiendom?</span>
          </h2>
          <p>
            Vi gir deg en uforpliktende verdivurdering, en konkret prosessplan
            og navn på de mest sannsynlige kjøperne i markedet i dag.
          </p>
          <div className="row">
            <Link href="/kontakt" className="btn btn-dark">
              Få verdivurdering <span className="arrow">→</span>
            </Link>
            <Link href="/tjenester/salg" className="btn btn-outline">
              Slik jobber vi med salg
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
