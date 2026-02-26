import ContactUsForm from "@/components/ContactUsForm";
import EarlyAccessCta from "@/components/ui/EarlyAccessCta";
import TeamSection from "@/components/ui/TeamSection";
import { constructMetadata } from "@/lib/utils";
import {
  RiShieldCheckLine,
  RiUserStarLine,
  RiBuildingLine,
} from "@remixicon/react";

export const metadata = constructMetadata({
  title: "Kontakt Advanti for Salg og Verdivurdering av Næringseiendom",
  description:
    "Trenger du hjelp med salg eller verdivurdering av næringseiendom i Nord-Norge? Kontakt Advanti for en uforpliktende samtale. Vi hjelper eiendomsbesittere med å oppnå best mulig resultat.",
});

export default function KontaktPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      <section className="py-16 mt-12 md:mt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-warm-grey sm:text-4xl dark:text-warm-white">
            Få Hjelp med Salg eller Verdivurdering av Din Næringseiendom
          </h1>
          <p className="mt-4 text-lg leading-8 text-warm-grey-2 dark:text-warm-grey-1">
            Planlegger du salg eller trenger en verdivurdering? Fyll ut
            skjemaet, så tar vi kontakt med deg innen 24 timer for en
            uforpliktende samtale om hvordan vi kan hjelpe deg oppnå best mulig
            resultat.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-warm-grey-2 dark:text-warm-grey-1">
            <div className="flex items-center gap-2">
              <RiShieldCheckLine className="size-4 text-warm-grey dark:text-warm-white" />
              <span>Lokal ekspertise i Nord-Norge</span>
            </div>
            <div className="flex items-center gap-2">
              <RiUserStarLine className="size-4 text-warm-grey dark:text-warm-white" />
              <span>Erfarne rådgivere</span>
            </div>
            <div className="flex items-center gap-2">
              <RiBuildingLine className="size-4 text-warm-grey dark:text-warm-white" />
              <span>Uforpliktende samtale</span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 text-left sm:grid-cols-2">
            <div className="rounded-xl bg-warm-grey/5 p-6 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
              <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                Kontor Bodø
              </h3>
              <address className="mt-3 not-italic text-sm text-warm-grey-2 dark:text-warm-grey-1">
                <p className="font-medium text-warm-grey dark:text-warm-white">
                  Dronningens gate 18
                </p>
                <p>8006 Bodø</p>
              </address>
              <div className="mt-3 space-y-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                <a
                  href="tel:+4798453571"
                  className="block font-medium text-warm-grey hover:text-warm-grey-3 dark:text-warm-white"
                >
                  +47 984 53 571
                </a>
                <a
                  href="mailto:Christer@advanti.no"
                  className="block text-warm-grey-2 hover:text-warm-grey-3 dark:text-warm-grey-1"
                >
                  Christer@advanti.no
                </a>
              </div>
            </div>

            <div className="rounded-xl bg-warm-grey/5 p-6 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
              <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
                Kontor Alta
              </h3>
              <address className="mt-3 not-italic text-sm text-warm-grey-2 dark:text-warm-grey-1">
                <p className="font-medium text-warm-grey dark:text-warm-white">
                  AMFI Alta, Markedsgata 21/25
                </p>
                <p>9510 Alta</p>
              </address>
              <div className="mt-3 space-y-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                <a
                  href="tel:+4798038737"
                  className="block font-medium text-warm-grey hover:text-warm-grey-3 dark:text-warm-white"
                >
                  +47 980 38 737
                </a>
                <a
                  href="mailto:Havard@advanti.no"
                  className="block text-warm-grey-2 hover:text-warm-grey-3 dark:text-warm-grey-1"
                >
                  Havard@advanti.no
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ContactUsForm />
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <div className="rounded-xl bg-warm-grey/5 p-8 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
            <h3 className="text-xl font-semibold text-warm-grey dark:text-warm-white mb-6">
              Hva skjer videre?
            </h3>
            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm-grey text-warm-white dark:bg-warm-white dark:text-warm-grey mt-0.5">
                    <span className="text-xs font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-warm-grey dark:text-warm-white">
                      {step.title}
                    </h4>
                    <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-16 w-full max-w-6xl px-4">
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
      </div>

      <TeamSection />
      <EarlyAccessCta />
    </div>
  );
}

const nextSteps = [
  {
    title: "Du sender inn henvendelsen",
    description:
      "Fyll ut skjemaet med dine opplysninger og hvilken tjeneste du er interessert i.",
  },
  {
    title: "Vi tar kontakt",
    description:
      "Vi kontakter deg innen 24 timer for en kort, uforpliktende avklaring av dine behov.",
  },
  {
    title: "Vi lager et forslag",
    description:
      "Basert på din situasjon lager vi et skreddersydd forslag for hvordan vi kan hjelpe deg.",
  },
];
