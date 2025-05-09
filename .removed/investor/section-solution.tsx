import Image from "next/image"
import Link from "next/link"
import overview from "./overview.png"

export function SectionSolution() {
  return (
    <section className="relative w-full bg-warm-white py-24 text-warm-grey md:py-32 dark:bg-warm-grey dark:text-warm-white">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">03</span>
            <h2 className="text-xl font-medium tracking-tight">Løsningen</h2>
          </div>
          <Link
            href="/"
            className="text-warm-grey-2 transition-colors hover:text-warm-grey-1"
          >
            propdock.no
          </Link>
        </div>

        <div className="space-y-16">
          {/* Top Section: Solution Statement and Image */}
          <div className="grid gap-12 md:grid-cols-2">
            {/* Main Solution Statement */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-warm-grey-2">
                    Introduserer
                  </p>
                  <h3 className="text-3xl font-medium leading-tight md:text-4xl">
                    En avansert analyseplattform skreddersydd for næringseiendom
                    i Norge
                  </h3>
                </div>
                <p className="text-lg text-warm-grey-1 dark:text-warm-grey-1">
                  Propdock er den første helhetlige plattformen som kombinerer
                  sanntidsdata, automatisert analyse og AI for å gi
                  eiendomsinvestorer presise beslutningsgrunnlag.
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-warm-grey-2/5 p-6">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-medium">85%</p>
                      <span className="text-warm-grey-2">↑</span>
                    </div>
                    <p className="text-sm text-warm-grey-1">
                      Raskere analysetid sammenlignet med tradisjonelle metoder
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-warm-grey-2/5 p-6">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-medium">2.5x</p>
                      <span className="text-warm-grey-2">↗</span>
                    </div>
                    <p className="text-sm text-warm-grey-1">
                      Mer nøyaktige verdivurderinger med vår Propdock modell
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Value Props */}
              <div className="space-y-4 rounded-2xl bg-warm-grey-2/5 p-6">
                <h4 className="font-medium">Nøkkelfunksjoner:</h4>
                <ul className="space-y-3 text-sm text-warm-grey-1">
                  <li className="flex items-center gap-2">
                    <span className="text-warm-grey-2">⦿</span>
                    Sanntids markedsdata og automatiske oppdateringer
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-warm-grey-2">⦿</span>
                    Avanserte Propdock-modeller for prediksjon og analyse
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-warm-grey-2">⦿</span>
                    Integrert porteføljeovervåking og rapportering
                  </li>
                </ul>
              </div>
            </div>

            {/* Solution Overview Image */}
            <div className="relative flex items-start justify-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-warm-grey-2/10">
                <Image
                  src={overview}
                  alt="Propdock platform overview showing real-time analytics dashboard"
                  fill
                  className="object-cover object-center"
                  quality={100}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-grey/90 via-warm-grey/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="space-y-4">
                    <p className="text-lg font-medium text-warm-white">
                      Sanntids markedsanalyse og AI-drevet innsikt
                    </p>
                    <div className="flex gap-3">
                      <span className="rounded-full bg-warm-white/10 px-3 py-1 text-sm text-warm-white backdrop-blur-sm">
                        Direkte API-tilkobling
                      </span>
                      <span className="rounded-full bg-warm-white/10 px-3 py-1 text-sm text-warm-white backdrop-blur-sm">
                        Automatiske varsler
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Feature Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group space-y-4 rounded-2xl bg-warm-grey-2/5 p-6 transition-colors hover:bg-warm-grey-2/10">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Markedsdata</h4>
                <span className="text-warm-grey-2">→</span>
              </div>
              <p className="text-sm text-warm-grey-1">
                Direkte tilgang til oppdaterte data om transaksjoner, leiepriser
                og markedstrender for presise verdivurderinger.
              </p>
            </div>

            <div className="group space-y-4 rounded-2xl bg-warm-grey-2/5 p-6 transition-colors hover:bg-warm-grey-2/10">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Finansanalyse</h4>
                <span className="text-warm-grey-2">→</span>
              </div>
              <p className="text-sm text-warm-grey-1">
                Automatisk beregning av nøkkeltall, yield, kontantstrøm og ROI
                basert på sanntidsdata.
              </p>
            </div>

            <div className="group space-y-4 rounded-2xl bg-warm-grey-2/5 p-6 transition-colors hover:bg-warm-grey-2/10">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">AI Prediksjon</h4>
                <span className="text-warm-grey-2">→</span>
              </div>
              <p className="text-sm text-warm-grey-1">
                Prediktive modeller som identifiserer trender og muligheter før
                de blir synlige i markedet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
