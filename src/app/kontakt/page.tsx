import ContactUsForm from "@/components/ContactUsForm";
import EarlyAccessCta from "@/components/ui/EarlyAccessCta";
import TeamSection from "@/components/ui/TeamSection";
import { constructMetadata } from "@/lib/utils";

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
          <h2 className="text-3xl font-bold tracking-tight text-warm-grey sm:text-4xl dark:text-warm-white">
            Få Hjelp med Salg eller Verdivurdering av Din Næringseiendom
          </h2>
          <p className="mt-4 text-lg leading-8 text-warm-grey-2 dark:text-warm-grey-1">
            Planlegger du salg eller trenger en verdivurdering? Fyll ut skjemaet,
            så tar vi kontakt med deg for en uforpliktende samtale om hvordan vi
            kan hjelpe deg oppnå best mulig resultat.
          </p>
        </div>
        <div className="mt-12">
          <ContactUsForm />
        </div>
      </section>
      <TeamSection />
      <EarlyAccessCta />
    </div>
  );
}
