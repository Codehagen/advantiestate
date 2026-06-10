# AI Citation Baseline — Advanti

Monthly tracking log for how often Advanti is cited / surfaced by AI engines for
the priority commercial real estate queries in Nord-Norge.

## Why this exists

Per the AI SEO skill: "You can't improve what you don't measure. Check AI
visibility monthly at minimum." 2026 research (see TODOS.md TODO 16) shows
citation lift from infrastructure work — robots.txt AI-bot allow, `llms.txt`,
freshness signals, schema markup — only proves out with a measured baseline.

This file IS the baseline. DIY for one month at $0; upgrade to **Otterly** ($29/mo)
or **ZipTie** ($69/mo) only if the manual cadence proves unsustainable.

## How to run a monthly check

Once a month (target: first Monday of the month, ~30 min):

1. Open a fresh incognito / signed-out browser window for each platform.
2. Run every query from the **Priority queries** table below on each platform.
3. For each (query, platform) cell, record:
   - **Cited?** — yes / no — did our brand appear in the AI's answer or in the
     citation footnotes?
   - **Source** — which Advanti URL was cited (or which competitor was cited
     instead)?
   - **Sentiment** — positive / neutral / negative — how was Advanti described?
   - **Notes** — anything surprising (e.g. AI got our service area wrong,
     misattributed something to a competitor, surfaced a stale post).
4. Append a new month section under **Monthly runs** with the table filled in.
5. After 3 months: diff the trend. Are we gaining citations on queries where
   we previously weren't? Are competitors gaining where we are?

If after 1-2 monthly runs the cadence feels heavy, switch to Otterly (cheapest
useful tool at $29/mo for 100 prompts).

## Platforms to test

| Platform | Where | Notes |
|---|---|---|
| **ChatGPT** | chat.openai.com (signed-out preferred) | Use the default model; check both the answer body AND any "Sources" / citation links |
| **Perplexity** | perplexity.ai (signed-out preferred) | Always cites footnotes — easy to spot Advanti links |
| **Google AI Overviews** | google.no with the query | Only counts if an AI Overview actually shows for the query (it doesn't for all queries) |
| **Claude** | claude.ai (web) | When web-search is active; otherwise skip |

Bingbot / Copilot is optional — add if it becomes a relevant traffic source.

## Priority queries

Targeted at our core service-area + service-type combinations. Mix of:
- Brand queries (do AI engines know who Advanti is?)
- Category queries (do they recommend us when asked about næringsmegler X?)
- Comparison queries (do we appear in vs. competitor cases?)
- How-to queries (do our help articles get cited?)

| # | Query | Intent |
|---|---|---|
| 1 | næringsmegler Bodø | category, primary market |
| 2 | næringsmegler Tromsø | category, secondary market |
| 3 | næringsmegler Nord-Norge | category, regional |
| 4 | verdivurdering næringseiendom Nord-Norge | service + region |
| 5 | DCF analyse næringseiendom | how-to, high HowTo-pilot relevance |
| 6 | salg av næringseiendom Bodø | service + market |
| 7 | utleie kontorlokaler Bodø | service + market |
| 8 | yield næringseiendom Nord-Norge | terminology, drives help-article traffic |
| 9 | Advanti Estate | brand, baseline visibility |
| 10 | beste næringsmegler Nordland | best-of, listicle query |
| 11 | hvordan selge næringseiendom | how-to |
| 12 | hva er yield næringseiendom | how-to + terminology |
| 13 | leiekontrakt næringseiendom | service-adjacent |
| 14 | transaksjon næringseiendom Nord-Norge | service + region |
| 15 | næringseiendom Lofoten | regional market |
| 16 | næringsmegler Alta | category, market |
| 17 | næringsmegler Narvik | category, market |
| 18 | sensitivitetsanalyse eiendom | how-to + terminology |
| 19 | strategisk rådgivning næringseiendom | service |
| 20 | Advanti vs Newsec Nord-Norge | comparison (replace Newsec with actual local competitor) |
| 21 | prime yield Tromsø | presserom-data — måler om /presserom siteres som kilde |
| 22 | prime yield Bodø næringseiendom | presserom-data |
| 23 | kontorledighet Bodø | presserom-data |
| 24 | markedsleie kontor Tromsø | presserom-data |
| 25 | transaksjonsvolum næringseiendom Nord-Norge 2025 | presserom-data, tallfestet |

> Query 21-25 lagt til 2026-06-10 da presserommet (markedstall + Dataset-schema
> + CSV) gikk live — disse måler effekten av presserom-/entitetsarbeidet
> (docs/designs/presserom-presskit-entitet.md, «Måling»). Forventet bevegelse
> tidligst etter 1-2 måneder med crawling.

## Monthly runs

### YYYY-MM (template — copy this block each month)

Run date: YYYY-MM-DD
Tester: <name>
Time spent: <min>

| Query | ChatGPT | Perplexity | Google AI Overview | Claude |
|---|---|---|---|---|
| næringsmegler Bodø | cited? src? sentiment? | | | |
| næringsmegler Tromsø | | | | |
| næringsmegler Nord-Norge | | | | |
| verdivurdering næringseiendom Nord-Norge | | | | |
| DCF analyse næringseiendom | | | | |
| salg av næringseiendom Bodø | | | | |
| utleie kontorlokaler Bodø | | | | |
| yield næringseiendom Nord-Norge | | | | |
| Advanti Estate | | | | |
| beste næringsmegler Nordland | | | | |
| hvordan selge næringseiendom | | | | |
| hva er yield næringseiendom | | | | |
| leiekontrakt næringseiendom | | | | |
| transaksjon næringseiendom Nord-Norge | | | | |
| næringseiendom Lofoten | | | | |
| næringsmegler Alta | | | | |
| næringsmegler Narvik | | | | |
| sensitivitetsanalyse eiendom | | | | |
| strategisk rådgivning næringseiendom | | | | |
| Advanti vs <competitor> | | | | |

#### Summary

- **Citation rate**: X / 80 cells = X % (cells where Advanti was cited)
- **Competitors most frequently cited where we weren't**: list
- **Sources cited most often (which Advanti URLs work)**: list
- **Notes / surprises**: free text
- **MoM delta** (after month 2+): citation rate Δ, new wins, regressions

## What to do with the data

After 1-2 months you should be able to answer:

1. **Are we cited at all?** — if citation rate is sub-5 %, focus is on
   crawlability + presence (the work commits `2dfcfab`, `2a1c809` already did).
2. **Where are competitors winning?** — pages they have, that we don't. Drives
   content priorities.
3. **Is HowTo schema lifting how-to queries?** — compare DCF / sensitivitet
   citation rate before vs after the HowTo pilot landed (commit `<the next
   commit>`). If clear lift, expand HowTo to more articles.
4. **Is freshness moving the needle?** — when a blog post is refreshed (with
   `updatedAt`), does its citation rate improve in the next monthly run?

When any of these patterns becomes clear, log it as a learning and feed it back
into TODOS.md priorities.

## References

- AI SEO skill: monitoring section recommends Peec AI, Otterly, ZipTie, LLMrefs
  for paid tooling; flags monthly cadence as minimum.
- 2026 research: content under 3 months old is ~3× more likely to be cited;
  pages updated within 2 months earn +28 % citations.
- Tracked in TODOS.md as TODO 16.
