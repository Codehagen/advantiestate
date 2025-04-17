import Link from "next/link"

export function SectionTeam() {
  return (
    <section className="relative w-full bg-warm-white py-24 text-warm-grey md:py-32 dark:bg-warm-grey dark:text-warm-white">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">11</span>
            <h2 className="text-xl font-medium tracking-tight">Teamet</h2>
          </div>
          <Link
            href="/"
            className="text-warm-grey-2 transition-colors hover:text-warm-grey-1"
          >
            propdock.no
          </Link>
        </div>

        {/* Main headline */}
        <div className="mb-16 text-center">
          <h3 className="text-3xl font-medium leading-tight md:text-4xl">
            Erfarne entreprenører og ledere med dyp domeneforståelse
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            Kombinasjon av teknisk ekspertise og eiendomsinnsikt
          </p>
        </div>

        {/* Team members grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Team member: Christer Hagen */}
          <div className="group overflow-hidden rounded-2xl bg-warm-grey-2/5 transition-all hover:bg-warm-grey-2/10">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="relative aspect-square md:col-span-1">
                {/* Placeholder image */}
                <div className="absolute inset-0 flex items-center justify-center bg-warm-grey-2/10 text-2xl font-light text-warm-grey-2">
                  CH
                </div>
              </div>
              <div className="p-6 md:col-span-2">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-warm-grey-2">
                      Medgründer & CEO
                    </p>
                    <h4 className="text-2xl font-medium">Christer Hagen</h4>
                  </div>
                  <p className="text-sm text-warm-grey-1 dark:text-warm-grey-1">
                    10+ års erfaring fra eiendomsbransjen og teknologisektoren
                    med fokus på digitalisering og innovative løsninger for
                    næringseiendom.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href="https://linkedin.com"
                      target="_blank"
                      className="rounded-full bg-warm-grey-2/10 p-2 text-warm-grey-1 transition-colors hover:bg-warm-grey-2/20 dark:text-warm-grey-1"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                      </svg>
                    </Link>
                    <Link
                      href="mailto:christer@propdock.no"
                      className="rounded-full bg-warm-grey-2/10 p-2 text-warm-grey-1 transition-colors hover:bg-warm-grey-2/20 dark:text-warm-grey-1"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team member: Vegard Soraas */}
          <div className="group overflow-hidden rounded-2xl bg-warm-grey-2/5 transition-all hover:bg-warm-grey-2/10">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="relative aspect-square md:col-span-1">
                {/* Placeholder image */}
                <div className="absolute inset-0 flex items-center justify-center bg-warm-grey-2/10 text-2xl font-light text-warm-grey-2">
                  VS
                </div>
              </div>
              <div className="p-6 md:col-span-2">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-warm-grey-2">
                      Medgründer & CTO
                    </p>
                    <h4 className="text-2xl font-medium">Vegard Soraas</h4>
                  </div>
                  <p className="text-sm text-warm-grey-1 dark:text-warm-grey-1">
                    Erfaren teknologileder med ekspertise innen AI og
                    dataanalyse. Har bygget skalerbare løsninger for
                    eiendomsbransjen med fokus på datadrevet beslutningstaking.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href="https://linkedin.com"
                      target="_blank"
                      className="rounded-full bg-warm-grey-2/10 p-2 text-warm-grey-1 transition-colors hover:bg-warm-grey-2/20 dark:text-warm-grey-1"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                      </svg>
                    </Link>
                    <Link
                      href="mailto:vegard@propdock.no"
                      className="rounded-full bg-warm-grey-2/10 p-2 text-warm-grey-1 transition-colors hover:bg-warm-grey-2/20 dark:text-warm-grey-1"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team expertise section */}
        <div className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h4 className="text-xl font-medium">
              Våre sentrale kompetanseområder
            </h4>
            <p className="mt-4 text-warm-grey-2 dark:text-warm-grey-1">
              Vi kombinerer dyp innsikt i eiendomsbransjen med teknologisk
              innovasjon for å bygge et produkt som løser reelle utfordringer
              for eiendomsmeglere.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="group space-y-4 rounded-2xl bg-warm-grey-2/5 p-6 transition-colors hover:bg-warm-grey-2/10">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Domeneekspertise</h4>
                <span className="text-warm-grey-2">→</span>
              </div>
              <p className="text-sm text-warm-grey-1">
                Dyp forståelse av eiendomsbransjens utfordringer og muligheter
              </p>
            </div>

            <div className="group space-y-4 rounded-2xl bg-warm-grey-2/5 p-6 transition-colors hover:bg-warm-grey-2/10">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Teknisk innovasjon</h4>
                <span className="text-warm-grey-2">→</span>
              </div>
              <p className="text-sm text-warm-grey-1">
                Evne til å levere banebrytende teknologiske løsninger for
                bransjen
              </p>
            </div>

            <div className="group space-y-4 rounded-2xl bg-warm-grey-2/5 p-6 transition-colors hover:bg-warm-grey-2/10">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Nettverk og partnerskap</h4>
                <span className="text-warm-grey-2">→</span>
              </div>
              <p className="text-sm text-warm-grey-1">
                Sterke forbindelser i både teknologi- og eiendomssektoren
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
