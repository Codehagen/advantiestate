# DESIGN.md — Advanti Estate design system

This is the source-of-truth reference for how the site looks and is built.
**Read this before any UI, styling, layout, or component work.** It documents
the editorial design system ported from the Claude Design handoff.

If something here conflicts with what's in the code, the code wins — update
this file to match.

---

## 1. How the system works (read first)

- **The design lives in one file:** `src/styles/advanti-design.css` (~4,000
  lines). It is the component layer — a set of semantic classes (`.hero`,
  `.section-head`, `.btn`, `.case`, `.market`, …). It is `@import`-ed first in
  `src/app/globals.css`, then Tailwind's `base/components/utilities` cascade
  after it.
- **Build pages from the semantic classes, not ad-hoc Tailwind.** Layout and
  structure come from the design classes. Tailwind utilities are for small
  one-off tweaks only (`mt-4`, a one-time `flex`), never for rebuilding a
  pattern that already has a class.
- **Match the existing vocabulary.** New CSS goes in `advanti-design.css`, in
  the right section, using the `var(--token)` design tokens — never hardcoded
  hex or pixel one-offs that duplicate a token.
- **The site is light-only.** Dark mode was dropped. Do not add `dark:`
  variants or `next-themes`.
- **Copy is Norwegian (bokmål).**
- **Aesthetic:** editorial, typographic, restrained. Big type, hairline
  dividers, generous whitespace, numbered sections. The marketing sections
  (services, market data) are deliberately **icon-free** — typography carries
  the hierarchy.

---

## 2. Design tokens

Defined in `:root` at the top of `advanti-design.css`. Mirrored as Tailwind
color names in `tailwind.config`.

### Colour

| Token (CSS var) | Hex | Tailwind name | Use |
|---|---|---|---|
| `--warm-grey` | `#2c2825` | `warm-grey` | primary text, dark sections |
| `--warm-grey-85` | `#57504a` | `warm-grey-85` / `warm-grey-3` | secondary text |
| `--warm-grey-75` | `#d7d0c8` | `warm-grey-75` / `warm-grey-1` | hairlines, dividers |
| `--warm-white` | `#f3f1ef` | `warm-white` | page background |
| `--light-blue` | `#cbeef2` | `light-blue` | signature accent |
| `--light-blue-2` | `#e7f5f7` | `light-blue-2` | soft accent fill |
| `--light-blue-1` | `#f4fafb` | `light-blue-1` | faintest accent wash |

- `--accent`, `--accent-soft`, `--accent-faint` alias the light-blue trio —
  **use the `--accent*` vars** for accent styling (they are the swappable layer).
- `--hairline` = `1px solid var(--warm-grey-75)` — the standard divider.

### Layout

| Token | Value | Use |
|---|---|---|
| `--max-w` | `1480px` | content column cap |
| `--gutter` | `clamp(24px, 4vw, 64px)` | page side padding |

---

## 3. Typography

- **One typeface: Inter**, for both display and body, loaded via `next/font`
  → `var(--font-inter)`. Both `--font-display` and `--font-body` point to it.
  (Future: `--font-display` is intended to become Reckless Neue once licensed
  — keep using the `--font-display` var so the swap is one line.)
- Tailwind: `font-sans` and `font-display` both = Inter. `font-handwriting` =
  `NanumPenScript` (decorative only).
- **Headings** (`h1`–`h3`) use `--font-display`, weight **400**, tight
  letter-spacing (≈ `-0.02em`), `text-wrap: balance`. Sized with `clamp()` so
  they scale with the viewport — never hardcode a heading px size.
- **`.eyebrow`** — small uppercase label (11px, letter-spacing `0.14em`) with a
  32px rule before it. Precedes most section headings.
- **`.italic` span** — the signature device: inside a heading, wrap a phrase in
  `<span className="italic">…</span>` to render it italic, weight 300, often in
  the accent colour. This is how the brand "voices" a heading. Use it.
- Body text: 16px / line-height 1.55, `--warm-grey` on `--warm-white`.

---

## 4. Layout primitives

- **`.wrap`** — the centered content column: `max-width: var(--max-w)`, side
  padding `var(--gutter)`. Almost every section's inner content sits in a
  `.wrap`.
- **`.section`** — 120px vertical padding. **`.section-tight`** — 80px.
- **`.section-head`** — the standard section intro: a single left-aligned
  column of `.eyebrow` + `<h2>` + `<p>`.
- **`.page-pad`** — an 80px spacer that offsets the fixed nav on inner pages
  (rendered by `SubHero`).

---

## 5. Components

### Canonical React building blocks — `src/components/site/`

Use these; do not reinvent them.

| Component | Use |
|---|---|
| `Nav` | Fixed site nav. Transparent over a dark hero, solid otherwise. |
| `Footer` | Site footer + the large `Advanti.Estate` wordmark. |
| `SubHero` | Inner-page header (breadcrumb + editorial title block). Renders `.page-pad`. Accepts `crumb`, `eyebrow`, `title`, `lede`, `metaRow`, `photo`, `actions`, `children`. |
| `CtaStrip` | The closing call-to-action band. Most pages end with one. |
| `PhotoBand` | Full-bleed photo strip with a caption. |
| `ProseShell` | Wrapper that applies editorial prose styling to MDX/article bodies. |

### Nav behaviour (important)

`Nav` is `position: fixed`. It is **transparent** while you are on a dark hero
and **solid** once you scroll past it. The contract is a DOM sentinel:

- A page with a dark hero renders `<div id="hero-sentinel" />` at the hero's
  base. `Nav` observes it and stays transparent until it scrolls behind the nav.
- A page with no hero → no sentinel → `Nav` is solid immediately.
- Inner pages use `SubHero`, which renders `.page-pad` (no sentinel) so the nav
  is solid above it.

### Buttons

`.btn` is the base (pill shape, `border-radius: 999px`, 16/28px padding).
Pair it with one variant:

| Variant | Look | Use on |
|---|---|---|
| `.btn-primary` | white fill, warm-grey text, accent on hover | dark backgrounds |
| `.btn-dark` | warm-grey fill, white text | light backgrounds |
| `.btn-ghost` | bordered, light text | dark backgrounds |
| `.btn-outline` | bordered, dark text | light backgrounds |

Valid `<Button>` component `variant` props are `primary | secondary | light |
ghost | destructive` — there is no `outline` variant on the component.

### Where to find a pattern in `advanti-design.css`

The file is organised top-to-bottom by section, with banner comments:

```
Reset + base · Type system · Layout primitives · NAV · HERO ·
MARQUEE/TICKER · TJENESTER (services) · MARKEDSINNSIKT block · OM ADVANTI ·
UTVALGTE OPPDRAG (cases) · CTA strip · FOOTER · INNER PAGES (shared) ·
ABOUT page · CONTACT page · MARKEDSINNSIKT dashboard · KUNNSKAPSSENTER ·
KUNNSKAPSSENTER article · TEAM/Personer · Person detail · NÆRINGSMEGLER ·
OPPDRAG archive · BLOG
```

Find the matching banner before adding or changing styles.

---

## 6. Gotchas / patterns

- **`<Image fill>` needs a positioned parent with a real height.** `fill`
  images render at 0×0 if their wrapper has no height. Give the wrapper
  `position: relative|absolute` *and* a height (or `inset: 0` inside a sized
  ancestor). Don't add an inline `position` that overrides a stylesheet rule.
- **Thousands separators must be non-breaking.** Norwegian uses a space as the
  thousands separator (`2 950`). Use a non-breaking space (` `) so the
  number never wraps across lines.
- **Full-viewport heroes must be able to grow.** Use `min-height: 100vh`, not a
  fixed `height: 100vh`, and reserve top padding for the fixed nav — otherwise
  tall content overflows up behind the nav on short/narrow screens.
- **Local hero/section photos** live in `public/building/`, `public/team/`,
  `public/press/`. Resize large source images before committing (target a few
  hundred KB, not multi-MB).

---

## 7. Adding a new page

1. **Inner page** (most pages): start with `<SubHero …>` for the header, build
   the body from `.section` / `.wrap` / `.section-head`, end with `<CtaStrip>`.
2. **Dark-hero page** (homepage style): use the `.hero` markup and render
   `<div id="hero-sentinel" />` right after it so `Nav` goes transparent.
3. Reuse existing section classes. If a genuinely new pattern is needed, add it
   to the right section of `advanti-design.css` using the design tokens.
4. Keep copy Norwegian. Run `pnpm build` — it type-checks (no
   `ignoreBuildErrors`).
