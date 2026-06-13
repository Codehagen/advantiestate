"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import {
  Search,
  Handshake,
  ArrowLeftRight,
  Building2,
  TrendingUp,
  Compass,
  MapPin,
  LineChart,
  Map as MapIcon,
  FileText,
  Calculator,
  BookOpen,
  Newspaper,
  Building,
  Users,
  Briefcase,
  Megaphone,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { NavEntry } from "@/lib/navigation";
import { stripHash } from "@/lib/stripHash";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface NavProps {
  groups: Record<GroupId, NavEntry[]>;
}

type GroupId = "tjenester" | "innsikt" | "om-oss";
type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

// Icon per route (lucide). Reference look (icon tile + title + description).
const ICONS: Record<string, IconType> = {
  "/tjenester/verdivurdering": Search,
  "/tjenester/salg": Handshake,
  "/tjenester/transaksjoner": ArrowLeftRight,
  "/tjenester/utleie": Building2,
  "/tjenester/radgivning": TrendingUp,
  "/tjenester/strategisk-radgivning": Compass,
  "/naringsmegler": MapPin,
  "/markedsinnsikt": LineChart,
  "/markedsinnsikt/kart": MapIcon,
  "/markedsrapport": FileText,
  "/verktoy": Calculator,
  "/help": BookOpen,
  "/blog": Newspaper,
  "/om-oss": Building,
  "/personer": Users,
  "/kunder": Briefcase,
  "/karriere": Compass,
  "/presserom": Megaphone,
};

// Short fallback descriptions for entries the registry doesn't describe (om-oss).
const FALLBACK_DESC: Record<string, string> = {
  "/om-oss": "Hvem vi er og hvordan vi jobber.",
  "/personer": "Rådgiverne i Advanti.",
  "/kunder": "Utvalgte gjennomførte oppdrag.",
  "/karriere": "Ledige roller hos oss.",
  "/presserom": "Nyheter og presseressurser.",
};

// Which registry paths appear in each panel's icon grid, in order, plus the
// "see all" link and the featured promo (a single anchor, distinct target so
// it never duplicates a grid link).
const PANELS: Record<
  GroupId,
  {
    items: string[];
    seeAll?: { href: string; label: string };
    promo: {
      href: string;
      eyebrow: string;
      title: string;
      desc: string;
      cta: string;
      img: string;
    };
  }
> = {
  tjenester: {
    items: [
      "/tjenester/utleie",
      "/tjenester/verdivurdering",
      "/tjenester/transaksjoner",
      "/tjenester/radgivning",
      "/tjenester/strategisk-radgivning",
      "/tjenester/salg",
      "/naringsmegler",
    ],
    seeAll: { href: "/tjenester", label: "Se alle tjenester" },
    promo: {
      href: "/markedsinnsikt",
      eyebrow: "Fremtidens eiendomsverdi",
      title: "Innsikt som beveger eiendom.",
      desc: "Vi kombinerer markedsdata, erfaring og teknologi for å gi deg bedre beslutningsgrunnlag.",
      cta: "Les mer",
      img: "/building/auckland-glass-facade.jpg",
    },
  },
  innsikt: {
    items: [
      "/markedsinnsikt",
      "/markedsinnsikt/kart",
      "/markedsrapport",
      "/verktoy",
      "/help",
      "/blog",
    ],
    seeAll: { href: "/markedsinnsikt", label: "Gå til markedsinnsikt" },
    promo: {
      href: "/verktoy/pris-verdivurdering",
      eyebrow: "Verktøy",
      title: "Regn ut verdien.",
      desc: "Bruk kalkulatoren for et raskt, yield-basert verdiestimat på eiendommen.",
      cta: "Prøv kalkulatoren",
      img: "/building/la-skyscraper.jpg",
    },
  },
  "om-oss": {
    items: ["/om-oss", "/personer", "/kunder", "/karriere", "/presserom"],
    promo: {
      href: "/kontakt",
      eyebrow: "Snakk med oss",
      title: "Lokal rådgiver, nasjonalt nettverk.",
      desc: "Ta en uforpliktende prat med teamet om eiendommen din.",
      cta: "Ta kontakt",
      img: "/building/munster-lvm-building.jpg",
    },
  },
};

/**
 * Site navigation — fixed; transparent over a dark hero, solid otherwise.
 *
 * Disclosure (E1A + hover): three centered group labels are <button> triggers
 * with aria-expanded / aria-controls. Panels live in a single contained card
 * shell (rounded, soft shadow) that morphs height to the open group. Reference
 * look: each item is an icon tile + title + description, in a two-column grid
 * beside a featured promo card. Panels stay in the DOM (SSR/crawlable).
 *
 *   POINTER: hover opens + morphs; leaving closes after intent delay (gated to
 *   (hover: hover)). KEYBOARD/CLICK: trigger toggles; Escape closes + returns
 *   focus. Click-outside and link-click close.
 *
 * --nav-h ownership (E7) + transparent/solid sentinel (#hero-sentinel) unchanged.
 */
export function Nav({ groups }: NavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<GroupId | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<GroupId | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Partial<Record<GroupId, HTMLDivElement>>>({});
  const groupBtnRefs = useRef<Partial<Record<GroupId, HTMLButtonElement>>>({});

  const closeTimer = useRef<number | null>(null);
  const canHover = useRef(false);
  const hoverOpened = useRef<GroupId | null>(null);
  useEffect(() => {
    canHover.current =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover)").matches;
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    if (!canHover.current) return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      hoverOpened.current = null;
      setOpenGroup(null);
    }, 140);
  };
  const openByHover = (id: GroupId) => {
    if (!canHover.current) return;
    cancelClose();
    hoverOpened.current = id;
    setOpenGroup((prev) => {
      if (prev !== id) trackEvent("nav_group_open", { group: id });
      return id;
    });
  };

  // ── --nav-h: single writer (E7) ────────────────────────────────────────
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;
    const apply = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${Math.ceil(nav.getBoundingClientRect().height)}px`,
      );
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(nav, { box: "border-box" });
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--nav-h");
    };
  }, []);

  // ── panel card: morph the shell height to the open panel's content ──────
  useIsoLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    if (!openGroup) {
      shell.style.removeProperty("--nav-panel-h");
      return;
    }
    const panel = panelRefs.current[openGroup];
    if (panel) {
      shell.style.setProperty("--nav-panel-h", `${panel.scrollHeight}px`);
    }
  }, [openGroup]);

  // ── transparent/solid sentinel ─────────────────────────────────────────
  useIsoLayoutEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) {
      setScrolled(true);
      return;
    }
    setScrolled(sentinel.getBoundingClientRect().top <= 72);
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(entry.boundingClientRect.top <= 72),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);

  // ── close menus on route change ────────────────────────────────────────
  useEffect(() => {
    setMenuOpen(false);
    hoverOpened.current = null;
    setOpenGroup(null);
    setOpenMobileGroup(null);
  }, [pathname]);

  // ── mobile menu: body scroll lock + Escape ─────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // ── desktop panel: Escape → close + return focus ───────────────────────
  useEffect(() => {
    if (!openGroup) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const group = openGroup;
        cancelClose();
        hoverOpened.current = null;
        setOpenGroup(null);
        groupBtnRefs.current[group]?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openGroup]);

  // ── desktop panel: click outside closes ───────────────────────────────
  useEffect(() => {
    if (!openGroup) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const inNav = navRef.current?.contains(target) ?? false;
      const inShell = shellRef.current?.contains(target) ?? false;
      if (!inNav && !inShell) setOpenGroup(null);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [openGroup]);

  // ── helpers ───────────────────────────────────────────────────────────
  const cleanPath = stripHash(pathname);
  const isLinkActive = (href: string) =>
    cleanPath === href || cleanPath.startsWith(`${href}/`);

  const isGroupActive = (id: GroupId): boolean =>
    (groups[id] ?? []).some(
      (e) => !e.path.includes("[") && isLinkActive(e.path),
    );

  const toggleGroup = (id: GroupId) => {
    cancelClose();
    if (hoverOpened.current === id) {
      hoverOpened.current = null;
      return;
    }
    setOpenGroup((prev) => {
      const next = prev === id ? null : id;
      if (next) trackEvent("nav_group_open", { group: next });
      return next;
    });
  };

  const closePanel = () => {
    cancelClose();
    hoverOpened.current = null;
    setOpenGroup(null);
  };

  // `scrolled` (size change) is driven ONLY by real scroll. `solid` (opaque
  // background) also applies while a dropdown / mobile menu is open — so opening
  // a panel never resizes the bar (no layout shift on hover).
  const navClass = [
    "nav",
    scrolled ? "scrolled" : "",
    scrolled || menuOpen || !!openGroup ? "solid" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const groupBtnCb = useMemo(
    () => ({
      tjenester: (el: HTMLButtonElement | null) => {
        groupBtnRefs.current["tjenester"] = el ?? undefined;
      },
      innsikt: (el: HTMLButtonElement | null) => {
        groupBtnRefs.current["innsikt"] = el ?? undefined;
      },
      "om-oss": (el: HTMLButtonElement | null) => {
        groupBtnRefs.current["om-oss"] = el ?? undefined;
      },
    }),
    [],
  );

  const panelRefCb = useMemo(
    () => ({
      tjenester: (el: HTMLDivElement | null) => {
        panelRefs.current["tjenester"] = el ?? undefined;
      },
      innsikt: (el: HTMLDivElement | null) => {
        panelRefs.current["innsikt"] = el ?? undefined;
      },
      "om-oss": (el: HTMLDivElement | null) => {
        panelRefs.current["om-oss"] = el ?? undefined;
      },
    }),
    [],
  );

  const hoverProps = (id: GroupId) => ({
    onMouseEnter: () => openByHover(id),
    onMouseLeave: scheduleClose,
  });
  const panelHoverProps = {
    onMouseEnter: cancelClose,
    onMouseLeave: scheduleClose,
  };

  const byPath = (id: GroupId, path: string) =>
    groups[id].find((e) => e.path === path);

  // Renders a desktop panel: icon-tile grid + "see all" + featured promo.
  const renderPanel = (id: GroupId) => {
    const panel = PANELS[id];
    return (
      <div className="nav-panel-inner nav-panel-grid">
        <div className="nav-panel-main">
          <ul className="nav-item-grid" onClick={closePanel}>
            {panel.items.map((p) => {
              const e = byPath(id, p);
              if (!e) return null;
              const Icon = ICONS[p];
              const desc = e.description ?? FALLBACK_DESC[p];
              return (
                <li key={p}>
                  <Link
                    prefetch={false}
                    href={e.path}
                    className="nav-item"
                    aria-current={isLinkActive(e.path) ? "page" : undefined}
                  >
                    <span className="nav-item-icon" aria-hidden>
                      {Icon ? <Icon aria-hidden /> : null}
                    </span>
                    <span className="nav-item-text">
                      <span className="nav-item-title">{e.label}</span>
                      {desc && <span className="nav-item-desc">{desc}</span>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {panel.seeAll && (
            <Link
              prefetch={false}
              href={panel.seeAll.href}
              className="nav-panel-seeall"
              aria-current={
                cleanPath === panel.seeAll.href ? "page" : undefined
              }
              onClick={closePanel}
            >
              {panel.seeAll.label} →
            </Link>
          )}
        </div>

        <Link
          prefetch={false}
          href={panel.promo.href}
          className="nav-promo"
          aria-current={isLinkActive(panel.promo.href) ? "page" : undefined}
          onClick={closePanel}
        >
          <span className="nav-promo-eyebrow">{panel.promo.eyebrow}</span>
          <span className="nav-promo-title">{panel.promo.title}</span>
          <span className="nav-promo-desc">{panel.promo.desc}</span>
          <span className="nav-promo-cta">
            {panel.promo.cta} <span aria-hidden>→</span>
          </span>
          <span
            className="nav-promo-img"
            style={{ backgroundImage: `url(${panel.promo.img})` }}
            aria-hidden
          />
        </Link>
      </div>
    );
  };

  return (
    <>
      <nav className={navClass} id="nav" ref={navRef}>
        <Link href="/" className="nav-logo">
          <span className="mark" />
          <span>
            Advanti
            <span style={{ fontStyle: "italic", fontWeight: 300 }}>.</span>
          </span>
          <span className="sub">Estate</span>
        </Link>

        <div className="nav-links">
          <button
            type="button"
            className="nav-group-btn"
            aria-expanded={openGroup === "tjenester"}
            aria-controls="nav-panel-tjenester"
            data-active={isGroupActive("tjenester") ? true : undefined}
            ref={groupBtnCb["tjenester"]}
            onClick={() => toggleGroup("tjenester")}
            {...hoverProps("tjenester")}
          >
            Tjenester
          </button>

          <Link
            href="/eiendommer"
            aria-current={isLinkActive("/eiendommer") ? "page" : undefined}
            onMouseEnter={scheduleClose}
          >
            Eiendommer
          </Link>

          <button
            type="button"
            className="nav-group-btn"
            aria-expanded={openGroup === "innsikt"}
            aria-controls="nav-panel-innsikt"
            data-active={isGroupActive("innsikt") ? true : undefined}
            ref={groupBtnCb["innsikt"]}
            onClick={() => toggleGroup("innsikt")}
            {...hoverProps("innsikt")}
          >
            Innsikt
          </button>

          <button
            type="button"
            className="nav-group-btn"
            aria-expanded={openGroup === "om-oss"}
            aria-controls="nav-panel-om-oss"
            data-active={isGroupActive("om-oss") ? true : undefined}
            ref={groupBtnCb["om-oss"]}
            onClick={() => toggleGroup("om-oss")}
            {...hoverProps("om-oss")}
          >
            Om oss
          </button>

          <Link
            href="/kontakt"
            aria-current={isLinkActive("/kontakt") ? "page" : undefined}
            onMouseEnter={scheduleClose}
          >
            Kontakt
          </Link>
        </div>

        <div className="nav-right">
          <Link
            href="/verktoy/pris-verdivurdering"
            className="nav-cta"
            onClick={() => trackEvent("cta_verdivurdering", { source: "nav" })}
            onMouseEnter={scheduleClose}
          >
            <span>Få verdivurdering</span>
            <span className="arrow">→</span>
          </Link>

          <button
            type="button"
            ref={toggleRef}
            className={menuOpen ? "nav-toggle open" : "nav-toggle"}
            aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={menuOpen}
            aria-controls="nav-mobile"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* DESKTOP PANEL SHELL — contained card, morphs height between groups. */}
      <div
        className={`nav-panel-shell${openGroup ? " open" : ""}`}
        ref={shellRef}
        {...panelHoverProps}
      >
        <div
          id="nav-panel-tjenester"
          className={`nav-panel${openGroup === "tjenester" ? " open" : ""}`}
          ref={panelRefCb["tjenester"]}
          inert={openGroup !== "tjenester"}
        >
          {renderPanel("tjenester")}
        </div>

        <div
          id="nav-panel-innsikt"
          className={`nav-panel${openGroup === "innsikt" ? " open" : ""}`}
          ref={panelRefCb["innsikt"]}
          inert={openGroup !== "innsikt"}
        >
          {renderPanel("innsikt")}
        </div>

        <div
          id="nav-panel-om-oss"
          className={`nav-panel${openGroup === "om-oss" ? " open" : ""}`}
          ref={panelRefCb["om-oss"]}
          inert={openGroup !== "om-oss"}
        >
          {renderPanel("om-oss")}
        </div>
      </div>

      {/* MOBILE MENU (≤780px) — inline accordion (4A). */}
      <div
        id="nav-mobile"
        className={menuOpen ? "nav-mobile open" : "nav-mobile"}
        inert={!menuOpen}
      >
        <div className="nav-mobile-links">
          <MobileGroup
            id="tjenester"
            label="Tjenester"
            isOpen={openMobileGroup === "tjenester"}
            onToggle={() =>
              setOpenMobileGroup((p) =>
                p === "tjenester" ? null : "tjenester",
              )
            }
            isActive={isGroupActive("tjenester")}
            links={[
              {
                href: "/tjenester",
                label: "Alle tjenester",
                active: isLinkActive("/tjenester"),
              },
              ...groups.tjenester
                .filter((e) => e.path !== "/tjenester")
                .map((e) => ({
                  href: e.path,
                  label: e.label,
                  active: isLinkActive(e.path),
                })),
            ]}
            onLinkClick={() => setMenuOpen(false)}
          />

          <Link
            prefetch={false}
            href="/eiendommer"
            aria-current={isLinkActive("/eiendommer") ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Eiendommer
          </Link>

          <MobileGroup
            id="innsikt"
            label="Innsikt"
            isOpen={openMobileGroup === "innsikt"}
            onToggle={() =>
              setOpenMobileGroup((p) => (p === "innsikt" ? null : "innsikt"))
            }
            isActive={isGroupActive("innsikt")}
            links={groups.innsikt.map((e) => ({
              href: e.path,
              label: e.label,
              active: isLinkActive(e.path),
            }))}
            onLinkClick={() => setMenuOpen(false)}
          />

          <MobileGroup
            id="om-oss"
            label="Om oss"
            isOpen={openMobileGroup === "om-oss"}
            onToggle={() =>
              setOpenMobileGroup((p) => (p === "om-oss" ? null : "om-oss"))
            }
            isActive={isGroupActive("om-oss")}
            links={groups["om-oss"].map((e) => ({
              href: e.path,
              label: e.label,
              active: isLinkActive(e.path),
            }))}
            onLinkClick={() => setMenuOpen(false)}
          />

          <Link
            prefetch={false}
            href="/kontakt"
            aria-current={isLinkActive("/kontakt") ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Kontakt
          </Link>
        </div>

        <Link
          prefetch={false}
          href="/verktoy/pris-verdivurdering"
          className="nav-cta nav-mobile-cta"
          onClick={() => {
            setMenuOpen(false);
            trackEvent("cta_verdivurdering", { source: "nav_mobile" });
          }}
        >
          <span>Få verdivurdering</span>
          <span className="arrow">→</span>
        </Link>
      </div>
    </>
  );
}

// ── Mobile group accordion (4A spec) ─────────────────────────────────────────

interface MobileGroupProps {
  id: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
  links: { href: string; label: string; active: boolean }[];
  onLinkClick: () => void;
}

function MobileGroup({
  id,
  label,
  isOpen,
  onToggle,
  isActive,
  links,
  onLinkClick,
}: MobileGroupProps) {
  const childrenId = `nav-mobile-group-${id}`;
  return (
    <div className="nav-mobile-group">
      <button
        type="button"
        className={`nav-mobile-group-btn${isActive ? " active" : ""}`}
        aria-expanded={isOpen}
        aria-controls={childrenId}
        onClick={onToggle}
      >
        {label}
      </button>
      <div
        id={childrenId}
        className={`nav-mobile-group-children${isOpen ? " open" : ""}`}
        inert={!isOpen}
      >
        <div>
          {links.map((link) => (
            <Link
              prefetch={false}
              key={link.href}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              onClick={onLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
