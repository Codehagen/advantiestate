import { Badge } from "@/components/Badge";
import { FeatureComparison } from "@/components/advanti/FeatureComparison";
import { FeatureShowcase } from "@/components/advanti/FeatureShowcase";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import { CTAButtonGroup } from "@/components/CTAButtons";
import FeatureDivider from "@/components/ui/FeatureDivider";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Verdivurdering & Analyse av Næringseiendom | Advanti",
  description:
    "Advanti tilbyr dyptgående verdivurderinger og analyser av næringseiendom, basert på markedsdata og anerkjente metoder.",
});

export default function VerdsettelsePage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section
        aria-labelledby="verdsettelse-overview"
        className="mx-auto w-full max-w-6xl animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Verdivurdering og Analyse</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="verdsettelse-overview"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>Dyptgående verdivurdering av næringseiendom</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Advanti leverer presise verdivurderinger av næringseiendom. Vi
              kombinerer anerkjente analysemetoder med fersk markedsdata for å
              gi deg et solid og pålitelig beslutningsgrunnlag.
            </p>
            <div className="mt-8">
              <CTAButtonGroup />
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
              <Image
                src="/building/pexels-pixabay-248877.jpg"
                alt="Næringseiendom som analyseres for verdsettelse"
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
          <Badge>Vår Metode</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Metoder for presis verdivurdering
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Advanti benytter anerkjente metoder for verdivurdering av
              næringseiendom, inkludert DCF-analyser og yield-betraktninger.
              Dette sikrer at alle relevante verdidrivere blir grundig vurdert.
            </Balancer>
          </p>
        </div>
        <div className="mt-12">
          <FeatureShowcase />
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <FeatureComparison
        badge="Fra Data til Innsikt"
        title="Solid Beslutningsgrunnlag"
        description="Advanti transformerer kompleks data til klar innsikt. Vi systematiserer informasjon og leverer analyser som gir deg et trygt og godt fundament for dine eiendomsbeslutninger."
        lightImage="/images/hero-light.webp"
        darkImage="/images/hero-dark.webp"
      />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <AnimatedCTA
          badge="Kom i gang"
          title="Behov for Verdivurdering eller Analyse?"
          description="Ta kontakt for en uforpliktende samtale om hvordan Advanti kan bistå dere."
          primaryAction={{
            label: "Kontakt oss",
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
