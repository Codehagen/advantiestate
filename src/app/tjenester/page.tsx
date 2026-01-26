import { AnimatedGridPattern } from "@/components/ui/Animated-Grid-Background";
import { FadeContainer, FadeSpan } from "@/components/ui/Fade";
import { constructMetadata } from "@/lib/utils";
import { ConsultationCTAButton, ValuationCTAButton } from "@/components/CTAButtons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Accordion";
import {
  RiBarChartBoxLine,
  RiDatabaseLine,
  RiLineChartLine,
  RiPieChartLine,
  RiShieldCheckLine,
  RiUserStarLine,
  RiBuildingLine,
  RiArrowRightLine,
} from "@remixicon/react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Salg og Verdivurdering av Næringseiendom - Tjenester | Advanti",
  description:
    "Profesjonell salg og verdivurdering av næringseiendom i Nord-Norge. Vi tilbyr også utleie, transaksjoner og strategisk rådgivning for eiendomsbesittere.",
});

export default function TjenesterPage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section aria-label="hero">
        <FadeContainer className="relative mx-auto flex max-w-6xl flex-col items-center justify-center">
          <h1 className="mt-8 text-center text-5xl font-semibold tracking-tighter text-warm-grey sm:text-8xl sm:leading-[5.5rem] dark:text-warm-white">
            <FadeSpan>Salg og Verdivurdering</FadeSpan>{" "}
            <FadeSpan>av Næringseiendom</FadeSpan>
            <br />
            <FadeSpan>i Nord-Norge</FadeSpan>
          </h1>

          <p className="mt-5 max-w-xl text-balance text-center text-base text-warm-grey-2 sm:mt-8 sm:text-xl">
            <FadeSpan>
              Vi hjelper eiendomsbesittere med salg, verdivurdering,
            </FadeSpan>{" "}
            <FadeSpan>utleie og strategisk rådgivning. Lokal ekspertise</FadeSpan>{" "}
            <FadeSpan>for å sikre deg det beste resultatet.</FadeSpan>
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <FadeSpan>
              <ConsultationCTAButton className="h-12 px-8 text-lg" />
            </FadeSpan>
            <FadeSpan>
              <Link
                href="#tjenester"
                className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-warm-grey-2 transition-colors hover:text-warm-grey dark:text-warm-grey-1 dark:hover:text-warm-white"
              >
                Se tjenester
                <RiArrowRightLine className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeSpan>
          </div>

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

      <section className="mx-auto mt-24 w-full max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 py-8 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 sm:gap-16">
          <div className="flex items-center gap-2">
            <RiShieldCheckLine className="size-5 text-warm-grey dark:text-warm-white" />
            <span className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
              Lokal markedsleder
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RiUserStarLine className="size-5 text-warm-grey dark:text-warm-white" />
            <span className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
              Erfarne rådgivere
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RiBuildingLine className="size-5 text-warm-grey dark:text-warm-white" />
            <span className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
              Ekspertise i Nord-Norge
            </span>
          </div>
        </div>
      </section>

      <section id="tjenester" className="mx-auto mt-24 w-full max-w-6xl">
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

      <section className="mx-auto mt-40 w-full max-w-5xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-warm-grey sm:text-4xl dark:text-warm-white">
            Hvordan vi jobber
          </h2>
          <p className="mt-4 text-warm-grey-2 dark:text-warm-grey-1">
            En strukturert prosess sikrer forutsigbarhet og maksimerer verdien
            av din eiendom.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Connection line for desktop */}
          <div className="absolute left-0 top-12 hidden h-0.5 w-full bg-warm-grey/10 md:block dark:bg-warm-white/10" />

          {processSteps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <div className="z-10 flex size-24 items-center justify-center rounded-full bg-warm-white ring-8 ring-warm-white dark:bg-warm-grey dark:ring-warm-grey">
                <div className="flex size-16 items-center justify-center rounded-full bg-warm-grey text-warm-white dark:bg-warm-white dark:text-warm-grey">
                  <step.icon className="size-8" />
                </div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-warm-grey dark:text-warm-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-grey-2 dark:text-warm-grey-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-40 w-full max-w-3xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-warm-grey sm:text-4xl dark:text-warm-white">
            Ofte stilte spørsmål
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium text-warm-grey dark:text-warm-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-warm-grey-2 dark:text-warm-grey-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto mb-32 mt-40 w-full max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-warm-grey p-8 md:p-16 dark:bg-warm-grey-3">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-warm-white sm:text-5xl">
              Klar for å realisere verdiene i din eiendom?
            </h2>
            <p className="mt-6 max-w-xl text-lg text-warm-grey-1">
              Kontakt oss for en uforpliktende prat om dine muligheter i dagens
              marked.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <ConsultationCTAButton className="h-12 bg-warm-white px-8 text-lg text-warm-grey hover:bg-warm-white/90" />
              <ValuationCTAButton
                variant="ghost"
                className="h-12 px-8 text-lg text-warm-white hover:bg-warm-white/10"
              />
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-light-blue/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-light-blue/5 blur-3xl" />
        </div>
      </section>
    </div>
  );
}

const faqs = [
  {
    question: "Hva koster en verdivurdering?",
    answer:
      "Vi tilbyr en gratis og uforpliktende førstegangsverdsettelse for eiendomsbesittere i Nord-Norge. For mer omfattende rapporter til bank eller regnskap, avtaler vi pris basert på oppdragets kompleksitet.",
  },
  {
    question: "Hvor lang tid tar en salgsprosess?",
    answer:
      "En typisk salgsprosess for næringseiendom tar normalt mellom 3 til 6 måneder fra oppstart til signert avtale, avhengig av eiendomstype, beliggenhet og markedsforhold.",
  },
  {
    question: "Hvilke områder dekker dere?",
    answer:
      "Vårt hovedfokus er Nordland og Troms, med spesielt god kjennskap til markedene i Bodø, Mo i Rana, Narvik og Tromsø. Vi tar også oppdrag i resten av Nord-Norge.",
  },
  {
    question: "Bistår dere med utleie av alle typer lokaler?",
    answer:
      "Ja, vi har erfaring med utleie av kontorlokaler, butikklokaler, lager og logistikkbygg, samt kombinasjonseiendommer.",
  },
];

const processSteps = [
  {
    title: "Analyse & Strategi",
    description:
      "Vi starter med en grundig verdivurdering og markedsanalyse for å legge den optimale strategien.",
    icon: RiLineChartLine,
  },
  {
    title: "Markedsføring",
    description:
      "Gjennom målrettet annonsering og vårt brede nettverk når vi de rette investorene og leietakerne.",
    icon: RiDatabaseLine,
  },
  {
    title: "Gjennomføring",
    description:
      "Vi håndterer forhandlinger, due diligence og dokumentasjon frem til signering og overtakelse.",
    icon: RiShieldCheckLine,
  },
];

const mainFeatures = [
  {
    title: "Transaksjoner",
    description:
      "Ekspertise gjennom hele transaksjonsprosessen, fra verdivurdering til overtakelse.",
    icon: RiBarChartBoxLine,
    href: "/tjenester/transaksjoner",
  },
  {
    title: "Utleie",
    description:
      "Effektiv utleieformidling og rådgivning for kontor, handel og logistikk.",
    icon: RiDatabaseLine,
    href: "/tjenester/utleie",
  },
  {
    title: "Verdivurdering",
    description:
      "Grundige verdivurderinger og markedsanalyser gir et solid beslutningsgrunnlag.",
    icon: RiLineChartLine,
    href: "/tjenester/verdivurdering",
  },
  {
    title: "Rådgivning",
    description:
      "Verdioptimaliserende råd for å sikre størst mulig avkastning på investert kapital.",
    icon: RiPieChartLine,
    href: "/tjenester/radgivning",
  },
];
