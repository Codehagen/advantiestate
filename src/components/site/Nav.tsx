"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/tjenester", label: "Tjenester" },
  { href: "/markedsinnsikt", label: "Markedsinnsikt" },
  { href: "/blog", label: "Artikler" },
  { href: "/help", label: "Kunnskapssenter" },
  { href: "/personer", label: "Team" },
  { href: "/kontakt", label: "Kontakt" },
];

/**
 * Site navigation — fixed; transparent over a dark hero, solid otherwise.
 *
 *   page WITH a dark hero  → page renders <div id="hero-sentinel" /> at the
 *                            hero's base. Nav stays transparent until the
 *                            sentinel scrolls out of view, then goes solid.
 *   page WITHOUT a hero    → no sentinel in the DOM → Nav is solid immediately.
 *
 * The DOM sentinel is the contract — no props cross the root-layout boundary.
 *
 * Below 780px the inline links collapse into a hamburger that opens a
 * full-screen panel; the nav is forced solid while the panel is open so the
 * close (✕) icon stays legible.
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) {
      setScrolled(true);
      return;
    }
    setScrolled(false);
    const io = new IntersectionObserver(
      // Solid only once the hero's base has scrolled up behind the nav.
      // Reading the sentinel's own `top` (rather than just `isIntersecting`)
      // keeps the nav transparent even when the hero is taller than the
      // viewport — in that case the sentinel sits below the fold, which is
      // "still on the hero", not "scrolled past it".
      ([entry]) => setScrolled(entry.boundingClientRect.top <= 72),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // While the menu is open: lock body scroll and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav className={scrolled || menuOpen ? "nav scrolled" : "nav"} id="nav">
        <Link href="/" className="nav-logo">
          <span className="mark" />
          <span>
            Advanti
            <span style={{ fontStyle: "italic", fontWeight: 300 }}>.</span>
          </span>
          <span className="sub">Estate</span>
        </Link>
        <div className="nav-links">
          {LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                style={active ? { fontWeight: 600 } : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <Link href="/kontakt" className="nav-cta">
          <span>Få verdivurdering</span>
          <span className="arrow">→</span>
        </Link>
        <button
          type="button"
          className={menuOpen ? "nav-toggle open" : "nav-toggle"}
          aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div
        id="nav-mobile"
        className={menuOpen ? "nav-mobile open" : "nav-mobile"}
      >
        <div className="nav-mobile-links">
          {LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <Link
          href="/kontakt"
          className="nav-cta nav-mobile-cta"
          onClick={() => setMenuOpen(false)}
        >
          <span>Få verdivurdering</span>
          <span className="arrow">→</span>
        </Link>
      </div>
    </>
  );
}
