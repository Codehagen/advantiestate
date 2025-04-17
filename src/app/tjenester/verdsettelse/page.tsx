import { Badge } from "@/components/Badge"
import { FeatureComparison } from "@/components/propdock/FeatureComparison"
import { FeatureShowcase } from "@/components/propdock/FeatureShowcase"
import { AnimatedCTA } from "@/components/ui/AnimatedCTA"
import FeatureDivider from "@/components/ui/FeatureDivider"
import { constructMetadata } from "@/lib/utils"
import Balancer from "react-wrap-balancer"

export const metadata = constructMetadata({
  title: "Propdock Verdsettelse | Avansert verdivurdering av næringseiendom",
  description:
    "Propdocks analyseplattform gir deg presise verdivurderinger av næringseiendom med DCF-modeller, yield-beregninger og sensitivitetsanalyser.",
})

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
        <Badge>Propdock Verdsettelse</Badge>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h1
              id="verdsettelse-overview"
              className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
            >
              <Balancer>Intelligent verdivurdering av næringseiendom</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
              Propdock er en avansert analyseplattform som gir deg presise
              verdivurderinger av næringseiendom. Plattformen kombinerer
              markedsledende analyseverktøy med sanntidsdata for å gi deg det
              komplette beslutningsgrunnlaget.
            </p>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="aspect-[4/3] rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5" />
          </div>
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge>Analyseverktøy</Badge>
          <h2 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
            Verktøy for presis verdivurdering
          </h2>
          <p className="max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            <Balancer>
              Propdock gir deg tilgang til avanserte analyseverktøy og
              markedsledende metodikk for verdivurdering av næringseiendom.
              Plattformen sikrer at alle verdidrivere blir grundig analysert.
            </Balancer>
          </p>
        </div>
        <div className="mt-12">
          <FeatureShowcase />
        </div>
      </section>

      <FeatureDivider className="mx-auto mt-24 max-w-6xl" />

      <FeatureComparison
        badge="Moderne plattform"
        title="Fra Excel til intelligent verdivurdering"
        description="Oppgrader fra tidkrevende Excel-ark til en moderne plattform. Propdock automatiserer beregningene, eliminerer formelfeil og gir deg alltid oppdaterte markedsdata."
        lightImage="/images/hero-light.webp"
        darkImage="/images/hero-dark.webp"
      />

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <AnimatedCTA
          badge="Kom i gang"
          title="Klar for å verdsette din eiendom?"
          description="Få tilgang til markedsledende verktøy for verdivurdering av næringseiendom. Start med Propdock i dag."
          primaryAction={{
            label: "Start nå",
            href: "/kontakt",
          }}
          secondaryAction={{
            label: "Se alle funksjoner",
            href: "/tjenester",
          }}
          size="default"
        />
      </section>
    </div>
  )
}
