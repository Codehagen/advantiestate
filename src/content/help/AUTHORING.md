# Best practice — hjelpeartikler (kunnskapssenter)

Referanse for redaktører og AI-assistenter (Claude) som skriver eller oppdaterer
artikler i `src/content/help/`. Den redaksjonelle standarden er fastsatt i
designkilden **`HJELPEARTIKKEL-ANATOMI`** (Advanti design, juni 2026). Denne fila
oversetter den til vår faktiske kodebase.

Komponentene bor i `src/components/blog/mdx.tsx` (klasser i
`src/styles/advanti-design.css`). Sidemalen som rammer inn artikkelen bor i
`src/app/(help)/help/article/[slug]/page.tsx`. Se også bloggens
[`AUTHORING.md`](../blog/AUTHORING.md) — kunnskapssenteret bruker **samme**
redaksjonelle komponentbibliotek.

> **Hjelpeartikkel ≠ blogg.** Bloggen åpner med et stort stemningsbilde.
> En hjelpeartikkel åpner rett på svaret — leseren er kommet for å lære noe.
> Ikke legg hero-bilde øverst.

---

## Gullregelen

> Hver artikkel veksler mellom **prosa og komponenter**, med luft rundt.
> Ser du en fet etikett etterfulgt av en punktliste — stopp. Det finnes nesten
> alltid en komponent som gjør det bedre.

---

## Hva sidemalen lager for deg (ikke skriv dette i MDX)

Disse delene rendres automatisk fra frontmatter / sidemalen. Du skal **ikke**
lage dem i brødteksten:

| Del | Kilde | Felt |
|---|---|---|
| Brødsmuler | navigasjonsregister | `categories` + `slug` |
| Metalinje (kategori · lesetid · «Sist oppdatert» med grønn pip) | frontmatter | `categories`, auto-lesetid, `updatedAt` |
| Tittel (H1) | frontmatter | `title` |
| Ingress | frontmatter | `summary` |
| Forfatter (avatar + navn + rolle) | `HELP_AUTHORS` | `author` |
| **Kort fortalt** (romertall-takeaways, øverst) | frontmatter | `takeaways` |
| Innholdsfortegnelse + kategori-rail | utledet | H2-er + `categories` |
| Tilbakemelding («Var dette nyttig?») | sidemal | — |
| Forrige / Neste | sidemal | kategori-sekvens |
| Relaterte artikler («Les videre i {kategori}») | frontmatter | `related` |
| Avsluttende CTA-strip + nyhetsbrev | sidemal | — |

Brødteksten din starter altså med **åpningsprosa**, ikke med tittel/ingress.

---

## Anatomien — rekkefølge ovenfra og ned

Dette er den anbefalte rekkefølgen for en modellartikkel. Frontmatter-deler er
merket (FM); resten skriver du i MDX-brødteksten.

1. Brødsmuler *(auto)*
2. Metalinje *(auto — `updatedAt` driver «Sist oppdatert»)*
3. Tittel H1 — konkret hovedbegrep + kursiv etterledd, ≤ ~60 tegn *(FM `title`)*
4. Ingress — én setning, 20–30 ord, speiler `meta description` *(FM `summary`)*
5. Forfatter *(FM `author`)*
6. **Kort fortalt** — 3–4 skannbare takeaways *(FM `takeaways`)*
7. **Åpningsprosa + `<Prerequisites>`** — ett avsnitt som rammer problemet, så en
   «Forutsetninger»-boks som lenker til begrepene artikkelen bygger på.
8. **`## H2` + prosa + `<Math>`** — hver seksjon åpner med en H2 og minst ett
   avsnitt prosa før en komponent dukker opp.
9. Prosa + `<Example>` — konkret regneeksempel med uthevet resultatrad.
10. `<Note>` — nøytral presisering ved siden av brødteksten.
11. `## H2` + `<Stepper>` — sekvensiell prosess / «N grep».
12. **`<ReadMore>`** — kuratert «Les videre»: interne kunnskapsartikler **pluss
    minst én kryss-lenke til en blogg-artikkel**.
13. `<CTA>` — én tydelig oppfordring koblet til artikkelens tema.
14. Tilbakemelding + Forrige/Neste + relaterte *(auto)*

---

## Komponentvelger — når bruker jeg hva

| Situasjon | Bruk | Ikke bruk |
|---|---|---|
| 3–4 nøkkelpoeng leseren skal ta med seg | `takeaways:` (FM) → «Kort fortalt» | fet punktliste |
| 2–6 nøkkelpunkter midt i artikkelen | `<Summary>` | fet punktliste |
| Begreper artikkelen bygger på | `<Prerequisites>` | parentes i prosa |
| 2–4 harde tall som setter premisset | `<StatStrip>` | tabell med én rad |
| Definere et fagbegrep første gang | `<Fact>` | parentes i brødteksten |
| En matematisk formel | `<Math>` / `<Formula>` | inline `kode` |
| Et regnestykke med resultat | `<Example>` | tabell uten resultatrad |
| En sekvensiell prosess / «N grep» | `<Stepper>` | `### 1.`-overskrifter |
| En presisering eller et forbehold | `<Note>` | fet tekst i avsnitt |
| To sider av en avgjørelse | `<Compare>` | to punktlister etter hverandre |
| Kronologi / markedshistorikk | `<Timeline>` | tabell med datoer |
| Bilde som trenger kontekst | `<Figure>` | rått `![]()` |
| Videre lesning (inkl. blogg) | `<ReadMore>` | løse lenker i en liste |
| Avslutning med oppfordring | `<CTA>` | «ta kontakt på …» i prosa |

## Callout-disiplin

`<Note>` har fire **kanoniske** varianter. Bruk dem sparsomt — som regel holder
den nøytrale.

- **(standard)** → nøytral presisering. Etikett: «Merk».
- `variant="key"` → det viktigste poenget på siden. Etikett: «Viktig».
- `variant="caution"` → forbehold, risiko, datakvalitet. Etikett: «Vær oppmerksom».
- `variant="positive"` → konklusjon / hovedpoeng. Etikett: «Konklusjon».

Maks **én** `key`-callout per artikkel. Hvis alt er viktig, er ingenting det.

> **Eldre varianter finnes fortsatt** (`info`, `success`, `warning`) og virker via
> aliaser, men er **frarådet** i ny/oppdatert tekst. Mapping ved opprydding:
> `info` → fjern (nøytral er standard) · `success` → `positive` · `warning` → `caution`.

---

## Rytme & mengde tekst

| Regel | Mål | Hvorfor |
|---|---|---|
| Mellom to komponenter | ≥ 1 avsnitt prosa | Stable aldri formel + eksempel + note rett på hverandre. |
| Per H2-seksjon | 150–250 ord | Åpne med prosa som rammer poenget før komponenten leverer det. |
| Avsnittslengde | 2–4 setninger | Korte avsnitt skanner bedre. Ett poeng per avsnitt. |
| Total lengde | 600–1200 ord | Et oppslag/begrep kan være kortere; en flaggskip-guide lengre. |
| «Kort fortalt» | 3–4 punkter | Alltid øverst, alltid skannbart. |

Tynt eller duplisert innhold straffes av Google. Er en artikkel under ~450 ord og
ikke et rent begreps-oppslag, fyll den ut før den indekseres.

---

## Lenking — fem steder en artikkel peker videre

1. **Toppen — `<Prerequisites>`**: 2–4 interne lenker til begrepene artikkelen bygger på.
2. **I brødteksten — første omtale**: lenk fagbegrepet til definisjonsartikkelen
   *én* gang (ikke hver gang).
3. **Etter innholdet — `<ReadMore>`**: kuratert liste — relaterte kunnskapsartikler
   **+ minst én blogg-kryss-lenke**.
4. **Bunnen — Forrige/Neste + relaterte** *(auto fra `related`)*: følger kategori-sekvensen.
5. **Avslutning — `<CTA>` → tjeneste**: konverteringspunktet.

**Gjør:** beskrivende ankertekst («Hva er yield»), tematiske klynger rundt en
pilar-artikkel, alltid kanonisk URL (`/help/article/<slug>`).
**Unngå:** «klikk her», samme begrep lenket fem ganger, blindveier (hver artikkel
skal ha minst tre veier videre).

> Den automatiske «Les videre i {kategori}»-ruten nederst viser **kun
> kunnskapsartikler**. Blogg-kryss-lenken må derfor ligge i en `<ReadMore>` i
> brødteksten — det er det eneste stedet bloggen kobles inn.

---

## Frontmatter

Hold deg til skjemaet i `content-collections.ts` (`HelpPost`):

```yaml
---
title: "Sensitivitetsanalyse i næringseiendom"   # H1 + <title>
updatedAt: 2026-06-15                              # «Sist oppdatert» — ekte dato
publishedAt: 2025-02-18                            # valgfri original publisering
summary: "Test hvordan endringer i yield, leie og ledighet slår ut på verdien …"
author: codehagen                                  # nøkkel i HELP_AUTHORS (codehagen | vsoraas)
categories:
  - valuation                                      # gyldig HELP-kategori, ellers notFound()
takeaways:                                         # 3–4 punkter → «Kort fortalt»
  - Første nøkkelpoeng, står på egne ben.
  - Andre nøkkelpoeng.
  - Tredje nøkkelpoeng.
related:                                            # interne slugs → relatert-rutenett
  - diskontert-kontantstrom
  - hva-er-yield
faq:                                               # valgfri, min. 2 → FAQPage JSON-LD
  - question: "…?"
    answer: "…"
slug: sensitivitetsanalyse
---
```

Gyldige `categories`: `overview`, `getting-started`, `terms`, `analysis`,
`valuation`, `for-investors`. Lesetid beregnes automatisk fra ordtelling.

---

## Sjekkliste før publisering

- [ ] **Én H1** — konkret hovedbegrep + kursiv etterledd, ≤ 60 tegn *(FM `title`)*
- [ ] **Ingress** — 20–30 ord, speiler `summary`/meta description, ingen «I denne artikkelen …»
- [ ] **`takeaways`** — 3–4 punkter satt i frontmatter
- [ ] **`<Prerequisites>`** — åpner med lenker til begrepene artikkelen bygger på
- [ ] **Rytme** — ingen to komponenter uten prosa imellom
- [ ] **Komponenter** — ingen fet etikett + punktliste der en komponent passer
- [ ] **Note** — kanoniske varianter, maks én «Viktig» (`key`)
- [ ] **Bilder** — forklarende, med alt-tekst + bildetekst; intet dekor-hero
- [ ] **`<ReadMore>`** — interne lenker + minst én blogg-kryss-lenke
- [ ] **`<CTA>`** — én oppfordring koblet til temaet
- [ ] **Frontmatter** — alle påkrevde felt, gyldig kategori og slug
- [ ] **Lengde** — 600–1200 ord (begreps-oppslag kan være kortere)
- [ ] **`updatedAt`** — ekte dato, ikke kunstig bumpet

---

## Migreringsarbeidsflyt — slik løfter du én eksisterende artikkel

1. **Les artikkelen** og kjør den mot sjekklisten over.
2. **Legg til `takeaways`** (3–4 punkter) i frontmatter hvis de mangler.
3. **Legg til `<Prerequisites>`** øverst i brødteksten for begrepsartikler, med
   2–4 lenker til forutsetningene.
4. **Rydd Note-varianter**: `success`→`positive`, `warning`→`caution`,
   `info`→ fjern (nøytral).
5. **Legg til `<ReadMore>`** før `<CTA>` med interne lenker + **én blogg-lenke**.
6. **Konverter fete punktlister** til riktig komponent (Summary/Example/Stepper/…).
7. **Sjekk rytmen** — ett avsnitt prosa mellom hver komponent.
8. **Fyll ut tynne artikler** (< ~450 ord) eller sett dem som ufullstendige.
9. **Bekreft `updatedAt`** til faktisk endringsdato.
10. **Bygg** (`pnpm build`) — TS- og kategori-feil stopper bygget.

Referanseimplementasjon: `sensitivitetsanalyse.mdx` (modellartikkelen i designkilden).

---

## Migreringsstatus (per juni 2026)

Revisjon av alle 27 artikler. ✓ = på plass, — = mangler.

| Artikkel | Kort fortalt | Forutsetn. | Blogg-lenke (ReadMore) | Note-rydding | Ord | Merk |
|---|:--:|:--:|:--:|:--:|--:|---|
| sensitivitetsanalyse | ✓ | ✓ | ✓ | ✓ | 700+ | **modell — ferdig** |
| verdivurdering-av-naringseiendom | ✓ | — | — | — | 426 | har takeaways; tynn |
| diskontert-kontantstrom | — | ✓ | — | — | 769 | |
| netto-leieinntekter | — | ✓ | — | — | 369 | tynn |
| hva-er-naringseiendom | — | — | — | — | 1369 | kun Math+Note; trenger komponenter |
| finansiering-av-naringseiendom | — | — | — | — | 1043 | |
| due-diligence-naringseiendom | — | — | — | — | 1038 | |
| skatt-avskrivninger-naringseiendom | — | — | — | — | 1006 | |
| aksjekjop-vs-innmatskjop | — | — | — | — | 998 | egnet for `<Compare>` |
| kjope-naringseiendom | — | — | — | — | 990 | |
| leiekontrakter-naringseiendom | — | — | — | — | 914 | |
| kontorledighet | — | — | — | — | 891 | |
| prime-yield | — | — | — | — | 889 | |
| hvordan-lese-markedsrapport | — | — | — | — | 794 | |
| eierkostnader | — | — | — | — | 576 | |
| kpi-regulering-av-leie | — | — | — | — | 582 | |
| brutto-leieinntekter | — | — | — | — | 617 | |
| yield-gap | — | — | — | — | 617 | |
| arealbegreper-bta-bra | — | — | — | — | 611 | |
| exit-yield | — | — | — | — | 628 | |
| hva-er-yield | — | — | — | — | 577 | pilar-artikkel |
| driftskostnader | — | — | — | — | 522 | |
| markedsleie-og-leieniva | — | — | — | — | 414 | tynn |
| tjene-mer-pa-naringseiendom | — | — | — | — | 431 | tynn |
| felleskostnader | — | — | — | — | 433 | tynn |
| hva-er-advanti | — | — | — | — | 375 | tynn (oversikt) |
| kontantstromsanalyse | — | — | — | — | 337 | tynn |

**Komponenter:** ingen nye trengs — hele anatomien finnes allerede i
`mdx.tsx` + sidemalen. Arbeidet er innholdsadopsjon, ikke kodeendring.

---

*Sist oppdatert: juni 2026 · Advanti Estate · kilde: HJELPEARTIKKEL-ANATOMI v1.0*
