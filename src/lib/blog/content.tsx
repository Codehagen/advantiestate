// import { Logo } from "#/ui/icons";
import {
  RiBarChartBoxLine,
  RiBuilding4Line,
  RiBuildingLine,
  RiFileChartLine,
  RiSettings4Line,
  RiTeamLine,
} from "@remixicon/react";
import { allHelpPosts } from "content-collections";

export const BLOG_CATEGORIES = [
  {
    title: "Om Advanti",
    slug: "company",
    description:
      "Siste oppdateringer og nyheter fra Advanti. Lær om vårt firma og teamet bak.",
  },
  {
    title: "Verdivurdering",
    slug: "valuation",
    description:
      "Metoder og innsikt for verdivurdering av næringseiendom, inkludert DCF-modeller og sensitivitetsanalyse.",
  },
  {
    title: "Markedsanalyse",
    slug: "market-analysis",
    description:
      "Dyptgående markedsanalyser og trender i det norske næringseiendomsmarkedet, med fokus på Nord-Norge.",
  },
  {
    title: "Kundehistorier",
    slug: "casestudies",
    description:
      "Suksesshistorier fra våre kunder – eiendomsbesittere, investorer og utviklere som har jobbet med Advanti.",
  },
];

export const POPULAR_ARTICLES = [
  "hva-er-propdock",
  "hva-er-yield",
  "netto-leieinntekter",
  "sensitivitetsanalyse",
];

export const HELP_CATEGORIES: {
  title: string;
  slug:
    | "overview"
    | "getting-started"
    | "terms"
    | "for-investors"
    | "analysis"
    | "valuation";
  description: string;
  icon: JSX.Element;
}[] = [
  {
    title: "Om Advanti",
    slug: "overview",
    description:
      "Advanti er din ekspertpartner for rådgivning innen næringseiendom i Nord-Norge.",
    icon: <RiBuilding4Line className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Kom i gang",
    slug: "getting-started",
    description:
      "Veiledninger for å komme i gang med våre tjenester innen verdivurdering, salg, utleie og rådgivning.",
    icon: <RiBarChartBoxLine className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Begreper",
    slug: "terms",
    description:
      "Lær om viktige begreper og terminologi innen næringseiendom og analyse.",
    icon: <RiBuildingLine className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "For Investorer",
    slug: "for-investors",
    description:
      "Spesialisert rådgivning og analyse for investeringsbeslutninger og porteføljestrategi.",
    icon: <RiFileChartLine className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Markedsanalyse",
    slug: "analysis",
    description:
      "Lær hvordan du bruker markedsdata og trender for bedre eiendomsbeslutninger med Advantis innsikt.",
    icon: <RiTeamLine className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Verdivurdering",
    slug: "valuation",
    description:
      "Forstå DCF-modeller, yield-analyser og andre metoder for verdivurdering av næringseiendom.",
    icon: <RiSettings4Line className="h-6 w-6 text-gray-500" />,
  },
];

export const getPopularArticles = () => {
  const popularArticles = POPULAR_ARTICLES.map((slug) => {
    const post = allHelpPosts.find((post) => post.slug === slug);
    if (!post) {
      console.warn(`Popular article with slug "${slug}" not found`);
    }
    return post;
  }).filter((post) => post != null);

  return popularArticles;
};
