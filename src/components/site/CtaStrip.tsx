import Link from "next/link";
import type { ReactNode } from "react";

export interface CtaStripAction {
  label: string;
  href: string;
}

export interface CtaStripProps {
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  primary?: CtaStripAction;
  secondary?: CtaStripAction;
}

/** Renders a button that uses next/link for internal routes and a plain
 *  anchor for external / tel: / mailto: targets. */
function CtaButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

/** Bottom-of-page call-to-action band. */
export function CtaStrip({
  eyebrow,
  title,
  sub,
  primary,
  secondary,
}: CtaStripProps) {
  return (
    <section className="cta-strip">
      <div className="wrap">
        {eyebrow && (
          <span
            className="eyebrow center no-rule"
            style={{ marginBottom: 24 }}
          >
            {eyebrow}
          </span>
        )}
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
        {(primary || secondary) && (
          <div className="row">
            {primary && (
              <CtaButton href={primary.href} className="btn btn-dark">
                {primary.label}
                <span className="arrow">→</span>
              </CtaButton>
            )}
            {secondary && (
              <CtaButton href={secondary.href} className="btn btn-outline">
                {secondary.label}
              </CtaButton>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
