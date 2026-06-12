# Case study-utkast (ikke publisert)

Filer i denne mappen er **utkast** — `_`-prefikset holder dem utenfor
content-collection-bygget (samme konvensjon som `_listings-samples`).
Collection leser kun `src/content/customers/*.mdx`.

## Publiseringsflyt

1. Fyll inn alle `TODO:`-felter i utkastet (se sjekklisten i hver fil).
2. Innhent **samtykke fra navngitte parter** før publisering — kjøpesum og
   partsnavn skal ikke ut uten avklaring, selv om overdragelser er offentlig
   informasjon i grunnboken.
3. Flytt filen til `src/content/customers/` (da bygges den og vises på
   `/kunder` + `/kunder/[slug]`).
4. Fyll `PRESENTATION` + `ORDER` i `src/app/kunder/page.tsx` (grid-kort:
   bilde, kategori, år, KPI-er) og `PRESENTATION` i
   `src/app/kunder/[slug]/page.tsx` (hero, meta, resultater, rådgivere).
5. Oppdater forsidens `CASES`-array i `src/app/page.tsx` til å speile de
   reelle casene, og gjør kortene klikkbare mot `/kunder/[slug]`.

## Status

| Case | Fil | Mangler |
|------|-----|---------|
| Mørkvedbadet (kontor, Bodø) | `morkvedbadet-bodo.mdx` | Det meste — se sjekkliste i filen (rolle, år, omfang, tall, bilder) |
| Bjerka Næringspark (Hemnes) | `bjerka-naeringspark.mdx` | År, areal, prosessdetaljer, samtykke, bilder — parter og sum (37,5 MNOK) finnes fra CRM |
| Kontor & Handel, Bodø (case 3) | ikke opprettet | Hvilket oppdrag? Avventer valg |

## Kjente skjema-skavanker (følges opp separat)

`CustomersPost`-skjemaet i `content-collections.ts` er arvet fra en
SaaS-mal (`plan`, `companyLogo`, `companySize`, `companyFounded`).
For eiendomscase er feltene lite treffende; den editorielle visningen
styres uansett av `PRESENTATION`-objektene i sidene. Vurder å omforme
skjemaet (oppdragstype, areal, år, resultat-KPIer) når de første casene
er publisert — ikke bland det inn i innholdsarbeidet nå.
