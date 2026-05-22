import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  path: "/sjekkliste-verdivurdering",
  noIndex: true, // gated lead-capture page — not for the organic index
  title: "Gratis Sjekkliste: Forbered deg for Verdivurdering | Advanti",
  description:
    "Last ned vår gratis sjekkliste for å forberede deg for en profesjonell verdivurdering av din næringseiendom. Få innsikt i hva du trenger og hvordan du maksimerer verdien.",
});

export default function SjekklisteVerdiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
