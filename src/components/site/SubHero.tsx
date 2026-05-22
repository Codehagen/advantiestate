import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export interface SubHeroMeta {
  value: string;
  label: string;
}

export interface SubHeroAction {
  label: string;
  href: string;
  variant?: "dark" | "outline";
}

export interface SubHeroProps {
  crumb: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  metaRow?: SubHeroMeta[];
  photo?: { src: string; alt: string };
  actions?: SubHeroAction[];
  /** Extra content rendered in the left column, just below the lede. */
  children?: ReactNode;
}

/**
 * Inner-page header. Renders the fixed-nav spacer (`.page-pad`), the
 * breadcrumb, and the editorial two-column intro used on every non-homepage
 * route. Pages with a `<SubHero>` do NOT render an `#hero-sentinel`, so the
 * Nav stays solid above it.
 */
export function SubHero({
  crumb,
  eyebrow,
  title,
  lede,
  metaRow,
  photo,
  actions,
  children,
}: SubHeroProps) {
  return (
    <>
      <div className="page-pad" />
      <section className="subhero">
        <div className="wrap">
          <nav className="crumb" aria-label="Brødsmuler">
            {crumb.map((c, i) => (
              <Fragment key={`${c.label}-${i}`}>
                {c.href ? (
                  <Link href={c.href}>{c.label}</Link>
                ) : (
                  <span className="here">{c.label}</span>
                )}
                {i < crumb.length - 1 && <span className="sep">/</span>}
              </Fragment>
            ))}
          </nav>

          <div
            className={
              photo ? "subhero-grid" : "subhero-grid subhero-grid--solo"
            }
          >
            <div>
              {eyebrow && (
                <span
                  className="eyebrow"
                  style={{ marginBottom: 28, display: "inline-flex" }}
                >
                  {eyebrow}
                </span>
              )}
              <h1>{title}</h1>
              {lede && <p className="lede">{lede}</p>}

              {children}

              {actions && actions.length > 0 && (
                <div className="hero-cta-row">
                  {actions.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      className={`btn ${
                        a.variant === "outline" ? "btn-outline" : "btn-dark"
                      }`}
                    >
                      {a.label}
                      {a.variant !== "outline" && (
                        <span className="arrow">→</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {metaRow && metaRow.length > 0 && (
                <div className="subhero-meta">
                  {metaRow.map((m, i) => (
                    <div key={`${m.label}-${i}`}>
                      <span className="v">{m.value}</span>
                      <span className="l">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {photo && (
              <div
                className="subhero-photo"
                style={{ position: "relative" }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
