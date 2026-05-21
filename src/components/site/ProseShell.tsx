import type { ReactNode } from "react";

/**
 * Wrapper that applies the editorial long-form prose styling (`.ks-prose`
 * from the design system). Used by help articles and customer case studies
 * in Phase 2 to host rendered MDX.
 */
export function ProseShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `ks-prose ${className}` : "ks-prose"}>
      {children}
    </div>
  );
}
