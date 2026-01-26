import { allLegalPosts } from "content-collections";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "@/components/blog/legal";
import { constructMetadata } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Personvernpolicy – Advanti",
    description:
      "Les om hvordan Advanti samler inn, bruker og beskytter dine personopplysninger når du bruker våre tjenester for næringseiendom.",
    canonical: "/privacy",
  });
}

export default async function PrivacyPage() {
  const post = allLegalPosts.find((post) => post.slug === "privacy");
  
  if (!post) {
    notFound();
  }

  return <LegalPage post={post} />;
}
