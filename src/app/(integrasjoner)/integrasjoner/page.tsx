import { Integration } from "@/components/blog/integrations"
import { AnimatedGridPattern } from "@/components/ui/Animated-Grid-Background"
import { FadeContainer, FadeSpan } from "@/components/ui/Fade"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  title: "Integrasjoner - Propdock",
  description:
    "Utforsk våre integrasjoner og se hvordan de kan forbedre din eiendomsforvaltning.",
})

export default function Integrations() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section aria-label="hero">
        <FadeContainer className="relative mx-auto flex max-w-6xl flex-col items-center justify-center">
          <h1 className="mt-8 text-center text-5xl font-semibold tracking-tighter text-warm-grey sm:text-8xl sm:leading-[5.5rem] dark:text-warm-white">
            <FadeSpan>Våre</FadeSpan>{" "}
            <FadeSpan>
              <span className="bg-gradient-to-r from-warm-grey via-warm-grey-2 to-warm-grey bg-clip-text text-transparent dark:from-warm-white dark:via-warm-grey-1 dark:to-warm-white">
                integrasjoner
              </span>
            </FadeSpan>
          </h1>
          <p className="mt-5 max-w-xl text-balance text-center text-base text-warm-grey-2 sm:mt-8 sm:text-xl">
            <FadeSpan>
              Propdock integrerer sømløst med en rekke verktøy
            </FadeSpan>{" "}
            <FadeSpan>for å forbedre din</FadeSpan>{" "}
            <FadeSpan>eiendomsforvaltning</FadeSpan>
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

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Integration key={integration.slug} {...integration} />
          ))}
        </div>
      </section>
    </div>
  )
}

const integrations = [
  // {
  //   slug: "poweroffice",
  //   description:
  //     "Vi har brukt PowerOffice i Propdock siden lanseringen for over et år siden for alle våre eiendomskampanjer, og vårt team elsker det absolutt!",
  // },
  // {
  //   slug: "tripletex",
  //   site: "https://tripletex.no",
  //   description:
  //     "Tripletex er et kraftig regnskapssystem som gjør det enkelt å få tilgang til regnskapsdata fra Tripletex, slik at du kan få en enda bedre innsikt i din eiendomsforvaltning.",
  // },
  // {
  //   slug: "visma",
  //   site: "https://visma.no",
  //   description:
  //     "Visma's regnskapsinfrastruktur og analyser har hjulpet oss med å få verdifull innsikt i regnskapsføring for eiendomsforvaltning.",
  // },
  // {
  //   slug: "propcloud",
  //   site: "https://propcloud.no",
  //   description:
  //     "PropCloud er en av våre mest populære integrasjoner, og er brukt av vårt team som standard for alle våre eiendomskampanjer.",
  // },
  // {
  //   slug: "fiken",
  //   site: "https://fiken.no",
  //   description:
  //     "Integrasjonen gjør det enkelt å få tilgang til regnskapsdata fra Fiken, slik at du kan få en enda bedre innsikt i din eiendomsforvaltning.",
  // },
  // {
  //   slug: "signicat",
  //   description:
  //     "Signicat gjør det enkelt å sende dokumenter til kunder og motta signerte dokumenter fra kunder.",
  // },
  {
    slug: "brreg",
    description:
      "Integrasjonen henter bedriftsinformasjon, roller, regnskap og nøkkeltall direkte fra Brønnøysund registrene. Dette sikrer alltid oppdatert og korrekt selskapsinformasjon.",
  },
  {
    slug: "kartverket",
    description:
      "Integrasjonen gir tilgang til matrikkeldata, eiendomsinformasjon, grunnbok og kartdata fra Kartverket. Dette muliggjør nøyaktig eiendomsanalyse og verdivurdering.",
  },

  // Add more integrations as needed
]
