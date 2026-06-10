# Plan 005: Make README, CLAUDE.md and .env.example tell the truth

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3c71295..HEAD -- README.md CLAUDE.md .env.example`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live files before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (docs only — no code changes)
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `3c71295`, 2026-06-10

## Why this matters

The README describes a project that does not exist: a Turborepo monorepo with `apps/`/`packages/`/`tooling/`, Prisma, Neon, PlanetScale, Stripe and a `pnpm --filter=db db:push` setup step. The actual repo is a single Next.js 16 app with Supabase, Resend and Discord. CLAUDE.md — loaded into every AI coding session — contains four false claims (Mapbox, dark mode, NanumPenScript usage, "TS errors ignored during builds") that actively steer agents wrong. And `.env.example` omits `DISCORD_NETTSIDE_WEBHOOK_URL`, which `src/app/actions/onboarding/onboarding.ts:168` reads — a developer copying the example gets a silently missing secondary lead channel. Wrong docs are worse than no docs; this plan replaces them with verified facts.

## Current state

- `README.md` — stale sections, verified against the filesystem at `3c71295`:
  - Lines 33-51: "monorepo managed by Turborepo" with an `apps`/`packages`/`tooling` tree. Reality: single app at the repo root (`src/`, `tests/`, `content-collections.ts`); no such directories exist.
  - Lines 73-88: setup steps say create Neon, Stripe, Google Console accounts, and run `pnpm --filter=db db:push`. Reality: env needs Resend + Supabase + Discord (see `.env.example`); no Prisma anywhere (`grep -ri prisma src` → 0 hits).
  - Lines 91-103: tech stack lists Prisma and PlanetScale. Reality: Supabase (`@supabase/supabase-js` in package.json).
- `CLAUDE.md` — four stale claims (line numbers at `3c71295`):
  - Line 142: `- Mapbox integration for property visualization` — maps are Leaflet + react-leaflet with CartoDB tiles (`src/components/markedsinnsikt/maps/`, `src/components/eiendommer/PropertyMap.tsx`). Note the architecture sections of CLAUDE.md already say Leaflet; line 142 is a leftover contradicting them.
  - Line 146: `- Dark mode support via `selector` strategy` — `grep -n darkMode tailwind.config.ts` → no match; the design system is light-only (DESIGN.md states this).
  - Line 149: `- Custom font family: `NanumPenScript` for handwriting effect` — the font is configured at `tailwind.config.ts:35` but `grep -rn "font-handwriting" src` → 0 usages.
  - Line 179: `- ESLint and TypeScript errors ignored during builds (intentional for rapid iteration)` — `next.config.mjs:10` sets `typescript: { ignoreBuildErrors: false }`; `pnpm typecheck` passes clean; CI builds fail on TS errors (see comment in `.github/workflows/ci.yml:30-31`).
- `.env.example` — documents `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `EMAIL_FROM`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DISCORD_WEBHOOK_URL`, `NEXT_PUBLIC_GTM_ID`. Missing: `DISCORD_NETTSIDE_WEBHOOK_URL` (read at `src/app/actions/onboarding/onboarding.ts:168` for the `#nettside-henvendelser` channel).

Verified-true facts to write (do not re-derive, they were checked at `3c71295`): Next.js 16.1.4 App Router, React 19, TypeScript strict, Tailwind CSS 3, pnpm 10 (`packageManager` field), Content Collections for MDX (7 collections incl. ListingPost), Recharts, Leaflet + react-leaflet (CartoDB tiles), Supabase (CRM lead sink + CRM-published listings), Resend (newsletter + welcome email), Discord webhooks (team lead notifications), Playwright E2E in `tests/` (runs `pnpm build && pnpm start` itself), deployed on Vercel. Commands: `pnpm dev` / `pnpm build` / `pnpm start` / `pnpm lint` / `pnpm typecheck` / `npx playwright test`.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `pnpm typecheck`         | exit 0 (sanity that nothing else was touched) |
| Greps     | see Done criteria        | as listed           |

## Scope

**In scope** (the only files you should modify):
- `README.md`
- `CLAUDE.md` (only the four lines listed, plus nothing else)
- `.env.example` (append one variable)
- `plans/README.md` (status row)

**Out of scope** (do NOT touch):
- `tailwind.config.ts:35` (`handwriting: ["NanumPenScript"]`) — unused config, but removing it is a code change with PERFORMANCE_PLAN.md history; leave it, the doc just must stop claiming it's a feature.
- `DESIGN.md`, `AGENTS.md`, `docs/`, `supabase/README.md` — not audited as stale; don't "improve" them.
- Any source file.

## Git workflow

- Branch: `advisor/005-docs-truth-pass`
- Conventional commit, e.g. `docs: rewrite README for actual stack, fix stale CLAUDE.md claims, complete .env.example`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Replace README.md

Replace the entire contents of `README.md` with:

```markdown
# Advanti — advantiestate.no

Marketing- og innholdsplattform for Advanti, næringsmegler i Nord-Norge:
tjenestesider, markedsinnsikt, blogg/kunnskapsbase (MDX), eiendomsoppdrag
publisert fra CRM, og lead-funnel (nyhetsbrev, verdivurdering-intake,
kontaktskjema).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript (strict)
- [Tailwind CSS 3](https://tailwindcss.com/) med eget editorialt designsystem — se `DESIGN.md`
- [Content Collections](https://www.content-collections.dev/) for typet MDX-innhold (`src/content/`)
- [Supabase](https://supabase.com/) — CRM-sink for leads + CRM-publiserte eiendomsoppdrag (`supabase/migrations/`)
- [Resend](https://resend.com/) — nyhetsbrev-audience + velkomstmail (`src/emails/`)
- Discord webhooks — team-varsling om nye leads
- [Recharts](https://recharts.org/) + [Leaflet](https://leafletjs.com/) (CartoDB-tiles) for markedsinnsikt
- [Playwright](https://playwright.dev/) E2E-tester i `tests/`
- Deployes på [Vercel](https://vercel.com/); pakkehåndtering med pnpm

## Kom i gang

```sh
pnpm install
cp .env.example .env.local   # fyll inn Resend-, Supabase- og Discord-verdier (se kommentarene i fila)
pnpm dev
```

Uten env-verdier kjører sidene fint; lead-funnel og CRM-oppdrag degraderer
til no-op / MDX-fallback.

## Kommandoer

| Kommando               | Gjør |
|------------------------|------|
| `pnpm dev`             | Dev-server |
| `pnpm build`           | Produksjonsbygg (feiler på TypeScript-feil) |
| `pnpm start`           | Kjør produksjonsbygget |
| `pnpm lint`            | ESLint |
| `pnpm typecheck`       | `tsc --noEmit` |
| `npx playwright test`  | E2E-suiten — bygger og starter prod-server selv |

## Struktur

    src/app/          # App Router-sider (tjenester, markedsinnsikt, eiendommer, blogg, …)
    src/app/actions/  # Server actions (lead-funnel)
    src/components/   # UI + domenekomponenter
    src/content/      # MDX-innhold (blog, help, listings, legal, …)
    src/lib/          # E-post, Supabase, listings, utils
    supabase/         # Migrasjoner + CRM-dokumentasjon
    tests/            # Playwright-spesifikasjoner
    plans/            # Implementasjonsplaner (advisor-generert)

Se `CLAUDE.md` for agent-instruksjoner og `DESIGN.md` for designsystemet.
```

**Verify**: `grep -ci "turborepo\|prisma\|planetscale\|stripe\|neon" README.md` → 0.

### Step 2: Fix the four CLAUDE.md lines

Make exactly these edits (current text verified at `3c71295`):

1. Replace `- Mapbox integration for property visualization` with `- Leaflet + react-leaflet (CartoDB tiles) for property and market maps`
2. Delete the line `- Dark mode support via \`selector\` strategy` (the design system is light-only — DESIGN.md is the source of truth).
3. Delete the line `- Custom font family: \`NanumPenScript\` for handwriting effect` (configured in `tailwind.config.ts` but unused in `src`).
4. Replace `- ESLint and TypeScript errors ignored during builds (intentional for rapid iteration)` with `- TypeScript errors fail the build (\`typescript.ignoreBuildErrors: false\` in next.config.mjs); run \`pnpm lint\` for ESLint`

**Verify**: `grep -cn "Mapbox\|Dark mode support\|NanumPenScript\|ignored during builds" CLAUDE.md` → 0.

### Step 3: Complete .env.example

After the existing `DISCORD_WEBHOOK_URL=` line, add:

```
# Secondary webhook for the #nettside-henvendelser channel — receives a copy of
# kontakt-form inquiries (src/app/actions/onboarding/onboarding.ts). Optional;
# when unset, only the primary webhook fires.
DISCORD_NETTSIDE_WEBHOOK_URL=
```

**Verify**: `grep -c "DISCORD_NETTSIDE_WEBHOOK_URL" .env.example` → 1. Cross-check completeness: `grep -rhoE "process\.env\.[A-Z_]+" src | sort -u` — every variable in that output should either appear in `.env.example` or be `NODE_ENV`/`CI`/Next-internal; if you find another missing app-specific variable, add it with a one-line comment (and mention it in your report).

## Test plan

Docs-only; the greps above are the tests. Run `pnpm typecheck` once at the end to prove no source file was touched by accident.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `grep -ci "turborepo\|prisma\|planetscale\|stripe\|neon" README.md` → 0
- [ ] `grep -cn "Mapbox\|Dark mode support\|NanumPenScript\|ignored during builds" CLAUDE.md` → 0
- [ ] `grep -c "DISCORD_NETTSIDE_WEBHOOK_URL" .env.example` → 1
- [ ] `pnpm typecheck` exits 0
- [ ] `git status` shows only README.md, CLAUDE.md, .env.example, plans/README.md modified
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The four CLAUDE.md lines don't match the quoted text (drift — someone already edited them).
- The env-var cross-check in Step 3 surfaces more than 2 additional undocumented variables (suggests a bigger config drift worth a human look).
- You feel the urge to restructure CLAUDE.md beyond the four lines — don't; its structure is load-bearing for agent sessions.

## Maintenance notes

- CLAUDE.md is injected into every AI session; treat future stack changes (e.g. if Plan 007's market-data collection lands) as requiring a CLAUDE.md line.
- The unused `handwriting: ["NanumPenScript"]` entry at `tailwind.config.ts:35` can be removed in a future cleanup (it was slated in PERFORMANCE_PLAN.md Phase 3.2); deliberately not done here.
- README is in Norwegian to match the team and site language; keep it that way.
