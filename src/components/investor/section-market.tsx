import Link from "next/link"

export function SectionMarket() {
  return (
    <section className="relative w-full bg-warm-grey py-24 text-warm-white md:py-32">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">05</span>
            <h2 className="text-xl font-medium tracking-tight">Markedet</h2>
          </div>
          <Link
            href="/"
            className="text-warm-grey-2 transition-colors hover:text-warm-grey-1"
          >
            propdock.no
          </Link>
        </div>

        <div className="space-y-16">
          {/* Market Overview */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-3xl font-medium leading-tight md:text-4xl">
                Et betydelig marked med stort potensial for digitalisering
              </h3>
              <p className="text-lg text-warm-grey-1">
                Norges næringseiendomsmarked representerer betydelige verdier og
                muligheter, med et stort antall aktører som fortsatt mangler
                moderne analyseverktøy.
              </p>
            </div>

            {/* Market Size Card */}
            <div className="rounded-2xl bg-warm-grey-2/10 p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-5xl font-medium">1T+ NOK</p>
                  <p className="text-warm-grey-1">Total markedsverdi</p>
                </div>
                <div className="h-px bg-warm-grey-2/20" />
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-2xl font-medium">1000+</p>
                    <p className="text-sm text-warm-grey-1">
                      Aktive markedsaktører
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-medium">85%</p>
                    <p className="text-sm text-warm-grey-1">
                      Bruker utdaterte verktøy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Details */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Target Audience */}
            <div className="space-y-4 rounded-2xl bg-warm-grey-2/10 p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Målgruppe</h4>
                <span className="rounded-full bg-warm-grey-2/20 px-3 py-1 text-sm">
                  1000+ aktører
                </span>
              </div>
              <ul className="space-y-3 text-sm text-warm-grey-1">
                <li className="flex items-center gap-2">
                  <span className="text-warm-grey-2">•</span>
                  Eiendomsinvestorer og forvaltere
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-warm-grey-2">•</span>
                  Eiendomsselskaper og utviklere
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-warm-grey-2">•</span>
                  Finansinstitusjoner og fond
                </li>
              </ul>
            </div>

            {/* Market Potential */}
            <div className="space-y-4 rounded-2xl bg-warm-grey-2/10 p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Markedspotensial</h4>
                <span className="rounded-full bg-warm-grey-2/20 px-3 py-1 text-sm">
                  10% markedsandel
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-2xl font-medium">30-50M NOK</p>
                  <p className="text-sm text-warm-grey-1">
                    Årlig inntektspotensial
                  </p>
                </div>
                <div className="h-px bg-warm-grey-2/20" />
                <p className="text-sm text-warm-grey-1">
                  Basert på konservative estimater og dagens prising i markedet
                </p>
              </div>
            </div>

            {/* Growth Strategy */}
            <div className="space-y-4 rounded-2xl bg-warm-grey-2/10 p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Vekststrategi</h4>
                <span className="rounded-full bg-warm-grey-2/20 px-3 py-1 text-sm">
                  3 års plan
                </span>
              </div>
              <ul className="space-y-3 text-sm text-warm-grey-1">
                <li className="flex items-center gap-2">
                  <span className="text-warm-grey-2">1.</span>
                  Etablere sterkt fotfeste i Oslo-regionen
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-warm-grey-2">2.</span>
                  Ekspandere til andre større norske byer
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-warm-grey-2">3.</span>
                  Utvide til nordiske markeder
                </li>
              </ul>
            </div>
          </div>

          {/* Market Validation */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl bg-warm-grey-2/10 p-6">
              <h4 className="font-medium">Markedsvalidering</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-warm-grey-2/20 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      className="text-warm-white"
                    >
                      <path
                        fill="currentColor"
                        d="M12 22c-1.4 0-2.717-.263-3.95-.788a10.158 10.158 0 0 1-3.238-2.15 10.158 10.158 0 0 1-2.15-3.237C2.137 14.592 1.875 13.275 1.875 11.875S2.138 9.158 2.663 7.925a10.158 10.158 0 0 1 2.15-3.238 10.158 10.158 0 0 1 3.237-2.15C9.283 2.012 10.6 1.75 12 1.75s2.717.263 3.95.788a10.158 10.158 0 0 1 3.238 2.15 10.158 10.158 0 0 1 2.15 3.237c.525 1.233.787 2.55.787 3.95s-.263 2.717-.788 3.95a10.158 10.158 0 0 1-2.15 3.238 10.158 10.158 0 0 1-3.237 2.15c-1.233.525-2.55.787-3.95.787Zm0-1.75c2.283 0 4.229-.808 5.837-2.425 1.608-1.617 2.413-3.563 2.413-5.838 0-2.283-.808-4.229-2.425-5.837-1.617-1.608-3.563-2.413-5.838-2.413-2.283 0-4.229.808-5.837 2.425C4.542 7.779 3.737 9.725 3.737 12c0 2.283.808 4.229 2.425 5.837 1.617 1.608 3.563 2.413 5.838 2.413Z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">25+ kundemøter gjennomført</p>
                    <p className="text-sm text-warm-grey-1">
                      Med ledende aktører i markedet
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-warm-grey-2/20 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      className="text-warm-white"
                    >
                      <path
                        fill="currentColor"
                        d="m10.6 16.2-4.25-4.25 1.25-1.25 3 3 7.75-7.75 1.25 1.25-9 9Z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">90% positiv tilbakemelding</p>
                    <p className="text-sm text-warm-grey-1">
                      På produktdemo og verdiforslag
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-warm-grey-2/10 p-6">
              <h4 className="font-medium">Konkurransefortrinn</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-warm-grey-2/20 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      className="text-warm-white"
                    >
                      <path
                        fill="currentColor"
                        d="m3.4 18.8-1.25-1.25 5.25-5.25 4 4 6.35-6.35H14.5V8.7h5.8v5.8h-1.25v-3.25l-7.6 7.6-4-4-4.05 4.05Z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Lokalt fokus og ekspertise</p>
                    <p className="text-sm text-warm-grey-1">
                      Skreddersydd for det norske markedet
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-warm-grey-2/20 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      className="text-warm-white"
                    >
                      <path
                        fill="currentColor"
                        d="M6.25 21.25c-.833 0-1.542-.292-2.125-.875A2.893 2.893 0 0 1 3.25 18.25v-10.5c0-.833.292-1.542.875-2.125A2.893 2.893 0 0 1 6.25 4.75h13.5c.833 0 1.542.292 2.125.875.583.583.875 1.292.875 2.125v10.5c0 .833-.292 1.542-.875 2.125-.583.583-1.292.875-2.125.875H6.25Zm0-1.75h13.5c.35 0 .646-.121.887-.362.242-.242.363-.538.363-.888v-10.5c0-.35-.121-.646-.363-.887a1.182 1.182 0 0 0-.887-.363H6.25c-.35 0-.646.121-.887.363a1.182 1.182 0 0 0-.363.887v10.5c0 .35.121.646.363.888.241.241.537.362.887.362Z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Moderne teknologiplattform</p>
                    <p className="text-sm text-warm-grey-1">
                      AI-drevet analyse og prediksjon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
