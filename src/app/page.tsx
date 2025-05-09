import ContentSection from "@/components/ContentSection";
import AnalycitsDashboard from "@/components/ui/Analycits-dashboard";
import Cta from "@/components/ui/Cta";
import CtaMiddle from "@/components/ui/Cta-middle";
import FeatureDivider from "@/components/ui/FeatureDivider";
import Features2 from "@/components/ui/Features2";
import { Hero2 } from "@/components/ui/Hero2";
import LogoCloud from "@/components/ui/LogoCloud";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Advanti | Din ledende næringsmegler i Nord-Norge",
  description:
    "Advanti - Din ekspert innen kjøp, salg og utleie av næringseiendom i Nord-Norge. Få profesjonell rådgivning og lokal markedskunnskap.",
});

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Hero2 />
      <LogoCloud />
      <FeatureDivider />
      <AnalycitsDashboard />
      <CtaMiddle />
      <FeatureDivider />
      {/* <ContentSection /> */}
      <Features2 />
      <Cta />
    </main>
  );
}
