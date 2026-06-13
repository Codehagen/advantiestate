"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { NavEntry } from "@/lib/navigation";
import { stripHash } from "@/lib/stripHash";
import type { CityLink } from "@/lib/navigation";

// useLayoutEffect on the client so the sentinel check runs BEFORE first paint
// (no solid-nav flash on dark-hero pages); useEffect during SSR to keep React
// quiet — the server render never paints anyway.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface NavProps {
  cities: CityLink[];
  groups: Record<GroupId, NavEntry[]>;
}

type GroupId = "tjenester" | "innsikt" | "om-oss";

/**
 * Site navigation — fixed; transparent over a dark hero, solid otherwise.
 *
 * Disclosure model (E1A + hover enhancement):
 *   Three grouped labels (Tjenester, Innsikt, Om oss) are <button> triggers
 *   with aria-expanded / aria-controls pointing at full-width .nav-panel
 *   divs. Panels are ALWAYS in the server HTML (crawlable) and hidden via
 *   CSS + the `inert` attribute when closed. Opening one group closes others.
 *
 *   POINTER: hovering a trigger opens its panel; moving between triggers
 *   morphs the open panel; leaving the trigger-or-panel closes after a short
 *   intent delay. Hover is gated to `(hover: hover)` devices so touch never
 *   gets a sticky hover state.
 *   KEYBOARD/CLICK: the trigger toggles on click/Enter; Escape closes and
 *   returns focus to the trigger. Tab order never auto-opens panels.
 *   Click-outside and link-click also close the panel.
 *
 * --nav-h ownership (E7):
 *   Nav measures its own rendered height via ResizeObserver and writes
 *   --nav-h on document.documentElement. AnalyseportalShell only reads it.
 *
 * Transparent/solid sentinel (unchanged):
 *   page WITH a dark hero → renders <div id="hero-sentinel" /> at hero base.
 *   Nav is transparent until sentinel scrolls out of view, then goes solid.
 *   page WITHOUT a hero → no sentinel → Nav is solid immediately.
 */
export function Nav({ cities, groups }: NavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<GroupId | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<GroupId | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRefs = useRef<Partial<Record<GroupId, HTMLDivElement>>>({});
  const groupBtnRefs = useRef<Partial<Record<GroupId, HTMLButtonElement>>>({});

  // Hover-intent: timer + a (hover: hover) gate so touch never opens on hover.
  const closeTimer = useRef<number | null>(null);
  const canHover = useRef(false);
  // Which group was just opened by hover and not yet click-confirmed. Lets the
  // click that rides along with a hover-open CONFIRM the panel open instead of
  // toggling it shut (Playwright .click() hovers first; real mice do too).
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
        // Math.ceil: a fraction too low lets content peek behind the nav.
        `${Math.ceil(nav.getBoundingClientRect().height)}px`,
      );
    apply();
    const ro = new ResizeObserver(apply);
    // border-box: padding transitions (scrolled/unscrolled) fire content-box
    // observations, which we'd miss with the default content-box mode.
    ro.observe(nav, { box: "border-box" });
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--nav-h");
    };
  }, []);

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
      const inPanel = Object.values(panelRefs.current).some(
        (p) => p?.contains(target),
      );
      if (!inNav && !inPanel) setOpenGroup(null);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [openGroup]);

  // ── helpers ───────────────────────────────────────────────────────────
  const cleanPath = stripHash(pathname);
  const isLinkActive = (href: string) =>
    cleanPath === href || cleanPath.startsWith(`${href}/`);

  // A group is active if any of its non-dynamic entries match the current path.
  const isGroupActive = (id: GroupId): boolean =>
    (groups[id] ?? []).some(
      (e) => !e.path.includes("[") && isLinkActive(e.path),
    );

  const toggleGroup = (id: GroupId) => {
    cancelClose();
    // A click riding along with this group's hover-open confirms it (stay open).
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

  // Force solid nav while any panel or mobile menu is open.
  const navClass = [
    "nav",
    scrolled || menuOpen || !!openGroup ? "scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Stable memoized ref callbacks — identity never changes between renders.
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

  // Hover handlers bound per group (stable closures not required — cheap).
  const hoverProps = (id: GroupId) => ({
    onMouseEnter: () => openByHover(id),
    onMouseLeave: scheduleClose,
  });
  const panelHoverProps = {
    onMouseEnter: cancelClose,
    onMouseLeave: scheduleClose,
  };

  // Tjenester services shown in the grid (parent + næringsmegler rendered apart).
  const tjenesterServices = groups.tjenester.filter(
    (e) => e.path !== "/tjenester" && e.path !== "/naringsmegler",
  );
  const naringsmegler = groups.tjenester.find(
    (e) => e.path === "/naringsmegler",
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
          {/* ── Tjenester group ─────────────────────────────────────────── */}
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

          {/* ── Eiendommer plain link ───────────────────────────────────── */}
          <Link
            href="/eiendommer"
            aria-current={isLinkActive("/eiendommer") ? "page" : undefined}
            onMouseEnter={scheduleClose}
          >
            Eiendommer
          </Link>

          {/* ── Innsikt group ───────────────────────────────────────────── */}
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

          {/* ── Om oss group ────────────────────────────────────────────── */}
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

          {/* ── Kontakt plain link ──────────────────────────────────────── */}
          <Link
            href="/kontakt"
            aria-current={isLinkActive("/kontakt") ? "page" : undefined}
            onMouseEnter={scheduleClose}
          >
            Kontakt
          </Link>
        </div>

        <Link
          href="/verktoy/pris-verdivurdering"
          className="nav-cta"
          onClick={() => trackEvent("cta_verdivurdering", { source: "nav" })}
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
      </nav>

      {/* ──────────────────────────────────────────────────────────────────
          DESKTOP PANELS (always in DOM for SSR/crawlability).
          Hidden via CSS + inert when closed; no `hidden` attr so links
          stay in the initial server HTML for search engines.
          ────────────────────────────────────────────────────────────── */}

      {/* Tjenester panel — services grid + Næringsmegler column */}
      <div
        id="nav-panel-tjenester"
        className={`nav-panel${openGroup === "tjenester" ? " open" : ""}`}
        ref={panelRefCb["tjenester"]}
        inert={openGroup !== "tjenester"}
        {...panelHoverProps}
      >
        <div className="wrap">
          <div className="nav-panel-inner nav-panel-grid">
            {/* Left — services in a two-column grid, parent first */}
            <div className="nav-panel-col nav-panel-col-wide">
              <span className="nav-panel-eyebrow">Tjenester</span>
              <ul
                className="nav-panel-list nav-panel-list-grid"
                onClick={closePanel}
              >
                <li className="nav-panel-parent">
                  <Link
                    prefetch={false}
                    href="/tjenester"
                    aria-current={
                      cleanPath === "/tjenester" ? "page" : undefined
                    }
                  >
                    Alle tjenester
                  </Link>
                </li>
                {tjenesterServices.map((e) => (
                  <li key={e.path}>
                    <Link
                      prefetch={false}
                      href={e.path}
                      aria-current={isLinkActive(e.path) ? "page" : undefined}
                    >
                      {e.label}
                    </Link>
                    {e.description && (
                      <span className="nav-panel-desc">{e.description}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Næringsmegler highlight + all-cities link */}
            {naringsmegler && (
              <div className="nav-panel-col">
                <span className="nav-panel-eyebrow">Lokal tilstedeværelse</span>
                <ul className="nav-panel-list" onClick={closePanel}>
                  <li className="nav-panel-parent">
                    <Link
                      prefetch={false}
                      href={naringsmegler.path}
                      aria-current={
                        isLinkActive(naringsmegler.path) ? "page" : undefined
                      }
                    >
                      {naringsmegler.label}
                    </Link>
                    {naringsmegler.description && (
                      <span className="nav-panel-desc">
                        {naringsmegler.description}
                      </span>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Innsikt panel — two columns: links with descriptions + city list */}
      <div
        id="nav-panel-innsikt"
        className={`nav-panel${openGroup === "innsikt" ? " open" : ""}`}
        ref={panelRefCb["innsikt"]}
        inert={openGroup !== "innsikt"}
        {...panelHoverProps}
      >
        <div className="wrap">
          <div className="nav-panel-inner nav-panel-grid">
            {/* Left column — innsikt links in a two-column grid */}
            <div className="nav-panel-col nav-panel-col-wide">
              <span className="nav-panel-eyebrow">Innsikt</span>
              <ul
                className="nav-panel-list nav-panel-list-grid"
                onClick={closePanel}
              >
                {groups.innsikt.map((e) => (
                  <li
                    key={e.path}
                    className={
                      e.path === "/markedsinnsikt"
                        ? "nav-panel-parent"
                        : undefined
                    }
                  >
                    <Link
                      prefetch={false}
                      href={e.path}
                      aria-current={isLinkActive(e.path) ? "page" : undefined}
                    >
                      {e.label}
                    </Link>
                    {e.description && (
                      <span className="nav-panel-desc">{e.description}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column — byer */}
            <div className="nav-panel-col">
              <span className="nav-panel-eyebrow">Byer</span>
              <div className="nav-panel-cities" onClick={closePanel}>
                {cities.map((city) => (
                  <Link
                    prefetch={false}
                    key={city.slug}
                    href={`/naringsmegler/${city.slug}`}
                    aria-current={
                      isLinkActive(`/naringsmegler/${city.slug}`)
                        ? "page"
                        : undefined
                    }
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
              <Link
                prefetch={false}
                href="/naringsmegler"
                className="nav-panel-all-cities"
                aria-current={
                  cleanPath === "/naringsmegler" ? "page" : undefined
                }
                onClick={closePanel}
              >
                Se alle byer →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Om oss panel — two-column link list (no descriptions in registry) */}
      <div
        id="nav-panel-om-oss"
        className={`nav-panel${openGroup === "om-oss" ? " open" : ""}`}
        ref={panelRefCb["om-oss"]}
        inert={openGroup !== "om-oss"}
        {...panelHoverProps}
      >
        <div className="wrap">
          <div className="nav-panel-inner">
            <div className="nav-panel-col nav-panel-col-wide">
              <span className="nav-panel-eyebrow">Advanti</span>
              <ul
                className="nav-panel-list nav-panel-list-grid"
                onClick={closePanel}
              >
                <li className="nav-panel-parent">
                  <Link
                    prefetch={false}
                    href="/om-oss"
                    aria-current={isLinkActive("/om-oss") ? "page" : undefined}
                  >
                    Om oss
                  </Link>
                </li>
                {groups["om-oss"]
                  .filter((e) => e.path !== "/om-oss")
                  .map((e) => (
                    <li key={e.path}>
                      <Link
                        prefetch={false}
                        href={e.path}
                        aria-current={isLinkActive(e.path) ? "page" : undefined}
                      >
                        {e.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          MOBILE MENU (full-screen overlay, ≤780px)
          Groups are 4A inline-accordion disclosures. Cities are footer
          territory on mobile — not shown here.
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
