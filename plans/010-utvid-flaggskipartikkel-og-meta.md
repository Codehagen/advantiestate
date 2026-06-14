# Plan 010: Gjør «Hva er næringseiendom» til en ekte pilarside + skriv om svake meta descriptions

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 5e1c60a..HEAD -- src/content/help/`
> Hvis filer i `src/content/help/` er endret siden `5e1c60a`, sammenlign
> «Current state»-utdragene mot live kode før du fortsetter; ved avvik er
> det en STOP-betingelse. NB: plan 009 endrer `author:`-linjen og legger
> `faq:` i `hva-er-yield.mdx` — DE endringene er forventet drift, ikke STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW (kun innholdsfiler; ingen kode)
- **Depends on**: plans/009-help-seo-tekniske-fikser.md (for `faq`- og `publishedAt`-feltene)
- **Category**: docs/innhold (SEO)
- **Planned at**: commit `5e1c60a`, 2026-06-12

## Why this matters

`hva-er-naringseiendom` er kuratert som mest populære artikkel
(`POPULAR_ARTICLES[0]` i `src/lib/blog/content.tsx:40–46`) og har tittelen
«Hva er næringseiendom? En komplett guide» — men brødteksten er **292 ord**.
Tittelen lover en komplett guide; Google får tre avsnitt. For søkeordet
«hva er næringseiendom» konkurrerer siden mot 1500–3000-ords pilarsider hos
nasjonale aktører. I tillegg starter 5 av 12 artikkel-summaries (som blir
meta descriptions OG SERP-snippets) med samme formel («En omfattende/
dyptgående/detaljert guide til …») — utskiftbare snippets uten søkeintensjon.
Denne planen utvider flaggskipet til en ekte pilarside og gir hver artikkel
en unik, klikkverdig meta description.

## Current state

- `src/content/help/hva-er-naringseiendom.mdx` — 292 ord brødtekst.
  Frontmatter i dag (etter plan 009 er `author` rettet til `codehagen`):
  ```yaml
  ---
  title: "Hva er næringseiendom? En komplett guide"
  slug: "hva-er-naringseiendom"
  summary: "Lær alt om hva næringseiendom er, de ulike kategoriene, og hva som skiller det fra boligeiendom. En guide for investorer og bedrifter."
  categories: ["overview"]
  author: codehagen
  publishedAt: "2024-01-25"
  updatedAt: "2024-01-25"
  images: ["/building/pexels-pixabay-248877.jpg"]
  ---
  ```
  Struktur i dag: intro-avsnitt, «## Hovedkategorier av næringseiendom»
  med fire korte `###`-underseksjoner (kontor, handel, lager, kombinasjon),
  og en kort avslutning. Ingen `related:`-frontmatter, ingen MDX-komponenter.
- Formelaktige summaries (eksakte verdier i dag, fil → summary-start):
  - `diskontert-kontantstrom.mdx` → «En dyptgående guide til diskontert kontantstrøm-analyse (DCF) …»
  - `driftskostnader.mdx` → «En omfattende guide til å forstå driftskostnader …»
  - `felleskostnader.mdx` → «En detaljert guide om felleskostnader …»
  - `hva-er-yield.mdx` → «En omfattende guide til å forstå yield …»
  - `kontantstromsanalyse.mdx` → «En omfattende guide til å forstå kontantstrømsanalyse …»
  - `sensitivitetsanalyse.mdx` → «En omfattende guide til sensitivitetsanalyse …»
  - `markedsleie-og-leieniva.mdx` → «En grundig gjennomgang av markedsleie …»
- Stil-eksemplar for help-artikler: `src/content/help/hva-er-yield.mdx` —
  H2-struktur («Hva er X», «Grunnleggende om X», praksis-seksjoner),
  `<Math formula="…" description="…" />` for formler, `<Note variant="info">`
  for tommelfingerregler, interne lenker som `[yield](/help/article/hva-er-yield)`.
  Tilgjengelige MDX-komponenter (fra `src/components/blog/mdx.tsx`): `Math`,
  `Note`, `Stepper`, `Prerequisites`, `Example`, `Compare`, `Fact`,
  `StatStrip`, `ReadMore`. Tabeller via GFM støttes.
- Språk: norsk bokmål. H2-overskrifter genererer ToC automatisk
  (`tableOfContents` fra H2 i `content-collections.ts`).

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Build (validerer frontmatter + MDX) | `pnpm build` | exit 0 |
| Ordtelling | `wc -w src/content/help/hva-er-naringseiendom.mdx` | ≥ 1500 |
| Formel-grep | `grep -c "En omfattende guide\|En dyptgående guide\|En detaljert guide\|En grundig gjennomgang" src/content/help/*.mdx \| grep -v ":0"` | ingen treff (alle filer :0) |
| Lint | — | N/A (`pnpm lint` ødelagt repo-vidt, kjent funn) |

## Scope

**In scope** (de eneste filene du endrer):
- `src/content/help/hva-er-naringseiendom.mdx` (full omskriving av brødtekst + frontmatter-utvidelse)
- Summary-linjen (KUN den) i: `diskontert-kontantstrom.mdx`,
  `driftskostnader.mdx`, `felleskostnader.mdx`, `hva-er-yield.mdx`,
  `kontantstromsanalyse.mdx`, `sensitivitetsanalyse.mdx`,
  `markedsleie-og-leieniva.mdx`

**Out of scope** (IKKE rør):
- Brødteksten i de 7 summary-filene — kun frontmatter-summary endres.
- Alt under `src/app/` og `src/components/` — null kodeendringer i denne planen.
- `src/content/blog/` — blog/help-overlapp håndteres i plan 012.
- Nye artikler — det er plan 011.

## Git workflow

- Branch: `advisor/010-flaggskip-pilarside`
- Commit-stil: `content(help): utvid hva-er-naringseiendom til pilarside` og
  `content(help): unike meta descriptions for 7 artikler`
- Ikke push / ikke opprett PR uten beskjed fra operatøren.

## Steps

### Steg 1: Utvid hva-er-naringseiendom.mdx til pilarside (≥1500 ord)

Skriv om brødteksten etter denne disposisjonen. Behold tittel og slug
uendret. Skriv på norsk bokmål, saklig og konkret — matchende tonen i
`hva-er-yield.mdx`.

**KRITISK INNHOLDSREGEL**: Ikke oppgi konkrete markedstall (yield-nivåer,
leiepriser, ledighet, transaksjonsvolum) for noen by. Bedriftens regel er at
markedstall kun publiseres fra verifiserte kilder bak et internt
verifikasjonsflagg. Kvalitative utsagn («sentralt beliggende kontoreiendom
prises med lavere yield enn …») er OK; tall er IKKE OK.

Disposisjon (H2-er blir ToC — bruk disse):

1. **Intro (uten overskrift, 60–90 ord)** — direkte definisjonssvar først
   (optimalisert for featured snippet): hva næringseiendom er, formålet
   (huse virksomhet eller generere leieinntekter), kontrast til bolig.
2. **## Hovedkategorier av næringseiendom** — utvid dagens fire `###` til
   seks, hver 80–130 ord: Kontoreiendom, Handelseiendom (retail), Lager og
   logistikk, Kombinasjonseiendom, Hotell og overnatting, Spesialeiendom
   (industri, parkering, helse/offentlig formålsbygg).
3. **## Hva skiller næringseiendom fra boligeiendom?** — GFM-tabell med
   dimensjonene: leiekontraktens lengde (typisk 5–15 år vs 1–3),
   leiejustering (KPI-regulering), partene (profesjonelle), verdsettelse
   (yield/kontantstrøm vs sammenlignbare salg), finansiering, MVA
   (frivillig registrering). Kort prosa rundt tabellen.
4. **## Hvordan verdsettes næringseiendom?** — kort (150–200 ord), pek
   videre med lenker: `[yield](/help/article/hva-er-yield)`,
   `[diskontert kontantstrøm](/help/article/diskontert-kontantstrom)`,
   `[verdivurdering av næringseiendom](/help/article/verdivurdering-av-naringseiendom)`.
   Inkluder grunnformelen med `<Math formula="\text{Markedsverdi} = \frac{\text{Netto leieinntekter}}{\text{Yield}}" description="Yield-basert verdsettelse — den vanligste metoden" />`.
5. **## Hvordan investere i næringseiendom** — 200–250 ord: direktekjøp,
   kjøp av eiendomsselskap (aksjer vs innmat — nevn kort), syndikat/fond.
   `<Note variant="info">` om at de fleste transaksjoner i Norge skjer som
   selskapskjøp.
6. **## Næringseiendom i Nord-Norge** — 120–180 ord, kvalitativt: mindre og
   mer konsentrerte markeder, betydningen av lokalkunnskap, Bodø/Tromsø som
   regionale tyngdepunkt. INGEN tall (se innholdsregelen).
7. **## Sentrale begreper** — punktliste der hvert punkt lenker til en
   eksisterende begrepsartikkel: yield, netto leieinntekter,
   driftskostnader, felleskostnader, markedsleie, kontantstrømsanalyse,
   sensitivitetsanalyse. (Kun slugs som finnes i `src/content/help/` —
   verifiser med `ls`.)
8. Avslutt med ett kort avsnitt som naturlig peker mot
   `[verdivurdering](/tjenester/verdivurdering)` — IKKE en hard salgspitch;
   sidemalen har allerede CTA-strip.

Frontmatter-endringer:
- `summary:` → `"Næringseiendom er eiendom som brukes til virksomhet eller utleie — kontor, handel, lager og mer. Lær kategoriene, verdidriverne og hvordan markedet fungerer."`
- Behold `publishedAt: "2024-01-25"`, sett `updatedAt:` til dagens dato
  (`date +%F`).
- Legg til:
  ```yaml
  related:
    - hva-er-yield
    - verdivurdering-av-naringseiendom
    - markedsleie-og-leieniva
  faq:
    - question: "Hva regnes som næringseiendom?"
      answer: "Eiendom som primært brukes til næringsvirksomhet eller utleie til virksomheter: kontorbygg, butikklokaler, lager- og logistikkbygg, hoteller, kombinasjonsbygg og spesialeiendom. Boligutleie i stor skala kan også drives som næring, men selve boligeiendommen kategoriseres normalt ikke som næringseiendom."
    - question: "Er det lurt å investere i næringseiendom?"
      answer: "Næringseiendom gir typisk lengre leiekontrakter og mer forutsigbar kontantstrøm enn bolig, men krever større kapital, mer kompetanse og innebærer høyere risiko ved ledighet. En grundig verdivurdering og forståelse av yield og kontantstrøm er forutsetninger for en god investering."
    - question: "Hva er forskjellen på næringseiendom og boligeiendom?"
      answer: "De viktigste forskjellene er leiekontraktens lengde og struktur, at partene er profesjonelle, at verdien beregnes ut fra leieinntektene (yield), og at utleie av næringslokaler kan registreres frivillig i MVA-registeret."
  ```
  (`faq`-feltet finnes etter plan 009 — verifiser at `faq:` er definert i
  `HelpPost`-skjemaet i `content-collections.ts` før du bruker det; hvis
  ikke, STOP.)

**Verify**:
`pnpm build` → exit 0.
`wc -w src/content/help/hva-er-naringseiendom.mdx` → ≥ 1500.

### Steg 2: Skriv om de 7 formelaktige summaries

Erstatt KUN `summary:`-verdien i hver fil med teksten under (≤160 tegn,
unik, med intensjon — verifisert mot artiklenes faktiske innhold):

| Fil | Ny summary |
|-----|-----------|
| `hva-er-yield.mdx` | `Yield er forholdet mellom netto leieinntekter og eiendomsverdi. Lær hvordan du beregner yield, tolker nivåene og bruker den til å sammenligne eiendommer.` |
| `diskontert-kontantstrom.mdx` | `DCF-analyse verdsetter næringseiendom ut fra fremtidige kontantstrømmer. Steg for steg: kontantstrøm, diskonteringsrente, terminalverdi og nåverdi.` |
| `driftskostnader.mdx` | `Driftskostnader avgjør hva du faktisk sitter igjen med. Se hvilke kostnader som inngår, typiske nivåer, og hvordan de påvirker yield og verdi.` |
| `felleskostnader.mdx` | `Felleskostnader fordeles mellom leietakerne og påvirker totalprisen på leieforholdet. Slik beregnes, fordeles og optimaliseres de i næringsbygg.` |
| `kontantstromsanalyse.mdx` | `Kontantstrømsanalyse viser hva en næringseiendom faktisk genererer. Lær oppsettet fra brutto leieinntekter til netto kontantstrøm — med formler.` |
| `sensitivitetsanalyse.mdx` | `Hvor robust er eiendomsverdien hvis yield eller leie endrer seg? Sensitivitetsanalyse viser hvilke forutsetninger som betyr mest for verdien.` |
| `markedsleie-og-leieniva.mdx` | `Markedsleie er leien et lokale oppnår ved ny utleie i dagens marked. Lær hva som driver leienivåene og hvordan markedsleie fastsettes i praksis.` |

**Verify**:
`pnpm build` → exit 0.
`grep -l "En omfattende guide\|En dyptgående guide\|En detaljert guide\|En grundig gjennomgang" src/content/help/*.mdx` → ingen filer.

## Test plan

Ingen ny kode → ingen nye enhetstester. Innholdsvalidering skjer via
content-collections-kompileringen i `pnpm build` (frontmatter-skjema +
MDX-kompilering). Kjør i tillegg `pnpm test` til slutt → alle grønne.

## Done criteria

- [ ] `pnpm build` exit 0
- [ ] `wc -w src/content/help/hva-er-naringseiendom.mdx` ≥ 1500
- [ ] Grep-gaten for guide-formuleringer gir 0 filer
- [ ] Alle interne lenker i den nye pilarteksten peker på slugs som finnes
      (`ls src/content/help/` + manuell kryssjekk; ingen lenke til
      ikke-eksisterende artikkel)
- [ ] Ingen konkrete markedstall (yield-%, kr/kvm, ledighets-%) i ny tekst:
      `grep -nE "[0-9]+ ?(%|kr/kvm|prosent)" src/content/help/hva-er-naringseiendom.mdx`
      → gjennomgå hvert treff; kun generiske regneeksempler (åpenbart
      fiktive, runde tall i formel-kontekst) er tillatt, ingen by-spesifikke
      markedspåstander
- [ ] `pnpm test` exit 0
- [ ] `git status`: ingen endringer utenfor in-scope-listen
- [ ] Statusrad oppdatert i `plans/README.md`

## STOP conditions

- `faq:`-feltet finnes ikke i `HelpPost`-skjemaet (plan 009 ikke utført) —
  utfør da steg 1 UTEN faq-blokken, noter det i statusraden, og rapporter.
- En summary-fil har annen `summary:`-tekst enn den siterte (drift) —
  rapporter i stedet for å gjette.
- `pnpm build` feiler to ganger på MDX-kompilering etter rimelige fiksforsøk.
- Du blir fristet til å oppgi et konkret markedstall for å gjøre teksten
  bedre — ikke gjør det; det er en forretningsregel, ikke en stilpreferanse.

## Maintenance notes

- Pilarsiden lenker til begrepsklyngen; når plan 011 lander nye
  begrepsartikler (eierkostnader, exit yield, …), bør «Sentrale begreper»-
  listen utvides — nevnt i plan 011 som motlenke-steg.
- Reviewer bør sjekke: norsk språkkvalitet, at FAQ-svarene står faglig på
  egne ben (de vises som rich results uten kontekst), og at ingen
  markedstall snek seg inn.
- Bevisst utsatt: utvidelse av de andre korte artiklene (424–760 ord) — de
  er begrepsartikler der 600–900 ord er riktig format; lengde for lengdens
  skyld er ikke målet.
