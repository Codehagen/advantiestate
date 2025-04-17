import Link from "next/link"

// Market expansion regions
const expansionRegions = [
  { region: "Oslo-regionen", year: "År 1", status: "Aktiv" },
  { region: "Bergen og Vestlandet", year: "År 2", status: "Planlagt" },
  { region: "Trondheim og Midt-Norge", year: "År 2", status: "Planlagt" },
  { region: "Nord-Norge", year: "År 3", status: "Planlagt" },
  { region: "Stockholm", year: "År 3", status: "Planlagt" },
  { region: "København", year: "År 3-4", status: "Vurderes" },
]

// Expansion strategies
const expansionStrategies = [
  {
    title: "Markedspenetrasjon",
    description: "Utvide brukerbase i eksisterende markeder",
    steps: [
      "Bygge partnerskap med ledende eiendomsaktører",
      "Optimalisere salgsmetodikk basert på tidlige erfaringer",
      "Øke merkevarebevissthet gjennom målrettet markedsføring",
    ],
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <path d="m16 12-4 4-4-4M12 8v7" />
      </svg>
    ),
  },
  {
    title: "Geografisk ekspansjon",
    description: "Systematisk utvidelse til nye regioner",
    steps: [
      "Etablere regionskontorer i nøkkelmarkeder",
      "Tilpasse løsning til regionale særtrekk",
      "Utnytte lokale nettverk for rask adopsjon",
    ],
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <path d="m2 12 20 0M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "Produkt- og tjenestevekst",
    description: "Kontinuerlig utvidelse av verdiforslag",
    steps: [
      "Lansere nye moduler for flere bruksområder",
      "Utvikle skreddersydde løsninger for større aktører",
      "Integrere med flere datakilder og tredjepartsløsninger",
    ],
    icon: (
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
        <rect width="8" height="8" x="2" y="2" rx="1" />
        <path d="M14 2c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1h-4a1 1 0 0 1-1-1V3c0-.6.4-1 1-1h4ZM2 14c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1H3a1 1 0 0 1-1-1v-4Z" />
        <path d="M14 14a1 1 0 0 1 1-1h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1h-4a1 1 0 0 1-1-1v-4Z" />
      </svg>
    ),
  },
]

// Success factors
const successFactors = [
  {
    factor: "Dedikert ekspansjonsteam",
    description:
      "Etablering av dedikert team for hver ny region for å sikre lokal tilpasning og rask vekst",
  },
  {
    factor: "Datadrevet ekspansjon",
    description:
      "Bruk av markedsdata og brukerinnsikt for strategiske beslutninger om ekspansjonsmuligheter",
  },
  {
    factor: "Skalerbar infrastruktur",
    description:
      "Teknisk plattform som enkelt kan skaleres til nye markeder uten betydelig reengineering",
  },
  {
    factor: "Sterk lokal tilstedeværelse",
    description:
      "Investering i lokale team og partnerskap i hver region for bedre markedsforståelse",
  },
]

export function SectionExpansion() {
  return (
    <section className="relative w-full bg-warm-grey py-24 text-warm-white md:py-32">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">10</span>
            <h2 className="text-xl font-medium tracking-tight">
              Ekspansjonsstrategi
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
            Hvordan vi skal ekspandere
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-grey-1">
            En systematisk tilnærming til nasjonal og nordisk vekst
          </p>
        </div>

        <div className="space-y-16">
          {/* Expansion Strategy Overview */}
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 grid gap-8 md:grid-cols-3">
              {expansionStrategies.map((strategy, index) => (
                <div key={index} className="rounded-2xl bg-warm-grey-2/10 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warm-grey-2/20">
                    {strategy.icon}
                  </div>
                  <h4 className="mb-2 font-medium">{strategy.title}</h4>
                  <p className="mb-4 text-sm text-warm-grey-1">
                    {strategy.description}
                  </p>
                  <ul className="space-y-3">
                    {strategy.steps.map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        className="flex items-start gap-2 text-sm"
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
                          className="mt-0.5 shrink-0 text-warm-grey-1"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Expansion Map */}
          <div>
            <h4 className="mb-8 text-center text-xl font-medium">
              Geografisk ekspansjon
            </h4>

            <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-warm-grey-2/10 p-6">
              <div className="mb-4 grid grid-cols-3 border-b border-warm-grey-2/20 pb-2 text-sm font-medium">
                <div>Region</div>
                <div>Tidslinje</div>
                <div>Status</div>
              </div>

              <div className="space-y-4">
                {expansionRegions.map((region, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 items-center text-sm"
                  >
                    <div className="font-medium">{region.region}</div>
                    <div>{region.year}</div>
                    <div>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                          region.status === "Aktiv"
                            ? "bg-green-900/30 text-green-300"
                            : region.status === "Planlagt"
                              ? "bg-blue-900/30 text-blue-300"
                              : "bg-gray-700/30 text-gray-300"
                        }`}
                      >
                        {region.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="mt-8 rounded-xl bg-warm-grey-2/10 p-6">
              <h5 className="mb-4 text-center font-medium">
                Ekspansjonsstrategi per region
              </h5>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-warm-grey-2/5 p-4">
                  <h6 className="mb-2 font-medium">Fase 1: Norske storbyer</h6>
                  <p className="text-sm text-warm-grey-1">
                    Vi starter med Oslo-regionen hvor vi allerede har etablert
                    nærvær. Deretter ekspanderer vi til Bergen, Trondheim og
                    andre større byer basert på markedsstørrelse og eksisterende
                    relasjoner med nøkkelaktører.
                  </p>
                </div>
                <div className="rounded-lg bg-warm-grey-2/5 p-4">
                  <h6 className="mb-2 font-medium">
                    Fase 2: Nordisk ekspansjon
                  </h6>
                  <p className="text-sm text-warm-grey-1">
                    Etter suksess i det norske markedet vil vi utvide til
                    Stockholm og København, som har lignende markedsdynamikk og
                    representerer betydelige muligheter. Vi vil tilpasse
                    produktet til lokale forhold og bygge regionale team.
                  </p>
                </div>
              </div>
            </div> */}
          </div>

          {/* Success Factors */}
          {/* <div>
            <h4 className="mb-8 text-center text-xl font-medium">
              Nøkkelfaktorer for vellykket ekspansjon
            </h4>

            <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
              {successFactors.map((item, index) => (
                <div key={index} className="rounded-xl bg-warm-grey-2/10 p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-grey-2/20 text-lg font-medium">
                      {index + 1}
                    </div>
                    <h5 className="font-medium">{item.factor}</h5>
                  </div>
                  <p className="ml-11 text-sm text-warm-grey-1">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div> */}

          {/* Call to Action */}
          {/* <div className="mx-auto max-w-3xl rounded-2xl bg-warm-grey-2/20 p-8 text-center">
            <h4 className="mb-4 text-xl font-medium">Klar til å gjennomføre</h4>
            <p className="mb-6 text-warm-grey-1">
              Med vår systematiske ekspansjonsstrategi, sterke team og
              skalerbare plattform er vi godt posisjonert til å gjennomføre vår
              ambisiøse vekstplan. Vi har allerede etablert oss i Oslo-regionen
              og er klare for neste steg.
            </p>
            <div className="inline-block rounded-full bg-warm-grey-1 px-6 py-3 font-medium text-warm-grey">
              Bli med på vår ekspansjonsreise
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
