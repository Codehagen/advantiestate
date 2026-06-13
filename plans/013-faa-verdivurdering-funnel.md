# 013 — «Få verdivurdering»-funnel (dedikert konverteringsside)

**Status:** IMPLEMENTERT på `feat/faa-verdivurdering-funnel` (build grønn). Gate-valg: bygg nå (de-risket) + noIndex konverteringsside.
**Branch (implementasjon):** `feat/faa-verdivurdering-funnel` (lages fra `main` før kode)
**Design-kilde:** Claude Design-handoff `advanti/verdivurdering.html` (+ chat16). README sier: gjenskap visuelt, ikke kopier prototypens struktur.

## Problemet

«Få verdivurdering» er sterkeste kjøpsintensjon på siden, men funnelen er oppstykket:

- Nav-CTA «Få verdivurdering» → `/verktoy/pris-verdivurdering` (priskalkulator for *kostnad på en verdivurdering*, ikke en forespørsel).
- Næringskalkulatorens «Få en presis verdivurdering» → `/kontakt?type=…&by=…&areal=…&leie=…` (generelt kontaktskjema, ingen skreddersydd intake, prefill-parametere ignoreres av /kontakt).
- Den faktiske intake-en (`VerdivurderingIntake`, 5 nedtrekk) ligger begravd på `/tjenester/verdivurdering#bestill`.
- Det finnes ingen dedikert konverteringsside som binder kalkulator + sjekkliste + intake sammen.

Designet `verdivurdering.html` er nøyaktig den manglende brikken: en fokusert «Få verdivurdering»-side som er målet for nav-CTA, har et skreddersydd skjema, og krysslenker til de eksisterende funnel-verktøyene (kalkulator, sjekkliste) + tar imot prefill fra kalkulatoren.

## Mål

En sammenhengende funnel med én tydelig konverteringsside:

```
Nav-CTA «Få verdivurdering» ─┐
Kalkulator «Få presis vurd.» ─┼─► /verdivurdering ─► intake sendt ─► partner ringer <24t
Sjekkliste «Start vurdering» ─┘        ▲
                                       └─ prefill (type, by, areal, leie) fra kalkulator
```

## Premisser (bekreftes ved CEO-premissgate)

1. Den nye siden er en **ny rute `/verdivurdering`** (kort, husker URL, naturlig mål for nav-CTA), registrert i `src/lib/navigation.ts`. Ikke gjenbruk `/landing/verdivurdering` (noindex betalt-annonse-landing) og ikke `/tjenester/verdivurdering` (SEO-tjenesteside).
2. `/verdivurdering` blir **den kanoniske konverteringsflaten**. Tjenestesidens `#bestill`-skjema beholdes på kort sikt, men «Bestill verdivurdering»-CTA-ene pekes mot `/verdivurdering` for å unngå to konkurrerende skjemaer (endelig avgjørelse: smaksvalg ved gate).
3. Skjemaet gjenbruker server-action `subscribeVerdivurderingIntake` (Resend + Discord + rate-limit) — vi endrer ikke lead-rørene, bare felt-mappingen.

## Omfang — filer

**Nye:**
- `src/app/verdivurdering/page.tsx` — server-rendret side (SubHero + seksjoner), `constructMetadata`, `Breadcrumbs`, `StructuredData`.
- `src/app/verdivurdering/VerdivurderingFunnelForm.tsx` — klient-skjema: segmenterte radioer (eiendomstype/formål), adresse/by/areal/leie, kontaktfelt, samtykke, suksess-state, prefill fra `useSearchParams`, analytics.

**Endres:**
- `src/lib/navigation.ts` — registrer `/verdivurdering` (label «Få verdivurdering», parent `/`, `inNav:false`, `inFooter:false` — CTA, ikke menyoppføring).
- `src/components/site/Nav.tsx` — nav-CTA (desktop + mobil) `/verktoy/pris-verdivurdering` → `/verdivurdering`.
- `src/components/verktoy/NaringskalkulatorClient.tsx` — `ctaHref` `/kontakt?…` → `/verdivurdering?…`.
- `src/components/verktoy/SjekklisteVerdivurderingClient.tsx` — «Start verdivurdering»-CTA → `/verdivurdering` (verifiser nåværende mål).
- `src/app/actions/verdivurdering-intake.ts` — utvid intake-mapping (adresse, selskap; areal som fritekst m² i stedet for størrelses-bøtte; gjør `size`/`horizon` valgfrie så det nye skjemaet ikke trenger dem). Behold bakoverkompatibilitet for tjenestesidens skjema.
- `src/styles/advanti-design.css` — legg til de scoped klassene designet bruker som mangler: `vv-seg`, `vv-gets`, `vv-aside-card`, `vv-partner`, `step-mark`, `field-row`, `consent`, `form-success`, `btn-dark` (bygg på eksisterende tokens; lys-only; semantiske klasser).

**Allerede til stede (gjenbrukes):** `contact-grid`, `contact-form`, `next-steps`, `feat-3`, `head-compact`, `subhero`, `--accent-faint`, `SubHero`, `Breadcrumbs`, `StructuredData`.

## Design → seksjoner (gjenskapes)

1. **SubHero** — eyebrow «Verdivurdering · Uforpliktende», H1 «Hva er næringseiendommen din verdt i dagens marked?», lede (24t / 1 400+ database), to dempede støttelenker: «Prøv næringskalkulatoren →» og «Se sjekklisten →».
2. **Skjema-grid (2 kol):**
   - Venstre: 3-stegs skjema. Steg 1 eiendom (eiendomstype segmentert, adresse, by, areal, leie). Steg 2 formål (segmentert). Steg 3 kontakt (navn, selskap, epost, telefon, melding, samtykke). Suksess-state.
   - Høyre aside: «Hva du får» (3 punkt), «Slik går vi frem» (3 steg), partner-kort (Christer, foto, tlf/epost).
3. **Trygg-rad** — 24 t / 1 400+ / NDA.
4. **Metode/tillit** — DCF+yield, lokal forankring, uavhengig + lenke til `/tjenester/verdivurdering`.

## Analytics (fullfører 8A-funnelen)

- `journey_step { step: "skjema" }` ved mount på `/verdivurdering`.
- `cta_verdivurdering { source }` beholdes på nav-CTA.
- `rapport_bestill` ved vellykket innsending (eksisterende event-navn).

## Ikke i omfang

- Ingen endring i lead-backend (Resend/Discord/Supabase) utover felt-mapping.
- Ingen ny modal; `AdvisoryRequestModal` urørt.
- Ingen redesign av kalkulator/sjekkliste — kun CTA-mål endres.
- `/landing/verdivurdering` (betalt-landing) beholdes som den er.

## Test / verifisering

- Build (`pnpm build`) grønn — typecheck genereres av next build (content-collections).
- Prefill: `/verdivurdering?type=Kontor&by=Bodø&areal=2400&leie=3200000` fyller riktige felt.
- Innsending → suksess-state + lead i Discord med full kontekst.
- Validering: påkrevde felt blokkerer innsending; rate-limit virker.
- Nav-CTA (desktop + mobil) og kalkulator-CTA går til ny side.
- Breadcrumbs/JSON-LD løser via registry.

---

<!-- AUTONOMOUS DECISION LOG -->
## /autoplan — CEO Review (Fase 1)

Mode: SELECTIVE EXPANSION. Dual voices: Codex (gpt-5.5) + Claude subagent (begge uavhengig).

### CEO consensus-tabell
| Dimensjon | Claude | Codex | Konsensus |
|---|---|---|---|
| 1 Premisser gyldige? | Delvis | Delvis | DISAGREE m/ plan |
| 2 Rett problem? | Ja (diagnose) | Ja (diagnose) | CONFIRMED |
| 3 SEO-kannibalisering håndtert? | Nei | Nei | **CONFIRMED hull (kritisk)** |
| 4 To-skjema-risiko håndtert? | Nei | Nei | **CONFIRMED hull (kritisk)** |
| 5 Funnel-måling solid? | Nei | Nei | CONFIRMED hull |
| 6 Alternativer utforsket? | Nei | Nei | CONFIRMED hull |

### Kritiske funn (konvergens begge modeller)
- **C1 SEO-kannibalisering.** `/verdivurdering` indekseres som standard og konkurrerer med `/tjenester/verdivurdering` (+ `/[by]`-sider) på samme pengeord. Fix: `noIndex:true` + hold ute av `sitemap.ts`. → AUTO: vedtatt (P1, mekanisk, begge enige).
- **C2 To konkurrerende skjemaer.** Å beholde `#bestill` + nytt skjema gir field-drift og attribusjonskaos. Fix: ÉN delt `<VerdivurderingIntakeForm>`-komponent rendret begge steder (DRY). → AUTO: vedtatt (P4 DRY + P2 blast-radius, begge kritisk).
- **C3 (kun Claude, flagges uansett) Sjekklistens «Start verdivurdering» er et fungerende inline e-postfangst-skjema (`type=submit`, `source:"sjekkliste-verdivurdering"`), IKKE en lenke.** Å repointe det sletter en konverterende sti. Fix: la sjekklistens inline-fangst være urørt; fjern fra omfang. → AUTO: vedtatt (P6, unngå regresjon).
- **C4 Måling.** `rapport_bestill` fyres også av `#bestill` + sjekkliste → kan ikke skille flatene. Fix: påkrevd `source`/`page`-dimensjon på submit-event. → AUTO: vedtatt (P1).
- **C5 Lead-kvalitet.** Ikke løsne påkrevde felt på den kanoniske flaten; legg til «din rolle» + behold formål påkrevd. → AUTO: vedtatt (P1 completeness).

### Sekundære funn
- Modal avvist uten analyse (begge). → behold rute for nav; behold rute for kalkulator-CTA (P5 enklere); modal noteres som mulig A/B senere. AUTO.
- Kalkulator-kontekst underbrukt (begge). → bær eksisterende prefill (type/by/areal/leie) inn i Discord/Supabase-payload + vis «Vi tar utgangspunkt i disse tallene». AUTO: lett versjon vedtatt (P2). Rik estimat-gjengivelse → utsatt.
- `/landing/verdivurdering` foreldreløs (Codex). → utenfor omfang nå (noindex betalt-landing, egen bekymring); noteres som oppfølging. AUTO defer (P3).

### Hva finnes allerede (gjenbruk, ikke gjenoppfinn)
- Fungerende intake + lead-rør: `VerdivurderingIntake.tsx` → `subscribeVerdivurderingIntake` → Resend + Discord + Supabase + rate-limit.
- Funnel-verktøy: `/verktoy/naringskalkulator` (prefill-params), `/sjekkliste-verdivurdering` (egen inline-fangst).
- Design-system: `SubHero`, `Breadcrumbs`, `StructuredData`, `contact-grid/-form`, `next-steps`, `feat-3`, `--accent-faint`.

### IKKE i omfang (bekreftet)
- Lead-backend-endring utover felt-mapping + ny `source`-dimensjon.
- Sjekklistens inline-fangst (C3 — urørt).
- `/landing/verdivurdering` redesign.
- Rik estimat-gjennomvisning fra kalkulator (utsatt).

### Revidert tilnærming (absorbert konsensus)
`/verdivurdering` bygges som **noIndex konverteringsrute** (ikke SEO-konkurrent), drevet av en **delt intake-komponent** som ERSTATTER skjemamarkupen i `#bestill` (én kilde til sannhet), med **distinkt analytics-source**, **bevart kalkulator-kontekst i payload**, og **uendret sjekkliste**. Designets visuelle uttrykk (SubHero, 3-stegs skjema, «hva du får», partner-kort, trygg-rad, metode) gjenskapes.

### USER CHALLENGE (ikke auto-besluttet — til gate)
Begge modeller anbefaler en **trinnvis** rekkefølge: fiks de to ødelagte CTA-ene + prefill på eksisterende skjema FØRST (billig, ~80% av gevinsten), mål, og bygg den dedikerte siden ETTERPÅ. Brukerens uttrykte retning er å bygge designet nå. Default = brukerens retning. Se gate.

## Decision Audit Trail
| # | Phase | Decision | Class | Principle | Rationale |
|---|---|---|---|---|---|
| 1 | CEO | `/verdivurdering` = noIndex + ut av sitemap | Mechanical | P1 | Begge modeller: unngå SEO-kannibalisering |
| 2 | CEO | Delt `<VerdivurderingIntakeForm>` rendret i begge flater | Mechanical | P4/P2 | DRY; fjerner to-skjema-risiko |
| 3 | CEO | Sjekklistens inline-fangst urørt (fjern fra omfang) | Mechanical | P6 | Unngå konverteringsregresjon |
| 4 | CEO | `source`-dimensjon på submit-event | Mechanical | P1 | Skille flatene i måling |
| 5 | CEO | Behold strukturerte påkrevde felt + legg til «rolle» | Mechanical | P1 | Lead-kvalitet på kanonisk flate |
| 6 | CEO | Behold rute (ikke modal) for nav + kalkulator-CTA | Taste→auto | P5 | Enklere; modal noteres som A/B |
| 7 | CEO | Bær kalkulator-kontekst inn i lead-payload | Taste→auto | P2 | Konverteringsverdi, lav kost |
| 8 | CEO | Staging (trinnvis vs bygg-nå) | **User Challenge** | — | GATE: bruker valgte «bygg nå, de-risket» |
| 9 | Gate | SEO-rolle: noIndex konverteringsside | User | — | GATE: bruker valgte noIndex |

## Gate-utfall
- **Tilnærming:** Bygg den dedikerte siden nå, de-risket (bruker bekreftet — siden ER CTA-målet).
- **SEO-rolle:** noIndex konverteringsside (ut av sitemap). `/tjenester/verdivurdering` forblir SEO-siden.

## Design + Eng review (foldet inn i bygg)
Siden er en 2-komponents markedsside; full dual-voice for Design/Eng ble erstattet av en fokusert egenreview mot prime-directives på den faktiske koden.
- **States:** submitting (knapp disabled), success (erstatter skjema), error (role="alert"). Double-submit blokkert.
- **Shadow paths:** manglende påkrevde felt → action returnerer feil; nettverkskast → catch; rate-limit håndtert.
- **A11y:** radio-grupper med wrappede labels + focus-visible-outline; samtykke-checkbox med label; ✓ er aria-hidden; alle felt har id/htmlFor.
- **Responsiv:** contact-grid (980px), field-row (580px), vv-seg wrap (120px), vv-trust-grid (640px).
- **DRY:** én delt `VerdivurderingIntakeForm` i begge flater (C2). Sjekklisten urørt (C3). noIndex + ute av sitemap (C1). `source`-dimensjon + `page` i payload (C4).

## Implementerte filer
- NY `src/app/verdivurdering/page.tsx` (noIndex, leser searchParams → prefill).
- NY `src/components/forms/VerdivurderingIntakeForm.tsx` (delt skjema).
- `src/app/actions/verdivurdering-intake.ts` (utvidet felt-mapping; size/horizon valgfrie; `page`-dimensjon).
- `src/app/tjenester/verdivurdering/VerdivurderingIntake.tsx` (bruker delt komponent, showHeading=false).
- `src/components/site/Nav.tsx` (nav-CTA desktop + mobil → /verdivurdering).
- `src/components/verktoy/NaringskalkulatorClient.tsx` (ctaHref → /verdivurdering?…).
- `src/lib/navigation.ts` (registrert /verdivurdering, inNav/inFooter false).
- `src/styles/advanti-design.css` (vv-seg, vv-gets, vv-aside-card, vv-partner, field-row, consent, form-success, vv-trust, vv-prefill-note).

## Verifisering
- `pnpm build` grønn. `/verdivurdering` = ƒ (server-rendret pga searchParams — OK for noIndex konverteringsside).
- Kalkulator-typer matcher skjemaets radioverdier 1:1 → prefill treffer.

## Gjenstår / oppfølging (utenfor dette PR-et)
- Mål `rapport_bestill` per `source` (verdivurdering_page vs tjeneste_bestill) før evt. fjerning av #bestill.
- `/landing/verdivurdering` (betalt-landing) deler ennå ikke skjemakomponenten — vurder senere.
- Vurder å fjerne tjenestesidens `#bestill` helt når måling viser at /verdivurdering bærer konverteringen.
