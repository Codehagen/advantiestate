import { Badge } from "@/components/Badge";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import FeatureDivider from "@/components/ui/FeatureDivider";
import { CTAButtonGroup } from "@/components/CTAButtons";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import CoveredCities from "@/components/locations/CoveredCities";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import {
  RiAuctionLine,
  RiClipboardLine,
  RiEyeLine,
  RiContractLine,
  RiLineChartLine,
  RiMegaphoneLine,
  RiTeamLine,
  RiBuildingLine,
  RiCheckboxCircleLine,
} from "@remixicon/react";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Salg av Næringseiendom i Nord-Norge | Advanti",
  description:
    "Planlegger du salg av næringseiendom? Advanti bistår deg gjennom hele salgsprosessen, fra verdivurdering og markedsføring til forhandlinger og oppgjør.",
});

const salesProcessSteps = [
  {
    title: "Forberedelse og Verdivurdering",
    description:
      "Grundig gjennomgang av eiendommen, innhenting av all nødvendig dokumentasjon og en nøyaktig verdivurdering for å fastsette korrekt markedspris.",
    icon: RiClipboardLine,
  },
  {
    title: "Markedsføring og Prospekt",
    description:
      "Utvikling av profesjonelt salgsmateriell og en målrettet markedsføringsstrategi for å nå de rette potensielle kjøperne.",
    icon: RiMegaphoneLine,
  },
  {
    title: "Visninger og Interessenthåndtering",
    description:
      "Profesjonell gjennomføring av visninger og kontinuerlig oppfølging av interessenter for å sikre en god dialog og fremdrift.",
    icon: RiEyeLine,
  },
  {
    title: "Budrunde og Forhandlinger",
    description:
      "Effektiv håndtering av budrunder og erfarne forhandlinger for å oppnå best mulig pris og betingelser for deg som selger.",
    icon: RiAuctionLine,
  },
  {
    title: "Kontrakt og Oppgjør",
    description:
      "Utarbeidelse av kjøpekontrakt i henhold til gjeldende lovverk, og en trygg og sikker gjennomføring av det økonomiske oppgjøret.",
    icon: RiContractLine,
  },
  {
    title: "Overtakelse og Oppfølging",
    description:
      "Bistand med en ryddig overtakelsesprosess og oppfølging for å sikre at alle parter er fornøyde etter handelen.",
    icon: RiCheckboxCircleLine,
  },
];

const whyAdvantiFeatures = [
  {
    title: "Lokalkunnskap og Nettverk",
    description:
      "Vår dyptgående kjennskap til markedet i Nord-Norge og vårt omfattende nettverk sikrer maksimal eksponering for din eiendom.",
    icon: RiBuildingLine,
  },
  {
    title: "Dedikert Team",
    description:
      "Et erfarent og dedikert team følger deg tett gjennom hele prosessen, og sørger for personlig service og profesjonell håndtering.",
    icon: RiTeamLine,
  },
  {
    title: "Resultatorientert",
    description:
      "Vi er resultatorienterte og jobber målrettet for å oppnå den beste mulige prisen og de mest gunstige vilkårene for ditt eiendomssalg.",
    icon: RiLineChartLine,
  },
];

export default function SalgPage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Tjenester", url: "/tjenester" },
          { name: "Salg", url: "/tjenester/salg" },
        ]}
      />
      <StructuredData
        type="service"
        data={{
          name: "Salg av Næringseiendom i Nord-Norge",
          description:
            "Profesjonell bistand ved salg av næringseiendom i Nord-Norge, fra verdivurdering til oppgjør.",
        }}
      />
      {/* Hero Section */}
      <section
        aria-labelledby="salg-hero"
        className="mx-auto w-full max-w-6xl animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Salg av Næringseiendom</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="salg-hero"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>Salg av Næringseiendom i Nord-Norge</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Advanti er din strategiske partner for salg av næringseiendom i
              Nord-Norge. Vi kombinerer markedsinnsikt, et bredt nettverk og
              dedikert rådgivning for å sikre en vellykket og lønnsom
              salgsprosess for deg.
            </p>
            <div className="mt-8">
              <CTAButtonGroup />
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
              <Image
                src="/building/pexels-abshky-18566965.jpg"
                alt="Meglere som forhandler salg av næringseiendom"
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

      {/* Sales Process Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Vår Salgsprosess</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            En Strukturert og Effektiv Prosess
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Vi følger en velprøvd og transparent prosess for å sikre at alle
              aspekter ved salget blir profesjonelt håndtert, fra start til
              slutt.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {salesProcessSteps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center gap-4 text-center md:items-start md:text-left"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-warm-grey/5 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:ring-warm-white/5">
                <step.icon className="size-6 text-warm-grey dark:text-warm-white" />
              </div>
              <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                {step.title}
              </h3>
              <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      {/* Why Choose Advanti Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Hvorfor Velge Advanti?</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Din Fordel med Oss som Partner
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Med Advanti får du en partner som kjenner markedet, jobber
              dedikert for dine interesser, og har dokumenterte resultater.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {whyAdvantiFeatures.map((feature) => (
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

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <CoveredCities
        className="mt-24"
        title="Lokale salgsprosesser i hele Nord‑Norge"
        description="Vi gjennomfører salgsprosesser i sentrale byer og regioner med lokal markedskunnskap og profesjonell oppfølging."
      />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <AnimatedCTA
          badge="Klar til å Selge?"
          title="Ønsker du å Selge Din Næringseiendom?"
          description="Kontakt Advanti for en konfidensiell samtale om salg av din eiendom og hvordan vi kan oppnå best mulig resultat for deg."
          primaryAction={{
            label: "Kontakt oss for Salgsvurdering",
            href: "/kontakt",
          }}
          secondaryAction={{
            label: "Se våre andre tjenester",
            href: "/tjenester",
          }}
          size="default"
        />
      </section>
    </div>
  );
}
