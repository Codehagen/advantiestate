# OG Image Testing Guide

Test your Open Graph images using [OG Playground](https://og-playground.vercel.app/) before deploying to production.

## How to Test

1. Open https://og-playground.vercel.app/
2. Copy the entire content of any test file from this directory
3. Paste it into the playground editor
4. Modify the test parameters at the top of the file
5. See the live preview instantly

## Available Test Files

### 1. Blog Post OG (`blog-og-test.tsx`)
Test blog article OG images with different categories.

**Parameters:**
- `title`: Article title
- `author`: Author name
- `category`: `company`, `valuation`, `market-analysis`, `casestudies`
- `date`: Publication date (YYYY-MM-DD)
- `summary`: Article summary

**Example URL when deployed:**
```
/api/og/blog?title=Article%20Title&author=Christer%20Hagen&category=valuation&date=2025-01-15&summary=Summary%20text
```

---

### 2. Customer Case Study OG (`customer-og-test.tsx`)
Test customer success story OG images.

**Parameters:**
- `title`: Case study title
- `company`: Customer company name
- `location`: Location (e.g., "Bodø, Nordland")
- `industry`: Industry type (e.g., "Kontorlokaler")
- `result`: Key result or impact statement

**Example URL when deployed:**
```
/api/og/customer?title=Case%20Title&company=Company%20Name&location=Bodø&industry=Kontorlokaler&result=Result%20text
```

---

### 3. Service Pages OG (`service-og-test.tsx`)
Test service page OG images with different service types.

**Parameters:**
- `title`: Service name
- `description`: Service description
- `icon`: Emoji icon (🏢 💼 📊 🔑 📈 💰)
- `type`: `salg`, `verdsettelse`, `leietakere`, `transaksjoner`, `regnskap`, `general`

**Example URL when deployed:**
```
/api/og/service?title=Verdivurdering&description=Description&icon=📊&type=verdsettelse
```

---

### 4. Integration/Data Source OG (`integration-og-test.tsx`)
Test integration provider OG images.

**Parameters:**
- `title`: Integration name
- `description`: Integration description
- `provider`: Provider name (e.g., "Ambita")
- `category`: `finansiering`, `marked`, `eiendom`, `regnskap`, `general`

**Example URL when deployed:**
```
/api/og/integration?title=Integration%20Name&description=Description&provider=Ambita&category=eiendom
```

---

### 5. Contact/Team Member OG (`contact-og-test.tsx`)
Test team member profile OG images.

**Parameters:**
- `name`: Person's full name
- `role`: Job title/role
- `email`: Email address
- `phone`: Phone number
- `location`: Location

**Example URL when deployed:**
```
/api/og/contact?name=Christer%20Hagen&role=Daglig%20leder&email=christer@advanti.no&phone=+47%20123%2045%20678&location=Bodø
```

---

### 6. Help/Knowledge Base OG (`help-og-test.tsx`)
Test help article OG images with category colors.

**Parameters:**
- `title`: Article title
- `summary`: Article summary
- `category`: `overview`, `getting-started`, `terms`, `analysis`, `valuation`

**Example URL when deployed:**
```
/api/og/help?title=Article%20Title&summary=Summary%20text&category=valuation
```

---

## Design Features

All OG images include:
- **1200x630px** size (optimal for social sharing)
- **Advanti branding** (logo, color scheme)
- **Consistent grid pattern** background
- **Warm-grey** (#2c2825) base color
- **Light-blue** (#cbeef2) accent color
- **Norwegian language** support
- **Automatic text truncation** to prevent overflow
- **Category-specific colors** for visual distinction

## Color Schemes

### Blog Categories
- **Selskap** (company): Light blue (#cbeef2)
- **Verdivurdering** (valuation): Soft cyan (#a8dadc)
- **Markedsanalyse** (market-analysis): Cream (#f1faee)
- **Casestudier** (casestudies): Gold (#e9c46a)

### Service Types
- **Salg**: Gold (#e9c46a)
- **Verdsettelse**: Soft cyan (#a8dadc)
- **Leietakere**: Light blue (#cbeef2)
- **Transaksjoner**: Cream (#f1faee)
- **Regnskap**: Sky blue (#8ecae6)

### Help Categories
- **Oversikt**: Light blue (#cbeef2)
- **Kom i gang**: Soft cyan (#a8dadc)
- **Begreper**: Cream (#f1faee)
- **Analyse**: Sky blue (#8ecae6)
- **Verdivurdering**: Gold (#e9c46a)

## Testing Workflow

1. **Test visually** in OG Playground
2. **Adjust parameters** to test edge cases (long titles, missing data, etc.)
3. **Try different categories** to see color variations
4. **Verify text truncation** works properly
5. **Check emoji rendering** if using icons
6. **Approve design** before deploying
7. **Deploy to production** when satisfied

## Next Steps

Once you've tested and approved a design:
1. The API routes are already created in `/src/app/api/og/`
2. Update page metadata to use the new dynamic OG routes
3. Test in production with real data
4. Validate with social media debuggers:
   - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## Tips for Great OG Images

- Keep titles under 60 characters for best display
- Keep summaries under 140 characters
- Use descriptive, action-oriented text
- Test with real content examples
- Verify on multiple social platforms
- Check mobile preview sizes
- Ensure text contrast is readable
