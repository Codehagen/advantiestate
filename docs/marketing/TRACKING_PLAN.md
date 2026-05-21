# Advanti Estate – Tracking Plan

## Overview

- **Tools:** GA4, GTM. Events are pushed to `dataLayer` from the app; GTM forwards to GA4.
- **Config:** Set `NEXT_PUBLIC_GTM_ID` in `.env.local` (and in Vercel/hosting). Example: `NEXT_PUBLIC_GTM_ID=GTM-XXXXXX`.
- **Last updated:** 2025-01-26
- **Owner:** Advanti

## Events

| Event | Description | Properties | Trigger |
|-------|-------------|------------|---------|
| `cta_clicked` | User clicks an element with `[data-track]` | `cta_id` (from `data-track`), `page_path`, `link_url` (when available) | Click on tracked CTA |
| `contact_submitted` | Contact form successfully submitted | `form_name`, `form_location` | Success handler after submit |

Naming: lowercase with underscores. No PII in properties.

## Conversions

| Conversion | Event | Counting | Notes |
|------------|-------|----------|-------|
| Contact form | `contact_submitted` | Every time | Primary lead-gen conversion. Mark as conversion in GA4 Admin. |
| CTA clicks | `cta_clicked` | Every time | Optional: mark key CTAs (e.g. hero, navbar) for segments. |

## UTM

Campaign tracking uses standard UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, etc.). GA4 captures them via GTM; no app changes required.

## GTM setup

1. **GA4 Configuration** tag with your measurement ID.
2. **Trigger – CTA:** Custom event, Event name = `cta_clicked`.
3. **Trigger – Contact:** Custom event, Event name = `contact_submitted`.
4. **GA4 Event** tags for both, wiring the listed properties as GA4 event parameters.

## Validation

- **GTM Preview:** Click tracked CTAs and submit contact form; confirm `cta_clicked` and `contact_submitted` in dataLayer and that GA4 events fire.
- **GA4 DebugView:** Use `?debug_mode=true` (or your GA4 debug flow) to verify events and parameters.
