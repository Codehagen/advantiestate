# TODOS

Deferred work captured during the editorial redesign port (/plan-eng-review, 2026-05-21),
the AI SEO closure review (/plan-eng-review, 2026-05-24), the AI-SEO research pass
(/web-research, 2026-05-24), and the presserom/entity review pipeline
(/plan-ceo-review + /plan-eng-review + /design-review, 2026-06-10).

---

## TODO 22 — Sonedata-verifisering Bodø

- **What:** Verifiser geometri og leieprisintervaller (kontor/handel/logistikk) for
  de 3 utkast-sonene (City Nord/Stormyra, Plassmyra/flyplassområdet, Burøya/havna)
  og gjennomgå eksisterende Sentrum/Rønvika-tall mot Advantis transaksjons- og
  leiedata.
- **Why:** Sonedata-laget (`zones.ts`) er publisert, men `publishedZones()`-gaten
  holder utkast-sonene ute inntil `segments` + `reviewedBy` fylles. De to
  eksisterende sonene (Sentrum, Rønvika) er merket «indikative estimater Q4 2025»
  uten verifisering mot reelle transaksjonsobservasjoner.
- **Context:** Aktivering = fyll `segments` + `reviewedBy` i
  `src/components/markedsinnsikt/maps/zones.ts` — null kodearbeid utover det.
  `publishedZones()`-gaten inkluderer sonen automatisk. Filer:
  `src/components/markedsinnsikt/maps/zones.ts`.
- **Depends on / blocked by:** Fase 1 av markedskart-planen (zones.ts, denne PR-en).
- **Effort:** Manuell datainnsamling (megler/analyse), ikke kode.

---

## TODO 19 — Pressevarsel — SHIPPED 2026-06-10 (skjema + lagring; utsendelse = runbook FASE 7)

- **What:** «Få pressevarsel»-skjema på /presserom (lead → Supabase, gjenbruk
  subscribe-flyten) + kvartalsvis utsendelse via Resend med tall, sitat og
  lenke til kvartalets arkivside.
- **Why:** Kvartalstallene venter i dag på å bli funnet; et varsel lander dem
  i innboksen til nordnorske redaksjoner samme morgen de slippes.
- **Context:** Besluttet utsatt i CEO-review 2026-06-10 (D3.1). Hele
  infrastrukturen finnes (arkiv med permanente lenker, OG-kort, Resend,
  lead-lagring). Spes: docs/designs/presserom-presskit-entitet.md.
- **Depends on / blocked by:** En vedlikeholdt presseliste må eksistere og ha
  en eier. Bygges tidligst ved neste kvartalsslipp (Q2 2026-release).
- **Effort:** M (menneske ~2 dager / CC ~45 min).

---

## TODO 20 — Site-wide tittelsuffiks «| Advanti» → «| Advanti Estate» — SHIPPED 2026-06-10

- **What:** ~20 sider utenfor presserom/personer/om-oss har fortsatt
  «| Advanti» som tittelsuffiks (grep `'| Advanti"' src/app`).
- **Why:** Fullfører entitetsnormaliseringen fra PR #42 i synlige
  SERP-titler; i dag spriker tittel-suffikset mot schema-navnet.
- **Context:** Bevisst avgrenset i planen («kun sider planen berører»);
  resten ble egen TODO. Ren mekanisk sweep + verifiser at ingen titler
  bikker ~60 tegn.
- **Effort:** S (CC ~10 min).

---

## TODO 21 — Design-review-rest — SHIPPED 2026-06-10 (mi-table-tetthet vurdert og beholdt)

- **What:** (a) Harmoniser inline `style={{ margin/padding }}`-verdier i
  presserom-/arkivsidene til klasser i advanti-design.css; (b) erstatt
  global `.btn { transition: all }` med eksplisitte properties; (c) vurder
  mi-table-tetthet på 375px (deles med markedsinnsikt).
- **Why:** Flagget av /design-review + Codex 2026-06-10 som utsatt — (a) er
  pre-eksisterende mønster fra PR #40, (b)/(c) er globale og fortjener egen
  liten PR med visuell regresjonssjekk.
- **Context:** Full audit:
  ~/.gstack/projects/Codehagen-advantiestate/designs/design-audit-20260610/.
- **Effort:** S-M (CC ~30 min samlet).

---

## TODO 18 — Listings (eiendommer) feature — SHIPPED 2026-05-25

- **What:** Public `/eiendommer` index + `/eiendommer/[slug]` detail pages.
- **Outcome:** Shipped on branch `feat/eiendommer-listings`:
  - New `ListingPost` content collection (typed frontmatter: status, type,
    city, headline stats, gallery, facts, tenants, financials, location +
    geo coords, downloads, megler).
  - 9 listing MDX files seeded with explicit clean slugs (Sjøgata 7 with full
    detail; 8 others with index-card data).
  - `src/app/eiendommer/page.tsx` — SubHero + KPI band + sticky filter
    (status/type/city) + featured + grid + saved-search alert + off-market
    band + CTA.
  - `src/app/eiendommer/[slug]/page.tsx` — gallery + headline stats + body
    with sticky megler card + facts table + tenants table + dark financials
    grid + Leaflet location map + downloads + CTA + related.
  - Real Leaflet map (`PropertyMap` + `PropertyMapLeaflet`) reusing the
    CartoDB tile config from `markedsinnsikt/maps/mapTheme.ts`.
  - `RealEstateListing` JSON-LD per detail page, linked to the existing
    `#organization` graph node.
  - Nav, sitemap, siteConfig wired. ~640 new lines of `.ei-*`/`.ed-*` CSS in
    `advanti-design.css`.
  - **Design review pass:** /design-review found 4 issues (F1 sticky filter
    overlaying dark band, F2 NDA subtext contrast 1.07:1, F3 chips 36 → 44px
    touch target, F4 "Featured" → "Utvalgt" i18n). All fixed in atomic
    commits.
  - **Emil design-engineering pass:** removed `transition: all`, guarded
    photo/row hover transforms behind `@media (hover: hover) and
    (pointer: fine)`, swapped `.ei-offmarket-row` padding-left animation for
    transform, added `@media (prefers-reduced-motion: reduce)` override.
- **Follow-up content work (deferred):** the 8 stub listings have only
  index-card data; their detail pages need facts/tenants/financials/location
  populated when partners share the data. Adding `location.geo: {lat,lng}`
  to each MDX enables the real Leaflet map (currently falls back to a CSS
  mock for stubs).
- **Completed:** 2026-05-25.

---

## TODO 14 — HowTo schema pilot — SHIPPED 2026-05-24

- **What:** Pilot HowTo schema on one help article and validate.
- **Outcome:** Shipped infrastructure + one pilot article:
  - `content-collections.ts` HelpPost: added optional `howto: boolean` +
    `step: { name, text }[]` (min 2) — singular `step` per schema.org
    (supersedes legacy `steps`).
  - `src/components/StructuredData.tsx`: new `howto` case emits
    `@type: "HowTo"` with `step[]` of `@type: "HowToStep"` items carrying
    `position` (1-indexed) and `inLanguage: "nb-NO"`. Returns `null` (no-op)
    unless `step.length >= 2`.
  - `src/app/(help)/help/article/[slug]/page.tsx`: render
    `<StructuredData type="howto" />` only when `data.howto && data.step?.length >= 2`.
  - `src/content/help/diskontert-kontantstrom.mdx`: opt-in with 4 steps that
    mirror the visible `<Stepper>` component verbatim (no schema/visible
    drift; satisfies Google rich-result policy).
- **Verified locally:** 6 JSON-LD scripts on the DCF article (Organization,
  RealEstateAgent, WebSite, BreadcrumbList, Article, **HowTo**). Each HowTo
  step has `@type: "HowToStep"` and `position`. 5 control help articles
  emit no HowTo (gate works).
- **Why this matters:** 2026 research (heeya.fr, stackmatix.com, hashmeta.ai)
  shows HowTo schema maps to AI Overview / Perplexity / ChatGPT step
  extraction; one source claims schema-marked content gets ~2.5× more
  citations.
- **Rollout plan:** wait for 1-2 monthly runs of TODO 16 monitoring on
  how-to queries (e.g. "DCF analyse næringseiendom"). If DCF citation
  rate improves vs. control help articles, extend HowTo to
  `sensitivitetsanalyse`, `verdivurdering-av-naringseiendom`,
  `kontantstromsanalyse`. If no movement, stop expanding and revisit.
- **Completed:** 2026-05-24.

---

## TODO 16 — AI citation monitoring — SHIPPED 2026-05-24 (template + cadence)

- **What:** Establish a baseline measurement of how often Advanti is cited
  by ChatGPT, Perplexity, Google AI Overviews, and Claude for the priority
  næringsmegler queries.
- **Outcome:** Created `markedsfoering/ai-citation-baseline.md` — a
  self-contained DIY tracking template with:
  - 20 priority queries covering category / market / service / how-to /
    comparison intents
  - Monthly run template (query × platform matrix)
  - Summary section for citation rate, competitor wins, MoM delta
  - "What to do with the data" guidance: when to expand HowTo schema, when
    to refresh blog content, when to upgrade tooling
- **Cadence:** monthly check (~30 min). First Monday of the month.
- **Tool path:** Start DIY at $0 for 1-2 months. If the cadence becomes
  burdensome, upgrade to **Otterly** ($29/mo, 100 prompts). **ZipTie**
  ($69/mo) is the Cadillac GEO tool but probably overkill for a
  single-market Norwegian B2B site at this stage.
- **First run target:** 2026-06-01 (next Monday) — Christer or whoever
  owns marketing checks the 20 queries and fills in the first row.
- **Why this matters:** Several TODOs (14 HowTo expansion, 15 BlogPost
  backfill prioritization) need DATA, not intuition, to decide whether
  the work moves anything. Without monitoring we are guessing.
- **Completed (template):** 2026-05-24. First monthly run is the next
  open task.

---

## TODO 15 — Add `updatedAt` to BlogPost frontmatter + render — SHIPPED 2026-05-24

- **What:** Add optional `updatedAt` to `BlogPost`, render "Sist oppdatert" on
  the blog post header when it differs from `publishedAt`, propagate to
  sitemap and OpenGraph `modifiedTime`.
- **Outcome:** Infrastructure shipped:
  - `content-collections.ts` BlogPost gets
    `updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()`
  - `src/app/(blog)/blog/(post)/[slug]/page.tsx` header conditionally renders
    `Sist oppdatert {editorialDate(data.updatedAt)}` when set + different
  - `src/app/(blog)/blog/(post)/[slug]/page.tsx` `generateMetadata` now
    passes `modifiedTime: post.updatedAt`
  - `src/app/sitemap.ts` blog block uses `updatedAt ?? publishedAt` for
    `lastModified`
  - `StructuredData.tsx` `article` case already read
    `data.updatedAt || data.publishedAt` for `dateModified`; now actually
    receives `updatedAt` from the blog page
- **Backfill is a content task, NOT shipped:** the 26 existing posts have no
  `updatedAt` yet. Per 2026 freshness research ("cosmetic updates do not count
  and AI engines discount them"), do NOT bulk-bump dates without substantive
  content edits — pair `updatedAt` with real content refresh (new stats,
  rewritten section, updated examples) on 5-10 evergreen posts as part of a
  normal editing pass. Target the highest-value posts: valuation guides,
  market explainers, partner case studies.
- **Why this matters:** 2026 freshness research is striking — content under
  3 months old is **3× more likely to be cited**, pages updated in the last
  2 months earn **+28% citations**, AI-cited content is 25.7% fresher than
  organic. Highest-leverage AI SEO lever currently available.
- **Completed:** 2026-05-24 (infrastructure only; backfill is a follow-up
  content task).

---

## TODO 1 — Swap display font to Reckless Neue

- **What:** Replace Inter as the display/heading font with Reckless Neue once the
  font license is acquired.
- **Why:** The redesign was built for Reckless Neue's editorial italic character.
  Inter for display is an explicit stopgap that flattens the intended look — every
  heading uses an italic flourish that reads as a sans italic, not editorial serif.
- **Pros:** Restores the approved visual identity the partners signed off on.
- **Cons:** License cost; must be purchased per office through ANTI as.
- **Context:** Single change to the `--font-display` CSS variable plus a
  `next/font/local` registration of the Reckless Neue woff2 files. The design system
  already isolates display type behind one variable, so the swap is one place.
- **Depends on / blocked by:** ANTI as license purchase — contact
  Ingunn.garthus@anti.as for pricing and font files.

---

## TODO 5 — Move markedsinnsikt data to content collections

- **What:** The 20-quarter series, six cities and the two Bodø price zones are
  hardcoded in `MarkedsinnsiktShell.tsx` / `zones.ts` / `metrics.ts`. Move them to
  a typed Content Collection.
- **Why:** Editing market data should not require a code change; a collection
  makes the quarterly refresh a content edit.
- **Context:** Deferred from the markedsinnsikt charts/maps rebuild
  (/plan-eng-review, 2026-05-21). Separate body of work — the rebuild kept the
  data in place.

---

## TODO 6 — /kart price-zone accessibility — SHIPPED 2026-05-24

- **What:** Make the Bodø price-zone map keyboard- and touch-accessible.
- **Outcome:** Shipped `feat(a11y)` commit `e43bde4`. Three accessible paths
  into the zone data:
  - **Chip list** above the map (DOM-first for keyboard tab): horizontal row
    of `<button aria-pressed>` chips, one per zone. Pressed state mirrors
    pinned; hover state mirrors mouseover on the map. Positioned right of
    Leaflet's +/- zoom controls to avoid overlap.
  - **SVG GeoJSON paths** get `role="button"`, `tabindex="0"`, and a
    Norwegian `aria-label` after Leaflet mounts them. Enter/Space wired via
    Leaflet's keypress event.
  - **Detail panel** is now `role="region"` + `aria-live="polite"` (screen
    readers announce zone changes) with a × close button when pinned.
- **Two-state selection model:** `hovered` (transient, mouseover) + `pinned`
  (persistent, click/keyboard). Panel shows `pinned ?? hovered`. Touch tap
  pins; subsequent stray mouseouts no longer clear the panel. Escape also
  clears the pin.
- **Verified locally:** chip click pins/unpins, swap between chips works,
  Escape clears, SVG path click pins, console clean.
- **Completed:** 2026-05-24.

---

## TODO 7 — Refresh stale dated copy on markedsinnsikt (PARTIAL 2026-05-24)

- **What:** The page shows "OPPDATERT 14. JAN 2026" (×5, on data widgets) and
  "Neste utgave 15. april 2026" — both already past.
- **Why:** Stale dates undercut the page whose whole purpose is data credibility.
- **PARTIAL FIX SHIPPED 2026-05-24:** "Neste utgave 15. april 2026" updated to
  "15. juli 2026" in `MarkedsinnsiktShell.tsx:1027` — that field is a
  forward-looking forecast, no data-integrity claim attached.
- **NOT FIXED — owner's call:** The 5 "OPPDATERT 14. JAN 2026" timestamps
  (lines 200, 402, 575, 704, 845) sit next to `Yield, leie og ledighet — Q4 2025`
  and reflect a real historical data release. Bumping them to e.g. "15. APR 2026"
  is only honest if the Q1 2026 data has actually been ingested. The 2026
  freshness research explicitly warns: *"Cosmetic updates (date stamp changes,
  synonym swaps, year-only updates) do not count and AI engines discount them"*
  — so bumping without a real refresh is both misleading and useless.
- **Path forward:** Data team confirms whether Q1 2026 (and possibly Q2 2026)
  markedsdata, leie, transaksjon, telling, and yield numbers have been
  refreshed. If yes → bump each timestamp to the actual release date. If no →
  consider whether the page should hide individual timestamps and show a single
  "Sist oppdatert" derived from the latest underlying data file.

---

## Completed

### TODO 17 — Validate live `/llms.txt` against llmstxt.org spec

- **What:** Confirm the new `/llms.txt` route shipped in commit `2dfcfab` is
  spec-compliant (community has converged on several free validators:
  llmstxtchecker.net, llmstxtvalidator.org/.dev/.io, mrs.digital/tools).
- **Outcome:** Validated manually against the llmstxt.org formal spec on
  2026-05-24:
  - ✅ H1 present (`# Advanti`)
  - ✅ Blockquote summary present (one `>` line)
  - ✅ 5 H2 sections, all properly formed
    (`## Tjenester`, `## Lokasjoner`, `## Hjelp og terminologi`,
    `## Kundehistorier`, `## Optional`)
  - ✅ All 46 bullets match `- [name](url)[: notes]` spec pattern
  - ✅ No H3+ (spec only allows H1 + H2)
  - ✅ `## Optional` correctly placed last (per spec — "can be skipped if a
    shorter context is needed")
  - ✅ Served as `text/plain; charset=utf-8` with
    `Cache-Control: public, max-age=3600, s-maxage=3600`
  - ✅ Prerendered as `○ /llms.txt` in `next build` output
- **Completed:** 2026-05-24.

### TODO 11 — FAQPage schema on service & tool pages

- **What:** Add `FAQPage` structured data to the `/tjenester/*` service pages and
  the `/verktoy/*` calculator pages.
- **Outcome:** Done for the 6 `/tjenester/*` service pages. New
  `src/components/site/Faq.tsx` renders a visible FAQ accordion (reusing the
  existing `.faq` styles) plus matching `FAQPage` JSON-LD from one shared `items`
  array — the visible Q&A and the schema are driven by the same data, so they
  can't drift, which is what Google's FAQ rich-result policy requires. Each page
  got a "05 — Ofte stilte spørsmål" section with 4 Q&As authored strictly from
  facts already on that page. Tool pages (`/verktoy/*`) skipped — thin calculator
  wrappers with no FAQ-suitable content.
- **Completed:** 2026-05-22 (branch `seo/metadata-canonical-fixes`).

### TODO 12 — Link Organization + RealEstateAgent JSON-LD via shared @id

- **What:** Give the `Organization` and `RealEstateAgent` JSON-LD blocks a shared
  `@id` so Google treats them as one entity rather than two separate ones.
- **Outcome:** Done. Organization, RealEstateAgent, the WebSite publisher and the
  Article publisher all carry `@id` `${baseUrl}/#organization` in
  `StructuredData.tsx` — one connected entity instead of unlinked top-level nodes.
- **Completed:** 2026-05-22 (branch `seo/metadata-canonical-fixes`).

### TODO 13 — Dedicated square logo image for structured data

- **What:** Replace the reuse of `opengraph-image.jpg` (1200x630) as the `logo`
  in the JSON-LD blocks with a dedicated square logo asset.
- **Outcome:** Done. The premise that no asset existed did not hold —
  `public/icon-512x512.png` is a genuine square Advanti logo (the "A." mark). All
  four `logo` fields in `StructuredData.tsx` (Organization, RealEstateAgent,
  WebSite publisher, Article publisher) now point to it; the Article publisher
  logo dimensions were corrected from 1200×630 to 512×512.
- **Completed:** 2026-05-22 (branch `seo/metadata-canonical-fixes`).

### TODO 10 — Automated performance regression guard

- **What:** Add a performance budget so a future change can't silently
  re-bloat the bundle.
- **Outcome:** Done. Added `tests/perf-budget.spec.ts` — a Playwright spec
  that measures each key route's first-load JS (sum of every `.js` resource's
  `encodedBodySize`, in a real browser) and fails over a per-route ceiling.
  Budgets (measured value + ~15% headroom): `/` 250 KB, `/markedsinnsikt`
  380 KB, plain article 490 KB, chart article 575 KB, chart+math article
  710 KB. Next 16 dropped per-route sizes from `next build` output and has no
  `app-build-manifest.json`, so the metric is measured in-browser —
  Next-internals-independent. Also added `.github/workflows/ci.yml` (the repo
  had no CI) running build + the full Playwright suite incl. perf-budget on
  push and PR.
- **Completed:** 2026-05-22 (branch `perf/optimization-pass`).

### TODO 9 — Slim the global advanti-design.css

- **What:** Trim dead selectors from `src/styles/advanti-design.css` (~100 KB,
  `@import`-ed globally).
- **Outcome:** Done — but the premise did not hold. PurgeCSS analysis showed
  the file is ~92% live: it was purpose-built for these routes, not bloated.
  Removed 18 verified-dead selectors (zero references anywhere in source): the
  `ks-*` knowledge-base classes (re-implemented with Tailwind in `mdx.tsx`),
  unused hero variants, and other design-handoff leftovers. Kept 4 Leaflet
  runtime classes PurgeCSS flagged as false positives. Result: 102 KB →
  94.6 KB raw (~2 KB gzipped) — a small win. Verified: build clean, 52
  Playwright tests pass, 5 routes visually QA'd. The file is a genuine design
  system, not dead weight; no further slimming is worthwhile.
- **Completed:** 2026-05-22 (branch `perf/optimization-pass`).

### TODO 8 — Fix the stale Next.js version in CLAUDE.md

- **What:** `CLAUDE.md` said "Next.js 15.3.2"; `package.json` is on `16.1.4`.
- **Outcome:** Done. Tech Stack section in `CLAUDE.md` updated to `Next.js 16.1.4`.
  Same pass also corrected the now-stale Mapbox references — the Mapbox
  integration section, the `eiendom/PropertyMap.tsx` mentions, and the chart/map
  workflow notes — to match the Recharts + Leaflet rebuild.
- **Completed:** 2026-05-21 (branch `design/markedsinnsikt-recharts-leaflet`).

### TODO 2 — Repo-wide dark-mode teardown

- **What:** Remove `next-themes`, `ThemeProvider`, `ThemeSwitch`, and all `dark:`
  Tailwind classes from the files outside the redesign scope.
- **Outcome:** Done. `next-themes` removed — it was an unused dependency; no
  `ThemeProvider`/`ThemeSwitch`/`useTheme` existed in the codebase. `darkMode:
  "selector"` removed from `tailwind.config.ts`. All 723 `dark:` Tailwind variant
  classes stripped across 40 files (every `dark:` was inert — nothing ever applied a
  `.dark` class). `src/components/blog/mdx.tsx` was the first file, done in PR #5;
  the remaining 39 files cleared in this pass. Production build clean, full Playwright
  suite green.
- **Completed:** 2026-05-21 (branch `chore/dark-mode-teardown`).

### TODO 3 — Iconless treatment for tool pages

- **What:** Decide whether the out-of-scope tool pages (verktoy calculators,
  data-tables, simulering, modals) should also drop icons to match the no-icon brand,
  or keep icons as functional UI.
- **Outcome:** Decided — tool pages keep their icons. The 24 files importing
  `@remixicon` are mostly functional UI (Select dropdown chevron, Input password/search
  toggles, Button loading spinner, chart scroll arrows, copy button, modal close X,
  calculator info tooltips). Stripping those risks worse usability with no design
  mockup, and Decision D8 already scoped icon removal to the redesigned marketing
  pages. Icons stay as functional UI on the tool surface.
- **Completed:** 2026-05-21.

### TODO 4 — Clear the 179-error TypeScript baseline

- **What:** The repo had 179 pre-existing `tsc --noEmit` errors. Drive the count to
  zero, then flip `typescript.ignoreBuildErrors` to `false` so the build enforces types.
- **Outcome:** Done — 57 remaining errors fixed (21 real app-code fixes; the
  `content-collections.ts` build-config errors scoped out via `@ts-nocheck`),
  `ignoreBuildErrors` flipped to `false`. `next build` now type-checks for real.
- **Completed:** 2026-05-21 (commit `f63d3b7`, branch `redesign-editorial-port`).

---

## TODO 19 — Migrate the 21 existing blog articles to editorial MDX components — SHIPPED 2026-06-03

- **Outcome:** All 21 articles migrated to the editorial components via a
  20-agent workflow (additive/SEO-safe): bold-label lists → `<Summary>`,
  calculations → `<Example>`, genuine fordeler/ulemper → `<Compare>`, real KPI
  numbers → `<StatStrip>`, definitions → `<Fact>`, milestones → `<Timeline>`,
  one `<Figure>` + building photo and one `key` Note per article. Verified:
  build clean, 84 Playwright specs pass, headings preserved (no prose loss),
  Compare semantics correct, StatStrip numbers verbatim, all Figure images
  resolve. Branch `feat/blog-articles-editorial-migration`.
- **Completed:** 2026-06-03.

- **What:** Rewrite the existing `src/content/blog/*.mdx` articles to use the new
  editorial component family (`<Summary>`, `<Fact>`, `<StatStrip>`, `<Compare>`,
  `<Timeline>`, richer `<Note>` variants) instead of the current plain-markdown
  `**bold:**` lists.
- **Why:** The editorial-components PR (/plan-eng-review, 2026-06-03) lands the
  CSS + wrappers backward-compatibly, but the existing articles still read as flat
  markdown and barely exercise the new components. The visual upgrade only fully
  shows once articles adopt the patterns.
- **Pros:** Articles gain scannable summaries, stat strips, comparison blocks; the
  `key` callout variant and the editorial rhythm from `AUTHORING.md` come through.
- **Cons:** Editorial-judgment work (which callouts, which summaries) per article;
  21 files; content/SEO regression risk if headings or copy shift. Not mechanical.
- **Context:** Foundation shipped in the editorial-components PR — `.ae-*` classes
  in `advanti-design.css`, wrappers in `src/components/blog/mdx.tsx`, authoring
  rulebook at `src/content/blog/AUTHORING.md`. Do this article-by-article post-merge,
  following the guide. Start with the highest-traffic articles.
- **Depends on / blocked by:** Editorial-components PR merged first.

---

## TODO 20 — Add the 5 best-practice example articles as live exemplars

- **What:** Publish the 5 handoff example articles (markedspuls-nord-norge-2026,
  dcf-analyse, kjope-vs-leie, verdivurdering-guide, investere-kontorlokaler) into
  `src/content/blog/` as on-site rendered references.
- **Why:** `AUTHORING.md` documents the patterns in prose, but live articles give
  editors (and Claude Code) a rendered reference to copy from.
- **Pros:** Concrete, composed exemplars exercising every component cluster.
- **Cons:** Real published content — needs editorial sign-off and valid
  `BLOG_CATEGORIES` slugs (invalid category → `notFound()`).
- **Context / GOTCHA:** Three of the handoff filenames collide with existing
  article slugs already in `src/content/blog/` (`dcf-analyse-naringseiendom.mdx`,
  `kjope-vs-leie-naringseiendom.mdx`, `investere-kontorlokaler-nord-norge.mdx`).
  Dropping them in as-is would overwrite live articles. Rename or merge before
  publishing. Source files live in the handoff bundle's `best-practice/`.
- **Depends on / blocked by:** Editorial-components PR merged first; slug-collision
  resolution.

---

## TODO 21 — gallery.ts "unit-tested" comment is stale (no unit runner)

- **What:** `src/lib/listing/gallery.ts:41` comments the `mapMediaToGallery`
  mapper as "Pure mapper — unit-tested." The repo has no unit-test runner
  (Playwright E2E only, `tests/*.spec.ts`) and the mapper is not referenced by
  any test. Either correct the comment, or add a unit runner (vitest) + a real
  test for `mapMediaToGallery`.
- **Why:** A future dev reads "unit-tested" and trusts coverage that doesn't
  exist — they may refactor the mapper without adding a test and ship a
  regression silently.
- **Pros:** Honest comment; if vitest is added, the pure mapper is a clean
  first unit test and unlocks unit-testing the lightbox index math too.
- **Cons:** Adding vitest is real infra the repo deliberately avoided (E2E-only
  by choice); a comment-only fix is trivial but unrelated to current features.
- **Context:** Surfaced during the lightbox /plan-eng-review (2026-06-05) while
  confirming the test framework. `mapMediaToGallery` (gallery.ts:42-53) is pure
  and side-effect-free — ideal unit-test candidate. The lightbox feature's own
  nav/index logic is likewise pure and would benefit from a unit runner.
- **Depends on / blocked by:** Nothing for the comment fix. The vitest path is a
  standalone infra decision.

---

## TODO 22 — Analyseportal: Excel/PNG-eksport utover CSV

- **What:** Legg til Excel- (xlsx) og PNG-eksport (chart snapshot) på
  /analyseportal i tillegg til CSV.
- **Why:** Investorer og analytikere limer tall inn i egne modeller; xlsx
  bevarer typer, PNG gjør grafene delbare i presentasjoner.
- **Pros:** Hever portalens "verktøy"-følelse; lav risiko (ren klient).
- **Cons:** xlsx-bibliotek øker bundle; PNG-eksport av Recharts krever
  html-to-image-aktig avhengighet. Vent til bruksdata (analyseportal_csv_download)
  viser at eksport faktisk brukes.
- **Context:** Deferred fra /autoplan CEO-review 2026-06-11 (E6). CSV med
  formel-escaping shippes i grunnscopet.
- **Effort:** M (human) → S (CC) · **Priority:** P3
- **Depends on / blocked by:** Analyseportalen shippet; bruksdata fra A3-eventene.

---

## TODO 23 — Konkurrentpass for markedsdata: KBNN, EM1 Nord-Norge, DNB Næringsmegling

- **What:** 30-minutters strukturert landskapspass på de reelle Nord-Norge-
  dataaktørene: SpareBank 1 Nord-Norge (KBNN/Konjunkturbarometer),
  EiendomsMegler 1 Nord-Norge, DNB Næringsmegling — pluss AI-søkeflater
  (hvem siteres for "yield Tromsø"-spørsmål i dag?).
- **Why:** Analyseportalens konkurranseramme bygger i dag på ett datapunkt
  (Akershus Eiendom, Oslo-fokusert). Begge review-modellene (Claude + Codex)
  flagget dette uavhengig. Wedge-påstanden "ingen i Nord-Norge har interaktiv
  portal" er plausibel men uverifisert.
- **Pros:** Informerer både copy (hva kan vi ærlig påstå) og datastrategi
  (hva må være proprietært for å vinne sitering).
- **Cons:** Ren research, ingen kode; kan avdekke at wedgen er svakere enn antatt.
- **Context:** Deferred fra /autoplan CEO-review 2026-06-11 (A5/F6). Lansering
  gjør ingen markedsleder-påstander i copy inntil dette er gjort.
- **Effort:** S (human) → S (CC) · **Priority:** P2
- **Depends on / blocked by:** Ingen.

---

## TODO 24 — Kvartalsvis data-release-operativmodell (eier, kilder, kadens) — UTKAST KLART 2026-06-11

- **What:** Definér operativmodellen bak markedsdataene: navngitt eier, kilder
  per serie (egne oppdrag, tinglysing, Finn, KBNN, SSB/Norges Bank for makro),
  metodenotat per sektor, og en kvartalskadens med publiseringsdato.
- **Why:** Begge review-modellene konvergerte uavhengig på samme reframe:
  bindingen er datatilførsel, ikke presentasjon. Portalen (og markedsinnsikt,
  presserom, nyhetsbrev) er outputs av et release-system som i dag ikke har
  eier eller kadens. "Neste oppdatering 15. juli 2026" er allerede publisert
  offentlig — noen må eie at den holdes.
- **Pros:** Gjør TODO 5 (content collections) og TODO 7 (stale stamps)
  løsbare permanent; forsvarbar metodikk er det konkurrenter ikke kan kopiere.
- **Cons:** Organisatorisk arbeid, ikke kode; krever partner-tid.
- **Context:** Deferred fra /autoplan CEO-review 2026-06-11 (UC1/F2/Codex 10x-
  reframe). Se ceo-plans/2026-06-11-analyseportal.md for hele resonnementet.
- **Effort:** M (human, mest ikke-kode) · **Priority:** P1 (før neste kvartalsslipp)
- **Depends on / blocked by:** Eierbeslutning hos partnerne; frist: før 15. juli 2026.
- **Status:** Ratifiseringsklart utkast i `docs/markedsdata-operativmodell.md`
  (eier-forslag, kilder per serie, kadens, ærlighetsregler, åpne beslutninger).
  Gjenstår: partnermøtet beslutter §6-punktene.

---

## TODO 25 — Nav-flash på sider med mørk hero — SHIPPED 2026-06-11

- **What:** Første frame(s) på mørk-hero-sider rendres med solid/scrolled
  nav-stil før IntersectionObserveren flipper til transparent.
- **Why:** Synlig lys stripe-blink over mørke heroer ved last (gjelder også
  forsiden) — undergraver det polerte førsteinntrykket.
- **Context:** Funnet av /design-review 2026-06-11 på /analyseportal; flagget,
  ikke fikset (delt chrome i Nav.tsx, blast radius = alle sider). Mulig fix:
  initialiser transparent når #hero-sentinel finnes i DOM ved første render.
- **Effort:** S · **Priority:** P3

---

## TODO 26 — Pre-eksisterende 375px-overflow på /blog og /markedsinnsikt — SHIPPED 2026-06-11

- **What:** Mobile-overflow-testen feiler på /blog (425px) og /markedsinnsikt
  (478px — shellens egen fanerad, ikke KPI-båndet).
- **Why:** Horisontal scroll på mobil; testene er røde og maskerer nye regressjoner.
- **Context:** Bevist pre-eksisterende på ren trestruktur + ren build under
  /autoplan-verifiseringen 2026-06-11. Ikke relatert til analyseportal-arbeidet.
- **Effort:** S/M · **Priority:** P2

---

## TODO 27 — Lead-ops bak «svar vanligvis samme dag» (SLA, eier, oppfølging)

- **What:** Operativ eierskapsmodell for naringsmegler-leads: per-by ansvarlig +
  ferie-fallback, tid-til-første-svar målt, oppfølgingsmal. I dag: Discord-varsel +
  Resend-kvittering, ingen SLA-sporing.
- **Why:** De nye bysidene gjentar svartids-løftet flere steder; ett tapt
  Discord-varsel i ferien bryter akkurat løftet siden selger på.
- **Context:** Fra /autoplan CEO-review 2026-06-11 (E6, begge modellene flagget).
  Kopien er myket til «vanligvis samme dag» som mitigering; ops-modellen gjenstår.
- **Depends on:** Ingen tekniske. Eier: Christer/Tobias.
- **Også (red team /ship 2026-06-11, D3=B):** subscribe() svelger runtime-feil
  i Discord+Supabase og gir ok:true — intake-payload (tlf/by/adresse) kan
  mistes stille. Lead-ops bør inkludere per-destinasjon-utfall + varsling
  når en HIGH_INTENT-intake ikke ble persistert.
- **Effort:** M (prosess, ikke kode) · **Priority:** P2

---

## TODO 28 — Konkurranse-wedge i whyPoints per by

- **What:** Skjerp «Hvorfor Advanti»-punktene per by fra generisk profesjonalitet
  til konkret wedge (datagrunnlag +1 400 eiendommer, kjøpernettverk utenfor
  Nordland, senior partner på hvert oppdrag — med tall der de finnes).
- **Why:** Codex CEO-voice: «siden risikerer å si 'vi er profesjonelle' i et
  penere layout» — wedgen er det konkurrenter ikke kan kopiere.
- **Context:** Fra /autoplan 2026-06-11 (E7). Template skipper med design-kopien;
  dette er en redaksjonell skjerping per by etterpå.
- **Effort:** S/M (redaksjonelt) · **Priority:** P3

---

## TODO 29 — Bysidene inn i kvartalsrunbooken (TODO 24) + «sist verifisert»

- **What:** Fold /naringsmegler/[slug]-innholdet (marketStats-ranger, FAQ-tall,
  proofStats) inn i kvartals-release-operativmodellen fra TODO 24, med
  per-by verifiseringsdato.
- **Why:** 10 byer × proofStats/FAQ-ranger blir foreldet uten eier — «stale deal
  counter» er den forutsigbare flausen om 6 måneder (begge CEO-voices).
- **Context:** Fra /autoplan 2026-06-11. Runbook-utkastet i TODO 24 dekker i dag
  bare portal-seriene.
- **Depends on:** TODO 24 ratifisering.
- **Effort:** S · **Priority:** P2

---

## TODO 30 — Vurder beskjæring/sammenslåing av tynne bysider

- **What:** Evaluer om 10 bysider er riktig: Svolvær vs Lofoten overlapper;
  Hammerfest/Sortland har verken kontor, portaldata eller oppdrag. Færre,
  sterkere sider kan rangere bedre enn ti tynne.
- **Why:** Claude CEO-voice #8: thin-content-risiko; programmatic-SEO-mønster
  uten substans kan svekke hele klyngen.
- **Context:** Fra /autoplan 2026-06-11. Avvent trafikkdata (jf. analytics-
  beslutning E4) før kutt.
- **Effort:** S (analyse) · **Priority:** P3

---

## TODO 31 — Samtykke: intake-skjemaer melder leads inn i nyhetsbrev-audiencen

- **What:** subscribe()-pipelinen upserter alle intake-innsendinger
  (verdivurdering, kontakt, naringsmegler) i Resend-nyhetsbrev-audiencen og
  sender velkomst-nyhetsbrev — mens skjemaene lover «kun til vurdering».
  Trolig fix: skipAudience/skipWelcome-flagg for intake-kilder + eksplisitt
  opt-in-checkbox for nyhetsbrev; kvittering kan sendes uten innmelding.
- **Why:** GDPR art. 6 / markedsføringsloven: markedsføringsinnmelding uten
  samtykke; skjemaløftet og praksis spriker.
- **Context:** Funnet av red team i /ship pre-landing review 2026-06-11
  (gjelder hele pipelinen, ikke bare bysidene — bevisst utsatt fra PR-en,
  beslutning D2=B). Filer: src/lib/email/subscribe.ts, src/emails/WelcomeEmail.
- **Effort:** M (human ~2t / CC ~15 min + juridisk avklaring) · **Priority:** P1

## TODO 32 — Markedsrapport-gatens konverteringskvalitet før Q3-utgaven

- **What:** Kvalitetsgjennomgang av /markedsrapport-gaten (copy, skjemafelt,
  hva leseren faktisk får, leveranse etter submit) nå som Rapporter-fanen på
  /markedsinnsikt ruter all rapport-trafikk dit (IA-redesign PR 1) i stedet
  for til /kontakt og døde `#`-lenker.
- **Why:** Codex-funn i CEO-review 2026-06-12: «routing more traffic to a weak
  gate just amplifies the weakness» — mer trafikk til en svak gate forsterker
  bare svakheten. rapport_bestill-eventet (8A) gir baseline gratis.
- **Context:** Gaten finnes og fungerer teknisk (MarkedsrapportGate.tsx);
  spørsmålet er om den selger. Naturlig frist: neste rapportutgave 15. juli 2026
  (henger sammen med TODO 24 kvartalsrunbook). CEO-plan:
  ~/.gstack/projects/Codehagen-advantiestate/ceo-plans/2026-06-12-nav-ia-redesign.md
- **Effort:** S (human ~3t / CC ~20 min + innholdsvurdering) · **Priority:** P2
- **Depends on:** IA-redesign PR 1 (trafikk-ruting) + rapport_bestill-event (PR 2)

## TODO 33 — /landing/verdivurdering: designsystem-opprydding (betalt-trafikk-siden)

- **What:** Fjern Remix-ikonene (RiShieldCheckLine, RiUserStarLine, RiBuildingLine
  — nettstedet er ikon-fritt), porter Tailwind-utility-styling (`rounded-xl
  bg-warm-grey/5 ring-1 …`) til semantiske advanti-design.css-klasser, og
  spesifiser/forenkle ValuationCTAButton-atferden (modal i dag).
- **Why:** Siden er fortsatt mål for betalt annonsetrafikk — annonseklikkere
  møter en side som bryter merkevarens designspråk. Funnet i /plan-design-review
  2026-06-12 (subagent F4).
- **Context:** CTA-målet i nav/IA-redesignet gikk til kalkulatoren (vedtak 3A),
  så siden er IKKE del av organisk flyt — noIndex står. Ren kvalitetsopprydding,
  uavhengig av alle IA-PR-ene. Fil: src/app/landing/verdivurdering/page.tsx.
- **Effort:** S (human ~3t / CC ~15 min) · **Priority:** P3
- **Depends on:** ingenting
