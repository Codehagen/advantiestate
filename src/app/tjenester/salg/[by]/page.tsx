import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ServiceCityPage } from "@/components/tjenester/ServiceCityPage";
import {
  SERVICE_CITY_SLUGS,
  buildServiceCityMetadata,
  isServiceCity,
} from "@/lib/service-cities";

// ISR: ActiveListingsStrip pulls CRM data (Supabase); revalidate so a publish
// appears without a redeploy, same window as /eiendommer.
export const revalidate = 600;
// Only the curated city allowlist is valid — no thin auto-generated pages.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_CITY_SLUGS.map((by) => ({ by }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ by: string }>;
}): Promise<Metadata | undefined> {
  const { by } = await params;
  return buildServiceCityMetadata("salg", by);
}

export default async function Page({
  params,
}: {
  params: Promise<{ by: string }>;
}) {
  const { by } = await params;
  if (!isServiceCity(by)) notFound();
  return <ServiceCityPage serviceSlug="salg" citySlug={by} />;
}
