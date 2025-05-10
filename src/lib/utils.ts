import clsx, { type ClassValue } from "clsx";
import ms from "ms";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

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

export function constructMetadata({
  title = "Advanti - Din partner for næringseiendom i Nord-Norge",
  description = "Advanti tilbyr ekspertise innen kjøp, salg, utleie, verdivurdering og strategisk rådgivning for næringseiendom i Nord-Norge.",
  image = "/opengraph-image.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const siteUrl = "https://www.advantiestate.no";
  const siteName = "Advanti";
  const twitterHandle = "@advantiestate";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Advanti - Næringseiendom i Nord-Norge",
        },
      ],
      locale: "nb_NO",
      type: "website",
      siteName: siteName,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: twitterHandle,
      site: twitterHandle,
    },
    icons: {
      icon: icons,
      shortcut: icons,
      apple: icons,
    },
    metadataBase: new URL(siteUrl),
    authors: [{ name: siteName, url: siteUrl }],
    keywords: [
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
    ],
    category: "Næringseiendom",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export const timeAgo = (
  timestamp: Date | null,
  {
    withAgo,
  }: {
    withAgo?: boolean;
  } = {}
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
  "focus:ring-light-blue/50 focus:dark:ring-light-blue/30",
  // border color
  "focus:border-warm-grey focus:dark:border-warm-grey-1",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-warm-grey dark:outline-warm-white",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
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
