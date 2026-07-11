import type { ReactNode } from "react";

/**
 * Wrapper that applies shadcn typeset typography to rendered MDX.
 * Used by the location (næringsmegler) pages.
 */
export function ProseShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        className ? `typeset typeset-docs ${className}` : "typeset typeset-docs"
      }
    >
      {children}
    </div>
  );
}
