// The six top-level service pages, with the one-line description each is
// summarised by. Shared so that llms.txt and the markdown representation of
// each page describe the same service the same way — they used to be a
// hand-maintained list inside the llms.txt route, which meant a second consumer
// could only get them by copying.

export type ServicePage = {
  path: string;
  title: string;
  description: string;
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    path: "/tjenester/salg",
    title: "Salg av næringseiendom",
    description:
      "Salgsprosess fra verdivurdering til oppgjør. Åpen eller diskré markedsføring; resultatbasert honorar.",
  },
  {
    path: "/tjenester/utleie",
    title: "Utleie av næringseiendom",
    description:
      "Utleie av kontor, butikk og lager. Leietakerstrategi, markedsføring og kontraktsforhandling.",
  },
  {
    path: "/tjenester/verdivurdering",
    title: "Verdivurdering",
    description:
      "DCF-analyse, yield-beregning og markedsbaserte verdivurderinger av næringseiendom.",
  },
  {
    path: "/tjenester/radgivning",
    title: "Rådgivning",
    description:
      "Strategisk og transaksjonsrettet rådgivning for eiere og investorer i næringseiendom.",
  },
  {
    path: "/tjenester/transaksjoner",
    title: "Transaksjoner",
    description:
      "Due diligence, forhandling og strukturering av eiendomstransaksjoner.",
  },
  {
    path: "/tjenester/strategisk-radgivning",
    title: "Strategisk rådgivning",
    description:
      "Porteføljestrategi, exit-planlegging og langsiktig posisjonering i eiendomsmarkedet.",
  },
];
