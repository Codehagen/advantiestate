# Plan 011: Artikkel-veikart — 15 nye kunnskapsartikler i tre klynger

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Planen er delt i tre batcher som kan utføres i
> separate økter — oppdater statusraden i `plans/README.md` med
> `IN PROGRESS (batch A ferdig)` osv. mellom batcher.
>
> **Drift check (run first)**:
> `git diff --stat 5e1c60a..HEAD -- src/content/help/ src/lib/blog/content.tsx content-collections.ts`
> Endringer fra plan 009/010 er forventet drift. STOP kun hvis: (a) en av
> slug-ene i artikkelspesifikasjonene under allerede finnes i
> `src/content/help/`, eller (b) `HELP_CATEGORIES`-slugs er endret.

## Status

- **Priority**: P1 (kjernen i SEO-målet)
- **Effort**: L (15 artikler; ~3 batcher)
- **Risk**: LOW (kun nye innholdsfiler + `related`-frontmatter i eksisterende)
- **Depends on**: plans/009-help-seo-tekniske-fikser.md (faq/publishedAt-felt,
  kategori-gating). Anbefalt etter 010 (pilarsiden lenkene peker mot).
- **Category**: direction/innhold (SEO)
- **Planned at**: commit `5e1c60a`, 2026-06-12

## Why this matters

Kunnskapssenteret har 12 artikler. To av seks kategorier («For Investorer»,
«Markedsanalyse») er tomme, begrepsklyngen har hull (to artikler refererer
en `brutto-leieinntekter`-artikkel som ikke finnes), og det mangler innhold
for kjøpsnære søk («hvordan kjøpe næringseiendom», «due diligence») der
Advanti faktisk selger tjenester. Google rangerer tematisk dybde: et nettsted
som dekker HELE begrepsapparatet rundt næringseiendom signaliserer autoritet
for alle søkene i klyngen. Denne planen spesifiserer 15 artikler i prioritert
rekkefølge med søkeord, disposisjon og intern lenking, slik at en utfører kan
skrive dem én og én uten ytterligere research.

## Current state

- Eksisterende artikler (slugs): `diskontert-kontantstrom`,
  `driftskostnader`, `felleskostnader`, `hva-er-advanti`,
  `hva-er-naringseiendom`, `hva-er-yield`, `kontantstromsanalyse`,
  `markedsleie-og-leieniva`, `netto-leieinntekter`, `sensitivitetsanalyse`,
  `tjene-mer-pa-naringseiendom`, `verdivurdering-av-naringseiendom`.
- Manglende referanse: `driftskostnader.mdx` og `netto-leieinntekter.mdx`
  lister `brutto-leieinntekter` i `related:` — artikkelen finnes ikke og
  filtreres stille bort (`article/[slug]/page.tsx:125–129`).
- Kategorier (`src/lib/blog/content.tsx:48–102`): `overview`,
  `getting-started`, `terms`, `for-investors` (0 artikler), `analysis`
  (0 artikler), `valuation` (1 artikkel).
- Frontmatter-mal (fra eksisterende artikler + felter fra plan 009):
  ```yaml
  ---
  title: <tittel>
  publishedAt: <dagens dato YYYY-MM-DD>
  updatedAt: <dagens dato YYYY-MM-DD>
  summary: <unik, ≤160 tegn, med søkeintensjon — IKKE «En omfattende guide til …»>
  author: codehagen
  categories:
    - <kategori-slug>
  related:
    - <2–4 eksisterende slugs>
  slug: <slug>
  faq:
    - question: "…"
      answer: "…"   # 2–3 stk, svar 40–80 ord, står faglig på egne ben
  ---
  ```
- Stil-eksemplar: `src/content/help/hva-er-yield.mdx` (H2-struktur, `<Math>`,
  `<Note>`, interne lenker `[tekst](/help/article/<slug>)`). Prosedyre-
  artikler kan bruke `<Stepper>`; hvis Stepper-en er en genuin steg-for-steg-
  prosedyre kan `howto: true` + `step:`-array legges til (se konvensjonen i
  `content-collections.ts:227–236` — step-teksten MÅ speile synlig innhold).
- **Innholdsregel (forretningskrav)**: INGEN konkrete markedstall
  (yield-nivåer per by, kr/kvm, ledighets-%) — kun kvalitative utsagn og
  åpenbart generiske regneeksempler i formler. Bedriftens markedstall ligger
  bak et internt verifikasjonsflagg og publiseres ikke via kunnskapsartikler.
- **Juridisk forsiktighet**: skatte- og kontraktsartikler (A6, B4, B5) skal
  ha en `<Note variant="warning">` om at innholdet er generell informasjon,
  ikke skatte-/juridisk rådgivning, og at leser bør kontakte
  revisor/advokat for sin konkrete situasjon.
- Søkeordene under er valgt ut fra domenekunnskap, ikke verktøydata —
  valider gjerne mot Google Search Console etter publisering (se
  Maintenance notes).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build (validerer frontmatter + MDX + genererer sider) | `pnpm build` | exit 0 |
| Ordtelling | `wc -w src/content/help/<slug>.mdx` | innenfor spennet i spesifikasjonen |
| Slug-kollisjon | `ls src/content/help/ \| grep <slug>` | 0 treff FØR fila opprettes |
| Lint | — | N/A (`pnpm lint` ødelagt repo-vidt, kjent funn) |

## Scope

**In scope**:
- Nye filer i `src/content/help/` (15 stk, slugs i spesifikasjonen)
- `related:`-frontmatter i eksisterende `src/content/help/*.mdx` (motlenker, steg «Lenkevev» per batch)
- «Sentrale begreper»-listen i `hva-er-naringseiendom.mdx` (kun nye punkter)
- `POPULAR_ARTICLES` i `src/lib/blog/content.tsx` — IKKE endre; kuratert liste, eierens valg

**Out of scope**:
- All kode (ruter, komponenter, schema) — plan 009 eier det
- `src/content/blog/` — plan 012 eier blog/help-grensen
- Kategoridefinisjonene i `HELP_CATEGORIES`

## Git workflow

- Branch: `advisor/011-artikkel-veikart` (én branch, én commit per artikkel)
- Commit-stil: `content(help): ny artikkel — brutto leieinntekter`
- Ikke push / ikke opprett PR uten beskjed fra operatøren.

## Artikkelspesifikasjoner

Skriv i denne rekkefølgen. Felles for alle: norsk bokmål, intro-avsnittet
besvarer søket direkte i de første 50 ordene (featured snippet-format),
2–3 FAQ-poster, summary etter mønsteret i plan 010 steg 2.

### Batch A — fullfør begrepsklyngen (`terms`), 600–900 ord per artikkel

**A1. `brutto-leieinntekter`** — «Brutto leieinntekter»
Søkeord: *brutto leieinntekter næringseiendom*. Tetter den manglende
`related`-referansen. Disposisjon: definisjon; hva inngår (kontraktsleie,
tillegg, parkering/skilt); brutto vs netto med `<Math>`-formel; hvorfor
skillet betyr noe for yield; vanlige feil (glemme ledighet/leierabatter).
`related: netto-leieinntekter, driftskostnader, hva-er-yield`.

**A2. `eierkostnader`** — «Eierkostnader i næringseiendom»
Søkeord: *eierkostnader næringseiendom*. Disposisjon: definisjon; grensen
mot felleskostnader (hva leietaker dekker vs eier); typiske poster
(forsikring, eiendomsskatt, utvendig vedlikehold, forvaltning, eierandel
felleskost ved ledighet); rolle i netto yield; `<Note>` med tommelfingerregel
uten konkrete tall-påstander per marked. `related: driftskostnader,
felleskostnader, netto-leieinntekter`.

**A3. `exit-yield`** — «Exit yield og terminalverdi»
Søkeord: *exit yield*. Disposisjon: definisjon; rollen i DCF
(terminalverdi-formel med `<Math>`); exit yield vs dagens yield (hvorfor
den ofte settes høyere); hvor følsom verdien er for valget (pek til
sensitivitetsanalyse). `related: diskontert-kontantstrom, hva-er-yield,
sensitivitetsanalyse`. Kategori: `terms` OG `valuation` (begge i
categories-arrayen — gir valuation-kategorien sårt tiltrengt innhold).

**A4. `yield-gap`** — «Yield gap: eiendomsyield mot rente»
Søkeord: *yield gap eiendom*. Disposisjon: definisjon (`<Math>`: yield minus
risikofri rente/swap); hvorfor gapet er risikopremien; hvordan renteendringer
presser eiendomsverdier (kvalitativt); hva investor bør se på.
`related: hva-er-yield, exit-yield, diskontert-kontantstrom`.

**A5. `kpi-regulering-av-leie`** — «KPI-regulering av leie»
Søkeord: *kpi regulering husleie næring*. Disposisjon: hva KPI-justering er;
hvordan klausulen typisk er formulert (100 % KPI årlig); regneeksempel med
`<Math>` (generiske tall); hvorfor det betyr mye i kontantstrømsanalyse;
forhandlingspunkter. `related: markedsleie-og-leieniva,
kontantstromsanalyse, brutto-leieinntekter`.

**A6. `leiekontrakter-naringseiendom`** — «Leiekontrakter i næringseiendom: typene du møter»
Søkeord: *leiekontrakt næringslokale*. Disposisjon: standardstruktur
(meglerstandarden); «bare house»-prinsippet; brutto- vs nettoleie;
triple net; varighet og opsjoner; hva som er forhandlbart. Juridisk
`<Note variant="warning">` (se Current state). 900–1200 ord — dette er mer
guide enn begrep. `related: markedsleie-og-leieniva, kpi-regulering-av-leie,
felleskostnader`.

**A7. `arealbegreper-bta-bra`** — «Arealbegreper: BTA, BRA og utleibart areal»
Søkeord: *BTA BRA forskjell*. Disposisjon: definisjonene (BTA, BRA,
utleibart areal/LFA, fellesarealpåslag); hvorfor leie per kvm er meningsløst
uten arealbegrep; regneeksempel; vanlige tvister. `related: markedsleie-og-leieniva, felleskostnader`.

**Lenkevev batch A**: legg nye slugs inn i `related:` hos de eksisterende
artiklene som allerede peker mot temaet (minimum: `driftskostnader` og
`netto-leieinntekter` får `brutto-leieinntekter` til å faktisk virke —
referansen står der allerede; `hva-er-yield` får `exit-yield` og
`yield-gap`; `diskontert-kontantstrom` får `exit-yield`). Utvid «Sentrale
begreper»-listen i `hva-er-naringseiendom.mdx` med A1–A4.

**Verify batch A**: `pnpm build` → exit 0; `ls src/content/help/ | wc -l`
→ 19; hver ny fil innenfor ordspennet.

### Batch B — fyll «For Investorer» (`for-investors`), 1000–1500 ord per artikkel

**B1. `kjope-naringseiendom`** — «Hvordan kjøpe næringseiendom: prosessen steg for steg»
Søkeord: *kjøpe næringseiendom*. Disposisjon: `<Stepper>` med fasene
(strategi/søk → analyse og verdivurdering → bud og intensjonsavtale → due
diligence → SPA/oppgjør → overtakelse); typisk tidslinje; hvem som er
involvert (megler, advokat, takstmann, bank); de vanligste feilene.
Genuin prosedyre → bruk `howto: true` + `step:`-array som speiler Stepper-en.
`related: verdivurdering-av-naringseiendom, due-diligence-naringseiendom,
finansiering-av-naringseiendom`.

**B2. `due-diligence-naringseiendom`** — «Due diligence ved kjøp av næringseiendom»
Søkeord: *due diligence eiendom*. Disposisjon: hva DD er; de fire sporene
(teknisk, juridisk, finansiell, miljø) — hver med sjekkpunkt-liste; røde
flagg; hvordan funn brukes i prisforhandling. `related: kjope-naringseiendom,
verdivurdering-av-naringseiendom, leiekontrakter-naringseiendom`.

**B3. `finansiering-av-naringseiendom`** — «Finansiering av næringseiendom»
Søkeord: *finansiering næringseiendom*. Disposisjon: bankfinansiering og
LTV-begrepet (`<Math>`); rentebinding vs flytende (kvalitativt — INGEN
rentenivå-tall); bankens krav (kontantstrøm, leietakerkvalitet, WAULT —
forklar begrepet); alternative kilder (obligasjon, selgerkreditt); hvordan
gearing påvirker avkastning og risiko. `related: kjope-naringseiendom,
hva-er-yield, kontantstromsanalyse`.

**B4. `aksjekjop-vs-innmatskjop`** — «Aksjekjøp eller innmatskjøp?»
Søkeord: *aksjekjøp innmatskjøp eiendom*. Disposisjon: de to strukturene;
hvorfor de fleste norske transaksjoner er selskapskjøp (dokumentavgift
2,5 % ved innmat — dette er en offentlig sats, OK å oppgi); skattemessige
hovedforskjeller (avskrivningsgrunnlag, latent skatt — kvalitativt);
hva som avtales i praksis (latent skatt-rabatt som forhandlingspunkt,
uten talleksempler); juridisk `<Note variant="warning">`.
`related: kjope-naringseiendom, due-diligence-naringseiendom,
skatt-avskrivninger-naringseiendom`.

**B5. `skatt-avskrivninger-naringseiendom`** — «Skatt og avskrivninger på næringseiendom»
Søkeord: *avskrivning næringseiendom*. Disposisjon: saldogrupper for bygg
og tekniske installasjoner (offentlige satser fra skatteetaten er OK å
oppgi — verifiser gjeldende satser mot skatteetaten.no før skriving, og
datér påstanden i teksten, f.eks. «per 2026»); skillet tomt/bygg/teknisk;
hvordan avskrivninger påvirker kontantstrøm etter skatt; formuesskatt
kvalitativt; juridisk `<Note variant="warning">`.
`related: aksjekjop-vs-innmatskjop, kontantstromsanalyse, eierkostnader`.

**Lenkevev batch B**: `hva-er-naringseiendom.mdx`-seksjonen «Hvordan
investere i næringseiendom» (fra plan 010) lenker til B1, B3 og B4.
`tjene-mer-pa-naringseiendom` får B3 i `related:`.

**Verify batch B**: `pnpm build` → exit 0. Kategorisiden er nå indeksert
automatisk (gatingen fra plan 009 slipper den inn i sitemap):
`pnpm start &` + `curl -s http://localhost:3000/sitemap.xml | grep -c "help/category/for-investors"` → `1`. Drep serveren.

### Batch C — fyll «Markedsanalyse» (`analysis`), 700–1000 ord per artikkel

**VIKTIGST HER**: disse artiklene forklarer METODE, ikke markedsstatus.
Ingen tall for noen by — det er nettopp denne kategorien fristelsen er størst.

**C1. `hvordan-lese-markedsrapport`** — «Hvordan lese en markedsrapport for næringseiendom»
Søkeord: *markedsrapport næringseiendom*. Disposisjon: nøkkeltallene en
rapport inneholder (prime yield, markedsleie, ledighet, transaksjonsvolum)
og hva hvert av dem FORTELLER; fallgruver (små utvalg i små markeder,
asking vs achieved rents); hvordan bruke rapporten i egen analyse. Lenk til
`/markedsinnsikt` som intern CTA i teksten. `related: hva-er-yield,
markedsleie-og-leieniva, prime-yield`.

**C2. `kontorledighet`** — «Kontorledighet: hva tallet betyr»
Søkeord: *kontorledighet*. Disposisjon: definisjon og måling (`<Math>`:
ledig areal / total masse); strukturell vs konjunkturell ledighet; hvordan
ledighet påvirker markedsleie og yield (kvalitativt); hvorfor små markeder
svinger mer i prosent. `related: markedsleie-og-leieniva,
hvordan-lese-markedsrapport`.

**C3. `prime-yield`** — «Prime yield vs sekundær yield»
Søkeord: *prime yield*. Disposisjon: hva «prime» betyr (beste beliggenhet,
beste standard, lang kontrakt, solid leietaker); hvorfor prime yield er
markedets referansepunkt; yield-spread mot sekundæreiendom og hva spreaden
forteller om risikoappetitt; hvordan begrepene brukes i verdivurdering.
`related: hva-er-yield, exit-yield, hvordan-lese-markedsrapport`.

**Lenkevev batch C**: `hva-er-yield` får `prime-yield` i `related:`.

**Verify batch C**: `pnpm build` → exit 0;
`ls src/content/help/*.mdx | wc -l` → 27; sitemap-sjekken fra batch B
gjentatt for `help/category/analysis` → `1`.

## Test plan

Ingen ny kode. `pnpm build` per batch er valideringen (frontmatter-skjema,
MDX-kompilering, statisk generering av alle nye `/help/article/<slug>`-sider).
Kjør `pnpm test` etter siste batch → alle grønne.

## Done criteria

- [ ] 15 nye filer finnes i `src/content/help/` med slugs nøyaktig som spesifisert
- [ ] `pnpm build` exit 0 etter hver batch
- [ ] Ingen ordtelling utenfor spennene i spesifikasjonene
- [ ] Hver ny artikkel har: unik summary (≤160 tegn, ikke guide-formelen),
      `faq:` med 2–3 poster, `related:` med kun eksisterende slugs
- [ ] Lenkevev-stegene utført (grep-sjekk: `grep -l "brutto-leieinntekter" src/content/help/driftskostnader.mdx src/content/help/netto-leieinntekter.mdx` → begge; artikkelen finnes nå så referansen rendres)
- [ ] Markedstall-gaten fra plan 010 (samme grep) kjørt mot ALLE nye filer — kun offentlige satser (dokumentavgift, saldosatser) og generiske regneeksempler
- [ ] `pnpm test` exit 0
- [ ] Statusrad oppdatert i `plans/README.md`

## STOP conditions

- En spesifisert slug finnes allerede i `src/content/help/` (innhold laget
  utenom planen) — rapporter hvilken, ikke overskriv.
- `faq:` eller `publishedAt:` avvises av skjemaet (plan 009 ikke landet) —
  STOP, denne planen avhenger av 009.
- Du mangler faglig sikkerhet på en konkret påstand (særlig B4/B5 skatt):
  utelat påstanden eller formuler den betinget — hvis artikkelen ikke kan
  stå uten, STOP og rapporter hvilken artikkel og hvilken påstand.
- Fristelse til å sitere markedstall for Bodø/Tromsø e.l. — forbudt, se
  innholdsregelen.

## Maintenance notes

- **Etter publisering**: koble Google Search Console-data på artiklene
  etter 4–8 uker; søkeordsvalgene her er domenebaserte estimater og bør
  valideres mot faktiske impressions. Artikler som får impressions men lav
  CTR → juster title/summary. Artikler uten impressions → vurder
  retittlering.
- `POPULAR_ARTICLES` i `src/lib/blog/content.tsx` er kuratert — eieren bør
  vurdere å bytte inn 1–2 av de nye (f.eks. `kjope-naringseiendom`) når
  trafikkdata foreligger.
- Når bedriftens markedstall blir verifisert (internt flagg), kan C-klyngen
  utvides med datadrevne artikler — det er bevisst utenfor denne planen.
- Reviewer per artikkel: norsk språkkvalitet, faglig presisjon i formler,
  at FAQ-svar står på egne ben, ingen markedstall.
