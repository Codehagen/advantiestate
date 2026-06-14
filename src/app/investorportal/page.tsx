import { allPersonPosts } from "content-collections";

import { constructMetadata } from "@/lib/utils";

import { InvestorPortalClient } from "./InvestorPortalClient";

export const metadata = constructMetadata({
  path: "/investorportal",
  title: "Investorportal — datarom og off-market-tilgang | Advanti Estate",
  description:
    "Investorportalen samler datarom, NDA-er, dokumenter og off-market-treff på ett sted. Prøv demoen, eller be om tilgang som kvalifisert kjøper.",
});

export default function InvestorportalPage() {
  const megler = allPersonPosts.find((p) => p.slug === "christer-hagen");

  return (
    <InvestorPortalClient
      megler={{
        name: megler?.name ?? "Christer Hagen",
        role: megler?.role ?? "Partner - Næringsmegler",
        avatar: megler?.avatar ?? "",
        email: megler?.email ?? "Christer@advantiestate.no",
        phone: megler?.phone ?? "+47 984 53 571",
      }}
    />
  );
}
