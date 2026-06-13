/**
 * Shared breadcrumb component — server component.
 *
 * Emits BOTH the visible crumb trail (Hjem › … › Leaf) and the
 * BreadcrumbList JSON-LD from a single call site, driven entirely by the
 * navigation registry. Dynamic-route pages pass `leafLabel` for the leaf
 * crumb whose title is known only at render time.
 *
 * Renders null when:
 *   - path is not in the registry (warns in dev only)
 *   - resolved chain has only one level after prepending Hjem
 */

import Link from "next/link";
import { Fragment } from "react";

import { REGISTRY, parentChain, stripHash } from "@/lib/navigation";
import { siteConfig } from "@/app/siteConfig";
import { JsonLd } from "@/lib/jsonLd";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Pure helper — resolves the crumb array from the registry.
 * Exported for unit testing.
 *
 * Returns null when:
 *   - path is not registered (parentChain returns null)
 *   - resolved chain would only contain Hjem (single-level — never shown)
 */
export function buildCrumbs(
  path: string,
  leafLabel?: string,
): BreadcrumbItem[] | null {
  const chain = parentChain(path);
  if (!chain) return null; // unknown path

  const root = REGISTRY.find((e) => e.path === "/");
  if (!root) return null;

  // Prepend the root "Hjem" entry unless the chain already starts there.
  const full = chain[0]?.path === "/" ? chain : [root, ...chain];

  // A lone "Hjem" crumb is never shown — caller renders null.
  if (full.length <= 1) return null;

  return full.map((entry, i) => {
    const isLeaf = i === full.length - 1;
    // For the leaf: use the real path (not the registry pattern like /[slug]).
    const href = isLeaf ? stripHash(path) : entry.path;
    const label = isLeaf && leafLabel ? leafLabel : entry.label;
    return { label, href };
  });
}

interface BreadcrumbsProps {
  /**
   * Absolute path of the current page, e.g. "/naringsmegler/bodo".
   * Dynamic segments are matched against registry patterns; pass the real
   * path, not the Next.js template string.
   */
  path: string;
  /**
   * Label for the leaf (rightmost) crumb. Required for dynamic routes where
   * the displayed title is not in the registry (e.g. city name, article
   * title, person name).
   */
  leafLabel?: string;
}

/**
 * Renders the visible breadcrumb trail and the BreadcrumbList JSON-LD.
 *
 * Place this component where the visible crumb nav should appear (typically
 * at the top of the page section, inside the wrapping container).
 *
 * For pages using <SubHero>, pass this component as the `breadcrumbs` prop
 * so it renders inside the .subhero section and picks up .subhero .crumb
 * styling automatically:
 *   <SubHero breadcrumbs={<Breadcrumbs path="..." leafLabel="..." />} .../>
 */
export function Breadcrumbs({ path, leafLabel }: BreadcrumbsProps) {
  // Separate check so we can warn on truly unknown paths (vs. single-level).
  const rawChain = parentChain(path);

  if (!rawChain) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[Breadcrumbs] "${path}" er ikke registrert i navigation.ts — ingen brødsmulesti vises.`,
      );
    }
    return null;
  }

  const crumbs = buildCrumbs(path, leafLabel);
  if (!crumbs) return null; // single-level after prepend — silence, no warn

  const baseUrl = siteConfig.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: `${baseUrl}${crumb.href}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="Brødsmulesti" className="crumb">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <Fragment key={`${crumb.href}-${i}`}>
              {i > 0 && (
                <span className="sep" aria-hidden="true">
                  ›
                </span>
              )}
              {isLast ? (
                <span className="here">{crumb.label}</span>
              ) : (
                <Link href={crumb.href}>{crumb.label}</Link>
              )}
            </Fragment>
          );
        })}
      </nav>
    </>
  );
}
