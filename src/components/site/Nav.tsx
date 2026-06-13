"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { NavEntry } from "@/lib/navigation";
import { stripHash } from "@/lib/stripHash";

// useLayoutEffect on the client so the sentinel check runs BEFORE first paint
// (no solid-nav flash on dark-hero pages); useEffect during SSR to keep React
// quiet — the server render never paints anyway.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface NavProps {
  groups: Record<GroupId, NavEntry[]>;
}

type GroupId = "tjenester" | "innsikt" | "om-oss";

// Panel columns (editorial direction C): each group's links split into two
// eyebrow-labelled columns by theme. Paths resolve against the registry group
// arrays; an optional "see all" link sits quietly at the column foot.
const PANEL_COLUMNS: Record<
  GroupId,
  { eyebrow: string; paths: string[]; seeAll?: { href: string; label: string } }[]
> = {
  tjenester: [
    {
      eyebrow: "Rådgivning",
      paths: [
        "/tjenester/verdivurdering",
        "/tjenester/transaksjoner",
        "/tjenester/radgivning",
        "/tjenester/strategisk-radgivning",
      ],
      seeAll: { href: "/tjenester", label: "Se alle tjenester" },
    },
    {
      eyebrow: "Megling",
      paths: ["/tjenester/salg", "/tjenester/utleie", "/naringsmegler"],
    },
  ],
  innsikt: [
    {
      eyebrow: "Marked",
      paths: ["/markedsinnsikt", "/markedsinnsikt/kart", "/markedsrapport"],
    },
    {
      eyebrow: "Verktøy og innhold",
      paths: ["/verktoy", "/help", "/blog"],
    },
  ],
  "om-oss": [
    {
      eyebrow: "Selskapet",
      paths: ["/om-oss", "/personer", "/karriere"],
    },
    {
      eyebrow: "Arbeidet",
      paths: ["/kunder", "/presserom"],
    },
  ],
};

/**
 * Site navigation — fixed; transparent over a dark hero, solid otherwise.
 *
 * Disclosure model (E1A + hover): three left-anchored group labels (Tjenester,
 * Innsikt, Om oss) are <button> triggers with aria-expanded / aria-controls.
 * Their panels live in a single FLAT contained card "shell" (hairline, no
 * shadow) that morphs height to the open group. Panels stay in the DOM
 * (SSR/crawlable), cross-fade between groups.
 *
 *   POINTER: hover opens + morphs between groups; leaving closes after an
 *   intent delay (gated to (hover: hover)). KEYBOARD/CLICK: trigger toggles;
 *   Escape closes + returns focus. Click-outside and link-click close.
 *
 * --nav-h ownership (E7): Nav measures its own height and writes --nav-h.
 * Transparent/solid sentinel unchanged (#hero-sentinel).
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

  // Hover-intent: timer + a (hover: hover) gate so touch never opens on hover.
  const closeTimer = useRef<number | null>(null);
  const canHover = useRef(false);
  // Which group was just opened by hover and not yet click-confirmed (so the
  // click riding along with a hover-open confirms it open, not shut).
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

  const navClass = [
    "nav",
    scrolled || menuOpen || !!openGroup ? "scrolled" : "",
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

  // Renders one flat eyebrow-labelled column for a desktop panel.
  const renderPanel = (id: GroupId) => (
    <div className="nav-panel-inner nav-panel-grid">
      {PANEL_COLUMNS[id].map((col) => (
        <div className="nav-panel-col" key={col.eyebrow}>
          <span className="nav-panel-eyebrow">{col.eyebrow}</span>
          <ul className="nav-panel-list" onClick={closePanel}>
            {col.paths.map((p) => {
              const e = byPath(id, p);
              if (!e) return null;
              return (
                <li key={p}>
                  <Link
                    prefetch={false}
                    href={e.path}
                    aria-current={isLinkActive(e.path) ? "page" : undefined}
                  >
                    {e.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {col.seeAll && (
            <Link
              prefetch={false}
              href={col.seeAll.href}
              className="nav-panel-seeall"
              aria-current={cleanPath === col.seeAll.href ? "page" : undefined}
              onClick={closePanel}
            >
              {col.seeAll.label} →
            </Link>
          )}
        </div>
      ))}
    </div>
  );

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

      {/* ──────────────────────────────────────────────────────────────────
          DESKTOP PANEL SHELL — one flat contained card that morphs height.
          Panels always in the DOM (SSR/crawlable), hidden via opacity + inert.
          ────────────────────────────────────────────────────────────── */}
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

      {/* ──────────────────────────────────────────────────────────────────
          MOBILE MENU (full-screen overlay, ≤780px) — inline accordion (4A).
          ────────────────────────────────────────────────────────────── */}
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
        {/* The inner div is required for grid-template-rows: 0fr → 1fr */}
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
