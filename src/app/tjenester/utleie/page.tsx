import { Badge } from "@/components/Badge";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import FeatureDivider from "@/components/ui/FeatureDivider";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import {
  RiBuilding2Line, // For office
  RiStore2Line, // For retail/hospitality
  RiLuggageCartLine, // For logistics/warehouse
  RiUserSearchLine, // For tenant representation
  RiBuilding4Line, // For landlord representation (or general property)
  RiLightbulbFlashLine, // For why Advanti - insights
  RiShakeHandsLine, // For why Advanti - negotiation/deals
  RiMapPinUserLine, // For why Advanti - local knowledge
} from "@remixicon/react";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Utleie av Næringseiendom | Advanti",
  description:
    "Advanti tilbyr skreddersydde løsninger for utleie av kontor, handel- og logistikkeiendom, samt leietaker- og gårdeierrådgivning i Nord-Norge.",
});

const leasingServices = [
  {
    title: "Kontorutleie",
    description:
      "Vi bistår gårdeiere med utleie og reforhandling av kontorlokaler, og hjelper bedrifter med å finne de rette kontorarealene.",
    icon: RiBuilding2Line,
  },
  {
    title: "Handel og Bevertning",
    description:
      "Spesialisert rådgivning for utleie av butikklokaler, kjøpesenterenheter og serveringssteder.",
    icon: RiStore2Line,
  },
  {
    title: "Lager og Logistikk",
    description:
      "Effektiv formidling av lager-, logistikk- og kombinasjonseiendommer tilpasset bedriftens behov.",
    icon: RiLuggageCartLine,
  },
  {
    title: "Leietakerrådgivning",
    description:
      "Vi representerer leietakere i søk etter nye lokaler, reforhandling av avtaler og flytteprosesser.",
    icon: RiUserSearchLine,
  },
  {
    title: "Gårdeierrådgivning",
    description:
      "Strategisk rådgivning for gårdeiere for å optimalisere utleie, minimere tomgang og øke eiendommens verdi.",
    icon: RiBuilding4Line,
  },
];

const whyAdvantiLeasing = [
  {
    title: "Markedsinnsikt",
    description:
      "Dybdegående kunnskap om leiemarkedet i Nord-Norge, trender og leietakerpreferanser.",
    icon: RiLightbulbFlashLine,
  },
  {
    title: "Bredt Nettverk",
    description:
      "Et omfattende nettverk av gårdeiere, leietakere og samarbeidspartnere for effektiv matching.",
    icon: RiMapPinUserLine,
  },
  {
    title: "Forhandlingsstyrke",
    description:
      "Erfarne rådgivere som sikrer de beste betingelsene for deg, enten du er leietaker eller gårdeier.",
    icon: RiShakeHandsLine,
  },
];

export default function UtleiePage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      {/* Hero Section */}
      <section
        aria-labelledby="utleie-hero"
        className="mx-auto w-full max-w-6xl animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Utleie av Næringseiendom</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="utleie-hero"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>Finn Rette Leietaker eller Lokale</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Advanti er din dedikerte partner for utleie av næringseiendom i
              Nord-Norge. Vi forstår markedet og jobber målrettet for å
              sammenkoble gårdeiere med solide leietakere, og bedrifter med
              lokaler som fremmer vekst.
            </p>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
              <Image
                src="/building/pexels-abshky-18567185.jpg"
                alt="Moderne kontorbygg med fleksible lokaler"
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

      {/* Leasing Services Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Våre Utleietjenester</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Skreddersydd for Dine Behov
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Vi tilbyr et bredt spekter av utleietjenester, enten du skal leie
              ut egne lokaler eller ser etter nye for din virksomhet.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {leasingServices.map((service) => (
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

      {/* Why Choose Advanti for Leasing Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Hvorfor Velge Advanti?</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Din Partner i Utleiemarkedet
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Med vår ekspertise og lokale forankring er vi godt posisjonert for
              å levere optimale utleieløsninger.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {whyAdvantiLeasing.map((feature) => (
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
          badge="Behov for Utleiehjelp?"
          title="Skal du Leie ut eller Finne Nye Lokaler?"
          description="Ta kontakt med Advanti for en uforpliktende prat om dine utfordringer og muligheter i leiemarkedet."
          primaryAction={{
            label: "Kontakt oss om Utleie",
            href: "/kontakt",
          }}
          secondaryAction={{
            label: "Utforsk andre tjenester",
            href: "/tjenester",
          }}
          size="default"
        />
      </section>
    </div>
  );
}
