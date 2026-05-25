import clsx, { type ClassValue } from "clsx";
import ms from "ms";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/app/siteConfig";

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length - 3)}...`;
};

export function formatDate(date: string) {
  let currentDate = new Date().getTime();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date).getTime();
  let timeDifference = Math.abs(currentDate - targetDate);
  let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  let fullDate = new Date(date).toLocaleString("nb-NO", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (daysAgo < 1) {
    return "I dag";
  } else if (daysAgo < 7) {
    return `${fullDate} (${daysAgo} dager siden)`;
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${fullDate} (${weeksAgo} uker siden)`;
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${fullDate} (${monthsAgo} måneder siden)`;
  } else {
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${fullDate} (${yearsAgo} år siden)`;
  }
}

// ---------------------------------------------------------------------------
// Metadata
//
//   baseMetadata()        site-wide defaults — used by the root layout only.
//                         Carries NO canonical: a canonical is page identity,
//                         never a site default. A page that exports no metadata
//                         degrades to *no* canonical (Google decides), never an
//                         inherited *wrong* one.
//   constructMetadata()   per-page metadata. `path` is REQUIRED — the compiler
//                         rejects any page that forgets it, so every indexable
//                         page always emits a correct self-referencing
//                         canonical and openGraph.url.
//
// All URLs derive from siteConfig.url — the same source sitemap.ts, robots.ts
// and StructuredData.tsx use — so canonical tags can never drift from the
// sitemap.
// ---------------------------------------------------------------------------

const SITE_TITLE_FALLBACK = "Advanti | Næringsmegler i Nord-Norge";
const SITE_DESCRIPTION_FALLBACK =
  "Advanti tilbyr ekspertise innen kjøp, salg, utleie, verdivurdering og strategisk rådgivning for næringseiendom i Nord-Norge.";
// Route handler at /api/og/brand renders the editorial brand card.
// constructMetadata uses it as the OG fallback so every indexable route
// emits at least the brand card. Per-article routes (e.g. blog posts) pass
// their own URL (/api/og/blog/<slug>) to override. The old static JPG at
// /opengraph-image.jpg is still served and is referenced by StructuredData
// for the Organization schema — that's a JSON-LD concern, not og:image.
const OG_IMAGE_DEFAULT = "/api/og/brand";
const OG_IMAGE_ALT = "Advanti - Næringseiendom i Nord-Norge";

const SEO_KEYWORDS = [
  "næringseiendom Nord-Norge",
  "kjøp næringseiendom",
  "salg næringseiendom",
  "utleie næringseiendom",
  "verdivurdering næringseiendom",
  "strategisk rådgivning eiendom",
  "næringsmegling Nord-Norge",
  "eiendomsrådgivning",
  "kommersiell eiendom",
  "eiendomsmarked Nord-Norge",
  "Advanti",
  "eiendomsinvestor",
  "leietaker",
  "gårdeier",
];

/**
 * Site-wide metadata defaults for the root layout. Holds everything that is
 * genuinely site-wide (metadataBase, OG/twitter defaults, icons via the App
 * Router file convention, keywords, authors) and deliberately NO
 * `alternates.canonical` — see the note above.
 */
export function baseMetadata(): Metadata {
  return {
    title: SITE_TITLE_FALLBACK,
    description: SITE_DESCRIPTION_FALLBACK,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title: SITE_TITLE_FALLBACK,
      description: SITE_DESCRIPTION_FALLBACK,
      images: [
        { url: OG_IMAGE_DEFAULT, width: 1200, height: 630, alt: OG_IMAGE_ALT },
      ],
      locale: "nb_NO",
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE_FALLBACK,
      description: SITE_DESCRIPTION_FALLBACK,
      images: [OG_IMAGE_DEFAULT],
      creator: siteConfig.contact.social.twitterHandle,
      site: siteConfig.contact.social.twitterHandle,
    },
    // Icons are served via the App Router file convention:
    // app/favicon.ico, app/icon.svg, app/apple-icon.png
    manifest: "/manifest.json",
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    keywords: SEO_KEYWORDS,
    category: "Næringseiendom",
  };
}

export function constructMetadata({
  path,
  title = SITE_TITLE_FALLBACK,
  description = SITE_DESCRIPTION_FALLBACK,
  image = OG_IMAGE_DEFAULT,
  imageAlt,
  noIndex = false,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
}: {
  /** Route pathname, e.g. "/tjenester/salg". Drives the self-referencing
   *  canonical and openGraph.url. Required — a page cannot ship without it. */
  path: string;
  title?: string;
  description?: string;
  /** Absolute or root-relative OG image URL. Defaults to the brand card
   *  route at /api/og/brand. Per-article routes (e.g. blog posts) pass
   *  their own URL like /api/og/blog/<slug> to override. */
  image?: string;
  /** Optional alt text for the OG image. Falls back to OG_IMAGE_ALT (the
   *  site-wide brand alt) when omitted. Pages with a per-asset OG card
   *  (blog posts, listings) should pass their content-specific alt. */
  imageAlt?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
  /** ISO date — only used when ogType is "article". */
  publishedTime?: string;
  /** ISO date — only used when ogType is "article". */
  modifiedTime?: string;
  /** Author name(s) — only used when ogType is "article". */
  authors?: string[];
}): Metadata {
  const base = baseMetadata();
  const metaTitle = normalizeMetaTitle(title);
  const metaDescription = normalizeMetaDescription(description);
  const canonicalUrl = `${siteConfig.url}${path}`;
  const ogImages = [
    {
      url: image,
      width: 1200,
      height: 630,
      alt: imageAlt ?? OG_IMAGE_ALT,
    },
  ];

  // Build openGraph as one literal per type so TypeScript narrows it to the
  // correct OpenGraph union member (article gets publishedTime/authors).
  const openGraph: Metadata["openGraph"] =
    ogType === "article"
      ? {
          title: metaTitle,
          description: metaDescription,
          url: canonicalUrl,
          images: ogImages,
          locale: "nb_NO",
          type: "article",
          siteName: siteConfig.name,
          publishedTime,
          modifiedTime,
          authors,
        }
      : {
          title: metaTitle,
          description: metaDescription,
          url: canonicalUrl,
          images: ogImages,
          locale: "nb_NO",
          type: "website",
          siteName: siteConfig.name,
        };

  return {
    ...base,
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [image],
      creator: siteConfig.contact.social.twitterHandle,
      site: siteConfig.contact.social.twitterHandle,
    },
    // noindex pages stay `follow` so link equity still flows to the pages
    // they link to (e.g. an ad landing page's CTAs into /tjenester/*).
    ...(noIndex && { robots: { index: false, follow: true } }),
  };
}

const META_DESCRIPTION_MAX_LENGTH = 160;
const META_DESCRIPTION_SOFT_MIN_WORD_BOUNDARY = 110;

/**
 * Normalises a <title>: collapses whitespace only — titles are NOT truncated.
 * A code-baked "..." inside the <title> element is an SEO anti-pattern: Google
 * renders its own SERP truncation and a literal ellipsis just looks broken.
 * Keep authored titles concise instead; tests/seo-meta.spec.ts fails CI on any
 * emitted title containing an ellipsis.
 */
function normalizeMetaTitle(title: string) {
  return title.replace(/\s+/g, " ").trim();
}

function normalizeMetaDescription(description: string) {
  const cleaned = description.replace(/\s+/g, " ").trim();

  if (cleaned.length <= META_DESCRIPTION_MAX_LENGTH) {
    return cleaned;
  }

  const hardTruncated = cleaned.slice(0, META_DESCRIPTION_MAX_LENGTH - 3);
  const lastWordBoundary = hardTruncated.lastIndexOf(" ");
  const truncated =
    lastWordBoundary >= META_DESCRIPTION_SOFT_MIN_WORD_BOUNDARY
      ? hardTruncated.slice(0, lastWordBoundary)
      : hardTruncated;

  return `${truncated}...`;
}

export const timeAgo = (
  timestamp: Date | null,
  {
    withAgo,
  }: {
    withAgo?: boolean;
  } = {},
): string => {
  if (!timestamp) return "Never";
  const diff = Date.now() - new Date(timestamp).getTime();
  if (diff < 1000) {
    // less than 1 second
    return "Nå";
  } else if (diff > 82800000) {
    // more than 23 hours – similar to how Twitter displays timestamps
    return new Date(timestamp).toLocaleDateString("nb-NO", {
      month: "short",
      day: "numeric",
      year:
        new Date(timestamp).getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    });
  }
  return `${ms(diff)}${withAgo ? " siden" : ""}`;
};

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-light-blue/50",
  // border color
  "focus:border-warm-grey",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-warm-grey",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500",
  // ring color
  "ring-red-200",
];

// Number formatter function

export const usNumberformatter = (number: number, decimals = 0) =>
  Intl.NumberFormat("us", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();

export const percentageFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  const symbol = number > 0 && number !== Infinity ? "+" : "";

  return `${symbol}${formattedNumber}`;
};

export const millionFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  return `${formattedNumber}M`;
};
export const formatters: { [key: string]: any } = {
  currency: (number: number, currency: string = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(number),
  unit: (number: number) => `${usNumberformatter(number)}`,
  nokCurrency: (number: number) => {
    // Fixed format to ensure server/client consistency
    const formatted = new Intl.NumberFormat("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
    return `${formatted} kr`;
  },
  sqm: (number: number) =>
    `${new Intl.NumberFormat("nb-NO").format(number)} m²`,
  yield: (number: number) =>
    new Intl.NumberFormat("nb-NO", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(number),
  integer: (number: number) => new Intl.NumberFormat("nb-NO").format(number),
  leieprisPerKvm: (number: number) =>
    `${new Intl.NumberFormat("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number)} kr`,
};
