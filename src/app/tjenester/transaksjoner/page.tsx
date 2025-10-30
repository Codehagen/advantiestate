import { Badge } from "@/components/Badge";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import FeatureDivider from "@/components/ui/FeatureDivider";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import {
  RiBuilding2Line,
  RiHandCoinLine,
  RiFileList3Line,
  RiShakeHandsLine,
  RiLightbulbFlashLine,
  RiMapPinUserLine,
} from "@remixicon/react";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Transaksjoner Næringseiendom | Advanti",
  description:
    "Advanti bistår med kjøp og salg av næringseiendom i Nord-Norge. Ekspertise gjennom hele transaksjonsprosessen fra verdivurdering til overtakelse.",
});

const transactionServices = [
  {
    title: "Kjøp av Næringseiendom",
    description:
      "Vi bistår kjøpere med å identifisere, vurdere og forhandle kjøp av næringseiendom som møter deres investeringsmål.",
    icon: RiBuilding2Line,
  },
  {
    title: "Salg av Næringseiendom",
    description:
      "Profesjonell salgsprosess fra verdivurdering og markedsføring til forhandling og gjennomføring av transaksjonen.",
    icon: RiHandCoinLine,
  },
  {
    title: "Due Diligence",
    description:
      "Grundige undersøkelser og analyser av eiendom, kontrakter og økonomiske forhold for å sikre trygge transaksjoner.",
    icon: RiFileList3Line,
  },
];

const whyAdvantiTransactions = [
  {
    title: "Markedskunnskap",
    description:
      "Dyp innsikt i det nordnorske markedet for næringseiendom, verdier og utviklingstrender.",
    icon: RiLightbulbFlashLine,
  },
  {
    title: "Bredt Nettverk",
    description:
      "Omfattende nettverk av kjøpere, selgere, investorer og samarbeidspartnere i markedet.",
    icon: RiMapPinUserLine,
  },
  {
    title: "Trygg Gjennomføring",
    description:
      "Erfarne rådgivere som sikrer at hele transaksjonsprosessen gjennomføres på en trygg og effektiv måte.",
    icon: RiShakeHandsLine,
  },
];

export default function TransaksjonerPage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      {/* Hero Section */}
      <section
        aria-labelledby="transaksjoner-hero"
        className="mx-auto w-full max-w-6xl animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Transaksjoner</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="transaksjoner-hero"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>Kjøp og Salg av Næringseiendom</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Advanti er din dedikerte partner for kjøp og salg av
              næringseiendom i Nord-Norge. Med dyp markedskunnskap og bred
              erfaring bistår vi både kjøpere og selgere gjennom hele
              transaksjonsprosessen.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Vi sikrer at du tar de beste beslutningene og oppnår optimale
              resultater i dine eiendomstransaksjoner.
            </p>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
              <Image
                src="/building/pexels-expect-best-79873-351262.jpg"
                alt="Håndtrykk som markerer en vellykket eiendomstransaksjon"
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

      {/* Transaction Services Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Våre Transaksjonstjenester</Badge>
          <h2 className="text-balance pb-2 leading-normal bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Ekspertise Gjennom Hele Prosessen
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Fra verdivurdering og markedsføring til forhandling og
              overtakelse – vi sikrer en trygg og effektiv transaksjonsprosess.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {transactionServices.map((service) => (
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

      {/* Why Choose Advanti for Transactions Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Hvorfor Velge Advanti?</Badge>
          <h2 className="text-balance pb-2 leading-normal bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Din Pålitelige Partner i Transaksjoner
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Med vår erfaring og lokale forankring sikrer vi at du får best
              mulig resultat i dine eiendomstransaksjoner.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {whyAdvantiTransactions.map((feature) => (
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
          badge="Behov for Transaksjonshjelp?"
          title="Skal du Kjøpe eller Selge Næringseiendom?"
          description="Ta kontakt med Advanti for en uforpliktende samtale om dine eiendomstransaksjoner."
          primaryAction={{
            label: "Kontakt oss om Transaksjoner",
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
