# Plan 013: Port «Kunnskapssenter v2»-designet til det MDX-drevne /help-rutegruppen

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report — do not improvise. Update the status
> row for this plan in `plans/README.md` when done.
>
> **Drift check (run first)**:
> `ls src/content/help/*.mdx | wc -l` → forventet **27**. Hvis tallet er lavere,
> er innholdet endret siden planlegging — bekreft at slug-listen i «Current
> state» fortsatt stemmer før du lenker reading-paths/FAQ til konkrete slugs.

## Status

- **Priority**: P1 (eksplisitt designoppdrag fra eier)
- **Effort**: L (hub + artikkel-id-side; ny CSS + 4 klient-overflater + 1 skjemafelt)
- **Risk**: MED-HØY. Dette er IKKE «3 små komponenter»: det er 4 interaktive
  klient-overflater (`HelpSearch` combobox med tastaturnav + localStorage,
  `HelpLibrary` filter/sort/minisøk, `ArticleToc` scroll-spy, `ArticleFeedback`)
  + responsiv oppførsel. `pnpm build` fanger IKKE ødelagt ARIA, scroll-spy,
  localStorage-kanttilfeller, CSS-kollisjon eller mobil-layout — de krever
  browser-QA (Steg 8). Avgrenset til /help-rutegruppen + advanti-design.css +
  ett valgfritt skjemafelt; ingen taksonomi-migrasjon, ingen endring av
  eksisterende MDX-brødtekst.
- **Depends on**: 009–012 (DONE — help har 27 artikler i 6 kategorier)
- **Category**: design/frontend
- **Planned at**: commit `45f9e69`, 2026-06-14
- **Design kilde**: Anthropic design-share `qFJO-yN66tCNTzIfCywT_g`, filene
  `advanti/kunnskapssenter-v2.html` (hub), `kunnskapssenter-artikkel-v2.html`
  (artikkel), `hjelpesenter-app.jsx`, `artikkel-app.jsx`,
  `kunnskapssenter-data.js`, `KUNNSKAPSSENTER-BEST-PRACTICE.md`.

## Why this matters

Eier har bedt om at v2-designet av kunnskapssenteret implementeres — både
hub-/forsiden (`kunnskapssenter-v2.html`) og artikkel-«id»-siden under den. Den
eksisterende `/help`-ruten er allerede bygget i samme designspråk (samme
`ks-*`-klasser, `SubHero`, `CtaStrip`, kursiv-spans), så v2 er en **evolusjon**,
ikke en omskriving: den legger til (1) «Start her»-leseløp, (2) et filtrerbart
bibliotek-indeks med kategori-chips, sortering og minisøk, (3) en
«Hurtigsvar»-FAQ-akkordeon med `FAQPage`-JSON-LD, (4) et rikere søkefelt
(instant-dropdown + forslags-piller + hero-statistikkstripe), og på
artikkelsiden (5) venstre-skinne med innholdsfortegnelse (scroll-spy) +
kategorinavigasjon, (6) «Kort fortalt»-punkter, (7) interaktiv
tilbakemeldings-widget og (8) forrige/neste-navigasjon.

## Architecture decision (les før du koder)

**Behold innholdsmodellen og taksonomien som finnes.** Designprototypens
`kunnskapssenter-data.js` har en egen 6-kategori-taksonomi (Grunnleggende,
Verdivurdering, Yield, Driftsøkonomi, Markedet, Strategi) og egne artikkel-id-er.
Best-practice-dokumentet i designet sier eksplisitt at produksjonsmålet er
SSG + ekte URL-er + MDX/CMS — **som dette repoet allerede har** (`/help` via
content-collections, 27 artikler, per-artikkel statiske URL-er, sitemap,
JSON-LD). Vi porterer derfor designets **visuelle/UX-mønstre** oppå eksisterende
MDX-innhold og eksisterende `HELP_CATEGORIES`. Vi **endrer ikke**:
- `HELP_CATEGORIES`-slugs (`overview`/`getting-started`/`terms`/`for-investors`/`analysis`/`valuation`).
- Eksisterende MDX-brødtekst eller frontmatter (utover å legge til ett nytt,
  valgfritt `takeaways`-felt, se Steg 5).
- Innholdsregelen fra plan 010/011: ingen konkrete markedstall (yield-nivåer,
  kr/kvm, ledighet) i ny copy.

**Klient/server-grense (load-bearing — eng-review-funn).** `src/lib/blog/content.tsx`
importerer `content-collections` OG `@remixicon/react` (JSX-ikoner) på toppnivå.
Klientkomponenter må derfor **ikke** importere fra `content.tsx` — det drar med
seg hele content-collections + ikon-bundle inn i klient-JS. Regel:
- Serverkomponentene (`page.tsx`) bygger **plain, serialiserbare DTO-er** og
  sender dem som props til klientkomponentene. Ingen `JSX.Element`-felt
  (f.eks. `HELP_CATEGORIES.icon`) krysser server→klient-grensen — send `{slug, title}`.
- Nye plain-data-konstanter (`HELP_FAQS`, `HELP_PATHS`, kategorimerkelapper,
  rekkefølge-helper) legges i et **nytt modul `src/lib/blog/help-data.ts`** uten
  `content-collections`- eller ikon-import, slik at de trygt kan importeres fra
  både server og klient. `getOrderedHelpPosts()` tar `allHelpPosts` som argument
  (kalles fra server) i stedet for å importere collections selv.

## Current state

- **Hub** `src/app/(help)/help/page.tsx`: `SubHero` + `<HelpSearch>`, deretter
  «Populære artikler» (`ks-popular`), kategori-kort (`ks-cats`/`ks-cat` →
  `/help/category/[slug]`), `CtaStrip`. Server component.
- **Artikkel** `src/app/(help)/help/article/[slug]/page.tsx`: server component;
  `Breadcrumbs`, `ks-article`-grid med `ks-art-body` (meta/tittel/lede/forfatter/
  MDX/`faq`/feedback/related) og HØYRE `ks-toc`-aside (uten scroll-spy). Statisk
  feedback-widget (knapper uten handler). `relatedArticles` fra `data.related`.
- **Søk** `src/components/help/HelpSearch.tsx`: klientkomponent, filtrerer
  tittel/summary, ⌘K-fokus, Enter→toppresultat, dropdown. Ingen forslag, ingen
  recent, ingen kategori/lesetid i treff.
- **Data** `src/lib/blog/content.tsx`: `HELP_CATEGORIES` (6), `POPULAR_ARTICLES`
  (5 slugs, kuratert — IKKE endre listen), `getPopularArticles()`.
- **Skjema** `content-collections.ts` `HelpPost`: felt `title, updatedAt,
  summary, author, categories[enum 6], publishedAt?, related?, howto?, step?,
  faq?, slug?` + computed `mdx, tableOfContents ({slug,title} fra H2), images`.
  **Ingen `takeaways`-felt.** **Ingen artikkelrekkefølge** (trengs for
  forrige/neste).
- **MDX-blokktyper** finnes allerede som komponenter (`src/components/blog/mdx.tsx`:
  `Math`, `Note`, `Stepper`, `Compare`, `Fact`, `StatStrip`, …) — designets
  `formula`/`note`/`stepper`-blokker trenger ingen ny renderer; de er allerede
  dekket av `ks-prose` + MDX.
- **CSS** `src/styles/advanti-design.css` (importert i `globals.css`): har
  `ks-article, ks-art-body, ks-art-meta, ks-art-title, ks-art-lede,
  ks-art-author, ks-prose, ks-faq, ks-feedback, ks-related, ks-related-list,
  ks-toc, ks-popular*, ks-cats, ks-cat, ks-search*, ribbon-head, head-compact,
  subhero`. Designtokens (`--warm-grey`, `--warm-grey-85`, `--warm-grey-75`,
  `--warm-white`, `--accent`, `--accent-soft`, `--accent-faint`, `--accent-ink`,
  `--font-display`, `--font-body`, `--hairline`) finnes. **Mangler**: alle
  `hs-*`-hub-klasser og `art-*`-artikkel-klasser fra v2 (definert i designets
  to HTML-`<style>`-blokker — kopier verdiene derfra, de bruker samme tokens).
- 27 artikkel-slugs (kategori i parentes): `hva-er-naringseiendom`(overview),
  `hva-er-advanti`(overview), `verdivurdering-av-naringseiendom`(getting-started),
  `markedsleie-og-leieniva`(getting-started), `felleskostnader`(getting-started),
  `tjene-mer-pa-naringseiendom`(getting-started), `hva-er-yield`(terms),
  `netto-leieinntekter`(terms), `brutto-leieinntekter`(terms),
  `eierkostnader`(terms), `driftskostnader`(terms), `exit-yield`(terms),
  `yield-gap`(terms), `kpi-regulering-av-leie`(terms),
  `leiekontrakter-naringseiendom`(terms), `arealbegreper-bta-bra`(terms),
  `kontantstromsanalyse`(terms), `sensitivitetsanalyse`(terms),
  `diskontert-kontantstrom`(valuation), `prime-yield`(analysis),
  `kontorledighet`(analysis), `hvordan-lese-markedsrapport`(analysis),
  `kjope-naringseiendom`(for-investors),
  `due-diligence-naringseiendom`(for-investors),
  `finansiering-av-naringseiendom`(for-investors),
  `aksjekjop-vs-innmatskjop`(for-investors),
  `skatt-avskrivninger-naringseiendom`(for-investors).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Bygg (validerer skjema + MDX + typer; `ignoreBuildErrors:false`) | `pnpm build` | exit 0 |
| Typecheck (etter at content-collections er generert av build) | `pnpm typecheck` | exit 0 |
| Lint | — | N/A (`pnpm lint` ødelagt repo-vidt, kjent funn — se README) |
| QA | `/qa` på `/help` + én artikkel | ingen P0/P1 |

## Scope

**In scope** (filene du endrer/oppretter):
- `src/app/(help)/help/page.tsx` (hub: nye seksjoner)
- `src/app/(help)/help/article/[slug]/page.tsx` (artikkel: venstre-skinne, prev/next, kort fortalt)
- `src/components/help/HelpSearch.tsx` (oppgradert combobox)
- **Nye** komponenter i `src/components/help/`:
  `HelpLibrary.tsx` (KLIENT — indeks + chips + sort + minisøk),
  `ArticleToc.tsx` (KLIENT — scroll-spy venstre-skinne + kategorinav),
  `ArticleFeedback.tsx` (KLIENT — Ja/Nei → takk).
  `HelpFaq` rendres som **serverkomponent** (`<details>`/`hs-qa`, ingen klient-JS)
  + JSON-LD — droppet fra klient-listen for å holde JS nede.
- **Nytt** `src/lib/blog/help-data.ts` (plain, ingen content-collections/ikon-import):
  `HELP_FAQS`, `HELP_PATHS`, kategorimerkelapper, `getOrderedHelpPosts(posts)`.
  `POPULAR_ARTICLES` blir IKKE endret (kuratert, eierens valg).
- `content-collections.ts` (legg til valgfritt `takeaways: z.array(z.string()).optional()` i `HelpPost`).
- `src/styles/advanti-design.css` (nye `hs-*`- og `art-*`-klasser fra designet).
- Valgfritt: `takeaways:`-frontmatter i et lite utvalg flaggskip-MDX (Steg 5).

**Out of scope** (IKKE rør):
- `HELP_CATEGORIES`-slugs/struktur, taksonomi-migrasjon, designets `kunnskapssenter-data.js`.
- Eksisterende MDX-brødtekst og eksisterende frontmatter-felter.
- `/help/category/[slug]` og `/help/layout.tsx` (kategori-sidene består; chips kan dyplenke til dem).
- `tweaks-panel`/dark mode/density-toggle fra prototypen (prototyp-only; light-only per DESIGN.md).
- `src/content/blog/`, navigasjon (`lib/navigation.ts`).

## Git workflow

- Branch: `feat/kunnskapssenter-v2-design` (allerede opprettet fra main `45f9e69`).
- Commit-stil: `feat(help): <del>` per logisk del (CSS, hub-seksjoner, artikkel-skinne, søk).
- Ikke push / ikke opprett PR uten beskjed fra eier.

## Steps

### Steg 0 — CSS-fundament
Designprototypens HTML-filer ligger IKKE i repoet — de er hentet fra
design-share-arkivet (utpakket lokalt). `hs-*`-klassene står i
`kunnskapssenter-v2.html`s `<style>`-blokk og `art-*`-klassene i
`kunnskapssenter-artikkel-v2.html`s `<style>`-blokk. Lim inn de faktiske
CSS-verdiene i `advanti-design.css` under en tydelig
`/* === Kunnskapssenter v2 === */`-seksjon (ikke bare referér dem). De bruker
allerede repoets tokens. Behold responsiv- og `prefers-reduced-motion`-reglene.
Sjekk for navnekollisjon mot eksisterende `ks-*`/`art-*`-klasser før innliming.
Ikke introduser nye farger/spacing-verdier (DESIGN.md). **Verify**: `pnpm build` exit 0.

### Steg 1 — Hero-søk → combobox (`HelpSearch.tsx`)
Oppgrader til designets `hs-search`/`hs-searchwrap`/`hs-results`-mønster:
forslags-piller (`hs-suggest`: Yield, Verdivurdering, DCF, Leiekontrakt, WAULT,
Bodø → setter query), instant-dropdown med tittel + `{kategori} · {lesetid} min`,
recent searches (`localStorage` `ks.recent`, maks 5; wrap i try/catch for
private-mode/quota), populære når tomt, tom-tilstand med «Kontakt en rådgiver
→»-CTA. **NB**: dagens `HelpSearch` har KUN ⌘K/Enter/Esc — ↑/↓-piltastnavigasjon
(`aria-activedescendant`) er NY funksjonalitet, ikke «behold». Full ARIA combobox
(`role=combobox/listbox/option`, `aria-expanded`, `aria-controls`). Input trenger
lesetid+kategori i `index`-propen — utvid `searchIndex`-map i `page.tsx` (server
bygger DTO). Legg til hero-statistikkstripe (`hs-herostats`): `{antall} artikler`,
`6 temaer`, `Gratis`, `Sist oppdatert {nyeste updatedAt}`. Søke-events (om sporet)
via `trackEvent`-helper (`src/lib/analytics.ts` → `window.dataLayer`), ikke ad-hoc.

### Steg 2 — «Start her»-leseløp (hub)
Legg til seksjon (`hs-paths`, 3 kort) etter hero. Definer `HELP_PATHS` i
`content.tsx` med ekte slugs:
- **01 «Du eier næringseiendom»**: `verdivurdering-av-naringseiendom`, `hva-er-yield`, `sensitivitetsanalyse`.
- **02 «Du vurderer å investere»**: `hva-er-naringseiendom`, `diskontert-kontantstrom`, `finansiering-av-naringseiendom`.
- **03 «Du leier ut eller forvalter»**: `leiekontrakter-naringseiendom`, `kpi-regulering-av-leie`, `felleskostnader`.
Hvert steg lenker til `/help/article/{slug}` med tittel fra `allHelpPosts`.
STOP hvis en slug ikke finnes (drift) — velg nærmeste eksisterende fra samme kategori og noter det.

### Steg 3 — Bibliotek-indeks (hub, `HelpLibrary.tsx` klient)
Erstatt `ks-cats`-kortene med designets indeks: toolbar (`hs-toolbar`) med minisøk
(`hs-minisearch`), kategori-chips (`hs-chips`: «Alle» + 6 kategorier med antall),
sortering (`hs-sort`), og rader (`hs-row`: `rtag` = `{kategori}` + dot, `rtitle`,
`rsum`, `rauthor` = forfatter+dato, `rread` = lesetid, pil). Tom-tilstand
(`hs-empty`) med nullstill + kontakt-CTA.
- **Determinisitisk sortering** (eng-review-funn — ikke len deg på
  `allHelpPosts`-rekkefølge): «Mest lest» = `POPULAR_ARTICLES`-indeks først, så
  resten etter `updatedAt` desc med `slug` som stabil tie-break. «Nyeste» =
  `updatedAt` desc, `slug` tie-break. «A–Å» = `title` (norsk `localeCompare`).
  Serverpage sorterer/bygger DTO-listen; klienten filtrerer/re-sorterer på den.
- Props: plain DTO-liste (slug, title, summary, categorySlug, categoryTitle,
  author, date, readingTime, popRank). Ingen content-collections-import i klienten.
- **Prefetch**: sett `prefetch={false}` på rad-`<Link>`-ene. Indeksen rendrer
  alle 27 ruter; default-viewport-prefetch laster da rute-chunks for hele
  biblioteket ved sidelast (jf. prior learning `hidden-panels-viewport-prefetch`).
- Chip kan dyplenke til `/help/category/[slug]` (behold kategorisidene) ELLER
  filtrere in-place; velg in-place filtrering, med en «se hele kategorien
  →»-lenke når ett filter er aktivt. URL-state (`?q`/`?kategori`/`?sort`) er
  nice-to-have via `useSearchParams` + `history.replaceState`, ikke MVP-krav.

### Steg 4 — «Hurtigsvar»-FAQ (hub, server `HelpFaq` + JSON-LD)
Definer `HELP_FAQS` i `help-data.ts`. **Shape** (eng-review-funn — skill JSON-LD
og synlig lenke fra hverandre):
`{ q: string, a: string, rel?: { label: string, href: string } }`.
`a` er ren tekst (ingen HTML/lenke) og er det `FAQPage`-JSON-LD emitter; `rel`
er en separat synlig «Les mer»-affordans (`.related`) under svaret. Da kan
`rel.href` peke på en hvilken som helst intern rute (f.eks. `/naringsmegler`)
uten å bryte JSON-LD-speilingen. Render `hs-faq-grid` (aside + `hs-acc`-akkordeon
med `<details>`/`hs-qa`) som **serverkomponent**. Emitter `FAQPage`-JSON-LD via
eksisterende `StructuredData type="faq"` med `{question: q, answer: a}` — MÅ
speile synlig FAQ (Google/policy). 6 stk, norsk, basert på designets FAQ-copy.
Prisspenn for verdivurdering er en tjenestepris (ikke et markedstall), men flagg
til eier; behold designets copy med mindre eier sier annet.

### Steg 5 — `takeaways`-felt + «Kort fortalt» (skjema + artikkel)
Legg til `takeaways: z.array(z.string()).optional()` i `HelpPost`-skjemaet (uten
fast lengde). Render `art-kort`-boks **kun når feltet finnes** — romertall
utledes dynamisk fra index (I, II, III, …), så boksen tåler et hvilket som helst
antall punkter (eng-review-funn: ikke hardkod 3).
**Scope (eng-review-funn — unngå skjult innholdsarbeid + dobbel sannhetskilde)**:
Selve `takeaways`-populeringen er REDAKSJONELT arbeid, ikke kode. I denne planen
populeres KUN flaggskipet `verdivurdering-av-naringseiendom` (siden eier
eksplisitt refererte den) som demonstrasjon. Resten er ute av scope (eget
innholdsløp, plan-011-stil). Ikke dupliser en eksisterende `<Summary>`/«Kort
fortalt»-blokk som allerede står i brødteksten — «Kort fortalt» skal være
redaksjonelt distinkt fra lede-en. Ingen nye markedstall.

### Steg 6 — Artikkel venstre-skinne (`ArticleToc.tsx` klient + page-omlegging)
Legg om `ks-article`-grid til designets `art-shell` (256px venstre-skinne + 1fr).
Venstre-skinne (`art-rail`, sticky med `max-height: calc(100vh - 120px);
overflow-y:auto` — designets CSS; håndterer lange navs som `terms` med 12
artikler): innholdsfortegnelse (`art-toc`) med scroll-spy via
`IntersectionObserver` (rootMargin `-100px 0px -65% 0px`, `aria-current`), og
kategorinavigasjon (`art-nav`) med alle 6 kategorier. **Kun den AKTIVE kategorien
utvides** med sine artikler (gjeldende uthevet); de andre viser bare tittel+antall.
TOC bygges fra `data.tableOfContents` (allerede `{slug,title}` fra H2).
- **Eksplisitt plassering** (eng-review-funn — «behold hvis det passer» er ikke
  utførbart): «Relaterte tjenester»-lenkeblokken legges nederst i venstre-skinnen
  under `art-nav` (bevarer intern-lenke/SEO-verdien). «Skrevet av {forfatter}.
  Fant du en feil? → Si fra» flyttes til under artikkel-brødteksten ved
  feedback-widgeten.
- **Prefetch**: `prefetch={false}` på `art-nav`-artikkellenkene (de fleste er i
  kollapsede kategorier; jf. prior learning `hidden-panels-viewport-prefetch`).
- **Ikke dupliser breadcrumb-JSON-LD** (prior learning
  `breadcrumbs-already-exist-partially`): siden bruker allerede `<Breadcrumbs>`
  som emitter `BreadcrumbList`. Ikke legg til en ny BreadcrumbList.
- Skip-link (`skip-link` → `#art-main`).

### Steg 7 — Interaktiv feedback + forrige/neste (artikkel)
- `ArticleFeedback.tsx`: Ja/Nei → «Takk for tilbakemeldingen» (lokal state).
  Analytics-event via `trackEvent`-helper (`src/lib/analytics.ts` →
  `window.dataLayer`), IKKE ad-hoc (prior learning `analytics-transport-datalayer`).
  Erstatt den statiske widgeten (knapper uten handler).
- `getOrderedHelpPosts(posts)` i `help-data.ts` (tar `allHelpPosts` som arg, så
  modulen slipper content-collections-import): flat, deterministisk rekkefølge
  sortert på [kategori-indeks i `HELP_CATEGORIES`, så `title` norsk `localeCompare`].
  Serverpage utleder `{prev, next}` for gjeldende slug og sender som props.
  Render `art-prevnext` nederst (kun pilene som finnes; én-kolonne på mobil).

### Steg 8 — Verifikasjon
`pnpm build` fanger kun kompilering/skjema/typer — IKKE ARIA, scroll-spy,
localStorage, CSS-kollisjon eller mobil-layout. Derfor kreves browser-QA i tillegg.
1. `pnpm build` → exit 0 (validerer skjema, MDX, typer; `ignoreBuildErrors:false`).
2. `pnpm typecheck` → exit 0 (etter at build har generert content-collections-typer).
3. Eksisterende Playwright-suite må fortsatt være grønn for de relevante gatene:
   link-integritet (ingen `href="#"` / døde lenker), `mobile-overflow` (375px),
   `perf-budget` (mål i PRODBYGG — drep gammel server på :3105 først, jf. prior
   learning; sjekk at indeksens `prefetch={false}` holder JS-budsjettet).
4. Browser-QA (`/qa`) på `/help` + én artikkel (f.eks.
   `/help/article/verdivurdering-av-naringseiendom`), konkrete sjekker:
   - Combobox: ⌘K fokuserer; skriving viser dropdown med kategori+lesetid;
     ↑/↓ flytter `aria-activedescendant`; Enter åpner; Esc lukker; piller fyller
     query; recent vises når tomt (og overlever reload); tom-tilstand viser
     kontakt-CTA.
   - Bibliotek: chips filtrerer + viser antall; tre sorteringer gir stabil,
     deterministisk rekkefølge; minisøk filtrerer; tom-tilstand nullstiller.
   - FAQ: `<details>` åpner/lukker; `FAQPage`-JSON-LD validerer (Rich Results)
     og speiler synlig tekst; `rel`-lenker peker riktig.
   - Artikkel: venstre-TOC scroll-spy markerer aktiv seksjon; kun aktiv kategori
     utvidet; «Kort fortalt» vises der `takeaways` finnes; feedback toggler til
     takk + pusher dataLayer-event; prev/next lenker til riktige naboer.
   - Mobil (<980px): skinne stables (`order:2`), TOC skjules, rader kollapser.
   - Tvers over: light-only, ingen layout-shift, `:focus-visible`-ringer synlige,
     `prefers-reduced-motion` slår av animasjon.

## STOP conditions

- En hardkodet reading-path-slug (Steg 2) eller en FAQ-`rel` som peker på en
  help-artikkel finnes IKKE i `src/content/help/` → **STOP og rapportér**. Ikke
  improviser en erstatning (eng-review-funn: en STOP-betingelse og en
  «velg-nærmeste»-regel kan ikke være samme punkt). FAQ-`rel` som peker på ikke-help-ruter
  (f.eks. `/naringsmegler`) er unntatt — verifiser kun at ruten finnes i `navigation.ts`.
- `HelpPost`-kategori-enum eller `POPULAR_ARTICLES` er endret siden planlegging → bekreft mot live før du fortsetter.
- `pnpm build` feiler på MDX/skjema → ikke commit; fiks først.
- Et krav vil tvinge endring av eksisterende MDX-brødtekst eller taksonomi → STOP, det er utenfor scope.

## NOT in scope (vurdert og bevisst utsatt)

- **Taksonomi-migrasjon til prototypens 6 læringskategorier**
  (Grunnleggende/Verdivurdering/Yield/Driftsøkonomi/Markedet/Strategi). Codex
  flagget at dagens `HELP_CATEGORIES` («Om Advanti», «Kom i gang») er mindre
  «lærings-orientert» enn prototypen, så et polert bibliotek over support-/
  produktkategorier kan føles litt inkoherent. Men en retaksonomi rører enum-et,
  all MDX-frontmatter, kategorisidene og sitemap — stor innholdsmigrasjon, ikke
  et design-port. Beholder eksisterende taksonomi; se TODO.
- **Full `takeaways`-populering for alle 27 artikler** — redaksjonelt løp (plan-011-stil), ikke kode.
- **URL-state-synk for biblioteket** (`?q`/`?kategori`/`?sort`) — nice-to-have, ikke MVP.
- **Hostet søk (Algolia/Meilisearch), søkelogging, dark mode/density-tweaks** — prototyp/fremtid (best-practice §3, §6).

## What already exists (gjenbrukes, ikke gjenbygges)

- `ks-*`-designspråket, `SubHero`, `CtaStrip`, `Breadcrumbs` (+BreadcrumbList),
  `StructuredData` (article/faq/howto), `ks-toc`/`ks-related`/`ks-feedback`,
  `MDX`-komponenter (`Math`/`Note`/`Stepper` = designets formula/note/stepper),
  `calculateReadingTime`, `getPopularArticles`, `trackEvent`/`dataLayer`-analytics,
  `/help/category/[slug]`-sider. Planen utvider disse i stedet for å bygge nytt.

## TODO (utenfor denne planen)

- Vurder å gjøre kunnskaps-taksonomien mer lærings-orientert (slå sammen/omdøp
  «Om Advanti»/«Kom i gang» mot prototypens modell). Krever innholdsmigrasjon +
  redirect-strategi; ta som egen plan hvis eier ønsker.

## Design-spesifikasjon (fra /plan-design-review)

### Informasjonsarkitektur (seksjonsrekkefølge)

```
HUB /help                              ARTIKKEL /help/article/[slug]
┌─────────────────────────────┐       ┌───────────────┬───────────────────┐
│ Hero: H1 + lede              │       │ art-rail 256px│ art-body 1fr      │
│  └ combobox-søk (primær)     │       │ ┌───────────┐ │ Breadcrumbs       │
│  └ forslags-piller           │       │ │ TOC       │ │ meta · lesetid ·  │
│  └ hero-statistikkstripe     │       │ │ (scroll-  │ │   sist oppdatert  │
├─────────────────────────────┤       │ │  spy)     │ │ H1 + lede         │
│ «Start her» 3 leseløp        │       │ ├───────────┤ │ forfatter         │
├─────────────────────────────┤       │ │ kategori- │ │ «Kort fortalt»*   │
│ Bibliotek (primær browse)    │       │ │ nav (kun  │ │ MDX-brødtekst     │
│  toolbar: minisøk·chips·sort │       │ │ aktiv     │ │ FAQ (hvis faq)    │
│  index-rader (27)            │       │ │ utvidet)  │ │ feedback (interakt)│
├─────────────────────────────┤       │ ├───────────┤ │ + «Skrevet av/feil»│
│ «Hurtigsvar» FAQ-akkordeon   │       │ │ relaterte │ │ prev/next         │
├─────────────────────────────┤       │ │ tjenester │ │ relaterte artikler│
│ CtaStrip                     │       │ └───────────┘ │                   │
└─────────────────────────────┘       └───────────────┴───────────────────┘
Visuell prioritet hub: søk > bibliotek > leseløp > FAQ.   *kun når takeaways finnes
```

### Interaksjonstilstander (hva brukeren SER)

| Flate | Tom / førstegang | Aktiv / treff | Ingen treff | Suksess |
|-------|------------------|---------------|-------------|---------|
| Combobox-søk | Recent (localStorage) + populære artikler | Dropdown: tittel + `{kategori} · {lesetid} min`, aktiv rad uthevet | «Ingen treff på «q»» + «Kontakt en rådgiver →» | Enter/klikk → artikkel |
| Bibliotek | Alle 27 rader, «Mest lest»-sortering | Filtrert liste + antall (aria-live) | `hs-empty`: nullstill-knapp + kontakt-CTA | — |
| FAQ-akkordeon | Første åpen, resten lukket | `<details>` toggler; `rel`-«Les mer» under svar | — | — |
| Feedback | «Var dette til hjelp?» Ja/Nei | — | — | «Takk for tilbakemeldingen» + dataLayer-event |
| Artikkel-TOC | Første seksjon aktiv | Scroll-spy markerer gjeldende (`aria-current`) | — | — |

Ingen ekte lastetilstand: hub/artikkel er statisk SSG, søk/filter kjører på
in-memory-indeks (instant). Skeleton/spinner ikke nødvendig.

### A11y / responsiv (utover Steg 8)

- Touch-mål: chips, piller og sort-knapper må ha ≥40px effektiv tappehøyde på
  mobil (designets `padding: 7px 14px` gir ~32px — øk vertikal padding eller
  min-height i `@media (max-width:760px)`).
- `<mark>`-treff bruker fast mørk tekst på accent (designet er allerede
  kontrast-fikset — behold).
- Combobox: `aria-label` på input + listbox; `role=option` + `id` per rad for
  `aria-activedescendant`.

### AI-slop-noter (dokumentert, ikke endring)

- `art-kort` bruker `border-left: 3px solid var(--accent)` (slop-blacklist #8),
  men er ÉN bevisst redaksjonell «Kort fortalt»-callout i tråd med
  designsystemets eksisterende accent-kantbruk — ikke et dekorativt kortrutenett.
  Beholdes med vilje.
- 3-kolonners `hs-paths` er innholdsrike leseløp (nummererte steg-lister), ikke
  ikon+tittel+2-linjers slop-grid. OK.
- Type: Newsreader (display) + Inter (body) er etablert merkevaretype per
  DESIGN.md, ikke lat system-default.

## Maintenance notes

- Designets prototyp-data (`kunnskapssenter-data.js`) brukes IKKE i prod — den er
  referanse for layout/copy. URL-state-søk og hostet søk (Algolia o.l.) er
  fremtidig arbeid (best-practice §3), ikke denne planen.
- Hvis `takeaways` senere ønskes for alle artikler, er det innholdsarbeid (plan
  011-stil), ikke kode.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | issues_open→folded | 13 issues, 0 critical gaps; all folded into plan |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | clean | score 7/10 → 9/10, 3 tillegg |
| Outside Voice | `/codex review` | Independent 2nd opinion | 1 | issues_found | 13 funn, alle absorbert |

**DESIGN:** 7-pass-review, ingen hard-rejections. Initial 7/10 (manglet
IA-diagram, samlet tilstandstabell, eksplisitte touch-mål). Etter tillegg 9/10:
IA-/layout-diagram, interaksjonstilstand-tabell, og a11y/touch-mål-spesifikasjon
lagt til. `art-kort` accent-kant + 3-kol leseløp vurdert mot slop-blacklist og
dokumentert som bevisste, ikke slop. Uløst (flagg, ikke blokkerer): FAQ-prisspenn
(15–40k kr) — eier bekrefter copy.

**Scope:** akseptert som spesifisert — eier ba eksplisitt om både hub
(`kunnskapssenter-v2.html`) og artikkel-«id»-siden. Kompleksitetsgaten (12+
filer / 4 klient-overflater) er reell, men scope er forhåndsbestemt av eier; en
klient-overflate (`HelpFaq`) ble flyttet til server for å dempe JS.

**Architecture review (2 funn):** (1) Klient/server-grense — `content.tsx` drar
content-collections + ikoner; klientkomponenter må bruke plain DTO-props + nytt
`help-data.ts`. (2) Ikke dupliser BreadcrumbList-JSON-LD (prior learning).

**Code quality (4):** FAQ-shape splittet i ren-tekst `a` (JSON-LD) + separat
`rel`-lenke; «behold høyre-aside hvis det passer» erstattet med eksplisitt
plassering; ↑/↓-tastenav er NY (ikke «behold»); `takeaways` rendres dynamisk
(ikke hardkodet 3).

**Test review:** ingen unit-testbar ren logikk av betydning (sortering er
deterministisk og bør få en liten Vitest om harness brukes); de reelle risikoene
(ARIA-combobox, scroll-spy, localStorage, mobil) er browser-flate → dekkes av
`/qa` + eksisterende Playwright-gater (link-integritet, mobile-overflow,
perf-budget). Ingen regresjoner identifisert; statisk feedback-widget → interaktiv
er additiv. Coverage-strategi: 3 Playwright-gater + `/qa`-økt (Steg 8).

**Performance (1):** `prefetch={false}` på bibliotek-rader + kollapsede
`art-nav`-lenker — ellers prefetcher Next.js rute-chunks for alle 27 ruter ved
sidelast (prior learning `hidden-panels-viewport-prefetch`, +93KB-klassen).
Mål i prodbygg.

**CODEX:** 13 funn, alle absorbert i planen (ingen avvist). Sterkeste:
klient/server-grense, FAQ JSON-LD-drift, ikke-deterministisk «Mest lest»,
takeaways-scope-creep, selvmotsigende STOP-betingelse.

**CROSS-MODEL:** Claude (prior learnings) + Codex enige om at dette bygges oppå
eksisterende /help, ikke som parallell. Eneste strategiske spenning — taksonomi
(behold vs. retaksonomi) — er løst som NOT-in-scope + TODO; eier kan overstyre.

**VERDICT:** ENG + DESIGN CLEARED (alle funn foldet inn) — klar for implementering.

NO UNRESOLVED DECISIONS
