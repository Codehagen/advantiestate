# Paid Campaigns Setup Guide
## Google Ads + Cross-Platform Retargeting

This document outlines the setup for paid advertising campaigns to drive leads for Advanti Estate.

---

## Campaign Structure

### Campaign 1: Verdivurdering (Valuation)

**Target Keywords:**
- verdivurdering næringseiendom
- verdivurdering næringseiendom nord-norge
- verdivurdering næringseiendom bodø
- pris verdivurdering næringseiendom
- verdsettelse næringseiendom
- næringsmegler verdivurdering

**Landing Page:** `/landing/verdivurdering`

**Ad Groups:**
1. **Branded:** "advanti verdivurdering", "advanti estate"
2. **Generic:** "verdivurdering næringseiendom", "verdsettelse"
3. **Location-based:** "verdivurdering bodø", "verdivurdering nord-norge"
4. **Price-based:** "pris verdivurdering", "hva koster verdivurdering"

**Ad Copy Examples:**

**Headline 1:** Uforpliktende Verdivurdering
**Headline 2:** Lokal Ekspertise i Nord-Norge
**Headline 3:** Svar innen 24 timer
**Description:** Få en profesjonell verdivurdering basert på lokal markedsinnsikt. Vi kombinerer solid fagkompetanse med dybdekunnskap om markedet i Nord-Norge.

---

### Campaign 2: Salg/Megling (Sales/Brokerage)

**Target Keywords:**
- salg næringseiendom
- selge næringseiendom nord-norge
- næringsmegler bodø
- megler næringseiendom
- salg næringseiendom bodø

**Landing Page:** `/tjenester/salg` (or create dedicated `/landing/salg`)

**Ad Groups:**
1. **Generic:** "salge næringseiendom", "næringsmegler"
2. **Location-based:** "salge næringseiendom bodø", "næringsmegler nord-norge"
3. **Service-based:** "megling næringseiendom", "salgsoppdrag"

**Ad Copy Examples:**

**Headline 1:** Salg av Næringseiendom
**Headline 2:** Best Mulig Pris i Nord-Norge
**Headline 3:** Lokal Markedsinnsikt
**Description:** Vi hjelper deg selge din næringseiendom til best mulig pris. Med lokal markedsinnsikt og erfaring sikrer vi deg optimalt resultat.

---

### Campaign 3: Markedsanalyse (Market Analysis)

**Target Keywords:**
- markedsanalyse næringseiendom
- markedsinnsikt næringseiendom nord-norge
- næringseiendomsmarkedet bodø
- yield næringseiendom nord-norge

**Landing Page:** `/markedsinnsikt` (or create dedicated `/landing/markedsanalyse`)

**Ad Groups:**
1. **Generic:** "markedsanalyse næringseiendom", "markedsinnsikt"
2. **Location-based:** "næringseiendomsmarkedet bodø", "markedsanalyse nord-norge"
3. **Data-based:** "yield næringseiendom", "leiemarked nord-norge"

**Ad Copy Examples:**

**Headline 1:** Markedsanalyse for Næringseiendom
**Headline 2:** Lokal Data og Innsikt
**Headline 3:** Strategisk Rådgivning
**Description:** Få innsikt i næringseiendomsmarkedet i Nord-Norge. Vi leverer data og analyse for å hjelpe deg ta informerte beslutninger.

---

## Landing Page Requirements

Each landing page should include:

1. **Clear headline** matching ad copy
2. **Value proposition** (3-4 bullet points)
3. **Process explanation** ("Hva skjer videre?")
4. **Social proof** (if available)
5. **Primary CTA** (ValuationCTAButton or ContactUsForm)
6. **Secondary CTA** (link to services)
7. **Trust signals** (local expertise, response time, etc.)

**Example structure:**
- Hero section with headline + CTA
- What's included / Benefits
- Process steps
- Why choose us
- Final CTA

---

## Retargeting Setup

### Pixel Installation

**Google Ads:**
1. Install Google Ads conversion tracking pixel on:
   - `/kontakt` (form submission)
   - `/landing/*` pages (page view)
   - Calculator pages (engagement)

**Meta (Facebook/Instagram):**
1. Install Meta Pixel on all landing pages
2. Track events:
   - PageView
   - Lead (form submission)
   - ViewContent (calculator usage)

**LinkedIn:**
1. Install LinkedIn Insight Tag
2. Track conversions on contact form submissions

### Retargeting Audiences

**Create audiences for:**
1. **Website visitors** (last 30 days)
2. **Landing page visitors** (last 7 days)
3. **Calculator users** (last 14 days)
4. **Form abandoners** (visited contact page but didn't submit)

### Retargeting Ad Copy

**Message:** "Hva skjer videre?"
**CTA:** "Få svar innen 24 timer"
**Visual:** Use process illustration or "Hva skjer videre?" block

**Example:**
- Headline: "Klar for en uforpliktende samtale?"
- Description: "Vi tar kontakt innen 24 timer. Uforpliktende og ryddig."
- CTA: "Ta kontakt nå"

---

## Budget Recommendations

### Initial Test Budget (First Month)

**Google Ads:**
- Verdivurdering: 5,000-10,000 kr/month
- Salg/Megling: 3,000-5,000 kr/month
- Markedsanalyse: 2,000-3,000 kr/month
- **Total:** 10,000-18,000 kr/month

**Retargeting:**
- Meta: 2,000-3,000 kr/month
- LinkedIn: 1,000-2,000 kr/month
- **Total:** 3,000-5,000 kr/month

**Grand Total:** 13,000-23,000 kr/month

### Scaling Budget (After Optimization)

Once campaigns are optimized and showing positive ROI:
- Increase budget by 20-30% per month
- Focus budget on best-performing campaigns
- Expand to additional keywords/locations

---

## Tracking & Measurement

### Key Metrics

**Primary:**
- Number of booked consultations per week
- Cost per lead (CPL)
- Cost per acquisition (CPA)
- Conversion rate (visits → leads)

**Secondary:**
- Click-through rate (CTR)
- Cost per click (CPC)
- Landing page conversion rate
- Retargeting frequency
- Email capture rate (for gated assets)

### Conversion Tracking

**Set up conversions for:**
1. Form submissions (`/kontakt`)
2. Modal opens (ValuationRequestModal)
3. Phone clicks
4. Email captures (checklist download)

### Reporting

**Weekly review:**
- Top performing keywords
- Best performing ad copy
- Landing page performance
- Retargeting effectiveness

**Monthly review:**
- Overall campaign performance
- ROI calculation
- Budget allocation optimization
- New keyword opportunities

---

## Implementation Checklist

- [ ] Set up Google Ads account
- [ ] Create 3 campaigns (Verdivurdering, Salg, Markedsanalyse)
- [ ] Set up landing pages for each campaign
- [ ] Install Google Ads conversion tracking
- [ ] Install Meta Pixel
- [ ] Install LinkedIn Insight Tag
- [ ] Create retargeting audiences
- [ ] Set up retargeting campaigns
- [ ] Configure conversion tracking
- [ ] Test all tracking pixels
- [ ] Launch campaigns with test budget
- [ ] Monitor daily for first week
- [ ] Optimize based on performance data

---

## Best Practices

1. **Start small:** Test with lower budgets, then scale
2. **Focus on quality:** Better to have fewer, high-quality leads
3. **Local focus:** Emphasize Nord-Norge/Bodø in all copy
4. **Clear CTAs:** "Uforpliktende verdivurdering" is the primary offer
5. **Match intent:** Landing page should match ad copy exactly
6. **Test variations:** Test different headlines, descriptions, CTAs
7. **Monitor closely:** Check campaigns daily for first 2 weeks
8. **Optimize continuously:** Pause poor performers, scale winners

---

## Notes

- All landing pages should be mobile-optimized
- Use Norwegian (bokmål) for all ad copy
- Emphasize "lokal markedsinnsikt" and "Nord-Norge" throughout
- Primary CTA should always be "Uforpliktende verdivurdering" or "Ta kontakt"
- Response time promise: "Svar innen 24 timer"
