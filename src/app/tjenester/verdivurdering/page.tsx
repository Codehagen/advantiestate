import { Badge } from "@/components/Badge";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import { CTAButtonGroup } from "@/components/CTAButtons";
import FeatureDivider from "@/components/ui/FeatureDivider";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import {
  RiLineChartLine,
  RiBarChartBoxLine,
  RiFileSearchLine,
  RiTeamLine,
  RiFocus3Line,
  RiMedalLine,
} from "@remixicon/react";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Verdivurdering Næringseiendom | Advanti",
  description:
    "Advanti tilbyr profesjonelle verdivurderinger og analyser av næringseiendom i Nord-Norge. Få et solid beslutningsgrunnlag for dine eiendomsinvesteringer.",
});

const valuationServices = [
  {
    title: "Markedsverdivurdering",
    description:
      "Grundige verdivurderinger basert på markedsanalyse, sammenlignbare transaksjoner og eiendomsspesifikke forhold.",
    icon: RiLineChartLine,
  },
  {
    title: "Investeringsanalyse",
    description:
      "Detaljerte analyser av avkastning, kontantstrøm og verdiutvikling for å vurdere investeringspotensialet.",
    icon: RiBarChartBoxLine,
  },
  {
    title: "Sensitivitetsanalyse",
    description:
      "Detaljerte sensitivitetsanalyser som viser hvordan endringer i markedsforhold, leienivåer og finansiering påvirker eiendommens verdi og risiko.",
    icon: RiFocus3Line,
  },
];

const whyAdvantiValuation = [
  {
    title: "Lokal Markedskunnskap",
    description:
      "Bred erfaring og dyp kunnskap om det nordnorske markedet for næringseiendom gir presise verdivurderinger.",
    icon: RiTeamLine,
  },
  {
    title: "Grundig Analyse",
    description:
      "Vi gjennomfører omfattende analyser som gir deg et solid og pålitelig grunnlag for beslutninger.",
    icon: RiFocus3Line,
  },
  {
    title: "Uavhengig Rådgivning",
    description:
      "Som uavhengige rådgivere sikrer vi objektive og profesjonelle verdivurderinger uten interessekonflikter.",
    icon: RiMedalLine,
  },
];

export default function VerdivurderingPage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      {/* Hero Section */}
      <section
        aria-labelledby="verdivurdering-hero"
        className="mx-auto w-full max-w-6xl animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Verdivurdering</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="verdivurdering-hero"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>Profesjonell Verdivurdering av Næringseiendom</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Advanti tilbyr grundige og profesjonelle verdivurderinger av
              næringseiendom i Nord-Norge. Med vår markedskunnskap og
              eiendomsfaglige kompetanse gir vi deg et solid
              beslutningsgrunnlag.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Våre verdivurderinger er basert på grundige analyser av markedet,
              eiendommens potensial og relevante sammenlignbare objekter.
            </p>
            <div className="mt-8">
              <CTAButtonGroup />
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
              <Image
                src="/building/pexels-abshky-18567185.jpg"
                alt="Analytiker som vurderer næringseiendom"
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

      {/* Valuation Services Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Våre Verdivurderingstjenester</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Solid Grunnlag for Dine Beslutninger
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Vi tilbyr omfattende verdivurderinger og analyser som gir deg
              innsikt i eiendommens verdi og potensial.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {valuationServices.map((service) => (
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

      {/* Why Choose Advanti for Valuation Section */}
      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Hvorfor Velge Advanti?</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Pålitelige og Profesjonelle Verdivurderinger
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Vår erfaring og metodikk sikrer at du får objektive og grundige
              verdivurderinger du kan stole på.
            </Balancer>
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {whyAdvantiValuation.map((feature) => (
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
          badge="Behov for Verdivurdering?"
          title="Ønsker du en Profesjonell Verdivurdering?"
          description="Kontakt Advanti for en samtale om hvordan vi kan bistå med verdivurdering av din næringseiendom."
          primaryAction={{
            label: "Kontakt oss om Verdivurdering",
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
