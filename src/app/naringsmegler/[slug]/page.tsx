import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { allLocationPosts } from "content-collections";
import { Badge } from "@/components/Badge";
import { CTAButtonGroup } from "@/components/CTAButtons";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import FeatureDivider from "@/components/ui/FeatureDivider";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { constructMetadata } from "@/lib/utils";
import { LocationMdx } from "@/components/locations/LocationMdx";

export async function generateStaticParams() {
  return allLocationPosts.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const location = allLocationPosts.find((post) => post.slug === slug);
  if (!location) {
    return;
  }

  const title = location.seoTitle ?? `${location.hero.title} | Advanti`;
  const description = location.seoDescription ?? location.hero.description;

  return constructMetadata({
    title,
    description,
    canonical: `/naringsmegler/${location.slug}`,
  });
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = allLocationPosts.find((post) => post.slug === slug);
  if (!location) {
    notFound();
  }

  const suggestedNearby = [...allLocationPosts]
    .filter((post) => post.slug !== location.slug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const areaServed = {
    "@type": location.serviceArea === "Region" ? "AdministrativeArea" : "City",
    name: location.name,
  };

  const hasOfficeAddress =
    !!location.officeAddress?.streetAddress &&
    !!location.officeAddress?.addressLocality;

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Næringsmegler", url: "/naringsmegler" },
          { name: location.name, url: `/naringsmegler/${location.slug}` },
        ]}
      />
      <StructuredData
        type="realEstateAgent"
        data={{
          name: `Advanti – Næringsmegler i ${location.name}`,
          url: `https://www.advantiestate.no/naringsmegler/${location.slug}`,
          description: location.hero.description,
          address: hasOfficeAddress
            ? {
                "@type": "PostalAddress",
                streetAddress: location.officeAddress?.streetAddress,
                addressLocality: location.officeAddress?.addressLocality,
                addressRegion: location.officeAddress?.addressRegion,
                postalCode: location.officeAddress?.postalCode,
                addressCountry: location.officeAddress?.addressCountry,
              }
            : null,
          geo: {
            "@type": "GeoCoordinates",
            latitude: location.geo.latitude,
            longitude: location.geo.longitude,
          },
          telephone: location.phone,
          email: location.email,
          areaServed: [areaServed],
        }}
      />
      <StructuredData type="faq" data={{ faqs: location.faqs }} />

      <section
        aria-labelledby="location-hero"
        className="mx-auto w-full max-w-6xl animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>{location.serviceArea === "Region" ? "Region" : "By"}</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="location-hero"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>{location.hero.title}</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              {location.hero.description}
            </p>
            <div className="mt-8">
              <CTAButtonGroup />
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
              <Image
                src={location.hero.image}
                alt={`Næringsmegler i ${location.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Markedet i {location.name}</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Nøkkeltall og lokale drivere
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            Indikative markedsdata og lokale drivere som påvirker verdien av
            næringseiendom i {location.name}.
          </p>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-warm-grey/10 bg-warm-white/70 shadow-lg shadow-warm-grey/5 dark:border-warm-white/10 dark:bg-warm-grey/30">
          <table className="w-full text-left">
            <thead className="border-b border-warm-grey/10 text-sm text-warm-grey dark:text-warm-white">
              <tr>
                <th className="px-6 py-4">Indikator</th>
                <th className="px-6 py-4">Nivå</th>
                <th className="px-6 py-4">Kommentar</th>
              </tr>
            </thead>
            <tbody className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {location.marketStats.map((stat) => (
                <tr key={stat.label} className="border-t border-warm-grey/10">
                  <td className="px-6 py-4 font-medium text-warm-grey dark:text-warm-white">
                    {stat.label}
                  </td>
                  <td className="px-6 py-4">{stat.value}</td>
                  <td className="px-6 py-4">{stat.detail ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <LocationMdx code={location.mdx} />
          </div>
          <div className="space-y-6">
            {hasOfficeAddress && (
              <div className="rounded-2xl border border-warm-grey/10 bg-warm-white/70 p-6 shadow-lg shadow-warm-grey/5 dark:border-warm-white/10 dark:bg-warm-grey/30">
                <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                  Kontor i {location.name}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  <p className="font-medium text-warm-grey dark:text-warm-white">
                    {location.officeAddress?.streetAddress}
                  </p>
                  <p>
                    {location.officeAddress?.postalCode}{" "}
                    {location.officeAddress?.addressLocality}
                  </p>
                  <p>{location.officeAddress?.addressRegion}</p>
                  <p>{location.phone}</p>
                  {location.email && <p>{location.email}</p>}
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-warm-grey/10 bg-warm-white/70 p-6 shadow-lg shadow-warm-grey/5 dark:border-warm-white/10 dark:bg-warm-grey/30">
              <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                Lokalt team
              </h3>
              <div className="mt-4 space-y-4">
                {location.localTeam?.map((member) => {
                  const content = (
                    <div className="flex items-center gap-4">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={56}
                          height={56}
                          className="size-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-14 items-center justify-center rounded-full bg-warm-grey/10 text-sm font-semibold text-warm-grey dark:bg-warm-white/10 dark:text-warm-white">
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-warm-grey dark:text-warm-white">
                          {member.name}
                        </p>
                        <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  );

                  return member.slug ? (
                    <Link
                      key={member.name}
                      href={`/personer/${member.slug}`}
                      className="block rounded-xl border border-transparent p-2 transition hover:border-warm-grey/10 hover:bg-warm-grey/[2%] dark:hover:border-warm-white/10"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={member.name} className="rounded-xl p-2">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-warm-grey/10 bg-warm-white/70 p-6 shadow-lg shadow-warm-grey/5 dark:border-warm-white/10 dark:bg-warm-grey/30">
              <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                Eksempel fra {location.name}
              </h3>
              <p className="mt-3 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                {location.localCaseStudy.summary}
              </p>
              <Link
                href={location.localCaseStudy.href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-warm-grey hover:text-warm-grey-3 dark:text-warm-white"
              >
                {location.localCaseStudy.title}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Ofte stilte spørsmål</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Spørsmål om næringsmegling i {location.name}
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            Svar på vanlige spørsmål om salg, utleie og verdivurdering i lokale
            markeder.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {location.faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-warm-grey/10 bg-warm-white/70 p-6 shadow-lg shadow-warm-grey/5 dark:border-warm-white/10 dark:bg-warm-grey/30"
            >
              <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-warm-grey-2 dark:text-warm-grey-1">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Utforsk flere markeder</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Se alle byer vi dekker
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            Utforsk markedsinnsikt og tjenester i alle byer og regioner vi
            jobber med.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suggestedNearby.map((nearby) => (
            <Link
              key={nearby.slug}
              href={`/naringsmegler/${nearby.slug}`}
              className="rounded-2xl border border-warm-grey/10 bg-warm-white/70 p-6 shadow-lg shadow-warm-grey/5 transition hover:-translate-y-1 hover:border-warm-grey/20 hover:shadow-warm-grey/10 dark:border-warm-white/10 dark:bg-warm-grey/30"
            >
              <h3 className="text-xl font-semibold text-warm-grey dark:text-warm-white">
                {nearby.name}
              </h3>
              <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                {nearby.hero.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <AnimatedCTA
          badge={`Næringsmegler i ${location.name}`}
          title="Ønsker du en lokal vurdering?"
          description="Få en profesjonell vurdering basert på lokale markedsdata og en tydelig plan for eiendommen din."
          primaryAction={{
            label: "Få uforpliktende verdivurdering",
            href: "/kontakt",
          }}
          secondaryAction={{
            label: "Se våre tjenester",
            href: "/tjenester",
          }}
          size="default"
        />
      </section>
    </div>
  );
}
