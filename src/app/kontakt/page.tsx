import EarlyAccessCta from "@/components/ui/EarlyAccessCta";
import TeamSection from "@/components/ui/TeamSection";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Kontakt oss | Propdock",
  description:
    "Ta kontakt med oss for å lære mer om hvordan Propdock kan hjelpe deg med verdsettelse og analyse av næringseiendom.",
});

export default function KontaktPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Early Access CTA Section at the top */}
      <div className="mt-12">
        <EarlyAccessCta />
      </div>
      <TeamSection />
    </div>
  );
}
