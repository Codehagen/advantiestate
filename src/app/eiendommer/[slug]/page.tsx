import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MDX } from "@/components/blog/mdx";
import { GalleryLightbox } from "@/components/eiendommer/GalleryLightbox";
import { PropertyMap } from "@/components/eiendommer/PropertyMap";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { jsonLdScriptProps } from "@/lib/jsonLd";
import { siteConfig } from "@/app/siteConfig";
import { getListing, getListings } from "@/lib/listing/listings";
import { ListingProse } from "@/components/eiendommer/ListingProse";
import { getListingGallery, getListingCovers } from "@/lib/listing/gallery";
import { getListingDownloads } from "@/lib/listing/downloads";
import { constructMetadata } from "@/lib/utils";

// Gallery comes from the CRM Supabase projection (published via CRM). ISR so a
// publish appears within the window without a redeploy. MDX stays the source of
// truth for editorial copy + the slug list (generateStaticParams).
export const revalidate = 600;

const STATUS_LABELS: Record<string, string> = {
  "til-salgs": "Til salgs",
  "til-leie": "Til leie",
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

function formatEditorialDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// CRM-published slugs not in the prebuilt set render on demand (then cache).
export const dynamicParams = true;

export async function generateStaticParams() {
  const listings = await getListings();
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) return;
  // Drop the " | Advanti Estate" brand suffix — listing titles already pack
  // address + m² + headline into ~50 chars; appending the brand pushes most
  // listings past Google's SERP truncation at ~60. og:site_name + canonical
  // already carry the brand. Use the per-listing OG card route so social
  // shares show price/yield/BTA over the cover photo.
  // A long marketing headline blows past Google's ~60-char SERP truncation.
  // For those, fall back to a tight "address – type" <title> (good for local
  // SEO); keep the full headline when it already fits. The visible H1 is
  // unaffected — it still renders listing.title / titleHead / titleTail.
  const shortType = (listing.typeLabel ?? "").split(/[·+]/)[0].trim();
  const composedMeta = [listing.address, shortType]
    .filter(Boolean)
    .join(" – ");
  const metaTitle =
    listing.title.length <= 60
      ? listing.title
      : composedMeta.length > 0 && composedMeta.length <= 60
        ? composedMeta
        : listing.address && listing.address.length <= 60
          ? listing.address
          : listing.title;

  return constructMetadata({
    path: `/eiendommer/${listing.slug}`,
    title: metaTitle,
    description: listing.summary,
    image: `/api/og/listing/${listing.slug}`,
    imageAlt: listing.coverImageAlt,
  });
}

export default async function EiendomDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  // The four fetches are independent of each other (gallery/downloads key on
  // slug, not on the listing row; the all-listings query feeds the related
  // cards) — run them in parallel. Only the related-covers lookup needs a
  // prior result. Same pattern as onboarding.ts / PERFORMANCE_PLAN.md 4.1.
  const [listing, dbGallery, dbDownloads, allListings] = await Promise.all([
    getListing(slug),
    getListingGallery(slug),
    getListingDownloads(slug),
    getListings(),
  ]);
  if (!listing) notFound();

  const statusLabel =
    listing.statusLabel ?? STATUS_LABELS[listing.status] ?? listing.status;
  const cityLabel = CITY_LABELS[listing.city] ?? listing.city;

  // Prefer the CRM-published Supabase gallery; fall back to MDX, then cover.
  const gallery =
    dbGallery && dbGallery.gallery.length > 0
      ? dbGallery.gallery
      : listing.gallery && listing.gallery.length > 0
        ? listing.gallery
        : [{ src: listing.coverImage, alt: listing.coverImageAlt }];
  const coverSrc = dbGallery?.cover?.src ?? listing.coverImage;

  // Downloads: CRM-published projection, MDX fallback.
  const downloads = dbDownloads ?? listing.downloads;
  const mainImg = gallery[0];
  const sideImgs = gallery.slice(1, 3);

  const updatedLabel = listing.updatedAt
    ? formatEditorialDate(listing.updatedAt)
    : formatEditorialDate(listing.publishedAt);

  // Related: two other listings, preferring same type then proximity in order.
  const related = allListings
    .filter((other) => other.slug !== listing.slug)
    .sort((a, b) => {
      const aSame = a.type === listing.type ? 0 : 1;
      const bSame = b.type === listing.type ? 0 : 1;
      return aSame - bSame || a.order - b.order;
    })
    .slice(0, 2);

  // CRM-published covers (Supabase) for the related cards — same source as the
  // hero gallery above, so the "Lignende oppdrag" thumbnails don't show a stale
  // MDX photo after a publish. MDX cover is the fallback.
  const relatedCovers = await getListingCovers(related.map((r) => r.slug));

  // RealEstateListing JSON-LD — schema.org type that AI Overviews and search
  // engines treat as a first-class property listing. Keeps the @id linked to
  // the site Organization graph so it appears as Advanti's mandate, not an
  // unattributed node.
  const baseUrl = siteConfig.url;
  const listingUrl = `${baseUrl}/eiendommer/${listing.slug}`;
  const realEstateJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${listingUrl}#listing`,
    url: listingUrl,
    name: listing.title,
    description: listing.summary,
    image: coverSrc.startsWith("http") ? coverSrc : `${baseUrl}${coverSrc}`,
    datePosted: listing.publishedAt,
    ...(listing.updatedAt ? { dateModified: listing.updatedAt } : {}),
    provider: {
      "@type": "RealEstateAgent",
      "@id": `${baseUrl}/#organization`,
    },
    ...(listing.prisantydning
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "NOK",
            price: listing.prisantydning * 1_000_000,
          },
        }
      : {}),
    object: {
      "@type": "Accommodation",
      name: listing.title,
      address: {
        "@type": "PostalAddress",
        streetAddress: listing.address,
        addressLocality: cityLabel,
        addressCountry: "NO",
      },
      floorSize: {
        "@type": "QuantitativeValue",
        value: listing.bta,
        unitCode: "MTK",
      },
    },
  };

  return (
    <>
      <script {...jsonLdScriptProps(realEstateJsonLd)} />

      <div className="page-pad" />

      {/* SUBHERO — crumb + gallery */}
      <section style={{ padding: "32px 0 0" }}>
        <div className="wrap">
          <Breadcrumbs
            path={`/eiendommer/${listing.slug}`}
            leafLabel={listing.title}
          />

          {/* GALLERY — server-rendered grid; GalleryLightbox (client) adds the
              click-to-enlarge lightbox over the full gallery via data-gallery-index. */}
          <GalleryLightbox images={gallery}>
            <div className="ed-gallery">
              <div className="g-main">
                <div className={`ei-status ${listing.status}`}>
                  <span className="dot" />
                  {statusLabel}
                </div>
                <Image
                  src={mainImg.src}
                  alt={mainImg.alt}
                  fill
                  priority
                  sizes="(max-width: 880px) 100vw, 60vw"
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="ed-tile-btn"
                  data-gallery-index={0}
                  aria-label={`Åpne bilde 1 av ${gallery.length}`}
                />
              </div>
              {sideImgs.map((img, index) => (
                <div className="g-side" key={`${img.src}-${index}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 880px) 100vw, 30vw"
                    style={{ objectFit: "cover" }}
                  />
                  {/* Honest "+N" count: total photos minus the 3 visible tiles.
                      photoCount is unreliable (can exceed the real array). */}
                  {index === sideImgs.length - 1 && gallery.length > 3 && (
                    <div className="g-more">
                      <span className="ct">+ {gallery.length - 3}</span> bilder
                    </div>
                  )}
                  <button
                    type="button"
                    className="ed-tile-btn"
                    data-gallery-index={index + 1}
                    aria-label={`Åpne bilde ${index + 2} av ${gallery.length}`}
                  />
                </div>
              ))}
            </div>
          </GalleryLightbox>

          {/* TITLE BLOCK */}
          <div className="ed-title">
            <div>
              <span className="pre">
                {listing.featured ? "Utvalgt oppdrag" : "Aktivt oppdrag"} ·
                {" "}
                {listing.reference}
              </span>
              <h1>
                {listing.titleHead} <br />
                <span className="italic">{listing.titleTail}</span>
              </h1>
              <div className="addr">
                <span>{listing.address}</span>
                <span className="sep" />
                <span className="ref">Ref. {listing.reference}</span>
              </div>
            </div>
            <div className="ed-title-actions">
              <span
                style={{ fontSize: 12, color: "var(--warm-grey-85)" }}
              >
                Oppdatert {updatedLabel}
              </span>
            </div>
          </div>

          {/* HEADLINE STATS */}
          <div className="ed-stats">
            <div>
              <div className="l">BTA</div>
              <div className="v">
                {formatInt(listing.bta)}
                <span className="unit">m²</span>
              </div>
              {listing.facts?.find((f) => f.label === "Antall etasjer") && (
                <div className="sub">
                  {listing.facts.find((f) => f.label === "Antall etasjer")?.value}
                </div>
              )}
            </div>
            {listing.status === "til-leie" && listing.leieKrM2 !== undefined ? (
              <div>
                <div className="l">Leiepris</div>
                <div className="v">
                  {formatInt(listing.leieKrM2)}
                  <span className="unit">kr/m²</span>
                </div>
                <div className="sub">Per år</div>
              </div>
            ) : listing.prisantydning !== undefined ? (
              <div>
                <div className="l">Prisantydning</div>
                <div className="v">
                  {listing.prisantydningEstimat ? "est. " : ""}
                  {formatInt(listing.prisantydning)}
                  <span className="unit">mnok</span>
                </div>
                <div className="sub">Eks. omk.</div>
              </div>
            ) : listing.ferdig ? (
              <div>
                <div className="l">Ferdigstilles</div>
                <div className="v">{listing.ferdig}</div>
                <div className="sub">Forhåndsutleie pågår</div>
              </div>
            ) : null}
            {listing.yieldNetto !== undefined && (
              <div>
                <div className="l">Yield</div>
                <div className="v">
                  {listing.yieldEstimat ? "est. " : ""}
                  {formatDecimal(listing.yieldNetto, 1).replace(".", ",")}
                  <span className="unit">%</span>
                </div>
                <div className="sub">Netto, normalisert</div>
              </div>
            )}
            {listing.utleiegrad !== undefined && (
              <div>
                <div className="l">Utleiegrad</div>
                <div className="v">
                  {formatInt(listing.utleiegrad)}
                  <span className="unit">%</span>
                </div>
                <div className="sub">Per {updatedLabel}</div>
              </div>
            )}
            {listing.wault !== undefined && (
              <div>
                <div className="l">WAULT</div>
                <div className="v">
                  {formatDecimal(listing.wault, 1).replace(".", ",")}
                  <span className="unit">år</span>
                </div>
                <div className="sub">Vektet snitt</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BODY + MEGLER */}
      <section>
        <div className="wrap">
          <div className="ed-body">
            <div>
              {listing.lede && (
                <p className="lead">
                  {listing.lede.split("<i>").length > 1 ? (
                    <>
                      {listing.lede.split("<i>")[0]}
                      <span className="italic">
                        {listing.lede.split("<i>")[1].split("</i>")[0]}
                      </span>
                      {listing.lede.split("</i>")[1] ?? ""}
                    </>
                  ) : (
                    listing.lede
                  )}
                </p>
              )}
              {listing.source === "crm" ? (
                listing.body ? <ListingProse body={listing.body} /> : null
              ) : (
                <MDX code={listing.mdx!} images={[]} />
              )}
            </div>

            <aside className="ed-megler">
              <div className="pre">Ansvarlig megler</div>
              {listing.megler ? (
                <>
                  <div className="pp">
                    <Image
                      src={listing.megler.avatar}
                      alt={listing.megler.name}
                      width={64}
                      height={64}
                    />
                    <div className="nm">
                      <div className="n">{listing.megler.name}</div>
                      <div className="r">{listing.megler.role}</div>
                    </div>
                  </div>
                  <div className="contact">
                    <div>
                      <div className="l">Mobil</div>
                      <a href={`tel:${listing.megler.phone.replace(/\s/g, "")}`}>
                        {listing.megler.phone}
                      </a>
                    </div>
                    <div>
                      <div className="l">E-post</div>
                      <a href={`mailto:${listing.megler.email}`}>
                        {listing.megler.email}
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--warm-grey-85)",
                    lineHeight: 1.55,
                    margin: "12px 0 20px",
                  }}
                >
                  Ta kontakt for prospekt, datarom og visning — vi kobler deg
                  med megleren som har ansvaret for oppdraget.
                </p>
              )}
              <div className="cta-row">
                <Link href="/kontakt" className="btn btn-primary">
                  Be om prospekt <span className="arrow">→</span>
                </Link>
                <Link href="/kontakt" className="btn btn-ghost">
                  Bestill visning
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FACTS */}
      {listing.facts && listing.facts.length > 0 && (
        <section className="ed-section">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">01 · Nøkkeltall</span>
              <div>
                <h2>
                  Tekniske data og{" "}
                  <span className="italic">eiendomsinformasjon.</span>
                </h2>
              </div>
            </div>
            <div className="ed-facts">
              <dl>
                {listing.facts
                  .slice(0, Math.ceil(listing.facts.length / 2))
                  .map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
              </dl>
              <dl>
                {listing.facts
                  .slice(Math.ceil(listing.facts.length / 2))
                  .map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* TENANTS */}
      {listing.tenants && listing.tenants.length > 0 && (
        <section className="ed-section">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">02 · Leieoversikt</span>
              <div>
                <h2>
                  {listing.tenants.length} leietakere —{" "}
                  <span className="italic">balansert miks.</span>
                </h2>
                {listing.tenantsNote && <p>{listing.tenantsNote}</p>}
              </div>
            </div>
            <table className="ed-tenants">
              <thead>
                <tr>
                  <th>Leietaker</th>
                  <th>Etasjer</th>
                  <th className="num">Areal</th>
                  <th className="num col-hide">Leie kr/m²</th>
                  <th className="num">Årlig leie</th>
                  <th className="num col-hide">Kontrakt til</th>
                  <th className="num">Andel</th>
                </tr>
              </thead>
              <tbody>
                {listing.tenants.map((tenant) => (
                  <tr
                    key={tenant.name}
                    className={tenant.ledig ? "tenant-ledig" : undefined}
                  >
                    <td>
                      <div className="name">{tenant.name}</div>
                      <div className="sector">{tenant.sector}</div>
                    </td>
                    <td>{tenant.etasjer}</td>
                    <td className="num">
                      <span className="v">
                        {formatInt(tenant.areal)}
                        <span className="unit">m²</span>
                      </span>
                    </td>
                    <td className="num col-hide">
                      <span className="v">
                        {tenant.leieKrM2
                          ? `${tenant.ledig ? "est. " : ""}${formatInt(tenant.leieKrM2)}`
                          : "—"}
                      </span>
                    </td>
                    <td className="num">
                      <span className="v">
                        {tenant.leieArligEstimat ? "est. " : ""}
                        {formatDecimal(tenant.leieArlig, 2).replace(".", ",")}
                        <span className="unit">mnok</span>
                      </span>
                    </td>
                    <td className="num col-hide">
                      <span className="v">{tenant.kontraktTil ?? "—"}</span>
                    </td>
                    <td className="num">
                      <span className="v">
                        {tenant.andel}
                        <span className="unit">%</span>
                      </span>
                      {!tenant.ledig && (
                        <span className="bar">
                          <i style={{ right: `${100 - tenant.andel}%` }} />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={7}>
                    Tall hentet fra siste utleieoversikt. Full leiekontrakt-DD
                    følger datarommet.
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}

      {/* FINANCIALS */}
      {listing.financials && (
        <section className="ed-fin">
          <div className="wrap">
            <div className="head">
              <div>
                <div className="pre">03 · Økonomi</div>
              </div>
              <div>
                <h2>
                  Forventet kontant­strøm{" "}
                  <span className="italic">og avkastning.</span>
                </h2>
                {listing.financials.intro && <p>{listing.financials.intro}</p>}
              </div>
            </div>
            <div className="ed-fin-grid">
              <div>
                <div className="l">Brutto leieinntekt</div>
                <div className="v">
                  {formatDecimal(listing.financials.bruttoLeie, 1).replace(".", ",")}
                  <span className="unit">mnok</span>
                </div>
                <div className="sub">
                  Normalisert år 1 · inkl. ledig estimert til markedsleie
                </div>
              </div>
              <div>
                <div className="l">Eierkostnader</div>
                <div className="v">
                  {formatDecimal(listing.financials.eierkostnader, 1).replace(".", ",")}
                  <span className="unit">mnok</span>
                </div>
                <div className="sub">
                  Drift, forvaltning, eiendomsskatt, forsikring
                </div>
              </div>
              <div>
                <div className="l">Netto driftsresultat</div>
                <div className="v">
                  {formatDecimal(listing.financials.noi, 1).replace(".", ",")}
                  <span className="unit">mnok</span>
                </div>
                <div className="sub">NOI år 1 etter eierkostnader</div>
              </div>
              <div>
                <div className="l">Yield (netto)</div>
                <div className="v">
                  {formatDecimal(listing.financials.yieldNetto, 1).replace(".", ",")}
                  <span className="unit">%</span>
                </div>
                <div className="sub">
                  {listing.prisantydning
                    ? `På prisantydning ${formatInt(listing.prisantydning)} mnok eks. omk.`
                    : "På prisantydning eks. omk."}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LOCATION */}
      {listing.location && (
        <section className="ed-section">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">04 · Beliggenhet</span>
              <div>
                <h2>
                  Beliggenhet og{" "}
                  <span className="italic">tilgjengelighet.</span>
                </h2>
              </div>
            </div>
            <div className="ed-loc">
              {listing.location.geo ? (
                <PropertyMap
                  lat={listing.location.geo.lat}
                  lng={listing.location.geo.lng}
                  label={listing.titleHead.replace(/—\s*$/, "").trim()}
                />
              ) : (
                <div
                  className="ed-map"
                  aria-label={`Kart over ${listing.address}`}
                >
                  <span className="compass">N</span>
                  <div className="water" />
                  <div className="pin">
                    <span className="marker" />
                    <span className="lbl">{listing.titleHead}</span>
                  </div>
                </div>
              )}
              <div className="ed-loc-info">
                <h3>
                  {listing.location.title}{" "}
                  <span className="italic">{listing.location.titleTail}</span>
                </h3>
                <p>{listing.location.body}</p>
                <div className="ed-poi">
                  {listing.location.pois.map((poi) => (
                    <div className="ed-poi-row" key={poi.name}>
                      <span className="ico">↗</span>
                      <span className="nm">{poi.name}</span>
                      <span className="dist">{poi.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DOWNLOADS */}
      {downloads && downloads.length > 0 && (
        <section className="ed-section">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">05 · Dokumenter</span>
              <div>
                <h2>
                  Last ned{" "}
                  <span className="italic">prospekt og DD-pakke.</span>
                </h2>
                <p>
                  NDA signeres digitalt før de fortrolige dokumentene gjøres
                  tilgjengelig.
                </p>
              </div>
            </div>
            <div className="ed-downloads">
              {downloads.map((dl) => (
                <Link
                  key={dl.label}
                  href={dl.href}
                  className={`ed-dl ${dl.kind === "nda" ? "locked" : ""}`}
                >
                  <span className="ico">
                    {dl.kind === "nda" ? "NDA" : "PDF"}
                  </span>
                  <div className="nm">
                    {dl.label}
                    <span className="sub">{dl.sub}</span>
                  </div>
                  <span className="arr">
                    {dl.kind === "nda" ? "→" : "↓"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="ed-cta">
        <div className="wrap">
          <span
            className="eyebrow center no-rule"
            style={{ marginBottom: 20 }}
          >
            Vis interesse
          </span>
          <h2>
            Klar for en visning{" "}
            <span className="italic">av {listing.titleHead.replace(/—\s*$/, "").trim()}?</span>
          </h2>
          <p>
            Vi booker visninger på dagtid og ettermiddag i {cityLabel}, eller en
            digital gjennomgang om du heller foretrekker det. Indikative bud
            mottas fortløpende.
          </p>
          <div className="row">
            <Link href="/kontakt" className="btn btn-dark">
              Bestill visning <span className="arrow">→</span>
            </Link>
            <Link href="/kontakt" className="btn btn-outline">
              Be om datarom (NDA)
            </Link>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="ed-related">
          <div className="wrap">
            <div className="head-compact" style={{ marginBottom: 56 }}>
              <span className="eyebrow">Lignende oppdrag</span>
              <div>
                <h2>
                  Andre {listing.typeLabel.toLowerCase()}eiendommer{" "}
                  <span className="italic">i nord.</span>
                </h2>
              </div>
            </div>
            <div className="ei-grid" style={{ marginTop: 0 }}>
              {related.map((other) => (
                <Link
                  key={other.slug}
                  href={`/eiendommer/${other.slug}`}
                  className="ei-card"
                >
                  <div className="ei-card-photo">
                    <Image
                      src={relatedCovers[other.slug]?.src ?? other.coverImage}
                      alt={relatedCovers[other.slug]?.alt ?? other.coverImageAlt}
                      fill
                      sizes="(max-width: 980px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className={`ei-status ${other.status}`}>
                      <span className="dot" />
                      {other.statusLabel ?? STATUS_LABELS[other.status]}
                    </div>
                  </div>
                  <div className="top">
                    <span>{other.cardEyebrow}</span>
                    <span>{CITY_LABELS[other.city] ?? other.city}</span>
                  </div>
                  <div>
                    <h3>
                      {other.titleHead}{" "}
                      <span className="italic">{other.titleTail}</span>
                    </h3>
                    <p className="addr">{other.address}</p>
                  </div>
                  <div className="stat-row">
                    <div>
                      <div className="l">BTA</div>
                      <div className="v">
                        {formatInt(other.bta)}
                        <span className="unit">m²</span>
                      </div>
                    </div>
                    <div>
                      <div className="l">
                        {other.ferdig ? "Ferdig" : "Prisant."}
                      </div>
                      <div className="v">
                        {other.ferdig ??
                          (other.prisantydning
                            ? `${other.prisantydningEstimat ? "est. " : ""}${formatInt(
                                other.prisantydning,
                              )}`
                            : "—")}
                        {other.ferdig
                          ? null
                          : other.prisantydning && (
                              <span className="unit">mnok</span>
                            )}
                      </div>
                    </div>
                    <div>
                      <div className="l">Yield</div>
                      <div className="v">
                        {other.yieldNetto !== undefined
                          ? `${other.yieldEstimat ? "est. " : ""}${formatDecimal(
                              other.yieldNetto,
                              1,
                            ).replace(".", ",")}`
                          : "—"}
                        {other.yieldNetto !== undefined && (
                          <span className="unit">%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href="/eiendommer"
                className="ei-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "1/1",
                  border: "var(--hairline)",
                  background: "var(--warm-white)",
                }}
              >
                <div style={{ textAlign: "center", padding: 32 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 36,
                      fontWeight: 300,
                      fontStyle: "italic",
                      color: "var(--accent)",
                      marginBottom: 12,
                    }}
                  >
                    →
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 400,
                      letterSpacing: "-0.012em",
                    }}
                  >
                    Se alle{" "}
                    <span
                      className="italic"
                      style={{ color: "var(--warm-grey-85)" }}
                    >
                      oppdrag
                    </span>
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--warm-grey-85)",
                      marginTop: 8,
                    }}
                  >
                    til salgs i Nord-Norge
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
