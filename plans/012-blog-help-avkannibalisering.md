# Plan 012: Avkannibaliser blog↔help-duplikatene (sensitivitetsanalyse, DCF)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 5e1c60a..HEAD -- src/content/blog/sensitivitetsanalyse-naringseiendom.mdx src/content/blog/dcf-analyse-naringseiendom.mdx src/content/help/sensitivitetsanalyse.mdx src/content/help/diskontert-kontantstrom.mdx`
> Plan 010 endrer `summary:` i de to help-filene — det er forventet drift.
> Annen drift: sammenlign «Current state»-utdragene før du fortsetter; ved
> avvik, STOP.

## Status

- **Priority**: P2
- **Effort**: S–M
- **Risk**: LOW–MED (retittlering av en publisert blogpost kan midlertidig
  påvirke eksisterende rangering — se Why/Maintenance)
- **Depends on**: none (men kjør etter 010 så summaries ikke redigeres to ganger)
- **Category**: SEO-arkitektur
- **Planned at**: commit `5e1c60a`, 2026-06-12

## Why this matters

To temaer har én artikkel i kunnskapssenteret OG én i bloggen som sikter på
samme søkeord:

1. **Sensitivitetsanalyse**: `help/sensitivitetsanalyse` («Sensitivitetsanalyse
   i næringseiendom») og `blog/sensitivitetsanalyse-naringseiendom»
   («Sensitivitetsanalyse: Hvorfor Det Er Kritisk for Eiendomsinvesteringer»).
   Begge er definisjons-/forklaringsinnhold for *sensitivitetsanalyse
   (nærings)eiendom* — direkte kannibalisering.
2. **DCF**: `help/diskontert-kontantstrom» («Diskontert kontantstrøm (DCF) i
   næringseiendom») og `blog/dcf-analyse-naringseiendom» («DCF-Analyse for
   Næringseiendom: Slik Beregner Du Nåverdi»). Delvis differensiert
   (begrep vs how-to), men titlene/summariene overlapper nok til at Google
   kan rotere mellom dem.

Når to egne URL-er konkurrerer om samme søk, deler de lenkekraft og Google
velger vilkårlig — ofte rangerer ingen av dem godt. Løsningen er IKKE
sletting/redirect (begge sider har verdi og mulige innlenker), men
**rolleavklaring**: help = kanonisk begrepssvar («hva er X»), blog =
praktisk/aktuelt («slik bruker du X», investorvinkel) — med tydelig
kryss-lenking så Google forstår hierarkiet.

## Current state

- `src/content/blog/sensitivitetsanalyse-naringseiendom.mdx` frontmatter:
  ```yaml
  title: "Sensitivitetsanalyse: Hvorfor Det Er Kritisk for Eiendomsinvesteringer"
  publishedAt: 2025-11-05
  summary: Lær hvordan sensitivitetsanalyse hjelper deg forstå risiko og usikkerhet i eiendomsinvesteringer. Praktisk guide med eksempler og tips.
  related:
    - sensitivitetsanalyse
    - dcf-analyse-naringseiendom
  slug: sensitivitetsanalyse-naringseiendom
  ```
- `src/content/blog/dcf-analyse-naringseiendom.mdx` frontmatter:
  ```yaml
  title: "DCF-Analyse for Næringseiendom: Slik Beregner Du Nåverdi"
  publishedAt: 2026-04-15
  summary: Lær hvordan du utfører DCF-analyse (diskontert kontantstrøm) for næringseiendom. Steg-for-steg guide med eksempler og vanlige feil å unngå.
  ```
  Denne har allerede `<ReadMore articles={["diskontert-kontantstrom", "kontantstromsanalyse"]} />`
  på linje ~386.
- `src/content/help/sensitivitetsanalyse.mdx` — begrepsartikkel, 707 ord,
  `<Prerequisites>`-blokk øverst.
- `src/content/help/diskontert-kontantstrom.mdx` — begrepsartikkel, 1023 ord,
  HowTo-schema-pilot.
- Blog-`related:`-slugs kan peke på help-artikler (se sensitivitetsanalyse-
  bloggens `related: sensitivitetsanalyse`) — sjekk hvordan blog-siden
  resolver related før du antar at lenken faktisk rendres
  (`src/app/(blog)/`-rutene; hvis blog-related kun slår opp i
  `allBlogPosts`, filtreres help-slugs stille bort — i så fall er
  kryss-lenkingen i brødtekst eneste reelle lenke, noter funnet i
  statusraden).
- Konvensjon: interne lenker i MDX-brødtekst skrives
  `[ankertekst](/help/article/<slug>)`.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build | `pnpm build` | exit 0 |
| Kryss-lenke-grep | `grep -c "/help/article/sensitivitetsanalyse" src/content/blog/sensitivitetsanalyse-naringseiendom.mdx` | ≥ 1 etter steg 2 |
| Lint | — | N/A (`pnpm lint` ødelagt repo-vidt, kjent funn) |

## Scope

**In scope** (de eneste filene du endrer):
- `src/content/blog/sensitivitetsanalyse-naringseiendom.mdx`
- `src/content/blog/dcf-analyse-naringseiendom.mdx`
- `src/content/help/sensitivitetsanalyse.mdx` (kun ett kryss-lenke-avsnitt)
- `src/content/help/diskontert-kontantstrom.mdx` (kun ett kryss-lenke-avsnitt)

**Out of scope**:
- Redirects/sletting av noen av de fire sidene — bevisst valgt bort.
- Andre blogposter (f.eks. `kjope-vs-leie-naringseiendom`) — ingen påvist
  kannibalisering i dag.
- Blog-rutenes kode (hvordan `related` resolves) — observer og rapporter,
  ikke fiks.

## Git workflow

- Branch: `advisor/012-avkannibalisering`
- Commit-stil: `content(seo): rolleavklaring blog/help — sensitivitetsanalyse + DCF`
- Ikke push / ikke opprett PR uten beskjed fra operatøren.

## Steps

### Steg 1: Differensier sensitivitetsanalyse-blogposten

I `src/content/blog/sensitivitetsanalyse-naringseiendom.mdx`:

1. Retittler mot investor-/beslutningsintensjon i stedet for
   begrepsintensjon:
   - `title:` → `"Slik stressetester du en eiendomsinvestering med sensitivitetsanalyse"`
   - `summary:` → `"Hva skjer med verdien hvis yield stiger eller leien faller? Slik bruker du sensitivitetsanalyse til å stressteste en eiendomsinvestering før du kjøper."`
2. Les gjennom innledningen (de første 2–3 avsnittene): hvis den åpner med
   en «hva er sensitivitetsanalyse»-definisjon, kort den ned til én setning
   som lenker definisjonen bort: `[sensitivitetsanalyse](/help/article/sensitivitetsanalyse)`
   — og la blogposten gå rett på den praktiske vinkelen.
3. Sørg for at brødteksten har minst én lenke til
   `/help/article/sensitivitetsanalyse` med beskrivende ankertekst.

**NB**: slug-en `sensitivitetsanalyse-naringseiendom` skal IKKE endres
(URL-en er publisert og kan ha innlenker).

**Verify**: `pnpm build` → exit 0; kryss-lenke-grep → ≥ 1.

### Steg 2: Differensier DCF-blogposten (lettere touch)

I `src/content/blog/dcf-analyse-naringseiendom.mdx`:

1. Tittel/summary er allerede how-to-vinklet — behold tittelen. Juster KUN
   hvis innledningen åpner med ren definisjon: som i steg 1, én setning +
   lenke til `[diskontert kontantstrøm](/help/article/diskontert-kontantstrom)`,
   så videre til det praktiske.
2. Sørg for minst én brødtekst-lenke til
   `/help/article/diskontert-kontantstrom` (ReadMore-komponenten nederst
   finnes, men en kontekstuell lenke tidlig i teksten er sterkere signal).

**Verify**: `grep -c "/help/article/diskontert-kontantstrom" src/content/blog/dcf-analyse-naringseiendom.mdx` → ≥ 1; `pnpm build` → exit 0.

### Steg 3: Motlenker fra help-artiklene

1. I `src/content/help/sensitivitetsanalyse.mdx`: legg til ett kort avsnitt
   (2–3 setninger) sent i artikkelen, f.eks. under en passende eksisterende
   H2, som peker til den praktiske blogposten:
   `Vil du se metoden brukt på en konkret investeringscase? Les [slik stressetester du en eiendomsinvestering](/blog/sensitivitetsanalyse-naringseiendom).`
2. Tilsvarende i `src/content/help/diskontert-kontantstrom.mdx` →
   `[steg-for-steg-guiden til DCF-beregning](/blog/dcf-analyse-naringseiendom)`.
3. Verifiser blog-URL-formatet før du lenker: sjekk én eksisterende
   blog-lenke i kodebasen (`grep -rn '"/blog/' src/content/ | head -3`) —
   bruk samme path-form.

**Verify**: `pnpm build` → exit 0;
`grep -c "/blog/sensitivitetsanalyse-naringseiendom" src/content/help/sensitivitetsanalyse.mdx` → ≥ 1;
`grep -c "/blog/dcf-analyse-naringseiendom" src/content/help/diskontert-kontantstrom.mdx` → ≥ 1.

### Steg 4: Dokumentér rollegrensen

Ikke rediger `AUTHORING.md` (out of scope). Skriv i stedet rollegrensen som
en kort note i din statusrad i `plans/README.md`: «Regel etablert: help =
kanonisk begrep («hva er X»), blog = praktisk/aktuelt — nye temaer skal
ikke dekkes begge steder uten denne differensieringen.» Eieren kan løfte
regelen inn i AUTHORING.md senere.

## Test plan

Ingen ny kode. `pnpm build` validerer MDX. `pnpm test` til slutt → grønne.

## Done criteria

- [ ] `pnpm build` exit 0
- [ ] Ny tittel/summary i sensitivitetsanalyse-blogposten, slug uendret
      (`grep "slug: sensitivitetsanalyse-naringseiendom" src/content/blog/sensitivitetsanalyse-naringseiendom.mdx` → 1 treff)
- [ ] Alle fire kryss-lenke-greps (steg 1–3) ≥ 1
- [ ] `pnpm test` exit 0
- [ ] `git status`: ingen endringer utenfor in-scope-listen
- [ ] Statusrad oppdatert i `plans/README.md` med rollegrense-notatet

## STOP conditions

- Frontmatter i blog-filene matcher ikke utdragene i «Current state» (drift).
- Blogpostens brødtekst viser seg å være noe annet enn antatt (f.eks. en
  ren duplikat av help-artikkelen) — da er riktig grep kanskje
  konsolidering/redirect i stedet; rapporter i stedet for å improvisere.
- Blog-URL-strukturen er ikke `/blog/<slug>` (steg 3.3-sjekken feiler) —
  rapporter funnet path-format.

## Maintenance notes

- Retittlering av en publisert post kan gi noen ukers rangeringsstøy for
  den posten — forventet og akseptert; den gamle tittelen konkurrerte
  uansett med help-artikkelen.
- Følg med i Search Console: målet er at `/help/article/sensitivitetsanalyse`
  overtar «hva er»-søkene og blogposten fanger «hvordan/stressteste»-søk.
  Hvis begge fortsatt roterer på samme søk etter ~8 uker, eskaler til
  konsolidering (redirect blog → help) som egen beslutning.
- Plan 011 skriver nye artikler — rollegrensen herfra gjelder dem: ingen ny
  blogpost skal gjenbruke en help-artikkels «hva er X»-vinkel.
