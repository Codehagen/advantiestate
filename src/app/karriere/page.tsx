import { AnimatedGridPattern } from "@/components/ui/Animated-Grid-Background";
import { FadeContainer, FadeSpan } from "@/components/ui/Fade";
import { constructMetadata } from "@/lib/utils";
import TeamGallery from "@/components/ui/TeamGallery"; // Added for potential use
// We might need a CTA component here later, e.g., for job applications
// import CallToActionButton from "@/components/ui/CallToActionButton";

export const metadata = constructMetadata({
  title: "Karriere hos Advanti | Bli en del av vårt team i Nord-Norge",
  description:
    "Utforsk karrieremuligheter hos Advanti. Vi ser etter engasjerte talenter som vil forme fremtidens næringseiendom i Nord-Norge. Søk i dag!",
});

export default function KarrierePage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section aria-label="hero">
        <FadeContainer className="relative mx-auto flex max-w-6xl flex-col items-center justify-center">
          <h1 className="mt-8 text-center text-5xl font-semibold tracking-tighter text-warm-grey sm:text-8xl sm:leading-[5.5rem] dark:text-warm-white">
            <FadeSpan>Skap din</FadeSpan>
            <br />
            <FadeSpan>
              <span className="bg-gradient-to-r from-warm-grey via-warm-grey-2 to-warm-grey bg-clip-text text-transparent dark:from-warm-white dark:via-warm-grey-1 dark:to-warm-white">
                karriere
              </span>
            </FadeSpan>{" "}
            <FadeSpan>hos Advanti</FadeSpan>
          </h1>
          <p className="mt-5 max-w-xl text-balance text-center text-base text-warm-grey-2 sm:mt-8 sm:text-xl">
            <FadeSpan>
              Bli med på laget hos en ledende aktør innen næringseiendom i
            </FadeSpan>{" "}
            <FadeSpan>
              Nord-Norge. Vi tilbyr spennende utfordringer og et dynamisk
            </FadeSpan>{" "}
            <FadeSpan>arbeidsmiljø hvor du kan vokse og utvikle deg.</FadeSpan>
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

      {/* Placeholder for future content sections */}
      <section className="mx-auto mt-24 w-full max-w-6xl py-12">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-warm-grey dark:text-warm-white">
            Hvorfor Velge Advanti?
          </h2>
          <p className="mt-4 text-lg text-warm-grey-2 dark:text-warm-grey-1">
            Vi er et team dedikert til faglig dyktighet, innovasjon og å skape
            verdi for våre kunder og samfunnet i Nord-Norge. Hos oss får du:
          </p>
          {/* TODO: Add bullet points or feature cards for benefits */}
          <ul className="mt-6 list-inside list-disc space-y-2 text-left sm:mx-auto sm:max-w-md">
            <li>Spennende og varierte arbeidsoppgaver</li>
            <li>Store muligheter for faglig og personlig utvikling</li>
            <li>Et inkluderende og støttende arbeidsmiljø</li>
            <li>Konkurransedyktige betingelser</li>
            <li>Muligheten til å påvirke utviklingen i regionen</li>
          </ul>
        </div>
      </section>

      {/* <TeamGallery /> */}

      <section className="mx-auto mt-12 w-full max-w-6xl py-12">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-warm-grey dark:text-warm-white">
            Ledige Stillinger
          </h2>
          <p className="mt-4 text-lg text-warm-grey-2 dark:text-warm-grey-1">
            Vi har for øyeblikket ingen konkrete utlysninger, men vi er alltid
            interessert i å komme i kontakt med dyktige personer.
          </p>
          {/* TODO: Add link to contact page or email for open applications */}
          <div className="mt-8">
            <a
              href="/kontakt" // Or mailto:karriere@advanti.no
              className="inline-flex items-center justify-center rounded-md bg-tremor-brand px-6 py-3 text-base font-medium text-tremor-brand-inverted shadow-sm hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:hover:bg-dark-tremor-brand-emphasis"
            >
              Send Åpen Søknad
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
