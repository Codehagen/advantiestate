# PRD — Loop 2: GEO entitet-forankring (schema)

| Felt | Verdi |
|---|---|
| **Status** | Utkast — venter på input + godkjenning |
| **Eier** | Christer |
| **Dato** | 2026-06-23 |
| **Type** | Loop → enkelt PR (+ companion operativt steg) |
| **Kilde** | §3 «GEO-fundamentet» i SEO/GEO-planen — keystone for AI-sitering |
| **Risiko** | Lav-middels (schema-endring; feil `sameAs` kan skade entitet-tillit → må verifiseres) |

## 1. Problem / bakgrunn

GEO-gevinsten (å bli sitert av ChatGPT/Perplexity/Google AI/Claude) avhenger av at motorene **entydig kjenner igjen «Advanti Estate»** som næringsmegler i Nord-Norge. Mye er allerede på plass i `src/components/StructuredData.tsx`:

- ✅ Delt `@id` (`/#organization`) på Organization, RealEstateAgent og WebSite-publisher → entitetene merges.
- ✅ `alternateName: ["Advanti", "Advanti Næringseiendom"]`, `address`, `areaServed` (GeoCircle), `foundingDate`, `numberOfEmployees`.
- ✅ `sameAs: [linkedin, twitter]`.

Men tre signaler som veier tungt for Knowledge Graph / AI-oppløsning **mangler**:

1. **Smalt `sameAs`** — kun LinkedIn + X. Ingen Brønnøysund-, Google Business-, Proff- eller bransjeprofiler som binder entiteten til autoritative kilder. Listen er dessuten **duplisert** på 4 steder (linje 50, 127, 240, 260) i stedet for én kilde.
2. **Ingen organisasjonsnummer** (`identifier`/`vatID`) på org-noden — det sterkeste maskinlesbare identitets-ankeret for et norsk selskap.
3. **Ingen `knowsAbout`** på org/agent — temaene som knytter entiteten til fagområdet (næringseiendom, verdivurdering, DCF, yield).

## 2. Mål / ikke-mål

**Mål**
- G1: Sentralisere `sameAs` til én kilde i `siteConfig` og utvide med verifiserte, eide profiler.
- G2: Legge `identifier` (organisasjonsnummer) + ev. `vatID` på Organization + RealEstateAgent.
- G3: Legge `knowsAbout` (fagtemaer) på Organization + RealEstateAgent.
- G4: Companion (utenfor PR): kjøre `entity-optimizer` → kanonisk profil `memory/entities/advanti-estate.md` + manuell AI-oppløsnings-baseline.
- G5: Build + lint grønn; JSON-LD validerer (schema_lint + Rich Results Test).

**Ikke-mål (egne, senere loops)**
- Answer-block-copy (CORE-EEAT C02 «direkte svar i første 150 ord») på flaggskip-sider → egen innholds-loop (Loop 3).
- `sameAs`/entiteter for enkeltmeglere (Person-noder) utover dagens LinkedIn.
- Tier 2-kobling (GSC/GA4).
- Wikidata-oppretting (vurderes etter baseline-test).

## 3. Sperrer / begrensninger (MÅ følges)

- **Kun eide, verifiserte profiler i `sameAs`.** Feil eller ikke-kontrollerte URL-er skader entitet-tillit og kan trigge CITE-veto (T03/T05). Hver URL må bekreftes av Christer før den legges inn.
- **Ingen markedstall** involvert (ren identitet/schema).
- Alt JSON-LD gjennom eksisterende `jsonLdScriptProps()`/`<JsonLd>` (escaping bevart).
- Ingen endring av `@id`-strukturen (den fungerer — ikke bryt entitet-merge).

## 4. Krav (detaljert)

### R1 — Sentralisér + utvid `sameAs` (`src/app/siteConfig.ts` + `src/components/StructuredData.tsx`)
Legg en `sameAs`-array i `siteConfig` (f.eks. `siteConfig.sameAs`) og erstatt de 4 inline-`[linkedin, twitter]`-listene (linje 50, 127, 240, 260) med referanse til den.

Kandidater (kun de som finnes og eies — bekreftes i §9):
- LinkedIn (har), X/Twitter (har)
- Brønnøysundregistrene: `https://virksomhet.brreg.no/nb/oppslag/enheter/{orgnr}`
- Google Business Profile (maps-URL)
- Proff.no / 1881-profil
- Finn.no megler-/firmaprofil
- Facebook / Instagram (hvis i bruk)

**Akseptkriterium:** én kilde for `sameAs`; alle URL-er er 200 og eid av Advanti.

### R2 — Organisasjonsnummer (`StructuredData.tsx`, org + realEstateAgent)
```ts
identifier: {
  "@type": "PropertyValue",
  propertyID: "organisasjonsnummer",
  value: "<orgnr>",
},
// hvis MVA-registrert:
vatID: "NO<orgnr>MVA",
```
**Akseptkriterium:** `identifier` på begge noder; verdi = reelt orgnr (input §9).

### R3 — `knowsAbout` (`StructuredData.tsx`, org + realEstateAgent)
```ts
knowsAbout: [
  "Næringseiendom",
  "Verdivurdering av næringseiendom",
  "DCF-analyse",
  "Yield",
  "Transaksjonsrådgivning",
  "Utleie av næringseiendom",
  "Næringsmegling i Nord-Norge",
],
```
**Akseptkriterium:** `knowsAbout` på begge noder; temaer speiler faktiske tjenester (ingen påstander om tjenester de ikke har).

### R4 — Companion (utenfor PR, operativt)
Kjør `entity-optimizer` → kanonisk `memory/entities/advanti-estate.md` (`display_name`, `description_short`, `sameAs`, `ai_resolution_status`). Kjør manuell AI-oppløsnings-baseline (faste prompts mot ChatGPT/Perplexity/Claude: «næringsmegler Bodø», «verdivurdering næringseiendom Nord-Norge») og logg i `memory/monitoring/`. Krever at `memory/` er gitignored først.

## 5. Skills i loopen (rekkefølge)
1. `entity-optimizer` — kanonisk profil + de 6 signal-kategoriene scoret; produserer riktig `sameAs`-liste og `knowsAbout`.
2. `schema-markup-generator` — formuler `identifier`/`knowsAbout`/`sameAs`-JSON-LD korrekt.
3. `/aaron:audit --visibility` — re-sjekk GEO-/entitet-klarhet etter endring.
4. (verifisering) `schema_lint.py` + build + lint.

## 6. Verifisering
- [ ] `pnpm build` grønn · `pnpm lint` grønn.
- [ ] `python3 scripts/connectors/schema_lint.py https://www.advantiestate.no/` — gyldig JSON-LD, ingen feil.
- [ ] Google Rich Results Test (manuell, paste markup) på forsiden — Organization/RealEstateAgent uten feil.
- [ ] `tests/seo-meta.spec.ts` grønn (canonical/noindex uendret).
- [ ] Alle nye `sameAs`-URL-er returnerer 200 og er bekreftet eid.
- [ ] Diff begrenset til `siteConfig.ts` + `StructuredData.tsx` (+ PRD).

## 7. PR-plan
- Gren: `feat/geo-entity-grounding` fra oppdatert `main`.
- Commit-scope: `seo(schema): entitet-forankring — sameAs + orgnr + knowsAbout (Loop 2)`.
- PR-tekst: før/etter av Organization-noden; liste over lagte `sameAs`-profiler.

## 8. Suksesskriterium (definisjon på ferdig)
G1–G3 oppfylt og validert (§6), G4-baseline logget, PR åpnet. Mål på sikt: Advanti oppløses korrekt i ≥2 av 3 AI-motorer (måles via R4-baseline, re-test om 30 dager).

## 9. Avklarte input
1. **Org.nr:** 927102234 = «Eiendomsmegler Nord AS» (Bodø), verifisert i Brønnøysund. ✅
2. **MVA:** registrert → `vatID: "NO927102234MVA"`. ✅
3. **sameAs:** LinkedIn, X, Google Knowledge Graph (kgmid `/g/11n3wx2cqx`, utledet fra GMB-delelenken), Brønnøysund (927102234). ✅
4. **knowsAbout:** som foreslått. ✅
5. **R4 companion** (entity-optimizer + `memory/`-baseline): utsatt — operativt, ikke del av denne PR-en; krever `memory/` i `.gitignore` først.
