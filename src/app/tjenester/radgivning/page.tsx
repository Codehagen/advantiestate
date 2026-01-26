import { Badge } from "@/components/Badge";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import { AdvisoryCTAButtonGroup } from "@/components/CTAButtons";
import FeatureDivider from "@/components/ui/FeatureDivider";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import {
  RiBrainLine,
  RiBriefcaseLine,
  RiBarChartGroupedLine,
  RiTeamLine,
  RiFocus3Line,
  RiMedalLine,
} from "@remixicon/react";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Rådgivning Næringseiendom | Advanti",
  description:
    "Advanti tilbyr eiendomsfaglig rådgivning for bedrifter og organisasjoner i Nord-Norge. Vi sikrer optimal avkastning og verdioptimaliserende råd.",
});

const advisoryServices = [
  {
    title: "Eiendomsanalyse",
    description:
      "Grundig analyse av din eiendom og portefølje for å identifisere muligheter for verdiskaping og optimalisering.",
    icon: RiBrainLine,
  },
  {
    title: "Strategisk Planlegging",
    description:
      "Utvikling av langsiktige strategier for din eiendomsportefølje basert på markedskunnskap og dine forretningsmål.",
    icon: RiBriefcaseLine,
  },
  {
    title: "Markedsvurdering",
    description:
      "Dybdegående markedsinnsikt og vurderinger som gir deg det beste grunnlaget for å ta optimale beslutninger.",
    icon: RiBarChartGroupedLine,
  },
];

const whyAdvantiAdvisory = [
  {
    title: "Eiendomsfaglig Kompetanse",
    description:
      "Med vår eiendomsfaglige kompetanse og markedskunnskap er vi kundens uavhengige rådgiver i eiendomsmarkedet.",
    icon: RiTeamLine,
  },
  {
    title: "Verdioptimaliserende Råd",
    description:
      "Vi tilbyr bedrifter og organisasjoner verdioptimaliserende råd i forbindelse med utleie og transaksjon.",
    icon: RiFocus3Line,
  },
  {
    title: "Fra Vurdering til Realisering",
    description:
      "I samarbeid med kunden kan vi bidra til å utvikle og forberede eiendomsprosjekter for vurdering/beslutning til realisering.",
    icon: RiMedalLine,
  },
];

export default function RadgivningPage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Tjenester", url: "/tjenester" },
          { name: "Rådgivning", url: "/tjenester/radgivning" },
        ]}
      />
      <StructuredData
        type="service"
        data={{
          name: "Rådgivning Næringseiendom",
          description:
            "Eiendomsfaglig rådgivning for bedrifter og organisasjoner i Nord-Norge.",
        }}
      />
      {/* Hero Section */}
      <section
        aria-labelledby="radgivning-hero"
        className="mx-auto w-full max-w-6xl animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Rådgivning</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="radgivning-hero"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>Sikre Størst Mulig Avkastning</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Betydelig kapital er bundet i fast eiendom. Vi kan bidra til å
              sikre størst mulig avkastning på investert kapital for våre
              kunder, og at kunden tar de optimale beslutningene.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Med vår eiendomsfaglige kompetanse og markedskunnskap er vi
              kundens uavhengige rådgiver i eiendomsmarkedet.
            </p>
            <div className="mt-8">
              <AdvisoryCTAButtonGroup />
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
              <Image
                src="/building/pexels-pixabay-248877.jpg"
                alt="Rådgivere som analyserer næringseiendom"
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

      {/* Advisory Services Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Våre Rådgivningstjenester</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Din Uavhengige Rådgiver
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Vi tilbyr bedrifter og organisasjoner verdioptimaliserende råd i
              forbindelse med utleie og transaksjon.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {advisoryServices.map((service) => (
            <div
              key={service.title}
              className="flex flex-col items-center gap-4 text-center md:items-start md:text-left"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-warm-grey/5 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:ring-warm-white/5">
                <service.icon className="size-6 text-warm-grey dark:text-warm-white" />
              </div>
              <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                {service.title}
              </h3>
              <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      {/* Why Choose Advanti for Advisory Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Hvorfor Velge Advanti?</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Eiendomsfaglig Kompetanse og Markedskunnskap
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              I samarbeid med kunden kan vi bidra til å utvikle og forberede
              eiendomsprosjekter for vurdering/beslutning til realisering.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {whyAdvantiAdvisory.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-4 rounded-xl p-6 text-center transition-all hover:bg-warm-grey/[2.5%] dark:hover:bg-warm-grey-3/50 md:items-start md:text-left"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-warm-grey/5 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:ring-warm-white/5">
                <feature.icon className="size-6 text-warm-grey dark:text-warm-white" />
              </div>
              <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                {feature.title}
              </h3>
              <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <AnimatedCTA
          badge="Behov for Rådgivning?"
          title="Ønsker du Verdioptimaliserende Råd?"
          description="Kontakt Advanti for en samtale om hvordan vår rådgivning kan bidra til størst mulig avkastning på din eiendomskapital."
          primaryAction={{
            label: "Kontakt for Rådgivning",
            href: "/kontakt",
          }}
          secondaryAction={{
            label: "Se alle våre tjenester",
            href: "/tjenester",
          }}
          size="default"
        />
      </section>
    </div>
  );
}
