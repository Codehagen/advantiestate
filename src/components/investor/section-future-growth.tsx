import Link from "next/link"
import { useId } from "react"

// Sample revenue projections - updated with monthly pricing
const revenueProjections = [
  {
    year: "År 1",
    users: "50",
    revenue: "9.000.000",
    description: "Fokus på tidlige brukere og produktvalidering",
  },
  {
    year: "År 2",
    users: "200",
    revenue: "36.000.000",
    description: "Ekspansjon i Oslo-regionen",
  },
  {
    year: "År 3",
    users: "500+",
    revenue: "90.000.000+",
    description: "Nasjonal ekspansjon og produktutvidelse",
  },
]

export function SectionFutureGrowth() {
  const chartId = useId()

  return (
    <section className="relative w-full bg-warm-white py-24 text-warm-grey md:py-32 dark:bg-warm-grey dark:text-warm-white">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">08</span>
            <h2 className="text-xl font-medium tracking-tight">
              Fremtidig vekst
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
        <div className="mb-6 text-center">
          <h3 className="text-3xl font-medium leading-tight md:text-4xl">
            Vår vekstpotensial
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            Sterk finansiell vekst basert på vår forretningsmodell
          </p>
        </div>

        <div className="space-y-16">
          {/* Revenue Growth Chart */}
          <div>
            <h4 className="mb-8 text-center text-xl font-medium">
              Inntektsprojeksjoner
            </h4>

            {/* Custom Chart Container */}
            <div className="mx-auto h-64 max-w-4xl md:h-80">
              <svg
                className="h-full w-full"
                aria-labelledby={`${chartId}-title`}
              >
                <title id={`${chartId}-title`}>Årlig inntektsvekst</title>
                {/* Base line */}
                <line
                  x1="10%"
                  y1="85%"
                  x2="90%"
                  y2="85%"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="2"
                />

                {/* Y-axis */}
                <line
                  x1="10%"
                  y1="15%"
                  x2="10%"
                  y2="85%"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="2"
                />

                {/* Revenue bars */}
                <g>
                  {/* Year 1 - 9M */}
                  <rect
                    x="20%"
                    y="65%"
                    width="10%"
                    height="20%"
                    rx="4"
                    ry="4"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                  <text
                    x="25%"
                    y="60%"
                    textAnchor="middle"
                    fontSize="14"
                    fill="currentColor"
                  >
                    9M
                  </text>
                  <text
                    x="25%"
                    y="93%"
                    textAnchor="middle"
                    fontSize="12"
                    fill="currentColor"
                    opacity="0.7"
                  >
                    År 1
                  </text>

                  {/* Year 2 - 36M */}
                  <rect
                    x="45%"
                    y="45%"
                    width="10%"
                    height="40%"
                    rx="4"
                    ry="4"
                    fill="currentColor"
                    fillOpacity="0.6"
                  />
                  <text
                    x="50%"
                    y="40%"
                    textAnchor="middle"
                    fontSize="14"
                    fill="currentColor"
                  >
                    36M
                  </text>
                  <text
                    x="50%"
                    y="93%"
                    textAnchor="middle"
                    fontSize="12"
                    fill="currentColor"
                    opacity="0.7"
                  >
                    År 2
                  </text>

                  {/* Year 3 - 90M */}
                  <rect
                    x="70%"
                    y="20%"
                    width="10%"
                    height="65%"
                    rx="4"
                    ry="4"
                    fill="currentColor"
                    fillOpacity="0.8"
                  />
                  <text
                    x="75%"
                    y="15%"
                    textAnchor="middle"
                    fontSize="14"
                    fill="currentColor"
                  >
                    90M+
                  </text>
                  <text
                    x="75%"
                    y="93%"
                    textAnchor="middle"
                    fontSize="12"
                    fill="currentColor"
                    opacity="0.7"
                  >
                    År 3
                  </text>
                </g>
              </svg>
            </div>

            {/* User and Revenue Numbers */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {revenueProjections.map((projection, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-warm-grey/5 p-6 dark:bg-warm-grey-2/10"
                >
                  {/* Visual progress indicator */}
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-warm-grey dark:bg-warm-grey-1"
                    style={{
                      width: index === 0 ? "33%" : index === 1 ? "66%" : "100%",
                      opacity: index === 0 ? 0.6 : index === 1 ? 0.8 : 1,
                    }}
                  />

                  <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-lg font-medium">{projection.year}</h5>
                    <span className="rounded-full bg-warm-grey/10 px-3 py-1 text-xs dark:bg-warm-grey-2/20">
                      {projection.users} brukere
                    </span>
                  </div>

                  <div className="mb-3 space-y-1">
                    <p className="text-3xl font-medium">{projection.revenue}</p>
                    <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                      NOK
                    </p>
                  </div>

                  <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                    {projection.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Growth Summary */}
          {/* <div className="mx-auto max-w-4xl rounded-2xl bg-warm-grey/5 p-8 dark:bg-warm-grey-2/10">
            <h4 className="mb-6 text-center text-xl font-medium">
              Finansiell vekststrategi
            </h4>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h5 className="font-medium">Inntektsdrivere</h5>
                <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  Vår vekst vil komme fra tre hovedkilder: nye brukere, økt
                  betalingsvilje etter dokumentert ROI, og utvidet
                  funksjonalitet som muliggjør større pakker for
                  enterprise-kunder.
                </p>
              </div>
              <div className="space-y-4">
                <h5 className="font-medium">Investeringsstrategi</h5>
                <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  Vi reinvesterer en betydelig del av inntektene i
                  produktutvikling og markedsekspansjon de første årene, med mål
                  om å bygge et solid fundament for langvarig lønnsomhet og
                  markedsledelse.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
