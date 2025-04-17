// import { Logo } from "#/ui/icons";
import {
  RiBarChartBoxLine,
  RiBuilding4Line,
  RiBuildingLine,
  RiFileChartLine,
  RiSettings4Line,
  RiTeamLine,
} from "@remixicon/react"
import { allHelpPosts } from "content-collections"

export const BLOG_CATEGORIES = [
  {
    title: "Selskapet",
    slug: "company",
    description:
      "Siste oppdateringer og nyheter fra Propdock. Lær om vår plattform og teamet bak.",
  },
  {
    title: "Verdivurdering",
    slug: "valuation",
    description:
      "Avanserte verktøy for verdivurdering av næringseiendom, inkludert DCF-modeller og sensitivitetsanalyse.",
  },
  {
    title: "Markedsanalyse",
    slug: "market-analysis",
    description:
      "Dyptgående markedsanalyser og trender i det norske næringseiendomsmarkedet.",
  },
  {
    title: "Kundehistorier",
    slug: "casestudies",
    description:
      "Suksesshistorier fra eiendomsforvaltere og investorer som bruker Propdock.",
  },
]

export const POPULAR_ARTICLES = [
  "hva-er-propdock",
  "hva-er-yield",
  "netto-leieinntekter",
  "sensitivitetsanalyse",
]

export const HELP_CATEGORIES: {
  title: string
  slug:
    | "overview"
    | "getting-started"
    | "terms"
    | "for-investors"
    | "analysis"
    | "valuation"
  description: string
  icon: JSX.Element
}[] = [
  {
    title: "Plattformoversikt",
    slug: "overview",
    description:
      "Propdock er en avansert analyseplattform for verdsettelser av næringseiendom.",
    icon: <RiBuilding4Line className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Kom i gang",
    slug: "getting-started",
    description:
      "Veiledninger for å komme i gang med verdivurdering og porteføljeanalyse.",
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
      "Avanserte analyseverktøy for investeringsbeslutninger og scenariomodellering.",
    icon: <RiFileChartLine className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Markedsanalyse",
    slug: "analysis",
    description:
      "Lær hvordan du bruker markedsdata og trender for bedre investeringsbeslutninger.",
    icon: <RiTeamLine className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Verdivurdering",
    slug: "valuation",
    description:
      "Forstå DCF-modeller, yield-analyser og andre verktøy for verdivurdering.",
    icon: <RiSettings4Line className="h-6 w-6 text-gray-500" />,
  },
]

export const getPopularArticles = () => {
  const popularArticles = POPULAR_ARTICLES.map((slug) => {
    const post = allHelpPosts.find((post) => post.slug === slug)
    if (!post) {
      console.warn(`Popular article with slug "${slug}" not found`)
    }
    return post
  }).filter((post) => post != null)

  return popularArticles
}
