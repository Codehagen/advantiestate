const services = [
  {
    title: "Salg av næringseiendom",
    description: "Vi er ledende innen salg av næringseiendom i Nord-Norge.",
  },
  {
    title: "Utleie",
    description:
      "Vi har inngående kunnskap om utleiemarkedet for næringseiendom.",
  },
  {
    title: "Rådgivning og verdivurdering",
    description:
      "Få profesjonell rådgivning og verdivurdering av din næringseiendom.",
  },
  {
    title: "Oppgjørsoppdrag",
    description:
      "Vi sørger for trygg og effektiv gjennomføring av oppgjør ved kjøp og salg.",
  },
  {
    title: "Leietakerrådgivning",
    description:
      "La oss hjelpe deg med å finne de perfekte lokalene eller optimalisere eksisterende leieforhold.",
  },
  {
    title: "Kjøpsoppdrag",
    description:
      "Vi hjelper deg med å finne og sikre den rette næringseiendommen for din virksomhet.",
  },
  {
    title: "Markedsinnsikt",
    description:
      "Tilgang til omfattende markedsdata og analyser for bedre beslutninger.",
  },
  {
    title: "Dedikert Støtte",
    description:
      "Dedikert støtte og opplæring for å sikre maksimal verdi av våre tjenester.",
  },
];

export default function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="mx-auto mt-44">
      <h2
        id="benefits-title"
        className="inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-warm-white dark:to-warm-grey-1"
      >
        Våre tjenester
      </h2>
      <dl className="mt-8 grid grid-cols-4 gap-x-10 gap-y-8 sm:mt-12 sm:gap-y-10">
        {services.map((service, index) => (
          <div key={index} className="col-span-4 sm:col-span-2 lg:col-span-1">
            <dt className="font-semibold text-warm-grey dark:text-warm-white">
              {service.title}
            </dt>
            <dd className="mt-2 leading-7 text-warm-grey-2 dark:text-warm-grey-1">
              {service.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
