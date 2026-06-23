# PRD — Loop 1: On-page metadata-herding

| Felt | Verdi |
|---|---|
| **Status** | Utkast — venter på godkjenning |
| **Eier** | Christer |
| **Dato** | 2026-06-22 |
| **Type** | Loop → enkelt PR |
| **Kilde** | Fase 0/P1 i SEO/GEO-planen (Advanti × Aaron SEO/GEO) |
| **Risiko** | Lav (kun metadata; ingen markedstall, ingen tidsserier) |

## 1. Problem / bakgrunn

Tre konkrete, målte on-page-svakheter ble funnet under `/aaron:audit`:

1. **Forsidens meta-beskrivelse trunkeres midt i ordet** («…nøyaktige…»). Kilden i `src/app/page.tsx` er 205 tegn; `normalizeMetaDescription()` (`src/lib/utils.ts:239`) kutter alt over 160 tegn og legger på `...`. Resultat: halv setning i SERP.
2. **De 6 største byene mangler egen `seoTitle`/`seoDescription`** og faller tilbake på hero-tekst — mens de 4 minste allerede har skreddersydd SEO. De største (Bodø, Tromsø) er der trafikkpotensialet er størst.
3. **Forsidens `<title>` er 70 tegn** (over Googles ~60-tegns visningsgrense) — «| Advanti Estate» risikerer å kuttes.

## 2. Mål / ikke-mål

**Mål**
- G1: Forsiden får en komplett meta-beskrivelse ≤160 tegn (ingen trunkerings-`...`).
- G2: Alle 6 manglende byer får `seoTitle` (≤60 tegn) + `seoDescription` (≤160 tegn) i frontmatter.
- G3: Forsidens `<title>` kortes til ≤60 tegn med bevart hoved-søkeord.
- G4: Alle endringer består `tests/seo-meta.spec.ts` og `pnpm build`.

**Ikke-mål (egne, senere loops)**
- Tier 2-kobling (Search Console / GA4).
- Entitet/GEO-fundament (`entity-optimizer`, `sameAs`-berikelse av Organization-schema).
- Kalkulator-schema (HowTo / SoftwareApplication).
- Tjeneste×by-sidene (`/tjenester/{salg,utleie,verdivurdering}/[by]`).
- Help-/blogg-refresh.

## 3. Sperrer / begrensninger (MÅ følges)

- **Ingen markedstall**: ingen yield, transaksjonsvolum, proof-stats eller priser i ny copy. Kun posisjonering/tjeneste-språk. (Respekterer proofStats-gate.)
- **Ingen tidsserier/«trender»** generert. (Respekterer synthetic-series-forbud.)
- **All metadata går gjennom `constructMetadata()`** — ikke hardkod `<title>`/`<meta>`. Følg `normalizeMetaTitle` (ingen `...` i title) og help-konvensjonen (≤60 tegn title).
- **Norsk bokmål**, redaksjonell tone (se `DESIGN.md`).
- Ingen URL-/rute-endringer, ingen canonical-endringer, ingen redirects.

## 4. Krav (detaljert)

### R1 — Forsidens meta-beskrivelse (`src/app/page.tsx`)
Erstatt `description` med en komplett variant ≤160 tegn som ender på fullstendig setning.

> **Forslag (≈141 tegn):** «Din lokale ekspert på salg og verdivurdering av næringseiendom i Nord-Norge. Vi hjelper deg å oppnå best mulig pris og presise verdivurderinger.»

**Akseptkriterium:** rendret `<meta name="description">` inneholder ingen `...` og er ≤160 tegn.

### R2 — Forsidens `<title>` (`src/app/page.tsx`)
Kort til ≤60 tegn med bevart lokalt søkeord.

> **Vedtatt:** «Næringsmegler Nord-Norge | Advanti Estate» (41 tegn — beholder merke).

**Akseptkriterium:** `<title>` ≤60 tegn, inneholder «Nord-Norge», ingen `...`.

### R3 — Seks by-sider (`src/content/locations/{bodo,tromso,alta,harstad,narvik,lofoten}.mdx`)
Legg til `seoTitle` + `seoDescription` i frontmatter, etter eksisterende mønster fra Hammerfest/Mo i Rana/Sortland/Svolvær.

**Mønster:**
- `seoTitle: "Næringsmegler i {By} – salg & verdivurdering | Advanti"` (≤60 tegn)
- `seoDescription:` ≤160 tegn, by-spesifikk, tjeneste-fokusert, ingen tall.

> **Worked example — `bodo.mdx`:**
> ```yaml
> seoTitle: "Næringsmegler i Bodø – salg & verdivurdering | Advanti"
> seoDescription: "Advanti er din næringsmegler i Bodø. Vi bistår med salg, utleie og verdivurdering av næringseiendom i Bodø og Salten med lokal markedsinnsikt."
> ```

De øvrige 5 genereres via `meta-tags-optimizer` etter samme mønster og tegn-grenser. Lofoten behandles som region («i Lofoten»).

**Akseptkriterium:** hver av de 6 filene har `seoTitle` (≤60) + `seoDescription` (≤160); ingen tall i copy; egenartet per by.

## 5. Skills i loopen (rekkefølge)
1. `meta-tags-optimizer` — generer/forfin alle titler + beskrivelser (R1–R3) innenfor tegn-grensene.
2. `on-page-seo-auditor` — re-audit forsiden + 6 by-sider; bekreft /10-scorer opp og 0 trunkering.
3. (verifisering) `pnpm lint` + `pnpm build` + `tests/seo-meta.spec.ts`.

## 6. Verifisering
- [ ] `tests/seo-meta.spec.ts` grønn (canonical, ingen title-ellipsis, sitemap-hygiene).
- [ ] `pnpm build` grønn (TypeScript-feil feiler build).
- [ ] Manuell: rendret `<title>`/`<meta>` for `/` + 6 by-sider innenfor grenser, ingen `...`.
- [ ] Ingen diff utenfor `src/app/page.tsx` + 6 location-`.mdx` (+ evt. denne PRD-en).

## 7. PR-plan
- Gren: `feat/seo-onpage-metadata-herding` fra oppdatert `main`.
- Commit-scope: `seo(metadata): forsidebeskrivelse + by-seoTitle/seoDescription (Loop 1)`.
- PR-tekst: lenk til denne PRD-en; tabell over before/after tegn-antall per side.
- Reviewer: Christer. Ingen deploy-avhengigheter.

## 8. Suksesskriterium (definisjon på ferdig)
Alle G1–G4 oppfylt, alle bokser i §6 huket, PR åpnet med before/after-tabell. Ingen sperrer brutt.

## 9. Avklarte valg
1. **Forside-title (R2):** Alt B — «Næringsmegler Nord-Norge | Advanti Estate». ✅
2. **PRD-fil:** committes i PR-en (versjoneres på linje med CLAUDE.md/DESIGN.md). ✅
