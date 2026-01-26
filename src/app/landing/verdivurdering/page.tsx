import { constructMetadata } from "@/lib/utils";
import { ValuationCTAButton } from "@/components/CTAButtons";
import { HvaSkjerVidereBlock } from "@/components/ui/HvaSkjerVidereBlock";
import { RiShieldCheckLine, RiUserStarLine, RiBuildingLine } from "@remixicon/react";

export const metadata = constructMetadata({
  title: "Uforpliktende Verdivurdering av Næringseiendom i Nord-Norge | Advanti",
  description:
    "Få en profesjonell verdivurdering av din næringseiendom basert på lokal markedsinnsikt i Nord-Norge. Vi svarer innen 24 timer. Uforpliktende samtale.",
});

export default function VerdivurderingLandingPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="mx-auto mt-20 max-w-4xl px-4 py-12 text-center sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tighter text-warm-grey sm:text-6xl dark:text-warm-white">
          Uforpliktende Verdivurdering av Næringseiendom
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
          Få en profesjonell verdivurdering basert på lokal markedsinnsikt i Nord-Norge. Vi
          kombinerer solid fagkompetanse med dybdekunnskap om markedet for å gi deg nøyaktige tall
          og et solid beslutningsgrunnlag.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-warm-grey-2 dark:text-warm-grey-1">
          <div className="flex items-center gap-2">
            <RiShieldCheckLine className="size-4 text-warm-grey dark:text-warm-white" />
            <span>Lokal ekspertise i Nord-Norge</span>
          </div>
          <div className="flex items-center gap-2">
            <RiUserStarLine className="size-4 text-warm-grey dark:text-warm-white" />
            <span>Svar innen 24 timer</span>
          </div>
          <div className="flex items-center gap-2">
            <RiBuildingLine className="size-4 text-warm-grey dark:text-warm-white" />
            <span>Uforpliktende samtale</span>
          </div>
        </div>
        <div className="mt-10">
          <ValuationCTAButton className="mx-auto" />
        </div>
      </section>

      {/* What's Included */}
      <section className="mx-auto mb-20 max-w-4xl px-4">
        <h2 className="mb-8 text-center text-3xl font-semibold text-warm-grey dark:text-warm-white">
          Hva inkluderer en verdivurdering?
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-warm-grey/5 p-6 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
            <h3 className="mb-3 text-xl font-semibold text-warm-grey dark:text-warm-white">
              Markedsanalyse
            </h3>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Omfattende analyse av lokale markedsforhold, sammenligning med lignende eiendommer
              og vurdering av trender i Nord-Norge.
            </p>
          </div>
          <div className="rounded-xl bg-warm-grey/5 p-6 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
            <h3 className="mb-3 text-xl font-semibold text-warm-grey dark:text-warm-white">
              Finansiell analyse
            </h3>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Detaljert analyse av leieinntekter, driftskostnader, kontantstrøm og avkastning med
              yield- eller DCF-metode.
            </p>
          </div>
          <div className="rounded-xl bg-warm-grey/5 p-6 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
            <h3 className="mb-3 text-xl font-semibold text-warm-grey dark:text-warm-white">
              Fysisk besiktigelse
            </h3>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Grundig gjennomgang av eiendommen for å vurdere tilstand, standard, lokasjon og
              potensial for forbedringer.
            </p>
          </div>
          <div className="rounded-xl bg-warm-grey/5 p-6 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
            <h3 className="mb-3 text-xl font-semibold text-warm-grey dark:text-warm-white">
              Detaljert rapport
            </h3>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Skriftlig rapport med konklusjon, begrunnelse for metoder, sammenligning med markedet
              og anbefalinger for verdimaksimering.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <HvaSkjerVidereBlock />

      {/* Why Choose Us */}
      <section className="mx-auto mb-20 max-w-4xl px-4">
        <h2 className="mb-8 text-center text-3xl font-semibold text-warm-grey dark:text-warm-white">
          Hvorfor velge Advanti?
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl bg-warm-grey/5 p-6 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
            <h3 className="mb-2 text-xl font-semibold text-warm-grey dark:text-warm-white">
              Lokal markedsinnsikt
            </h3>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Vi kjenner markedet i Nord-Norge. Lokale yieldnivåer, leietrender og
              utviklingspotensial er vår ekspertise.
            </p>
          </div>
          <div className="rounded-xl bg-warm-grey/5 p-6 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
            <h3 className="mb-2 text-xl font-semibold text-warm-grey dark:text-warm-white">
              Rask levering
            </h3>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Standard verdsettelse leveres på 1-2 uker. Med hastverk kan vi levere på 48 timer.
            </p>
          </div>
          <div className="rounded-xl bg-warm-grey/5 p-6 ring-1 ring-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/10">
            <h3 className="mb-2 text-xl font-semibold text-warm-grey dark:text-warm-white">
              Nøyaktighet
            </h3>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Våre verdsettelser har en nøyaktighet på ±2% av markedsverdi, dokumentert gjennom
              faktiske salg.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mb-20 max-w-2xl px-4 text-center">
        <div className="rounded-xl bg-gradient-to-br from-light-blue/20 to-warm-grey/10 p-8 ring-1 ring-warm-grey/10 dark:from-light-blue/10 dark:to-warm-grey/20 dark:ring-warm-white/10">
          <h2 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
            Klar for en uforpliktende verdivurdering?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-warm-grey-2 dark:text-warm-grey-1">
            Fyll ut skjemaet, så tar vi kontakt med deg innen 24 timer for en kort, uforpliktende
            avklaring av dine behov.
          </p>
          <div className="mt-6">
            <ValuationCTAButton className="mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
}
