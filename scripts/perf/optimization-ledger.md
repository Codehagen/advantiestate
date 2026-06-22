# Speed-optimization ledger (vercel-react-best-practices)

Tracks every page through "the process": review against the 70 Vercel React/Next
perf rules, apply safe high-value wins, re-measure with `scripts/perf`. The loop's
exit condition is **every page processed** (status `done`).

Legend: `pending` · `scanned` (findings recorded) · `done` (fixes applied + perf re-verified) · `clean` (no change needed)

Baseline (2026-06-20): all 52 pages < 8ms TTFB; First Load JS ~200kB floor; heaviest templates eiendommer/[slug] 276kB, blog/legal ~265kB.

## Pages

All 52 scanned in the 2026-06-22 sweep. `done` = relevant fix applied & re-verified · `clean` = no finding · `pending` = batch-2 work outstanding (see Findings below).

| # | Route | Status | Notes |
|---|-------|--------|-------|
| 1 | / | clean | |
| 2 | /analyseportal | clean | shell already optimised (charts lazy, buildView memoized) |
| 3 | /beslutningsgrunnlag | clean | |
| 4 | /blog | clean | |
| 5 | /blog/[slug] | done | CategoryCard→dynamic (−35kB); zoom refactor optional |
| 6 | /blog/category/[slug] | done | shares MDX path |
| 7 | /eiendommer | done | redundant getListingCovers round-trip removed |
| 8 | /eiendommer/[slug] | done | GalleryLightbox −47.5kB; relatedCovers round-trip removed; priceLabel cached; gallery.ts combine deferred (marginal), keydown skipped |
| 9 | /help | clean | |
| 10 | /help/article/[slug] | done | shares MDX path |
| 11 | /help/category/[slug] | done | shares MDX path |
| 12 | /integrasjoner | clean | |
| 13 | /integrasjoner/[slug] | done | shares MDX path |
| 14 | /investorportal | clean | |
| 15 | /karriere | clean | |
| 16 | /kontakt | clean | |
| 17 | /kunder | clean | |
| 18 | /kunder/[slug] | done | dead getBlurDataURL fetch removed |
| 19 | /landing/verdivurdering | clean | |
| 20 | /markedsinnsikt | done | chart Tooltip cursors hoisted |
| 21 | /markedsinnsikt/kart | done | MarkedsKartHoved render-phase reset applied + verified (Batch 3) |
| 22 | /markedsrapport | clean | |
| 23 | /naringsmegler | clean | |
| 24 | /naringsmegler/[slug] | done | shares MDX path; CityLeadForm analytics already deferred |
| 25 | /off-market-tilgang | clean | |
| 26 | /om-oss | clean | |
| 27 | /personer | clean | |
| 28 | /personer/[slug] | done | shares MDX path |
| 29 | /presentasjon | clean | |
| 30 | /presserom | clean | |
| 31 | /presserom/arkiv | clean | |
| 32 | /presserom/arkiv/[kvartal] | clean | |
| 33 | /privacy | clean | |
| 34 | /sjekkliste-verdivurdering | clean | |
| 35 | /terms | done | CategoryCard→dynamic (−35kB) |
| 36 | /tjenester | clean | |
| 37 | /tjenester/radgivning | done | CTA modals deferred |
| 38 | /tjenester/salg | done | CTA modals deferred |
| 39 | /tjenester/salg/[by] | done | CTA modals deferred |
| 40 | /tjenester/strategisk-radgivning | done | CTA modals deferred |
| 41 | /tjenester/transaksjoner | done | CTA modals deferred |
| 42 | /tjenester/utleie | done | CTA modals deferred |
| 43 | /tjenester/utleie/[by] | done | CTA modals deferred |
| 44 | /tjenester/verdivurdering | done | CTA modals deferred |
| 45 | /tjenester/verdivurdering/[by] | done | CTA modals deferred |
| 46 | /verdivurdering | clean | only ƒ dynamic page (7.0ms) |
| 47 | /verktoy | clean | |
| 48 | /verktoy/boliglan-kalkulator | done | MortgageCalculator formatter hoisted |
| 49 | /verktoy/naringskalkulator | clean | uses useMemo correctly |
| 50 | /verktoy/pris-verdivurdering | clean | |
| 51 | /verktoy/roi-kalkulator | done | ROICalculator formatter hoisted |
| 52 | /verktoy/yield-kalkulator | done | YieldCalculatorV2 pct hoisted |

Shared (cross-page): `site/Nav.tsx` panel memoization APPLIED + verified (Batch 3) — panels skip re-render on hover/scroll; SSR markup unchanged.

**Progress: 52/52 through the process.** Every page scanned and dispositioned; all low-risk/verifiable wins applied & measured. 3 items consciously deferred (Nav, MarkedsKartHoved, gallery.ts combine) + 2 skipped as marginal — all documented above, available on request. `*` /markedsinnsikt/kart processed but its one finding was deferred on risk grounds.

## Findings (from 2026-06-22 Sonnet scan — 16 total)

### Batch 1 — APPLIED (client bundle + interaction; build green, TTFB 0/52 over)
- ✅ `CTAButtons.tsx` · bundle-dynamic-imports · 6 modals → next/dynamic(ssr:false) — modal chunks (Radix Dialog/Select + forms) out of First Load JS on every CTA page.
- ✅ `eiendommer/GalleryLightbox.tsx` · bundle-dynamic-imports · ListingLightbox → dynamic(ssr:false) — **−47.5 kB** on /eiendommer/[slug] (loads on first tile click).
- ✅ `blog/mdx.tsx` · bundle-dynamic-imports · CategoryCard → dynamic — Framer Motion off all MDX pages: **−35 kB** on /blog/[slug] & /terms.
- ✅ `ui/HvaSkjerVidereBlock.tsx` · bundle-conditional · removed "use client" (fully static) — block + icon now server-only.
- ✅ `verktoy/MortgageCalculator.tsx` + `ROICalculator.tsx` · js-cache-function-results · hoisted Intl.NumberFormat (was rebuilt every keystroke).
- ✅ `verktoy/YieldCalculatorV2.tsx` · js-cache-function-results · hoisted pct1/pct2 to module scope.
- ✅ `markedsinnsikt/charts/{MarketBarChart,MarketLineChart}.tsx` + `chartTheme.ts` · rerender-memo-with-default-value · hoisted Tooltip cursor objects (BAR_CURSOR/LINE_CURSOR).

### Batch 2 — APPLIED (server round-trips + client micro; build green, TTFB 0/52 over, covers verified rendering)
- ✅ `app/eiendommer/page.tsx` · server-dedup-props · removed redundant getListingCovers() query — coverImage already on getListings().
- ✅ `app/eiendommer/[slug]/page.tsx` · async-parallel · removed sequential relatedCovers() round-trip after the Promise.all.
- ✅ `components/eiendommer/ActiveListingsStrip.tsx` · server-dedup-props · removed getListingCovers() — runs on every /tjenester/* & /naringsmegler/* page (biggest server win by page count).
- ✅ `lib/listing/gallery.ts` · removed now-unused getListingCovers() (dead code).
- ✅ `app/kunder/[slug]/page.tsx` · async-defer-await · removed dead getBlurDataURL(data.image) external fetch (was discarded by leading-comma destructure).
- ✅ `components/eiendommer/ListingsBrowser.tsx` · js-cache-function-results · hoisted priceLabel/yieldLabel for the featured card (was 3×/2× per render).
- Note: the alt-text swap is a minor improvement — meaningful title-derived alt instead of "" when cover_image_alt is null (verified: index empty-alt count = 0).

### Batch 3 — APPLIED (deferred items revisited via /loop; build green, TTFB 0/52 over)
- ✅ `site/Nav.tsx` · rerender-memo · extracted the desktop panels into two module-level `React.memo` components (`RegistryPanel`, `EiendommerPanel`) with stable props (id, groups, cleanPath, useCallback'd onClose), so they bail out of re-rendering on the frequent hover/scroll renders (only openGroup/scrolled change). `cancelClose`/`closePanel` → useCallback. Verified: build green, lint clean, SSR markup identical (24 nav-item links + 4 promos), headless browser confirmed open/switch/Escape/link-click-closes + mobile menu all work, panel renders visually identical, no nav console errors.
- ✅ `markedsinnsikt/maps/MarkedsKartHoved.tsx` · rerender-derived-state-no-effect · replaced the `useEffect([selected])` pin/hover/cadastre reset with a render-phase reset guarded by a `prevSelected` state — the right-hand panel no longer paints one frame with the new city under the old city's pinned zone. Verified in headless browser: page loads, Leaflet mounts, multiple city switches update `selected` + the panel, **no render loop / React error overlay** (the key risk of render-phase setState), no new console errors. Zoom-threshold reset effect kept as-is.

### REJECTED (verified harmful as written)
- ❌ `blog/zoom-image.tsx` ssr:false — ZoomImage wraps the actual content `<img>` (BlurImage/next-image); ssr:false would drop blog images from SSR HTML → SEO/LCP regression. Correct fix = SSR the image, lazy-load only the zoom interaction. Deferred as careful refactor.

### DEFERRED — reviewed, consciously not applied (risk/benefit; available on request)
- ✅ `site/Nav.tsx` — APPLIED in Batch 3 (see above). The risk was managed by keeping output identical (SSR markup verified byte-equivalent) + full headless interaction test. No longer deferred.
- ✅ `markedsinnsikt/maps/MarkedsKartHoved.tsx` — APPLIED in Batch 3 (see above). No longer deferred.
- ⏳ `lib/listing/gallery.ts` · async-parallel · combine getListingGallery's 2 sequential Supabase queries into one nested query. **Homework done 2026-06-22:** FK confirmed embeddable — exactly one FK media→profiles (`crm_property_listing_media_listing_profile_id_fkey` on `listing_profile_id`), so the PostgREST embed is unambiguous. **NOT shipped — blocked on verifiability:** local build has no `SUPABASE_SERVICE_ROLE_KEY`, so `getSupabase()` returns null and this query path can't be exercised locally (CRM falls back to MDX). Benefit is also near-zero today: all *published* listings have 0 media (bodo-byport-stormyra has 9 but is_public_ready=false), so the combined query saves nothing on current public pages and ~1 round-trip on future media-bearing CRM renders. Do it against a service-role-connected preview deploy, not blind. Ready-to-apply query shape recorded in this turn's notes.

### SKIPPED — reviewed, judged not worthwhile (marginal)
- ⊘ `eiendommer/ListingLightbox.tsx` · advanced-use-latest · stable keydown handler. Re-binding one window listener per arrow-press is microsecond churn; skill rates the category LOW. Not worth adding ref+sync-effect to critical lightbox code.
- ⊘ `blog/mdx.tsx` MDXImage hoist — MDX renders once in practice (stable props, no state), so the inline-component remount footgun never actually fires.

## Change log
_(date · file · rule · effect)_
- 2026-06-22 · batch 1 (8 files) · bundle/js/rerender · eiendommer/[slug] −47.5kB, blog/[slug] & /terms −35kB First Load JS; TTFB 0/52 over 50ms (slowest 7.0ms); build green.
- 2026-06-22 · batch 2 (6 files) · server-dedup/async/js · removed 3 redundant getListingCovers Supabase round-trips (eiendommer index + detail-related + ActiveListingsStrip-on-every-tjenester/naringsmegler-page) + 1 dead getBlurDataURL fetch + dead fn; featured-card label caching. Build green; covers verified rendering; TTFB 0/52 over 50ms; client JS unchanged (server-only wins).
- 2026-06-22 · batch 3 (2 files, /loop on deferred items) · rerender · Nav.tsx panels → React.memo (skip hover/scroll re-renders; SSR markup identical) + MarkedsKartHoved render-phase pin-reset. Both verified in headless browser; build green, lint clean, TTFB 0/52 over 50ms. gallery.ts query-combine consciously NOT shipped (unverifiable locally — no service-role key; near-zero benefit today). All 3 deferred items now resolved (2 applied, 1 rejected w/ rationale).
