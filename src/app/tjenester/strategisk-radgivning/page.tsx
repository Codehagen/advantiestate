import { Badge } from "@/components/Badge";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import FeatureDivider from "@/components/ui/FeatureDivider";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import {
  RiBrainLine, // For strategic thinking, portfolio analysis
  RiBriefcaseLine, // For investment strategy
  RiBarChartGroupedLine, // For market analysis, due diligence
  RiToolsLine, // For property development
  RiRecycleLine, // For repositioning / optimization
  RiTeamLine, // For why Advanti - experience/team
  RiFocus3Line, // For why Advanti - tailored solutions
  RiMedalLine, // For why Advanti - results-driven
} from "@remixicon/react";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Strategisk Rådgivning Næringseiendom | Advanti",
  description:
    "Advanti tilbyr strategisk rådgivning for eiendomsinvestorer og -utviklere i Nord-Norge, inkludert porteføljeanalyse, investeringsstrategi og utviklingsprosjekter.",
});

const strategicAdvisoryServices = [
  {
    title: "Porteføljeanalyse og -optimalisering",
    description:
      "Analyse av din eksisterende eiendomsportefølje for å identifisere muligheter for verdiskaping, risikoreduksjon og optimalisering.",
    icon: RiBrainLine,
  },
  {
    title: "Investeringsstrategi",
    description:
      "Utvikling av skreddersydde investeringsstrategier basert på dine mål, markedsinnsikt og risikoprofil.",
    icon: RiBriefcaseLine,
  },
  {
    title: "Markedsanalyse og Due Diligence",
    description:
      "Grundige markedsanalyser og due diligence-prosesser for å støtte investeringsbeslutninger og identifisere potensielle risikoer.",
    icon: RiBarChartGroupedLine,
  },
  {
    title: "Eiendomsutvikling",
    description:
      "Rådgivning gjennom alle faser av et utviklingsprosjekt, fra konsept og regulering til gjennomføring og salg/utleie.",
    icon: RiToolsLine,
  },
  {
    title: "Ombygging og Reposisjonering",
    description:
      "Strategier for ombygging og reposisjonering av eiendommer for å møte markedets behov og øke verdien.",
    icon: RiRecycleLine,
  },
];

const whyAdvantiStrategic = [
  {
    title: "Erfarent Team",
    description:
      "Vårt team har lang erfaring og bred kompetanse innen strategisk rådgivning for næringseiendom.",
    icon: RiTeamLine,
  },
  {
    title: "Skreddersydde Løsninger",
    description:
      "Vi tilpasser våre råd og strategier til dine spesifikke behov, mål og din unike situasjon.",
    icon: RiFocus3Line,
  },
  {
    title: "Resultatorientert Tilnærming",
    description:
      "Vi fokuserer på å levere konkrete, målbare resultater som skaper reell verdi for din virksomhet.",
    icon: RiMedalLine,
  },
];

export default function StrategiskRadgivningPage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      {/* Hero Section */}
      <section
        aria-labelledby="strategisk-radgivning-hero"
        className="mx-auto w-full max-w-6xl animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Strategisk Rådgivning</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="strategisk-radgivning-hero"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>Maksimer Verdien av Din Eiendom</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Advanti tilbyr spesialisert strategisk rådgivning for
              eiendomsinvestorer, utviklere og eiere i Nord-Norge. Vi hjelper
              deg å navigere komplekse beslutninger og realisere det fulle
              potensialet i dine eiendommer.
            </p>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
              <Image
                src="/building/pexels-abshky-18566965.jpg"
                alt="Strategimøte i moderne møterom"
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

      {/* Strategic Advisory Services Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Våre Rådgivningstjenester</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Strategisk Veiledning for Din Suksess
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Vi tilbyr et bredt spekter av strategiske rådgivningstjenester
              designet for å hjelpe deg å ta informerte beslutninger og oppnå
              dine langsiktige mål.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {strategicAdvisoryServices.map((service) => (
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

      {/* Why Choose Advanti for Strategic Advisory Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Hvorfor Velge Advanti?</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Din Strategiske Partner innen Eiendom
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Vår ekspertise og dedikerte tilnærming gir deg tryggheten du
              trenger for å ta gode strategiske valg for dine
              eiendomsinvesteringer.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {whyAdvantiStrategic.map((feature) => (
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
          badge="Behov for Strategisk Rådgivning?"
          title="Ønsker du å Utvikle Din Eiendomsstrategi?"
          description="Kontakt Advanti for en samtale om hvordan vår strategiske rådgivning kan bidra til å nå dine mål."
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
