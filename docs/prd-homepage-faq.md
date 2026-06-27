# PRD — Loop 3: Forside-FAQ (CORE-EEAT answer-blokker)

| Felt | Verdi |
|---|---|
| **Status** | Utkast → implementeres |
| **Eier** | Christer |
| **Dato** | 2026-06-23 |
| **Type** | Loop → enkelt PR |
| **Kilde** | §«Answer-blocks / CORE-EEAT C02» i SEO/GEO-planen |
| **Risiko** | Lav (gjenbruker eksisterende `<Faq>`-komponent; ingen markedstall) |

## 1. Problem / bakgrunn

GEO-gevinsten (AI-sitering) krever **siterbare, frittstående svar**. Kartlegging viser at dette allerede er på plass overalt unntatt der det betyr mest:

- ✅ Tjenestesider (6): `<Faq>` med FAQPage-schema (komponenten emitter schema selv).
- ✅ By-sider (10): `faqs` rendret med `StructuredData type="faq"`.
- ❌ **Forsiden: ingen FAQ.** Det er den viktigste entitet-/merke-siden og den eneste flaggskip-siden uten siterbare Q&A — så akkurat de mest verdifulle topp-spørsmålene («næringsmegler Nord-Norge», «hva koster verdivurdering») mangler et maskinlesbart svar.

## 2. Mål / ikke-mål

**Mål**
- G1: Forsiden får en FAQ-seksjon via eksisterende `<Faq>`-komponent → automatisk FAQPage-JSON-LD (schema kan ikke drifte fra synlig innhold).
- G2: 6 topp-spørsmål med frittstående, siterbare svar (topp-funnel / merke / kategori).
- G3: Editorial nummerering bevart (FAQ = «05», CTA flyttes til «06»).
- G4: Build + lint grønn; `tests/seo-meta.spec.ts` upåvirket.

**Ikke-mål**
- Endre tjeneste-/by-FAQ-ene (allerede dekket).
- Skrive om hero/intro-copy.
- Direkte-svar-blokk øverst på siden (hero er redaksjonell — FAQ nederst er det trygge, etablerte mønsteret).

## 3. Sperrer / begrensninger (MÅ følges)
- **Ingen markedstall** i svarene (ingen yield/priser/proof-stats). Kun prosess-, tjeneste- og kategori-svar. (proofStats-gate + synthetic-series-forbud.)
- Gjenbruk `<Faq>` (`src/components/site/Faq.tsx`) — ikke nytt schema-oppsett.
- Norsk bokmål, redaksjonell tone (`DESIGN.md`); italic-flourish i tittel som resten av forsiden.
- Svarene må være sanne for Advanti og frittstående (hvert svar gir mening alene).

## 4. Krav (detaljert)

### R1 — Legg `<Faq>` på forsiden (`src/app/page.tsx`)
- Importer `Faq` fra `@/components/site/Faq`.
- Definer `FAQ_ITEMS: FaqItem[]` (6 stk, se R2).
- Render `<Faq>` mellom «Utvalgte oppdrag»-seksjonen og `<CtaStrip>`:
  - `eyebrow="05 — Ofte stilte spørsmål"`
  - `title={<>Spørsmål om <span className="italic">næringseiendom.</span></>}`
  - `lede="Korte svar på det folk oftest lurer på. Finner du ikke svaret? Ta kontakt for en uforpliktende samtale."`
- Endre `<CtaStrip eyebrow>` fra «05 — Kontakt» → **«06 — Kontakt»**.

### R2 — FAQ-innhold (6 spørsmål, ingen tall)
1. Hva er en næringsmegler, og hva gjør Advanti?
2. Hvilke områder i Nord-Norge dekker Advanti?
3. Hva koster en verdivurdering av næringseiendom?
4. Hvor lang tid tar et salg av næringseiendom?
5. Hva er forskjellen på en verdivurdering og en takst?
6. Jobber Advanti med både kjøpere, selgere og leietakere?

**Akseptkriterium:** hvert svar er frittstående/siterbart, uten markedstall, og sant for Advanti.

## 5. Skills i loopen
1. `geo-content-optimizer` — formuler svarene som siterbare answer-blokker (C02).
2. `schema-markup-generator` — n/a (håndteres av `<Faq>`).
3. `on-page-seo-auditor` — bekreft FAQPage rendres + C02 dekket.

## 6. Verifisering
- [ ] `pnpm build` grønn · `pnpm lint` grønn.
- [ ] Rendret forside har `"@type":"FAQPage"` med 6 `Question`/`Answer`.
- [ ] `tests/seo-meta.spec.ts` upåvirket (ingen title-/canonical-endring).
- [ ] Diff begrenset til `src/app/page.tsx` (+ denne PRD-en).
- [ ] Ingen markedstall i svarene.

## 7. PR-plan
- Gren: `feat/forside-faq` fra oppdatert `main`.
- Commit: `seo(geo): forside-FAQ med FAQPage-schema (Loop 3)`.
- PR-tekst: de 6 spørsmålene + svar for review.

## 8. Suksesskriterium
G1–G4 oppfylt; FAQPage-JSON-LD på forsiden; PR åpnet med synlig copy for godkjenning.
