import Image from "next/image";
import Link from "next/link";

import { getListings } from "@/lib/listing/listings";
import { getListingCovers } from "@/lib/listing/gallery";

const STATUS_LABELS: Record<string, string> = {
  "til-salgs": "Til salgs",
  reservert: "Reservert",
  kommer: "Kommer",
  solgt: "Solgt",
};

const CITY_LABELS: Record<string, string> = {
  bodo: "Bodø",
  tromso: "Tromsø",
  harstad: "Harstad",
  alta: "Alta",
  narvik: "Narvik",
  lofoten: "Lofoten",
  "mo-i-rana": "Mo i Rana",
  sortland: "Sortland",
  svolvaer: "Svolvær",
  hammerfest: "Hammerfest",
  stokmarknes: "Stokmarknes",
  ulvsvag: "Ulvsvåg",
  andenes: "Andenes",
  lodingen: "Lødingen",
  glomfjord: "Glomfjord",
  steigen: "Steigen",
  saltstraumen: "Saltstraumen",
  fauske: "Fauske",
};

function formatInt(value: number) {
  return new Intl.NumberFormat("nb-NO").format(value);
}

function formatDecimal(value: number, max = 1) {
  return new Intl.NumberFormat("nb-NO", { maximumFractionDigits: max }).format(
    value,
  );
}

interface ActiveListingsStripProps {
  /** Editorial section eyebrow, e.g. "06 — Aktuelle salgsoppdrag". */
  eyebrow: string;
  /** Section heading. */
  title: React.ReactNode;
  /** Optional supporting paragraph below the heading. */
  lede?: string;
  /** Filter to a specific city slug (bodo|tromso|...). Omit for all cities. */
  city?: string;
  /** Filter to a specific listing type (kontor|logistikk|...). */
  type?: string;
  /** Max cards to render. Defaults to 3. */
  limit?: number;
  /** Bypass the "exclude reservert/solgt" filter — used for archive pages. */
  includeInactive?: boolean;
}

/**
 * Editorial cross-link strip surfacing active eiendommer mandates on
 * /tjenester/* and /naringsmegler/* pages. Reuses the .ei-card chrome
 * from advanti-design.css so it visually matches the public listings
 * grid.
 */
export async function ActiveListingsStrip({
  eyebrow,
  title,
  lede,
  city,
  type,
  limit = 3,
  includeInactive = false,
}: ActiveListingsStripProps) {
  const all = await getListings();
  const filtered = all.filter((listing) => {
    if (!includeInactive && listing.status === "solgt") return false;
    if (city && listing.city !== city) return false;
    if (type && listing.type !== type) return false;
    return true;
  });
  // Featured first, then the rest by order.
  const sorted = filtered.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.order - b.order;
  });
  const cards = sorted.slice(0, limit);

  if (cards.length === 0) return null;

  // CRM-published covers (Supabase), keyed by slug; MDX cover is the fallback —
  // same source as the /eiendommer grid so a publish updates every card.
  const covers = await getListingCovers(cards.map((c) => c.slug));

  return (
    <section className="section section-divider">
      <div className="wrap">
        <div className="head-compact">
          <span className="eyebrow">{eyebrow}</span>
          <div>
            <h2>{title}</h2>
            {lede && <p>{lede}</p>}
          </div>
        </div>

        <div className="ei-grid" style={{ marginTop: 40 }}>
          {cards.map((listing) => {
            const cityLabel = CITY_LABELS[listing.city] ?? listing.city;
            const statusLabel =
              listing.statusLabel ??
              STATUS_LABELS[listing.status] ??
              listing.status;
            return (
              <Link
                key={listing.slug}
                href={`/eiendommer/${listing.slug}`}
                className="ei-card"
              >
                <div className="ei-card-photo">
                  <Image
                    src={covers[listing.slug]?.src ?? listing.coverImage}
                    alt={covers[listing.slug]?.alt ?? listing.coverImageAlt}
                    fill
                    sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className={`ei-status ${listing.status}`}>
                    <span className="dot" />
                    {statusLabel}
                  </div>
                </div>
                <div className="top">
                  <span>{listing.cardEyebrow}</span>
                  <span>{cityLabel}</span>
                </div>
                <div>
                  <h3>
                    {listing.titleHead}{" "}
                    <span className="italic">{listing.titleTail}</span>
                  </h3>
                  <p className="addr">{listing.address}</p>
                </div>
                <div className="stat-row">
                  <div>
                    <div className="l">BTA</div>
                    <div className="v">
                      {formatInt(listing.bta)}
                      <span className="unit">m²</span>
                    </div>
                  </div>
                  <div>
                    <div className="l">
                      {listing.ferdig ? "Ferdig" : "Prisant."}
                    </div>
                    <div className="v">
                      {listing.ferdig ??
                        (listing.prisantydning !== undefined
                          ? `${listing.prisantydningEstimat ? "est. " : ""}${formatInt(listing.prisantydning)}`
                          : "—")}
                      {!listing.ferdig &&
                        listing.prisantydning !== undefined && (
                          <span className="unit">mnok</span>
                        )}
                    </div>
                  </div>
                  <div>
                    <div className="l">Yield</div>
                    <div className="v">
                      {listing.yieldNetto !== undefined
                        ? `${listing.yieldEstimat ? "est. " : ""}${formatDecimal(listing.yieldNetto, 1).replace(".", ",")}`
                        : "—"}
                      {listing.yieldNetto !== undefined && (
                        <span className="unit">%</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link href="/eiendommer" className="btn btn-outline">
            Se alle aktive oppdrag <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
