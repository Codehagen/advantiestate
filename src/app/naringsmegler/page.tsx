import { Badge } from "@/components/Badge";
import { CTAButtonGroup } from "@/components/CTAButtons";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import FeatureDivider from "@/components/ui/FeatureDivider";
import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import CoveredCities from "@/components/locations/CoveredCities";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Næringsmegler i Nord-Norge | Advanti",
  description:
    "Næringsmegler i Nord-Norge med lokal tilstedeværelse. Advanti bistår med salg, utleie og verdivurdering av næringseiendom i sentrale byer.",
  canonical: "/naringsmegler",
});

export default function NaringsmeglerHubPage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Næringsmegler", url: "/naringsmegler" },
        ]}
      />
      <StructuredData type="realEstateAgent" />

      <section
        aria-labelledby="naringsmegler-hero"
        className="mx-auto w-full max-w-6xl animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Næringsmegler i Nord-Norge</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="naringsmegler-hero"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>
                Lokal næringsmegler med datadrevet markedskompetanse
              </Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Advanti kombinerer lokal tilstedeværelse i Nord-Norge med avansert
              analyse for å sikre optimal prising, riktig markedsføring og
              profesjonell gjennomføring.
            </p>
            <p className="mt-4 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Vi bistår eiendomsbesittere, investorer og utviklere med salg,
              utleie og verdivurdering i sentrale byer og regioner.
            </p>
            <div className="mt-8">
              <CTAButtonGroup />
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
              <Image
                src="/building/pexels-abshky-18566965.jpg"
                alt="Næringsmegler som planlegger salgsprosess"
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

      <CoveredCities
        className="mt-24"
        title="Byer og regioner vi dekker"
        description="Velg din by eller region for å se lokal markedsinnsikt, team og tjenester fra Advanti."
      />

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <AnimatedCTA
          badge="Næringsmegler i ditt område"
          title="Vil du ha en lokal vurdering av eiendommen din?"
          description="Få en profesjonell vurdering basert på lokal markedsinnsikt og konkrete data."
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
