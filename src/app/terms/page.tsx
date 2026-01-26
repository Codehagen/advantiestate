import { allLegalPosts } from "content-collections";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "@/components/blog/legal";
import { constructMetadata } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Vilkår for bruk – Advanti",
    description:
      "Les vilkårene for bruk av Advantis tjenester innen salg, verdivurdering, utleie og rådgivning av næringseiendom.",
    canonical: "/terms",
  });
}

export default async function TermsPage() {
  const post = allLegalPosts.find((post) => post.slug === "terms");
  
  if (!post) {
    notFound();
  }

  return <LegalPage post={post} />;
}
