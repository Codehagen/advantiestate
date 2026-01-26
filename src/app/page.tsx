import ContentSection from "@/components/ContentSection";
import AnalycitsDashboard from "@/components/ui/Analycits-dashboard";
import Cta from "@/components/ui/Cta";
import CtaMiddle from "@/components/ui/Cta-middle";
import FeatureDivider from "@/components/ui/FeatureDivider";
import Features2 from "@/components/ui/Features2";
import { Hero2 } from "@/components/ui/Hero2";
import { HvaSkjerVidereBlock } from "@/components/ui/HvaSkjerVidereBlock";
import LogoCloud from "@/components/ui/LogoCloud";
import NewsletterSignup from "@/components/NewsletterSignup";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Salg og Verdivurdering av Næringseiendom i Nord-Norge | Advanti",
  description:
    "Din lokale ekspert på salg og verdivurdering av næringseiendom i Nord-Norge. Vi hjelper eiendomsbesittere med å oppnå best mulig pris og nøyaktige verdivurderinger. Kontakt oss for en uforpliktende samtale.",
});

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Hero2 />
      {/* <HvaSkjerVidereBlock /> */}
      {/* <LogoCloud /> */}
      <FeatureDivider />
      <CtaMiddle />
      {/* <AnalycitsDashboard /> */}
      <FeatureDivider />
      {/* <ContentSection /> */}
      <Features2 />

      {/* Newsletter Signup Section */}
      {/* <section className="mx-auto my-20 max-w-6xl px-4">
        <NewsletterSignup
          variant="card"
          title="Hold deg oppdatert"
          description="Få de nyeste markedsinnsiktene, verdivurderingstips og eksklusive analyser om næringseiendom i Nord-Norge direkte i innboksen din."
        />
      </section> */}

      <Cta />
    </main>
  );
}
