# Plan 009: Tekniske SEO-fikser for kunnskapssenteret (/help)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 5e1c60a..HEAD -- src/app/sitemap.ts "src/app/(help)" content-collections.ts src/content/help/hva-er-naringseiendom.mdx src/content/help/hva-er-yield.mdx src/styles/advanti-design.css`
> If any in-scope file changed since `5e1c60a`, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it
> as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S–M
- **Risk**: LOW (additive metadata/gating; no visual redesign)
- **Depends on**: none
- **Category**: bug + tech-debt (SEO)
- **Planned at**: commit `5e1c60a`, 2026-06-12

## Why this matters

Kunnskapssenteret skal være Advantis viktigste organiske trafikk-kanal, men
fire konkrete feil svekker det i dag: (1) to kategorisider («For Investorer»,
«Markedsanalyse») har null artikler men er indeksert og ligger i sitemap —
klassisk tynt innhold som senker crawl-kvaliteten på hele seksjonen; (2) den
mest populære artikkelen har forfatter-handle `christer` som ikke mapper til
noe, så siden mister forfatterboks og Person-`@id` i Article-schemaet
(E-E-A-T-signal); (3) Article-JSON-LD setter alltid `datePublished` lik
`dateModified` og utelater felter komponenten allerede støtter; (4) det
finnes ingen FAQ-støtte, så artiklene kan ikke konkurrere om featured
snippets / AI-overview-sitering. Denne planen fikser alle fire. Plan 010 og
011 (innhold) bygger på feltene som innføres her.

## Current state

Relevante filer:

- `src/app/sitemap.ts` — genererer sitemap; linje 74–78 mapper ALLE
  `HELP_CATEGORIES` uten å sjekke artikkelantall:
  ```ts
  // Help category pages — `lastModified` omitted (no true modified date).
  const helpCategories = HELP_CATEGORIES.map((category) => ({
    url: `${baseUrl}/help/category/${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  ```
- `src/lib/blog/content.tsx:48–102` — `HELP_CATEGORIES` har 6 kategorier.
  Per 2026-06-12 har `for-investors` og `analysis` **0 artikler** (verifisert
  ved frontmatter-skann av `src/content/help/*.mdx`).
- `src/app/(help)/help/category/[slug]/page.tsx:50–71` — `generateMetadata`
  kaller `constructMetadata` uten `noIndex`; linje 135–138 rendrer «Ingen
  artikler i denne kategorien ennå.» for tomme kategorier. `allHelpPosts`
  er allerede importert i filen (linje 1).
- `src/lib/utils.ts` — `constructMetadata({ noIndex?: boolean, ... })`
  støtter allerede `noIndex` (sjekk signaturen rundt linje 132–165).
- `src/content/help/hva-er-naringseiendom.mdx:6` — `author: "christer"`.
  `AUTHOR_NAMES`/`AUTHOR_META` i
  `src/app/(help)/help/article/[slug]/page.tsx:18–37` kjenner bare
  `codehagen` og `vsoraas`; `AUTHORS` i `src/lib/authors.ts` har `codehagen`
  med `personSlug: "christer-hagen"`. Begge identiteter er Christer Hagen —
  riktig handle er `codehagen`.
- `content-collections.ts:204–238` — `HelpPost`-skjemaet. Har `updatedAt`
  men IKKE `publishedAt` og IKKE `faq`. NB: `hva-er-naringseiendom.mdx` har
  allerede `publishedAt: "2024-01-25"` i frontmatter — zod stripper ukjente
  felter i dag, så verdien er usynlig for koden.
- `src/app/(help)/help/article/[slug]/page.tsx:148–158` — Article-schema:
  ```tsx
  <StructuredData
    type="article"
    data={{
      title: data.title,
      summary: data.summary,
      publishedAt: data.updatedAt,   // ← alltid lik dateModified
      updatedAt: data.updatedAt,
      author: data.author,
      url: `/help/article/${data.slug}`,
    }}
  />
  ```
  `readingTime` (linje 131–133) og `category` (linje 114–116) er beregnet FØR
  denne JSX-en, så de kan brukes direkte.
- `src/components/StructuredData.tsx:361–384` — Article-builderen leser
  valgfritt `data.timeRequired` (minutter → `PT<n>M`) og
  `data.articleSection`. `case "faq"` (linje 388–404) finnes allerede og tar
  `data.faqs: {question, answer}[]`.
- **Repo-konvensjon (viktig)**: JSON-LD skal speile synlig sideinnhold — se
  HowTo-piloten i `content-collections.ts:227–236` og kommentaren der.
  FAQ-implementasjonen i steg 5 MÅS følge samme prinsipp: samme
  frontmatter-array driver både synlig seksjon og JSON-LD.
- **Designsystem**: Les `DESIGN.md` før steg 5. Semantiske klasser fra
  `src/styles/advanti-design.css` (mønster: `ks-*`-klassene for
  kunnskapssenteret) — ikke ad-hoc Tailwind. Norsk copy.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `pnpm typecheck` | exit 0 |
| Build (kompilerer også MDX-kolleksjonene) | `pnpm build` | exit 0 |
| Prod-server for verifikasjon | `pnpm start &` (kjør i bakgrunn, husk å drepe etterpå) | server på :3000 |
| Lint | — | **N/A: `pnpm lint` er ødelagt repo-vidt** (kjent funn, se plans/README.md «New findings from plan 001 execution») — ikke bruk lint som gate |

## Scope

**In scope** (de eneste filene du endrer):
- `src/app/sitemap.ts`
- `src/app/(help)/help/category/[slug]/page.tsx`
- `src/app/(help)/help/article/[slug]/page.tsx`
- `content-collections.ts` (kun `HelpPost`-skjemaet)
- `src/content/help/hva-er-naringseiendom.mdx` (kun `author`-linjen)
- `src/content/help/hva-er-yield.mdx` (kun ny `faq`-frontmatter)
- `src/styles/advanti-design.css` (kun hvis steg 5 trenger en ny `ks-faq`-klasse)

**Out of scope** (IKKE rør, selv om det ser relatert ut):
- `src/components/StructuredData.tsx` — `faq`- og `article`-casene støtter
  allerede alt vi trenger; ingen endring nødvendig.
- Blog-, kunde-, person- eller listing-rutene og deres schema.
- `HELP_CATEGORIES`-definisjonen i `src/lib/blog/content.tsx` — ikke slett
  de tomme kategoriene; plan 011 fyller dem, og gatingen i steg 1–2 åpner
  dem automatisk når innhold lander.
- Innholdet (brødteksten) i eksisterende artikler — det er plan 010/011.

## Git workflow

- Branch: `advisor/009-help-seo-tekniske-fikser`
- Konvensjon fra `git log`: conventional commits på norsk, f.eks.
  `fix(seo): noindex + sitemap-gate for tomme help-kategorier`
- Ikke push / ikke opprett PR uten beskjed fra operatøren.

## Steps

### Steg 1: Gate tomme kategorier ut av sitemap

I `src/app/sitemap.ts`, endre `helpCategories` (linje 74–78) til å filtrere
bort kategorier uten artikler. `allHelpPosts` er allerede importert:

```ts
// Help category pages — `lastModified` omitted (no true modified date).
// Categories with zero articles are excluded until they have content —
// they render an empty state and would be thin pages in the index.
const helpCategories = HELP_CATEGORIES.filter((category) =>
  allHelpPosts.some((post) =>
    (post.categories as string[]).includes(category.slug),
  ),
).map((category) => ({
  url: `${baseUrl}/help/category/${category.slug}`,
  changeFrequency: "weekly" as const,
  priority: 0.7,
}));
```

**Verify**: `pnpm typecheck` → exit 0.

### Steg 2: noindex på tomme kategorisider

I `src/app/(help)/help/category/[slug]/page.tsx`, i `generateMetadata`
(linje 50–71), legg til en tom-sjekk og send `noIndex`:

```ts
const hasArticles = allHelpPosts.some((post) =>
  (post.categories as string[]).includes(slug),
)

return constructMetadata({
  path: `/help/category/${slug}`,
  title: `${title} – Advanti Hjelpesenter`,
  description,
  image: `/api/og/help?title=${encodeURIComponent(
    title,
  )}&summary=${encodeURIComponent(description)}`,
  noIndex: !hasArticles,
})
```

**Verify**: `pnpm typecheck` → exit 0.

### Steg 3: Fiks forfatter-handlen på flaggskipartikkelen

I `src/content/help/hva-er-naringseiendom.mdx` linje 6, endre
`author: "christer"` → `author: codehagen` (samme stil som de andre
artiklene, uten anførselstegn).

**Verify**:
`grep -rn 'author: "christer"' src/content/` → 0 treff.
`grep -c 'author: codehagen' src/content/help/hva-er-naringseiendom.mdx` → 1.

### Steg 4: Ekte datePublished + rikere Article-schema

1. I `content-collections.ts`, i `HelpPost`-skjemaet (etter `updatedAt` på
   linje 210), legg til:
   ```ts
   // Optional original publish date. When absent, the article page falls
   // back to updatedAt for schema.org datePublished.
   publishedAt: z.string().optional(),
   ```
2. I `src/app/(help)/help/article/[slug]/page.tsx`, oppdater
   `StructuredData type="article"`-blokken (linje 148–158) til:
   ```tsx
   <StructuredData
     type="article"
     data={{
       title: data.title,
       summary: data.summary,
       publishedAt: data.publishedAt ?? data.updatedAt,
       updatedAt: data.updatedAt,
       author: data.author,
       url: `/help/article/${data.slug}`,
       timeRequired: readingTime ?? undefined,
       articleSection: category.title,
     }}
   />
   ```
   NB: `readingTime` og `category` beregnes i dag NEDENFOR JSX-returen
   starter men FØR denne blokken brukes? Nei — sjekk: `category` beregnes
   linje 114, `readingTime` linje 131, og `return (` starter linje 138.
   Begge er altså tilgjengelige. Ikke flytt på noe.

**Verify**: `pnpm typecheck` → exit 0. `pnpm build` → exit 0 (bekrefter at
`publishedAt`-frontmatter i hva-er-naringseiendom.mdx nå validerer).

### Steg 5: FAQ-felt i kolleksjonen + synlig FAQ-seksjon + JSON-LD

1. I `content-collections.ts`, i `HelpPost`-skjemaet, legg til etter
   `step`-feltet (linje 236):
   ```ts
   // Opt-in FAQ. Same policy as `howto`/`step` above: the emitted FAQPage
   // JSON-LD MUST mirror a visible FAQ section on the page, so the article
   // page renders this exact array as visible content AND as schema.
   faq: z
     .array(z.object({ question: z.string(), answer: z.string() }))
     .min(2)
     .optional(),
   ```
2. I `src/app/(help)/help/article/[slug]/page.tsx`:
   - Etter HowTo-blokken (linje 159–168), legg til:
     ```tsx
     {data.faq && data.faq.length >= 2 && (
       <StructuredData type="faq" data={{ faqs: data.faq }} />
     )}
     ```
   - Rendre synlig FAQ-seksjon inne i `<article className="ks-art-body">`,
     ETTER `<MDX …/>` (linje 229) og FØR feedback-blokken (linje 232):
     ```tsx
     {data.faq && data.faq.length >= 2 && (
       <div className="ks-faq">
         <h2 id="ofte-stilte-sporsmal">Ofte stilte spørsmål</h2>
         {data.faq.map((item) => (
           <div className="ks-faq-item" key={item.question}>
             <h3>{item.question}</h3>
             <p>{item.answer}</p>
           </div>
         ))}
       </div>
     )}
     ```
3. Styling: Les `DESIGN.md` først. Legg til `.ks-faq`-regler i
   `src/styles/advanti-design.css` ved siden av de eksisterende
   `ks-*`-reglene (søk etter `.ks-related` som mønster — match dens
   typografi-skala, spacing-tokens og border-stil; ingen nye farger).
4. Pilot-innhold: legg FAQ-frontmatter i
   `src/content/help/hva-er-yield.mdx` (etter `slug`-linjen):
   ```yaml
   faq:
     - question: "Hva er en god yield for næringseiendom?"
       answer: "Det finnes ikke ett riktig svar — yield reflekterer risiko. Sentralt beliggende kontoreiendom med solide leietakere på lange kontrakter prises med lavere yield enn eldre bygg med korte kontrakter i mindre markeder. Sammenlign alltid mot tilsvarende eiendommer i samme marked."
     - question: "Hva er forskjellen på brutto- og netto-yield?"
       answer: "Brutto-yield beregnes av brutto leieinntekter, mens netto-yield (det vanligste i næringseiendom) beregnes av leieinntekter fratrukket eierkostnader. Netto-yield gir det mest presise bildet av faktisk avkastning."
     - question: "Hvorfor faller verdien når yielden stiger?"
       answer: "Verdi = netto leieinntekter delt på yield. Når markedet krever høyere avkastning (høyere yield) for samme leieinntekt, må prisen ned. En endring på ett prosentpoeng i yield kan gi store verdiutslag."
   ```

**Verify**:
1. `pnpm typecheck` → exit 0.
2. `pnpm build` → exit 0.
3. `pnpm start &` deretter:
   - `curl -s http://localhost:3000/help/article/hva-er-yield | grep -c "FAQPage"` → `1` (eller mer).
   - `curl -s http://localhost:3000/help/article/hva-er-yield | grep -c "Ofte stilte spørsmål"` → minst `1`.
   - `curl -s http://localhost:3000/help/category/for-investors | grep -c 'noindex'` → minst `1`.
   - `curl -s http://localhost:3000/help/category/terms | grep -c 'noindex'` → `0`.
   - `curl -s http://localhost:3000/sitemap.xml | grep -c "help/category/for-investors"` → `0`.
   - `curl -s http://localhost:3000/sitemap.xml | grep -c "help/category/terms"` → `1`.
   - `curl -s http://localhost:3000/help/article/hva-er-naringseiendom | grep -c "2024-01-25"` → minst `1` (datePublished i JSON-LD).
   - Drep serveren etterpå (`kill %1` eller tilsvarende).

## Test plan

Repoet har Vitest (`pnpm test`, etablert i plan 004) for ren logikk, men
endringene her er metadata/JSX uten ny ren logikk — curl-gatene over ER
testplanen. Kjør `pnpm test` én gang til slutt for å bekrefte at ingenting
brakk: alle eksisterende tester grønne.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exit 0
- [ ] `pnpm build` exit 0
- [ ] Alle 8 curl-gatene i steg 5 gir forventet resultat
- [ ] `grep -rn 'author: "christer"' src/content/` → 0 treff
- [ ] `pnpm test` exit 0
- [ ] `git status` viser ingen endrede filer utenfor in-scope-listen
- [ ] Statusrad oppdatert i `plans/README.md`

## STOP conditions

Stopp og rapporter (ikke improviser) hvis:

- Kode-excerpts i «Current state» ikke matcher live kode (drift siden `5e1c60a`).
- `constructMetadata` i `src/lib/utils.ts` viser seg å IKKE ha `noIndex`-parameter.
- `pnpm build` feiler på MDX-kompilering etter skjemaendringene i
  content-collections.ts — IKKE forsøk å «fikse» andre kolleksjoner.
- En curl-gate feiler to ganger etter rimelig fiksforsøk.
- `for-investors` eller `analysis` har fått artikler siden planen ble
  skrevet (da er gate-logikken fortsatt riktig, men verifikasjonene for
  «tom kategori» må byttes til en kategori som faktisk er tom — rapporter
  hvilken).

## Maintenance notes

- Gatingen i steg 1–2 er **selvopphevende**: når plan 011 legger første
  artikkel i `for-investors`/`analysis`, kommer kategorien automatisk inn i
  sitemap og mister noindex. Ingen oppfølging nødvendig.
- FAQ-konvensjonen (frontmatter driver både synlig innhold og JSON-LD) må
  holdes: en reviewer skal avvise PR-er som legger FAQ-schema uten synlig
  seksjon eller omvendt.
- Plan 010 og 011 forutsetter `publishedAt`- og `faq`-feltene fra denne
  planen — denne må lande først.
- Bevisst utsatt: `wordCount`/`keywords` i Article-schema (lav SEO-verdi,
  mer rør); FAQ på flere eksisterende artikler (plan 010/011 eier innhold).
