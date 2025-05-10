import ContactUsForm from "@/components/ContactUsForm";
import EarlyAccessCta from "@/components/ui/EarlyAccessCta";
import TeamSection from "@/components/ui/TeamSection";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Kontakt Oss | Advanti",
  description:
    "Ta kontakt med Advanti for en uforpliktende samtale om dine behov innen næringseiendom. Vi hjelper deg med kjøp, salg, utleie og rådgivning.",
});

export default function KontaktPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      <section className="py-16 mt-12 md:mt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-warm-grey sm:text-4xl dark:text-warm-white">
            Send Oss Din Henvendelse
          </h2>
          <p className="mt-4 text-lg leading-8 text-warm-grey-2 dark:text-warm-grey-1">
            Har du spørsmål, ønsker et tilbud, eller vil diskutere dine behov
            innen næringseiendom? Fyll ut skjemaet, så tar vi kontakt med deg
            snarest.
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
