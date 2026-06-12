/**
 * Navigation registry — browser-safe, pure static data.
 * No content-collections import, no react import.
 *
 * Dynamic routes are registered as PATTERN entries only
 * (e.g. "/blog/[slug]") — never individual slugs.
 *
 * Entries with inNav: false are pages that are deliberately outside the
 * nav/footer but still registered so parentChain() can resolve them.
 */

export type GroupId = "tjenester" | "innsikt" | "om-oss";

export interface NavEntry {
  /** Absolute path or pattern (e.g. "/blog/[slug]"). */
  path: string;
  label: string;
  parent: string | null;
  inNav?: boolean;
  inFooter?: boolean;
  /** Nav dropdown group this entry belongs to. */
  navGroup?: GroupId;
  /** Short muted description line — used in the Innsikt panel column. */
  description?: string;
}

export const REGISTRY: NavEntry[] = [
  // ── root ────────────────────────────────────────────────────────────────
  { path: "/", label: "Hjem", parent: null },

  // ── tjenester group ─────────────────────────────────────────────────────
  // /tjenester is the parent (emphasized first link in the panel column).
  {
    path: "/tjenester",
    label: "Tjenester",
    parent: null,
    inNav: true,
    inFooter: true,
    navGroup: "tjenester",
  },
  {
    path: "/tjenester/verdivurdering",
    label: "Verdivurdering",
    description: "Dokumentert markedsverdi med DCF- og yield-analyse.",
    parent: "/tjenester",
    inNav: true,
    inFooter: true,
    navGroup: "tjenester",
  },
  {
    path: "/tjenester/salg",
    label: "Salg",
    description: "Strukturert salgsprosess fra verdivurdering til oppgjør.",
    parent: "/tjenester",
    inNav: true,
    inFooter: true,
    navGroup: "tjenester",
  },
  {
    path: "/tjenester/transaksjoner",
    label: "Transaksjonsrådgivning",
    description: "Rådgivning gjennom due diligence og forhandling.",
    parent: "/tjenester",
    inNav: true,
    inFooter: true,
    navGroup: "tjenester",
  },
  {
    path: "/tjenester/utleie",
    label: "Utleie",
    description: "Utleie av kontor-, handels- og logistikkareal.",
    parent: "/tjenester",
    inNav: true,
    inFooter: true,
    navGroup: "tjenester",
  },
  // Label matches the page H1: "Markedsdata og rådgivning."
  {
    path: "/tjenester/radgivning",
    label: "Markedsdata og rådgivning",
    description: "Markedsdata og analyse som beslutningsgrunnlag.",
    parent: "/tjenester",
    inNav: true,
    inFooter: true,
    navGroup: "tjenester",
  },
  {
    path: "/tjenester/strategisk-radgivning",
    label: "Strategisk rådgivning",
    description: "Porteføljestrategi og langsiktig eierrådgivning.",
    parent: "/tjenester",
    inNav: true,
    inFooter: true,
    navGroup: "tjenester",
  },
  // Dynamic service × city routes
  { path: "/tjenester/verdivurdering/[by]", label: "Verdivurdering i din by", parent: "/tjenester/verdivurdering" },
  { path: "/tjenester/salg/[by]", label: "Salg i din by", parent: "/tjenester/salg" },
  { path: "/tjenester/utleie/[by]", label: "Utleie i din by", parent: "/tjenester/utleie" },

  // ── næringsmegler — shown inside the Tjenester panel ─────────────────────
  {
    path: "/naringsmegler",
    label: "Næringsmegler i din by",
    description: "Lokal megler i ti byer i Nord-Norge.",
    parent: null,
    inNav: true,
    inFooter: true,
    navGroup: "tjenester",
  },
  { path: "/naringsmegler/[slug]", label: "Næringsmegler", parent: "/naringsmegler" },

  // ── eiendommer — plain top-level nav link ─────────────────────────────────
  {
    path: "/eiendommer",
    label: "Eiendommer",
    parent: null,
    inNav: true,
    inFooter: false,
  },
  { path: "/eiendommer/[slug]", label: "Eiendom", parent: "/eiendommer" },

  // ── innsikt group ────────────────────────────────────────────────────────
  // First entry is the emphasized parent link; remaining entries carry
  // description lines shown in the panel.
  {
    path: "/markedsinnsikt",
    label: "Markedsinnsikt",
    parent: null,
    inNav: true,
    inFooter: true,
    navGroup: "innsikt",
    description: "Oversikt over næringseiendomsmarkedet i Nord-Norge.",
  },
  {
    path: "/markedsinnsikt/kart",
    label: "Markedskart",
    parent: "/markedsinnsikt",
    inNav: true,
    inFooter: true,
    navGroup: "innsikt",
    description: "Prisnivåer og soner visualisert by for by.",
  },
  {
    path: "/markedsrapport",
    label: "Markedsrapport",
    parent: "/markedsinnsikt",
    inNav: true,
    inFooter: true,
    navGroup: "innsikt",
    description: "Kvartalsvise tall: yield, leie og ledighet.",
  },
  {
    path: "/verktoy",
    label: "Verktøy og kalkulatorer",
    parent: "/markedsinnsikt",
    inNav: true,
    inFooter: true,
    navGroup: "innsikt",
    description: "Kalkulatorer for yield, ROI og verdivurdering.",
  },
  {
    path: "/help",
    label: "Kunnskapssenter",
    parent: "/markedsinnsikt",
    inNav: true,
    inFooter: true,
    navGroup: "innsikt",
    description: "Guider og fagartikler om næringseiendom.",
  },
  {
    path: "/blog",
    label: "Artikler",
    parent: "/markedsinnsikt",
    inNav: true,
    inFooter: true,
    navGroup: "innsikt",
    description: "Analyser, markedskommentarer og innsikt.",
  },
  // Help sub-pages
  { path: "/help/article/[slug]", label: "Hjelpeartikkel", parent: "/help" },
  { path: "/help/category/[slug]", label: "Hjelp kategori", parent: "/help" },
  // Blog sub-pages
  { path: "/blog/[slug]", label: "Blogginnlegg", parent: "/blog" },
  { path: "/blog/category/[slug]", label: "Bloggkategori", parent: "/blog" },
  // Verktøy sub-pages
  { path: "/verktoy/yield-kalkulator", label: "Yield-kalkulator", parent: "/verktoy" },
  { path: "/verktoy/roi-kalkulator", label: "ROI-kalkulator", parent: "/verktoy" },
  { path: "/verktoy/pris-verdivurdering", label: "Prisvurderingskalkulator", parent: "/verktoy" },
  { path: "/verktoy/boliglan-kalkulator", label: "Boliglånskalkulator", parent: "/verktoy" },

  // ── om oss group ─────────────────────────────────────────────────────────
  {
    path: "/om-oss",
    label: "Om oss",
    parent: null,
    inNav: true,
    inFooter: true,
    navGroup: "om-oss",
  },
  {
    path: "/personer",
    label: "Team",
    parent: "/om-oss",
    inNav: true,
    inFooter: true,
    navGroup: "om-oss",
  },
  { path: "/personer/[slug]", label: "Rådgiver", parent: "/personer" },
  {
    path: "/kunder",
    label: "Utvalgte oppdrag",
    parent: "/om-oss",
    inNav: true,
    inFooter: true,
    navGroup: "om-oss",
  },
  { path: "/kunder/[slug]", label: "Oppdrag", parent: "/kunder" },
  {
    path: "/karriere",
    label: "Karriere",
    parent: "/om-oss",
    inNav: true,
    inFooter: true,
    navGroup: "om-oss",
  },
  {
    path: "/presserom",
    label: "Presserom",
    parent: "/om-oss",
    inNav: true,
    inFooter: true,
    navGroup: "om-oss",
  },
  { path: "/presserom/arkiv", label: "Pressearkiv", parent: "/presserom" },
  { path: "/presserom/arkiv/[kvartal]", label: "Kvartalsarkiv", parent: "/presserom/arkiv" },

  // ── kontakt — plain top-level nav link ────────────────────────────────────
  {
    path: "/kontakt",
    label: "Kontakt",
    parent: null,
    inNav: true,
    inFooter: true,
  },

  // ── portaler (gated — inNav: false, in footer for authenticated users) ────
  { path: "/analyseportal", label: "Analyseportal", parent: null, inNav: false, inFooter: true },
  { path: "/investorportal", label: "Investorportal", parent: null, inNav: false, inFooter: true },

  // ── legal ─────────────────────────────────────────────────────────────────
  { path: "/privacy", label: "Personvern", parent: null, inNav: false, inFooter: false },
  { path: "/terms", label: "Vilkår", parent: null, inNav: false, inFooter: false },

  // ── deliberately outside nav/footer (gated or landing pages) ─────────────
  { path: "/presentasjon", label: "Presentasjon", parent: null, inNav: false, inFooter: false },
  { path: "/landing/verdivurdering", label: "Verdivurdering landingsside", parent: null, inNav: false, inFooter: false },
  { path: "/sjekkliste-verdivurdering", label: "Sjekkliste verdivurdering", parent: null, inNav: false, inFooter: false },

  // ── integrasjoner ─────────────────────────────────────────────────────────
  { path: "/integrasjoner", label: "Integrasjoner", parent: null, inNav: false, inFooter: false },
  { path: "/integrasjoner/[slug]", label: "Integrasjon", parent: "/integrasjoner" },
];

// ── helpers ──────────────────────────────────────────────────────────────────

/** All inNav:true top-level entries (parent: null). */
export function navItems(): NavEntry[] {
  return REGISTRY.filter((e) => e.inNav === true && e.parent === null);
}

/** Group entries ordered for panel rendering (inNav:true within each group). */
export const navGroups: Record<GroupId, NavEntry[]> = {
  tjenester: REGISTRY.filter((e) => e.navGroup === "tjenester" && e.inNav === true),
  innsikt: REGISTRY.filter((e) => e.navGroup === "innsikt" && e.inNav === true),
  "om-oss": REGISTRY.filter((e) => e.navGroup === "om-oss" && e.inNav === true),
};

/** Footer column definitions (byer column is injected from the server layer). */
export const footerColumns: Record<"tjenester" | "advanti", NavEntry[]> = {
  tjenester: REGISTRY.filter(
    (e) =>
      e.inFooter === true &&
      (e.navGroup === "tjenester" || e.path === "/naringsmegler") &&
      e.path !== "/tjenester" // parent row not shown as a plain link in footer
  ),
  advanti: [
    "/om-oss",
    "/kunder",
    "/markedsinnsikt",
    "/karriere",
    "/kontakt",
    "/presserom",
    "/analyseportal",
    "/investorportal",
    "/blog",
  ]
    .map((p) => REGISTRY.find((e) => e.path === p))
    .filter((e): e is NavEntry => !!e),
};

/**
 * Returns the ancestor chain for path, from root to the closest registered
 * ancestor. Returns null if path is unregistered. Accepts an optional
 * registry override (used in tests for circular-guard validation).
 *
 * Never throws. Uses a visited-set + depth cap to handle malformed registries.
 */
export function parentChain(
  path: string,
  registry: NavEntry[] = REGISTRY,
): NavEntry[] | null {
  const cleanPath = stripHash(path);

  function findEntry(p: string): NavEntry | undefined {
    return (
      registry.find((e) => e.path === p) ??
      registry.find((e) => matchesPattern(e.path, p))
    );
  }

  const entry = findEntry(cleanPath);
  if (!entry) return null;

  const chain: NavEntry[] = [];
  const visited = new Set<string>();
  let current: NavEntry | undefined = entry;
  const MAX_DEPTH = 20;

  while (current && chain.length < MAX_DEPTH) {
    if (visited.has(current.path)) break; // circular guard
    visited.add(current.path);
    chain.unshift(current);
    if (!current.parent) break;
    current = findEntry(current.parent);
  }

  return chain;
}

/** Strip hash fragment from a path string. */
export function stripHash(path: string): string {
  return path.split("#")[0];
}

/** Returns true if a pattern path (with [param] segments) matches a real path. */
function matchesPattern(pattern: string, real: string): boolean {
  const pp = pattern.split("/");
  const rp = real.split("/");
  if (pp.length !== rp.length) return false;
  return pp.every((part, i) => part.startsWith("[") || part === rp[i]);
}
