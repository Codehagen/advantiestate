"use client"
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation"
import { RiArrowRightLine } from "@remixicon/react"
import Image from "next/image"
import { useState } from "react"

interface Feature {
  id: string
  title: string
  description: string
  keyPoints: string[]
  preview: string
  demoData?: {
    title: string
    data: any // Replace with actual chart data type
  }
}

const features: Feature[] = [
  {
    id: "dcf",
    title: "DCF-Modellering",
    description:
      "Avansert verktøy for diskonterte kontantstrømanalyser som gir deg presise verdivurderinger basert på fremtidige kontantstrømmer.",
    keyPoints: [
      "Automatiske beregninger av nåverdi",
      "Fleksible prognoser og scenarioer",
      "Integrert sensitivitetsanalyse",
      "Tilpassbare diskonteringsrater",
    ],
    preview: "/images/features/dcf-preview.webp",
  },
  {
    id: "yield",
    title: "Yield-Beregning",
    description:
      "Presis yield-analyse basert på oppdaterte markedsdata og eiendommens spesifikke egenskaper.",
    keyPoints: [
      "Automatisk yield-beregning",
      "Markedsbaserte sammenligninger",
      "Historisk yield-utvikling",
      "Segmentspesifikke analyser",
    ],
    preview: "/images/features/yield-preview.webp",
  },
  {
    id: "sensitivity",
    title: "Sensitivitetsanalyse",
    description:
      "Omfattende verktøy for å analysere hvordan ulike faktorer påvirker eiendommens verdi.",
    keyPoints: [
      "Monte Carlo-simuleringer",
      "Scenarioanalyse",
      "Parameteroptimalisering",
      "Risikokartlegging",
    ],
    preview: "/images/features/sensitivity-preview.webp",
  },
  {
    id: "tenant",
    title: "Leietakeranalyse",
    description:
      "Detaljert analyse av leietakermiks, kontrakter og inntektspotensial.",
    keyPoints: [
      "Kontraktsanalyse",
      "Leietakermiks-optimalisering",
      "Inntektsprognoser",
      "Kredittrating-integrasjon",
    ],
    preview: "/images/features/tenant-preview.webp",
  },
]

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(features[0])

  return (
    <div className="w-full">
      <TabNavigation>
        {features.map((feature) => (
          <TabNavigationLink
            key={feature.id}
            onClick={() => setActiveFeature(feature)}
            data-active={activeFeature.id === feature.id}
          >
            {feature.title}
          </TabNavigationLink>
        ))}
      </TabNavigation>

      <div className="mt-6 animate-slide-up-fade">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col space-y-6">
            <h3 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
              {activeFeature.title}
            </h3>
            <p className="text-lg text-warm-grey-2 dark:text-warm-grey-1">
              {activeFeature.description}
            </p>
            <ul className="space-y-3">
              {activeFeature.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 text-warm-grey-2 dark:text-warm-grey-1"
                >
                  <RiArrowRightLine className="h-5 w-5 text-warm-grey dark:text-warm-white" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5">
            {activeFeature.preview && (
              <Image
                src={activeFeature.preview}
                alt={activeFeature.title}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
