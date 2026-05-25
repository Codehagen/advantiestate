import { ImageResponse } from "next/og";

import { ListingCard } from "@/components/og/ListingCard";
import { getListingPost } from "@/lib/content";
import { loadOgFonts } from "@/lib/og/fonts";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

const STATUS_LABELS = {
  "til-salgs": "Til salgs",
  reservert: "Reservert",
  kommer: "Kommer",
  solgt: "Solgt",
} as const;

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
  // Use a non-breaking space (U+00A0) as the thousands separator per Norwegian
  // convention so numbers never wrap across lines (per DESIGN.md gotchas).
  return new Intl.NumberFormat("nb-NO").format(value).replace(/\s/g, " ");
}

function formatDecimal(value: number, max = 1) {
  return new Intl.NumberFormat("nb-NO", { maximumFractionDigits: max }).format(
    value,
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const listing = getListingPost(slug);
    const fonts = (await loadOgFonts()).map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight,
      style: f.style,
    }));

    // Fall back to a generic listing card if the slug doesn't resolve.
    // notFound() at the page level usually catches this first, but a social
    // crawler can hit the OG handler directly — better to return a valid
    // 1200×630 than a 500.
    if (!listing) {
      return new ImageResponse(
        (
          <ListingCard
            title="Næringseiendom i Nord-Norge"
            address="Bodø · Tromsø · Alta · Narvik"
            reference="—"
            status="til-salgs"
            statusLabel="Eiendommer"
            typeLabel="Advanti Estate"
            stats={{
              bta: "—",
              headline: "—",
              headlineLabel: "Prisantydning",
              yield: "—",
            }}
          />
        ),
        { ...SIZE, fonts },
      );
    }

    const cityLabel = CITY_LABELS[listing.city] ?? listing.city;
    const statusLabel =
      listing.statusLabel ?? STATUS_LABELS[listing.status] ?? listing.status;

    // Headline stat picks price for active mandates, ferdig-quarter for kommer.
    const headlineStat =
      listing.prisantydning !== undefined
        ? {
            headlineLabel: "Prisantydning",
            headline: `${listing.prisantydningEstimat ? "est. " : ""}${formatInt(listing.prisantydning)} mnok`,
          }
        : listing.ferdig
          ? {
              headlineLabel: "Ferdigstilles",
              headline: listing.ferdig,
            }
          : {
              headlineLabel: "Prisantydning",
              headline: "—",
            };

    return new ImageResponse(
      (
        <ListingCard
          title={listing.title}
          address={listing.address}
          reference={listing.reference}
          status={listing.status}
          statusLabel={statusLabel}
          typeLabel={`${listing.typeLabel} · ${cityLabel}`}
          stats={{
            bta: `${formatInt(listing.bta)} m²`,
            headline: headlineStat.headline,
            headlineLabel: headlineStat.headlineLabel,
            yield:
              listing.yieldNetto !== undefined
                ? `${listing.yieldEstimat ? "est. " : ""}${formatDecimal(listing.yieldNetto, 1).replace(".", ",")} %`
                : "—",
          }}
        />
      ),
      { ...SIZE, fonts },
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error(`Failed to generate listing OG image: ${msg}`);
    return new Response(`Failed to generate OG image: ${msg}`, { status: 500 });
  }
}
