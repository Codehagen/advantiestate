# /public/downloads — Gated lead-magnet assets

This folder serves PDFs/files referenced by the email-gated download pages
(currently: /markedsrapport).

## Active downloads

| File | Referenced by | Owner | Refresh cadence |
|---|---|---|---|
| `markedsrapport-q4-2025.pdf` | `src/app/markedsrapport/page.tsx` | Christer | Quarterly |

## Adding a new quarterly markedsrapport

1. Drop the PDF here, e.g. `markedsrapport-q1-2026.pdf`.
2. Update three constants in `src/app/markedsrapport/page.tsx`:
   - `RAPPORT_FILE` → new file path
   - `RAPPORT_LABEL` → display label ("Markedsrapport Q1 2026")
   - `metadata.title`, `metadata.description`, hero `eyebrow`, `metaRow`
3. Refresh the `INSIDE` array if the table of contents changed.
4. Commit. The page auto-serves the latest issue from then on.

## Design notes

The PDFs should match the OG card editorial dark palette: warm-grey
(#2c2825) text on warm-white (#f3f1ef) background with light-blue
(#cbeef2) accent dot. Newsreader for the headline, Inter for the body.
Keep them ~12-20 pages — long enough to feel substantial, short enough to
read on a train.
