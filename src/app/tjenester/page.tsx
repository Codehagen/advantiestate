import { AnimatedGridPattern } from "@/components/ui/Animated-Grid-Background"
import { FadeContainer, FadeSpan } from "@/components/ui/Fade"
import { constructMetadata } from "@/lib/utils"
import {
  RiBarChartBoxLine,
  RiDatabaseLine,
  RiLineChartLine,
  RiPieChartLine,
} from "@remixicon/react"
import Link from "next/link"

export const metadata = constructMetadata({
  title: "Verdsettelse og verdivurdering av næringseiendom | Propdock",
  description:
    "Få tilgang til avanserte verktøy for verdsettelse av næringseiendom. Markedsdata, yield-beregninger og sensitivitetsanalyser i én løsning.",
})

export default function TjenesterPage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section aria-label="hero">
        <FadeContainer className="relative mx-auto flex max-w-6xl flex-col items-center justify-center">
          <h1 className="mt-8 text-center text-5xl font-semibold tracking-tighter text-warm-grey sm:text-8xl sm:leading-[5.5rem] dark:text-warm-white">
            <FadeSpan>Profesjonell</FadeSpan>{" "}
            <FadeSpan>verdivurdering av</FadeSpan>
            <br />
            <FadeSpan>næringseiendom</FadeSpan>
          </h1>

          <p className="mt-5 max-w-xl text-balance text-center text-base text-warm-grey-2 sm:mt-8 sm:text-xl">
            <FadeSpan>
              Fra avanserte DCF-analyser til yield-beregninger -
            </FadeSpan>{" "}
            <FadeSpan>få innsikt i den reelle verdien</FadeSpan>{" "}
            <FadeSpan>av din eiendom</FadeSpan>
          </p>

          <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-warm-white via-warm-white/80 to-transparent dark:from-warm-grey dark:via-warm-grey/80" />

            <AnimatedGridPattern
              width={50}
              height={50}
              className="-mt-24 scale-125 text-light-blue/20"
              maxOpacity={0.3}
              numSquares={30}
              duration={3}
            />

            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-warm-white via-warm-white/80 to-transparent dark:from-warm-grey dark:via-warm-grey/80" />
          </div>
        </FadeContainer>
      </section>

      <section className="mx-auto mt-32 w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {mainFeatures.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group flex flex-col items-center gap-4 rounded-xl p-6 text-center transition-all hover:bg-warm-grey/[2.5%] dark:hover:bg-warm-grey-3/50"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-warm-grey/5 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:ring-warm-white/5">
                <feature.icon className="size-6 text-warm-grey transition-transform group-hover:scale-110 dark:text-warm-white" />
              </div>
              <h2 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                {feature.title}
              </h2>
              <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

const mainFeatures = [
  {
    title: "DCF-Analyse",
    description: "Detaljerte kontantstrømanalyser med flere scenarioer",
    icon: RiLineChartLine,
    href: "/tjenester/verdsettelse",
  },
  {
    title: "Yield-Beregning",
    description: "Nøyaktige yield-beregninger basert på markedsdata",
    icon: RiPieChartLine,
    href: "/tjenester/verdsettelse",
  },
  {
    title: "Sensitivitetsanalyse",
    description: "Analyser hvordan ulike faktorer påvirker verdien",
    icon: RiDatabaseLine,
    href: "/tjenester/verdsettelse",
  },
  {
    title: "Sammenligning",
    description: "Sammenlign med lignende eiendommer i markedet",
    icon: RiBarChartBoxLine,
    href: "/tjenester/verdsettelse",
  },
]
