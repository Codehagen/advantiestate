# Best practice — formatering av artikler

Denne fila er ment som referanse for både redaktører og AI-assistenter (Claude).
Komponentene den beskriver bor i `src/components/blog/mdx.tsx` (klasser i
`src/styles/advanti-design.css`, BLOG-seksjonen). Mål: artikler skal bruke de
redaksjonelle komponentene der de hører hjemme — ikke falle tilbake på
**fete punktlister** og endeløs `##`-prosa.

---

## Gullregelen

> Hvis du er i ferd med å skrive en **fet** etikett etterfulgt av en punktliste
> med tall — stopp. Det finnes nesten alltid en komponent som gjør det bedre.

**Før (dagens artikler):**

```md
**Nøkkeltall (Q4 2025):**
- Prime yield Bodø: **5,80 %**
- Prime yield Tromsø: **5,50 %**
- Transaksjoner 2025E: **~103 mrd. NOK**
```

**Etter (best practice):**

```jsx
<Summary
  title="Nøkkeltall · Q4 2025."
  points={[
    { title: "Prime yield Bodø", description: "5,80 % — ned 30 bps fra toppen." },
    { title: "Prime yield Tromsø", description: "5,50 % — landsdelens laveste." },
    { title: "Transaksjoner 2025E", description: "~103 mrd. NOK — opp fra 80 mrd." },
  ]}
/>
```

---

## Når bruker jeg hva

| Situasjon | Bruk | Ikke bruk |
|---|---|---|
| 2–6 nøkkelpunkter / takeaways | `<Summary>` | fet punktliste |
| 2–4 harde tall som setter premisset | `<StatStrip>` | tabell med én rad |
| Definere et fagbegrep første gang | `<Fact>` | parentes i brødteksten |
| En sekvensiell prosess eller «N grep» | `<Stepper>` | `### 1.` overskrifter |
| Et regnestykke med et resultat | `<Example>` | tabell uten resultatrad |
| Forutsetninger / antakelser | `<Prerequisites>` | løpende prosa |
| En matematisk formel | `<Formula>` | inline `kode` |
| Et ekte kundeutsagn | `<Quote>` | generisk ros i brødtekst |
| To sider av en avgjørelse | `<Compare>` | to punktlister etter hverandre |
| Kronologi / markedshistorikk | `<Timeline>` | tabell med datoer |
| Bilde som trenger kontekst | `<Figure>` | rått `![]()` uten bildetekst |
| Avslutning med oppfordring | `<CTA>` | «Ta kontakt på …» i prosa |
| Videre lesning | `<ReadMore>` | løse lenker i en liste |
| Daterte hendelser / endringer | `<Changelog>` | — |
| En kort sidebemerkning | `<Aside>` | `<Note>` til alt |

## Callout-disiplin

`<Note>` har fire varianter. Bruk dem sparsomt — som regel holder den nøytrale.

- **(standard)** → nøytral presisering. Etikett: «Merk».
- `variant="key"` → det viktigste poenget på siden. Etikett: «Viktig».
- `variant="caution"` → forbehold, risiko, datakvalitet. Etikett: «Vær oppmerksom».
- `variant="positive"` → konklusjon eller hovedpoeng. Etikett: «Hovedpoeng».

Maks **én** `key`-callout per artikkel. Hvis alt er viktig, er ingenting det.

## Rytme i en artikkel

En god artikkel veksler mellom prosa og komponenter, og lar luft stå rundt dem:

1. Åpningsavsnitt i ren prosa — sett premisset.
2. `<Summary>` eller `<StatStrip>` som løfter nøkkeltallene.
3. `##`-seksjoner med prosa + tabeller for selve innholdet.
4. Komponenter der de hører hjemme (`<Stepper>`, `<Example>`, `<Quote>` …).
5. Avslutt med `<CTA>` og evt. `<ReadMore>`.

Ikke stable to komponenter rett på hverandre uten en setning prosa imellom —
de trenger pusterom for å lese som redaksjonelt innhold, ikke som et dashbord.

## Eksempelartikler

| Fil | Type | Viser frem |
|---|---|---|
| `markedspuls-nord-norge-2026.mdx` | Markedsrapport | Summary, StatStrip, Note, Timeline, CTA |
| `dcf-analyse-naringseiendom.mdx` | Metode / fag | Fact, Prerequisites, Stepper, Formula, Example |
| `kjope-vs-leie-naringseiendom.mdx` | Beslutningsguide | Compare, Aside, Quote, ReadMore |
| `verdivurdering-naringseiendom-guide.mdx` | Prosessguide | Figure, Stepper, Example, CTA (lys) |
| `investere-kontorlokaler-nord-norge.mdx` | Investering / liste | StatStrip, Stepper, Note, Quote, Changelog |

## Frontmatter

Hold deg til skjemaet i `content-collections.ts`:

```yaml
---
title: "…"
publishedAt: 2026-02-04
summary: …
image: /building/….jpg
author: codehagen        # eller vsoraas
categories:
  - market-analysis      # må matche en slug i BLOG_CATEGORIES
related:
  - en-annen-slug
slug: artikkelens-slug
---
```

> Merk: eksemplene bruker `market-analysis` som kategori fordi den er bekreftet
> gyldig. Bytt til riktig kategori-slug per artikkel før publisering — en ugyldig
> kategori gir `notFound()` på artikkelsiden.
