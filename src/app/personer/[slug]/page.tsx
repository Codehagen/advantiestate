import { constructMetadata } from "@/lib/utils";
import { allPersonPosts } from "content-collections";
import { notFound } from "next/navigation";
import { PersonMDX } from "./person-mdx";
import Link from "next/link";
import MaxWidthWrapper from "@/components/blog/max-width-wrapper";
import {
  RiAwardLine,
  RiBriefcaseLine,
  RiGraduationCapLine,
  RiMailLine,
  RiPhoneLine,
} from "@remixicon/react";

interface PersonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return allPersonPosts.map((person) => ({
    slug: person.slug,
  }));
}

export async function generateMetadata({ params }: PersonPageProps) {
  const { slug } = await params;
  const person = allPersonPosts.find((p) => p.slug === slug);

  if (!person) {
    return {};
  }

  return constructMetadata({
    title: `${person.name} - ${person.role} | Advanti`,
    description: `${person.name} er ${person.role} i Advanti med ${person.yearsExperience} års erfaring. Spesialiseringer: ${person.specializations.join(", ")}.`,
    canonical: `/personer/${slug}`,
  });
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { slug } = await params;
  const person = allPersonPosts.find((p) => p.slug === slug);

  if (!person) {
    notFound();
  }

  return (
    <>
      <MaxWidthWrapper className="flex max-w-screen-lg flex-col py-10 pt-32 md:pt-40">
        <div className="flex max-w-screen-md flex-col space-y-4">
          <Link
            href="/personer"
            className="text-sm text-warm-white/60 hover:text-warm-white/80"
          >
            ← Tilbake til teamet
          </Link>
          <h1 className="font-display text-3xl font-bold !leading-snug text-warm-white sm:text-4xl">
            {person.name}
          </h1>
          <p className="text-xl text-warm-white/80">{person.role}</p>
        </div>
      </MaxWidthWrapper>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-warm-grey-2/20 via-warm-grey-2/20 to-warm-grey-2/20" />
        <MaxWidthWrapper className="grid max-w-screen-lg grid-cols-3 gap-10 py-10">
          <div className="col-span-3 flex flex-col space-y-8 md:col-span-2">
            <img
              className="aspect-[4/5] rounded-xl object-cover"
              src={person.avatar}
              alt={person.name}
              width={800}
              height={1000}
            />

            {/* Mobile sidebar */}
            <div className="grid grid-cols-2 gap-5 rounded-xl border border-warm-grey-2/20 bg-warm-grey-2/10 p-5 backdrop-blur-sm md:hidden">
              <div className="col-span-2 flex flex-col space-y-3 border-b border-warm-grey-2/20 pb-4">
                <div className="flex items-center gap-2 text-warm-white/60">
                  <RiMailLine className="size-4" />
                  <a
                    href={`mailto:${person.email}`}
                    className="text-sm hover:text-warm-white/80 hover:underline"
                  >
                    {person.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-warm-white/60">
                  <RiPhoneLine className="size-4" />
                  <a
                    href={`tel:${person.phone}`}
                    className="text-sm hover:text-warm-white/80 hover:underline"
                  >
                    {person.phone}
                  </a>
                </div>
              </div>
              {sidebarContent(person).map(({ title, value }) => (
                <div
                  key={title}
                  className={`col-span-1 flex flex-col space-y-2 ${
                    title === "Spesialiseringer" ? "col-span-2" : ""
                  }`}
                >
                  <p className="font-medium text-warm-white">{title}</p>
                  <div className="text-sm text-warm-white/60">{value}</div>
                </div>
              ))}
            </div>

            <PersonMDX code={person.mdx} />
          </div>

          {/* Desktop sidebar */}
          <div className="sticky top-32 col-span-1 mt-0 hidden flex-col divide-y divide-warm-grey-2/20 self-start rounded-xl border border-warm-grey-2/20 bg-warm-grey-2/5 p-4 backdrop-blur-sm md:flex">
            <div className="flex flex-col space-y-3 pb-4">
              <div className="flex items-center gap-2 text-warm-white/60">
                <RiMailLine className="size-4" />
                <a
                  href={`mailto:${person.email}`}
                  className="text-sm hover:text-warm-white/80 hover:underline"
                >
                  {person.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-warm-white/60">
                <RiPhoneLine className="size-4" />
                <a
                  href={`tel:${person.phone}`}
                  className="text-sm hover:text-warm-white/80 hover:underline"
                >
                  {person.phone}
                </a>
              </div>
            </div>
            {sidebarContent(person).map(({ title, value }) => (
              <div
                key={title}
                className="flex flex-col space-y-1 py-4 first:pt-4 last:pb-0"
              >
                <p className="font-medium text-warm-white">{title}</p>
                <div className="text-sm text-warm-white/60">{value}</div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}

const sidebarContent = (person: any) => [
  {
    title: "Erfaring",
    value: (
      <div className="flex items-center gap-2">
        <RiBriefcaseLine className="size-4" />
        <span>{person.yearsExperience} år</span>
      </div>
    ),
  },
  {
    title: "Utdanning",
    value: (
      <div className="space-y-2">
        {person.education.map((edu: any, idx: number) => (
          <div key={idx} className="flex items-start gap-2">
            <RiGraduationCapLine className="size-4 mt-0.5 shrink-0" />
            <div>
              <div>{edu.degree}</div>
              <div className="text-xs text-warm-white/40">
                {edu.school}, {edu.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Sertifiseringer",
    value: (
      <div className="space-y-2">
        {person.certifications?.map((cert: string) => (
          <div key={cert} className="flex items-start gap-2">
            <RiAwardLine className="size-4 mt-0.5 shrink-0" />
            <span>{cert}</span>
          </div>
        )) || "Ingen"}
      </div>
    ),
  },
  {
    title: "Spesialiseringer",
    value: (
      <ul className="space-y-1">
        {person.specializations.map((spec: string) => (
          <li key={spec}>• {spec}</li>
        ))}
      </ul>
    ),
  },
];
