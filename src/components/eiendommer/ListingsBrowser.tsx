"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import { EIENDOM_CITIES } from "@/lib/navigation";
import {
  subscribeEiendomVarsel,
  type EiendomVarselFormState,
} from "@/app/actions/eiendom-varsel";

const SAVED_SEARCH_INITIAL: EiendomVarselFormState = { status: "idle" };

export type ListingCardData = {
  slug: string;
  href: string;
  status: "til-salgs" | "reservert" | "kommer" | "solgt" | "til-leie";
  statusLabel: string;
  type:
    | "kontor"
    | "logistikk"
    | "handel"
    | "kombi"
    | "hotell"
    | "utvikling"
    | "industri";
  typeLabel: string;
  city:
    | "bodo"
    | "tromso"
    | "harstad"
    | "alta"
    | "narvik"
    | "lofoten"
    | "mo-i-rana";
  cityLabel: string;
  titleHead: string;
  titleTail: string;
  address: string;
  cardEyebrow: string;
  bta: number;
  prisantydning?: number;
  prisantydningEstimat: boolean;
  leieKrM2?: number;
  yieldNetto?: number;
  yieldEstimat: boolean;
  ferdig?: string;
  coverImage: string;
  coverImageAlt: string;
  // Featured-only extras
  featured: boolean;
  featuredEyebrow?: string;
  summary?: string;
  utleiegrad?: number;
  megler?: { name: string; role: string; avatar: string };
  position: number; // 01..09 counter on the featured photo
};

type Counts = {
  status: Record<string, number>;
  type: Record<string, number>;
  by: Record<string, number>;
  total: number;
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "til-salgs", label: "Til salgs" },
  { value: "til-leie", label: "Til leie" },
  { value: "reservert", label: "Reservert" },
  { value: "kommer", label: "Kommer" },
  { value: "solgt", label: "Solgt" },
];

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "kontor", label: "Kontor" },
  { value: "logistikk", label: "Logistikk" },
  { value: "handel", label: "Handel" },
  { value: "kombi", label: "Kombi" },
];

// Derived from the shared EIENDOM_CITIES list (same source the Eiendommer nav
// dropdown links into via /eiendommer?by={slug}) so chips and nav stay in sync.
const CITY_OPTIONS: { value: string; label: string }[] = [
  { value: "alle", label: "Alle" },
  ...EIENDOM_CITIES.map((c) => ({ value: c.slug, label: c.label })),
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 }).format(
    value,
  );
}

function formatInt(value: number): string {
  return new Intl.NumberFormat("nb-NO").format(value);
}

function priceLabel(card: ListingCardData) {
  if (card.status === "til-leie") {
    return card.leieKrM2 !== undefined
      ? { label: "Leie", value: formatInt(card.leieKrM2), unit: "kr/m²" }
      : { label: "Leie", value: "På forespørsel", unit: "" };
  }
  if (card.ferdig) {
    return {
      label: "Ferdig",
      value: card.ferdig,
      unit: "",
    };
  }
  if (card.prisantydning !== undefined) {
    return {
      label: "Prisant.",
      value: `${card.prisantydningEstimat ? "est. " : ""}${formatNumber(card.prisantydning)}`,
      unit: "mnok",
    };
  }
  return { label: "Prisant.", value: "—", unit: "" };
}

function yieldLabel(card: ListingCardData) {
  if (card.yieldNetto === undefined) return { value: "—", unit: "" };
  return {
    value: `${card.yieldEstimat ? "est. " : ""}${formatNumber(card.yieldNetto).replace(".", ",")}`,
    unit: "%",
  };
}

export function ListingsBrowser({
  featured,
  items,
  counts,
}: {
  featured: ListingCardData | undefined;
  items: ListingCardData[];
  counts: Counts;
}) {
  const [status, setStatus] = useState("alle");
  const [type, setType] = useState("alle");
  const [city, setCity] = useState("alle");

  // Pre-select the city filter from /eiendommer?by={slug} (set by the nav's
  // Eiendommer dropdown). Read on mount so the grid still SSRs unfiltered (no
  // Suspense, page stays static); the filter applies right after hydration.
  useEffect(() => {
    const by = new URLSearchParams(window.location.search).get("by");
    if (by && EIENDOM_CITIES.some((c) => c.slug === by)) setCity(by);
  }, []);

  const matches = (card: ListingCardData) =>
    (status === "alle" || card.status === status) &&
    (type === "alle" || card.type === type) &&
    (city === "alle" || card.city === city);

  const filteredItems = useMemo(
    () => items.filter(matches),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, status, type, city],
  );

  const featuredVisible = featured ? matches(featured) : false;
  const visibleCount =
    filteredItems.length + (featuredVisible ? 1 : 0);

  // Compute the featured card's price/yield labels once (each builds an
  // Intl.NumberFormat) instead of calling priceLabel/yieldLabel 3×/2× in JSX —
  // mirrors the per-card caching in the grid below.
  const featuredPrice = featured ? priceLabel(featured) : null;
  const featuredYield = featured ? yieldLabel(featured) : null;

  return (
    // Containing block for the sticky filter. CSS `position: sticky` is
    // bounded by the nearest scroll ancestor — without this wrapper the bar
    // floats over the dark off-market band below, occluding its headline.
    <div className="ei-browser">
      {/* FILTER BAR */}
      <div className="ei-filter" id="filterBar">
        <div className="wrap">
          <div
            className="ei-filter-group"
            role="radiogroup"
            aria-label="Status"
          >
            <span className="label">Status</span>
            {STATUS_OPTIONS.map((opt) => {
              const ct =
                opt.value === "alle" ? counts.total : counts.status[opt.value];
              if (opt.value !== "alle" && !ct) return null;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`ei-chip ${status === opt.value ? "active" : ""}`}
                  onClick={() => setStatus(opt.value)}
                  aria-pressed={status === opt.value}
                >
                  {opt.label}
                  {ct ? <span className="ct">{ct}</span> : null}
                </button>
              );
            })}
          </div>

          <div
            className="ei-filter-group"
            role="radiogroup"
            aria-label="Eiendomstype"
          >
            <span className="label">Type</span>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`ei-chip ${type === opt.value ? "active" : ""}`}
                onClick={() => setType(opt.value)}
                aria-pressed={type === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div
            className="ei-filter-group"
            role="radiogroup"
            aria-label="Lokasjon"
          >
            <span className="label">By</span>
            {CITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`ei-chip ${city === opt.value ? "active" : ""}`}
                onClick={() => setCity(opt.value)}
                aria-pressed={city === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="ei-filter-result">
            <strong>{visibleCount}</strong>&nbsp;av {counts.total} eiendommer
          </div>
        </div>
      </div>

      {/* FEATURED */}
      {featured && featuredVisible && (
        <section
          className="section"
          style={{ paddingTop: 32, paddingBottom: 16 }}
        >
          <div className="wrap">
            <Link href={featured.href} className="ei-featured">
              <div className="ei-featured-photo">
                <Image
                  src={featured.coverImage}
                  alt={featured.coverImageAlt}
                  fill
                  sizes="(max-width: 980px) 100vw, 55vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
                <div className={`ei-status ${featured.status}`}>
                  <span className="dot" />
                  {featured.statusLabel}
                </div>
                <div className="ei-counter">
                  01 / {String(counts.total).padStart(2, "0")}
                </div>
              </div>
              <div className="ei-featured-body">
                <div>
                  {featured.featuredEyebrow && (
                    <span className="pre">{featured.featuredEyebrow}</span>
                  )}
                  <h2>
                    {featured.titleHead}{" "}
                    <span className="italic">{featured.titleTail}</span>
                  </h2>
                  {featured.summary && (
                    <p className="lede">{featured.summary}</p>
                  )}
                </div>

                <div className="ei-featured-stats">
                  <div>
                    <div className="l">BTA</div>
                    <div className="v">
                      {formatInt(featured.bta)}
                      <span className="unit">m²</span>
                    </div>
                  </div>
                  <div>
                    <div className="l">{featuredPrice?.label}</div>
                    <div className="v">
                      {featuredPrice?.value}
                      {featuredPrice?.unit && (
                        <span className="unit">
                          {featuredPrice.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="l">Yield</div>
                    <div className="v">
                      {featuredYield?.value}
                      {featuredYield?.unit && (
                        <span className="unit">
                          {featuredYield.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="l">Utleiegrad</div>
                    <div className="v">
                      {featured.utleiegrad !== undefined
                        ? `${formatInt(featured.utleiegrad)}`
                        : "—"}
                      {featured.utleiegrad !== undefined && (
                        <span className="unit">%</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ei-featured-cta">
                  <span className="btn btn-dark">
                    Se prospekt <span className="arrow">→</span>
                  </span>
                  {featured.megler && (
                    <div className="megler">
                      <div className="nm">
                        <span className="n">{featured.megler.name}</span>
                        <span className="r">{featured.megler.role}</span>
                      </div>
                      <Image
                        src={featured.megler.avatar}
                        alt={featured.megler.name}
                        width={40}
                        height={40}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* GRID */}
      <section
        className="section"
        style={{ paddingTop: 24, paddingBottom: 80 }}
      >
        <div className="wrap">
          <div className="head-compact" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Aktive oppdrag</span>
            <div>
              <h2>
                Alle eiendommer{" "}
                <span className="italic">vi har til salgs.</span>
              </h2>
              <p>
                Klikk på et oppdrag for prospekt, plantegninger, leieoversikt og
                DD-pakke. Reserverte og solgte oppdrag vises for referanse.
              </p>
            </div>
          </div>

          <div className="ei-grid" id="eiGrid">
            {filteredItems.map((card) => {
              const price = priceLabel(card);
              const yld = yieldLabel(card);
              return (
                <Link
                  key={card.slug}
                  href={card.href}
                  className={`ei-card ${card.status === "solgt" ? "is-solgt" : ""}`}
                >
                  <div className="ei-card-photo">
                    <Image
                      src={card.coverImage}
                      alt={card.coverImageAlt}
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className={`ei-status ${card.status}`}>
                      <span className="dot" />
                      {card.statusLabel}
                    </div>
                  </div>
                  <div className="top">
                    <span>{card.cardEyebrow}</span>
                    <span>{card.cityLabel}</span>
                  </div>
                  <div>
                    <h3>
                      {card.titleHead}{" "}
                      <span className="italic">{card.titleTail}</span>
                    </h3>
                    <p className="addr">{card.address}</p>
                  </div>
                  <div className="stat-row">
                    <div>
                      <div className="l">BTA</div>
                      <div className="v">
                        {formatInt(card.bta)}
                        <span className="unit">m²</span>
                      </div>
                    </div>
                    <div>
                      <div className="l">{price.label}</div>
                      <div className="v">
                        {price.value}
                        {price.unit && <span className="unit">{price.unit}</span>}
                      </div>
                    </div>
                    <div>
                      <div className="l">Yield</div>
                      <div className="v">
                        {yld.value}
                        {yld.unit && <span className="unit">{yld.unit}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* SAVED-SEARCH ALERT */}
          <SavedSearchAlert />
        </div>
      </section>
    </div>
  );
}

function SavedSearchAlert() {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(
    subscribeEiendomVarsel,
    SAVED_SEARCH_INITIAL,
  );

  const success = state.status === "success";
  const successCopy = success
    ? state.alreadySubscribed
      ? "Du står allerede på listen — vi varsler deg når vi får inn matchende oppdrag."
      : "Registrert. Du får varsel i innboksen når vi får inn matchende oppdrag."
    : null;

  return (
    <div className="ei-alert">
      <div>
        <div className="pre">Få oppdrag direkte i innboksen</div>
        <h4>
          Bli varslet når vi får inn{" "}
          <span className="italic">eiendommer som passer deg.</span>
        </h4>
      </div>
      {success ? (
        <p role="status" className="ei-alert-success">
          {successCopy}
        </p>
      ) : (
        <form action={formAction}>
          <input
            type="text"
            name="firstName"
            placeholder="Navn"
            aria-label="Navn"
            autoComplete="name"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="ola.nordmann@firma.no"
            aria-label="E-post"
            autoComplete="email"
            required
          />
          <input
            type="text"
            name="bedrift"
            placeholder="Bedrift (valgfritt)"
            aria-label="Bedrift"
            autoComplete="organization"
          />
          <select name="sted" aria-label="Geografi" defaultValue="">
            <option value="">Geografi (valgfritt)</option>
            <option value="Bodø">Bodø</option>
            <option value="Harstad">Harstad</option>
            <option value="Alta">Alta</option>
            <option value="Narvik">Narvik</option>
            <option value="Lofoten">Lofoten</option>
            <option value="Mo i Rana">Mo i Rana</option>
            <option value="Hele Nord-Norge">Hele Nord-Norge</option>
          </select>
          <input
            type="tel"
            name="phone"
            placeholder="Telefon (valgfritt)"
            aria-label="Telefon"
            autoComplete="tel"
            inputMode="tel"
          />
          <input
            type="hidden"
            name="pageUrl"
            value={pathname ?? "(unknown)"}
          />
          <button type="submit" disabled={pending}>
            {pending ? "Sender …" : "Få varsel"}
          </button>
        </form>
      )}
      {state.status === "error" && (
        <p role="alert" className="ei-alert-error">
          {state.message}
        </p>
      )}
    </div>
  );
}
