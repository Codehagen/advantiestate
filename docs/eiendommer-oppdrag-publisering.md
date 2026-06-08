# Publisering av aktive oppdrag til /eiendommer

> **Status:** Arbeidsdokument / runbook. Generert 2026-06-08 fra Supabase CRM (`crm_cases` + `crm_properties` + `crm_property_listing_profiles`).
> **Formål:** Få alle **aktive oppdrag** fra CRM ut på advantiestate.no/eiendommer på en kontrollert måte — uten å røpe off-market-oppdrag.

---

## 1. Beslutninger (avklart med Christer)

| Tema | Beslutning |
|---|---|
| **Off-market-oppdrag** | Publiseres **kun som anonyme teasere** (ingen adresse/eier), à la dagens `OM-xxx`-kort. Ikke full publisering. |
| **Manglende bilder** | **Publiser nå** med tekst + nøkkeltall, **legg til foto fortløpende** etterpå. |
| **Omfang** | Alle aktive oppdrag dokumenteres her, slik at publisering kan gjøres i kontrollerte puljer i etterkant. |

---

## 2. Slik virker publiseringen (mekanikk)

Nettsiden leser **ikke** `crm_cases` direkte. Den leser web-projeksjonen `crm_property_listing_profiles`:

```
crm_cases (oppdrag)  →  crm_properties (eiendom)  →  crm_property_listing_profiles (web)
```

- `/eiendommer` og `/eiendommer/[slug]` henter **kun** profiler hvor `is_public_ready = true` og `public_slug` er satt.
  - Kode: `src/lib/listing/listings.ts` → `fetchPublishedProfiles()` / `getListing()`
- Bilder: `crm_property_listing_media` filtrert på `public_approved = true` (`src/lib/listing/gallery.ts`).
- Prospekt/nedlasting: `crm_property_listing_downloads` (`public_approved = true`).
- **ISR = 600 s**: en nyendring blir synlig på web innen ~10 min, uten ny deploy.
- `dynamicParams = true`: nye slugs rendres on-demand første gang de besøkes.

**Å «publisere et oppdrag» = opprette/fylle en `crm_property_listing_profiles`-rad og sette `is_public_ready = true`.**

> ⚠️ Service-role-nøkkelen omgår RLS. Filteret `is_public_ready = true` er derfor det eneste som hindrer at en eiendom havner offentlig ut. Aldri sett flagget før raden er kvalitetssikret.

---

## 3. Nåværende tilstand

> **Oppdatert 2026-06-08:** 3 salgsoppdrag publisert (ADV-112/113/114) — **14 profiler live nå** (var 11). Se §4B.

- **14 profiler er live** (`is_public_ready = true`) — men de fleste mangler **bilder** (faller tilbake på placeholder-byggbilde). Flere mangler pris/yield/BTA.
- **1 profil ikke web-klar:** Bodø Byport (`bodo-byport-stormyra`) — drives fortsatt fra MDX, har 9 bilder.
- **~22 aktive «markedsklare» oppdrag mangler fortsatt web-profil** (off-market, utleie, avventende + de med åpne spørsmål).

Aktive faser i `case_fase` (rekkefølge): `oppdragsavtale_sendt → signert → sjekkliste_sendt → **markedsklart** → bud → bud_akseptert → due_diligence → kontrakt_ok → solgt`.
«Markedsklart» og senere = aktivt i markedet. Alt under er for tidlig å publisere.

---

## 4. Oppdragsliste med klassifisering

### 4A. Allerede live (11) — trenger datakomplettering + bilder

Alle disse er `is_public_ready = true` i dag. Tiltak: fyll hull (pris/yield/BTA) og last opp foto.

| Slug | Adresse | By | BTA | Pris (MNOK) | Mangler |
|---|---|---|---|---|---|
| `vikingveien-463-bostad` | Vikingveien 463 | Bøstad | 858 | 5,5 | foto |
| `gammelvaerret-27-sund-lofoten` | Gammelværret 27 | Sund i Lofoten | 253 | 12,0 | foto |
| `ornesveien-4-glomfjord` | Ørnesveien 4 / Tor Føynes vei 5 | Glomfjord | 1 023 | 7,5 | foto |
| `hamaroyveien-5689-ulvsvag` | Hamarøyveien 5689 | Ulvsvåg | 549 | 6,5 | foto |
| `morkvedsentret-13-bodo` | Mørkvedsentret 13 | Bodø | 582 | 5,5 | foto |
| `klubbholmen-2-harstad` | Klubbholmen 2 | Harstad | 2 905 | — | **pris, yield**, foto |
| `makeveien-31-stokmarknes` | Måkeveien 31 | Stokmarknes | 1 000 | 17,5 | yield-vis, foto |
| `industriveien-16b-andenes` | Industriveien 16 B | Andenes | 630 | 5,0 | foto |
| `strandstindvegen-461-lodingen` | Strandstindvegen 461 | Lødingen | — | 3,0 | **BTA**, foto |
| `industriveien-3-stokmarknes` | Industriveien 3 | Stokmarknes | 390 | — | **pris, yield**, foto |
| `engeloyveien-287-steigen` | Engeløyveien 287 | Steigen | 453 | 7,2 | foto |

### 4B. Klare salgsoppdrag — kan publiseres nå (eiendomssalg, ikke off-market)

| Foreslått slug | Adresse | By | Type | BTA | Pris (MNOK) | Megler | Merknad |
|---|---|---|---|---|---|---|---|
| `sandgata-4b-bodo` | Sandgata 4 B | Bodø | kontor | 240 | 8,5 | Christer Hagen | ✅ **Publisert ADV-112 (2026-06-08)** |
| `lokkeveien-37-alta` | Løkkeveien 37 | Alta | kontor | 567 | 9,0 | Håvard Nome | ✅ **Publisert ADV-113 (2026-06-08)** — meglerkontakt (e-post) må verifiseres |
| `kapstoveien-saltstraumen` | Kapstøveien | Saltstraumen | tomt | 1 199 | 0,85 | Christer Hagen | ✅ **Publisert ADV-114 (2026-06-08)** — `website_type='utvikling'` (tomt ikke tillatt) |
| `industriveien-8-bodo` | Industriveien 8 | Bodø | lager | 3 500 | 28,5 (yield 7,1) | *uten megler* | ⏸ **Holdt** — fase = due_diligence → vurder «reservert». Mangler beskrivelse/geo. |
| `havneterminalen-1-narvik` | Havneterminalen 1 | Narvik | industri | 8 200 | 45,0 | *uten megler* | ⏸ **Holdt** — aksjekjøp, fase = kontrakt_ok → nær sluttført, vurder om den skal ut |
| `finneidkaiveien-fauske` | Finneidkaiveien | Fauske | industri | — | — | Christer Hagen | ⏸ **Holdt** — mangler areal + pris → vent til data finnes |

> **Kodeendring 2026-06-08:** la til bynavnet `saltstraumen → "Saltstraumen"` i `CITY_LABELS` i `src/app/eiendommer/page.tsx`, `src/app/eiendommer/[slug]/page.tsx` og `src/components/eiendommer/ActiveListingsStrip.tsx`. **Krever deploy** for at Kapstøveien skal vise «Saltstraumen» (ikke «saltstraumen») på live-siden. `website_type='tomt'` er ikke tillatt — gyldige verdier: `kontor, logistikk, handel, kombi, hotell, utvikling, industri`.

### 4C. Off-market salg → **anonyme teasere** (ikke full publisering)

Disse legges ut **uten** adresse, eier eller bilder — kun region + type + størrelsesorden, som dagens `OM-xxx`-kort.

| Intern ref | Eiendom (skjult) | Region | Type | Størrelse | Prisorden | Megler |
|---|---|---|---|---|---|---|
| (ny OM-xxx) | Bekkefaret 2 | Alta | kontor | (ukjent) | seksjonert, 2 eiere | Håvard Nome |
| (ny OM-xxx) | Jernveien 18 / Jme Eiendom | Alta | kontor | ~2 400 m² | ~50 MNOK | Håvard Nome |
| (ny OM-xxx) | Industrihøyden 20 / Thomassen | Alta | kontor | ~399 m² | ~19 MNOK | Håvard Nome |
| (ny OM-xxx) | Liakollveien / Rismål | Evenes | tomt | 8 689 m² | ~9,25 MNOK | Håvard Nome |

> Teaser-kortene er i dag **hardkodet** i `src/app/eiendommer/page.tsx` (off-market-arrayen, `OM-241` / `OM-238` / `OM-231`). Anonyme teasere legges enklest til samme sted — **ikke** som `listing_profiles`-rader. Se §5.4.

### 4D. Avventende / muntlig mandat → **hold** (ikke publiser ennå)

| Eiendom | By | Megler | Grunn |
|---|---|---|---|
| Rivarbuktveien 52 (Tappeluft) | Langfjordbotn | Håvard Nome | «avventende oppdragsgiver» |
| Humleveien 7 | Alta | Håvard Nome | kun muntlig avtale |

### 4E. Utleieoppdrag (13) — krever «til leie»-tilrettelegging først

Web-modellen er **salgsorientert** (`website_status ∈ til-salgs / reservert / kommer / solgt`). Det finnes ingen «til leie»-status i dag. Disse kan derfor ikke vises korrekt før vi gjør et lite rendering-tillegg (se §6).

| Adresse | By | Type | Ledig m² | Leie/yield | Megler |
|---|---|---|---|---|---|
| Storgata 42 | Tromsø | kontor | 450 | 1 850 kr/m² · yield 6,2 | *uten megler* |
| Sjøgata 34/36 | Bodø | kontor | 320 (av 900) | 1 950 kr/m² · yield 7,1 | Christer Hagen |
| Jernbaneveien 85 | Bodø | kontor | — | — | Mathias Nilsen |
| Jernbaneveien 61 | Bodø | kontor | 840 | — | Christer Hagen |
| Klinkerveien 7 | Bodø | industri | 949 | — | Christer Hagen |
| Sandhorngata 43 (Polaris BIG) | Bodø | kontor | 800 | — | Christer Hagen |
| Jernveien 9 (Thomassen) | Alta | kontor | 1 000 | — | Håvard Nome |
| Jernveien 5 | Alta | kontor | 1 064 | — | Håvard Nome |
| Skipper Wirkolas vei 11 (Lassenteret) | Alta | industri | 600 | — | Håvard Nome |
| Altaveien 95/97 (Bossekop) | Alta | kontor | 500 | — | Håvard Nome |
| Myggveien 9 (Kivijervi) | Alta | kontor | 2 490 | — | Håvard Nome |
| Strandveien 48 (Alta Skiferbrudd) | Alta | kontor | — | — | Håvard Nome |
| Markveien 49 (Mark Eiendom) | Alta | kontor | 325 | — | Håvard Nome |

### 4F. Opprydding — duplikat-saker (påvirker ikke web, men rydd i CRM)

Web-profilen er nøklet på `property_id`, så duplikater skader ikke siden. Men disse bør slås sammen/arkiveres i CRM:

| Eiendom | Dubletter (case_id) |
|---|---|
| Vikingveien 463 (`eiendom-2026-05-22-003`) | `case-vikingveien-463` + `0e2015db-…` |
| Måkeveien 31 (`eiendom-2026-05-22-006`) | `case-2026-05-22-006` + `d63ba476-…` («mock oppdragsavtale») |
| Strandstindvegen 461 (`eiendom-2026-05-22-001`) | `case-2026-05-22-001` (salg) + `case-oml-kjopsmandat` (**kjøpsmandat** — ikke et salgslisting) |

---

## 5. Runbook — SQL-maler

> Kjør i Supabase SQL editor eller via MCP. **Sett aldri `is_public_ready = true` før raden er kontrollert.**
> Test alltid med `is_public_ready = false` først, verifiser feltene, og flipp flagget til slutt.

### 5.1 Opprett web-profil fra en eiendom (salgsoppdrag)

Mal — bytt ut verdiene. (Kolonner følger faktisk skjema, jf. referanseraden `gammelvaerret-27-sund-lofoten`.)

```sql
insert into crm_property_listing_profiles (
  property_id, public_slug, website_status, website_type, type_label, city_slug,
  reference, title, title_head, title_tail, status_label, card_eyebrow,
  featured, sort_order, published_at, listing_updated_at,
  summary, body_mdx,
  bta_m2, prisantydning_nok, prisantydning_estimat,
  yield_netto, yield_estimat,
  address, megler, facts, is_public_ready
) values (
  'eiendom-2026-05-22-010',                 -- property_id
  'sandgata-4b-bodo',                        -- public_slug (æ→ae, ø→o, å→a, mellomrom→-)
  'til-salgs', 'kontor', 'Kontor', 'bodo',   -- website_status / website_type / type_label / city_slug
  'ADV-1xx',                                 -- reference (neste ledige ADV-nummer)
  'Kontorlokaler i Bodø sentrum — Sandgata 4 B',
  'Kontorlokaler i Bodø sentrum —', 'Sandgata 4 B.',
  'Til salgs', 'Kontor · Bodø',
  false, 12,                                 -- featured / sort_order (etter siste live = 11)
  current_date, current_date,
  'Kort ingress på 1–2 setninger som vises på kortet og toppen av listing-siden.',
  'Brødtekst (enkel markdown: avsnitt, ## overskrift, - punkt, **fet**). Rendres av ListingProse.',
  240, 8500000, false,                       -- bta_m2 / prisantydning_nok (NOK!) / estimat
  null, false,                               -- yield_netto / yield_estimat
  'Sandgata 4 B, Bodø',
  '{"name":"Christer Hagen","role":"Partner · Næringsmegler","slug":"christer-hagen","email":"christer@advanti.no","phone":"+47 984 53 571","avatar":"https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/d08a8e8b-0285-4107-bc2c-973f93b27100/public"}'::jsonb,
  '[{"label":"Totalt areal","value":"240 m²"},{"label":"Eierform","value":"Selveier"}]'::jsonb,
  false                                      -- is_public_ready = false til kontrollert!
);
```

**Viktige feltregler:**
- `prisantydning_nok` lagres i **kroner** (8 500 000), ikke MNOK. Koden deler på 1 000 000 ved visning.
- `yield_netto` i prosent-enhet (f.eks. `7.10`). Sett `yield_estimat = true` hvis tallet er et anslag.
- `prisantydning_estimat = true` hvis prisen er et anslag/«prisantydning».
- For skjult pris: la `prisantydning_nok` være `null` (kortet viser «Pris på forespørsel»).
- `city_slug` styrer bynavn-etiketten. Eksisterende slugs: `bodo`, `lofoten`, `steigen`, m.fl. Legg til ny i bymappingen i `src/app/eiendommer/page.tsx` hvis byen er ny.

### 5.2 Kontroller før publisering

```sql
select public_slug, website_status, prisantydning_nok, bta_m2, yield_netto,
       (megler is not null) as har_megler, summary is not null as har_summary
from crm_property_listing_profiles
where public_slug = 'sandgata-4b-bodo';
```

### 5.3 Sett live

```sql
update crm_property_listing_profiles
set is_public_ready = true, listing_updated_at = current_date
where public_slug = 'sandgata-4b-bodo';
-- Synlig på /eiendommer innen ~10 min (ISR), eller umiddelbart ved revalidate.
```

### 5.4 Anonyme off-market-teasere

Teaserne er **statiske** i koden, ikke i databasen. Rediger off-market-arrayen i
`src/app/eiendommer/page.tsx` (samme struktur som `OM-241` / `OM-238` / `OM-231`):

```ts
// eksempel-rad (anonymisert — ingen adresse/eier)
{
  ref: "OM-2026-051",
  eyebrow: "Off-market · Alta",
  title: "Kontoreiendom i Alta sentrum",
  meta: "~2 400 m² · prisorden ~50 MNOK",
  // ingen adresse, ingen bilde, ingen lenke til detaljside
}
```

Fire teasere å legge til (jf. §4C): Bekkefaret 2, Jernveien 18, Industrihøyden 20, Liakollveien.
**Ikke** opprett `listing_profiles`-rad for disse — da risikerer man at de blir søkbare/lekker adresse.

### 5.5 Legg til bilder (etterpå)

Foto kobles til profilen via `crm_property_listing_media`:

```sql
insert into crm_property_listing_media (listing_profile_id, image_url, alt, is_cover, sort_order, public_approved)
select id, 'https://imagedelivery.net/.../public', 'Fasade Sandgata 4 B', true, 0, true
from crm_property_listing_profiles where public_slug = 'sandgata-4b-bodo';
```

- `is_cover = true` på ett bilde (cover). Resten `false` med stigende `sort_order`.
- `public_approved = true` kreves for at bildet vises. Uten foto faller siden tilbake på `cover_image` og deretter et tekstkort.
- Gjelder også de 11 som er live nå (§4A) — alle mangler foto i dag.

---

## 6. Utleie — hva som må til (§4E)

Per nå viser `/eiendommer` kun salgsstatuser. For å vise de 13 utleieoppdragene ordentlig, velg én tilnærming:

1. **Minimal:** Legg til status `til-leie` (label «Til leie») i web-modellen og kort-rendering.
   - Berørte steder: status-enum/label-mapping i `src/lib/listing/listings.ts`, statusfilter + KPI-telling i `src/app/eiendommer/page.tsx` (`activeCount`-filteret), og statusetikett på kort/detaljside.
   - Bruk leiefelter i stedet for pris: `leie_nok_per_m2`, `ledig_m2`, evt. `yield_netto`.
2. **Egen flate:** Eget filter/seksjon «Til leie» på siden, eller egen rute `/eiendommer/leie`.

Anbefalt: alternativ 1 (minst arbeid, samler salg + leie ett sted). Tas som egen liten oppgave før utleie publiseres.

---

## 7. Foreslått rekkefølge (puljer)

1. **Pulje 1 — komplett foto-løft på live (§4A):** last opp foto for de 11 som allerede er ute, og fyll pris/yield på `klubbholmen-2-harstad` og `industriveien-3-stokmarknes`. (Størst effekt: dagens listing-kort er bildeløse.)
2. **Pulje 2 — klare salgsoppdrag (§4B):** Sandgata 4 B, Løkkeveien 37, Kapstøveien. Deretter Industriveien 8 (vurder «reservert») og Havneterminalen 1 (avklar om den skal ut). Finneidkaiveien holdes til data finnes.
3. **Pulje 3 — anonyme off-market-teasere (§4C):** fire kort i `page.tsx`.
4. **Pulje 4 — utleie (§4E):** først «til leie»-tilrettelegging (§6), så publiser de 13.
5. **Løpende:** Rivarbuktveien 52 og Humleveien 7 (§4D) når mandatene er bekreftet.

---

## 8. Megler-blokker (JSONB) — referanse

`avatar`-URL er kun bekreftet for Christer. Bekreft e-post/avatar for øvrige før publisering.

| `assigned_to` | name | role | email* | phone | avatar |
|---|---|---|---|---|---|
| `christer_h` | Christer Hagen | Partner · Næringsmegler | christer@advanti.no | +47 984 53 571 | ✅ (se §5.1) |
| `havard_n` | Håvard Nome | Næringseiendomskonsulent | haavard@advantinord.no | +47 980 38 737 | ❓ må hentes |
| `daniel_a` | Daniel Adamsen | Partner · Næringsmegler | daniel@advantinord.no | +47 950 26 764 | ❓ må hentes |
| `mathias_n` | Mathias Nilsen | Næringsmegler | mathias@advanti.no | — | ❓ må hentes |

\* Bruk den **offentlige** e-postadressen som skal vises på web (avklar `@advanti.no` vs `@advantinord.no`).

---

## 9. Åpne spørsmål

1. **Havneterminalen 1 (Narvik):** fase = `kontrakt_ok` (nær sluttført) — skal den i det hele tatt ut på web?
2. **Industriveien 8 (Bodø):** fase = `due_diligence` — publisere som «reservert»?
3. **Offentlig e-post for meglere:** `@advanti.no` eller `@advantinord.no`?
4. **Referansenummer:** hvilket `reference`-nummerserie skal nye listinger bruke (`ADV-1xx`)?
5. **Utleie:** ønsker dere «til leie» på samme side (anbefalt) eller egen flate?
