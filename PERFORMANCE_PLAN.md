# Performance Optimization Plan — Advanti

Goal: make advantiestate.no load as fast as possible. Audited against the
Vercel React Best Practices ruleset (70 rules, 8 categories), then run through
`/plan-eng-review` (decisions D1–D11) and an independent Codex outside-voice pass.

## Context that shapes priorities

This is a **static-content marketing site**: Next.js 16 App Router, all content
from MDX via content-collections, no database. Every dynamic route uses
`generateStaticParams` and is **fully static (SSG)** — pre-rendered at build,
no `revalidate` configured, so it is not ISR. The root layout and homepage are
already Server Components; only 1 page is a client component (justified).

The real levers, in order of user-facing impact:

1. **Client JS shipped per route** — the MDX renderer ships recharts + katex +
   framer-motion to ~47 article pages (the biggest single miss; see Phase 2.0).
2. **Image weight / LCP** — 6 raw `<img>` tags serve unoptimized originals.
3. **Interaction smoothness** — scroll handler, animation churn.
4. **Build / install hygiene** — does not shrink shipped JS, but real.

The architecture is already sound (maps lazy-loaded, correct server/client
split, static generation everywhere). This is an optimization pass, not a
rewrite.

```
WHAT SHIPS TO THE CLIENT TODAY  vs  AFTER THIS PLAN
───────────────────────────────────────────────────────────────
~47 blog/help/kunder/          BEFORE: recharts + katex + katex.css
integrasjoner/legal articles           + framer-motion  (used by ~10)
(via src/components/blog/      AFTER:  base article JS only; heavy
 mdx.tsx, a client component)          widgets load on demand   ← Phase 2.0

/markedsinnsikt route          BEFORE: recharts in the route's first-load JS
                               AFTER:  recharts in an on-demand chunk ← Phase 2.1

om-oss / kunder / personer     BEFORE: raw <img>, full-size original
(6 raw <img>)                  AFTER:  next/image, resized WebP/AVIF ← Phase 1.2
```

## Phase 0 — Baseline (do first, ~30 min)

Without numbers we cannot prove wins or catch regressions.

- Run `pnpm build`; record per-route **First Load JS** (note `/markedsinnsikt`
  and a representative blog + help article slug).
- Add `@next/bundle-analyzer` (devDependency, dev-only) to inspect route chunks.
- Record the weight of `src/styles/advanti-design.css` (~100 KB raw, globally
  `@import`-ed) — input for TODO 9.
- Lighthouse on `/`, `/markedsinnsikt`, and one blog article (the `/benchmark`
  gstack skill, or Chrome DevTools). **Measurement caveat:** run with the real
  `NEXT_PUBLIC_GTM_ID` set so Google Tag Manager cost is included — a Lighthouse
  run without it reports an optimistic, unrepresentative number.

## Phase 1 — Images

Reframed per **D2**: item 1.2 is the real LCP win; 1.1 is repo hygiene.

- **1.2 (LCP win — do first) Replace 6 raw `<img>` with `next/image`.** Raw
  `<img>` serves the unoptimized original with no resizing; `next/image` serves
  a resized WebP/AVIF variant. Files:
  `om-oss/page.tsx:200`, `kunder/page.tsx:149`, `kunder/[slug]/page.tsx:261`,
  `personer/page.tsx:97`, `personer/[slug]/page.tsx:123` and `:341`.
  Set `width`/`height` or `fill`+`sizes`; `priority` only above the fold.
  Remote avatars use `imagedelivery.net`, already allowlisted in
  `next.config.mjs` — no config change needed.
- **1.1 (repo hygiene, not LCP) Recompress raw-served sources.** next/image
  already optimizes delivery for `<Image>`-served files, so recompressing those
  sources does **not** improve LCP. Scope 1.1 to:
  - `public/havard.jpg` (546 KB) — served both as raw `<img>` and as a CSS
    `background-image` (om-oss/page.tsx:158); recompress the source.
  - `public/opengraph-image.png` (1.3 MB) — OG images are served as-is in meta
    tags, so recompressing this **is** a real social-unfurl win → target <300 KB.
- **Note on CSS background-images:** `havard.jpg` and several avatars are used
  via `style={{ backgroundImage: url(...) }}` (7 sites). `next/image` cannot
  optimize these. The local `havard.jpg` is covered by 1.1; the remote avatars
  are CDN-served (`imagedelivery.net`) and acceptable as-is. No refactor here.

## Phase 2 — Client JS per route

- **2.0 (biggest win — do first per D7) Lazy-load MDX widgets.**
  `src/components/blog/mdx.tsx` is a client component rendering ~47 of 57 MDX
  files (blog/help/kunder/integrasjoner/legal). It statically imports
  `DcfChart` (→ `ComboChart` → recharts), `react-katex` + `katex/dist/katex.min.css`,
  and `AnimatedGridPattern` (framer-motion) — so every article ships all of it,
  though only ~10 articles use a chart or math. Wrap `DcfChart`,
  `AnimatedGridPattern`, and the katex `BlockMath`/`InlineMath` in `next/dynamic`
  so they load only when an article uses them. The katex CSS import must move
  into the dynamically-loaded katex wrapper so it defers too. The other two MDX
  renderers (`LocationMdx.tsx`, `person-mdx.tsx`) were checked — no heavy
  widgets, no change.
- **2.1 Lazy-load recharts charts in `MarkedsinnsiktShell.tsx`.** Both
  `MarketBarChart` and `MarketLineChart` are statically imported (lines 9–10).
  Convert both to `next/dynamic` with **`ssr: false`** (per D3/D8) and
  **height-locked skeletons** to prevent layout shift — the maps in the same
  file already use this exact pattern. ssr:false loses no real chart HTML: both
  charts use recharts `ResponsiveContainer`, which renders empty during SSR
  regardless. Do not edit the chart internals — the `recharts-fragment-children`
  and `svg-stop-color-css-var` learnings still hold.
- **2.2 Consolidate animation libraries.** Both `motion` and `framer-motion`
  are installed (v12 each — same codebase, different package names). 2 files
  import `framer-motion`, 1 imports `motion/react`. Standardize on `motion`,
  migrate the 2 files, drop `framer-motion`.
- **2.3 `optimizePackageImports`** in `next.config.mjs` for `@remixicon/react`
  (20+ files) and any heavy lib not already in Next 16's default list.

## Phase 3 — Dependency & asset hygiene

NOTE: unused deps are already tree-shaken out of the client bundle — this does
**not** shrink shipped JS. Payoff: faster `pnpm install`, smaller node_modules,
faster cold builds, smaller deploys, less supply-chain surface.

- **3.1 Remove unused dependencies — verified procedure (per D5).** Run
  `npx depcheck` (no install, one-shot) to generate the unused-dependency
  candidate list. depcheck has known false positives (MDX, Next config,
  content-collections config, CSS imports, type-only imports) — so **gate each
  removal** on: `next build` passes, `tsc --noEmit` passes, and the Playwright
  smoke suite stays green. Confirmed-unused already includes everything in the
  original list **plus** `react-highlight-words` and `react-hotkeys-hook`
  (this review found zero imports for both). Also delete the empty
  `src/components/ui/data-table/` folder (only a stray `TanstackTable.d.ts`).
- **3.2 Delete the unused `NanumPenScript` `@font-face`** (globals.css:32–39)
  and `public/fonts/NanumPenScript.woff2`. The family is declared but used by
  no element. Dead-code cleanup.

## Phase 4 — Server / data fetching (low runtime impact — pages are static)

- **4.1** `onboarding.ts:166,186`: the two `postToDiscordWebhook` calls run
  sequentially — wrap in `Promise.all` (~100–300 ms off form submit; affects
  the POST only). Safe: `postToDiscordWebhook` (lines 111–130) catches all
  errors and returns a boolean, never rejects, so `Promise.all` cannot
  short-circuit — `Promise.allSettled` is not needed.
- **4.2** Add `React.cache()`-wrapped getters (`getBlogPost`, `getHelpPost`,
  `getCustomerPost`, `getIntegrationPost`) to a **new server-only module**
  `src/lib/content.ts` (per D4/D9 — NOT `lib/blog/content.tsx`, which is
  imported by the client component `mdx.tsx`). Both each `[slug]/page.tsx` and
  its `generateMetadata` import the shared getter, so the lookup runs once.
- **4.3** Tidy the redundant double-`await Promise.all` blur-hash blocks
  (help / kunder / integrasjoner `[slug]` pages) — readability; runs at build.

## Phase 5 — Interaction smoothness

- **5.1** `scroll-progress.tsx`: add `{ passive: true }` to the scroll listener
  **and** throttle `setProgress` with `requestAnimationFrame` (currently a
  state update on every scroll event → excess renders on every blog post).
- **5.2 DROPPED (per Codex F14).** The original plan added `passive: true` to
  the `TrackingListener` global listener — but that listener is a `click`
  listener, and `passive` only affects scroll-blocking events (`scroll`,
  `wheel`, `touchstart`/`touchmove`). `passive` on a `click` listener is a
  no-op. Removed from scope.
- **5.3** `AnimatedGridPattern` (used on `sjekkliste-verdivurdering`):
  `onAnimationComplete` fires `setSquares` per square → ~50 state updates per
  cycle, plus two redundant `ResizeObserver`s. Refactor to one observer and
  remove the per-square state churn. Medium effort, single-page blast radius.

## Test plan

Verification posture: a perf refactor is mostly verified by (a) `next build`
passing — it type-checks for real (`ignoreBuildErrors: false`), (b) the
existing Playwright suite staying green, (c) re-running the Phase 0 baseline.

```
COVERAGE MAP
CHANGED PATH                         GUARD
2.0 mdx.tsx widget lazy-load         build gate + blog-content.spec; NEW: assert
                                       a chart article + a math article still render
2.1 charts -> dynamic ssr:false      ★★ markedsinnsikt.spec.ts:14,37 (auto-waits)
1.2 raw <img> -> next/image          NEW REGRESSION TEST (mandatory, below)
2.2 / 2.3 / 3.1 / 3.2                ★★ next build + tsc + smoke suite
4.1 / 4.2 / 4.3                      ★★ routes + blog-content + contact-form specs
5.1 scroll-progress                  build gate (interaction not asserted — low value)
5.3 AnimatedGridPattern              build gate + sjekkliste route load
```

- **CRITICAL regression test (mandatory, per the regression rule).** Phase 1.2
  modifies existing rendering and `routes.spec.ts` only checks HTTP status. Add
  to `tests/routes.spec.ts`: load `/om-oss`, `/kunder`, one `/kunder/[slug]`,
  `/personer`, one `/personer/[slug]`; for each converted image assert it
  renders (`naturalWidth > 0`) **and** that `next/image` is actually in use —
  check the `<img>` has a `srcset` or its `src` resolves through `/_next/image`
  (per Codex F10 — `naturalWidth > 0` alone would pass even if the conversion
  silently reverted to a plain tag).
- **Phase 2.0 test.** Extend `tests/blog-content.spec.ts`: load one article
  that uses `<DcfChart>` (e.g. `dcf-analyse-naringseiendom`) and one that uses
  math (`BlockMath`) and assert the widget renders after lazy-load.
- Run the full Playwright suite (`npx playwright test`) green after each phase.
  Note: there is no `pnpm test` script — the command is `npx playwright test`.

## Sequencing & worktree parallelization

```
Phase 0 (baseline) ─── must complete first ───┐
                                              ▼
   ┌─────────────── parallel lanes ───────────────┐
   │ Lane A  Phase 2.0  mdx.tsx                    │  (1 file)
   │ Lane B  Phase 2.1  MarkedsinnsiktShell.tsx    │  (1 file)
   │ Lane C  Phase 5.1 scroll-progress + 5.3 grid  │  (2 components)
   │ Lane D  Phase 3.2 globals.css + font          │  (1 file + asset)
   └───────────────────────────────────────────────┘
                                              ▼
   Lane E (sequential — shared files):
     Phase 1.2 images  ─┐  both touch kunder/[slug] + personer files
     Phase 4.2 getters ─┤  and the [slug] pages — run in order, same lane
     Phase 4.3 cleanup ─┘
   Lane F (sequential — all touch package.json / next.config):
     Phase 2.2 motion → 2.3 optimizePackageImports → 3.1 depcheck removal
   Phase 1.1 (image recompression) and Phase 4.1 (onboarding) — independent, any lane.
```

| Step | Modules touched | Depends on |
|------|-----------------|-----------|
| Phase 0 | — (build/measure) | — |
| Phase 2.0 | components/blog/ | Phase 0 |
| Phase 2.1 | components/markedsinnsikt/ | Phase 0 |
| Phase 1.2 | app/om-oss, app/kunder, app/personer | Phase 0 |
| Phase 4.2/4.3 | app/(blog), app/(help), app/kunder, app/(integrasjoner), lib/ | Phase 1.2 (shared [slug] files) |
| Phase 2.2/2.3/3.1 | package.json, next.config.mjs | Phase 0 |
| Phase 3.2 | app/globals.css, public/fonts | — |
| Phase 5.1/5.3 | components/blog, components/ui | — |

**Conflict flag:** Lane E — Phase 1.2 and Phase 4.2/4.3 both edit
`kunder/[slug]/page.tsx` and the help/integrasjoner `[slug]` pages. Keep them
in one sequential lane; do not run in parallel worktrees.

## Failure modes

| New codepath | Realistic production failure | Test? | Error handling? | Visible? |
|--------------|------------------------------|-------|-----------------|----------|
| 2.0 dynamic katex/DcfChart | chunk 404 / load error → widget never appears | partial (renders, not failure) | `next/dynamic` shows `loading`; no error fallback | silent blank — **gap** |
| 2.1 dynamic charts ssr:false | skeleton stuck if chunk fails | markedsinnsikt.spec (timeout fails) | skeleton only | skeleton persists |
| 1.2 next/image | wrong dimensions → layout shift; bad host → runtime error | NEW regression test | Next throws on bad host | build/test catches |
| 4.1 Promise.all webhooks | one webhook down | n/a (never throws) | function catches internally | logged, not user-visible |

**Critical gap:** 2.0 — a failed dynamic import of `DcfChart`/katex would leave
a silent blank where a chart/formula should be, with no error boundary. Mitigation
in scope: give the `next/dynamic` calls a visible `loading` state, and consider a
small error fallback (`"Kunne ikke laste innhold"`). Flagged for the implementer.

## NOT in scope

- **Suspense streaming** — data is in-memory; no benefit.
- **List virtualization** — largest list is 18 rows.
- **Route client→server conversion** — only 1 client page, and it is justified.
- **Static-SVG chart rewrite** (Codex's alternative to D3) — reverses the recent
  deliberate Recharts rebuild; out of scope, see D8.
- **Slimming `advanti-design.css`** (~100 KB global CSS) — real win but a
  separate, regression-prone audit → TODO 9.
- **Automated perf regression guard** (CI budget / Lighthouse CI) → TODO 10.
- **Converting CSS `background-image` avatars to `next/image`** — remote ones
  are CDN-served and acceptable; not worth a refactor.

## What already exists (reused, not rebuilt)

- **Lazy-load pattern** — `MarkedsinnsiktShell.tsx` already wraps the Leaflet
  map in `next/dynamic({ ssr:false })`; Phases 2.0/2.1 reuse this exact pattern.
- **`next/font`** — Inter is already self-hosted via `next/font/google` with
  `display: swap`. No font work needed beyond deleting the dead NanumPenScript.
- **`generateStaticParams`** — every dynamic route already statically generates.
- **`src/lib/blog/content.tsx`** — already centralizes content constants; Phase
  4.2 adds a sibling server-only module rather than a parallel system.
- **Playwright suite** — `markedsinnsikt.spec.ts` already asserts charts render;
  it is the regression guard for Phase 2.1, no new test needed there.
- **GoogleTagManager** — already loaded with `next/script` `afterInteractive`.

## Implementation Tasks
Synthesized from this review. Each derives from a specific decision/finding.
P1 blocks ship; P2 lands same branch; P3 is a follow-up.

- [ ] **T1 (P1, human: ~3-4h / CC: ~25min)** — components/blog — Lazy-load DcfChart, AnimatedGridPattern, katex (+CSS) in `mdx.tsx`
  - Surfaced by: Outside voice (Codex F2/F3), decision D7
  - Files: `src/components/blog/mdx.tsx`
  - Verify: build passes; a chart article + a math article still render the widget
- [ ] **T2 (P1, human: ~2h / CC: ~15min)** — app/(pages) — Convert 6 raw `<img>` to `next/image`
  - Surfaced by: Phase 1.2, decision D2
  - Files: `om-oss/page.tsx`, `kunder/page.tsx`, `kunder/[slug]/page.tsx`, `personer/page.tsx`, `personer/[slug]/page.tsx`
  - Verify: new regression test (T4) green
- [ ] **T3 (P1, human: ~1h / CC: ~15min)** — components/markedsinnsikt — Lazy-load both recharts charts (`next/dynamic`, ssr:false, height-locked skeleton)
  - Surfaced by: Phase 2.1, decisions D3/D8
  - Files: `src/components/markedsinnsikt/MarkedsinnsiktShell.tsx`
  - Verify: `markedsinnsikt.spec.ts` green; no layout shift
- [ ] **T4 (P1, human: ~1h / CC: ~10min)** — tests — Image-render regression test (renders + next/image actually used)
  - Surfaced by: Test review (regression rule) + Codex F10
  - Files: `tests/routes.spec.ts`
  - Verify: test fails if an image silently reverts to a plain tag
- [ ] **T5 (P2, human: ~30min / CC: ~15min)** — build — Phase 0 baseline: bundle-analyzer, per-route First Load JS, Lighthouse with real GTM
  - Surfaced by: Phase 0, Codex F7
  - Files: `next.config.mjs` (analyzer), measurement notes
  - Verify: baseline numbers recorded
- [ ] **T6 (P2, human: ~45min / CC: ~10min)** — public — Recompress `havard.jpg` + `opengraph-image.png`
  - Surfaced by: Phase 1.1, decision D2
  - Files: `public/havard.jpg`, `public/opengraph-image.png`
  - Verify: visual eyeball; opengraph-image < 300 KB
- [ ] **T7 (P2, human: ~1h / CC: ~15min)** — package — Consolidate `motion`/`framer-motion` onto `motion`
  - Surfaced by: Phase 2.2
  - Files: 3 component files, `package.json`
  - Verify: build passes; animations visually intact
- [ ] **T8 (P2, human: ~15min / CC: ~5min)** — config — Add `optimizePackageImports`
  - Surfaced by: Phase 2.3
  - Files: `next.config.mjs`
  - Verify: build passes
- [ ] **T9 (P2, human: ~30min / CC: ~10min)** — package — `depcheck` + remove confirmed-unused deps, delete empty data-table folder
  - Surfaced by: Phase 3.1, decision D5, Codex F12
  - Files: `package.json`, `src/components/ui/data-table/`
  - Verify: `next build` + `tsc --noEmit` + smoke suite all green
- [ ] **T10 (P2, human: ~10min / CC: ~5min)** — assets — Delete dead `NanumPenScript` `@font-face` + woff2
  - Surfaced by: Phase 3.2
  - Files: `src/app/globals.css`, `public/fonts/NanumPenScript.woff2`
  - Verify: build passes; grep confirms 0 refs
- [ ] **T11 (P2, human: ~10min / CC: ~5min)** — actions — Parallelize Discord webhooks with `Promise.all`
  - Surfaced by: Phase 4.1
  - Files: `src/app/actions/onboarding/onboarding.ts`
  - Verify: contact form submit still succeeds
- [ ] **T12 (P2, human: ~45min / CC: ~10min)** — lib — `React.cache` content getters in new server-only `src/lib/content.ts`
  - Surfaced by: Phase 4.2, decisions D4/D9
  - Files: new `src/lib/content.ts`, 4 `[slug]/page.tsx` files
  - Verify: routes + blog-content specs green
- [ ] **T13 (P2, human: ~20min / CC: ~5min)** — app — Remove redundant double-`await Promise.all` blur blocks
  - Surfaced by: Phase 4.3
  - Files: help / kunder / integrasjoner `[slug]/page.tsx`
  - Verify: build passes; pages render
- [ ] **T14 (P2, human: ~30min / CC: ~10min)** — components/blog — `scroll-progress.tsx`: passive listener + rAF throttle
  - Surfaced by: Phase 5.1
  - Files: `src/components/blog/scroll-progress.tsx`
  - Verify: progress bar updates on scroll
- [ ] **T15 (P3, human: ~3h / CC: ~25min)** — components/ui — Refactor `AnimatedGridPattern` (one observer, drop per-square state churn)
  - Surfaced by: Phase 5.3
  - Files: `src/components/ui/Animated-Grid-Background.tsx`
  - Verify: sjekkliste page renders; grid animates

## Risks

- Image recompression → visual quality regression: eyeball before/after.
- Lazy charts/widgets → flash / layout shift: skeletons must reserve exact height.
- `motion` migration → API differences between the two import paths: verify each
  animation after migration.
- Phase 2.0 → a failed dynamic import leaves a silent blank (see Failure modes).
- depcheck false positives → every removal gated on build + typecheck + smoke.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | not run (optional) |
| Codex Review | `/codex review` | Independent 2nd opinion | 1 | issues_found | outside-voice: 15 points — 3 adopted (D7–D9), refinements folded, 3 dismissed |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 5 issues (D2–D5), 1 mandatory regression test added, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | not run (optional) |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | not run (n/a) |

- **CODEX:** Outside voice caught the single largest finding this review missed —
  `mdx.tsx` ships recharts + katex + framer-motion to ~47 article pages (→ Phase 2.0,
  D7). Also: D4 refined to a server-only module (D9), depcheck gating tightened,
  "ISR"→"SSG" corrected, image test strengthened, no-op Phase 5.2 dropped.
  Dismissed: Promise.allSettled (the webhook fn never throws), `/benchmark`
  exists, raw `<img>` count (6, not 9).
- **CROSS-MODEL:** Both reviewers agree lazy-loading is the core lever. One
  tension — chart `ssr:false` (D3) — resolved in the Eng review's favor: both
  charts use recharts `ResponsiveContainer`, which cannot SSR, so `ssr:false`
  loses no real HTML (D8).
- **UNRESOLVED:** 0 — all 11 decisions (D1–D11) answered.
- **VERDICT:** ENG CLEARED — ready to implement. CEO and Design reviews not run
  (optional; this is a performance refactor with no scope or UI-design change).
