"use client"

import { MDXContent } from "@content-collections/mdx/react"
import dynamic from "next/dynamic"
import Link from "next/link"

import BlurImage from "@/lib/blog/blur-image"
import { HELP_CATEGORIES, POPULAR_ARTICLES } from "@/lib/blog/content"
import { HELP_LINK_INDEX } from "@/lib/blog/help-link-index"
import { cx } from "@/lib/utils"

import { Advisor } from "./Advisor"
import CategoryCard from "./category-card"
import CopyBox from "./copy-box"
import HelpArticleLink from "./help-article-link"
import ZoomImage from "./zoom-image"

// Heavy MDX widgets — loaded on demand via next/dynamic so the ~47 articles
// that use none of them never ship recharts / katex / framer-motion.
// See PERFORMANCE_PLAN.md Phase 2.0.
const DcfChart = dynamic(
  () => import("@/components/advanti/DcfChart").then((m) => m.DcfChart),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 h-[420px] w-full animate-pulse rounded-lg border border-warm-grey-2/20 bg-warm-grey-2/10" />
    ),
  },
)

const AnimatedGridPattern = dynamic(
  () =>
    import("@/components/ui/Animated-Grid-Background").then(
      (m) => m.AnimatedGridPattern,
    ),
  { ssr: false },
)

const KatexMath = dynamic(() =>
  import("./katex-math").then((m) => m.KatexMath),
)

const CustomLink = (props: any) => {
  const href = props.href

  if (href.startsWith("/")) {
    return (
      <Link {...props} href={href}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith("#")) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

/* ============================================================
   Editorial MDX components (.ae-*) — see DESIGN.md §5 BLOG.
   Structure comes from the semantic .ae-* classes in
   advanti-design.css; these wrappers only render the markup.
   ============================================================ */

/* -- NOTE / CALLOUT ----------------------------------------
   Backward-compatible variants: the editorial vocabulary is
   neutral | key | caution | positive, but existing articles
   use the older info | warning | success — both are accepted
   and normalized here so nothing breaks. */
const NOTE_CLASS: Record<string, string> = {
  neutral: "ae-note",
  key: "ae-note is-key",
  caution: "ae-note is-caution",
  positive: "ae-note is-positive",
  // legacy aliases
  info: "ae-note",
  warning: "ae-note is-caution",
  success: "ae-note is-positive",
}
const NOTE_LABEL: Record<string, string> = {
  neutral: "Merk",
  key: "Viktig",
  caution: "Vær oppmerksom",
  positive: "Konklusjon",
  info: "Merk",
  warning: "Vær oppmerksom",
  success: "Konklusjon",
}
function Note(props: {
  variant?: string
  label?: string
  children: React.ReactNode
}) {
  const variant = props.variant ?? "neutral"
  return (
    <div className={NOTE_CLASS[variant] ?? "ae-note"}>
      <span className="ae-label">{props.label ?? NOTE_LABEL[variant] ?? "Merk"}</span>
      {props.children}
    </div>
  )
}

/* -- ASIDE (also serves the legacy "Info" / Fun fact box) -- */
function Aside(props: { label?: string; children: React.ReactNode }) {
  return (
    <div className="ae-aside">
      <span className="ae-label">{props.label ?? "Visste du"}</span>
      {props.children}
    </div>
  )
}

/* -- FACT BOX --------------------------------------------- */
function Fact(props: {
  term: React.ReactNode
  inline?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={props.inline === false ? "ae-fact" : "ae-fact is-inline"}>
      <div className="ae-term">{props.term}</div>
      <div className="ae-def">{props.children}</div>
    </div>
  )
}

/* -- STAT STRIP ------------------------------------------- */
function StatStrip(props: {
  items: {
    value: string
    unit?: string
    label: string
    delta?: { dir: "up" | "down"; text: string }
  }[]
}) {
  const items = props.items ?? []
  return (
    <div className="ae-stat-strip" style={{ ["--ae-cols" as any]: items.length }}>
      {items.map((s, i) => (
        <div className="ae-stat" key={i}>
          <div className="ae-val">
            {s.value}
            {s.unit && <span className="unit">{s.unit}</span>}
          </div>
          <div className="ae-stat-label">{s.label}</div>
          {s.delta && (
            <span className={`ae-delta ${s.delta.dir}`}>{s.delta.text}</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* -- SUMMARY GRID ----------------------------------------- */
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"]
function Summary(props: {
  title?: React.ReactNode
  // iconName accepted for backward compat with old articles; ignored.
  points: { title: string; description?: string; iconName?: string }[]
}) {
  return (
    <div className="ae-summary">
      {props.title && <div className="ae-summary-head">{props.title}</div>}
      <div className="ae-grid">
        {(props.points ?? []).map((p, i) => (
          <div className="ae-item" key={i}>
            <span className="ae-rn">{ROMAN[i] ?? i + 1}</span>
            <h5>{p.title}</h5>
            {p.description && <p>{p.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* -- STEPPER ----------------------------------------------
   Supports optional per-step `formula` (rendered via the editorial
   .ae-formula frame) and `image` — existing help articles rely on the
   `formula` sub-prop, so dropping it silently hides their math. */
function Stepper(props: {
  items: {
    title: string
    content: React.ReactNode
    image?: { src: string; alt: string; width?: number; height?: number }
    formula?: { math: string; description?: string; mode?: "inline" | "block" }
  }[]
}) {
  return (
    <div className="ae-stepper">
      {(props.items ?? []).map((item, i) => (
        <div className="ae-step" key={i}>
          <div className="ae-sn">{i + 1}</div>
          <div>
            <h4>{item.title}</h4>
            <div>{item.content}</div>
            {item.formula && (
              <MathBlock
                formula={item.formula.math}
                description={item.formula.description}
                mode={item.formula.mode}
              />
            )}
            {item.image && (
              <ZoomImage
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width || 800}
                height={item.image.height || 400}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* -- EXAMPLE / CALCULATION -------------------------------- */
function Example(props: {
  title?: string
  steps: {
    label: string
    value: string | number
    calculation?: string
    isResult?: boolean
  }[]
}) {
  const fmt = (v: string | number) =>
    typeof v === "number" ? new Intl.NumberFormat("nb-NO").format(v) : v
  const steps = props.steps ?? []
  // Render the calculation column consistently across rows. If ANY row has a
  // calculation, every row reserves the cell (empty when absent) so values
  // stay in the same column. If no row has one, drop the column entirely.
  const hasCalc = steps.some((s) => s.calculation)
  return (
    <div className="ae-example">
      <div className="ae-ehead">
        <span className="ae-label">Eksempel</span>
        {props.title && <h4>{props.title}</h4>}
      </div>
      <div className="ae-table-scroll">
        <table>
          <tbody>
            {steps.map((s, i) => (
              <tr key={i} className={s.isResult ? "is-result" : undefined}>
                <td className="ae-elabel">{s.label}</td>
                {hasCalc && <td className="ae-ecalc">{s.calculation ?? ""}</td>}
                <td className="ae-eval">{fmt(s.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -- PREREQUISITES ----------------------------------------
   Backward-compatible: accepts either an `items` array (new
   editorial API) or `children` (the markdown list used by the
   existing help articles). */
function Prerequisites(props: {
  label?: string
  items?: React.ReactNode[]
  children?: React.ReactNode
}) {
  return (
    <div className="ae-prereq">
      <span className="ae-label">{props.label ?? "Forutsetninger"}</span>
      {props.items ? (
        <ul>
          {props.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      ) : (
        props.children
      )}
    </div>
  )
}

/* -- QUOTE ------------------------------------------------
   Backward-compatible: the editorial pull-quote takes
   text / author / role / authorSrc. Existing articles pass the
   older author / authorSrc / title / company / companySrc / text
   shape — `title` maps to `role`; the company logo has no slot
   in the editorial design and is intentionally dropped. */
function Quote(props: {
  text: React.ReactNode
  author?: string
  role?: string
  title?: string
  authorSrc?: string
  company?: string
  companySrc?: string
}) {
  const role = props.role ?? props.title
  return (
    <div className="ae-quote">
      <div className="ae-q">{props.text}</div>
      {(props.author || role) && (
        <div className="ae-cite">
          {props.authorSrc && (
            // next/image (via BlurImage) so the avatar is optimized and
            // honors next.config remotePatterns — a raw CSS background-image
            // would bypass both and let any src trigger an unoptimized fetch.
            <div className="ae-av">
              <BlurImage
                src={props.authorSrc}
                alt={props.author ?? ""}
                width={44}
                height={44}
              />
            </div>
          )}
          <div className="meta">
            {props.author && <span className="name">{props.author}</span>}
            {role && <span className="role">{role}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

/* -- IN-ARTICLE CTA (editorial) --------------------------- */
function CTA(props: {
  badge?: string
  title: React.ReactNode
  description?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  light?: boolean
}) {
  return (
    <div className={props.light ? "ae-cta is-light" : "ae-cta"}>
      {props.badge && <span className="ae-label">{props.badge}</span>}
      <h4>{props.title}</h4>
      {props.description && <p>{props.description}</p>}
      {(props.primaryAction || props.secondaryAction) && (
        <div className="ae-actions">
          {props.primaryAction && (
            <Link
              className="ae-btn ae-btn-primary"
              href={props.primaryAction.href}
            >
              {props.primaryAction.label} <span aria-hidden>→</span>
            </Link>
          )}
          {props.secondaryAction && (
            <Link
              className="ae-btn ae-btn-ghost"
              href={props.secondaryAction.href}
            >
              {props.secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

/* -- AnimatedCTA (legacy animated grid band) --------------
   Kept as an opt-in component; the default <CTA> is now the
   editorial band above. Use <AnimatedCTA> when an article
   wants the animated treatment. */
function AnimatedCTA(props: {
  badge?: string
  title: string
  description: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  size?: "default" | "large"
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-xl bg-warm-grey-2/10 p-8 shadow-lg shadow-warm-grey-2/5 ring-1 ring-warm-grey-2/20 backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-warm-grey-2/5",
        props.size === "large" && "min-h-[400px]",
      )}
    >
      <AnimatedGridPattern
        className="absolute inset-0 opacity-30"
        width={32}
        height={32}
        strokeDasharray="4 2"
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-6 text-center">
        {props.badge && (
          <span className="inline-flex items-center rounded-full border border-warm-grey-2/20 bg-warm-grey-2/10 px-3 py-1 text-xs font-medium text-warm-grey/80">
            {props.badge}
          </span>
        )}
        <h3 className="text-2xl font-semibold tracking-tight text-warm-grey">
          {props.title}
        </h3>
        <p className="text-warm-grey/80">{props.description}</p>
        {(props.primaryAction || props.secondaryAction) && (
          <div className="flex gap-4">
            {props.primaryAction && (
              <Link
                href={props.primaryAction.href}
                className="inline-flex items-center justify-center rounded-full bg-warm-grey-2/20 px-6 py-2 font-medium text-warm-grey transition-colors hover:bg-warm-grey-2/30"
              >
                {props.primaryAction.label}
              </Link>
            )}
            {props.secondaryAction && (
              <Link
                href={props.secondaryAction.href}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 font-medium text-warm-grey/80 ring-1 ring-warm-grey-2/20 transition-colors hover:bg-warm-grey-2/10 hover:text-warm-grey"
              >
                {props.secondaryAction.label}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* -- FORMULA family ---------------------------------------
   MathBlock is the editorial dark frame around the existing
   KatexMath renderer. `Math` and `FormulaDisplay` are the same
   component (FormulaDisplay was a byte-identical duplicate).
   `Formula` is the new children-based editorial frame. */
function MathBlock(props: {
  formula: string
  description?: string
  mode?: "inline" | "block"
}) {
  return (
    <div className="ae-formula">
      <span className="ae-label">Formel</span>
      <div className="ae-eq">
        <KatexMath formula={props.formula} mode={props.mode} fit />
      </div>
      {props.description && <div className="ae-desc">{props.description}</div>}
    </div>
  )
}
function Formula(props: {
  description?: string
  light?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={props.light ? "ae-formula is-light" : "ae-formula"}>
      <span className="ae-label">Formel</span>
      <div className="ae-eq">{props.children}</div>
      {props.description && <div className="ae-desc">{props.description}</div>}
    </div>
  )
}

/* -- TIMELINE --------------------------------------------- */
function Timeline(props: {
  items: { date: string; title: string; body?: React.ReactNode }[]
}) {
  return (
    <div className="ae-timeline">
      {(props.items ?? []).map((it, i) => (
        <div className="ae-tl-item" key={i}>
          <div className="ae-tl-date">{it.date}</div>
          <h4>{it.title}</h4>
          {it.body && <p>{it.body}</p>}
        </div>
      ))}
    </div>
  )
}

/* -- COMPARISON ------------------------------------------- */
function Compare(props: {
  pro: { head: string; items: React.ReactNode[] }
  con: { head: string; items: React.ReactNode[] }
}) {
  return (
    <div className="ae-compare">
      <div className="ae-col is-accent">
        <div className="ae-col-head">{props.pro?.head}</div>
        <ul>
          {(props.pro?.items ?? []).map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
      <div className="ae-col is-con">
        <div className="ae-col-head">{props.con?.head}</div>
        <ul>
          {(props.con?.items ?? []).map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* -- READ MORE -------------------------------------------- */
function ReadMore(props: {
  title?: string
  items: { href: string; pre: string; title: string }[]
}) {
  return (
    <div className="ae-readmore">
      <div className="ae-rm-head">{props.title ?? "Les videre."}</div>
      <div className="ae-rm-list">
        {(props.items ?? []).map((it, i) => (
          <Link className="ae-rm-item" href={it.href} key={i}>
            <div>
              <div className="ae-rm-pre">{it.pre}</div>
              <h4>{it.title}</h4>
            </div>
            <span className="ae-rm-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* -- CHANGELOG / DATED LINKS ------------------------------ */
function Changelog(props: {
  items: { href: string; date: string; title: string; summary?: string }[]
}) {
  return (
    <div className="ae-changelog">
      {(props.items ?? []).map((it, i) => (
        <Link className="ae-cl-item" href={it.href} key={i}>
          <div className="ae-cl-date">{it.date}</div>
          <div>
            <h4>{it.title}</h4>
            {it.summary && <p>{it.summary}</p>}
          </div>
          <span className="ae-rm-arrow" aria-hidden>
            →
          </span>
        </Link>
      ))}
    </div>
  )
}

/* -- FIGURE -----------------------------------------------
   Wraps the existing ZoomImage/BlurImage child. */
function Figure(props: {
  n?: string
  caption: React.ReactNode
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <figure className={props.wide ? "ae-figure is-wide" : "ae-figure"}>
      <div className="ae-img">{props.children}</div>
      <figcaption>
        {props.n && <span className="ae-fig-n">{props.n}</span>}
        <span>{props.caption}</span>
      </figcaption>
    </figure>
  )
}

// Base markdown (h2/h3/p/ul/table…) intentionally has NO per-element
// className overrides — typography is inherited from `.ks-prose` on the
// <article> wrapper so blog, help, kunder, integrasjoner and eiendommer all
// share one editorial type system. Only the custom components below are mapped.
const components = {
  a: CustomLink,
  Note,
  Aside,
  // Legacy "Info" (Fun fact) box now renders as a margin aside.
  Info: (props: { children: React.ReactNode }) => (
    <Aside label="Visste du">{props.children}</Aside>
  ),
  Fact,
  StatStrip,
  Summary,
  Stepper,
  Example,
  Prerequisites,
  Quote,
  CTA,
  AnimatedCTA,
  Math: MathBlock,
  FormulaDisplay: MathBlock,
  InlineMath: (props: { formula: string }) => (
    <span className="mx-1">
      <KatexMath formula={props.formula} mode="inline" />
    </span>
  ),
  Formula,
  Figure,
  Timeline,
  Compare,
  ReadMore,
  Changelog,
  Advisor,
  CopyBox,
  HelpArticles: (props: { articles: string[] }) => (
    <div className="grid gap-2 rounded-xl border border-warm-grey-2/20 bg-warm-grey-2/10 p-4">
      {(props.articles || POPULAR_ARTICLES).map((slug) => (
        <HelpArticleLink
          key={slug}
          article={HELP_LINK_INDEX.find((a) => a.slug === slug)}
        />
      ))}
    </div>
  ),
  HelpCategories: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {HELP_CATEGORIES.map((category) => (
        <CategoryCard
          key={category.slug}
          href={`/help/category/${category.slug}`}
          name={category.title}
          description={category.description}
          icon={category.icon}
          pattern={{
            y: 16,
            squares: [
              [0, 1],
              [1, 3],
            ],
          }}
        />
      ))}
    </div>
  ),
  DcfChart: (props: any) => (
    <div className="">
      <DcfChart {...props} />
    </div>
  ),
}

interface MDXProps {
  code: string
  images?: { alt: string; src: string; blurDataURL: string }[]
  className?: string
}

export function MDX({ code, images, className }: MDXProps) {
  const MDXImage = (props: any) => {
    const blurDataURL = images
      ? images.find((image) => image.src === props.src)?.blurDataURL
      : undefined

    return <ZoomImage {...props} blurDataURL={blurDataURL} />
  }

  return (
    <article
      data-mdx-container
      className={cx("ks-prose max-w-none transition-all", className)}
    >
      <MDXContent
        code={code}
        components={{
          ...components,
          Image: MDXImage,
          img: (props: any) => <MDXImage {...props} />,
          // Markdown (GFM) tables: wrap in a horizontal scroll container so
          // wide tables never overflow the viewport on mobile. A wrapper div
          // (not display:block on the table) preserves the table a11y role.
          table: (props: any) => (
            <div className="ae-table-scroll">
              <table {...props} />
            </div>
          ),
        }}
      />
    </article>
  )
}
