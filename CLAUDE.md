# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Advanti** - A commercial real estate platform for Northern Norway, specializing in property valuation, brokerage, market analysis, and transaction advisory. The platform provides sophisticated financial modeling (DCF analysis, yield calculations) and data-driven insights for commercial properties (næringseiendom).

**Tech Stack:**
- Next.js 15.3.2 (App Router) with TypeScript
- React 19.0.0
- Tailwind CSS with custom design system
- Content Collections for MDX content management
- Mapbox GL for property visualization
- pnpm package manager

## Development Commands

```bash
# Development
pnpm dev                  # Start development server
pnpm build                # Production build
pnpm start                # Start production server
pnpm lint                 # Run ESLint

# Content Collections (MDX)
# Content is automatically compiled during dev/build via @content-collections/next
```

**Important:** When using `npx prisma generate`, flag it with `--no-engine`

## Architecture

### Application Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (blog)/                   # Blog route group
│   ├── (help)/                   # Help center route group
│   ├── (integrasjoner)/          # Integrations route group
│   ├── tjenester/                # Services pages (salg, verdsettelse, etc.)
│   ├── markedsinnsikt/           # Market insights & analytics
│   ├── om-oss/                   # About page
│   ├── kontakt/                  # Contact page
│   ├── karriere/                 # Careers page
│   ├── kunder/                   # Customers page
│   ├── api/                      # API routes
│   ├── actions/                  # Server actions
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── siteConfig.ts             # Site-wide configuration
│   ├── sitemap.ts                # Dynamic sitemap generation
│   └── robots.ts                 # Robots.txt configuration
├── components/
│   ├── ui/                       # Base UI components (shadcn-style)
│   ├── propdock/                 # Domain-specific components
│   │   ├── eiendom/              # Property-related components (PropertyMap)
│   │   ├── exit-strategi/        # Exit strategy components
│   │   ├── finansiering/         # Financing components
│   │   ├── leietakere/           # Tenant components
│   │   ├── marked/               # Market analysis components
│   │   ├── regnskap/             # Accounting components
│   │   ├── simulering/           # Simulation components
│   │   ├── workflow/             # Workflow components
│   │   ├── DcfChart.tsx          # DCF analysis chart
│   │   ├── YieldLineChart.tsx    # Yield calculation charts
│   │   └── FeatureShowcase.tsx   # Feature display components
│   ├── markedsinnsikt/           # Market insight components
│   ├── blog/                     # Blog components
│   ├── forms/                    # Form components
│   └── data/                     # Data table components
├── content/                      # MDX content files
│   ├── blog/                     # Blog posts (categories: company, valuation, market-analysis, casestudies)
│   ├── help/                     # Help articles (categories: overview, getting-started, terms, analysis, valuation)
│   ├── changelog/                # Product changelog
│   ├── customers/                # Customer case studies
│   ├── integrations/             # Integration guides
│   └── legal/                    # Legal documents
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── chartUtils.ts             # Chart-related utilities
│   ├── coordinateUtils.ts        # Map coordinate transformations
│   ├── formatters.ts             # Data formatters
│   ├── actions.ts                # Server action helpers
│   ├── hooks/                    # Custom React hooks
│   └── blog/                     # Blog-specific utilities
└── types/                        # TypeScript type definitions
```

### Content Management System

The project uses **@content-collections** for type-safe MDX content management. Content is defined in `content-collections.ts` with six main collections:

1. **BlogPost** - Articles with categories (company, valuation, market-analysis, casestudies)
2. **ChangelogPost** - Product updates
3. **CustomersPost** - Client case studies with company metadata
4. **HelpPost** - Documentation with categories (overview, getting-started, terms, analysis, valuation)
5. **LegalPost** - Legal pages
6. **IntegrationsPost** - Third-party integration guides

**Key Features:**
- Automatic slug generation from titles
- Table of contents extraction from H2 headings
- MDX compilation with rehype plugins (slug, autolink-headings)
- GitHub Flavored Markdown support
- Image and tweet ID extraction
- GitHub repo URL parsing

**Usage Pattern:**
```typescript
import { allBlogPosts, allHelpPosts } from "content-collections"
// Collections are automatically typed and available at build time
```

### Design System

**Color Palette** (Norwegian commercial real estate theme):
- Primary: `warm-grey` (#2c2825), `warm-white` (#f3f1ef)
- Secondary: `light-blue` (#cbeef2)
- Tertiary: Warm grey variants and light blue shades

**Custom Components:**
- Radix UI primitives for accessibility
- Custom charts: AreaChart, BarChart, LineChart, ComboChart, DcfChart, YieldLineChart
- Form components with validation
- Data tables with sorting/filtering
- Mapbox integration for property visualization

### Styling Patterns

- Dark mode support via `selector` strategy
- Custom Tailwind animations for accordions, dialogs, slide transitions
- Responsive design with mobile-first approach
- Custom font family: `NanumPenScript` for handwriting effect
- Tailwind Forms plugin for consistent form styling

### Norwegian Language & SEO

The platform is primarily in Norwegian (bokmål). Key SEO terms:
- Næringsmegler (commercial real estate broker)
- Verdsettelse næringseiendom (commercial property valuation)
- Salg av næringseiendom (sale of commercial property)
- Nordland, Nord-Norge (Northern Norway regional focus)

**SEO Strategy** (from `.cursor/rules/seo.mdc`):
- Target keyword in title, meta description, H1, and natural content placement
- Professional, local, trustworthy tone
- Clear H2/H3 structure with internal CTAs
- Emphasize local expertise in Northern Norway
- End with clear CTA (contact or free valuation request)

### Image Configuration

Remote image patterns allowed:
- `imagedelivery.net/**` (CDN)
- `avatar.vercel.sh/**` (avatars)
- `randomuser.me/**` (placeholder users)

### Build Configuration

**Important settings in next.config.mjs:**
- MDX support via `@next/mdx`
- Content Collections integration via `@content-collections/next`
- ESLint and TypeScript errors ignored during builds (intentional for rapid iteration)
- Page extensions: `.js`, `.jsx`, `.md`, `.mdx`, `.ts`, `.tsx`

### TypeScript Configuration

- Strict mode enabled
- Unused locals/parameters detection enabled
- Path alias: `@/*` maps to `src/*`
- Content collections alias: `content-collections` maps to `.content-collections/generated`
- Target: ES2017

## Development Workflow

1. **Adding New Service Pages**: Create under `src/app/tjenester/[service-name]/page.tsx`
2. **Creating Blog Content**: Add MDX files to `src/content/blog/` with required frontmatter (title, categories, publishedAt, image, author, summary)
3. **Building Charts**: Extend chart components in `src/components/` using existing patterns (DcfChart, YieldLineChart)
4. **Map Features**: Use Mapbox GL components in `src/components/propdock/eiendom/PropertyMap.tsx`
5. **Market Analysis**: Components in `src/components/markedsinnsikt/` and `src/components/propdock/marked/`

## Key Technical Patterns

### Content Collections
- All MDX content must include required frontmatter fields
- Dates use `YYYY-MM-DD` format (regex validated)
- Slugs auto-generate from titles using github-slugger
- Images/tweets/GitHub repos auto-extracted during compilation

### Component Organization
- UI primitives in `components/ui/`
- Domain logic in `components/propdock/` (organized by feature)
- Shared utilities in `lib/`
- Server actions in `app/actions/`

### Mapbox Integration
- Coordinate transformations in `lib/coordinateUtils.ts`
- Property visualization in `components/propdock/eiendom/PropertyMap.tsx`

### Financial Modeling
- DCF analysis charts in `DcfChart.tsx`
- Yield calculations in `YieldLineChart.tsx`
- Chart utilities in `lib/chartUtils.ts`

## Company Context

Advanti is a commercial real estate firm in Northern Norway providing:
- **Brokerage** (megling): Buying, selling, leasing of commercial properties
- **Valuation** (verdivurdering): DCF analysis, yield calculations, market valuations
- **Transaction Advisory**: Due diligence, negotiation, deal structuring
- **Leasing Services**: Office, retail, warehouse property leasing
- **Market Analysis**: Data-driven insights, micro/macro analysis

The platform emphasizes local expertise with regional focus on Nordland and Nord-Norge, while maintaining national and international perspective. Data-driven approach is core to the business model.
