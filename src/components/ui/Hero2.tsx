import { RiArrowRightUpLine } from "@remixicon/react";
import { AnimatedGridPattern } from "./Animated-Grid-Background";
import { FadeContainer, FadeDiv, FadeSpan } from "./Fade";

export function Hero2() {
  return (
    <section aria-label="hero" className="pt-60">
      <FadeContainer className="relative flex flex-col items-center justify-center">
        <FadeDiv className="mx-auto">
          <a
            aria-label="Utforsk Advanti"
            href="/tjenester"
            className="mx-auto w-full"
          >
            <div className="focus:outline-hidden inline-flex max-w-full items-center gap-3 rounded-lg border border-warm-grey/20 bg-light-blue-1/50 px-2.5 py-0.5 pl-0.5 pr-3 font-medium text-warm-grey shadow-lg shadow-light-blue/20 filter backdrop-blur-[1px] transition-colors hover:bg-light-blue/[2.5%] sm:text-sm dark:border-warm-white/30 dark:bg-light-blue/20">
              <span className="shrink-0 truncate bg-gradient-to-b from-warm-grey to-warm-grey-2 bg-clip-text px-2.5 py-1 text-sm font-semibold uppercase tracking-tighter text-transparent sm:text-xs dark:from-warm-white dark:to-warm-grey-1">
                Advanti
              </span>
              <span className="flex items-center gap-1 truncate">
                <span className="w-full truncate bg-gradient-to-b from-warm-grey-2 to-warm-grey-3 bg-clip-text text-transparent dark:from-warm-grey-1 dark:to-warm-grey-2">
                  Din ledende næringsmegler
                </span>
                <RiArrowRightUpLine className="size-4 shrink-0 text-warm-grey-2" />
              </span>
            </div>
          </a>
        </FadeDiv>
        <h1 className="mt-8 text-center text-5xl font-semibold tracking-tighter text-warm-grey sm:text-8xl sm:leading-[5.5rem] dark:text-warm-white">
          <FadeSpan>Din ledende</FadeSpan> <FadeSpan>næringsmegler i</FadeSpan>
          <br />
          <FadeSpan>Nord-Norge</FadeSpan>
        </h1>
        <p className="mt-5 max-w-xl text-balance text-center text-base text-warm-grey-2 sm:mt-8 sm:text-xl">
          <FadeSpan>Advanti er din ekspertise med spisskompetanse</FadeSpan>{" "}
          <FadeSpan>innen kjøp, salg og utleie av</FadeSpan>{" "}
          <FadeSpan>næringseiendommer.</FadeSpan>
        </p>
        <FadeDiv>
          <a
            className="mt-6 inline-flex cursor-pointer flex-row items-center justify-center gap-1 whitespace-nowrap rounded-md bg-warm-grey px-5 py-3 font-medium leading-4 tracking-wide text-warm-white shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(255,255,255,0.19)] transition-all duration-200 ease-in-out hover:bg-warm-grey-3 hover:shadow-light-blue/30"
            href="/om-oss"
          >
            Om oss
          </a>
        </FadeDiv>

        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
          {/* Top fade gradient */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-warm-white via-warm-white/80 to-transparent dark:from-warm-grey dark:via-warm-grey/80" />

          <AnimatedGridPattern
            width={50}
            height={50}
            className="-mt-24 scale-125 text-light-blue/20"
            maxOpacity={0.3}
            numSquares={30}
            duration={3}
          />

          {/* Bottom fade gradient */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-warm-white via-warm-white/80 to-transparent dark:from-warm-grey dark:via-warm-grey/80" />
        </div>
      </FadeContainer>
    </section>
  );
}
