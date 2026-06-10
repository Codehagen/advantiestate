# Presserom: Kvartalsritualet for markedstall

> **Status:** Runbook. Generert 2026-06-10 fra plan presserom-presskit-entitet.
> **Formål:** Standardisert sjekkliste for kvartalsvis publisering av markedstall og arkivering til `/presserom/arkiv/[kvartal]`.

---

## 1. Beslutninger (avklart med eier)

| Tema | Beslutning |
|---|---|
| **Datagrunnlag** | Numeriske verdier lagres direkte i release-modulen (yieldPct, leieKrM2, vacPct). Visningsstrenger deriveres fra eksisterende formatters ved render-tid. |
| **Arkiv-slugformat** | Låst til `q[N]-[YYYY]` (f.eks. `q1-2026`, `q4-2025`). Slugen reflekterer datakvartalet, ikke publiseringsdato. |
| **Arkiv-kanonikalitet** | `/presserom` er alltid siste utgivelse; arkivsider er snapshots med egen self-canonical og egen frossen CSV. Duplikat ved første arkiv-publisering akseptert (selvkorrigerende ved neste kvartals-oppdatering). |
| **Sitater** | Krever etterprøvbar kildeangivelse (hvilke tall de bygger på), ikke bare eier-godkjenning. |
| **CSV-format** | UTF-8 BOM + semikolon (norsk Excel åpner riktig ved dobbeltklikk). Lagres på stabilt endepunkt både for presserom og arkiv. |

---

## 2. Slik virker publiseringen (mekanikk)

### Kildekode-kontraktene

- **Release-modul** `src/components/markedsinnsikt/marketReleases.ts`: én typet release per kvartal fryser tabell, KPI-er, transaksjonsvolum og metadata samlet.
- **CITIES-alias** i samme fil: alltid siste release — alle eksisterende presserom-/markedsinnsikt-visninger bruker CITIES uten endring.
- **Arkivering** — tre ting genereres automatisk fra RELEASES per nytt kvartal:
  1. Statisk side `/presserom/arkiv/[kvartal]` (Next.js `generateStaticParams` + `notFound()` for ukjente kvartaler)
  2. Frossen CSV `/presserom/arkiv/[kvartal]/data.csv` (routes på same node)
  3. Sitemap-oppføringer (ny rute i `app/sitemap.ts`)

- **CSV på presserom** `/presserom/markedstall.csv` — samme format, siste release.
- **OG-tallkort** `/api/og/marked/[by]` — whitelist mot CITIES, kvartal-label bakes inn (ikke stille utdatert ved kvartalsskifte).
- **Dataset-schema** — en per side (presserom + hver arkivside), kun Dataset feltet `dateModified` oppdateres hver publisering.

### Strøm

```
1. Eier leverer: Q2 2026-tall (numeriske verdier per by)
   ↓
2. Ny release-objekt i marketReleases.ts ØVERST i RELEASES
   (CITIES + LATEST_QUARTER oppdateres automatisk ved build)
   ↓
3. Presserom viser nytt kvartal umiddelbart (ISR 60 s)
   ↓
4. Arkivsider + frossen CSV genereres statisk ved deploy
   ↓
5. Sitater oppdateres (basert på nye tall) — eier godkjenner
   ↓
6. OG-kort tester + Rich Results-validering
   ↓
7. llms.txt-oppføring av nye arkiv-URL-er
   ↓
8. Deploy + live
```

---

## 3. Nåværende tilstand

- **Siste kvartal:** Q4 2025 (lagret i `LATEST_QUARTER` i marketData.ts)
- **Arkiv:** ingen (første publisering = duplikat av presserom 1:1 inntil neste kvartalsoppdatering)
- **CITIES:** 6 byer (Bodø, Tromsø, Alta, Mo i Rana, Narvik, Harstad) — numeriske KPI-er (yield %, leiepris kr/m², ledighet %)
- **Presskit-elementer live:** markedstabeller, sitat (Christer Hagen), «kopier sitering»-knapp

---

## 4. Release-malen — ny kvartalsoppføring

Alle nye releases legges **øverst** i RELEASES-arrayen i `src/components/markedsinnsikt/marketReleases.ts`:

```typescript
const RELEASES: MarketRelease[] = [
  {
    // NYTT KVARTAL LEGGES HER (øverst)
    quarter: "Q1 2026",
    slug: "q1-2026",  // format: q[1-4]-[YYYY]
    publishedAt: "2026-03-10",  // publiseringsdato (ISO 8601)
    cities: [
      {
        slug: "bodo",
        name: "Bodø",
        yieldPct: 6.35,
        leieKrM2: 2400,
        vacPct: 4.6,
      },
      {
        slug: "tromso",
        name: "Tromsø",
        yieldPct: 6.70,
        leieKrM2: 2150,
        vacPct: 3.2,
      },
      // ... (Alta, Harstad, osv.)
    ],
  },
  // (forrige kvartal, Q4 2025, ligger under som snapshot)
  {
    quarter: "Q4 2025",
    slug: "q4-2025",
    publishedAt: "2025-12-15",
    cities: [ ... ],
  },
  // ... (eldre)
];

// CITIES oppdateres automatisk (alias for siste release)
export const CITIES = RELEASES[0].cities;
export const LATEST_QUARTER = RELEASES[0].quarter;
```

**Felt-regler:**
- `yieldPct`: tall som `6.35` (prosent-enhet, ikke desimal). Kode formatter ved visning (`marketData.ts:92-94`).
- `leieKrM2`: tall som `2400` (kroner per m²/år, heltall OK).
- `vacPct`: tall som `4.6` (prosent-enhet).
- `slug`: småbokstaver, bindestrek, ikke norske tegn (avledes fra `name`).

---

## 5. Kvartalsrunbook — sjekkliste i rekkefølge

### FASE 1: DATAHENTING (eier)

- [ ] **Numeriske tall foreligger** per by (yield %, leiepris kr/m², ledighet %)
- [ ] **Kvalitetskontroll:** tall gjennomgått mot realisert marked (ikke spekulasjon)
- [ ] **Notat: kilder** — hvilken kilde/beregningsmetode for hvert tall (brukt til sitatbanken)

### FASE 2: RELEASE-MODUL (kode)

- [ ] **Ny release-objekt** opprettet i `src/components/markedsinnsikt/marketReleases.ts` øverst i RELEASES
  - Kvartal-format: `"Q1 2026"` (visningsnavn)
  - Slug-format: `"q1-2026"` (URL)
  - publishedAt: `"2026-03-10"` (ISO 8601)
  - cities: numeriske verdier fylt inn
- [ ] **CITIES-alias** verifisert (skal automatisk peke til RELEASES[0])
- [ ] **LATEST_QUARTER** verifisert (skal være `"Q1 2026"`)
- [ ] **Bygg lokalt:** `pnpm build` grønt — ingen breaking errors i presserom-/markedsinnsikt-komponenter

### FASE 3: ARKIV & CSV (kode)

- [ ] **Arkiv-side genereres:** `/presserom/arkiv/q1-2026` (Next.js `generateStaticParams` + `notFound()`)
  - Verifiser struktur — skal være identisk med presserom første gang
  - Egen self-canonical: `https://advantiestate.no/presserom/arkiv/q1-2026`
- [ ] **Frossen CSV-fil** `/presserom/arkiv/q1-2026/data.csv`
  - Format: UTF-8 BOM + semikolon, alle byer + nøkkeltall
  - Verifiser: åpnes riktig i norsk Excel (dobbeltklikk på .csv)
- [ ] **Presserom CSV** `/presserom/markedstall.csv` oppdatert (skal være siste release)
- [ ] **Sitemap-oppføringer** nye rutene: `app/sitemap.ts` får `/presserom/arkiv/q1-2026`
- [ ] **Localhost test:**
  ```bash
  pnpm build && pnpm start
  # Besøk http://localhost:3000/presserom → skal vise Q1 2026
  # Besøk http://localhost:3000/presserom/arkiv/q4-2025 → skal vise Q4 2025 (tidligere)
  # Last ned /presserom/markedstall.csv → norsk Excel-format OK
  ```

### FASE 4: SITATER & COPY (innhold)

- [ ] **Sitatbank-utkast** — 4-6 sitater med kildeangivelse (hvilke tall de bygger på)
  - Eksempel: «Yield i Bodø når 6.35 % — høyeste på tre år» (kilde: Q1 2026 data)
  - To talspersoner: Christer Hagen + Håvard Nome
  - Temaer: renter/yield-utvikling, kontorledighet, transaksjonsvolum, by-spesifikt
  - Lenket til `/personer/christer-hagen` og `/personer/havard-nome`
- [ ] **Sitatbank-seksjon** oppdatert på `/presserom/page.tsx` (skjult hvis tom)
- [ ] **«Kopier sitering»-tekst** godkjent: «Kilde: Advanti Estate, Q1 2026. advantiestate.no/presserom» (eier godkjenner ordlyden)
- [ ] **Eier-godkjenning** — sitater + krediterings-copy signert av eier

### FASE 5: VALIDERING

- [ ] **OG-tallkort** — verifiser `/api/og/marked/bodo` viser Q1 2026-label (innbakt, ikke stille utdatert)
  - Test minst tre byer (Bodø, Tromsø, Alta)
  - Test ukjent by: `/api/og/marked/stavanger` → skal være 404
- [ ] **Rich Results-test** på presserom + arkiv
  - Gå til https://search.google.com/test/rich-results
  - Test URL: `https://advantiestate.no/presserom` + `/presserom/arkiv/q1-2026`
  - Skal se: Organization (`Advanti Estate`), Dataset (med temporalCoverage, spatialCoverage), Article (hvis bloggpost lenkes)
  - Ingen @id-splitts eller warnings
- [ ] **llms.txt-oppføring** — nye arkiv-URL-er
  - Åpne `app/llms.txt/route.ts` og legg til:
    ```
    - /presserom/arkiv/q1-2026
    - /presserom/arkiv/q1-2026/data.csv
    ```
  - (Eller automated — test at /api/llms.txt inneholder linker)
- [ ] **Playwright-tester løper grønt**
  ```bash
  npx playwright test presserom.spec.ts
  ```
  - CSV: BOM + semikolon + alle byer
  - OG: 200 for gyldig by + kvartal-label sett korrekt, 404 for ukjent by
  - Dataset-JSON-LD: parsebar med alle påkrevde felter
  - Arkiv: 200 for eksisterende kvartal, 404 for ukjent
- [ ] **Blog + personside @id-konsistens**
  - Verifiser minst én bloggpost + én personside med Rich Results-test
  - Skal se `Article.author @id` og `Article.publisher @id` (gjenforenet med Organization)

### FASE 6: DEPLOY

- [ ] **Lokal build-sjekk** `next build` grønt
- [ ] **Commit + push** til main (eller PR)
- [ ] **Vercel deploy OK** — ISR-cache invalidert for presserom
- [ ] **Post-deploy verifisering**
  - Besøk https://advantiestate.no/presserom → Q1 2026 live
  - Besøk https://advantiestate.no/presserom/arkiv/q4-2025 → Q4 2025 (snapshot)
  - Besøk https://advantiestate.no/presserom/markedstall.csv → last ned OK
  - Besøk https://advantiestate.no/presserom/arkiv/q1-2026/data.csv → last ned OK
  - Test OG-kort fra /presserom → nedlasting/deling OK

### FASE 7: MONITORING (deferred)

- [ ] **Pressevarsel (deferred til TODOS.md)** — når presselistesystem finnes
  - Skjema «få pressevarsel» på presserommet (lead → Supabase)
  - Kvartalsvis utsendelse via Resend med tall, sitat, lenke

---

## 6. CSV-serialisereren — referanse

Koden som genererer `/presserom/markedstall.csv` og arkiv-CSV:

```typescript
// Eksempel — finnes som ren funksjon i src/lib/csv.ts (eller der CSV-logikk oppbevares)
export function generateMarketDataCsv(release: MarketRelease): string {
  // 1. UTF-8 BOM
  let csv = "﻿";
  
  // 2. Header (maskinlesbart format)
  csv += "By,Yield (%),Leiepris (kr/m²),Ledighet (%)\n";
  
  // 3. Data (numerisk fra release)
  release.cities.forEach(city => {
    csv += `${city.name},${city.yieldPct.toFixed(2)},${city.leieKrM2},${city.vacPct.toFixed(2)}\n`;
  });
  
  return csv;
}
```

---

## 7. Arkiv-struktur — maler

### Arkiv-side `/presserom/arkiv/[kvartal]` — route-mal

```typescript
// src/app/presserom/arkiv/[slug]/page.tsx
import { notFound } from "next/navigation";
import { RELEASES } from "@/components/markedsinnsikt/marketReleases";

export async function generateStaticParams() {
  return RELEASES.map((release) => ({
    slug: release.slug,
  }));
}

export default async function ArchivePage({ params }: { params: { slug: string } }) {
  const release = RELEASES.find((r) => r.slug === params.slug);
  if (!release) {
    notFound();
  }

  return (
    <div>
      <h1>Markedstall {release.quarter}</h1>
      {/* Tabell med release.cities */}
      {/* Frossen CSV-lenke til /presserom/arkiv/[slug]/data.csv */}
      {/* Dataset-schema med dateModified = release.publishedAt */}
    </div>
  );
}
```

### Frossen CSV-rute `/presserom/arkiv/[kvartal]/data.csv`

```typescript
// src/app/presserom/arkiv/[slug]/data.csv/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const release = RELEASES.find((r) => r.slug === params.slug);
  if (!release) {
    return new Response("Not Found", { status: 404 });
  }

  const csv = generateMarketDataCsv(release);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="markedstall-${release.slug}.csv"`,
    },
  });
}
```

---

## 8. Eierskap

| Rolle | Ansvar |
|---|---|
| **Eier (Christer)** | Leverer numeriske markedstall (yieldPct, leieKrM2, vacPct) per by, kvalitetskontroll, godkjenner sitatbank-ordlyd og «kopier sitering»-tekst, verifiserer kildeangivelse for sitater |
| **Megler (Christer/Håvard)** | Siterer som eksperter — sitater må bygge på data fra Q-tallet som publiseres |
| **Developer (CC/Christer)** | Opprett ny release i marketReleases.ts, arkiv-sider generes automatisk, validering (OG, Rich Results, CSV-format, deploy) |
| **Måling (eksisterende)** | Månedlig AI-siteringsmonitor (TODO 16) måler effekt — siteringer av presserom-/markedstall-spørringer før/etter |

---

## 9. Sjekkliste — snØyttel-versjon for dashboard

```
□ Tall mottatt fra eier (Q1 2026)
□ Release-objekt opprettet i marketReleases.ts
□ Lokalbuild OK — CITIES + LATEST_QUARTER oppdatert
□ Arkiv-side + CSV generes ved deploy
□ Sitater skrevet + godkjent (med kildeangivelse)
□ OG-kort viser nytt kvartal
□ Rich Results OK på presserom + arkiv + bloggpost/personside
□ llms.txt oppdatert
□ Playwright-tester grønt
□ Deploy live — post-deploy verifisering OK
□ Pressevarsel sendt (når system finnes)
```

---

## 10. Åpne spørsmål

1. **Pressevarsel-distribusjon:** Når finnes presseliste og når skal utsendelsessystem bygges? (Deferred per planen.)
2. **«Sett i media»-oppstart:** Skal seksjonen populates før eller etter første arkiv-publisering? (Deferred — ikke PR 1-kriterium.)
3. **Datafrekvens:** Etterspør eier tall 2 uker før kvartalsslutt, eller annen tidsplan?

---

## 11. Referanser & filer

| Fil | Ansvar |
|---|---|
| `src/components/markedsinnsikt/marketReleases.ts` | Release-definisjon — er kilde for arkiv, CSV, OG, Dataset |
| `src/app/presserom/page.tsx` | Presserom (siste release visningslogikk) |
| `src/app/presserom/arkiv/[slug]/page.tsx` | Arkiv-side (snapshot per release) |
| `src/app/presserom/arkiv/[slug]/data.csv/route.ts` | Frossen CSV per release |
| `src/app/presserom/markedstall.csv/route.ts` | Siste CSV (presserom) |
| `src/api/og/marked/[by]/route.ts` | OG-tallkort med kvartal-label |
| `src/components/StructuredData.tsx` | Dataset + Article-schema (Dataset.dateModified per release) |
| `app/sitemap.ts` | Sitemap med arkiv-ruter |
| `app/llms.txt/route.ts` | AI-crawler-filer (arkiv-URL-er) |
| `tests/presserom.spec.ts` | Playwright-spec (CSV, OG, Dataset, arkiv, @id-konsistens) |
