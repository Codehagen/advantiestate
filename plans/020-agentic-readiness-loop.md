# Plan 020: Agent-readiness-loop mot is-agentic.com (scan → fiks → deploy → rescan)

> **Executor instructions**: Følg planen steg for steg. Kjør hver
> verifikasjonskommando og bekreft forventet resultat før du går videre. Ved
> noe i "STOP-betingelser", stopp og rapporter — ikke improviser. Oppdater
> statusraden i `plans/README.md` når du er ferdig.
>
> **Drift-sjekk (kjør først)**:
> `npx -y is-agentic@latest www.advantiestate.no --json | head -30`
> Hvis `score` ≠ 83 eller issue-lista under ikke stemmer, er baseline utdatert
> (eller metodikken endret). Skriv ny baseline til
> `scratchpad/agentic/latest.json` og rekalkuler prioritet før du fortsetter.

## Status

- **Priority**: P2 (høy ROI, lav risiko — men ikke inntektskritisk i seg selv)
- **Effort**: M (Fase 0–1: S. Fase 2: M. Fase 3: L, valgfri.)
- **Risk**: LOW→MEDIUM (Fase 2 rører middleware + cache-headere på hele sitet)
- **Depends on**: ingen
- **Category**: AI-/agent-SEO, infrastruktur
- **Planned at**: `480782c`, 2026-08-23

---

## Hva is-agentic.com faktisk er

Tjenesten scorer «the public parts of a website that AI agents can discover,
retrieve, understand, and use» — altså AI-agent-lesbarhet, ikke klassisk SEO.

- **80 poeng** i essential-pool (7 sjekker for oss), **20 poeng** i
  recommended-pool (9 sjekker), **+5 maks** i bonus for emerging signals.
- Delvis resultat gir proporsjonal kreditt. Ikke-relevante sjekker teller ikke.
- Gratis, ingen auth, ingen betalte planer.

### Tre programmatiske innganger (alle brukt i loopen)

| Grensesnitt | Kommando/URL | Rolle i loopen |
|---|---|---|
| CLI | `npx -y is-agentic@latest <domene> --json` | **Starter ny scan** og returnerer fersk rapport. Eneste vei til fersk data. |
| Report API | `GET https://is-agentic.com/api/v1/report?url=<urlencoded>` | Billig polling av *lagret* rapport. 404 hvis ingen scan finnes. Rate limit 120 req/IP/60s, RFC 9457-feil. |
| **MCP** | `https://is-agentic.com/mcp` (HTTP, ingen OAuth/API-key) | Tre read-only verktøy: `is_agentic_get_report`, `is_agentic_get_methodology`, `is_agentic_get_developer_docs`. Brukes til å hente *metodikk-tekst* inn i konteksten når vi skal fikse en sjekk — så vi fikser mot kriteriet, ikke mot gjetning. |

**Viktig asymmetri**: MCP-en kan bare *lese* lagrede rapporter. Den kan ikke
starte en scan. Derfor: CLI for å scanne, MCP for kontekst.

---

## Baseline (målt 2026-08-23T10:23Z, prod `www.advantiestate.no`)

```
score: 83 / 100   "Ready with a few material gaps"
eligible_checks: 16
essential:    62.9 / 80   (5 av 7 består)
recommended:  17.8 / 20   (7 av 9 består)
bonus:        +2.1        (10 positive signaler)
```

Fire åpne funn:

| # | id | Tier | Resultat | Tapte poeng (est.) | Hva som mangler |
|---|---|---|---|---|---|
| 1 | `markdown-negotiation-vary` | essential | **failed** | **≈11,4** | `Accept: text/markdown` gir `text/html`. `Vary` mangler `Accept` (har bare RSC-verdiene fra Next). |
| 2 | `agent-friendly-404` | essential | partial | ≈5,7 | Ekte 404-status er OK, men body mangler kort markdown med veier videre (sitemap/llms.txt). |
| 3 | `org-schema-completeness` | recommended | partial | ≈1,1 | Organization-JSON-LD mangler `contactPoint`. |
| 4 | `trust-anchors` | recommended | partial | ≈1,1 | Kun `/privacy` verifisert — scanneren finner ikke `/about` og `/contact` (våre heter `/om-oss` og `/kontakt`). |

**Poengregnskap**: 80/7 ≈ 11,4 pr. essential-sjekk, 20/9 ≈ 2,2 pr.
recommended-sjekk. 62,9 + 11,4 + 5,7 = 80 ✓ og 17,8 + 1,1 + 1,1 = 20 ✓ —
altså: **fikser vi alle fire lander vi på ~100** (80 + 20 + 2,1 bonus, capped).

**Én sjekk (#1) er verdt mer enn de tre andre til sammen.** Prioriter deretter.

### Verifisert mot koden (ikke gjetning)

- `src/middleware.ts` finnes **ikke** → ingen content-negotiation i dag.
- `src/app/not-found.tsx` returnerer ekte 404, men ren TSX/HTML — ingen
  markdown-variant, ingen lenke til `/sitemap.xml` eller `/llms.txt`.
- `src/components/StructuredData.tsx` har `email`, `telephone` og
  `address: PostalAddress` på Organization — men **ingen `contactPoint`**
  (`grep -rn "contactPoint" src/` → 0 treff). Samsvarer med funn #3.
- `next.config.mjs` `redirects()` har host-kanonisering + noen legacy-slugger,
  men ingen `/about` eller `/contact`. Samsvarer med funn #4.
- `src/app/llms.txt/route.ts` finnes allerede (ISR, `revalidate = 600`) — den
  er sannsynligvis en av de 10 positive signalene, og blir *ankeret* som både
  404-body og markdown-varianter peker til.

---

## Loop-designet

To løkker med ulik frekvens, fordi is-agentic bare scanner **offentlige URL-er**
— en fiks teller ikke før den er deployet.

```
  YTRE LOOP (per deploy / ukentlig)          INDRE LOOP (sekunder, lokalt)
  ┌──────────────────────────────┐           ┌───────────────────────────┐
  │ npx is-agentic --json (prod) │           │ pnpm build && pnpm start  │
  │        ↓                     │           │        ↓                  │
  │ diff mot latest.json         │           │ scripts/agentic/check-    │
  │        ↓                     │  ──────►  │ local.mjs (curl-assert)   │
  │ velg tyngste åpne funn       │           │        ↓                  │
  │        ↓                     │           │ grønt? → PR               │
  │ MCP: get_methodology         │           └───────────────────────────┘
  │        ↓                     │                      │
  │ implementer + PR + merge     │◄─────────────────────┘
  │        ↓                     │
  │ deploy → rescan → logg delta │
  └──────────────────────────────┘
```

**Hvorfor indre loop**: uten den blir hver iterasjon en full deploy-syklus. Vi
reimplementerer de 3–4 sjekkene vi jobber med som curl-assertions mot
`localhost:3000`, så vi itererer på sekunder og bruker is-agentic kun som
fasit-verifikasjon etter deploy.

**Alternativ vurdert og forkastet**: scanne Vercel preview-URL-en for PR-en.
Elegant, men preview-deploys kan være beskyttet (deployment protection), og
Vercel-MCP-en er ikke autorisert i denne sesjonen. Legg det inn som en senere
opsjon hvis previews bekreftes offentlige.

### MCP-oppsett

Legg til i `.mcp.json` (ved siden av eksisterende `supabase`):

```json
{
  "mcpServers": {
    "supabase": { "type": "http", "url": "https://mcp.supabase.com/mcp?project_ref=kukzjreikqbgbolxvqaj" },
    "is-agentic": { "type": "http", "url": "https://is-agentic.com/mcp" }
  }
}
```

Ingen auth. Verktøyene brukes slik:
- `is_agentic_get_methodology` — kalles **før** hver fiks, så vi implementerer
  mot det faktiske kriteriet i stedet for å tolke `recommendation`-strengen.
- `is_agentic_get_report` — billig sjekk «har scanneren registrert deployen?»
  mellom CLI-kall (unngår å brenne scan-kapasitet).
- `is_agentic_get_developer_docs` — slå opp feilkoder/rate-limit-semantikk.

### Skriptene som skal bygges (Fase 0)

**`scripts/agentic/scan.mjs`**
```
node scripts/agentic/scan.mjs [--url https://www.advantiestate.no] [--fail-on-regression]
```
- Kjører CLI-en, skriver `scratchpad/agentic/report-<ISO>.json`
- Diff mot `scratchpad/agentic/latest.json`: score-delta, nye funn, lukkede funn
- Skriver menneskelesbar linje til `docs/agentic-log.md`
- Exit 1 hvis score falt eller et lukket funn kom tilbake

**`scripts/agentic/check-local.mjs`**
- Assertions mot `BASE_URL` (default `http://localhost:3000`):
  - `Accept: text/markdown` på `/`, `/tjenester/salg`, en blogg-URL → `content-type: text/markdown` **og** `Vary` inneholder `Accept`
  - `/finnes-ikke-xyz` → status 404, og med `Accept: text/markdown` en body som inneholder `/llms.txt` og `/sitemap.xml`
  - `/about` og `/contact` → 301 → 200 med ≥500 tegn
  - Organization-JSON-LD på `/` inneholder `contactPoint`
- Kjøres i CI og som pre-PR-gate

### Loop-mekanikk (skill: `.claude/skills/agentic-loop/SKILL.md`)

Per iterasjon:
1. `node scripts/agentic/scan.mjs`
2. Ingen åpne funn og score ≥ mål → **noop**, lang pause (drift-vakt)
3. Ellers: velg tyngste åpne funn (essential før recommended, `failed` før `partial`)
4. `is_agentic_get_methodology` for den sjekken
5. Branch fra fersk `main` (se minnenotat: verifiser HEAD før `git checkout -b`)
6. Implementer → `node scripts/agentic/check-local.mjs` → `pnpm build` → PR
7. Etter merge + deploy: rescan, logg delta i `docs/agentic-log.md`

**Kadens**: kjør på forespørsel etter hver deploy, pluss én planlagt kjøring i
uka som drift-vakt (metodikken kan endres under føttene på oss, og
`markdown-negotiation` kan regressere hvis noen rører middleware).
Bruk `/schedule` for den ukentlige, `/loop` for aktive fiksesesjoner.

**Guardrails** (viktigere enn poengsummen):
- **Ikke** sett `Vary: Accept` globalt — det splitter CDN-cachen i to varianter
  for hver URL og kan koste mer i TTFB enn de 11 poengene er verdt. Scope det
  til rutene som faktisk forhandler.
- Ingen syntetiske data i markdown-variantene (jf. synthetic-series-forbudet).
- Norsk copy, semantiske klasser fra `advanti-design.css` — `DESIGN.md` gjelder.
- `content-collections`-typene finnes bare etter `next build` — kjør full
  `pnpm build`, ikke frittstående `tsc`.
- Maks 3 iterasjoner på ett funn; deretter eskaler til eier i stedet for å
  fortsette å prøve.

---

## Faser

### Fase 0 — Instrumentering (S, ingen produktendring)
1. `is-agentic` inn i `.mcp.json`
2. `scripts/agentic/scan.mjs` + `check-local.mjs`
3. Commit baseline-rapporten (83) til `docs/agentic-log.md`
4. `.claude/skills/agentic-loop/SKILL.md` med loop-mekanikken over

**Verifikasjon**: `node scripts/agentic/scan.mjs` skriver rapport og rapporterer
`score 83, 4 open` uten diff.

### Fase 1 — Quick wins (S, ~1 time, 83 → ~85)
5. **`contactPoint`** i Organization-JSON-LD (`StructuredData.tsx`) — bruk
   `contact.phone`/`contact.email` som allerede ligger i `siteConfig.ts`,
   `contactType: "customer service"`, `availableLanguage: ["no", "en"]`.
6. **Trust anchors**: `/about` → `/om-oss` og `/contact` → `/kontakt` som
   permanente redirects i `next.config.mjs`.
   *Usikkerhet*: uklart om scanneren gir full kreditt for en 301 eller krever
   200 på selve `/about`. Måles med rescan; hvis fortsatt `partial`, vurder
   engelske aliassider i stedet. Ikke gjett — la scannen avgjøre.
   Sjekk samtidig at `/om-oss` og `/kontakt` har ≥500 tegn reell tekst.

**Verifikasjon**: deploy → rescan → begge funn borte fra `issues`.

### Fase 2 — Markdown-forhandling + agent-404 (M, hovedgevinsten, ~85 → ~100)

Dette er den ene endringen som er verdt jobben. Foreslått arkitektur:

7. **`src/middleware.ts`**: hvis `Accept` inneholder `text/markdown` (og ikke
   `text/html` med høyere q), rewrite til `/api/md/[...path]`. Sett
   `Vary: Accept` på svaret — kun på de forhandlede rutene.
8. **`src/app/api/md/[...path]/route.ts`**:
   - Content-collections-ruter (blog, help, legal, kunder, personer,
     naringsmegler) → server rå MDX-body. Vi *har* allerede kilden; dette er
     billig.
   - Kuraterte app-ruter (forside, `/tjenester/*`, `/verktoy/*`) → kort,
     håndskrevet markdown-sammendrag. Gjenbruk beskrivelsene som allerede
     ligger i `llms.txt/route.ts` — én kilde, to formater.
   - Ukjent sti → **404 + markdown-body** med lenker til `/llms.txt`,
     `/sitemap.xml` og `/kontakt`. Dette lukker funn #2 i samme slag.
9. Støtt også `.md`-suffiks (`/tjenester/salg.md`) — vanlig agent-konvensjon,
   gratis når ruten først finnes.
10. Oppdater `not-found.tsx` med synlige lenker til sitemap/llms.txt (hjelper
    HTML-varianten av samme sjekk).

**Verifikasjon**:
```
curl -sI -H "Accept: text/markdown" https://www.advantiestate.no/tjenester/salg | grep -i "content-type\|vary"
curl -s -o /dev/null -w "%{http_code}" https://www.advantiestate.no/finnes-ikke-xyz   # → 404
```
Deretter rescan. Forventet: essential 80/80.

**STOP-betingelser for Fase 2**:
- Hvis `Vary: Accept` må settes på alle ruter for å bestå → stopp og rapporter.
  Cache-kostnaden må veies mot poengene av eier.
- Hvis middleware bryter RSC-prefetch (`next-router-prefetch`-headerne i
  eksisterende `Vary`) → stopp. Navigasjonsytelsen er viktigere.

### Fase 3 — Bonus-signaler (L, valgfri, +opptil 5)
11. **`/.well-known/llms.txt`** i tillegg til `/llms.txt` (rapporten refererer
    eksplisitt til `.well-known/`-plasseringen).
12. **RFC 9727 API-katalog** på `/.well-known/api-catalog`.
13. **Advanti MCP-server** på `/mcp` — dette er den eneste posten i planen med
    reell forretningsverdi utover scoren: eksponer markedstall, ledige lokaler
    og yield-benchmarks som verktøy en agent kan kalle. Merk at
    proofStats-gaten og whitelist-regelen for `cityMarketData` gjelder også her
    — kun verifiserte tall ut.

Fase 3 er *ikke* nødvendig for ~100. Ta den bare hvis MCP-serveren skal bygges
uansett.

### Fase 4 — Automatisering
14. `check-local.mjs` inn i CI (blokkerer regresjon på markdown-forhandling)
15. Ukentlig `/schedule`-kjøring av `scan.mjs --fail-on-regression`

---

## STOP-betingelser (hele planen)

- Score **faller** etter en fiks → revert, ikke stable på flere fikser.
- Metodikken endres slik at `eligible_checks` ≠ 16 → ny baseline, ny prioritet,
  rapporter til eier før du fortsetter.
- En fiks krever at norsk URL-struktur eller `DESIGN.md`-konvensjoner brytes →
  stopp. Vi optimaliserer ikke en tredjeparts score på bekostning av produktet.

## Forventet resultat

| Etter | Score | Innsats |
|---|---|---|
| Baseline | 83 | — |
| Fase 1 | ~85 | ~1 time |
| Fase 2 | ~100 | ~4–6 timer |
| Fase 3 | 100 (bonus capped) | dager |
