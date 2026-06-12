# Plan 008: Scrub ekte transaksjonsfakta fra det offentlige repoet

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If any STOP condition occurs, stop and report — do not improvise.
>
> **Drift check (run first)**: `git diff --stat 6b16cb9..HEAD -- src/content/customers/naeringspark-helgeland.mdx src/content/_customers-drafts/README.md`
> If these files changed since `6b16cb9`, compare against the excerpts below
> before proceeding; on mismatch, STOP.

## Status

- **Priority**: P1 (HASTER — aktiv eksponering)
- **Effort**: S
- **Risk**: LOW (filendringer; git-historikk håndteres IKKE av denne planen)
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `6b16cb9`, 2026-06-12

## Why this matters

Repoet er **offentlig på GitHub**, og case-studien for «Næringspark på
Helgeland» er publisert ANONYMISERT etter avtale med partene («Partene er
anonymisert etter avtale» står på siden). Men kildefilen inneholder en
JSX-kommentar med de ekte faktaene — partsnavn, eksakt kjøpesum, matrikkel
og meglernavn — og en intern README nevner samme parter og sum. Den
rendrede siten lekker ingenting (verifisert i HTML, RSC-payload og
llms.txt), men hvem som helst som åpner GitHub-repoet kan av-anonymisere
casen. Denne planen fjerner faktaene fra HEAD. (Git-HISTORIKKEN har også
faktaene — det er en separat beslutning for eieren, se STOP/Maintenance.)

## Current state

- `src/content/customers/naeringspark-helgeland.mdx:17-24` — JSX-kommentar
  som begynner med «Interne fakta (publiseres ikke):» etterfulgt av
  eiendommens adresse/matrikkel, begge parters selskapsnavn, eksakt
  kjøpesum og meglernavn. (Faktaene siteres bevisst IKKE i denne planen —
  planfilen ligger i samme offentlige repo. Kilde: Advanti-CRM,
  case-id local-21fa55155b40.)

- `src/content/_customers-drafts/README.md` — statustabellen og teksten
  nevner selgerselskapet ved navn og den eksakte summen, og
  workflow-teksten er utdatert (sier case 3 «ikke opprettet» — den er
  publisert; sier «Når case 3 er valgt … byttes forsidekortene» — det er
  gjort).
- Konvensjon: Norwegian copy, MDX-kommentarer brukes til redaksjonelle
  notater. Den parallelle filen `morkvedbadet-bodo.mdx` har en kommentar
  med kun offentlige Kartverket-fakta om et navngitt bygg — den er OK og
  skal IKKE røres.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build | `pnpm build` | exit 0, 3 kunder-sider generert |
| Leak-grep | `grep -rn "Nordvik\|Brygfjeld\|37,5\|Strandgata\|gnr. 149\|Bjerka" src/ plans/ --include="*.mdx" --include="*.md" --include="*.tsx"` | 0 treff etter fiks |

## Scope

**In scope** (eneste filer du endrer):
- `src/content/customers/naeringspark-helgeland.mdx` (kun kommentarblokken)
- `src/content/_customers-drafts/README.md`

**Out of scope**:
- Git-historikk (ingen rebase/filter-repo/force-push — eierens beslutning)
- `morkvedbadet-bodo.mdx` og `reforhandling-kontor-bodo.mdx` — kommentarene
  der er hhv. offentlige fakta og fiktive; la stå
- Den publiserte brødteksten/frontmatter i helgeland-filen — anonymiseringen
  der er korrekt allerede

## Git workflow

- Branch: `advisor/006-scrub-public-facts`
- Commit: `fix(content): scrub interne transaksjonsfakta fra kildekommentarer — repoet er offentlig`
- IKKE push.

## Steps

### Step 1: Erstatt kommentarblokken i helgeland-MDX-en

Bytt HELE `{/* ... */}`-blokken (linje 17–24) med:

```
{/*
  Interne fakta (parter, eksakt sum, matrikkel) lagres bevisst IKKE her —
  repoet er offentlig. Kilde: Advanti-CRM, case-id local-21fa55155b40.
  Redaksjonelt (avklart 2026-06-12): geografi «Helgeland», parter
  «lokal industriaktør» / «regionalt eiendomskonsern», sum som intervall,
  år 2025.
*/}
```

**Verify**: leak-grep-kommandoen over → 0 treff i denne filen.

### Step 2: Skriv om drafts-README-en

Oppdater `src/content/_customers-drafts/README.md`:
- Statustabellen: alle tre caser «PUBLISERT → src/content/customers/…»;
  eneste gjenstående punkt for Mørkvedbadet er «bytte stockfoto til ekte
  foto». Omtal helgeland-casen KUN som «Næringspark Helgeland (anonymisert)»
  — ingen stedsnavn på lavere nivå, ingen parter, ingen sum.
- Fjern avsnittet om at forsidekort skal byttes «når case 3 er valgt»
  (gjort). Behold publiseringsflyten (punktene 1–5) som mal for FREMTIDIGE
  caser, og legg til en ny regel som punkt 0: **«Interne fakta (parter,
  summer, matrikkel) skal aldri inn i dette repoet — heller ikke i
  kommentarer eller utkast. Repoet er offentlig. Referer til CRM-case-id.»**

**Verify**: leak-grep → 0 treff totalt; `grep -c "ikke opprettet" src/content/_customers-drafts/README.md` → 0.

### Step 3: Bygg

**Verify**: `pnpm build` → exit 0; `ls .next/server/app/kunder/*.html | wc -l` → 3.

### Step 4: Commit

Commit per git workflow. **Verify**: `git status --porcelain` → tom.

## Done criteria

- [ ] Leak-grep over src/ og plans/ → 0 treff
- [ ] README har regel-punkt 0 om interne fakta
- [ ] `pnpm build` exit 0 med 3 kunder-sider
- [ ] Kun de to in-scope-filene endret (`git diff --stat`)

## STOP conditions

- Du finner de samme faktaene i ANDRE filer i repoet enn de to in-scope
  (da er omfanget større — rapporter funnstedene i stedet for å fikse).
- Noen ber deg rydde git-historikken — det er utenfor planen.

## Maintenance notes

- **Eieren må beslutte historikk-håndtering**: faktaene ligger i commits
  `8413482`/`def94f6` (slettet utkastfil) og i blame for HEAD~-versjoner.
  Alternativer: (a) aksepter (transaksjonen er uansett offentlig i
  grunnboken; skaden er case↔identitet-koblingen), (b) `git filter-repo`
  + force-push (omskriver public main), (c) gjør repoet privat.
- Fremtidige caser: følg README-regel 0 — fakta hører hjemme i CRM.
