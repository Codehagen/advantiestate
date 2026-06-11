# Markedsdata — kvartalsvis release-operativmodell (UTKAST til partnerbeslutning)

Status: **UTKAST** — krever eierbeslutning hos partnerne før 15. juli 2026
Bakgrunn: TODO 24 / /autoplan-review 2026-06-11. Begge review-modellene (Claude +
Codex) konvergerte uavhengig på samme konklusjon: bindingen for markedsinnsikt,
analyseportal, presserom og nyhetsbrev er **datatilførsel, ikke presentasjon**.
«Neste oppdatering: 15. juli 2026» er allerede publisert offentlig — noen må eie
at den holdes.

> Teknisk motpart: refresh-runbooken ligger som doc-kommentar øverst i
> `src/components/markedsinnsikt/portalSeries.ts`. Dette dokumentet definerer
> *hvem og hvordan* — runbooken definerer *hva som endres i koden*.

---

## 1. Eierskap (BESLUTNING KREVES ✋)

| Rolle | Ansvar | Forslag |
|---|---|---|
| **Release-eier** | Holder kadensen; signerer av at tallene kan publiseres; eier «Neste oppdatering»-datoen | _Foreslått: Christer Hagen (fronter analytikerkortet på portalen)_ |
| Datainnsamler | Henter/oppdaterer kildene per serie (se §2) innen frist | _Foreslått: samme + megler-rotasjon for transaksjonsbekreftelser_ |
| Teknisk utfører | Kjører runbooken i portalSeries.ts, ser testene grønne, deployer | Utvikler/CC — mekanisk når tallene foreligger |

Beslutning: navngi release-eier og dato for første eide release (15. juli 2026?).

## 2. Kilder per serie (forslag — bekreft eller juster)

| Serie | Kilde | Frekvens |
|---|---|---|
| Prime yield per segment | Egne transaksjoner + meglervurdering, kalibrert mot bank/takst | Kvartal |
| Prime markedsleie per by | Advantis leiekontraktbase + utleiemandater | Kvartal |
| Transaksjonsvolum + deals | Tinglysing (Kartverket), egne mandater, parter direkte | Kvartal |
| Arealledighet | Advantis markedstelling (Finn-annonser + lokalkunnskap) | Kvartal |
| Nybygg/pipeline | Kommunale rammetillatelser + bransjenettverk | Halvår |
| Renter (SWAP, stat, styringsrente) | Norges Bank / markedsdata | Kvartal |
| Makro (BNP, KPI, sysselsetting, befolkning) | SSB, Norges Bank PPR, KBNN | Ved publisering |

## 3. Kadens og kalender

- **Release-dato: 15. i måneden etter kvartalsslutt** (15. jan / 15. apr / 15. jul / 15. okt).
- Innsamling fryses 5 virkedager før; teknisk utførelse tar < 1 dag.
- Datoen publiseres ETT kvartal frem — aldri lenger (løftet må alltid være neste, ikke fjerne).
- Registeret (`marketReleases.ts`) er eneste kilde til «Oppdatert»-stempler og
  prognosegrenser — kalenderen holdes ved å legge inn releasen, ingen copy-endringer.

## 4. Ærlighetsregler (allerede delvis i drift etter gate-vedtakene 2026-06-11)

1. Prognoser merkes alltid «Advantis basisscenario» og re-baseres hver release.
2. Transaksjoner vises anonymisert (type + by + areal) — aldri navngitte
   eiendommer med pris/yield uten partenes samtykke eller tinglyst offentlighet.
3. Datostempler deriveres fra registeret — aldri kosmetiske dato-bumps uten reell
   datarefresh (AI-søkemotorer straffer det, jf. TODO 7-researchen).
4. Ingen markedslederpåstander i copy før konkurrentpasset (TODO 23) er gjort.
5. KPI-deltaer deriveres i build fra kanoniske serier — aldri hardkodede tall.

## 5. Suksessmåling

Eventene fra /autoplan A3 (`analyseportal_csv_download`, `analyseportal_rail_cta`,
`analyseportal_share`, nyhetsbrevpåmeldinger per kilde) evalueres ved hver release —
første gjennomgang ved Q2-releasen 15. juli 2026.

## 6. Åpne beslutninger for partnermøtet

- [ ] Navngi release-eier (§1)
- [ ] Bekrefte/justere kildelisten (§2)
- [ ] Ratifisere kadensen og 15. juli-datoen (§3)
- [ ] Avklare om Q2-releasen skal ha reelle tall i alle 6 sektorer, eller om
      Transaksjoner/Nybygg/Makro starter med «estimat»-merking (jf. UC1-vedtaket:
      ship 6 + eid refresh-dato)
