import Link from "next/link"

// Sample pricing tiers
const pricingTiers = [
  {
    name: "Standard",
    price: "15.000",
    period: "per bruker / måned",
    binding: "1 års bindingstid",
    features: [
      "Sanntids markedsdata",
      "Automatisert finansanalyse",
      "Prediktiv markedsanalyse",
      "Ubegrenset antall prosjekter",
      "Eksport av rapporter",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Kontakt oss",
    period: "skreddersydd",
    binding: "Fleksible avtaler",
    features: [
      "Alt i Standard",
      "API-integrasjon",
      "Dedikert kundestøtte",
      "Tilpassede analysemodeller",
      "Prioritert tilgang til nye funksjoner",
    ],
    popular: false,
  },
]

// Economic metrics
const economicMetrics = [
  {
    metric: "36:1",
    title: "LTV:CAC-forhold",
    description: "Eksepsjonell avkastning på kundeakvisering",
  },
  {
    metric: "1m",
    title: "Tilbakebetalingstid",
    description: "Svært rask avkastning på investering",
  },
  {
    metric: "65%+",
    title: "Bruttomargin",
    description: "Høye marginer muliggjør reinvestering i vekst",
  },
]

export function SectionBusinessModel() {
  return (
    <section className="relative w-full bg-warm-grey py-24 text-warm-white md:py-32">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">07</span>
            <h2 className="text-xl font-medium tracking-tight">
              Forretningsmodell
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
            Abonnementsbasert plattform
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-grey-1">
            15.000 NOK per bruker per måned
          </p>
          <p className="mx-auto mt-1 max-w-2xl text-warm-grey-1">
            Med 1 års bindingstid
          </p>
        </div>

        {/* Two column layout with pricing and business model overview */}
        <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-2">
          {/* Left column: Pricing Tier */}
          <div className="h-full rounded-2xl bg-warm-grey-2/20 p-8 ring-1 ring-warm-grey-1/20">
            <div className="mb-6 text-center">
              <div className="mb-2 inline-block rounded-full bg-warm-grey-1 px-3 py-1 text-xs font-medium text-warm-grey">
                Standard abonnement
              </div>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-medium">15.000</span>
                <span className="ml-2 text-lg text-warm-grey-1">
                  NOK per bruker / måned
                </span>
              </div>
              <p className="mt-2 text-sm text-warm-grey-1">
                Med 1 års bindingstid
              </p>
            </div>

            <div className="mb-6 h-px bg-warm-grey-2/20" />

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h5 className="mb-3 font-medium">Inkluderte funksjoner</h5>
                <ul className="space-y-2">
                  {pricingTiers[0].features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
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
                        className="text-warm-grey-1"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h5 className="mb-3 font-medium">Verdiforslag</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-warm-grey-2/20 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="13 17 18 12 13 7" />
                        <polyline points="6 17 11 12 6 7" />
                      </svg>
                    </div>
                    <span>85% raskere analysetid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-warm-grey-2/20 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="13 17 18 12 13 7" />
                        <polyline points="6 17 11 12 6 7" />
                      </svg>
                    </div>
                    <span>2.5x mer nøyaktige verdivurderinger</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-warm-grey-2/20 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="13 17 18 12 13 7" />
                        <polyline points="6 17 11 12 6 7" />
                      </svg>
                    </div>
                    <span>Konkurransefortrinn i markedet</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-warm-grey-1">
                Enterprise-løsninger med tilpassede funksjoner og avtaler er
                også tilgjengelig
              </p>
            </div>
          </div>

          {/* Right column: Business Model Overview */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="rounded-2xl bg-warm-grey-2/10 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warm-grey-2/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h4 className="mb-2 font-medium">Forutsigbare inntekter</h4>
              <p className="text-sm text-warm-grey-1">
                Månedlig abonnement med 1 års binding sikrer stabil og
                langsiktig inntektsstrøm
              </p>
            </div>

            <div className="rounded-2xl bg-warm-grey-2/10 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warm-grey-2/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 className="mb-2 font-medium">Høy gjennomsnittlig inntekt</h4>
              <p className="text-sm text-warm-grey-1">
                180.000 NOK per bruker årlig med høy margin
              </p>
            </div>

            <div className="rounded-2xl bg-warm-grey-2/10 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warm-grey-2/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h4 className="mb-2 font-medium">Betydelig ROI for kunder</h4>
              <p className="text-sm text-warm-grey-1">
                Besparelser og økt effektivitet gir 12-15x avkastning på
                investeringen
              </p>
            </div>
          </div>
        </div>

        {/* Economic Metrics Section */}
        {/* <div className="mx-auto max-w-5xl">
          <h4 className="mb-8 text-center text-xl font-medium">
            Sterke økonomiske nøkkeltall
          </h4>

          <div className="grid gap-6 md:grid-cols-3">
            {economicMetrics.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-warm-grey-2/10 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warm-grey-2/20 text-2xl font-medium">
                  {item.metric}
                </div>
                <h5 className="mb-2 font-medium">{item.title}</h5>
                <p className="text-sm text-warm-grey-1">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="mx-auto max-w-3xl text-sm text-warm-grey-1">
              Med en kundeakvisisjonskostnad på ~5.000 NOK og en
              kundelevetidsverdi på ~180.000 NOK første år, har vår
              forretningsmodell eksepsjonelt sterke økonomiske resultater som
              muliggjør rask og bærekraftig vekst.
            </p>
          </div>
        </div> */}
      </div>
    </section>
  )
}
