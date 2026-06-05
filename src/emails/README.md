# Advanti email templates

Three React Email templates, editorial-dark to match the OG cards
(`Newsreader` serif headlines, `Inter` caps eyebrows, light-blue accent dot).
Rendered server-side via `@react-email/render` and sent through Resend.

## Files

| File | Purpose | Trigger |
|---|---|---|
| `_components.tsx` | Shared primitives (EditorialEmail wrapper, H1, Eyebrow, Lede, P, CTA) | — |
| `WelcomeEmail.tsx` | First touch | Automatic on signup via `src/lib/email/subscribe.ts` |
| `MarketBriefingEmail.tsx` | Drip #2 | Manual Broadcast, day +3 |
| `SoftPitchEmail.tsx` | Drip #3 | Manual Broadcast, day +14 |

## Dev preview

```
pnpm dev
open http://localhost:3000/api/email-preview/welcome
open http://localhost:3000/api/email-preview/market-briefing
open http://localhost:3000/api/email-preview/soft-pitch
```

Append `?firstName=Christer` to preview with a name token interpolated.

The preview route returns 404 in production — these templates are not for the
public surface, only for Resend's Broadcast composer.

## Sending the drip (manual cadence for now)

1. **Day 0** — Welcome fires automatically when someone signs up. No action.
2. **Day +3** — In Resend dashboard → Broadcasts → New Broadcast:
   - Audience: the Advanti audience
   - Filter: `created_at > now() - 4d AND created_at < now() - 2d`
     (subscribers in the 2-4 day window get this; tweak window per cadence)
   - HTML: paste the rendered output from
     `/api/email-preview/market-briefing` (right-click → View Source → copy)
   - Subject: `Hva vi ser i Nord-Norge akkurat nå`
   - Schedule or send immediately.
3. **Day +14** — Same flow, `soft-pitch` template. Subject: `Skal vi snakkes?`.

A cron-driven script + Resend's broadcasts API can automate this once the
list hits ~200 subscribers. For now, manual sends from the dashboard are
appropriate scale.

## Editing copy

Every template is a single `.tsx` file with the body as JSX. Edit the file,
re-preview in dev, push when ready. The shared `_components.tsx` controls
typography, colour, and layout — change the palette there if the brand
shifts.

## Editing the welcome email

`WelcomeEmail` is the only one that fires automatically. If you change copy
that subscribers expect (e.g. cadence promises), audit the subscribe success
copy in `src/components/site/NewsletterSection.tsx` too — they should agree.

## Adding a new template

1. Create `src/emails/NewTemplate.tsx` using the same shared primitives.
2. Register it in `src/app/api/email-preview/[template]/route.tsx` (one line
   in the `TEMPLATES` map).
3. If it's a drip slot, add to the cadence table above.
