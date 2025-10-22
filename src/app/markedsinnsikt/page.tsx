import ChartMainPage from "@/components/markedsinnsikt/Chart-main-page"
import TopKpiCard from "@/components/markedsinnsikt/Top-kpi-card"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  title: "Markedsinnsikt for næringseiendom | Advanti",
  description:
    "Få tilgang til omfattende markedsdata og analyser for næringseiendom. Utforsk sanntids markedstrender og yield-analyser for smarte investeringer..",
})

export default function MarkedsinnsiktPage() {
  return (
    <main className="min-h-screen pt-32">
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="mb-8 scroll-m-20 text-4xl font-bold tracking-tight">
          Markedsinnsikt for næringseiendom
        </h1>
        <TopKpiCard />
        <ChartMainPage />
      </div>
    </main>
  )
}
