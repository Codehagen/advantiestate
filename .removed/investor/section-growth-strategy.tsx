import Link from "next/link"

// Growth milestones
const growthMilestones = [
  {
    phase: "Fase 1: Etablering",
    timeframe: "2024-2025",
    goals: [
      "Lansere produktet med alle kjernefunksjoner",
      "Oppnå 50 betalende brukere",
      "Etablere partnerskap med 3 ledende næringseiendomsfirmaer",
      "Validere produkt-marked fit",
    ],
  },
  {
    phase: "Fase 2: Vekst",
    timeframe: "2025-2026",
    goals: [
      "Utvide teamet med nøkkelkompetanse",
      "Nå 200 betalende brukere",
      "Lansere enterprise-tilbud",
      "Utvide til flere regioner i Norge",
    ],
  },
  {
    phase: "Fase 3: Skalering",
    timeframe: "2026-2027",
    goals: [
      "Nå over 500 betalende brukere",
      "Ekspandere til utvalgte nordiske markeder",
      "Introdusere avanserte AI-drevne prediktive modeller",
      "Etablere markedsledende posisjon",
    ],
  },
]

export function SectionGrowthStrategy() {
  return (
    <section className="relative w-full bg-warm-white py-24 text-warm-grey md:py-32 dark:bg-warm-grey dark:text-warm-white">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">09</span>
            <h2 className="text-xl font-medium tracking-tight">
              Vekststrategi
            </h2>
          </div>
          <Link
            href="/"
            className="text-warm-grey-2 transition-colors hover:text-warm-grey-1"
          >
            propdock.no
          </Link>
        </div>

        {/* Main headline - clear and direct */}
        <div className="mb-16 text-center">
          <h3 className="text-3xl font-medium leading-tight md:text-4xl">
            Strategiske milepæler for vekst
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            Vår faseinndelte tilnærming for å bygge en markedsledende posisjon
          </p>
        </div>

        <div className="space-y-16">
          {/* Growth Strategy Roadmap */}
          <div>
            <h4 className="mb-8 text-center text-xl font-medium">
              Vekststrategi
            </h4>

            <div className="mx-auto max-w-4xl">
              <div className="relative space-y-6 pl-6 md:pl-8">
                {/* Vertical timeline line */}
                <div className="absolute bottom-0 left-0 top-0 w-px bg-warm-grey/20 dark:bg-warm-grey-2/30"></div>

                {growthMilestones.map((milestone, index) => (
                  <div key={index} className="relative">
                    {/* Timeline marker */}
                    <div className="absolute -left-3 top-0 h-6 w-6 rounded-full border-2 border-warm-grey/30 bg-warm-white dark:border-warm-grey-1/30 dark:bg-warm-grey"></div>

                    <div className="rounded-xl bg-warm-grey/5 p-6 dark:bg-warm-grey-2/10">
                      <div className="mb-4">
                        <h5 className="text-lg font-medium">
                          {milestone.phase}
                        </h5>
                        <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                          {milestone.timeframe}
                        </p>
                      </div>

                      <ul className="space-y-2">
                        {milestone.goals.map((goal, goalIndex) => (
                          <li
                            key={goalIndex}
                            className="flex items-center gap-3"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-warm-grey-2 dark:text-warm-grey-1"
                            >
                              <path d="m5 12 5 5L20 7" />
                            </svg>
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Growth Metrics */}
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-warm-grey/5 p-6 text-center dark:bg-warm-grey-2/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warm-grey/10 text-2xl font-medium dark:bg-warm-grey-2/20">
                10x
              </div>
              <h5 className="mb-2 font-medium">Brukerekspansjon</h5>
              <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                Fra 50 til 500+ brukere innen år 3
              </p>
            </div>

            <div className="rounded-xl bg-warm-grey/5 p-6 text-center dark:bg-warm-grey-2/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warm-grey/10 text-2xl font-medium dark:bg-warm-grey-2/20">
                90M+
              </div>
              <h5 className="mb-2 font-medium">Årlig omsetning</h5>
              <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                Forventet omsetning etter 3 år
              </p>
            </div>

            <div className="rounded-xl bg-warm-grey/5 p-6 text-center dark:bg-warm-grey-2/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warm-grey/10 text-2xl font-medium dark:bg-warm-grey-2/20">
                65%+
              </div>
              <h5 className="mb-2 font-medium">Bruttomargin</h5>
              <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                Høye marginer muliggjør reinvestering i vekst
              </p>
            </div>
          </div>

          {/* Implementation Strategy Overview */}
          <div className="mx-auto max-w-4xl rounded-2xl bg-warm-grey/5 p-8 dark:bg-warm-grey-2/10">
            <h4 className="mb-6 text-center text-xl font-medium">
              Implementeringsstrategi
            </h4>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h5 className="font-medium">Smidig og iterativ utvikling</h5>
                <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  Vi bruker en smidig tilnærming med korte utviklingssykluser
                  (2-3 uker) for å sikre kontinuerlig levering av verdi til
                  kundene våre. Dette gjør at vi kan raskt tilpasse oss
                  markedets tilbakemeldinger og behov.
                </p>
              </div>
              <div className="space-y-4">
                <h5 className="font-medium">Datadrevet beslutningstakning</h5>
                <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  Alle strategiske beslutninger er forankret i brukerdata og
                  markedsinnsikt. Vi har etablert robuste systemer for
                  datainnsamling og analyse som gir oss innsikt i bruksmønstre
                  og kundetilfredshet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
