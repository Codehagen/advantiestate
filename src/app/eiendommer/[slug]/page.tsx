import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MDX } from "@/components/blog/mdx";
import { PropertyMap } from "@/components/eiendommer/PropertyMap";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { siteConfig } from "@/app/siteConfig";
import { getActiveListings, getListingPost } from "@/lib/content";
import { getListingGallery } from "@/lib/listing/gallery";
import { constructMetadata } from "@/lib/utils";

// Gallery comes from the CRM Supabase projection (published via CRM). ISR so a
// publish appears within the window without a redeploy. MDX stays the source of
// truth for editorial copy + the slug list (generateStaticParams).
export const revalidate = 600;

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

export async function generateStaticParams() {
  return getActiveListings().map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const listing = getListingPost(slug);
  if (!listing) return;
  // Drop the " | Advanti Estate" brand suffix — listing titles already pack
  // address + m² + headline into ~50 chars; appending the brand pushes most
  // listings past Google's SERP truncation at ~60. og:site_name + canonical
  // already carry the brand. Use the per-listing OG card route so social
  // shares show price/yield/BTA over the cover photo.
  return constructMetadata({
    path: `/eiendommer/${listing.slug}`,
    title: listing.title,
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
  const listing = getListingPost(slug);
  if (!listing) notFound();

  const statusLabel =
    listing.statusLabel ?? STATUS_LABELS[listing.status] ?? listing.status;
  const cityLabel = CITY_LABELS[listing.city] ?? listing.city;

  // Prefer the CRM-published Supabase gallery; fall back to MDX, then cover.
  const dbGallery = await getListingGallery(slug);
  const gallery =
    dbGallery && dbGallery.gallery.length > 0
      ? dbGallery.gallery
      : listing.gallery && listing.gallery.length > 0
        ? listing.gallery
        : [{ src: listing.coverImage, alt: listing.coverImageAlt }];
  const coverSrc = dbGallery?.cover?.src ?? listing.coverImage;
  const photoCount = dbGallery?.photoCount ?? listing.photoCount;
  const mainImg = gallery[0];
  const sideImgs = gallery.slice(1, 3);

  const updatedLabel = listing.updatedAt
    ? formatEditorialDate(listing.updatedAt)
    : formatEditorialDate(listing.publishedAt);

  // Related: two other listings, preferring same type then proximity in order.
  const related = getActiveListings()
    .filter((other) => other.slug !== listing.slug)
    .sort((a, b) => {
      const aSame = a.type === listing.type ? 0 : 1;
      const bSame = b.type === listing.type ? 0 : 1;
      return aSame - bSame || a.order - b.order;
    })
    .slice(0, 2);

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
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Eiendommer", url: "/eiendommer" },
          { name: listing.title, url: `/eiendommer/${listing.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateJsonLd) }}
      />

      <div className="page-pad" />

      {/* SUBHERO — crumb + gallery */}
      <section style={{ padding: "32px 0 0" }}>
        <div className="wrap">
          <nav className="crumb" aria-label="Brødsmuler">
            <Link href="/">Hjem</Link>
            <span className="sep">/</span>
            <Link href="/eiendommer">Eiendommer</Link>
            <span className="sep">/</span>
            <span className="here">
              {listing.titleHead} {listing.titleTail}
            </span>
          </nav>

          {/* GALLERY */}
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
                {index === sideImgs.length - 1 &&
                  photoCount &&
                  photoCount > gallery.length && (
                    <div className="g-more">
                      <span className="ct">+ {photoCount - gallery.length}</span>{" "}
                      bilder
                    </div>
                  )}
              </div>
            ))}
          </div>

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
            {listing.prisantydning !== undefined ? (
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
              <MDX code={listing.mdx} images={[]} />
            </div>

            <aside className="ed-megler">
              <div className="pre">Ansvarlig megler</div>
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
      {listing.downloads && listing.downloads.length > 0 && (
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
              {listing.downloads.map((dl) => (
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
                      src={other.coverImage}
                      alt={other.coverImageAlt}
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
