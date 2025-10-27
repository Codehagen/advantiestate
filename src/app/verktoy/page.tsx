import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import FeatureDivider from "@/components/ui/FeatureDivider";
import { constructMetadata } from "@/lib/utils";
import {
  RiBarChartBoxLine,
  RiCalculatorLine,
  RiLineChartLine,
  RiPieChartLine,
} from "@remixicon/react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Verktøy for Næringseiendom | Advanti",
  description:
    "Bruk våre profesjonelle kalkulatorer for yield, ROI, boliglån og mer. Få umiddelbare beregninger for næringseiendomsinvesteringer i Nord-Norge.",
});

const calculators = [
  {
    title: "Yield Kalkulator",
    description:
      "Beregn brutto og netto yield for næringseiendom basert på leieinntekter og driftskostnader.",
    icon: RiPieChartLine,
    href: "/verktoy/yield-kalkulator",
    color: "text-light-blue",
  },
  {
    title: "ROI Kalkulator",
    description:
      "Estimer total avkastning på investering over tid med verdiøkning og kontantstrøm.",
    icon: RiLineChartLine,
    href: "/verktoy/roi-kalkulator",
    color: "text-warm-grey-3",
  },
  {
    title: "Boliglån Kalkulator",
    description:
      "Beregn månedlige kostnader, total rentekostnad og nedbetalingsplan for næringslån.",
    icon: RiCalculatorLine,
    href: "/verktoy/boliglan-kalkulator",
    color: "text-warm-grey-2",
  },
];

export default function VerktoyPage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      {/* Hero Section */}
      <section
        aria-labelledby="tools-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Verktøy</Badge>
        <h1
          id="tools-overview"
          className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
        >
          <Balancer>
            Profesjonelle kalkulatorer for næringseiendom
          </Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
          Bruk våre avanserte verktøy for å analysere investeringsmuligheter,
          beregne avkastning og ta informerte beslutninger. Alle beregninger er
          skreddersydd for det norske markedet.
        </p>
      </section>

      <FeatureDivider className="mt-16" />

      {/* Calculator Grid */}
      <section className="mt-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator, index) => {
            const Icon = calculator.icon;
            return (
              <Link
                key={calculator.href}
                href={calculator.href}
                className="group relative overflow-hidden rounded-xl border border-warm-grey-1/20 bg-warm-white p-8 transition-all duration-300 hover:border-warm-grey-1/40 hover:shadow-xl dark:border-warm-white/10 dark:bg-warm-grey-2/20 dark:hover:border-warm-white/20"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "600ms",
                  animationFillMode: "backwards",
                }}
              >
                <div className="relative">
                  <div
                    className={`mb-4 inline-flex rounded-lg bg-warm-grey/5 p-3 ${calculator.color} dark:bg-warm-white/5`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-warm-grey dark:text-warm-white">
                    {calculator.title}
                  </h3>
                  <p className="mb-6 text-warm-grey-2 dark:text-warm-grey-1">
                    {calculator.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-light-blue">
                    Prøv nå
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>

                {/* Hover effect background */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-light-blue/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Info Section */}
      <section className="mx-auto mt-24 max-w-3xl text-center">
        <h2 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
          Hvorfor bruke våre kalkulatorer?
        </h2>
        <p className="mt-4 text-warm-grey-2 dark:text-warm-grey-1">
          Våre verktøy er utviklet av erfarne næringsmeglere og skreddersydd for
          det norske markedet. Du får nøyaktige beregninger basert på
          bransjestandarder og best practice.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div>
            <div className="mb-2 text-3xl font-bold text-light-blue">100%</div>
            <div className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Gratis å bruke
            </div>
          </div>
          <div>
            <div className="mb-2 text-3xl font-bold text-light-blue">
              <RiBarChartBoxLine className="mx-auto size-8" />
            </div>
            <div className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Sanntids beregninger
            </div>
          </div>
          <div>
            <div className="mb-2 text-3xl font-bold text-light-blue">10+</div>
            <div className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
              Års erfaring
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24">
        <AnimatedCTA
          badge="Trenger du hjelp?"
          title="Usikker på beregningene?"
          description="Våre eksperter hjelper deg gjerne med å tolke resultatene og gi deg skreddersy rådgivning for din eiendomsinvestering."
          primaryAction={{
            label: "Kontakt oss",
            href: "/kontakt",
          }}
          secondaryAction={{
            label: "Snakk med en ekspert",
            href: "/personer",
          }}
          size="default"
        />
      </section>
    </div>
  );
}
