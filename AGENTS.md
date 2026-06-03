# AGENTS.md

Guidance for AI coding agents (Codex, Cursor, Claude Code, Continue, etc.)
working in this repository. Follows the [agents.md](https://agents.md/)
community convention.

For richer guidance specific to Claude Code workflows, see
[`CLAUDE.md`](./CLAUDE.md) — it is a superset of this file. For the
design system, see [`DESIGN.md`](./DESIGN.md).

## What this repo is

**Advanti** — a commercial real estate platform for Northern Norway
(brokerage, valuation, market analysis, transaction advisory). Norwegian
(bokmål) marketing site + content collections + light interactive tools
(yield calc, ROI calc). Regional focus: Nordland, Nord-Norge.

## Tech stack

- Next.js 16.1.4 (App Router) + React 19
- TypeScript (strict; `tsc --noEmit` enforced at build)
- Tailwind CSS + semantic classes from `src/styles/advanti-design.css`
- `@content-collections/core` for MDX content
- Recharts for charts; Leaflet + react-leaflet (CartoDB tiles) for maps
- pnpm

## Commands

```bash
pnpm dev          # dev server (http://localhost:3000)
pnpm build        # production build (type-checked, content-collections compiled)
pnpm start        # serve production build
pnpm lint         # eslint
pnpm test         # playwright (incl. perf-budget spec)
```

When using `npx prisma generate`, pass `--no-engine`.

## Project layout

```
src/
├── app/                          # Next.js App Router pages
│   ├── (blog)/                   # Blog route group
│   ├── (help)/                   # Help center route group
│   ├── (integrasjoner)/          # Integrations route group
│   ├── tjenester/                # 6 static service pages (salg, utleie, …)
│   ├── markedsinnsikt/           # Market insights & analytics
│   ├── naringsmegler/            # Location-driven broker pages
│   ├── verktoy/                  # Calculator tools
│   ├── api/                      # API routes
│   ├── actions/                  # Server actions
│   ├── layout.tsx                # Root layout
│   ├── siteConfig.ts             # Site-wide config (URL, contact, social)
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # robots.txt (AI-bot allowlist + CCBot block)
├── components/
│   ├── ui/                       # shadcn-style primitives
│   ├── site/                     # Editorial layout primitives (SubHero, CtaStrip, Faq, ProseShell)
│   ├── advanti/                  # Domain components (DCF, yield, etc.)
│   ├── markedsinnsikt/           # Recharts charts + Leaflet maps (client-only)
│   ├── blog/                     # Blog rendering (MDX, headers, legal page)
│   └── StructuredData.tsx        # All JSON-LD schemas (Organization, Article, FAQ, Breadcrumb, …)
├── content/                      # MDX content
│   ├── blog/                     # categories: company, valuation, market-analysis, casestudies
│   ├── help/                     # categories: overview, getting-started, terms, analysis, valuation
│   ├── changelog/ customers/ integrations/ legal/ locations/ people/
├── lib/                          # Utilities (formatters, chartUtils, coordinateUtils, hooks/, blog/)
├── styles/                       # advanti-design.css (semantic classes, ~95KB)
└── types/                        # TS type defs
```

Path alias: `@/*` → `src/*`. Content collections alias: `content-collections`
→ `.content-collections/generated`.

## Conventions

### Styling
- **Read [`DESIGN.md`](./DESIGN.md) before any UI work** — design system is the
  source of truth.
- Prefer semantic classes from `src/styles/advanti-design.css` over ad-hoc
  Tailwind for editorial pages.
- Light only. No dark mode. All `dark:` variants were stripped in 2026-05.
- Norwegian (bokmål) copy throughout.

### Content
- All MDX requires its collection's frontmatter (validated by Zod in
  `content-collections.ts`).
- `publishedAt` / `updatedAt` use `YYYY-MM-DD` (regex-validated where present).
- `BlogPost` requires `author`, `summary`, `image`, `categories`.
- `HelpPost` and `LegalPost` already carry `updatedAt`; `BlogPost` does not
  (yet — see TODO 15).

### SEO + structured data
- Every dynamic route exports `generateMetadata`.
- `StructuredData.tsx` exposes typed schema generators; `BreadcrumbStructuredData`
  is injected on all blog/help/services/location pages.
- `FAQPage` schema comes from `src/components/site/Faq.tsx` — one `items` array
  drives both the visible accordion and the JSON-LD so they cannot drift.
- robots.ts explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
  Bingbot, etc. and explicitly blocks CCBot.
- `src/app/llms.txt/route.ts` is the curated AI-context entry point per
  [llmstxt.org](https://llmstxt.org).

### TypeScript
- Strict mode + `noUnusedLocals` / `noUnusedParameters`.
- Build is fully type-checked (`next.config.mjs` does NOT set `ignoreBuildErrors`).
- `content-collections.ts` is `@ts-nocheck` (build-time config; checked by
  content-collections' own pipeline).

### Components & domain
- UI primitives in `components/ui/`. Domain logic in `components/advanti/`
  (organized by feature) and `components/markedsinnsikt/`.
- Server actions in `app/actions/`.
- Maps are client-only and behind `MapErrorBoundary.tsx`.

## Where things live (quick lookup)

| Need to add… | Put it in |
|---|---|
| New service page | `src/app/tjenester/<slug>/page.tsx` (static, not dynamic route) |
| New blog post | `src/content/blog/<slug>.mdx` with full frontmatter; follow `src/content/blog/AUTHORING.md` (use the `.ae-*` editorial components) |
| New help article | `src/content/help/<slug>.mdx` (incl. `updatedAt`) |
| New location | `src/content/locations/<city>.mdx` (drives `/naringsmegler/<city>`) |
| New chart | `src/components/markedsinnsikt/charts/` (Recharts) or `src/components/advanti/` |
| New JSON-LD type | extend `src/components/StructuredData.tsx` switch |

## What NOT to do

- Don't write to `.cursor/rules/` or other tool-specific config without
  asking — those belong to specific agent setups.
- Don't add new Mapbox dependencies — maps are Leaflet + CartoDB only since
  2026-05.
- Don't add icons to the redesigned marketing pages — the editorial system is
  icon-free. Tool pages (`verktoy`, data-tables) keep their functional icons.
- Don't add dark mode classes — light only.
- Don't bypass `tsc --noEmit` — the build enforces it (see TODO 4 in
  `TODOS.md`).
