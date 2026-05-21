# Launch Audit – Advanti Estate

**Goal:** Lead generation (contact form, valuation requests). **Timeline:** ASAP.

## Audit checklist

### Homepage

| Item | Status | Notes |
|------|--------|------|
| Clear primary CTA above the fold | ⚠️ | Hero had "Våre tjenester" + "Kontakt oss"; lead-gen CTA not prominent |
| Lead-gen CTA repeats (hero, mid, bottom) | ⚠️ | CtaMiddle + Cta emphasize tjenester/newsletter; contact less emphasized |
| "Hva skjer videre?" reassurance near CTAs | ❌ | Present on /kontakt only; missing on homepage |
| Value prop + local trust (Nord-Norge) | ✅ | Hero + CtaMiddle mention Nord-Norge, local expertise |
| Cta bottom section | ⚠️ | Email capture → Discord; not contact form. "Ring oss direkte" link works |

### Contact flow

| Item | Status | Notes |
|------|--------|------|
| Form friction (required fields, clarity) | ✅ | Name, phone, email, service required; message optional |
| 24-hour promise in form + confirmation | ⚠️ | Page promises "innen 24 timer"; confirmation said "så snart som mulig" |
| Next steps "Hva skjer videre?" | ✅ | Present below form |
| Trust cues (local, uforpliktende) | ✅ | Lokal ekspertise, erfarne rådgivere, uforpliktende samtale |

### Navigation and layout

| Item | Status | Notes |
|------|--------|------|
| Desktop CTA "Ta kontakt" → /kontakt | ✅ | Navbar links correctly |
| Mobile CTA "Ta kontakt" → /kontakt | ❌ | Button had no href (fixed) |
| Sitewide launch/announcement banner | ❌ | Missing (added) |
| Structured data (Organization, RealEstateAgent) | ✅ | In place via StructuredData |

### Blog and content

| Item | Status | Notes |
|------|--------|------|
| Launch-focused announcement post | ❌ | Added |
| Internal links to /kontakt, /tjenester | ✅ | To be reinforced in launch post |

---

## Prioritized fixes (implemented)

1. **Mobile "Ta kontakt" not linking** – Navbar mobile CTA wrapped in `Link` to `/kontakt`.
2. **Contact form confirmation** – Updated to "Vi kontakter deg innen 24 timer for en uforpliktende avklaring."
3. **Top-of-site launch banner** – `LaunchBanner` component linking to `/kontakt`.
4. **Hero CTAs** – Primary: "Få uforpliktende verdivurdering" → `/kontakt`; secondary: "Våre tjenester" → `/tjenester`. Subhead tightened for lead-gen.
5. **Homepage "Hva skjer videre?"** – Compact block below hero CTAs.
6. **CtaMiddle** – "Kontakt oss" replaced with "Få uforpliktende verdivurdering" where appropriate.
7. **Launch blog post** – New MDX with CTA and internal links.
8. **Tracking** – GA4 + GTM; `data-track` on CTAs, `contact_submitted` on form success. See [TRACKING_PLAN.md](TRACKING_PLAN.md).

---

## Tracking

Canonical event list, GTM setup, and conversions: **[TRACKING_PLAN.md](TRACKING_PLAN.md)**.

**Weekly funnel:** visits → CTA clicks → form submits → qualified leads.

**Weekly reporting checklist:**
- [ ] Visits (sessions) to /, /kontakt, /tjenester, /blog
- [ ] CTA clicks (aggregate or by `data-track` value)
- [ ] Contact form submits
- [ ] Qualified leads (manual: form submissions that became opportunities)

---

## Post-launch

- [ ] Onboarding email sequence (if email capture used)
- [ ] Roundup email including launch announcement
- [ ] Comparison/differentiation pages if relevant
- [ ] Interactive demo (e.g. Navattic) optional
- [ ] Plan next launch moment (feature, market update)
