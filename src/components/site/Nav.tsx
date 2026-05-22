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
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(true);

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

  return (
    <nav className={scrolled ? "nav scrolled" : "nav"} id="nav">
      <Link href="/" className="nav-logo">
        <span className="mark" />
        <span>
          Advanti<span style={{ fontStyle: "italic", fontWeight: 300 }}>.</span>
        </span>
        <span className="sub">Estate</span>
      </Link>
      <div className="nav-links">
        {LINKS.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
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
    </nav>
  );
}
