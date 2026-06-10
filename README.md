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
- [Playwright](https://playwright.dev/) E2E-tester i `tests/` + [Vitest](https://vitest.dev/) enhetstester i `tests/unit/`
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
| `pnpm typecheck`       | `tsc --noEmit` |
| `pnpm test:unit`       | Vitest-enhetstester (tests/unit/) |
| `npx playwright test`  | E2E-suiten — bygger og starter prod-server selv |

## Struktur

    src/app/          # App Router-sider (tjenester, markedsinnsikt, eiendommer, blogg, …)
    src/app/actions/  # Server actions (lead-funnel)
    src/components/   # UI + domenekomponenter
    src/content/      # MDX-innhold (blog, help, listings, legal, …)
    src/lib/          # E-post, Supabase, listings, utils
    supabase/         # Migrasjoner + CRM-dokumentasjon
    tests/            # Playwright-spesifikasjoner + tests/unit (Vitest)
    plans/            # Implementasjonsplaner (advisor-generert)

Se `CLAUDE.md` for agent-instruksjoner og `DESIGN.md` for designsystemet.
